/**
 * Streak API client for streak tracking endpoints
 * 
 * This module provides API-like interface for streak operations.
 * Currently uses localStorage via streakService, but designed to be
 * easily migrated to real HTTP endpoints.
 * 
 * Requirements:
 * - 4.1: Track consecutive days of learning activity
 * - 5.1: Store historical streak data
 * 
 * Endpoints:
 * - GET /api/streaks - Get current streak data
 * - POST /api/streaks/activity - Record activity
 * - GET /api/streaks/history - Get streak history
 * - GET /api/streaks/calendar - Get activity calendar
 */

import type {
  ActivityType,
  StreakUpdate,
  StreakStats,
  StreakHistoryEntry,
  ActivityDay,
  StreakRecord,
} from '../types/streak';
import { streakService } from './streakService';

/**
 * Response wrapper for API-like responses
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * GET /api/streaks
 * Get current streak data for a profile
 * Requirements: 4.1, 5.1
 */
export async function getStreaks(profileId: string): Promise<ApiResponse<StreakStats>> {
  try {
    const stats = streakService.getStreakStats(profileId);
    return { success: true, data: stats };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get streak data' 
    };
  }
}

/**
 * POST /api/streaks/activity
 * Record a learning activity
 * Requirements: 4.1, 4.2, 4.6
 */
export async function recordActivity(
  profileId: string,
  activityType: ActivityType,
  referenceId?: string
): Promise<ApiResponse<StreakUpdate>> {
  try {
    const update = streakService.recordActivity(profileId, activityType, referenceId);
    return { success: true, data: update };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to record activity' 
    };
  }
}


/**
 * GET /api/streaks/history
 * Get streak history for a profile
 * Requirements: 5.1
 */
export async function getStreakHistory(
  profileId: string
): Promise<ApiResponse<StreakHistoryEntry[]>> {
  try {
    const history = streakService.getStreakHistory(profileId);
    return { success: true, data: history };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get streak history' 
    };
  }
}

/**
 * GET /api/streaks/calendar
 * Get activity calendar for a specific month
 * Requirements: 5.3
 */
export async function getStreakCalendar(
  profileId: string,
  year: number,
  month: number
): Promise<ApiResponse<ActivityDay[]>> {
  try {
    const calendar = streakService.getActivityCalendar(profileId, year, month);
    return { success: true, data: calendar };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get activity calendar' 
    };
  }
}

/**
 * GET /api/streaks/record
 * Get full streak record for a profile (for debugging/admin)
 */
export async function getStreakRecord(
  profileId: string
): Promise<ApiResponse<StreakRecord>> {
  try {
    const record = streakService.getStreakRecord(profileId);
    return { success: true, data: record };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get streak record' 
    };
  }
}

/**
 * Streak API object for convenient access
 */
export const streakApi = {
  getStreaks,
  recordActivity,
  getStreakHistory,
  getStreakCalendar,
  getStreakRecord,
};

export default streakApi;
