/**
 * Dashboard service for aggregating progress statistics
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

import type {
  DashboardStats,
  CategoryProgress,
  TrimesterProgress,
  ActivityEntry,
} from '../types/dashboard';
import type { CategoryId, Story } from '../types';
import type { Trimester } from '../types/trimester';
import { DASHBOARD_CONSTANTS } from '../types/dashboard';
import { stories } from '../data/stories';
import { categories } from '../data/categories';
import { streakService } from './streakService';
import { kickService } from './kickService';
import { journalService } from './journalService';
import { storageService } from './storageService';

const COMPLETED_STORIES_KEY = 'prenatal-learning-hub:completed-stories';

/**
 * Calculate percentage with rounding
 * Property 15: Progress percentage calculation
 * For any progress display, percentage = (completed / total) * 100, rounded to nearest integer
 * Requirements: 11.1, 11.2, 11.3
 */
export function calculatePercentage(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get completed story IDs from storage
 */
export function getCompletedStoryIds(profileId: string): number[] {
  const key = `${COMPLETED_STORIES_KEY}:${profileId}`;
  const data = storageService.get(key);
  if (!data) return [];
  
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter((id): id is number => typeof id === 'number');
    }
    return [];
  } catch {
    return [];
  }
}


/**
 * Calculate category progress
 * Requirements: 11.2
 */
export function calculateCategoryProgress(
  completedIds: number[],
  allStories: Story[]
): CategoryProgress[] {
  const completedSet = new Set(completedIds);
  const categoryStats = new Map<CategoryId, { completed: number; total: number }>();
  
  // Initialize all categories (excluding 'all')
  for (const category of categories) {
    if (category.id !== 'all') {
      categoryStats.set(category.id, { completed: 0, total: 0 });
    }
  }
  
  // Count stories per category
  for (const story of allStories) {
    const stats = categoryStats.get(story.category);
    if (stats) {
      stats.total++;
      if (completedSet.has(story.id)) {
        stats.completed++;
      }
    }
  }
  
  // Convert to CategoryProgress array
  const result: CategoryProgress[] = [];
  for (const category of categories) {
    if (category.id !== 'all') {
      const stats = categoryStats.get(category.id);
      if (stats) {
        result.push({
          category: category.id,
          categoryName: category.name,
          completed: stats.completed,
          total: stats.total,
          percentage: calculatePercentage(stats.completed, stats.total),
        });
      }
    }
  }
  
  return result;
}

/**
 * Calculate trimester progress
 * Requirements: 11.3
 */
export function calculateTrimesterProgress(
  completedIds: number[],
  allStories: Story[]
): TrimesterProgress[] {
  const completedSet = new Set(completedIds);
  const trimesterStats = new Map<Trimester, { completed: number; total: number }>();
  
  // Initialize all trimesters
  const trimesters: Trimester[] = ['first', 'second', 'third', 'any'];
  for (const trimester of trimesters) {
    trimesterStats.set(trimester, { completed: 0, total: 0 });
  }
  
  // Count stories per trimester
  for (const story of allStories) {
    const stats = trimesterStats.get(story.recommendedTrimester);
    if (stats) {
      stats.total++;
      if (completedSet.has(story.id)) {
        stats.completed++;
      }
    }
  }
  
  // Convert to TrimesterProgress array
  const result: TrimesterProgress[] = [];
  for (const trimester of trimesters) {
    const stats = trimesterStats.get(trimester);
    if (stats && stats.total > 0) {
      result.push({
        trimester,
        trimesterName: DASHBOARD_CONSTANTS.TRIMESTER_NAMES[trimester],
        completed: stats.completed,
        total: stats.total,
        percentage: calculatePercentage(stats.completed, stats.total),
      });
    }
  }
  
  return result;
}

/**
 * Get story title by ID
 */
function getStoryTitle(storyId: number): string {
  const story = stories.find(s => s.id === storyId);
  return story?.title || `Story ${storyId}`;
}

/**
 * Build recent activity timeline
 * Requirements: 11.4
 */
