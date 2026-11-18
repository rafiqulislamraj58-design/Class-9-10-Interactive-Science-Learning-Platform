import * as lessonService from '../services/lesson.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createLesson = asyncHandler(async (req, res) => {
  const data = await lessonService.createLesson(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Lesson created successfully',
    data,
  });
});

export const getTopicLessons = asyncHandler(async (req, res) => {
  const data = await lessonService.getLessonsByTopicIdentifier(req.params.id);
  return sendSuccess(res, {
    message: 'Topic lessons fetched successfully',
    data,
  });
});

export const updateLesson = asyncHandler(async (req, res) => {
  const data = await lessonService.updateLessonById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Lesson updated successfully',
    data,
  });
});