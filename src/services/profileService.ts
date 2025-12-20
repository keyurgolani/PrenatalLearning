/**
 * Profile Service for baby profile management
 * Requirements: 7.1, 7.2, 7.6, 7.7, 6.6
 */

import type { BabyProfile, CreateProfileData, UpdateProfileData } from '../types/auth';
import { get, post, put, del } from './apiClient';
import { storageService, STORAGE_KEYS } from './storageService';

/**
 * API response types
 */
interface ProfilesResponse {
  profiles: BabyProfile[];
}

interface ProfileResponse {
  profile: BabyProfile;
  message?: string;
}

interface ArchiveResponse {
  message: string;
}

interface MigrateResponse {
  message: string;
  migratedItems: {
    progress: number;
    preferences: number;
  };
}

/**
 * Local storage keys for guest data that can be migrated
 */
const GUEST_DATA_KEYS = {
  COMPLETED_STORIES: STORAGE_KEYS.COMPLETED_STORIES,
  PROGRESS_STATE: STORAGE_KEYS.PROGRESS_STATE,
  PREFERENCES: 'prenatal-learning-hub:preferences',
  STREAK_DATA: 'prenatal-learning-hub:streak-data',
  KICK_DATA: 'prenatal-learning-hub:kick-data',
  JOURNAL_DATA: 'prenatal-learning-hub:journal-data',
} as const;

/**
 * Get all profiles for the current user
 * Requirements: 7.2 - Allow unlimited baby profiles
 */
export async function getProfiles(): Promise<BabyProfile[]> {
  const response = await get<ProfilesResponse>('/profiles');
  return response.profiles;
}

/**
 * Create a new baby profile
 * Requirements: 7.1 - Create new baby profile with name and dates
 */
export async function createProfile(data: CreateProfileData): Promise<BabyProfile> {
  const response = await post<ProfileResponse>('/profiles', data);
  return response.profile;
}

/**
 * Get a single profile by ID
 */
export async function getProfile(id: string): Promise<BabyProfile> {
  const response = await get<ProfileResponse>(`/profiles/${id}`);
  return response.profile;
}

/**
 * Update a baby profile
 * Requirements: 7.6 - Allow editing baby profile details
 */
export async function updateProfile(id: string, data: UpdateProfileData): Promise<BabyProfile> {
  const response = await put<ProfileResponse>(`/profiles/${id}`, data);
  return response.profile;
}

/**
 * Archive (soft delete) a baby profile
 * Requirements: 7.7 - Allow archiving baby profiles while preserving data
 */
export async function archiveProfile(id: string): Promise<void> {
  await del<ArchiveResponse>(`/profiles/${id}`);
}

/**
 * Set a profile as the active profile
 * Requirements: 7.3 - Allow users to switch between baby profiles
 */
export async function setActiveProfile(id: string): Promise<BabyProfile> {
  const response = await post<ProfileResponse>(`/profiles/${id}/activate`);
  return response.profile;
}

/**
 * Check if there is guest data in localStorage that can be migrated
 * Requirements: 6.6 - Detect localStorage data on registration
 */
export function hasGuestData(): boolean {
  // Check for any guest data that could be migrated
  const completedStories = storageService.get(GUEST_DATA_KEYS.COMPLETED_STORIES);
  const progressState = storageService.get(GUEST_DATA_KEYS.PROGRESS_STATE);
  const preferences = storageService.get(GUEST_DATA_KEYS.PREFERENCES);
  const streakData = storageService.get(GUEST_DATA_KEYS.STREAK_DATA);
  const kickData = storageService.get(GUEST_DATA_KEYS.KICK_DATA);
  const journalData = storageService.get(GUEST_DATA_KEYS.JOURNAL_DATA);

  return !!(completedStories || progressState || preferences || streakData || kickData || journalData);
}

/**
 * Get guest data from localStorage for preview before migration
 */
