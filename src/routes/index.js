import { Router } from 'express';

import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import clientRouter from './clientRoutes.js';
import glassCategoryRouter from './glassCategoryRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/clients', clientRouter);
router.use('/glassCategories', glassCategoryRouter);

export default router;
