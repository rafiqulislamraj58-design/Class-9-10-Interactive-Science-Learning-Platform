import * as topicService from '../services/topic.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createTopic = asyncHandler(async (req, res) => {
  const data = await topicService.createTopic(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: 'Topic created successfully',
    data,
  });
});

export const getChapterTopics = asyncHandler(async (req, res) => {
  const data = await topicService.getTopicsByChapterSlugOrId(req.params.slug);
  return sendSuccess(res, {
    message: 'Topics fetched successfully',
    data,
  });
});

export const getTopicDetails = asyncHandler(async (req, res) => {
  const data = await topicService.getTopicByIdOrSlug(req.params.id);
  return sendSuccess(res, {
    message: 'Topic details fetched successfully',
    data,
  });
});

export const updateTopic = asyncHandler(async (req, res) => {
  const data = await topicService.updateTopicById(req.params.id, req.body);
  return sendSuccess(res, {
    message: 'Topic updated successfully',
    data,
  });
});

export const deleteTopic = asyncHandler(async (req, res) => {
  await topicService.deleteTopicById(req.params.id);
  return sendSuccess(res, {
    message: 'Topic deleted successfully',
  });
});