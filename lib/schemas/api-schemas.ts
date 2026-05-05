import { z } from 'zod';

export const feedbackSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(5000, 'Message is too long'),
  email: z.string().trim().email('Email must be valid').optional(),
});

export const termCreateSchema = z.object({
  term: z.string().trim().min(1, 'Term is required').max(200, 'Term is too long'),
  definition: z.string().trim().min(1, 'Definition is required').max(10000, 'Definition is too long'),
});

export const termUpdateSchema = z.object({
  definition: z.string().trim().min(1, 'Definition is required').max(10000, 'Definition is too long'),
  expectedVersion: z.number().int().positive().optional(),
});
