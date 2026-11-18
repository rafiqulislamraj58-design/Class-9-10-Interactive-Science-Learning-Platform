import { Router } from 'express';
import healthRoutes from './health.routes.js';
import publicRoutes from './public.routes.js';
import quizRoutes from './quiz.routes.js';
import dailyTestRoutes from './dailyTest.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/', publicRoutes);
router.use('/', quizRoutes);
router.use('/daily-test', dailyTestRoutes);
router.use('/admin', adminRoutes);

export default router;