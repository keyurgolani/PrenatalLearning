/**
 * Journal types for reflection and memory journaling feature
 * 
 * Requirements:
 * - 8.1: Provide journal entry form accessible from each story page
 * - 8.2: Allow entries with title, content (rich text), and mood indicator
 * - 8.3: Automatically associate entries with current story and date
 * - 8.4: Save journal entries to server for logged-in users
 * - 8.5: Auto-save drafts every 30 seconds
 * - 8.6: Support entries up to 5000 characters
 * - 9.1: Provide dedicated Journal page listing all entries
 * - 9.2: Allow filtering by story, category, or date range
 * - 9.5: Display entries in reverse chronological order
 * - 9.6: Show preview of entry content in list view
 * - 10.1: Display 2-3 reflection prompts per story
 * 
 * Design Properties:
 * - Property 11: Journal entry character limit (max 5000)
 * - Property 12: Journal chronological ordering
 * - Property 13: Journal preview truncation (max 150 chars)
 * - Property 14: Journal prompt count (2-3 per story)
 */

/**
 * Mood types for journal entries - pregnancy-appropriate options
 * Requirements: 8.2, 11.2
 */
export type MoodType = 
  | 'happy' 
  | 'calm' 
  | 'anxious'
  | 'tired'
  | 'excited'
  | 'emotional'
  | 'grateful' 
  | 'hopeful'
  | 'uncomfortable'
  | 'nesting';

/**
 * Journal entry data for creating/updating entries
 * Requirements: 8.1, 8.2, 8.3
 * Requirements: 11.1, 11.8, 11.9 - Mood is optional and nullable
 */
export interface JournalEntryData {
  title: string;
  content: string;
  mood?: MoodType | null;
  storyId?: number;
  promptUsed?: string;
}

/**
 * Full journal entry with metadata
 * Requirements: 8.3, 8.4, 10.9, 10.10
 * 
 * Timestamp fields (Requirements: 10.10):
 * - journalDate: The logical date this entry belongs to (ISO string, normalized to midnight UTC).
 *   For late-night entries (created between midnight and 4AM), this may be the previous day.
 *   Used for calendar organization and date-based queries.
 * 
 * - createdAt: The actual timestamp when this entry was first created (Unix timestamp in ms).
 *   This reflects the real creation time regardless of journalDate.
 * 
 * - updatedAt: The actual timestamp when this entry was last modified (Unix timestamp in ms).
 *   Updated every time the entry content, mood, or references are changed.
 *   If equal to createdAt (within 1 second), the entry has not been edited.
 */
export interface JournalEntry extends JournalEntryData {
  id: string;
  /** @deprecated Use userId instead - kept for backward compatibility */
  profileId?: string;
  userId?: string;
  /** Logical date for the entry (ISO string). May differ from createdAt for late-night entries. */
  journalDate?: string;
  /** Type of entry: 'text' for written entries, 'voice' for voice note entries */
  entryType?: 'text' | 'voice';
  /** Voice note IDs associated with this entry (Requirements: 12.4, 12.9) */
  voiceNoteIds?: string[];
  /** Number of baby kicks logged with this entry */
  kickCount?: number;
  /** Actual creation timestamp in milliseconds - when this entry was first created (Requirements: 10.10) */
  createdAt: number;
  /** Actual update timestamp in milliseconds - when this entry was last modified (Requirements: 10.10) */
  updatedAt: number;
}

/**
 * Journal draft for auto-save functionality
 * Requirements: 8.5
 */
export interface JournalDraft {
  userId: string;
  data: JournalEntryData;
  lastSaved: number; // timestamp
}

/**
 * Filters for journal entry queries
 * Requirements: 9.2
 * Requirements: 11.9 - Mood filter can be null/undefined
 */
export interface JournalFilters {
  storyId?: number;
  category?: string;
  dateFrom?: string; // ISO date string YYYY-MM-DD
  dateTo?: string;   // ISO date string YYYY-MM-DD
  mood?: MoodType | null;
}

/**
 * Journal record stored per user
 */
export interface JournalRecord {
  userId: string;
  entries: JournalEntry[];
  draft: JournalDraft | null;
}

/**
 * Journal prompt for story-specific reflection
 * Requirements: 10.1, 10.2
 */
export interface JournalPrompt {
  id: string;
  storyId?: number;  // undefined for general prompts
  text: string;
  category?: string; // for categorizing prompts
}

/**
 * Constants for journal feature
 */
export const JOURNAL_CONSTANTS = {
  /** Maximum characters allowed in journal content (Property 11) */
  MAX_CONTENT_LENGTH: 5000,
  /** Maximum characters for preview display (Property 13) */
  MAX_PREVIEW_LENGTH: 150,
  /** Minimum prompts to display per story (Property 14) */
  MIN_PROMPTS_PER_STORY: 2,
  /** Maximum prompts to display per story (Property 14) */
  MAX_PROMPTS_PER_STORY: 3,
  /** Auto-save interval in milliseconds (30 seconds) */
  AUTO_SAVE_INTERVAL: 30000,
} as const;
