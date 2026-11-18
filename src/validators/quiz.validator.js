import { z } from 'zod';

export const startQuizSchema = z.object({
  chapterId: z.string().min(1, 'chapterId or chapter slug is required'),
  mode: z.enum(['quick', 'full', 'custom']).optional().default('quick'),
  limit: z.number().int().positive().max(100).optional().default(10),
  topicId: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  anonymousDeviceId: z.string().optional().default('guest-device'),
});

export const submitQuizSchema = z.object({
  attemptId: z.string().min(5, 'attemptId is required'),
  anonymousDeviceId: z.string().optional().default('guest-device'),
  timeTaken: z.number().int().nonnegative().optional().default(0),
  answers: z.array(
    z.object({
      questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid questionId'),
      selectedIndex: z.number().int().min(0).max(3).nullable().optional(),
    })
  ),
});