import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

import {
  addNewGlassCategoryController,
  deleteGlassCategoryController,
  getAllGlassCategoriesController,
  getGlassCategoriesController,
  patchGlassCategoryController,
} from '../controllers/glassCategoryControllers.js';
import {
  addNewGlassCategorySchema,
  patchGlassCategorySchema,
} from '../validation/glassCategoryValidation.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getGlassCategoriesController));

router.get('/all', authenticate, ctrlWrapper(getAllGlassCategoriesController));

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  validateBody(addNewGlassCategorySchema),
  ctrlWrapper(addNewGlassCategoryController),
);

router.patch(
  '/:glassCategoryId',
  authenticate,
  checkRole('admin'),
  isValidId('glassCategoryId'),
  validateBody(patchGlassCategorySchema),
  ctrlWrapper(patchGlassCategoryController),
);

router.delete(
  '/:glassCategoryId',
  authenticate,
  checkRole('admin'),
  isValidId('glassCategoryId'),
  ctrlWrapper(deleteGlassCategoryController),
);

export default router;
