import createHttpError from 'http-errors';

import {
  MIN_DAYS_BEFORE_MANUAL_DELETE,
  SORT_ORDER,
  STATUSES,
} from '../constants/constants.js';
import { OrdersCollection } from '../db/models/orderModel.js';
import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { OrderItemsCollection } from '../db/models/orderItemModel.js';
import { getNextStatus } from '../utils/getNextStatus.js';

export const getOrdersService = async ({
  page = 1,
  perPage = 20,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
  dateField = 'createdAt',
  defaultRangeDays = 1,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (filter.ep) mongoFilter.ep = Number(filter.ep);
  if (filter.client) mongoFilter.client = filter.client;
  if (filter.status) mongoFilter.status = filter.status;
  if (filter.location) mongoFilter.location = filter.location;

  if (!filter.ep && !filter.client) {
    if (filter.date) {
      const start = new Date(`${filter.date}T00:00:00.000Z`);
      const end = new Date(`${filter.date}T23:59:59.999Z`);
      mongoFilter[dateField] = { $gte: start, $lte: end };
    } else {
      const end = new Date();
      end.setUTCHours(23, 59, 59, 999);
      const start = new Date();
      start.setUTCDate(start.getUTCDate() - (defaultRangeDays - 1));
      start.setUTCHours(0, 0, 0, 0);
      mongoFilter[dateField] = { $gte: start, $lte: end };
    }
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
  const { items, ...orderData } = payload;
  const orderLocation = role === 'assembly' ? location : role;

  const createdItems = await OrderItemsCollection.insertMany(items);
  const itemIds = createdItems.map((item) => item._id);

  const newOrder = await OrdersCollection.create({
    ...orderData,
    owner: userId,
    location: orderLocation,
    items: itemIds,
  });

  return { order: newOrder };
};

export const patchOrderService = async (orderId, updateData, currentUser) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  if (existOrder.status !== 'created') {
    throw createHttpError(
      403,
      "Can't edit order that already started production",
    );
  }

  if (existOrder.owner.toString() !== currentUser._id.toString()) {
    throw createHttpError(403, 'You can update only your own orders!');
  }

  const updatedOrder = await OrdersCollection.findByIdAndUpdate(
    orderId,
    updateData,
    { new: true, runValidators: true },
  );
  return updatedOrder;
};

export const addItemToOrderService = async (orderId, newItem, currentUser) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  if (existOrder.status !== 'created') {
    throw createHttpError(
      403,
      "Can't add items to an order that already started production",
    );
  }

  if (existOrder.owner.toString() !== currentUser._id.toString()) {
    throw createHttpError(403, 'You can add new item only to your own orders!');
  }

  const createdItem = await OrderItemsCollection.create(newItem);

  await OrdersCollection.findByIdAndUpdate(orderId, {
    $push: { items: createdItem._id },
  });

  return createdItem;
};

export const deleteOrderService = async (orderId, currentUser) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  if (existOrder.status !== 'created') {
    throw createHttpError(
      403,
      "Can't delete order that already started production",
    );
  }

  if (existOrder.owner.toString() !== currentUser._id.toString()) {
    throw createHttpError(403, 'You can delete only your own orders!');
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

    .populate('type', 'label temper')
    .lean();

  return items;
};

export const patchOrderItemService = async (
  orderId,
  itemId,
  updateData,
  currentUser,
) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found');

  if (existOrder.status !== 'created') {
    throw createHttpError(
      403,
      "Can't edit items in an order that already started production",
    );
  }

  if (existOrder.owner.toString() !== currentUser._id.toString()) {
    throw createHttpError(403, 'You can update only your own orders!');
  }

  const updatedItem = await OrderItemsCollection.findByIdAndUpdate(
    itemId,
    updateData,
    { new: true, runValidators: true },
  );

  return updatedItem;
};

export const deleteOrderItemService = async (orderId, itemId, currentUser) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found');

  if (existOrder.status !== 'created') {
    throw createHttpError(
      403,
      "Can't delete items from an order that already started production",
    );
  }

  if (existOrder.owner.toString() !== currentUser._id.toString()) {
    throw createHttpError(403, 'You can delete only your own order items!');
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

export const updateOrderItemStatusService = async (
  orderId,
  itemId,
  status,
  currentUser,
) => {
  const existOrder = await OrdersCollection.findById(orderId);
  if (!existOrder) throw createHttpError(404, 'Order not found!');

  const existItem = await OrderItemsCollection.findById(itemId);
  if (!existItem) throw createHttpError(404, 'Item not found!');

  if (!STATUSES.includes(status)) {
    throw createHttpError(400, 'Invalid status value!');
  }

  const expectedNext = getNextStatus(existItem.status);
  if (status !== expectedNext) {
    throw createHttpError(
      400,
      `Cannot change status from ${existItem.status} to ${status}!`,
    );
  }

  if (status === 'in_progress' && currentUser.role !== 'cutting') {
    throw createHttpError(403, 'Only cutting can start this item!');
  }

  if (status === 'completed' && currentUser.role !== 'assembly') {
    throw createHttpError(403, 'Only assembly can complete this item!');
  }

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

  const orderUpdate = { status: newOrderStatus };
  orderUpdate.completedAt = newOrderStatus === 'completed' ? new Date() : null;

  await OrdersCollection.findByIdAndUpdate(orderId, { status: newOrderStatus });

  return updatedItem;
};

export const clearArchiveService = async () => {
  const orders = await OrdersCollection.find({ status: 'completed' })
    .select('_id items')
    .lean();

  if (orders.length === 0) {
    return { deletedOrders: 0, deletedItems: 0 };
  }

  const orderIds = orders.map((order) => order._id);
  const itemIds = orders.flatMap((order) => order.items);

  const itemsResult = await OrderItemsCollection.deleteMany({
    _id: { $in: itemIds },
  });
  const ordersResult = await OrdersCollection.deleteMany({
    _id: { $in: orderIds },
  });

  return {
    deletedOrders: ordersResult.deletedCount,
    deletedItems: itemsResult.deletedCount,
  };
};

export const deleteArchivedOrderService = async (orderId) => {
  const existOrder = await OrdersCollection.findById(orderId);

  if (!existOrder) {
    throw createHttpError(404, 'Order not found!');
  }

  if (existOrder.status !== 'completed') {
    throw createHttpError(
      403,
      'Only completed orders can be deleted from archive',
    );
  }

  const daysSinceCompleted =
    (Date.now() - existOrder.completedAt.getTime()) / (24 * 60 * 60 * 1000);

  if (daysSinceCompleted < MIN_DAYS_BEFORE_MANUAL_DELETE) {
    throw createHttpError(
      403,
      `Order can only be deleted ${MIN_DAYS_BEFORE_MANUAL_DELETE} days after completion (currently ${Math.floor(daysSinceCompleted)} days)`,
    );
  }

  await OrderItemsCollection.deleteMany({ _id: { $in: existOrder.items } });
  await OrdersCollection.findByIdAndDelete(orderId);

  return existOrder;
};
