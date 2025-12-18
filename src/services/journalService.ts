/**
 * Journal service for reflection and memory journaling
 * 
 * Requirements:
 * - 8.4: Save journal entries to server for logged-in users
 * - 8.5: Auto-save drafts every 30 seconds to prevent data loss
 * - 8.6: Support entries up to 5000 characters
 * - 9.1: Provide dedicated Journal page listing all entries
 * - 9.2: Allow filtering journal entries by story, category, or date range
 * - 9.3: Allow editing existing journal entries
 * - 9.4: Allow deleting journal entries with confirmation
 * - 9.5: Display journal entries in reverse chronological order by default
 * - 9.6: Show a preview of entry content in the list view
 * - 10.1: Display 2-3 reflection prompts relevant to the current story
 * 
 * Design Properties:
 * - Property 11: Journal entry character limit
 * - Property 12: Journal chronological ordering
 * - Property 13: Journal preview truncation
 * - Property 14: Journal prompt count
 */

import type {
  JournalEntry,
  JournalEntryData,
  JournalDraft,
  JournalFilters,
  JournalRecord,
} from '../types/journal';
import { JOURNAL_CONSTANTS } from '../types/journal';
import { storageService } from './storageService';
import { stories } from '../data/stories';

const JOURNAL_STORAGE_KEY = 'prenatal-learning-hub:journal-data';

/**
 * Generate a unique ID for journal entries
 */
