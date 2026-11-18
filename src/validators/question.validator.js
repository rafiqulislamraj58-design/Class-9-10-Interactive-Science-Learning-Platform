import { z } from 'zod';

export const createQuestionSchema = z.object({
  subjectId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Subject ObjectId'),
  chapterId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Chapter ObjectId'),
  topicId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Topic ObjectId'),
  question: z.string().min(5, 'Question text is required'),
  formulaLatex: z.string().optional().default(''),
  options: z
    .array(z.string().min(1, 'Option cannot be empty'))
    .length(4, 'Must provide exactly 4 options'),
  correctIndex: z
    .number()
    .int()
    .min(0, 'correctIndex must be between 0 and 3')
    .max(3, 'correctIndex must be between 0 and 3'),
  explanation: z.string().min(5, 'Explanation is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
  tags: z.array(z.string()).optional().default([]),
  isPublished: z.boolean().optional().default(true),
});

export const bulkCreateQuestionSchema = z.object({
  questions: z.array(createQuestionSchema).min(1, 'At least 1 question is required'),
});

export const updateQuestionSchema = createQuestionSchema.partial();