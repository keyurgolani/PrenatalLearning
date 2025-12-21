import type { Story } from '../types';
import type { LearningStep } from '../contexts/TopicProgressContext';
import { LEARNING_STEPS } from '../contexts/TopicProgressContext';
import type { LearningPath } from '../data/learningPaths';
import { defaultLearningPath } from '../data/learningPaths';

/**
 * Continue Learning Service
 * 
 * Tracks the last viewed story and section for each user, enabling
 * "Continue Where You Left Off" functionality.
 * 
 * Requirements:
 * - 5.1: THE System SHALL track the last viewed story and section for each user
 * 
 * Design Properties:
 * - Stores data in localStorage for unauthenticated users
 * - Can be extended to sync with server for authenticated users
 */

const LAST_VIEWED_STORAGE_KEY = 'prenatal-learning-hub:last-viewed';

/**
 * Data structure for tracking last viewed story and section
 */
export interface LastViewedData {
  storyId: number;
  sectionName: LearningStep;
  stepIndex: number;
  lastViewedAt: string; // ISO date string
  progressPercentage: number;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__continue_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the last viewed story and section data
 * @param _profileId - Optional profile ID for future server sync support
 * @returns LastViewedData or null if not found
 */
export function getLastViewed(_profileId?: string): LastViewedData | null {
  // Note: _profileId is reserved for future server sync support
  void _profileId;
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available for continue service');
    return null;
  }

  try {
    const stored = localStorage.getItem(LAST_VIEWED_STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored) as LastViewedData;
    
    // Validate the data structure
    if (
      typeof data.storyId !== 'number' ||
      typeof data.sectionName !== 'string' ||
      typeof data.stepIndex !== 'number' ||
      typeof data.lastViewedAt !== 'string' ||
      typeof data.progressPercentage !== 'number'
    ) {
      console.warn('Invalid last viewed data structure, clearing');
      localStorage.removeItem(LAST_VIEWED_STORAGE_KEY);
      return null;
    }

    // Validate sectionName is a valid LearningStep
    if (!LEARNING_STEPS.includes(data.sectionName as LearningStep)) {
      console.warn('Invalid section name in last viewed data');
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to parse last viewed data:', error);
    return null;
  }
}

/**
 * Set the last viewed story and section data
 * @param data - The last viewed data to store
 */
export function setLastViewed(data: LastViewedData): void {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available for continue service');
    return;
  }

  try {
    // Validate data before storing
    if (
      typeof data.storyId !== 'number' ||
      !LEARNING_STEPS.includes(data.sectionName)
    ) {
      console.error('Invalid data provided to setLastViewed');
      return;
    }

    // Ensure progressPercentage is within valid range
    const validatedData: LastViewedData = {
      ...data,
      progressPercentage: Math.max(0, Math.min(100, data.progressPercentage)),
      lastViewedAt: data.lastViewedAt || new Date().toISOString(),
    };

    localStorage.setItem(LAST_VIEWED_STORAGE_KEY, JSON.stringify(validatedData));
  } catch (error) {
    console.error('Failed to save last viewed data:', error);
  }
}

/**
 * Clear the last viewed data
 */
export function clearLastViewed(): void {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(LAST_VIEWED_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear last viewed data:', error);
  }
}

/**
 * Get the next suggested story based on completed stories and active learning path
 * @param completedStories - Array of completed story IDs
 * @param stories - All available stories
 * @param activePath - The active learning path (defaults to default path)
 * @returns The next suggested story or null if all completed
 */
export function getNextSuggested(
  completedStories: number[],
  stories: Story[],
  activePath: LearningPath = defaultLearningPath
): Story | null {
  const completedSet = new Set(completedStories);
  const storyMap = new Map(stories.map(story => [story.id, story]));

  // Find the first uncompleted story in the learning path
  for (const storyId of activePath.storyOrder) {
    if (!completedSet.has(storyId)) {
      const story = storyMap.get(storyId);
      if (story) return story;
    }
  }

  // If all stories in the path are completed, return null
  return null;
}

/**
 * Calculate progress percentage based on completed steps
 * @param completedSteps - Array of completed learning steps
 * @returns Progress percentage (0-100)
 */
export function calculateProgressPercentage(completedSteps: LearningStep[]): number {
  if (!completedSteps || completedSteps.length === 0) return 0;
  return Math.round((completedSteps.length / LEARNING_STEPS.length) * 100);
}

/**
 * Update last viewed when user navigates to a story section
 * @param storyId - The story ID being viewed
 * @param sectionName - The section/step being viewed
 * @param completedSteps - Array of completed steps for progress calculation
 */
export function updateLastViewed(
  storyId: number,
  sectionName: LearningStep,
  completedSteps: LearningStep[] = []
): void {
  const stepIndex = LEARNING_STEPS.indexOf(sectionName);
  const progressPercentage = calculateProgressPercentage(completedSteps);

  setLastViewed({
    storyId,
    sectionName,
    stepIndex,
    lastViewedAt: new Date().toISOString(),
    progressPercentage,
  });
}

/**
 * Format the last viewed date for display
 * @param isoDate - ISO date string
 * @returns Formatted date string (e.g., "Today", "Yesterday", "Dec 15")
 */
export function formatLastViewedDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

// Export service object for convenience
export const continueService = {
  getLastViewed,
  setLastViewed,
  clearLastViewed,
  getNextSuggested,
  calculateProgressPercentage,
  updateLastViewed,
  formatLastViewedDate,
};

export default continueService;
