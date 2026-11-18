import * as quizService from '../services/quiz.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createBulkMcq = asyncHandler(async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body : req.body.questions;
  const data = await quizService.createBulkQuestions(payload);
  return sendSuccess(res, {
    statusCode: 201,
    message: `${data.insertedCount} MCQ questions created successfully`,
    data,
  });
});

export const updateMcq = asyncHandler(async (req, res) => {
  const data = await quizService.updateQuestionById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'MCQ question updated successfully',
    data,
  });
});

export const getChapterMcq = asyncHandler(async (req, res) => {
  const { topicId, difficulty } = req.query;
  const data = await quizService.getPublicQuestionsByChapter(req.params.chapterSlug, {
    topicId,
    difficulty,
  });
  return sendSuccess(res, {
    message: 'Chapter MCQs fetched successfully (answers hidden)',
    data,
  });
});

export const startQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.startQuizAttempt(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Quiz started successfully',
    data,
  });
});

export const submitQuiz = asyncHandler(async (req, res) => {
  const data = await quizService.submitQuizAttempt(req.body);
  return sendSuccess(res, {
    message: 'Quiz evaluated successfully',
    data,
  });
});

export const getQuizResult = asyncHandler(async (req, res) => {
  const data = await quizService.getQuizResultByAttemptId(req.params.attemptId);
  return sendSuccess(res, {
    message: 'Quiz result fetched successfully',
    data,
  });
});