export function getGuestDataSummary(): {
  hasProgress: boolean;
  hasPreferences: boolean;
  hasStreakData: boolean;
  hasKickData: boolean;
  hasJournalData: boolean;
  completedStoriesCount: number;
} {
  const completedStories = storageService.get(GUEST_DATA_KEYS.COMPLETED_STORIES);
  const progressState = storageService.get(GUEST_DATA_KEYS.PROGRESS_STATE);
  const preferences = storageService.get(GUEST_DATA_KEYS.PREFERENCES);
  const streakData = storageService.get(GUEST_DATA_KEYS.STREAK_DATA);
  const kickData = storageService.get(GUEST_DATA_KEYS.KICK_DATA);
  const journalData = storageService.get(GUEST_DATA_KEYS.JOURNAL_DATA);

  let completedStoriesCount = 0;
  if (completedStories) {
    try {
      const parsed = JSON.parse(completedStories);
      completedStoriesCount = Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      // Invalid JSON, ignore
    }
  }

  return {
    hasProgress: !!(completedStories || progressState),
    hasPreferences: !!preferences,
    hasStreakData: !!streakData,
    hasKickData: !!kickData,
    hasJournalData: !!journalData,
    completedStoriesCount,
  };
}

/**
 * Collect all guest data from localStorage for migration
 */
function collectGuestData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  // Collect completed stories
  const completedStories = storageService.get(GUEST_DATA_KEYS.COMPLETED_STORIES);
  if (completedStories) {
    try {
      data.completedStories = JSON.parse(completedStories);
    } catch {
      // Invalid JSON, skip
    }
  }

  // Collect progress state
  const progressState = storageService.get(GUEST_DATA_KEYS.PROGRESS_STATE);
  if (progressState) {
    try {
      data.progressState = JSON.parse(progressState);
    } catch {
      // Invalid JSON, skip
    }
  }

  // Collect preferences
  const preferences = storageService.get(GUEST_DATA_KEYS.PREFERENCES);
  if (preferences) {
    try {
      data.preferences = JSON.parse(preferences);
    } catch {
      // Invalid JSON, skip
    }
  }

  // Collect streak data
  const streakData = storageService.get(GUEST_DATA_KEYS.STREAK_DATA);
  if (streakData) {
    try {
      data.streakData = JSON.parse(streakData);
    } catch {
      // Invalid JSON, skip
    }
  }

  // Collect kick data
  const kickData = storageService.get(GUEST_DATA_KEYS.KICK_DATA);
  if (kickData) {
    try {
      data.kickData = JSON.parse(kickData);
    } catch {
      // Invalid JSON, skip
    }
  }

  // Collect journal data
  const journalData = storageService.get(GUEST_DATA_KEYS.JOURNAL_DATA);
  if (journalData) {
    try {
      data.journalData = JSON.parse(journalData);
    } catch {
      // Invalid JSON, skip
    }
  }

  return data;
}

/**
 * Clear all guest data from localStorage after successful migration
 */
function clearGuestData(): void {
  storageService.remove(GUEST_DATA_KEYS.COMPLETED_STORIES);
  storageService.remove(GUEST_DATA_KEYS.PROGRESS_STATE);
  storageService.remove(GUEST_DATA_KEYS.PREFERENCES);
  storageService.remove(GUEST_DATA_KEYS.STREAK_DATA);
  storageService.remove(GUEST_DATA_KEYS.KICK_DATA);
  storageService.remove(GUEST_DATA_KEYS.JOURNAL_DATA);
}

/**
 * Migrate guest localStorage data to the user's account on the server
 * Requirements: 6.6 - Transfer progress, preferences to server and clear localStorage
 * @param _profileId - Deprecated parameter, kept for backward compatibility
 */
export async function migrateLocalData(_profileId?: string): Promise<MigrateResponse> { // eslint-disable-line @typescript-eslint/no-unused-vars
  // Collect all guest data
  const guestData = collectGuestData();

  // If no data to migrate, return early
  if (Object.keys(guestData).length === 0) {
    return {
      message: 'No guest data to migrate',
      migratedItems: {
        progress: 0,
        preferences: 0,
      },
    };
  }

  // Send data to server for migration (now uses account endpoint instead of profile)
  const response = await post<MigrateResponse>('/account/migrate', {
    data: guestData,
  });

  // Clear localStorage after successful migration
  clearGuestData();

  return response;
}

/**
 * Profile service object with all methods
 */
export const profileService = {
  getProfiles,
  createProfile,
  getProfile,
  updateProfile,
  archiveProfile,
  setActiveProfile,
  hasGuestData,
  getGuestDataSummary,
  migrateLocalData,
};

export default profileService;
