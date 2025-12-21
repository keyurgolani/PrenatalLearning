/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ActivityType, StreakStats, StreakUpdate, ActivityDay } from '../types/streak';
import { streakService, getLocalDateString } from '../services/streakService';

/**
 * StreakContext for managing learning streak state
 * Requirements: 4.1 - Track consecutive days of learning activity for logged-in users
 * Requirements: 4.2 - Define learning activity as completing a story, exercise, or journal entry
 */

const DEFAULT_PROFILE_ID = 'default-profile';

export interface StreakContextValue {
  /** Current streak count */
  currentStreak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Total learning days */
  totalLearningDays: number;
  /** Average activities per learning day */
  averageActivitiesPerDay: number;
  /** Last activity date */
  lastActivityDate: string | null;
  /** Whether there's an active streak (activity today or yesterday) */
  hasActiveStreak: boolean;
  /** Record a learning activity */
  recordActivity: (activityType: ActivityType, referenceId?: string) => StreakUpdate;
  /** Get activity calendar for a month */
  getActivityCalendar: (year: number, month: number) => ActivityDay[];
  /** Refresh streak data from storage */
  refreshStreak: () => void;
  /** Current milestone if just achieved */
  currentMilestone: number | null;
  /** Clear milestone notification */
  clearMilestone: () => void;
}

const StreakContext = createContext<StreakContextValue | undefined>(undefined);

interface StreakProviderProps {
  children: React.ReactNode;
  profileId?: string;
}

/**
 * StreakProvider component that manages streak state
 * Requirements: 4.1, 4.2 - Track learning activities and streaks
 */
export function StreakProvider({ 
  children, 
  profileId = DEFAULT_PROFILE_ID 
}: StreakProviderProps): React.ReactElement {
  // Track profileId in state to detect changes and re-initialize stats
  const [trackedProfileId, setTrackedProfileId] = useState(profileId);
  const [stats, setStats] = useState<StreakStats>(() => 
    streakService.getStreakStats(profileId)
  );
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);

  // Re-initialize stats when profileId changes (React pattern for derived state)
  if (trackedProfileId !== profileId) {
    setTrackedProfileId(profileId);
    setStats(streakService.getStreakStats(profileId));
  }
  
  // Refresh stats from storage
  const refreshStreak = useCallback(() => {
    const newStats = streakService.getStreakStats(profileId);
    setStats(newStats);
  }, [profileId]);

  // Record activity and update state
  const recordActivity = useCallback((
    activityType: ActivityType,
    referenceId?: string
  ): StreakUpdate => {
    const update = streakService.recordActivity(profileId, activityType, referenceId);
    
    // Update local state
    setStats(prev => ({
      ...prev,
      currentStreak: update.currentStreak,
      longestStreak: update.longestStreak,
      lastActivityDate: getLocalDateString(),
      totalLearningDays: prev.totalLearningDays + (prev.lastActivityDate !== getLocalDateString() ? 1 : 0),
    }));

    // Set milestone if achieved
    if (update.isNewMilestone && update.milestone) {
      setCurrentMilestone(update.milestone);
    }

    return update;
  }, [profileId]);

  // Get activity calendar for a month
  const getActivityCalendar = useCallback((year: number, month: number): ActivityDay[] => {
    return streakService.getActivityCalendar(profileId, year, month);
  }, [profileId]);

  // Clear milestone notification
  const clearMilestone = useCallback(() => {
    setCurrentMilestone(null);
  }, []);

  // Check if streak is active (activity today or yesterday)
  // Using a function to compute this to avoid impure Date.now() in useMemo
  const checkActiveStreak = useCallback((): boolean => {
    if (!stats.lastActivityDate) return false;
    const now = new Date();
    const today = getLocalDateString(now);
    const yesterday = getLocalDateString(new Date(now.getTime() - 86400000));
    return stats.lastActivityDate === today || stats.lastActivityDate === yesterday;
  }, [stats.lastActivityDate]);
  
  const hasActiveStreak = checkActiveStreak();

  const contextValue = useMemo<StreakContextValue>(() => ({
    currentStreak: stats.currentStreak,
    longestStreak: stats.longestStreak,
    totalLearningDays: stats.totalLearningDays,
    averageActivitiesPerDay: stats.averageActivitiesPerDay,
    lastActivityDate: stats.lastActivityDate,
    hasActiveStreak,
    recordActivity,
    getActivityCalendar,
    refreshStreak,
    currentMilestone,
    clearMilestone,
  }), [
    stats,
    hasActiveStreak,
    recordActivity,
    getActivityCalendar,
    refreshStreak,
    currentMilestone,
    clearMilestone,
  ]);

  return (
    <StreakContext.Provider value={contextValue}>
      {children}
    </StreakContext.Provider>
  );
}

/**
 * Hook to access streak context
 * @throws Error if used outside of StreakProvider
 */
export function useStreak(): StreakContextValue {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
}

export default StreakProvider;
