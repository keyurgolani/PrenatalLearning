/**
 * Preferences Service for user preferences management
 * Requirements: 9.1 - Persist theme preferences to user account
 * Requirements: 9.5 - Apply saved preferences on login
 */

import type { UserPreferences } from '../types/auth';
import { DEFAULT_USER_PREFERENCES } from '../types/auth';
import { get, put } from './apiClient';

/**
 * API response types
 */
interface PreferencesResponse {
  preferences: UserPreferences;
}

interface UpdatePreferencesResponse {
  message: string;
  preferences: UserPreferences;
}

/**
 * Local storage key for guest preferences
 */
const GUEST_PREFERENCES_KEY = 'prenatal_hub_guest_preferences';

/**
 * Load preferences from localStorage for guest users
 * Requirements: 9.5 - Load preferences on app start
 */
export function loadGuestPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(GUEST_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_USER_PREFERENCES,
        ...parsed,
        // Merge nested objects properly
        notifications: {
          ...DEFAULT_USER_PREFERENCES.notifications,
          ...(parsed.notifications || {}),
        },
        accessibility: {
          ...DEFAULT_USER_PREFERENCES.accessibility,
          ...(parsed.accessibility || {}),
        },
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Failed to load guest preferences:', err);
  }
  return {
    ...DEFAULT_USER_PREFERENCES,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Save preferences to localStorage for guest users
 */
export function saveGuestPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(GUEST_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (err) {
    console.warn('Failed to save guest preferences:', err);
  }
}

/**
 * Clear guest preferences from localStorage
 */
export function clearGuestPreferences(): void {
  try {
    localStorage.removeItem(GUEST_PREFERENCES_KEY);
  } catch (err) {
    console.warn('Failed to clear guest preferences:', err);
  }
}

/**
 * Get preferences from the server for authenticated users
 * Requirements: 9.1 - Persist theme preferences to user account
 * Requirements: 9.5 - Apply saved preferences on login
 */
export async function getPreferences(): Promise<UserPreferences> {
  const response = await get<PreferencesResponse>('/preferences');
  return response.preferences;
}

/**
 * Update preferences on the server for authenticated users
 * Requirements: 9.1 - Persist theme preferences to user account
 */
export async function updatePreferences(
  updates: Partial<Omit<UserPreferences, 'updatedAt'>>
): Promise<UserPreferences> {
  const response = await put<UpdatePreferencesResponse>('/preferences', updates);
  return response.preferences;
}

/**
 * Preferences service object with all methods
 */
export const preferencesService = {
  getPreferences,
  updatePreferences,
  loadGuestPreferences,
  saveGuestPreferences,
  clearGuestPreferences,
  GUEST_PREFERENCES_KEY,
};

export default preferencesService;
