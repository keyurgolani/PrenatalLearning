/**
 * Journal service for reflection and memory journaling
 * 
 * Requirements:
 * - 10.3: Display journal entries in a calendar view organized by date
 * - 10.4: Allow users to add new journal entries to the current date
 * - 10.5: Allow users to view and edit past journal entries by selecting a date
 * - 11.7: Display mood trends over time in a visual summary
 * 
 * Legacy Requirements (localStorage-based):
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
  MoodType,
} from '../types/journal';
import { JOURNAL_CONSTANTS } from '../types/journal';
import { storageService } from './storageService';
import { stories } from '../data/stories';
import { get, post, put, del } from './apiClient';

const JOURNAL_STORAGE_KEY = 'prenatal-learning-hub:journal-data';

/**
 * Types for API-based journal operations
 * Requirements: 10.3, 10.4, 10.5, 11.7
 */

/**
 * Calendar data showing which dates have entries
 * Requirements: 10.3 - Display journal entries in a calendar view
 */
export interface CalendarData {
  month: number;
  year: number;
  datesWithEntries: string[]; // Array of ISO date strings (YYYY-MM-DD)
  entryCountByDate: Record<string, number>;
}

/**
 * Mood statistics for visualization
 * Requirements: 11.7 - Display mood trends over time
 */
export interface MoodStats {
  totalEntries: number;
  moodCounts: Record<MoodType, number>;
  moodPercentages: Record<MoodType, number>;
  recentMoods: {
    date: string;
    mood: MoodType;
  }[];
  dominantMood: MoodType | null;
}

/**
 * Data for creating a new journal entry via API
 * Requirements: 10.4 - Add new journal entries
 */
export interface CreateJournalEntryData {
  journalDate: string; // ISO date string - logical date for the entry
  content?: string;
  mood?: MoodType | null;
  entryType?: 'text' | 'voice';
  topicReferences?: { topicId: number; title: string }[];
  journeyReferences?: { journeyId: string; title: string }[];
}

/**
 * Data for updating a journal entry via API
 * Requirements: 10.5 - Edit past journal entries
 */
/**
 * Data for updating a journal entry via API
 * Requirements: 10.5 - Edit past journal entries
 * Requirements: 11.1, 11.8, 11.9 - Mood is optional and nullable (can be cleared)
 */
export interface UpdateJournalEntryData {
  content?: string;
  mood?: MoodType | null;
  kickCount?: number;
  topicReferences?: { topicId: number; title: string }[];
  journeyReferences?: { journeyId: string; title: string }[];
}

/**
 * API response types
 */
