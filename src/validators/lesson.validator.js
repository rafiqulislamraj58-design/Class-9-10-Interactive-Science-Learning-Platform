import { z } from 'zod';

const blockTypeEnum = z.enum([
  'text',
  'heading',
  'paragraph',
  'formula',
  'image',
  'diagram',
  'animation',
  'simulation',
  'model3d',
  'lab',
  'example',
  'note',
  'table',
  'graph',
  'quiz',
]);

const blockValidatorSchema = z.object({
  type: blockTypeEnum,
  content: z.string().optional().default(''),
  title: z.string().optional().default(''),
  formulaId: z.string().optional().default(''),
  animationId: z.string().optional().default(''),
  modelId: z.string().optional().default(''),
  labId: z.string().optional().default(''),
  imageUrl: z.string().optional().default(''),
  caption: z.string().optional().default(''),
  data: z.any().optional().default(null),
  order: z.number().int().positive().optional().default(1),
});

export const createLessonSchema = z.object({
  chapterId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Chapter ObjectId'),
  topicId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Topic ObjectId'),
  title: z.string().min(2, 'Lesson title is required'),
  learningObjectives: z.array(z.string()).optional().default([]),
  blocks: z.array(blockValidatorSchema).min(1, 'At least one content block is required'),
  version: z.number().int().positive().optional().default(1),
  status: z
    .enum(['draft', 'review', 'published', 'unpublished', 'archived'])
    .optional()
    .default('published'),
});

export const updateLessonSchema = createLessonSchema.partial();