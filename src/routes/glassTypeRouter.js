import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';
import {
  addNewGlassTypeController,
  deleteGlassTypeController,
  getAllGlassTypesController,
  patchGlassTypeController,
} from '../controllers/glassTypeControllers.js';
import {
  addNewGlassTypeSchema,
  patchGlassTypeSchema,
} from '../validation/glassTypeValidation.js';

const router = Router();

router.get(
  '/',
  authenticate,
  checkRole('admin'),
  ctrlWrapper(getAllGlassTypesController),
);

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  validateBody(addNewGlassTypeSchema),
  ctrlWrapper(addNewGlassTypeController),
);

router.patch(
  '/:glassTypeId',
  authenticate,
  checkRole('admin'),
  isValidId('glassTypeId'),
  validateBody(patchGlassTypeSchema),
  ctrlWrapper(patchGlassTypeController),
);

router.delete(
  '/:glassTypeId',
  authenticate,
  checkRole('admin'),
  isValidId('glassTypeId'),
  ctrlWrapper(deleteGlassTypeController),
);

export default router;
