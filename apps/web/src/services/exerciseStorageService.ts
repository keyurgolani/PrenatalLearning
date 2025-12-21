/**
 * Exercise Storage Service
 * 
 * Handles persistence of exercise responses and completion history to localStorage.
 * 
 * Requirements:
 * - 3.1: WHEN a user submits a text response to an exercise prompt THEN the system SHALL persist the response to local storage
 * - 3.2: WHEN a user returns to a previously completed exercise THEN the system SHALL display their previous responses
 * - 3.3: WHEN a user views their exercise history THEN the system SHALL display a list of completed exercises with timestamps
 * - 3.4: WHEN local storage contains exercise responses THEN the system SHALL serialize the data as JSON with exercise ID, prompt index, response text, and timestamp
 * 
 * Design Properties:
 * - Property 1: Exercise Response Round-Trip Persistence
 * - Property 5: Exercise Completion History Integrity
 */

import type {
  ExerciseResponse,
  ExerciseCompletionRecord,
  ExerciseStorageData,
} from '../types/exercises';

const EXERCISE_STORAGE_KEY = 'prenatal-learning-hub:exercise-data';

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__exercise_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the current storage data or initialize empty structure
 */
function getStorageData(): ExerciseStorageData {
  if (!isLocalStorageAvailable()) {
    return createEmptyStorageData();
  }

  try {
    const data = window.localStorage.getItem(EXERCISE_STORAGE_KEY);
    if (!data) {
      return createEmptyStorageData();
    }
    
    const parsed = JSON.parse(data) as ExerciseStorageData;
    // Validate structure
    if (!parsed.responses || !parsed.completionHistory) {
      return createEmptyStorageData();
    }
    return parsed;
  } catch (error) {
    console.error('Failed to read exercise storage data:', error);
    return createEmptyStorageData();
  }
}


/**
 * Create empty storage data structure
 */
function createEmptyStorageData(): ExerciseStorageData {
  return {
    responses: [],
    completionHistory: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Save storage data to localStorage
 */
function setStorageData(data: ExerciseStorageData): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available. Exercise data will not persist.');
    return false;
  }

  try {
    data.lastUpdated = new Date().toISOString();
    window.localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save exercise storage data:', error);
    return false;
  }
}

/**
 * Exercise Storage Service Interface
 */
export interface IExerciseStorageService {
  saveResponse(response: ExerciseResponse): boolean;
  getResponses(topicId: number): ExerciseResponse[];
  getCompletionHistory(): ExerciseCompletionRecord[];
  clearResponses(topicId: number): boolean;
}

/**
 * Exercise Storage Service Implementation
 * 
 * Provides methods for persisting and retrieving exercise responses
 * and completion history from localStorage.
 */
export const exerciseStorageService: IExerciseStorageService = {
  /**
   * Save an exercise response to storage
   * Updates existing response if one exists for the same exercise
   * Also updates completion history if the response is marked complete
   * 
   * @param response - The exercise response to save
   * @returns true if save was successful, false otherwise
   * 
   * Requirements: 3.1, 3.4
   */
  saveResponse(response: ExerciseResponse): boolean {
    try {
      const data = getStorageData();
      
      // Find existing response for this exercise
      const existingIndex = data.responses.findIndex(
        r => r.exerciseId === response.exerciseId && r.topicId === response.topicId
      );
      
      if (existingIndex >= 0) {
        // Update existing response
        data.responses[existingIndex] = response;
      } else {
        // Add new response
        data.responses.push(response);
      }
      
      // Update completion history if exercise is completed
      if (response.completed) {
        const existingHistoryIndex = data.completionHistory.findIndex(
          h => h.exerciseId === response.exerciseId && h.topicId === response.topicId
        );
        
        const completionRecord: ExerciseCompletionRecord = {
          topicId: response.topicId,
          exerciseId: response.exerciseId,
          completedAt: response.timestamp,
          score: response.score,
        };
        
        if (existingHistoryIndex >= 0) {
          data.completionHistory[existingHistoryIndex] = completionRecord;
        } else {
          data.completionHistory.push(completionRecord);
        }
      }
      
      return setStorageData(data);
    } catch (error) {
      console.error('Failed to save exercise response:', error);
      return false;
    }
  },

  /**
   * Get all responses for a specific topic
   * 
   * @param topicId - The topic ID to get responses for
   * @returns Array of exercise responses for the topic
   * 
   * Requirements: 3.2
   */
  getResponses(topicId: number): ExerciseResponse[] {
    try {
      const data = getStorageData();
      return data.responses.filter(r => r.topicId === topicId);
    } catch (error) {
      console.error('Failed to get exercise responses:', error);
      return [];
    }
  },

  /**
   * Get the complete exercise completion history
   * 
   * @returns Array of completion records with timestamps
   * 
   * Requirements: 3.3
   */
  getCompletionHistory(): ExerciseCompletionRecord[] {
    try {
      const data = getStorageData();
      return data.completionHistory;
    } catch (error) {
      console.error('Failed to get completion history:', error);
      return [];
    }
  },

  /**
   * Clear all responses for a specific topic
   * Also removes corresponding completion history entries
   * 
   * @param topicId - The topic ID to clear responses for
   * @returns true if clear was successful, false otherwise
   */
  clearResponses(topicId: number): boolean {
    try {
      const data = getStorageData();
      
      // Remove responses for this topic
      data.responses = data.responses.filter(r => r.topicId !== topicId);
      
      // Remove completion history for this topic
      data.completionHistory = data.completionHistory.filter(h => h.topicId !== topicId);
      
      return setStorageData(data);
    } catch (error) {
      console.error('Failed to clear exercise responses:', error);
      return false;
    }
  },
};

// Export storage key for testing purposes
export { EXERCISE_STORAGE_KEY };

export default exerciseStorageService;
