/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { useJournal } from './JournalContext';
import { post, ApiError } from '../services/apiClient';
import { migrateGuestKicks } from '../services/guestDataMigration';
import type { JournalEntry } from '../types/journal';

/**
 * Kick event - now derived from journal entries
 */
export interface KickEventApi {
  id: string;
  timestamp: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Daily kick stats for graph - calculated from journal entries
 */
export interface DailyKickStats {
  date: string;
  count: number;
  firstKick: string | null;
  lastKick: string | null;
}

/**
 * Time period stats
 */
export interface PeriodStats {
  period: string;
  label: string;
  count: number;
  percentage: number;
}

/**
 * Time patterns response
 */
export interface TimePatterns {
  hourlyDistribution: Array<{ hour: number; count: number; label: string }>;
  periodStats: PeriodStats[];
  peakPeriod: { period: string; count: number; percentage: number } | null;
  peakHour: { hour: number; count: number; label: string } | null;
  totalKicks: number;
}

/**
 * Kick statistics - calculated from journal entries
 */
export interface KickStats {
  totalKicks: number;
  daysTracking: number;
  averagePerDay: number;
  weeklyKicks: number;
  weeklyAverage: number;
  firstKickDate: string | null;
  lastKickDate: string | null;
  milestones: {
    achieved: Array<{ count: number; label: string }>;
    next: { count: number; label: string } | null;
    progressToNext: number;
  };
}

/**
 * KickContext value interface
 * For logged-in users, kick counts are derived from journal entries
 */
export interface KickContextValue {
  todayKicks: number;
  recentKicks: KickEventApi[];
  isLoading: boolean;
  error: string | null;
  logKick: (note?: string) => Promise<KickEventApi>;
  updateKick: (id: string, note: string) => Promise<KickEventApi>;
  deleteKick: (id: string) => Promise<void>;
  dailyStats: DailyKickStats[];
  timePatterns: TimePatterns | null;
  stats: KickStats | null;
  refreshKicks: () => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshDailyStats: (days?: number) => Promise<void>;
  refreshTimePatterns: () => Promise<void>;
  clearError: () => void;
}

/**
 * KickContext for managing kick tracking state
 * For logged-in users, kicks are stored as journal entries with kickCount
 */
const KickContext = createContext<KickContextValue | undefined>(undefined);

interface KickProviderProps {
  children: React.ReactNode;
}

interface JournalEntryResponse {
  entry: {
    id: string;
    journalDate: string;
    content: string;
    mood?: string | null;
    kickCount?: number;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * Get today's date string in YYYY-MM-DD format (local timezone)
 */
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date string from a Date object in YYYY-MM-DD format (local timezone)
 */
function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Extract date string from journalDate ISO string
 */
function getDateFromJournalDate(journalDate: string): string {
  return journalDate.split('T')[0];
}

/**
 * Calculate total kick count from journal entries for a specific date
 */
function calculateKicksForDate(entries: JournalEntry[], dateString: string): number {
  return entries
    .filter(entry => {
      if (entry.journalDate) {
        return getDateFromJournalDate(entry.journalDate) === dateString;
      }
      return getDateString(new Date(entry.createdAt)) === dateString;
    })
    .reduce((total, entry) => total + (entry.kickCount || 0), 0);
}

/**
 * Calculate daily stats from journal entries for the last N days
 */
function calculateDailyStats(entries: JournalEntry[], days: number): DailyKickStats[] {
  const stats: DailyKickStats[] = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = getDateString(date);
    
    const dayEntries = entries.filter(entry => {
      if (entry.journalDate) {
        return getDateFromJournalDate(entry.journalDate) === dateString;
      }
      return getDateString(new Date(entry.createdAt)) === dateString;
    });
    
    const kickCount = dayEntries.reduce((total, entry) => total + (entry.kickCount || 0), 0);
    
    // Find first and last kick times from entries with kicks
    const entriesWithKicks = dayEntries.filter(e => e.kickCount && e.kickCount > 0);
    const sortedByTime = entriesWithKicks.sort((a, b) => a.createdAt - b.createdAt);
    
    stats.push({
      date: dateString,
      count: kickCount,
      firstKick: sortedByTime.length > 0 ? new Date(sortedByTime[0].createdAt).toISOString() : null,
      lastKick: sortedByTime.length > 0 ? new Date(sortedByTime[sortedByTime.length - 1].createdAt).toISOString() : null,
    });
  }
  
  return stats.reverse(); // Return in chronological order
}

/**
 * Calculate overall kick statistics from journal entries
 */
function calculateStats(entries: JournalEntry[]): KickStats {
  const entriesWithKicks = entries.filter(e => e.kickCount && e.kickCount > 0);
  const totalKicks = entries.reduce((total, entry) => total + (entry.kickCount || 0), 0);
  
  // Get unique dates with kicks
  const datesWithKicks = new Set<string>();
  entriesWithKicks.forEach(entry => {
    if (entry.journalDate) {
      datesWithKicks.add(getDateFromJournalDate(entry.journalDate));
    } else {
      datesWithKicks.add(getDateString(new Date(entry.createdAt)));
    }
  });
  
  const daysTracking = datesWithKicks.size;
  const averagePerDay = daysTracking > 0 ? Math.round(totalKicks / daysTracking * 10) / 10 : 0;
  
  // Calculate weekly kicks (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weeklyKicks = entries
    .filter(entry => new Date(entry.createdAt) >= sevenDaysAgo)
    .reduce((total, entry) => total + (entry.kickCount || 0), 0);
  
  // Find first and last kick dates
  const sortedEntries = entriesWithKicks.sort((a, b) => a.createdAt - b.createdAt);
  const firstKickDate = sortedEntries.length > 0 ? new Date(sortedEntries[0].createdAt).toISOString() : null;
  const lastKickDate = sortedEntries.length > 0 ? new Date(sortedEntries[sortedEntries.length - 1].createdAt).toISOString() : null;
  
  // Calculate milestones
  const milestoneThresholds = [10, 50, 100, 250, 500, 1000];
  const achieved = milestoneThresholds
    .filter(threshold => totalKicks >= threshold)
    .map(count => ({ count, label: `${count} kicks!` }));
  
  const nextThreshold = milestoneThresholds.find(threshold => totalKicks < threshold);
  const next = nextThreshold ? { count: nextThreshold, label: `${nextThreshold} kicks!` } : null;
  const progressToNext = next ? Math.round((totalKicks / next.count) * 100) : 100;
  
  return {
    totalKicks,
    daysTracking,
    averagePerDay,
    weeklyKicks,
    weeklyAverage: Math.round(weeklyKicks / 7 * 10) / 10,
    firstKickDate,
    lastKickDate,
    milestones: {
      achieved,
      next,
      progressToNext,
    },
  };
}

/**
 * KickProvider component that manages kick tracking state
 * For logged-in users, kicks are derived from journal entries
 */
export function KickProvider({ children }: KickProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  const { entries, refreshEntries } = useJournal();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track previous auth state to detect login
  const previousAuthState = useRef(isAuthenticated);
  const hasMigratedKicks = useRef(false);

  /**
   * Migrate guest kicks when user logs in
   * Only migrates kicks that occurred after the user's latest journal entry
   * This prevents duplicates if the user logs in/out multiple times
   */
  useEffect(() => {
    const wasLoggedOut = !previousAuthState.current;
    const isNowLoggedIn = isAuthenticated && activeProfile;
    
    // User just logged in
    if (wasLoggedOut && isNowLoggedIn && !hasMigratedKicks.current) {
      hasMigratedKicks.current = true;
      
      migrateGuestKicks().then((migratedCount) => {
        if (migratedCount > 0) {
          // Refresh entries to show migrated kicks
          refreshEntries();
          console.log(`Migrated ${migratedCount} kicks from guest session`);
        }
      }).catch((err) => {
        console.warn('Failed to migrate guest kicks:', err);
      });
    }
    
    // User logged out - reset migration flag for next login
    if (!isAuthenticated && previousAuthState.current) {
      hasMigratedKicks.current = false;
    }
    
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated, activeProfile, refreshEntries]);

  /**
   * Calculate today's kick count from journal entries
   */
  const todayKicks = useMemo(() => {
    if (!isAuthenticated) return 0;
    const todayString = getTodayDateString();
    return calculateKicksForDate(entries, todayString);
  }, [entries, isAuthenticated]);

  /**
   * Calculate daily stats from journal entries
   */
  const dailyStats = useMemo(() => {
    if (!isAuthenticated) return [];
    return calculateDailyStats(entries, 7);
  }, [entries, isAuthenticated]);

  /**
   * Calculate overall stats from journal entries
   */
  const stats = useMemo(() => {
    if (!isAuthenticated) return null;
    return calculateStats(entries);
  }, [entries, isAuthenticated]);

  /**
   * Recent kicks - empty for now since we're using journal entries
   * This is kept for backward compatibility
   */
  const recentKicks: KickEventApi[] = [];

  /**
   * Time patterns - null for now (could be calculated from journal entries if needed)
   */
  const timePatterns: TimePatterns | null = null;

  /**
   * Log a kick by creating a journal entry with kickCount=1
   */
  const logKick = useCallback(async (note?: string): Promise<KickEventApi> => {
    if (!isAuthenticated || !activeProfile) {
      throw new Error('Must be logged in with an active profile to log kicks');
    }

    setError(null);
    setIsLoading(true);

    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const journalDateISO = `${year}-${month}-${day}T00:00:00.000Z`;
      
      // Create a journal entry with kickCount=1
      const response = await post<JournalEntryResponse>('/journal', {
        journalDate: journalDateISO,
        kickCount: 1,
        content: note || '',
      });

      // Refresh journal entries to update kick counts everywhere
      await refreshEntries();

      // Return a kick-like object for backward compatibility
      return {
        id: response.entry.id,
        timestamp: now.toISOString(),
        note: note || null,
        createdAt: response.entry.createdAt,
        updatedAt: response.entry.updatedAt,
      };
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to log kick');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile, refreshEntries]);

  /**
   * Update a kick - not supported when using journal entries
   * Kept for backward compatibility
   */
  const updateKick = useCallback(async (_id: string, _note: string): Promise<KickEventApi> => {
    throw new Error('Updating individual kicks is not supported. Edit the journal entry instead.');
  }, []);

  /**
   * Delete a kick - not supported when using journal entries
   * Kept for backward compatibility
   */
  const deleteKick = useCallback(async (_id: string): Promise<void> => {
    throw new Error('Deleting individual kicks is not supported. Edit the journal entry instead.');
  }, []);

  /**
   * Refresh kicks by refreshing journal entries
   */
  const refreshKicks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await refreshEntries();
    } finally {
      setIsLoading(false);
    }
  }, [refreshEntries]);

