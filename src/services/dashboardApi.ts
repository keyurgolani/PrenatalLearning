/**
 * Dashboard API client for progress dashboard endpoints
 * 
 * This module provides API-like interface for dashboard operations.
 * Currently uses localStorage via dashboardService, but designed to be
 * easily migrated to real HTTP endpoints.
 * 
 * Requirements:
 * - 11.1: Display total stories completed and percentage of library
 * - 11.2: Display completion progress by category with visual indicators
 * - 11.3: Display completion progress by trimester
 * - 11.4: Show recent activity timeline
 * - 11.5: Display current streak and longest streak
 * - 11.6: Show total journal entries and kick events logged
 * 
 * Endpoints:
 * - GET /api/dashboard - Get aggregated dashboard stats
 * - GET /api/dashboard/category-progress - Get category progress
 * - GET /api/dashboard/trimester-progress - Get trimester progress
 * - GET /api/dashboard/activity - Get recent activity timeline
 */

import type {
  DashboardStats,
  CategoryProgress,
  TrimesterProgress,
  ActivityEntry,
} from '../types/dashboard';
import { dashboardService } from './dashboardService';

/**
 * Response wrapper for API-like responses
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * GET /api/dashboard
 * Get aggregated dashboard statistics
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
export async function getDashboard(
  profileId: string
): Promise<ApiResponse<DashboardStats>> {
  try {
    const stats = dashboardService.getDashboardStats(profileId);
    return { success: true, data: stats };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get dashboard stats',
    };
  }
}


/**
 * GET /api/dashboard/category-progress
 * Get category progress statistics
 * Requirements: 11.2
 */
export async function getCategoryProgress(
  profileId: string
): Promise<ApiResponse<CategoryProgress[]>> {
  try {
    const progress = dashboardService.getCategoryProgress(profileId);
    return { success: true, data: progress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get category progress',
    };
  }
}

/**
 * GET /api/dashboard/trimester-progress
 * Get trimester progress statistics
 * Requirements: 11.3
 */
export async function getTrimesterProgress(
  profileId: string
): Promise<ApiResponse<TrimesterProgress[]>> {
  try {
    const progress = dashboardService.getTrimesterProgress(profileId);
    return { success: true, data: progress };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get trimester progress',
    };
  }
}

/**
 * GET /api/dashboard/activity
 * Get recent activity timeline
 * Requirements: 11.4
 */
export async function getRecentActivity(
  profileId: string,
  limit?: number
): Promise<ApiResponse<ActivityEntry[]>> {
  try {
    const activity = dashboardService.getRecentActivity(profileId, limit);
    return { success: true, data: activity };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get recent activity',
    };
  }
}

/**
 * Dashboard API object for convenient access
 */
export const dashboardApi = {
  getDashboard,
  getCategoryProgress,
  getTrimesterProgress,
  getRecentActivity,
};

export default dashboardApi;
