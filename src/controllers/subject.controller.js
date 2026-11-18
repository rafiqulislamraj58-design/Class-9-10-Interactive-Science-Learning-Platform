import * as subjectService from '../services/subject.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createSubject = asyncHandler(async (req, res) => {
  const data = await subjectService.createSubject(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Subject created successfully',
    data,
  });
});

export const getSubjects = asyncHandler(async (req, res) => {
  const data = await subjectService.getAllPublicSubjects();
  return sendSuccess(res, {
    message: 'Subjects fetched successfully',
    data,
  });
});

export const getSubjectDetails = asyncHandler(async (req, res) => {
  const data = await subjectService.getSubjectByIdOrName(req.params.id);
  return sendSuccess(res, {
    message: 'Subject details fetched successfully',
    data,
  });
});

export const updateSubject = asyncHandler(async (req, res) => {
  const data = await subjectService.updateSubjectById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Subject updated successfully',
    data,
  });
});

export const deleteSubject = asyncHandler(async (req, res) => {
  await subjectService.deleteSubjectById(req.params.id);
  return sendSuccess(res, {
    message: 'Subject deleted successfully',
  });
});