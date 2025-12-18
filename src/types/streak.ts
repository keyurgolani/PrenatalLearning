/**
 * Streak tracking types for learning activity tracking
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 5.2, 5.3, 5.4, 5.5
 */

/**
 * Types of activities that count toward streak
 * Requirements: 4.2
 */
export type ActivityType = 'story_complete' | 'exercise_complete' | 'journal_entry';

/**
 * Single activity log entry
 */
export interface ActivityLogEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  type: ActivityType;
  referenceId?: string; // storyId, exerciseId, or journalId
  timestamp: number; // Unix timestamp
}

/**
 * Historical streak record
 */
export interface StreakHistoryEntry {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  length: number;
}

/**
 * Complete streak record for a user
 */
export interface StreakRecord {
  profileId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // ISO date string
  activityLog: ActivityLogEntry[];
  streakHistory: StreakHistoryEntry[];
}

/**
 * Result of recording an activity
 * Requirements: 4.6
 */
export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  isNewMilestone: boolean;
  milestone?: number; // 7, 30, 100
}

/**
 * Activity day for calendar view
 * Requirements: 5.3
 */
export interface ActivityDay {
  date: string; // ISO date string
  activityCount: number;
  activityTypes: ActivityType[];
}

/**
 * Streak statistics
 * Requirements: 5.2, 5.4, 5.5
 */
export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalLearningDays: number;
  averageActivitiesPerDay: number;
  lastActivityDate: string | null;
}

/**
 * Milestone values for streak achievements
 * Requirements: 4.6
 */
export const STREAK_MILESTONES = [7, 30, 100] as const;
export type StreakMilestone = typeof STREAK_MILESTONES[number];
