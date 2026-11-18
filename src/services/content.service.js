import { Animation } from '../models/Animation.js';
import { Model3D } from '../models/Model3D.js';
import { Lab } from '../models/Lab.js';
import { Chapter } from '../models/Chapter.js';
import { Topic } from '../models/Topic.js';
import { Formula } from '../models/Formula.js';
import { generateSlug } from '../utils/generateSlug.js';

// --- ANIMATION ---
export const createAnimation = async (payload) => {
  const animationId = generateSlug(payload.animationId);
  return await Animation.create({ ...payload, animationId });
};

export const getAnimationByIdOrKey = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { animationId: identifier.toLowerCase() };
  const doc = await Animation.findOne(query).lean();
  if (!doc) {
    const error = new Error('Animation not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

export const updateAnimationById = async (identifier, payload) => {
  if (payload.animationId) payload.animationId = generateSlug(payload.animationId);
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { animationId: identifier.toLowerCase() };
  const doc = await Animation.findOneAndUpdate(query, payload, { new: true, runValidators: true }).lean();
  if (!doc) {
    const error = new Error('Animation not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

// --- 3D MODEL ---
export const createModel3D = async (payload) => {
  const modelId = generateSlug(payload.modelId);
  return await Model3D.create({ ...payload, modelId });
};

export const getModel3DByIdOrKey = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { modelId: identifier.toLowerCase() };
  const doc = await Model3D.findOne(query).lean();
  if (!doc) {
    const error = new Error('3D Model not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

export const updateModel3DById = async (identifier, payload) => {
  if (payload.modelId) payload.modelId = generateSlug(payload.modelId);
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { modelId: identifier.toLowerCase() };
  const doc = await Model3D.findOneAndUpdate(query, payload, { new: true, runValidators: true }).lean();
  if (!doc) {
    const error = new Error('3D Model not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

// --- VIRTUAL LAB ---
export const createLab = async (payload) => {
  const labId = generateSlug(payload.labId);
  return await Lab.create({ ...payload, labId });
};

export const getLabByIdOrKey = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { labId: identifier.toLowerCase() };
  const doc = await Lab.findOne(query).lean();
  if (!doc) {
    const error = new Error('Lab configuration not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

export const updateLabById = async (identifier, payload) => {
  if (payload.labId) payload.labId = generateSlug(payload.labId);
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { labId: identifier.toLowerCase() };
  const doc = await Lab.findOneAndUpdate(query, payload, { new: true, runValidators: true }).lean();
  if (!doc) {
    const error = new Error('Lab configuration not found');
    error.statusCode = 404;
    throw error;
  }
  return doc;
};

// --- GLOBAL SEARCH (SRS Section 12.3) ---
export const searchCurriculumContent = async (queryText) => {
  if (!queryText || !queryText.trim()) {
    return { chapters: [], topics: [], formulas: [], labs: [] };
  }

  const regex = new RegExp(queryText.trim(), 'i');

  const [chapters, topics, formulas, labs] = await Promise.all([
    Chapter.find({
      isPublished: true,
      $or: [{ title: regex }, { titleEn: regex }, { description: regex }],
    })
      .select('title titleEn slug chapterNumber subjectId')
      .limit(10)
      .lean(),
    Topic.find({
      isPublished: true,
      $or: [{ title: regex }, { titleEn: regex }, { summary: regex }],
    })
      .select('title titleEn topicId slug chapterId')
      .limit(10)
      .lean(),
    Formula.find({
      isPublished: true,
      $or: [{ name: regex }, { explanation: regex }],
    })
      .select('formulaId name expression')
      .limit(10)
      .lean(),
    Lab.find({
      isPublished: true,
      title: regex,
    })
      .select('labId title type')
      .limit(10)
      .lean(),
  ]);

  return { chapters, topics, formulas, labs };
};