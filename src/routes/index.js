import { Router } from 'express';

import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import clientRouter from './clientRoutes.js';
import glassCategoryRouter from './glassCategoryRoutes.js';
import glassTypeRouter from './glassTypeRouter.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/clients', clientRouter);
router.use('/glassCategories', glassCategoryRouter);
router.use('/glassTypes', glassTypeRouter);

export default router;
