import { Formula } from '../models/Formula.js';
import { Subject } from '../models/Subject.js';
import { Topic } from '../models/Topic.js';
import { generateSlug } from '../utils/generateSlug.js';

export const createFormula = async (payload) => {
  const [subject, topic] = await Promise.all([
    Subject.findById(payload.subjectId).lean(),
    Topic.findById(payload.topicId).lean(),
  ]);

  if (!subject) {
    const error = new Error('Referenced Subject not found');
    error.statusCode = 404;
    throw error;
  }

  if (!topic) {
    const error = new Error('Referenced Topic not found');
    error.statusCode = 404;
    throw error;
  }

  const formulaId = generateSlug(payload.formulaId);

  const formula = await Formula.create({
    ...payload,
    formulaId,
  });

  return formula;
};

export const getFormulaByIdOrKey = async (identifier) => {
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
  const query = isObjectId
    ? { _id: identifier }
    : { formulaId: identifier.toLowerCase() };

  const formula = await Formula.findOne(query)
    .populate('subjectId', 'name nameBn nameEn')
    .populate('topicId', 'title titleEn topicId slug')
    .lean();

  if (!formula) {
    const error = new Error('Formula not found');
    error.statusCode = 404;
    throw error;
  }

  return formula;
};

export const updateFormulaById = async (id, payload) => {
  if (payload.formulaId) {
    payload.formulaId = generateSlug(payload.formulaId);
  }

  const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
  const query = isObjectId ? { _id: id } : { formulaId: id.toLowerCase() };

  const formula = await Formula.findOneAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  }).lean();

  if (!formula) {
    const error = new Error('Formula not found');
    error.statusCode = 404;
    throw error;
  }

  return formula;
};