export function buildActivityTimeline(
  profileId: string,
  maxActivities: number = DASHBOARD_CONSTANTS.MAX_RECENT_ACTIVITIES
): ActivityEntry[] {
  const activities: ActivityEntry[] = [];
  
  // Get streak activities
  const streakRecord = streakService.getStreakRecord(profileId);
  for (const activity of streakRecord.activityLog) {
    let title = '';
    let description = '';
    
    switch (activity.type) {
      case 'story_complete':
        title = 'Completed Story';
        description = activity.referenceId 
          ? getStoryTitle(parseInt(activity.referenceId, 10))
          : 'A learning story';
        break;
      case 'exercise_complete':
        title = 'Completed Exercise';
        description = 'Interactive exercise';
        break;
      case 'journal_entry':
        title = 'Journal Entry';
        description = 'Wrote a reflection';
        break;
    }
    
    activities.push({
      id: `streak_${activity.timestamp}`,
      type: activity.type,
      timestamp: activity.timestamp,
      referenceId: activity.referenceId,
      title,
      description,
    });
  }
  
  // Get kick activities
  const kickRecord = kickService.getKickRecord(profileId);
  for (const kick of kickRecord.kicks) {
    activities.push({
      id: kick.id,
      type: 'kick',
      timestamp: kick.timestamp,
      referenceId: String(kick.storyId),
      title: 'Logged Kick',
      description: `During ${getStoryTitle(kick.storyId)}`,
    });
  }
  
  // Sort by timestamp descending (most recent first)
  activities.sort((a, b) => b.timestamp - a.timestamp);
  
  // Return limited number
  return activities.slice(0, maxActivities);
}


/**
 * Dashboard service interface
 */
export interface IDashboardService {
  getDashboardStats(profileId: string): DashboardStats;
  getCategoryProgress(profileId: string): CategoryProgress[];
  getTrimesterProgress(profileId: string): TrimesterProgress[];
  getRecentActivity(profileId: string, limit?: number): ActivityEntry[];
}

/**
 * Create dashboard service instance
 */
export function createDashboardService(): IDashboardService {
  return {
    /**
     * Get comprehensive dashboard statistics
     * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
     */
    getDashboardStats(profileId: string): DashboardStats {
      // Get completed stories
      const completedIds = getCompletedStoryIds(profileId);
      const totalStories = stories.length;
      
      // Get streak stats
      const streakStats = streakService.getStreakStats(profileId);
      
      // Get journal entries count
      const journalRecord = journalService.getJournalRecord(profileId);
      const totalJournalEntries = journalRecord.entries.length;
      
      // Get kick count
      const kickRecord = kickService.getKickRecord(profileId);
      const totalKicks = kickRecord.totalKicks;
      
      // Calculate progress
      const categoryProgress = calculateCategoryProgress(completedIds, stories);
      const trimesterProgress = calculateTrimesterProgress(completedIds, stories);
      
      // Build activity timeline
      const recentActivity = buildActivityTimeline(profileId);
      
      return {
        storiesCompleted: completedIds.length,
        totalStories,
        completionPercentage: calculatePercentage(completedIds.length, totalStories),
        categoryProgress,
        trimesterProgress,
        currentStreak: streakStats.currentStreak,
        longestStreak: streakStats.longestStreak,
        totalJournalEntries,
        totalKicks,
        recentActivity,
      };
    },

    /**
     * Get category progress only
     * Requirements: 11.2
     */
    getCategoryProgress(profileId: string): CategoryProgress[] {
      const completedIds = getCompletedStoryIds(profileId);
      return calculateCategoryProgress(completedIds, stories);
    },

    /**
     * Get trimester progress only
     * Requirements: 11.3
     */
    getTrimesterProgress(profileId: string): TrimesterProgress[] {
      const completedIds = getCompletedStoryIds(profileId);
      return calculateTrimesterProgress(completedIds, stories);
    },

    /**
     * Get recent activity timeline
     * Requirements: 11.4
     */
    getRecentActivity(
      profileId: string,
      limit: number = DASHBOARD_CONSTANTS.MAX_RECENT_ACTIVITIES
    ): ActivityEntry[] {
      return buildActivityTimeline(profileId, limit);
    },
  };
}

// Default dashboard service instance
export const dashboardService = createDashboardService();

export default dashboardService;
