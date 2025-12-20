import { z } from 'zod';
import {
  moodTypeSchema,
  topicReferenceSchema,
  journeyReferenceSchema,
} from '../models/index.js';

// Create journal entry validation schema
export const createJournalEntrySchema = z.object({
  journalDate: z.string().datetime(), // Logical date for the entry
  content: z.string().max(10000, 'Content must be 10000 characters or less').optional().default(''),
  mood: moodTypeSchema.optional().nullable(),
  kickCount: z.number().int().min(0).optional(),
  entryType: z.enum(['text', 'voice']).optional().default('text'),
  topicReferences: z.array(topicReferenceSchema).optional().default([]),
  journeyReferences: z.array(journeyReferenceSchema).optional().default([]),
});

// Update journal entry validation schema
export const updateJournalEntrySchema = z.object({
  content: z.string().max(10000, 'Content must be 10000 characters or less').optional(),
  mood: moodTypeSchema.optional().nullable(),
  kickCount: z.number().int().min(0).optional(),
  topicReferences: z.array(topicReferenceSchema).optional(),
  journeyReferences: z.array(journeyReferenceSchema).optional(),
});

// Get journal entries query validation schema
export const getJournalEntriesQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).optional().default(50),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
});

// Get calendar data query validation schema
export const getCalendarDataQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>;
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>;
export type GetJournalEntriesQuery = z.infer<typeof getJournalEntriesQuerySchema>;
export type GetCalendarDataQuery = z.infer<typeof getCalendarDataQuerySchema>;
