import authRoute from './authRoutes.js';
import urlRoute from './urlRoutes.js';
import express from 'express';

const router = express.Router();

router.use('/auth', authRoute);
router.use('/url', urlRoute);

export default router;