import { Router } from 'express';
import * as dailyTestController from '../../controllers/dailyTest.controller.js';

const router = Router();

router.get('/', dailyTestController.getTodayTest);
router.get('/:date', dailyTestController.getTestByDate);
router.post('/start', dailyTestController.startDailyTest);
router.post('/submit', dailyTestController.submitDailyTest);

export default router;