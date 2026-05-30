import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  changeUserPasswordController,
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  patchUserController,
} from '../controllers/userControllers.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  changeUserPasswordSchema,
  createUserSchema,
  patchUserSchema,
} from '../validation/userValidation.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.get(
  '/',
  checkRole('admin'),
  authenticate,
  ctrlWrapper(getAllUsersController),
);

router.get(
  '/:userId',
  authenticate,
  checkRole('admin'),
  isValidId,
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
  isValidId,
  validateBody(patchUserSchema),
  ctrlWrapper(patchUserController),
);

router.patch(
  '/:userId/password',
  authenticate,
  checkRole('admin'),
  isValidId,
  validateBody(changeUserPasswordSchema),
  ctrlWrapper(changeUserPasswordController),
);

router.delete(
  '/:userId',
  authenticate,
  checkRole('admin'),
  isValidId,
  ctrlWrapper(deleteUserController),
);

export default router;
