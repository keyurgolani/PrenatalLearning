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
 * Mood types for journal entries
 * Requirements: 8.2
 */
export type MoodType = 
  | 'happy' 
  | 'calm' 
  | 'reflective' 
  | 'grateful' 
  | 'hopeful' 
  | 'tired';

/**
 * Journal entry data for creating/updating entries
 * Requirements: 8.1, 8.2, 8.3
 */
export interface JournalEntryData {
  title: string;
  content: string;
  mood?: MoodType;
  storyId?: number;
  promptUsed?: string;
}

/**
 * Full journal entry with metadata
 * Requirements: 8.3, 8.4
 */
export interface JournalEntry extends JournalEntryData {
  id: string;
  profileId: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

/**
 * Journal draft for auto-save functionality
 * Requirements: 8.5
 */
export interface JournalDraft {
  profileId: string;
  data: JournalEntryData;
  lastSaved: number; // timestamp
}

/**
 * Filters for journal entry queries
 * Requirements: 9.2
 */
export interface JournalFilters {
  storyId?: number;
  category?: string;
  dateFrom?: string; // ISO date string YYYY-MM-DD
  dateTo?: string;   // ISO date string YYYY-MM-DD
  mood?: MoodType;
}

/**
 * Journal record stored per profile
 */
export interface JournalRecord {
  profileId: string;
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
