import * as contentService from '../services/content.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createLab = asyncHandler(async (req, res) => {
  const data = await contentService.createLab(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Lab configuration created successfully', data });
});

export const getLabDetails = asyncHandler(async (req, res) => {
  const data = await contentService.getLabByIdOrKey(req.params.id);
  return sendSuccess(res, { message: 'Lab configuration fetched successfully', data });
});

export const updateLab = asyncHandler(async (req, res) => {
  const data = await contentService.updateLabById(req.params.id, req.body);
  return sendSuccess(res, { message: 'Lab configuration updated successfully', data });
});

export const searchContent = asyncHandler(async (req, res) => {
  const data = await contentService.searchCurriculumContent(req.query.q);
  return sendSuccess(res, { message: 'Search results fetched successfully', data });
});