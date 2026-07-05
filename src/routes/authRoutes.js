import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  changeLocationSchema,
  changePasswordSchema,
  loginUserSchema,
} from '../validation/authValidation.js';
import {
  changeLocationController,
  changePasswordController,
  getCurrentUserController,
  loginUserController,
  logoutUserController,
  refreshSessionController,
} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.get('/currentUser', authenticate, ctrlWrapper(getCurrentUserController));

router.patch(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  ctrlWrapper(changePasswordController),
);

router.patch(
  '/setLocation',
  authenticate,
  validateBody(changeLocationSchema),
  ctrlWrapper(changeLocationController),
);

export default router;
