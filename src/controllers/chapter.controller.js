import * as chapterService from '../services/chapter.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createChapter = asyncHandler(async (req, res) => {
  const data = await chapterService.createChapter(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Chapter created successfully',
    data,
  });
});

export const getChapters = asyncHandler(async (req, res) => {
  const { subjectId, subject } = req.query;
  const data = await chapterService.getAllPublicChapters({ subjectId, subject });
  return sendSuccess(res, {
    message: 'Chapters fetched successfully',
    data,
  });
});

export const getChapterDetails = asyncHandler(async (req, res) => {
  const data = await chapterService.getChapterBySlugOrId(req.params.slug);
  return sendSuccess(res, {
    message: 'Chapter details fetched successfully',
    data,
  });
});

export const updateChapter = asyncHandler(async (req, res) => {
  const data = await chapterService.updateChapterById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Chapter updated successfully',
    data,
  });
});

export const deleteChapter = asyncHandler(async (req, res) => {
  await chapterService.deleteChapterById(req.params.id);
  return sendSuccess(res, {
    message: 'Chapter deleted successfully',
  });
});