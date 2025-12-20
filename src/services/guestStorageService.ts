/**
 * Guest Storage Service for managing guest user data in localStorage
 * 
 * Requirements:
 * - 6.3: Store guest progress temporarily in localStorage
 * - 6.6: Offer to migrate localStorage progress to new account
 * 
 * Design Properties:
 * - Property 10: Guest localStorage persistence - progress updates stored and retrievable on reload
 */

import type { ProgressState } from '../types';
import type { UserPreferences } from '../types/auth';
import type { StreakRecord, ActivityLogEntry, ActivityType } from '../types/streak';
import type { KickEvent, KickRecord } from '../types/kick';
import type { JournalEntry, JournalDraft, JournalRecord } from '../types/journal';

/**
 * Storage keys for guest data
 */
export const GUEST_STORAGE_KEYS = {
  COMPLETED_STORIES: 'prenatal-learning-hub:completed-stories',
  PROGRESS_STATE: 'prenatal-learning-hub:progress-state',
  PREFERENCES: 'prenatal-learning-hub:preferences',
  STREAK_DATA: 'prenatal-learning-hub:streak-data',
  KICK_DATA: 'prenatal-learning-hub:kick-data',
  JOURNAL_DATA: 'prenatal-learning-hub:journal-data',
} as const;

/**
 * Guest profile ID used for localStorage data
 */
export const GUEST_PROFILE_ID = 'guest';

/**
 * Guest data summary for migration preview
 */
export interface GuestDataSummary {
  hasProgress: boolean;
  hasPreferences: boolean;
  hasStreakData: boolean;
  hasKickData: boolean;
  hasJournalData: boolean;
  completedStoriesCount: number;
  totalKicks: number;
  journalEntriesCount: number;
  currentStreak: number;
}

/**
 * Complete guest data for migration
 */
export interface GuestData {
  completedStories?: number[];
  progressState?: ProgressState;
  preferences?: Partial<UserPreferences>;
  streakData?: StreakRecord;
  kickData?: KickRecord;
  journalData?: JournalRecord;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__guest_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely parse JSON from localStorage
 */
function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Safely get item from localStorage
 */
function getItem(key: string): string | null {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    console.error(`Failed to read from localStorage for key "${key}":`, error);
    return null;
  }
}

/**
 * Safely set item in localStorage
 */
function setItem(key: string, value: string): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Failed to write to localStorage for key "${key}":`, error);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 */
function removeItem(key: string): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from localStorage for key "${key}":`, error);
  }
}

// ============================================================================
// Progress Management
// ============================================================================

/**
 * Get completed stories for guest user
 * Requirements: 6.3 - Store guest progress temporarily in localStorage
 */
export function getCompletedStories(): number[] {
  const data = safeJsonParse<number[]>(getItem(GUEST_STORAGE_KEYS.COMPLETED_STORIES));
  return Array.isArray(data) ? data : [];
}

/**
 * Save completed stories for guest user
 * Requirements: 6.3 - Store guest progress temporarily in localStorage
 */
export function saveCompletedStories(storyIds: number[]): boolean {
  return setItem(GUEST_STORAGE_KEYS.COMPLETED_STORIES, JSON.stringify(storyIds));
}

/**
 * Mark a story as completed for guest user
 * Requirements: 6.3 - Store guest progress temporarily in localStorage
 */
export function markStoryCompleted(storyId: number): boolean {
  const completed = getCompletedStories();
  if (!completed.includes(storyId)) {
    completed.push(storyId);
    return saveCompletedStories(completed);
  }
  return true;
}

/**
 * Check if a story is completed for guest user
 */
export function isStoryCompleted(storyId: number): boolean {
  return getCompletedStories().includes(storyId);
}

/**
 * Get progress state for guest user
 */
export function getProgressState(): ProgressState | null {
  return safeJsonParse<ProgressState>(getItem(GUEST_STORAGE_KEYS.PROGRESS_STATE));
}

/**
 * Save progress state for guest user
 */
export function saveProgressState(state: ProgressState): boolean {
  return setItem(GUEST_STORAGE_KEYS.PROGRESS_STATE, JSON.stringify(state));
}

// ============================================================================
// Preferences Management
// ============================================================================

/**
 * Get preferences for guest user
 */
export function getGuestPreferences(): Partial<UserPreferences> | null {
  return safeJsonParse<Partial<UserPreferences>>(getItem(GUEST_STORAGE_KEYS.PREFERENCES));
}

/**
 * Save preferences for guest user
 */
