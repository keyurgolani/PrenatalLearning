import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Progress interface
export interface ProgressRecord {
  _id: ObjectId;
  userId: ObjectId;
  storyId: number;
  completedSteps: string[];
  currentStep: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Progress document type for insertion (without _id)
export type ProgressDocument = Omit<ProgressRecord, '_id'>;

// Zod validation schemas
export const updateProgressSchema = z.object({
  storyId: z.number().int().positive(),
  completedSteps: z.array(z.string()).optional(),
  currentStep: z.string().optional(),
  isCompleted: z.boolean().optional(),
});

export const createProgressSchema = z.object({
  storyId: z.number().int().positive(),
  currentStep: z.string().min(1),
});

export type CreateProgressInput = z.infer<typeof createProgressSchema>;
export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;

// Get progress collection
export function getProgressCollection(): Collection<ProgressRecord> {
  return getDatabase().collection<ProgressRecord>(COLLECTIONS.PROGRESS);
}
