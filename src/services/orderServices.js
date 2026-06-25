import createHttpError from 'http-errors';

import { SORT_ORDER } from '../constants/constants.js';
import { OrdersCollection } from '../db/models/orderModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { OrderItemsCollection } from '../db/models/orderItemModel.js';

export const getOrdersService = async ({
  page = 1,
  perPage = 20,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (filter.ep) mongoFilter.ep = Number(filter.ep);
  if (filter.client) mongoFilter.client = filter.client;
  if (filter.status) mongoFilter.status = filter.status;
  if (filter.location) mongoFilter.location = filter.location;

  if (!filter.ep && !filter.client) {
    const dateStr = filter.date || new Date().toISOString().split('T')[0];
    const start = new Date(dateStr);
    start.setHours(0, 0, 0, 0);
    const end = new Date(dateStr);
    end.setHours(23, 59, 59, 999);
    mongoFilter.createdAt = { $gte: start, $lte: end };
  }

  const ordersCount = await OrdersCollection.countDocuments(mongoFilter);

  const orders = await OrdersCollection.find(mongoFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate('client', 'name')
    .populate('owner', 'name role')
    .populate('items', 'status')
    .lean();

  const ordersWithCount = orders.map((order) => ({
    ...order,
    itemsPendingCount: order.items.filter((item) => item.status !== 'completed')
      .length,
    itemsCount: order.items.length,
  }));

  const paginationData = calculatePaginationData(ordersCount, page, perPage);

  return { orders: ordersWithCount, ...paginationData };
};

export const checkOrderExistsService = async (ep) => {
  const orders = await OrdersCollection.find({ ep })
    .populate('client', 'name')
    .populate('owner', 'name')
    .select('ep location status createdAt client owner')
    .lean();

  if (orders.length > 0) return { exists: true, orders };
  return { exists: false };
};

export const createOrderService = async (payload, userId, role, location) => {
  const { itemsData, ...orderData } = payload;
  const orderLocation = role === 'assembly' ? location : role;

  const createdItems = await OrderItemsCollection.insertMany(itemsData);
  const itemIds = createdItems.map((item) => item._id);

  const newOrder = await OrdersCollection.create({
    ...orderData,
    owner: userId,
    location: orderLocation,
    items: itemIds,
  });

  return { order: newOrder };
};

export const patchOrderService = async (orderId, updateData) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const hasActiveItems = await OrderItemsCollection.exists({
    _id: { $in: existOrder.items },
    status: { $in: ['in_progress', 'completed'] },
  });

  if (hasActiveItems)
    throw createHttpError(
      403,
      "Can't edit order with item status 'In progress' or 'Completed'",
    );

  const updatedOrder = await OrdersCollection.findByIdAndUpdate(
    orderId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  return updatedOrder;
};

export const addItemToOrderService = async (orderId, newItem) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const createdItem = await OrderItemsCollection.create(newItem);

  await OrdersCollection.findByIdAndUpdate(orderId, {
    $push: { items: createdItem._id },
  });

  return createdItem;
};

export const deleteOrderService = async (orderId) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) {
    throw createHttpError(404, 'Order not found!');
  }
  await OrderItemsCollection.deleteMany({ _id: { $in: existOrder.items } });
  await OrdersCollection.findByIdAndDelete(orderId);
  return existOrder;
};

export const getOrderItemsService = async (orderId) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const items = await OrderItemsCollection.find({
    _id: { $in: existOrder.items },
  })

    .populate('type', 'label')
    .lean();

  return items;
};

export const patchOrderItemService = async (orderId, itemId, updateData) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found');

  if (existItem.status !== 'created') {
    throw createHttpError(
      403,
      "Can't edit item with status other than 'Created'",
    );
  }

  const updatedItem = await OrderItemsCollection.findByIdAndUpdate(
    itemId,
    updateData,
    { new: true, runValidators: true },
  );

  return updatedItem;
};

export const deleteOrderItemService = async (orderId, itemId) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found');

  if (existItem.status !== 'created') {
    throw createHttpError(
      403,
      "Can't edit item with status other than 'Created'",
    );
  }

  await OrderItemsCollection.findByIdAndDelete(itemId);

  if (existOrder.items.length === 1) {
    await OrdersCollection.findByIdAndDelete(orderId);
    return { orderDeleted: true, deletedItemId: itemId };
  }

  const updatedOrder = await OrdersCollection.findByIdAndUpdate(
    orderId,
    { $pull: { items: itemId } },
    { new: true, runValidators: true },
  );

  return { updatedOrder, deletedItemId: itemId };
};

export const updateOrderItemStatusService = async (orderId, itemId, status) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found!');

  const updatedItem = await OrderItemsCollection.findByIdAndUpdate(
    itemId,
    { status },
    { new: true, runValidators: true },
  );

  const allItems = await OrderItemsCollection.find({
    _id: { $in: existOrder.items },
  });

  const itemsWithUpdatedStatus = allItems.map((item) =>
    item._id.toString() === itemId ? { ...item.toObject(), status } : item,
  );

  const allCompleted = itemsWithUpdatedStatus.every(
    (item) => item.status === 'completed',
  );
  const anyInProgress = itemsWithUpdatedStatus.some(
    (item) => item.status === 'in_progress' || item.status === 'completed',
  );
  const newOrderStatus = allCompleted
    ? 'completed'
    : anyInProgress
      ? 'in_progress'
      : 'created';

  await OrdersCollection.findByIdAndUpdate(orderId, { status: newOrderStatus });

  return updatedItem;
};