export function saveGuestPreferences(preferences: Partial<UserPreferences>): boolean {
  return setItem(GUEST_STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
}

// ============================================================================
// Streak Management
// ============================================================================

/**
 * Get streak data for guest user
 */
export function getGuestStreakData(): StreakRecord | null {
  return safeJsonParse<StreakRecord>(getItem(GUEST_STORAGE_KEYS.STREAK_DATA));
}

/**
 * Save streak data for guest user
 */
export function saveGuestStreakData(streakData: StreakRecord): boolean {
  return setItem(GUEST_STORAGE_KEYS.STREAK_DATA, JSON.stringify(streakData));
}

/**
 * Initialize empty streak record for guest
 */
export function initializeGuestStreak(): StreakRecord {
  return {
    profileId: GUEST_PROFILE_ID,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    activityLog: [],
    streakHistory: [],
  };
}

/**
 * Record activity for guest streak
 */
export function recordGuestActivity(type: ActivityType, referenceId?: string): StreakRecord {
  const streakData = getGuestStreakData() || initializeGuestStreak();
  
  const today = new Date().toISOString().split('T')[0];
  const entry: ActivityLogEntry = {
    date: today,
    type,
    referenceId,
    timestamp: Date.now(),
  };
  
  streakData.activityLog.push(entry);
  
  // Update streak calculation
  if (streakData.lastActivityDate === today) {
    // Already active today, no streak change
  } else if (streakData.lastActivityDate) {
    const lastDate = new Date(streakData.lastActivityDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      streakData.currentStreak += 1;
    } else {
      // Streak broken
      if (streakData.currentStreak > 0) {
        streakData.streakHistory.push({
          startDate: getStreakStartDate(streakData.lastActivityDate, streakData.currentStreak),
          endDate: streakData.lastActivityDate,
          length: streakData.currentStreak,
        });
      }
      streakData.currentStreak = 1;
    }
  } else {
    // First activity
    streakData.currentStreak = 1;
  }
  
  streakData.lastActivityDate = today;
  streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak);
  
  saveGuestStreakData(streakData);
  return streakData;
}

/**
 * Calculate streak start date
 */
function getStreakStartDate(endDate: string, streakLength: number): string {
  const end = new Date(endDate);
  end.setDate(end.getDate() - streakLength + 1);
  return end.toISOString().split('T')[0];
}

// ============================================================================
// Kick Management
// ============================================================================

/**
 * Get kick data for guest user
 */
export function getGuestKickData(): KickRecord | null {
  return safeJsonParse<KickRecord>(getItem(GUEST_STORAGE_KEYS.KICK_DATA));
}

/**
 * Save kick data for guest user
 */
export function saveGuestKickData(kickData: KickRecord): boolean {
  return setItem(GUEST_STORAGE_KEYS.KICK_DATA, JSON.stringify(kickData));
}

/**
 * Initialize empty kick record for guest
 */
export function initializeGuestKickRecord(): KickRecord {
  return {
    profileId: GUEST_PROFILE_ID,
    kicks: [],
    totalKicks: 0,
  };
}

/**
 * Log a kick event for guest user
 */
export function logGuestKick(kick: Omit<KickEvent, 'profileId'>): KickRecord {
  const kickData = getGuestKickData() || initializeGuestKickRecord();
  
  const kickEvent: KickEvent = {
    ...kick,
    profileId: GUEST_PROFILE_ID,
  };
  
  kickData.kicks.push(kickEvent);
  kickData.totalKicks += 1;
  
  saveGuestKickData(kickData);
  return kickData;
}

// ============================================================================
// Journal Management
// ============================================================================

/**
 * Get journal data for guest user
 */
export function getGuestJournalData(): JournalRecord | null {
  return safeJsonParse<JournalRecord>(getItem(GUEST_STORAGE_KEYS.JOURNAL_DATA));
}

/**
 * Save journal data for guest user
 */
export function saveGuestJournalData(journalData: JournalRecord): boolean {
  return setItem(GUEST_STORAGE_KEYS.JOURNAL_DATA, JSON.stringify(journalData));
}

/**
 * Initialize empty journal record for guest
 */
export function initializeGuestJournalRecord(): JournalRecord {
  return {
    userId: GUEST_PROFILE_ID,
    entries: [],
    draft: null,
  };
}

/**
 * Add journal entry for guest user
 */
export function addGuestJournalEntry(entry: Omit<JournalEntry, 'userId'>): JournalRecord {
  const journalData = getGuestJournalData() || initializeGuestJournalRecord();
  
  const journalEntry: JournalEntry = {
    ...entry,
    userId: GUEST_PROFILE_ID,
  };
  
  journalData.entries.push(journalEntry);
  
  saveGuestJournalData(journalData);
  return journalData;
}

/**
 * Save journal draft for guest user
 */
export function saveGuestJournalDraft(draft: Omit<JournalDraft, 'userId'>): boolean {
  const journalData = getGuestJournalData() || initializeGuestJournalRecord();
  
  journalData.draft = {
    ...draft,
    userId: GUEST_PROFILE_ID,
  };
  
  return saveGuestJournalData(journalData);
}

