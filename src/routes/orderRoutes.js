import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  addItemToOrderController,
  checkOrderExistsController,
  clearArchiveController,
  completeOrderItemController,
  createOrderController,
  deleteArchivedOrderController,
  deleteOrderController,
  deleteOrderItemController,
  getArchivedOrdersController,
  getOrderItemsController,
  getOrdersController,
  patchOrderController,
  patchOrderItemController,
  rejectOrderItemController,
  startOrderItemController,
} from '../controllers/orderControllers.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  addItemToOrderOrderSchema,
  createOrderSchema,
  patchOrderItemSchema,
  patchOrderSchema,
} from '../validation/orderValidation.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getOrdersController));
router.get('/archive', authenticate, ctrlWrapper(getArchivedOrdersController));

router.delete(
  '/archive',
  authenticate,
  checkRole('admin'),
  ctrlWrapper(clearArchiveController),
);

router.delete(
  '/archive/:orderId',
  authenticate,
  checkRole('admin'),
  isValidId('orderId'),
  ctrlWrapper(deleteArchivedOrderController),
);

router.get(
  '/check-ep/:ep',
  authenticate,
  ctrlWrapper(checkOrderExistsController),
);
router.post(
  '/',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  validateBody(createOrderSchema),
  ctrlWrapper(createOrderController),
);
router.patch(
  '/:orderId',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  isValidId('orderId'),
  validateBody(patchOrderSchema),
  ctrlWrapper(patchOrderController),
);
router.post(
  '/:orderId/items',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  isValidId('orderId'),
  validateBody(addItemToOrderOrderSchema),
  ctrlWrapper(addItemToOrderController),
);
router.delete(
  '/:orderId',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  isValidId('orderId'),
  ctrlWrapper(deleteOrderController),
);
router.get(
  '/:orderId/items',
  authenticate,
  isValidId('orderId'),
  ctrlWrapper(getOrderItemsController),
);
router.patch(
  '/:orderId/items/:itemId',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  isValidId('orderId'),
  isValidId('itemId'),
  validateBody(patchOrderItemSchema),
  ctrlWrapper(patchOrderItemController),
);
router.delete(
  '/:orderId/items/:itemId',
  authenticate,
  checkRole('hardening', 'assembly', 'quality', 'logistics'),
  isValidId('orderId'),
  isValidId('itemId'),
  ctrlWrapper(deleteOrderItemController),
);

router.patch(
  '/:orderId/items/:itemId/start',
  authenticate,
  checkRole('cutting'),
  isValidId('orderId'),
  isValidId('itemId'),
  ctrlWrapper(startOrderItemController),
);

router.patch(
  '/:orderId/items/:itemId/complete',
  authenticate,
  checkRole('assembly'),
  isValidId('orderId'),
  isValidId('itemId'),
  ctrlWrapper(completeOrderItemController),
);

router.patch(
  '/:orderId/items/:itemId/reject',
  authenticate,
  checkRole('assembly'),
  isValidId('orderId'),
  isValidId('itemId'),
  ctrlWrapper(rejectOrderItemController),
);

export default router;
