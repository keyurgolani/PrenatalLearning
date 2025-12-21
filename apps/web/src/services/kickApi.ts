/**
 * Kick API client for kick counter endpoints
 * 
 * This module provides API-like interface for kick operations.
 * Currently uses localStorage via kickService, but designed to be
 * easily migrated to real HTTP endpoints.
 * 
 * Requirements:
 * - 6.2: Record timestamp, story ID, and section when kick is logged
 * - 7.1: Aggregate kick counts by story and category
 * - 7.3: Show kick activity over time
 * - 7.5: Allow filtering kick history by date range
 * 
 * Endpoints:
 * - POST /api/kicks - Log kick event
 * - GET /api/kicks/stats - Get kick statistics
 * - GET /api/kicks/by-story - Get kicks grouped by story
 * - GET /api/kicks/timeline - Get kicks over time
 */

import type {
  KickEvent,
  KickStats,
  StoryKickCount,
  KickTimelineEntry,
  DateRange,
  KickRecord,
} from '../types/kick';
import { kickService } from './kickService';

/**
 * Response wrapper for API-like responses
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * POST /api/kicks
 * Log a kick event
 * Requirements: 6.2
 */
export async function logKick(
  profileId: string,
  storyId: number,
  sectionName: string,
  sessionId: string
): Promise<ApiResponse<KickEvent>> {
  try {
    const kick = kickService.logKick(profileId, storyId, sectionName, sessionId);
    return { success: true, data: kick };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to log kick',
    };
  }
}

/**
 * GET /api/kicks/stats
 * Get kick statistics for a profile
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export async function getKickStats(
  profileId: string
): Promise<ApiResponse<KickStats>> {
  try {
    const stats = kickService.getKickStats(profileId);
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get kick stats',
    };
  }
}

/**
 * GET /api/kicks/by-story
 * Get kicks grouped by story
 * Requirements: 7.1
 */
export async function getKicksByStory(
  profileId: string
): Promise<ApiResponse<StoryKickCount[]>> {
  try {
    const kicksByStory = kickService.getKicksByStory(profileId);
    return { success: true, data: kicksByStory };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get kicks by story',
    };
  }
}

/**
 * GET /api/kicks/timeline
 * Get kicks over time with optional date range filter
 * Requirements: 7.3, 7.5
 */
export async function getKickTimeline(
  profileId: string,
  dateRange?: DateRange
): Promise<ApiResponse<KickTimelineEntry[]>> {
  try {
    const timeline = kickService.getKickTimeline(profileId, dateRange);
    return { success: true, data: timeline };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get kick timeline',
    };
  }
}

/**
 * GET /api/kicks/session
 * Get kicks for a specific session
 * Requirements: 6.4
 */
export async function getSessionKicks(
  profileId: string,
  sessionId: string
): Promise<ApiResponse<KickEvent[]>> {
  try {
    const kicks = kickService.getSessionKicks(profileId, sessionId);
    return { success: true, data: kicks };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get session kicks',
    };
  }
}

/**
 * GET /api/kicks/session/count
 * Get kick count for a specific session
 * Requirements: 6.4
 */
export async function getSessionKickCount(
  profileId: string,
  sessionId: string
): Promise<ApiResponse<number>> {
  try {
    const count = kickService.getSessionKickCount(profileId, sessionId);
    return { success: true, data: count };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get session kick count',
    };
  }
}

/**
 * GET /api/kicks
 * Get all kicks for a profile
 * Requirements: 7.4
 */
export async function getAllKicks(
  profileId: string
): Promise<ApiResponse<KickEvent[]>> {
  try {
    const kicks = kickService.getAllKicks(profileId);
    return { success: true, data: kicks };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get all kicks',
    };
  }
}

/**
 * GET /api/kicks/record
 * Get full kick record for a profile (for debugging/admin)
 */
export async function getKickRecord(
  profileId: string
): Promise<ApiResponse<KickRecord>> {
  try {
    const record = kickService.getKickRecord(profileId);
    return { success: true, data: record };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get kick record',
    };
  }
}

/**
 * Kick API object for convenient access
 */
export const kickApi = {
  logKick,
  getKickStats,
  getKicksByStory,
  getKickTimeline,
  getSessionKicks,
  getSessionKickCount,
  getAllKicks,
  getKickRecord,
};

export default kickApi;
