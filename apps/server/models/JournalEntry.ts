import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Mood types - pregnancy-appropriate options
export const MOOD_TYPES = [
  'happy',
  'calm',
  'anxious',
  'tired',
  'excited',
  'emotional',
  'grateful',
  'hopeful',
  'uncomfortable',
  'nesting',
] as const;

export type MoodType = typeof MOOD_TYPES[number];

// Topic reference interface
export interface TopicReference {
  topicId: number;
  title: string;
}

// Journey reference interface
export interface JourneyReference {
  journeyId: string;
  title: string;
}

/**
 * JournalEntry interface
 * 
 * Requirements: 10.10 - Track creation timestamp and last update timestamp for each entry
 * separately from journalDate
 * 
 * Timestamp fields:
 * - journalDate: The logical date this entry belongs to (normalized to midnight UTC).
 *   For late-night entries (created between midnight and 4AM), this may be the previous day.
 *   Used for calendar organization and date-based queries.
 * 
 * - createdAt: The actual timestamp when this entry was first created.
 *   This reflects the real creation time regardless of journalDate.
 * 
 * - updatedAt: The actual timestamp when this entry was last modified.
 *   Updated every time the entry content, mood, or references are changed.
 *   If equal to createdAt (within 1 second), the entry has not been edited.
 */
export interface JournalEntry {
  _id: ObjectId;
  userId: ObjectId;
  /** Logical journal date (normalized to midnight UTC). May differ from createdAt for late-night entries. */
  journalDate: Date;
  content: string;
  mood?: MoodType;
  /** Number of baby kicks logged with this entry */
  kickCount?: number;
  /** Type of entry: 'text' for written entries, 'voice' for voice note entries */
  entryType: 'text' | 'voice';
  topicReferences: TopicReference[];
  journeyReferences: JourneyReference[];
  voiceNoteIds: ObjectId[];
  /** Actual creation timestamp - when this entry was first created (Requirements: 10.10) */
  createdAt: Date;
  /** Actual update timestamp - when this entry was last modified (Requirements: 10.10) */
  updatedAt: Date;
}

// JournalEntry document type for insertion (without _id)
export type JournalEntryDocument = Omit<JournalEntry, '_id'>;

// Zod validation schemas
export const moodTypeSchema = z.enum(MOOD_TYPES);

export const topicReferenceSchema = z.object({
  topicId: z.number().int().positive(),
  title: z.string().min(1).max(200),
});

export const journeyReferenceSchema = z.object({
  journeyId: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
});

export const createJournalEntrySchema = z.object({
  journalDate: z.string().datetime(), // Logical date for the entry
  content: z.string().max(10000, 'Content must be 10000 characters or less').optional().default(''),
  mood: moodTypeSchema.optional().nullable(),
  entryType: z.enum(['text', 'voice']).optional().default('text'),
  topicReferences: z.array(topicReferenceSchema).optional().default([]),
  journeyReferences: z.array(journeyReferenceSchema).optional().default([]),
});

export const updateJournalEntrySchema = z.object({
  content: z.string().max(10000, 'Content must be 10000 characters or less').optional(),
  mood: moodTypeSchema.optional().nullable(),
  topicReferences: z.array(topicReferenceSchema).optional(),
  journeyReferences: z.array(journeyReferenceSchema).optional(),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;

/**
 * Normalize a date to midnight UTC for consistent journal entry dates
 */
export function normalizeDateToMidnight(date: Date): Date {
  const normalized = new Date(date);
  normalized.setUTCHours(0, 0, 0, 0);
  return normalized;
}

// Get journal entries collection
export function getJournalEntriesCollection(): Collection<JournalEntry> {
  return getDatabase().collection<JournalEntry>(COLLECTIONS.JOURNAL_ENTRIES);
}
