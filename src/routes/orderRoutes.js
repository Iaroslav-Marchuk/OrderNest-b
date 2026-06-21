import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addItemToOrderController,
  checkOrderExistsController,
  createOrderController,
  deleteOrderController,
  deleteOrderItemController,
  getAllOrdersController,
  getOrderItemsController,
  patchOrderController,
  patchOrderItemController,
  updateOrderItemStatusController,
} from '../controllers/orderControllers.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addItemToOrderOrderSchema,
  createOrderSchema,
  patchOrderItemSchema,
  patchOrderSchema,
  updateOrderItemStatusSchema,
} from '../validation/orderValidation.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getAllOrdersController));

router.get(
  '/check-ep/:ep',
  authenticate,
  ctrlWrapper(checkOrderExistsController),
);

router.post(
  '/',
  authenticate,
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);

router.patch(
  '/:orderId',
  authenticate,
  isValidId('orderId'),
  validateBody(patchOrderSchema),
  ctrlWrapper(patchOrderController),
);

router.post(
  '/:orderId',
  authenticate,
  isValidId('orderId'),
  validateBody(addItemToOrderOrderSchema),
  ctrlWrapper(addItemToOrderController),
);

router.delete(
  '/:orderId',
  authenticate,
  isValidId('orderId'),
  ctrlWrapper(deleteOrderController),
);

router.get(
  '/:orderId',
  authenticate,
  isValidId('orderId'),
  ctrlWrapper(getOrderItemsController),
);

router.patch(
  '/:orderId/:itemId',
  authenticate,
  isValidId('orderId'),
  isValidId('itemId'),
  validateBody(patchOrderItemSchema),
  ctrlWrapper(patchOrderItemController),
);

router.delete(
  '/:orderId/:itemId',
  authenticate,
  isValidId('orderId'),
  isValidId('itemId'),
  ctrlWrapper(deleteOrderItemController),
);

router.patch(
  '/:orderId/:itemId/status',
  authenticate,
  isValidId('orderId'),
  isValidId('itemId'),
  validateBody(updateOrderItemStatusSchema),
  ctrlWrapper(updateOrderItemStatusController),
);
