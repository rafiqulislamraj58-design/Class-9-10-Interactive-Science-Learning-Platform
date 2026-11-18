import { z } from 'zod';

export const createTopicSchema = z.object({
  chapterId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Chapter ObjectId'),
  topicId: z.string().min(2, 'Unique topicId is required (e.g., motion-acceleration)').optional(),
  slug: z.string().min(2, 'Slug is required (e.g., acceleration)').optional(),
  title: z.string().min(2, 'Bengali title is required'),
  titleEn: z.string().min(2, 'English title is required'),
  summary: z.string().optional().default(''),
  learningObjectives: z.array(z.string()).optional().default([]),
  formulaIds: z.array(z.string()).optional().default([]),
  animationIds: z.array(z.string()).optional().default([]),
  modelIds: z.array(z.string()).optional().default([]),
  labIds: z.array(z.string()).optional().default([]),
  order: z.number().int().positive('Order must be a positive number'),
  isPublished: z.boolean().optional().default(true),
});

export const updateTopicSchema = createTopicSchema.partial();