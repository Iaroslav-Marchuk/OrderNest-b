import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  patchUserController,
  resetUserPasswordController,
} from '../controllers/userControllers.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createUserSchema,
  patchUserSchema,
  resetUserPasswordSchema,
} from '../validation/userValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.get(
  '/',
  authenticate,
  checkRole('admin'),
  ctrlWrapper(getAllUsersController),
);

router.get(
  '/:userId',
  authenticate,
  checkRole('admin'),
  isValidId('userId'),
  ctrlWrapper(getUserByIdController),
);

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  validateBody(createUserSchema),
  ctrlWrapper(createUserController),
);

router.patch(
  '/:userId',
  authenticate,
  checkRole('admin'),
  isValidId('userId'),
  validateBody(patchUserSchema),
  ctrlWrapper(patchUserController),
);

router.patch(
  '/:userId/password',
  authenticate,
  checkRole('admin'),
  isValidId('userId'),
  validateBody(resetUserPasswordSchema),
  ctrlWrapper(resetUserPasswordController),
);

router.delete(
  '/:userId',
  authenticate,
  checkRole('admin'),
  isValidId('userId'),
  ctrlWrapper(deleteUserController),
);

export default router;