export function generateJournalId(): string {
  return `journal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get date string from timestamp (YYYY-MM-DD)
 */
export function getDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


/**
 * Validate journal entry content length
 * Property 11: Journal entry character limit
 * For any journal entry, the content length should not exceed 5000 characters
 * Requirements: 8.6
 */
export function validateContentLength(content: string): boolean {
  return content.length <= JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH;
}

/**
 * Truncate content for preview display
 * Property 13: Journal preview truncation
 * For any journal entry preview, the displayed text should be at most 150 characters
 * Requirements: 9.6
 */
export function truncateForPreview(content: string): string {
  if (content.length <= JOURNAL_CONSTANTS.MAX_PREVIEW_LENGTH) {
    return content;
  }
  return content.substring(0, JOURNAL_CONSTANTS.MAX_PREVIEW_LENGTH) + '...';
}

/**
 * Sort entries in reverse chronological order
 * Property 12: Journal chronological ordering
 * For any list of journal entries with default sorting, entries should be ordered by createdAt descending
 * Requirements: 9.5
 */
export function sortEntriesChronologically(entries: JournalEntry[]): JournalEntry[] {
  return [...entries].sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Get story category by ID
 */
function getStoryCategory(storyId: number): string | undefined {
  const story = stories.find(s => s.id === storyId);
  return story?.category;
}

/**
 * Create empty journal record for a profile
 */
function createEmptyJournalRecord(profileId: string): JournalRecord {
  return {
    profileId,
    entries: [],
    draft: null,
  };
}

/**
 * Load journal record from storage
 */
function loadJournalRecord(profileId: string): JournalRecord {
  const data = storageService.get(JOURNAL_STORAGE_KEY);
  if (!data) {
    return createEmptyJournalRecord(profileId);
  }
  
  try {
    const records: Record<string, JournalRecord> = JSON.parse(data);
    return records[profileId] || createEmptyJournalRecord(profileId);
  } catch {
    return createEmptyJournalRecord(profileId);
  }
}

/**
 * Save journal record to storage
 */
function saveJournalRecord(record: JournalRecord): void {
  const data = storageService.get(JOURNAL_STORAGE_KEY);
  let records: Record<string, JournalRecord> = {};
  
  if (data) {
    try {
      records = JSON.parse(data);
    } catch {
      records = {};
    }
  }
  
  records[record.profileId] = record;
  storageService.set(JOURNAL_STORAGE_KEY, JSON.stringify(records));
}

/**
 * Filter entries by date range
 * Requirements: 9.2
 */
export function filterEntriesByDateRange(
  entries: JournalEntry[],
  dateFrom?: string,
  dateTo?: string
): JournalEntry[] {
  return entries.filter(entry => {
    const entryDate = getDateFromTimestamp(entry.createdAt);
    
    if (dateFrom && entryDate < dateFrom) {
      return false;
    }
    if (dateTo && entryDate > dateTo) {
      return false;
    }
    return true;
  });
}

/**
 * Filter entries by story ID
 * Requirements: 9.2
 */
export function filterEntriesByStory(
  entries: JournalEntry[],
  storyId: number
): JournalEntry[] {
  return entries.filter(entry => entry.storyId === storyId);
}

/**
 * Filter entries by category
 * Requirements: 9.2
 */
export function filterEntriesByCategory(
  entries: JournalEntry[],
  category: string
): JournalEntry[] {
  return entries.filter(entry => {
    if (!entry.storyId) return false;
    return getStoryCategory(entry.storyId) === category;
  });
}

/**
 * Apply all filters to entries
 * Requirements: 9.2
 */
export function applyFilters(
  entries: JournalEntry[],
  filters: JournalFilters
): JournalEntry[] {
  let result = [...entries];
  
  if (filters.storyId !== undefined) {
    result = filterEntriesByStory(result, filters.storyId);
  }
  
  if (filters.category) {
    result = filterEntriesByCategory(result, filters.category);
  }
  
  if (filters.dateFrom || filters.dateTo) {
    result = filterEntriesByDateRange(result, filters.dateFrom, filters.dateTo);
  }
  
  if (filters.mood) {
    result = result.filter(entry => entry.mood === filters.mood);
  }
  
  return result;
}


/**
 * Journal service interface for managing journal entries
 */
export interface IJournalService {
  createEntry(profileId: string, data: JournalEntryData): JournalEntry;
  updateEntry(profileId: string, entryId: string, data: Partial<JournalEntryData>): JournalEntry | null;
  deleteEntry(profileId: string, entryId: string): boolean;
  getEntries(profileId: string, filters?: JournalFilters): JournalEntry[];
  getEntry(profileId: string, entryId: string): JournalEntry | null;
  saveDraft(profileId: string, data: JournalEntryData): JournalDraft;
  getDraft(profileId: string): JournalDraft | null;
  clearDraft(profileId: string): void;
  getJournalRecord(profileId: string): JournalRecord;
}

/**
 * Create journal service instance
 */
export function createJournalService(): IJournalService {
  return {
    /**
     * Create a new journal entry
     * Property 11: Journal entry character limit
     * Requirements: 8.4
     */
    createEntry(profileId: string, data: JournalEntryData): JournalEntry {
      // Validate content length (Property 11)
      if (!validateContentLength(data.content)) {
        throw new Error(`Content exceeds maximum length of ${JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH} characters`);
      }
      
      const record = loadJournalRecord(profileId);
      const now = Date.now();
      
      const entry: JournalEntry = {
        id: generateJournalId(),
        profileId,
        title: data.title,
        content: data.content,
        mood: data.mood,
        storyId: data.storyId,
        promptUsed: data.promptUsed,
        createdAt: now,
        updatedAt: now,
      };
      
      record.entries.push(entry);
      
      // Clear draft after successful entry creation
      record.draft = null;
      
      saveJournalRecord(record);
      
      return entry;
    },

    /**
     * Update an existing journal entry
     * Property 11: Journal entry character limit
     * Requirements: 9.3
     */
    updateEntry(
      profileId: string,
      entryId: string,
      data: Partial<JournalEntryData>
    ): JournalEntry | null {
      // Validate content length if content is being updated (Property 11)
      if (data.content !== undefined && !validateContentLength(data.content)) {
        throw new Error(`Content exceeds maximum length of ${JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH} characters`);
      }
      
      const record = loadJournalRecord(profileId);
      const entryIndex = record.entries.findIndex(e => e.id === entryId);
      
      if (entryIndex === -1) {
        return null;
      }
      
      const existingEntry = record.entries[entryIndex];
      const updatedEntry: JournalEntry = {
        ...existingEntry,
        ...data,
        updatedAt: Date.now(),
      };
      
      record.entries[entryIndex] = updatedEntry;
      saveJournalRecord(record);
      
      return updatedEntry;
    },

    /**
     * Delete a journal entry
     * Requirements: 9.4
     */
    deleteEntry(profileId: string, entryId: string): boolean {
      const record = loadJournalRecord(profileId);
      const initialLength = record.entries.length;
      
      record.entries = record.entries.filter(e => e.id !== entryId);
      
      if (record.entries.length === initialLength) {
        return false; // Entry not found
      }
      
      saveJournalRecord(record);
      return true;
    },

    /**
     * Get journal entries with optional filters
     * Property 12: Journal chronological ordering
     * Requirements: 9.1, 9.2, 9.5
     */
    getEntries(profileId: string, filters?: JournalFilters): JournalEntry[] {
      const record = loadJournalRecord(profileId);
      let entries = [...record.entries];
      
      // Apply filters if provided
      if (filters) {
        entries = applyFilters(entries, filters);
      }
      
      // Sort in reverse chronological order (Property 12)
      return sortEntriesChronologically(entries);
    },

    /**
     * Get a single journal entry by ID
     */
    getEntry(profileId: string, entryId: string): JournalEntry | null {
      const record = loadJournalRecord(profileId);
      return record.entries.find(e => e.id === entryId) || null;
    },

    /**
     * Save a draft entry
     * Requirements: 8.5
     */
    saveDraft(profileId: string, data: JournalEntryData): JournalDraft {
      const record = loadJournalRecord(profileId);
      
      const draft: JournalDraft = {
        profileId,
        data,
        lastSaved: Date.now(),
      };
      
      record.draft = draft;
      saveJournalRecord(record);
      
      return draft;
    },

    /**
     * Get the current draft
     * Requirements: 8.5
     */
    getDraft(profileId: string): JournalDraft | null {
      const record = loadJournalRecord(profileId);
      return record.draft;
    },

    /**
     * Clear the current draft
     */
    clearDraft(profileId: string): void {
      const record = loadJournalRecord(profileId);
      record.draft = null;
      saveJournalRecord(record);
    },

    /**
     * Get full journal record for a profile
     */
    getJournalRecord(profileId: string): JournalRecord {
      return loadJournalRecord(profileId);
    },
  };
}

// Default journal service instance
export const journalService = createJournalService();

export default journalService;
