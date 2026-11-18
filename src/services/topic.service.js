import { Topic } from '../models/Topic.js';
import { Chapter } from '../models/Chapter.js';
import { generateSlug } from '../utils/generateSlug.js';

export const createTopic = async (payload) => {
  const chapter = await Chapter.findById(payload.chapterId).lean();
  if (!chapter) {
    const error = new Error('Referenced Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.titleEn);
  const topicId = payload.topicId
    ? generateSlug(payload.topicId)
    : `${chapter.slug}-${slug}`;

  const topic = await Topic.create({
    ...payload,
    slug,
    topicId,
  });

  // Update parent chapter topicCount
  const count = await Topic.countDocuments({ chapterId: chapter._id, isPublished: true });
  await Chapter.findByIdAndUpdate(chapter._id, { topicCount: count });

  return topic;
};

export const getTopicsByChapterSlugOrId = async (chapterIdentifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(chapterIdentifier);
  const chapterQuery = isObjectId
    ? { _id: chapterIdentifier }
    : { slug: chapterIdentifier.toLowerCase() };

  const chapter = await Chapter.findOne(chapterQuery).lean();
  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  return await Topic.find({ chapterId: chapter._id, isPublished: true })
    .sort({ order: 1 })
    .lean();
};

export const getTopicByIdOrSlug = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId
    ? { _id: identifier }
    : { $or: [{ topicId: identifier.toLowerCase() }, { slug: identifier.toLowerCase() }] };

  const topic = await Topic.findOne(query)
    .populate('chapterId', 'title titleEn slug chapterNumber subjectId')
    .lean();

  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return topic;
};

export const updateTopicById = async (id, payload) => {
  if (payload.slug) payload.slug = generateSlug(payload.slug);
  if (payload.topicId) payload.topicId = generateSlug(payload.topicId);

  const topic = await Topic.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }
  return topic;
};

export const deleteTopicById = async (id) => {
  const topic = await Topic.findByIdAndDelete(id).lean();
  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }

  // Recalculate parent chapter topicCount
  const count = await Topic.countDocuments({ chapterId: topic.chapterId, isPublished: true });
  await Chapter.findByIdAndUpdate(topic.chapterId, { topicCount: count });

  return topic;
};