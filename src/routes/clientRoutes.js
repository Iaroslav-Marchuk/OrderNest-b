import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

import { clientSchema } from '../validation/clientValidation.js';
import {
  addNewClientController,
  deleteClientController,
  getAllClientsController,
  getClientsController,
  patchClientController,
} from '../controllers/clientControllers.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getClientsController));

router.get('/all', authenticate, ctrlWrapper(getAllClientsController));

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  validateBody(clientSchema),
  ctrlWrapper(addNewClientController),
);

router.patch(
  '/:clientId',
  authenticate,
  checkRole('admin'),
  isValidId('clientId'),
  validateBody(clientSchema),
  ctrlWrapper(patchClientController),
);

router.delete(
  '/:clientId',
  authenticate,
  checkRole('admin'),
  isValidId('clientId'),
  ctrlWrapper(deleteClientController),
);

export default router;