  /**
   * Refresh stats - just refresh journal entries
   */
  const refreshStats = useCallback(async (): Promise<void> => {
    await refreshEntries();
  }, [refreshEntries]);

  /**
   * Refresh daily stats - just refresh journal entries
   */
  const refreshDailyStats = useCallback(async (): Promise<void> => {
    await refreshEntries();
  }, [refreshEntries]);

  /**
   * Refresh time patterns - no-op for now
   */
  const refreshTimePatterns = useCallback(async (): Promise<void> => {
    // Time patterns could be calculated from journal entries if needed
  }, []);

  /**
   * Clear any kick errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo<KickContextValue>(() => ({
    todayKicks,
    recentKicks,
    isLoading,
    error,
    logKick,
    updateKick,
    deleteKick,
    dailyStats,
    timePatterns,
    stats,
    refreshKicks,
    refreshStats,
    refreshDailyStats,
    refreshTimePatterns,
    clearError,
  }), [
    todayKicks,
    recentKicks,
    isLoading,
    error,
    logKick,
    updateKick,
    deleteKick,
    dailyStats,
    timePatterns,
    stats,
    refreshKicks,
    refreshStats,
    refreshDailyStats,
    refreshTimePatterns,
    clearError,
  ]);

  return (
    <KickContext.Provider value={contextValue}>
      {children}
    </KickContext.Provider>
  );
}

/**
 * Hook to access kick context
 * @throws Error if used outside of KickProvider
 */
export function useKick(): KickContextValue {
  const context = useContext(KickContext);
  if (context === undefined) {
    throw new Error('useKick must be used within a KickProvider');
  }
  return context;
}

export default KickProvider;
