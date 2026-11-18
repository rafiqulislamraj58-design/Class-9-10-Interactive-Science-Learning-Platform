import { z } from 'zod';

export const createChapterSchema = z.object({
  subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Subject ObjectId'),
  chapterNumber: z.number().int().positive('Chapter number must be positive'),
  slug: z.string().min(2).optional(),
  title: z.string().min(2, 'Bengali title is required'),
  titleEn: z.string().min(2, 'English title is required'),
  description: z.string().optional().default(''),
  summary: z.string().optional().default(''),
  estimatedMinutes: z.number().int().positive().optional().default(30),
  order: z.number().int().positive('Order must be a positive number'),
  topicCount: z.number().int().nonnegative().optional().default(0),
  isPublished: z.boolean().optional().default(true),
});

export const updateChapterSchema = createChapterSchema.partial();