import type { StorageService } from '../types';

/**
 * Local storage service implementation for persisting data
 * 
 * Requirements:
 * - 2.1: WHEN a user marks a story as complete THEN the System SHALL persist the completion status to local storage
 * - 7.1: WHEN the application loads THEN the System SHALL store story data locally for offline access
 * - 7.2: WHEN a user marks progress offline THEN the System SHALL persist changes to local storage
 * 
 * Design Properties:
 * - Property 4: Completion Persistence Round-Trip - marking complete and reading returns the story ID
 * 
 * Error Handling:
 * - If localStorage is unavailable, operations fail gracefully with console warnings
 * - Failed storage writes log errors but don't interrupt user experience
 * - Failed storage reads return null
 */

/**
 * Check if localStorage is available
 * @returns true if localStorage is available and functional
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a local storage service instance
 * @returns StorageService implementation using localStorage
 */
export function createStorageService(): StorageService {
  const storageAvailable = isLocalStorageAvailable();

  return {
    /**
     * Get a value from localStorage
     * @param key - The key to retrieve
     * @returns The stored value or null if not found or storage unavailable
     */
    get(key: string): string | null {
      if (!storageAvailable) {
        console.warn('localStorage is not available. Using in-memory fallback.');
        return null;
      }

      try {
        return window.localStorage.getItem(key);
      } catch (error) {
        console.error(`Failed to read from localStorage for key "${key}":`, error);
        return null;
      }
    },

    /**
     * Set a value in localStorage
     * @param key - The key to store under
     * @param value - The value to store
     */
    set(key: string, value: string): void {
      if (!storageAvailable) {
        console.warn('localStorage is not available. Data will not persist.');
        return;
      }

      try {
        window.localStorage.setItem(key, value);
      } catch (error) {
        console.error(`Failed to write to localStorage for key "${key}":`, error);
      }
    },

    /**
     * Remove a value from localStorage
     * @param key - The key to remove
     */
    remove(key: string): void {
      if (!storageAvailable) {
        console.warn('localStorage is not available.');
        return;
      }

      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove from localStorage for key "${key}":`, error);
      }
    },
  };
}

// Default storage service instance
export const storageService = createStorageService();

// Storage keys constants
export const STORAGE_KEYS = {
  COMPLETED_STORIES: 'prenatal-learning-hub:completed-stories',
  PROGRESS_STATE: 'prenatal-learning-hub:progress-state',
} as const;

export default storageService;
