import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const publishContentSchema = z.object({
  resourceType: z.enum([
    'subject',
    'chapter',
    'topic',
    'lesson',
    'formula',
    'animation',
    'model3d',
    'lab',
    'question',
  ]),
  isPublished: z.boolean().optional().default(true),
  status: z
    .enum(['draft', 'review', 'published', 'unpublished', 'archived'])
    .optional()
    .default('published'),
});