/**
 * Get journal draft for guest user
 */
export function getGuestJournalDraft(): JournalDraft | null {
  const journalData = getGuestJournalData();
  return journalData?.draft || null;
}

/**
 * Clear journal draft for guest user
 */
export function clearGuestJournalDraft(): boolean {
  const journalData = getGuestJournalData();
  if (journalData) {
    journalData.draft = null;
    return saveGuestJournalData(journalData);
  }
  return true;
}

// ============================================================================
// Migration Functions
// ============================================================================

/**
 * Check if there is any guest data to migrate
 * Requirements: 6.6 - Detect localStorage data on registration
 */
export function hasGuestData(): boolean {
  return !!(
    getItem(GUEST_STORAGE_KEYS.COMPLETED_STORIES) ||
    getItem(GUEST_STORAGE_KEYS.PROGRESS_STATE) ||
    getItem(GUEST_STORAGE_KEYS.PREFERENCES) ||
    getItem(GUEST_STORAGE_KEYS.STREAK_DATA) ||
    getItem(GUEST_STORAGE_KEYS.KICK_DATA) ||
    getItem(GUEST_STORAGE_KEYS.JOURNAL_DATA)
  );
}

/**
 * Get summary of guest data for migration preview
 * Requirements: 6.6 - Offer to migrate localStorage progress
 */
export function getGuestDataSummary(): GuestDataSummary {
  const completedStories = getCompletedStories();
  const progressState = getProgressState();
  const preferences = getGuestPreferences();
  const streakData = getGuestStreakData();
  const kickData = getGuestKickData();
  const journalData = getGuestJournalData();

  return {
    hasProgress: completedStories.length > 0 || progressState !== null,
    hasPreferences: preferences !== null,
    hasStreakData: streakData !== null && streakData.activityLog.length > 0,
    hasKickData: kickData !== null && kickData.kicks.length > 0,
    hasJournalData: journalData !== null && journalData.entries.length > 0,
    completedStoriesCount: completedStories.length,
    totalKicks: kickData?.totalKicks || 0,
    journalEntriesCount: journalData?.entries.length || 0,
    currentStreak: streakData?.currentStreak || 0,
  };
}

/**
 * Collect all guest data for migration
 * Requirements: 6.6 - Transfer progress, preferences to server
 */
export function collectGuestData(): GuestData {
  const data: GuestData = {};

  const completedStories = getCompletedStories();
  if (completedStories.length > 0) {
    data.completedStories = completedStories;
  }

  const progressState = getProgressState();
  if (progressState) {
    data.progressState = progressState;
  }

  const preferences = getGuestPreferences();
  if (preferences) {
    data.preferences = preferences;
  }

  const streakData = getGuestStreakData();
  if (streakData && streakData.activityLog.length > 0) {
    data.streakData = streakData;
  }

  const kickData = getGuestKickData();
  if (kickData && kickData.kicks.length > 0) {
    data.kickData = kickData;
  }

  const journalData = getGuestJournalData();
  if (journalData && journalData.entries.length > 0) {
    data.journalData = journalData;
  }

  return data;
}

/**
 * Clear all guest data from localStorage
 * Requirements: 6.6 - Clear localStorage after migration
 */
export function clearAllGuestData(): void {
  removeItem(GUEST_STORAGE_KEYS.COMPLETED_STORIES);
  removeItem(GUEST_STORAGE_KEYS.PROGRESS_STATE);
  removeItem(GUEST_STORAGE_KEYS.PREFERENCES);
  removeItem(GUEST_STORAGE_KEYS.STREAK_DATA);
  removeItem(GUEST_STORAGE_KEYS.KICK_DATA);
  removeItem(GUEST_STORAGE_KEYS.JOURNAL_DATA);
}

/**
 * Guest storage service object with all methods
 */
export const guestStorageService = {
  // Progress
  getCompletedStories,
  saveCompletedStories,
  markStoryCompleted,
  isStoryCompleted,
  getProgressState,
  saveProgressState,
  
  // Preferences
  getGuestPreferences,
  saveGuestPreferences,
  
  // Streaks
  getGuestStreakData,
  saveGuestStreakData,
  initializeGuestStreak,
  recordGuestActivity,
  
  // Kicks
  getGuestKickData,
  saveGuestKickData,
  initializeGuestKickRecord,
  logGuestKick,
  
  // Journal
  getGuestJournalData,
  saveGuestJournalData,
  initializeGuestJournalRecord,
  addGuestJournalEntry,
  saveGuestJournalDraft,
  getGuestJournalDraft,
  clearGuestJournalDraft,
  
  // Migration
  hasGuestData,
  getGuestDataSummary,
  collectGuestData,
  clearAllGuestData,
};

export default guestStorageService;
