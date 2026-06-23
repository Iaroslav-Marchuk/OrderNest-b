import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

import {
  addNewClientController,
  deleteClientController,
  getAllClientsController,
  getClientsListController,
  patchClientController,
} from '../controllers/clientControllers.js';
import { clientSchema } from '../validation/clientValidation.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getAllClientsController));

router.get('/list', authenticate, ctrlWrapper(getClientsListController));

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
