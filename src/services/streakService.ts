/**
 * Streak tracking service for learning activity tracking
 * 
 * Requirements:
 * - 4.1: Track consecutive days of learning activity for logged-in users
 * - 4.2: Define learning activity as completing a story, exercise, or journal entry
 * - 4.4: Reset streak to zero if a day passes without activity
 * - 4.5: Provide grace period until midnight local time
 * - 4.6: Display streak milestones (7, 30, 100 days)
 * - 5.1: Store historical streak data
 * - 5.2: Display longest streak achieved
 * - 5.3: Show calendar view of learning activity days
 * - 5.4: Calculate total learning days
 * - 5.5: Show average activities per learning day
 * 
 * Design Properties:
 * - Property 5: Streak calculation correctness
 * - Property 6: Streak milestone detection
 * - Property 7: Longest streak tracking
 */

import type {
  ActivityType,
  ActivityLogEntry,
  StreakRecord,
  StreakUpdate,
  ActivityDay,
  StreakStats,
  StreakHistoryEntry,
} from '../types/streak';
import { STREAK_MILESTONES } from '../types/streak';
import { storageService } from './storageService';

const STREAK_STORAGE_KEY = 'prenatal-learning-hub:streak-data';

/**
 * Get today's date as ISO string (YYYY-MM-DD) in local timezone
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse ISO date string to Date object (at midnight local time)
 */
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the difference in days between two dates (ignoring time)
 */
