import * as contentService from '../services/content.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createModel3D = asyncHandler(async (req, res) => {
  const data = await contentService.createModel3D(req.body);
  return sendSuccess(res, { statusCode: 201, message: '3D Model created successfully', data });
});

export const getModel3DDetails = asyncHandler(async (req, res) => {
  const data = await contentService.getModel3DByIdOrKey(req.params.id);
  return sendSuccess(res, { message: '3D Model configuration fetched successfully', data });
});

export const updateModel3D = asyncHandler(async (req, res) => {
  const data = await contentService.updateModel3DById(req.params.id, req.body);
  return sendSuccess(res, { message: '3D Model updated successfully', data });
});