import { Router } from 'express';

import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import clientRouter from './clientRoutes.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/clients', clientRouter);

export default router;
