import {
  addItemToOrderService,
  checkOrderExistsService,
  createOrderService,
  deleteOrderItemService,
  deleteOrderService,
  getOrderItemsService,
  getOrdersService,
  patchOrderItemService,
  patchOrderService,
  updateOrderItemStatusService,
} from '../services/orderServices.js';
import { parseOrderFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';

export const getOrdersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query, ['ep', 'client']);
  const filter = parseOrderFilterParams(req.query);

  const orders = await getOrdersService({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.status(200).json({
    message: 'Orders found successfully!',
    data: orders,
  });
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

export const updateOrderItemStatusController = async (req, res) => {
  const { orderId, itemId } = req.params;
  const { status } = req.body;

  const updatedItem = await updateOrderItemStatusService(
    orderId,
    itemId,
    status,
    req.user,
  );

  res.status(200).json({
    message: 'Order item status updated successfully!',
    data: { updatedItem },
  });
};
