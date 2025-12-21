import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useKick, type KickEventApi } from '../../contexts/KickContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { get } from '../../services/apiClient';
import { BabyKickIcon } from '../icons/BabyKickIcon';

/**
 * KickDailySummary component - Shows kick count and individual kicks for a selected date
 * 
 * Requirements:
 * - 13.1: THE System SHALL display daily kick count summary within the journal view for each date
 * - 13.3: WHEN viewing a journal entry, THE System SHALL show kick events that occurred on that date
 */

export interface KickDailySummaryProps {
  /** The date to show kicks for */
  date: Date;
  /** Whether to show in compact mode (just count) */
  compact?: boolean;
  /** Whether to show the log kick button */
  showLogButton?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when a kick is logged */
  onKickLogged?: () => void;
}

/**
 * Format time for display (e.g., "2:30 PM")
 */
function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date as YYYY-MM-DD for comparison
 */
function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Check if a timestamp is on the given date
 */
function isOnDate(timestamp: string, targetDate: Date): boolean {
  const kickDate = new Date(timestamp).toISOString().split('T')[0];
  return kickDate === formatDateKey(targetDate);
}



/**
 * KickDailySummary - Displays kick count and individual kicks for a selected date
 * 
 * Requirements:
 * - 13.1: Display daily kick count summary within the journal view for each date
 * - 13.3: Show kick events that occurred on that date when viewing a journal entry
 */
export const KickDailySummary: React.FC<KickDailySummaryProps> = ({
  date,
  compact = false,
  showLogButton = false,
  className = '',
  onKickLogged,
}) => {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  const { logKick, recentKicks } = useKick();

  // Local state for kicks on the selected date
  const [dateKicks, setDateKicks] = useState<KickEventApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Filter kicks for the selected date from recent kicks or fetch from API
   */
  const fetchKicksForDate = useCallback(async () => {
    if (!isAuthenticated || !activeProfile) {
      setDateKicks([]);
      return;
    }

    // First, check if we have kicks for this date in recentKicks
    const kicksFromRecent = recentKicks.filter(kick => isOnDate(kick.timestamp, date));
    
    // If the date is within the last 7 days, use recent kicks
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    if (date >= sevenDaysAgo) {
      setDateKicks(kicksFromRecent.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
      return;
    }

    // Otherwise, fetch from API for older dates
    setIsLoading(true);
    setError(null);

    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      interface KicksResponse {
        kicks: KickEventApi[];
        pagination: {
          total: number;
          limit: number;
          offset: number;
          hasMore: boolean;
        };
      }

      const response = await get<KicksResponse>(
        `/kicks?startDate=${encodeURIComponent(startOfDay.toISOString())}&endDate=${encodeURIComponent(endOfDay.toISOString())}&limit=100`
      );
      
      setDateKicks(response.kicks.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (err) {
      console.error('Failed to fetch kicks for date:', err);
      setError('Failed to load kicks');
      // Fall back to recent kicks if API fails
      setDateKicks(kicksFromRecent);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile, date, recentKicks]);

  // Fetch kicks when date changes
  useEffect(() => {
    fetchKicksForDate();
  }, [fetchKicksForDate]);

  /**
   * Handle logging a quick kick
   */
  const handleLogKick = useCallback(async () => {
    if (!isAuthenticated || !activeProfile || isLogging) return;

    setIsLogging(true);
    setError(null);

    try {
      await logKick();
      // Refresh kicks for the date
      await fetchKicksForDate();
      onKickLogged?.();
    } catch (err) {
      console.error('Failed to log kick:', err);
      setError('Failed to log kick');
    } finally {
      setIsLogging(false);
    }
  }, [isAuthenticated, activeProfile, isLogging, logKick, fetchKicksForDate, onKickLogged]);

  /**
   * Calculate kick count for the date
   */
  const kickCount = useMemo(() => dateKicks.length, [dateKicks]);

  /**
   * Check if the date is today
   */
  const isToday = useMemo(() => {
    const today = new Date();
    return formatDateKey(date) === formatDateKey(today);
  }, [date]);

  // Don't render if not authenticated or no active profile
  if (!isAuthenticated || !activeProfile) {
    return null;
  }

  // Compact mode - just show count
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <BabyKickIcon className="w-4 h-4 text-pink-500" />
        <span className="text-sm font-medium text-gray-700">
          {isLoading ? '...' : kickCount}
        </span>
        <span className="text-sm text-gray-500">
          {kickCount === 1 ? 'kick' : 'kicks'}
        </span>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-pink-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BabyKickIcon className="w-5 h-5 text-pink-500" />
          <h3 className="font-medium text-gray-800">
            Baby Kicks
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {/* Kick count badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
            {isLoading ? (
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              kickCount
            )}
            <span>{kickCount === 1 ? 'kick' : 'kicks'}</span>
          </span>

          {/* Log kick button (only show for today) */}
          {showLogButton && isToday && (
            <button
              onClick={handleLogKick}
              disabled={isLogging}
              className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg button-interactive disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              aria-label="Log a kick"
            >
              {isLogging ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging...
                </>
              ) : (
                <>
                  <span>+</span>
                  Log Kick
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Kicks list */}
      <div className="px-4 py-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <svg className="animate-spin w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : kickCount === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            {isToday 
              ? "No kicks logged yet today. Tap the button above to log a kick!" 
              : "No kicks were logged on this day."
            }
          </p>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-y-auto" aria-label="Kick events">
            {dateKicks.map((kick) => (
              <li 
                key={kick.id}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                {/* Time indicator */}
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-sm font-medium text-pink-600">
                    {formatTime(kick.timestamp)}
                  </span>
                </div>

                {/* Kick indicator dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <span className="block w-2 h-2 rounded-full bg-pink-400" aria-hidden="true" />
                </div>

                {/* Kick details */}
                <div className="flex-1 min-w-0">
                  {kick.note ? (
                    <p className="text-sm text-gray-700">{kick.note}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Kick logged</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary footer for days with kicks */}
      {kickCount > 0 && !isLoading && (
        <div className="px-4 py-2 bg-pink-100/50 border-t border-pink-100">
          <p className="text-xs text-pink-600 text-center">
            {kickCount === 1 
              ? "1 kick recorded" 
              : `${kickCount} kicks recorded`
            }
            {dateKicks.length > 0 && (
              <span className="ml-1">
                • First at {formatTime(dateKicks[dateKicks.length - 1].timestamp)}
                {dateKicks.length > 1 && `, last at ${formatTime(dateKicks[0].timestamp)}`}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default KickDailySummary;
