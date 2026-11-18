import { Lesson } from '../models/Lesson.js';
import { Topic } from '../models/Topic.js';
import { Chapter } from '../models/Chapter.js';

export const createLesson = async (payload) => {
  const [chapter, topic] = await Promise.all([
    Chapter.findById(payload.chapterId).lean(),
    Topic.findById(payload.topicId).lean(),
  ]);

  if (!chapter) {
    const error = new Error('Referenced Chapter not found');
    error.statusCode = 404;
    throw error;
  }

  if (!topic) {
    const error = new Error('Referenced Topic not found');
    error.statusCode = 404;
    throw error;
  }

  const lesson = await Lesson.create(payload);
  return lesson;
};

export const getLessonsByTopicIdentifier = async (topicIdentifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(topicIdentifier);
  const topicQuery = isObjectId
    ? { _id: topicIdentifier }
    : {
        $or: [
          { topicId: topicIdentifier.toLowerCase() },
          { slug: topicIdentifier.toLowerCase() },
        ],
      };

  const topic = await Topic.findOne(topicQuery).lean();
  if (!topic) {
    const error = new Error('Topic not found');
    error.statusCode = 404;
    throw error;
  }

  return await Lesson.find({
    topicId: topic._id,
    status: 'published',
  })
    .populate('topicId', 'title titleEn topicId slug')
    .sort({ createdAt: 1 })
    .lean();
};

export const updateLessonById = async (id, payload) => {
  const existingLesson = await Lesson.findById(id);
  if (!existingLesson) {
    const error = new Error('Lesson not found');
    error.statusCode = 404;
    throw error;
  }

  const nextVersion = payload.version || existingLesson.version + 1;

  const updated = await Lesson.findByIdAndUpdate(
    id,
    { ...payload, version: nextVersion },
    { new: true, runValidators: true }
  ).lean();

  return updated;
};