import * as contentService from '../services/content.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createAnimation = asyncHandler(async (req, res) => {
  const data = await contentService.createAnimation(req.body);
  return sendSuccess(res, { statusCode: 201, message: 'Animation created successfully', data });
});

export const getAnimationDetails = asyncHandler(async (req, res) => {
  const data = await contentService.getAnimationByIdOrKey(req.params.id);
  return sendSuccess(res, { message: 'Animation configuration fetched successfully', data });
});

export const updateAnimation = asyncHandler(async (req, res) => {
  const data = await contentService.updateAnimationById(req.params.id, req.body);
  return sendSuccess(res, { message: 'Animation updated successfully', data });
});