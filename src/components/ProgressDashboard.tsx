import React, { useState, useEffect, useMemo } from 'react';
import type { DashboardStats } from '../types/dashboard';
import { dashboardService } from '../services/dashboardService';
import { ActivityTimeline } from './ActivityTimeline';

/**
 * ProgressDashboard component for displaying comprehensive learning progress
 * Requirements: 11.1 - Display total stories completed and percentage of library
 * Requirements: 11.2 - Display completion progress by category with visual indicators
 * Requirements: 11.3 - Display completion progress by trimester
 * Requirements: 11.5 - Display current streak and longest streak
 * Requirements: 11.6 - Show total journal entries and kick events logged
 */

const DEFAULT_PROFILE_ID = 'default-profile';

interface ProgressDashboardProps {
  profileId?: string;
  className?: string;
  showTimeline?: boolean;
}

/**
 * Progress bar component for category/trimester progress
 */
const ProgressBar: React.FC<{
  label: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}> = ({ label, completed, total, percentage, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-700 font-medium">{label}</span>
      <span className="text-gray-500">{completed}/{total}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

/**
 * Stat card component for individual statistics
 */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}> = ({ label, value, icon, color, subtext }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {subtext && <p className="text-xs text-gray-400 mt-0.5">{subtext}</p>}
      </div>
    </div>
  </div>
);


// Icons
const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c.47-.17.97-.29 1.5-.36V6c0-.55.45-1 1-1s1 .45 1 1v2.28c.53.07 1.03.19 1.5.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c1.83 1.53 3 3.84 3 6.36 0 4.42-4.03 8-9 8z" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

const JournalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Category colors mapping
const CATEGORY_COLORS: Record<string, string> = {
  science: 'bg-indigo-500',
  technology: 'bg-cyan-500',
  biology: 'bg-emerald-500',
  math: 'bg-amber-500',
  psychology: 'bg-purple-500',
  language: 'bg-rose-500',
  finance: 'bg-green-500',
  society: 'bg-orange-500',
};

// Trimester colors mapping
const TRIMESTER_COLORS: Record<string, string> = {
  first: 'bg-pink-500',
  second: 'bg-violet-500',
  third: 'bg-blue-500',
  any: 'bg-gray-500',
};


export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  profileId = DEFAULT_PROFILE_ID,
  className = '',
  showTimeline = true,
}) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard stats
  useEffect(() => {
    try {
      const dashboardStats = dashboardService.getDashboardStats(profileId);
      setStats(dashboardStats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  // Memoize sorted category progress (by percentage descending)
  const sortedCategoryProgress = useMemo(() => {
    if (!stats) return [];
    return [...stats.categoryProgress].sort((a, b) => b.percentage - a.percentage);
  }, [stats]);

  // Memoize sorted trimester progress
  const sortedTrimesterProgress = useMemo(() => {
    if (!stats) return [];
    // Sort by trimester order: first, second, third, any
    const order = ['first', 'second', 'third', 'any'];
    return [...stats.trimesterProgress].sort(
      (a, b) => order.indexOf(a.trimester) - order.indexOf(b.trimester)
    );
  }, [stats]);

  if (loading) {
    return (
      <div className={`animate-pulse space-y-6 ${className}`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24" />
          ))}
        </div>
        <div className="bg-gray-200 rounded-xl h-48" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`bg-red-50 rounded-xl p-6 text-center ${className}`}>
        <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats Grid - Requirements: 11.1, 11.5, 11.6 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stories Completed */}
        <StatCard
          label="Stories Completed"
          value={stats.storiesCompleted}
          icon={<BookIcon className="w-6 h-6 text-indigo-500" />}
          color="bg-indigo-100"
          subtext={`${stats.completionPercentage}% of library`}
        />

        {/* Current Streak */}
        <StatCard
          label="Current Streak"
          value={stats.currentStreak}
          icon={<FireIcon className={`w-6 h-6 ${stats.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />}
          color={stats.currentStreak > 0 ? 'bg-orange-100' : 'bg-gray-100'}
          subtext={stats.currentStreak > 0 ? 'days' : 'Start today!'}
        />

        {/* Longest Streak */}
        <StatCard
          label="Longest Streak"
          value={stats.longestStreak}
          icon={<TrophyIcon className="w-6 h-6 text-yellow-500" />}
          color="bg-yellow-100"
          subtext="days"
        />

        {/* Journal Entries */}
        <StatCard
          label="Journal Entries"
          value={stats.totalJournalEntries}
          icon={<JournalIcon className="w-6 h-6 text-purple-500" />}
          color="bg-purple-100"
        />
      </div>

      {/* Kick Counter Stats */}
      {stats.totalKicks > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-100">
              <HeartIcon className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {stats.totalKicks} Baby Kicks Logged
              </p>
              <p className="text-sm text-gray-500">
                Tracking baby's responses to learning
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Category Progress - Requirements: 11.2 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress by Category</h3>
        <div className="space-y-4">
          {sortedCategoryProgress.map((category) => (
            <ProgressBar
              key={category.category}
              label={category.categoryName}
              completed={category.completed}
              total={category.total}
              percentage={category.percentage}
              color={CATEGORY_COLORS[category.category] || 'bg-gray-500'}
            />
          ))}
        </div>
      </div>

      {/* Trimester Progress - Requirements: 11.3 */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress by Trimester</h3>
        <div className="space-y-4">
          {sortedTrimesterProgress.map((trimester) => (
            <ProgressBar
              key={trimester.trimester}
              label={trimester.trimesterName}
              completed={trimester.completed}
              total={trimester.total}
              percentage={trimester.percentage}
              color={TRIMESTER_COLORS[trimester.trimester] || 'bg-gray-500'}
            />
          ))}
        </div>
      </div>

      {/* Overall Progress Circle */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Progress</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                className="text-indigo-500 transition-all duration-500"
                strokeDasharray={`${stats.completionPercentage * 3.52} 352`}
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                {stats.completionPercentage}%
              </span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          {stats.storiesCompleted} of {stats.totalStories} stories completed
        </p>
      </div>

      {/* Activity Timeline - Requirements: 11.4 */}
      {showTimeline && stats.recentActivity.length > 0 && (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <ActivityTimeline activities={stats.recentActivity} />
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;
