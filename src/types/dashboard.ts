/**
 * Dashboard types for progress tracking and statistics
 * 
 * Requirements:
 * - 11.1: Display total stories completed and percentage of library
 * - 11.2: Display completion progress by category with visual indicators
 * - 11.3: Display completion progress by trimester
 * - 11.4: Show recent activity timeline
 * - 11.5: Display current streak and longest streak
 * - 11.6: Show total journal entries and kick events logged
 * 
 * Design Properties:
 * - Property 15: Progress percentage calculation
 */

import type { CategoryId } from './index';
import type { Trimester } from './trimester';
import type { ActivityType } from './streak';

/**
 * Category progress statistics
 * Requirements: 11.2
 */
export interface CategoryProgress {
  category: CategoryId;
  categoryName: string;
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Trimester progress statistics
 * Requirements: 11.3
 */
export interface TrimesterProgress {
  trimester: Trimester;
  trimesterName: string;
  completed: number;
  total: number;
  percentage: number;
}

/**
 * Activity entry for timeline
 * Requirements: 11.4
 */
export interface ActivityEntry {
  id: string;
  type: ActivityType | 'kick';
  timestamp: number;
  referenceId?: string;
  title: string;
  description?: string;
}

/**
 * Comprehensive dashboard statistics
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
export interface DashboardStats {
  /** Total stories completed */
  storiesCompleted: number;
  /** Total stories in library */
  totalStories: number;
  /** Overall completion percentage */
  completionPercentage: number;
  /** Progress by category */
  categoryProgress: CategoryProgress[];
  /** Progress by trimester */
  trimesterProgress: TrimesterProgress[];
  /** Current learning streak */
  currentStreak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Total journal entries */
  totalJournalEntries: number;
  /** Total kick events logged */
  totalKicks: number;
  /** Recent activity timeline */
  recentActivity: ActivityEntry[];
}

/**
 * Dashboard constants
 */
export const DASHBOARD_CONSTANTS = {
  /** Maximum recent activities to display */
  MAX_RECENT_ACTIVITIES: 10,
  /** Trimester display names */
  TRIMESTER_NAMES: {
    first: 'First Trimester',
    second: 'Second Trimester',
    third: 'Third Trimester',
    any: 'Any Trimester',
  } as Record<Trimester, string>,
} as const;
