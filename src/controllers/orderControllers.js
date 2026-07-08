import {
  addItemToOrderService,
  checkOrderExistsService,
  clearArchiveService,
  completeOrderItemService,
  createOrderService,
  deleteArchivedOrderService,
  deleteOrderItemService,
  deleteOrderService,
  getOrderItemsService,
  getOrdersService,
  patchOrderItemService,
  patchOrderService,
  rejectOrderItemService,
  startOrderItemService,
} from '../services/orderServices.js';
import { parseOrderFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getOrdersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ['ep', 'client']);
  const filter = parseOrderFilterParams(req.query);

  filter.status = { $ne: 'completed' };

  const orders = await getOrdersService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    dateField: 'createdAt',
    defaultRangeDays: 1,
  });

  res.status(200).json({
    message: 'Orders found successfully!',
    data: orders,
  });
};

export const getArchivedOrdersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ['ep', 'client']);
  const filter = parseOrderFilterParams(req.query);

  filter.status = 'completed';

  const orders = await getOrdersService({
    page,
    perPage,
    sortBy: sortBy ?? 'updatedAt',
    sortOrder: sortOrder ?? 'desc',
    filter,
    dateField: 'updatedAt',
    defaultRangeDays: 7,
  });

  res
    .status(200)
    .json({ message: 'Archived orders found successfully!', data: orders });
};

export const checkOrderExistsController = async (req, res) => {
  const { ep } = req.params;
  const checkedOrder = await checkOrderExistsService(ep);

  res.status(200).json({
    message: 'Order checked successfully!',
    data: checkedOrder,
  });
};

export const createOrderController = async (req, res) => {
  const { _id: userId, role, location } = req.user;
  const { order } = await createOrderService(req.body, userId, role, location);

  res.status(201).json({
    message: 'New order created successfully!',
    data: { order },
  });
};

export const patchOrderController = async (req, res) => {
  const { orderId } = req.params;

  const updatedOrder = await patchOrderService(orderId, req.body, req.user);

  res.status(200).json({
    message: 'Order updated successfully!',
    data: { updatedOrder },
  });
};

export const addItemToOrderController = async (req, res) => {
  const { orderId } = req.params;

  const createdItem = await addItemToOrderService(orderId, req.body, req.user);

  res.status(201).json({
    message: 'New item added successfully!',
    data: { createdItem },
  });
};

export const deleteOrderController = async (req, res) => {
  const { orderId } = req.params;

  await deleteOrderService(orderId, req.user);

  res.status(204).end();
};

export const getOrderItemsController = async (req, res) => {
  const { orderId } = req.params;

  const items = await getOrderItemsService(orderId);

  res.status(200).json({
    message: 'Order items found successfully!',
    data: { items },
  });
};

export const patchOrderItemController = async (req, res) => {
  const { orderId, itemId } = req.params;

  const updatedItem = await patchOrderItemService(
    orderId,
    itemId,
    req.body,
    req.user,
  );

  res.status(200).json({
    message: 'Order item updated successfully!',
    data: { updatedItem },
  });
};

export const deleteOrderItemController = async (req, res) => {
  const { orderId, itemId } = req.params;
  const result = await deleteOrderItemService(orderId, itemId, req.user);
  res.status(200).json({
    message: 'Item deleted successfully!',
    data: result,
  });
};

export const startOrderItemController = async (req, res) => {
  const { orderId, itemId } = req.params;

  const updatedItem = await startOrderItemService(orderId, itemId, req.user);

  res.status(200).json({
    message: 'Item started successfully!',
    data: { updatedItem },
  });
};

export const completeOrderItemController = async (req, res) => {
  const { orderId, itemId } = req.params;

  const updatedItem = await completeOrderItemService(orderId, itemId, req.user);

  res.status(200).json({
    message: 'Item completed successfully!',
    data: { updatedItem },
  });
};

export const rejectOrderItemController = async (req, res) => {
  const { orderId, itemId } = req.params;

  const updatedItem = await rejectOrderItemService(orderId, itemId, req.user);

  res.status(200).json({
    message: 'Item rejected successfully!',
    data: { updatedItem },
  });
};

export const clearArchiveController = async (req, res) => {
  const result = await clearArchiveService();

  res.status(200).json({
    message:
      result.deletedOrders > 0
        ? 'Archive cleared successfully!'
        : 'Archive is already empty.',
    data: result,
  });
};

export const deleteArchivedOrderController = async (req, res) => {
  const { orderId } = req.params;
  const result = await deleteArchivedOrderService(orderId);

  res.status(200).json({
    message: 'Order deleted successfully!',
    data: result,
  });
};
