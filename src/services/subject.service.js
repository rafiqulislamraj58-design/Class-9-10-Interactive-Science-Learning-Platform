import { Subject } from '../models/Subject.js';

export const createSubject = async (payload) => {
  const subject = await Subject.create(payload);
  return subject;
};

export const getAllPublicSubjects = async () => {
  return await Subject.find({ isPublished: true }).sort({ order: 1 }).lean();
};

export const getSubjectByIdOrName = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId ? { _id: identifier } : { name: identifier.toLowerCase() };

  const subject = await Subject.findOne(query).lean();
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

export const updateSubjectById = async (id, payload) => {
  const subject = await Subject.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};

export const deleteSubjectById = async (id) => {
  const subject = await Subject.findByIdAndDelete(id).lean();
  if (!subject) {
    const error = new Error('Subject not found');
    error.statusCode = 404;
    throw error;
  }
  return subject;
};