interface ApiJournalEntry {
  id: string;
  profileId: string;
  journalDate: string; // Logical date for the entry
  content: string;
  mood?: MoodType | null;
  entryType?: 'text' | 'voice';
  topicReferences?: { topicId: number; title: string }[];
  journeyReferences?: { journeyId: string; title: string }[];
  voiceNoteIds?: string[];
  kickCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface JournalEntriesResponse {
  entries: ApiJournalEntry[];
}

interface JournalEntryResponse {
  entry: ApiJournalEntry;
}

interface CalendarDataResponse {
  month: number;
  year: number;
  datesWithEntries: string[];
  entryCountByDate: Record<string, number>;
}

interface MoodStatsResponse {
  totalEntries: number;
  moodCounts: Record<string, number>;
  moodPercentages: Record<string, number>;
  recentMoods: { date: string; mood: string }[];
  dominantMood: string | null;
}

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
 * Get the effective journal date, accounting for late-night journaling.
 * If the current time is between midnight and 4AM, returns the previous day's date.
 * This allows late-night journaling to count towards the previous day.
 * 
 * Requirements: 10.8 - Entries created between midnight and 4AM belong to previous day
 * Requirements: 10.11 - Default selected date to effective date
 * 
 * Property 13: Journal entry date assignment
 * For any journal entry created between midnight and 4AM, the journalDate field 
 * should be set to the previous day's date (normalized to midnight).
 * 
 * @param date - Optional date to calculate effective date for (defaults to current time)
 * @returns Date object normalized to midnight of the effective journal date
 */
export function getEffectiveJournalDate(date?: Date): Date {
  const now = date || new Date();
  const hour = now.getHours();
  
  // Create a new date object to avoid mutating the input
  const effectiveDate = new Date(now);
  
  // If before 4AM, use previous day
  if (hour < 4) {
    effectiveDate.setDate(effectiveDate.getDate() - 1);
  }
  
  // Normalize to midnight
  effectiveDate.setHours(0, 0, 0, 0);
  return effectiveDate;
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
 * Create empty journal record for a user
 */
function createEmptyJournalRecord(userId: string): JournalRecord {
  return {
    userId,
    entries: [],
    draft: null,
  };
}

/**
 * Load journal record from storage
 */
function loadJournalRecord(userId: string): JournalRecord {
  const data = storageService.get(JOURNAL_STORAGE_KEY);
  if (!data) {
    return createEmptyJournalRecord(userId);
  }
  
  try {
    const records: Record<string, JournalRecord> = JSON.parse(data);
    return records[userId] || createEmptyJournalRecord(userId);
  } catch {
    return createEmptyJournalRecord(userId);
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
  
  records[record.userId] = record;
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
        userId: profileId,
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
        userId: profileId,
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

// ============================================================================
// API-based Journal Service Functions
// These functions communicate with the backend API for authenticated users
// Requirements: 10.3, 10.4, 10.5, 11.7
// ============================================================================

/**
 * Convert API journal entry to local JournalEntry format
 */
function convertApiEntry(apiEntry: ApiJournalEntry): JournalEntry {
  return {
    id: apiEntry.id,
    userId: apiEntry.profileId, // API still returns profileId for backward compatibility
    title: '', // API entries don't have title, use empty string
    content: apiEntry.content,
    mood: apiEntry.mood || undefined,
    journalDate: apiEntry.journalDate, // Logical date for the entry
    entryType: apiEntry.entryType || 'text',
    voiceNoteIds: apiEntry.voiceNoteIds,
    kickCount: apiEntry.kickCount,
    createdAt: new Date(apiEntry.createdAt).getTime(),
    updatedAt: new Date(apiEntry.updatedAt).getTime(),
  };
}

/**
 * Get journal entries from the API with optional date range filter
 * Requirements: 10.3 - Display journal entries in a calendar view organized by date
 * 
 * @param startDate - Optional start date for filtering entries
 * @param endDate - Optional end date for filtering entries
 * @returns Promise resolving to array of journal entries
 */
export async function getEntries(
  startDate?: Date,
  endDate?: Date
): Promise<JournalEntry[]> {
  const params = new URLSearchParams();
  
  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }
  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }
  
  const queryString = params.toString();
  const endpoint = queryString ? `/journal?${queryString}` : '/journal';
  
  const response = await get<JournalEntriesResponse>(endpoint);
  return response.entries.map(convertApiEntry);
}

/**
 * Response type for getEntriesForDate API call
 */
interface EntriesForDateResponse {
  date: string;
  entries: ApiJournalEntry[];
  count: number;
}

/**
 * Get all journal entries for a specific date
 * Requirements: 10.9 - Multiple entries per date allowed
 * 
 * @param date - The date to get entries for (YYYY-MM-DD format or Date object)
 * @returns Promise resolving to array of journal entries for that date
 */
export async function getEntriesForDate(date: Date | string): Promise<JournalEntry[]> {
  // Format date as YYYY-MM-DD
  const dateString = typeof date === 'string' 
    ? date 
    : date.toISOString().split('T')[0];
  
  const response = await get<EntriesForDateResponse>(`/journal/date/${dateString}`);
  return response.entries.map(convertApiEntry);
}

/**
 * Get calendar data showing which dates have journal entries
 * Requirements: 10.3 - Display journal entries in a calendar view organized by date
 * Requirements: 10.7 - Display a visual indicator showing days with journal entries
 * 
 * @param month - Month (1-12)
 * @param year - Year (e.g., 2024)
 * @returns Promise resolving to calendar data with dates that have entries
 */
export async function getCalendarData(
  month: number,
  year: number
): Promise<CalendarData> {
  const response = await get<CalendarDataResponse>(
    `/journal/calendar?month=${month}&year=${year}`
  );
  
  return {
    month: response.month,
    year: response.year,
    datesWithEntries: response.datesWithEntries,
    entryCountByDate: response.entryCountByDate,
  };
}

/**
 * Create a new journal entry via API
 * Requirements: 10.4 - Allow users to add new journal entries to the current date
 * Requirements: 11.1, 11.8, 11.9 - Mood is optional, entries can have mood only (no content required)
 * 
 * @param data - Journal entry data including date, content, mood, and references
 * @returns Promise resolving to the created journal entry
 */
export async function createEntry(
  data: CreateJournalEntryData
): Promise<JournalEntry> {
  // Validate content length before sending to API (only if content is provided)
  if (data.content && !validateContentLength(data.content)) {
    throw new Error(`Content exceeds maximum length of ${JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH} characters`);
  }
  
  const response = await post<JournalEntryResponse>('/journal', data);
  return convertApiEntry(response.entry);
}

/**
 * Update an existing journal entry via API
 * Requirements: 10.5 - Allow users to view and edit past journal entries
 * Requirements: 11.1, 11.8, 11.9 - Mood is optional, entries can have mood only (no content required)
 * 
 * @param id - Journal entry ID
 * @param data - Partial journal entry data to update
 * @returns Promise resolving to the updated journal entry
 */
export async function updateEntry(
  id: string,
  data: UpdateJournalEntryData
): Promise<JournalEntry> {
  // Validate content length if content is being updated (only if content is provided and non-empty)
  if (data.content && !validateContentLength(data.content)) {
    throw new Error(`Content exceeds maximum length of ${JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH} characters`);
  }
  
  const response = await put<JournalEntryResponse>(`/journal/${id}`, data);
  return convertApiEntry(response.entry);
}

/**
 * Delete a journal entry via API
 * Requirements: 10.5 - Allow users to view and edit past journal entries
 * 
 * @param id - Journal entry ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function deleteEntry(id: string): Promise<void> {
  await del(`/journal/${id}`);
}

/**
 * Get mood statistics for visualization
 * Requirements: 11.7 - Display mood trends over time in a visual summary
 * 
 * @param days - Number of days to include in statistics (default: 30)
 * @returns Promise resolving to mood statistics
 */
export async function getMoodStats(days = 30): Promise<MoodStats> {
  const response = await get<MoodStatsResponse>(`/journal/moods?days=${days}`);
  
  // Convert string keys to MoodType
  const moodCounts: Record<MoodType, number> = {} as Record<MoodType, number>;
  const moodPercentages: Record<MoodType, number> = {} as Record<MoodType, number>;
  
  for (const [mood, count] of Object.entries(response.moodCounts)) {
    moodCounts[mood as MoodType] = count;
  }
  
  for (const [mood, percentage] of Object.entries(response.moodPercentages)) {
    moodPercentages[mood as MoodType] = percentage;
  }
  
  return {
    totalEntries: response.totalEntries,
    moodCounts,
    moodPercentages,
    recentMoods: response.recentMoods.map(item => ({
      date: item.date,
      mood: item.mood as MoodType,
    })),
    dominantMood: response.dominantMood as MoodType | null,
  };
}

/**
 * API-based journal service interface
 * Requirements: 10.3, 10.4, 10.5, 10.9, 11.7
 */
export interface IApiJournalService {
  getEntries(startDate?: Date, endDate?: Date): Promise<JournalEntry[]>;
  getEntriesForDate(date: Date | string): Promise<JournalEntry[]>;
  getCalendarData(month: number, year: number): Promise<CalendarData>;
  createEntry(data: CreateJournalEntryData): Promise<JournalEntry>;
  updateEntry(id: string, data: UpdateJournalEntryData): Promise<JournalEntry>;
  deleteEntry(id: string): Promise<void>;
  getMoodStats(days?: number): Promise<MoodStats>;
}

/**
 * API-based journal service object
 * Use this for authenticated users to communicate with the backend
 * Requirements: 10.3, 10.4, 10.5, 10.9, 11.7
 */
export const apiJournalService: IApiJournalService = {
  getEntries,
  getEntriesForDate,
  getCalendarData,
  createEntry,
  updateEntry,
  deleteEntry,
  getMoodStats,
};

export default journalService;
