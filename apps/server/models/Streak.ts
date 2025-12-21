import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Streak history entry interface
export interface StreakHistoryEntry {
  startDate: Date;
  endDate: Date;
  length: number;
}

// StreakRecord interface
export interface StreakRecord {
  _id: ObjectId;
  userId: ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  streakHistory: StreakHistoryEntry[];
}

// StreakRecord document type for insertion (without _id)
export type StreakDocument = Omit<StreakRecord, '_id'>;

// Zod validation schemas
export const streakHistoryEntrySchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  length: z.number().int().nonnegative(),
});

export const updateStreakSchema = z.object({
  currentStreak: z.number().int().nonnegative().optional(),
  longestStreak: z.number().int().nonnegative().optional(),
  lastActivityDate: z.string().datetime().optional(),
});

export type UpdateStreakInput = z.infer<typeof updateStreakSchema>;

// Default streak record
export const DEFAULT_STREAK: Omit<StreakDocument, 'userId'> = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: new Date(),
  streakHistory: [],
};

// Get streaks collection
export function getStreaksCollection(): Collection<StreakRecord> {
  return getDatabase().collection<StreakRecord>(COLLECTIONS.STREAKS);
}
