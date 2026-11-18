import { Router } from 'express';
import * as quizController from '../../controllers/quiz.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { startQuizSchema, submitQuizSchema } from '../../validators/quiz.validator.js';

const router = Router();

// Public Quiz Endpoints (SRS Section 12.4)
router.get('/mcq/:chapterSlug', quizController.getChapterMcq);
router.post('/quiz/start', validate(startQuizSchema), quizController.startQuiz);
router.post('/quiz/submit', validate(submitQuizSchema), quizController.submitQuiz);
router.get('/quiz/result/:attemptId', quizController.getQuizResult);

export default router;