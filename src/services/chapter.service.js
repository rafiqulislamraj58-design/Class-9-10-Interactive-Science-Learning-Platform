import { Chapter } from '../models/Chapter.js';
import { Subject } from '../models/Subject.js';
import { generateSlug } from '../utils/generateSlug.js';

export const createChapter = async (payload) => {
  // Check if parent Subject exists
  const subjectExists = await Subject.findById(payload.subjectId).lean();
  if (!subjectExists) {
    const error = new Error('Referenced Subject not found');
    error.statusCode = 404;
    throw error;
  }

  // Auto-generate slug from titleEn if not provided
  const slug = payload.slug ? generateSlug(payload.slug) : generateSlug(payload.titleEn);

  const chapter = await Chapter.create({
    ...payload,
    slug,
  });

  return chapter;
};

export const getAllPublicChapters = async (filters = {}) => {
  const query = { isPublished: true };

  if (filters.subjectId) {
    query.subjectId = filters.subjectId;
  } else if (filters.subject) {
    const subjectDoc = await Subject.findOne({ name: filters.subject.toLowerCase() }).lean();
    if (!subjectDoc) return [];
    query.subjectId = subjectDoc._id;
  }

  return await Chapter.find(query)
    .populate('subjectId', 'name nameBn nameEn color')
    .sort({ order: 1 })
    .lean();
};

export const getChapterBySlugOrId = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { slug: identifier.toLowerCase() };

  const chapter = await Chapter.findOne(query)
    .populate('subjectId', 'name nameBn nameEn color')
    .lean();

  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return chapter;
};

export const updateChapterById = async (id, payload) => {
  if (payload.slug) {
    payload.slug = generateSlug(payload.slug);
  }

  const chapter = await Chapter.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return chapter;
};

export const deleteChapterById = async (id) => {
  const chapter = await Chapter.findByIdAndDelete(id).lean();
  if (!chapter) {
    const error = new Error('Chapter not found');
    error.statusCode = 404;
    throw error;
  }
  return chapter;
};