export function getDaysDifference(date1: string, date2: string): number {
  const d1 = parseLocalDate(date1);
  const d2 = parseLocalDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if two dates are consecutive days
 */
export function areConsecutiveDays(earlier: string, later: string): boolean {
  return getDaysDifference(earlier, later) === 1;
}


/**
 * Calculate current streak from activity log
 * Property 5: Streak calculation correctness
 * For any sequence of activity dates, the current streak equals consecutive days ending with today/yesterday
 * 
 * Requirements: 4.1, 4.4, 4.5
 */
export function calculateCurrentStreak(
  activityLog: ActivityLogEntry[],
  today: string = getLocalDateString()
): number {
  if (activityLog.length === 0) {
    return 0;
  }

  // Get unique activity dates sorted in descending order (most recent first)
  const uniqueDates = [...new Set(activityLog.map(a => a.date))].sort().reverse();
  
  if (uniqueDates.length === 0) {
    return 0;
  }

  const mostRecentDate = uniqueDates[0];
  const daysSinceLast = getDaysDifference(mostRecentDate, today);

  // Grace period: streak is valid if last activity was today or yesterday
  // Requirements: 4.5
  if (daysSinceLast > 1) {
    return 0; // Streak broken - more than 1 day gap
  }

  // Count consecutive days backwards from most recent
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    if (areConsecutiveDays(uniqueDates[i], uniqueDates[i - 1])) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Detect if a streak count is a milestone
 * Property 6: Streak milestone detection
 * A milestone is detected if and only if count equals 7, 30, or 100
 * 
 * Requirements: 4.6
 */
export function detectMilestone(streakCount: number): number | null {
  if (STREAK_MILESTONES.includes(streakCount as typeof STREAK_MILESTONES[number])) {
    return streakCount;
  }
  return null;
}

/**
 * Calculate longest streak from history and current streak
 * Property 7: Longest streak tracking
 * Longest streak equals max of all historical streaks and current streak
 * 
 * Requirements: 5.2
 */
export function calculateLongestStreak(
  streakHistory: StreakHistoryEntry[],
  currentStreak: number
): number {
  const historicalMax = streakHistory.reduce(
    (max, entry) => Math.max(max, entry.length),
    0
  );
  return Math.max(historicalMax, currentStreak);
}

/**
 * Get unique learning days from activity log
 * Requirements: 5.4
 */
export function getUniqueLearningDays(activityLog: ActivityLogEntry[]): string[] {
  return [...new Set(activityLog.map(a => a.date))].sort();
}

/**
 * Calculate average activities per learning day
 * Requirements: 5.5
 */
export function calculateAverageActivities(activityLog: ActivityLogEntry[]): number {
  const uniqueDays = getUniqueLearningDays(activityLog);
  if (uniqueDays.length === 0) {
    return 0;
  }
  return activityLog.length / uniqueDays.length;
}


/**
 * Get activity calendar for a specific month
 * Requirements: 5.3
 */
export function getActivityCalendar(
  activityLog: ActivityLogEntry[],
  year: number,
  month: number
): ActivityDay[] {
  const monthStr = String(month).padStart(2, '0');
  const prefix = `${year}-${monthStr}`;
  
  // Filter activities for the specified month
  const monthActivities = activityLog.filter(a => a.date.startsWith(prefix));
  
  // Group by date
  const byDate = new Map<string, ActivityLogEntry[]>();
  for (const activity of monthActivities) {
    const existing = byDate.get(activity.date) || [];
    existing.push(activity);
    byDate.set(activity.date, existing);
  }
  
  // Convert to ActivityDay array
  const result: ActivityDay[] = [];
  for (const [date, activities] of byDate) {
    result.push({
      date,
      activityCount: activities.length,
      activityTypes: [...new Set(activities.map(a => a.type))],
    });
  }
  
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Create empty streak record for a profile
 */
function createEmptyStreakRecord(profileId: string): StreakRecord {
  return {
    profileId,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    activityLog: [],
    streakHistory: [],
  };
}

/**
 * Load streak record from storage
 */
function loadStreakRecord(profileId: string): StreakRecord {
  const data = storageService.get(STREAK_STORAGE_KEY);
  if (!data) {
    return createEmptyStreakRecord(profileId);
  }
  
  try {
    const records: Record<string, StreakRecord> = JSON.parse(data);
    return records[profileId] || createEmptyStreakRecord(profileId);
  } catch {
    return createEmptyStreakRecord(profileId);
  }
}

/**
 * Save streak record to storage
 */
function saveStreakRecord(record: StreakRecord): void {
  const data = storageService.get(STREAK_STORAGE_KEY);
  let records: Record<string, StreakRecord> = {};
  
  if (data) {
    try {
      records = JSON.parse(data);
    } catch {
      records = {};
    }
  }
  
  records[record.profileId] = record;
  storageService.set(STREAK_STORAGE_KEY, JSON.stringify(records));
}

/**
 * Update streak history when streak is broken
 */
function updateStreakHistory(
  record: StreakRecord,
  previousStreak: number,
  previousLastDate: string
): void {
  if (previousStreak > 0 && previousLastDate) {
    // Calculate start date from end date and streak length
    const endDate = parseLocalDate(previousLastDate);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - previousStreak + 1);
    
    record.streakHistory.push({
      startDate: getLocalDateString(startDate),
      endDate: previousLastDate,
      length: previousStreak,
    });
  }
}


/**
 * Streak service interface for managing learning streaks
 */
export interface IStreakService {
  getCurrentStreak(profileId: string): number;
  getLongestStreak(profileId: string): number;
  recordActivity(profileId: string, activityType: ActivityType, referenceId?: string): StreakUpdate;
  getStreakHistory(profileId: string): StreakHistoryEntry[];
  getActivityCalendar(profileId: string, year: number, month: number): ActivityDay[];
  getStreakStats(profileId: string): StreakStats;
  getStreakRecord(profileId: string): StreakRecord;
}

/**
 * Create streak service instance
 */
export function createStreakService(): IStreakService {
  return {
    /**
     * Get current streak for a profile
     * Requirements: 4.1
     */
    getCurrentStreak(profileId: string): number {
      const record = loadStreakRecord(profileId);
      return calculateCurrentStreak(record.activityLog);
    },

    /**
     * Get longest streak for a profile
     * Requirements: 5.2
     */
    getLongestStreak(profileId: string): number {
      const record = loadStreakRecord(profileId);
      const currentStreak = calculateCurrentStreak(record.activityLog);
      return calculateLongestStreak(record.streakHistory, currentStreak);
    },

    /**
     * Record a learning activity and update streak
     * Requirements: 4.1, 4.2, 4.4, 4.5, 4.6
     */
    recordActivity(
      profileId: string,
      activityType: ActivityType,
      referenceId?: string
    ): StreakUpdate {
      const record = loadStreakRecord(profileId);
      const today = getLocalDateString();
      
      // Store previous state for history tracking
      const previousStreak = calculateCurrentStreak(record.activityLog);
      const previousLastDate = record.lastActivityDate;
      
      // Check if streak was broken before this activity
      const wasStreakBroken = previousLastDate !== null && 
        getDaysDifference(previousLastDate, today) > 1;
      
      // If streak was broken, save to history
      if (wasStreakBroken && previousStreak > 0 && previousLastDate) {
        updateStreakHistory(record, previousStreak, previousLastDate);
      }
      
      // Add new activity
      const newActivity: ActivityLogEntry = {
        date: today,
        type: activityType,
        referenceId,
        timestamp: Date.now(),
      };
      record.activityLog.push(newActivity);
      record.lastActivityDate = today;
      
      // Calculate new streak
      const newStreak = calculateCurrentStreak(record.activityLog);
      record.currentStreak = newStreak;
      
      // Update longest streak
      record.longestStreak = calculateLongestStreak(record.streakHistory, newStreak);
      
      // Check for milestone
      const milestone = detectMilestone(newStreak);
      const isNewMilestone = milestone !== null && 
        (previousStreak < milestone || wasStreakBroken);
      
      // Save updated record
      saveStreakRecord(record);
      
      return {
        currentStreak: newStreak,
        longestStreak: record.longestStreak,
        isNewMilestone,
        milestone: isNewMilestone ? milestone : undefined,
      };
    },

    /**
     * Get streak history for a profile
     * Requirements: 5.1
     */
    getStreakHistory(profileId: string): StreakHistoryEntry[] {
      const record = loadStreakRecord(profileId);
      return [...record.streakHistory];
    },

    /**
     * Get activity calendar for a specific month
     * Requirements: 5.3
     */
    getActivityCalendar(profileId: string, year: number, month: number): ActivityDay[] {
      const record = loadStreakRecord(profileId);
      return getActivityCalendar(record.activityLog, year, month);
    },

    /**
     * Get comprehensive streak statistics
     * Requirements: 5.2, 5.4, 5.5
     */
    getStreakStats(profileId: string): StreakStats {
      const record = loadStreakRecord(profileId);
      const currentStreak = calculateCurrentStreak(record.activityLog);
      const longestStreak = calculateLongestStreak(record.streakHistory, currentStreak);
      const uniqueDays = getUniqueLearningDays(record.activityLog);
      
      return {
        currentStreak,
        longestStreak,
        totalLearningDays: uniqueDays.length,
        averageActivitiesPerDay: calculateAverageActivities(record.activityLog),
        lastActivityDate: record.lastActivityDate,
      };
    },

    /**
     * Get full streak record for a profile
     */
    getStreakRecord(profileId: string): StreakRecord {
      return loadStreakRecord(profileId);
    },
  };
}

// Default streak service instance
export const streakService = createStreakService();

export default streakService;
