import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.enum(['physics', 'chemistry', 'biology'], {
    errorMap: () => ({ message: 'Subject name must be physics, chemistry, or biology' }),
  }),
  nameBn: z.string().min(2, 'Bengali name is required'),
  nameEn: z.string().min(2, 'English name is required'),
  description: z.string().optional().default(''),
  classLevels: z.array(z.number()).optional().default([9, 10]),
  chapterCount: z.number().int().nonnegative().optional().default(14),
  color: z.string().optional().default('#2563eb'),
  order: z.number().int().positive('Order must be a positive number'),
  isPublished: z.boolean().optional().default(true),
});

export const updateSubjectSchema = createSubjectSchema.partial();