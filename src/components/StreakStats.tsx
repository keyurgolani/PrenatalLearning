import React from 'react';
import { useStreak } from '../contexts/StreakContext';
import { StreakCalendar } from './StreakCalendar';

/**
 * StreakStats component for displaying comprehensive streak statistics
 * Requirements: 5.2 - Display longest streak achieved
 * Requirements: 5.4 - Calculate and display total learning days
 * Requirements: 5.5 - Show average activities per learning day
 */

interface StreakStatsProps {
  /** Whether to show the calendar */
  showCalendar?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Stat card component for individual statistics
 */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`px-4 py-2 rounded-lg font-medium button-interactive ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

/**
 * Fire icon
 */
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c.47-.17.97-.29 1.5-.36V6c0-.55.45-1 1-1s1 .45 1 1v2.28c.53.07 1.03.19 1.5.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c1.83 1.53 3 3.84 3 6.36 0 4.42-4.03 8-9 8z" />
  </svg>
);

/**
 * Trophy icon
 */
const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
  </svg>
);

/**
 * Calendar icon
 */
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
  </svg>
);

/**
 * Chart icon
 */
const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
);


export const StreakStats: React.FC<StreakStatsProps> = ({
  showCalendar = true,
  className = '',
}) => {
  const {
    currentStreak,
    longestStreak,
    totalLearningDays,
    averageActivitiesPerDay,
    hasActiveStreak,
  } = useStreak();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Streak */}
        <StatCard
          label="Current Streak"
          value={currentStreak}
          icon={<FireIcon className={`w-6 h-6 ${hasActiveStreak ? 'text-orange-500' : 'text-gray-400'}`} />}
          color={hasActiveStreak ? 'bg-orange-100' : 'bg-gray-100'}
        />

        {/* Longest Streak - Requirements: 5.2 */}
        <StatCard
          label="Longest Streak"
          value={longestStreak}
          icon={<TrophyIcon className="w-6 h-6 text-yellow-500" />}
          color="bg-yellow-100"
        />

        {/* Total Learning Days - Requirements: 5.4 */}
        <StatCard
          label="Total Days"
          value={totalLearningDays}
          icon={<CalendarIcon className="w-6 h-6 text-purple-500" />}
          color="bg-purple-100"
        />

        {/* Average Activities - Requirements: 5.5 */}
        <StatCard
          label="Avg/Day"
          value={averageActivitiesPerDay.toFixed(1)}
          icon={<ChartIcon className="w-6 h-6 text-green-500" />}
          color="bg-green-100"
        />
      </div>

      {/* Streak Status Message */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          {hasActiveStreak ? (
            <>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {currentStreak === 0 
                    ? "Start your streak today!" 
                    : `You're on a ${currentStreak} day streak!`}
                </p>
                <p className="text-sm text-gray-500">
                  {currentStreak >= 7 
                    ? "Amazing consistency! Keep it up!" 
                    : "Complete a learning activity to keep your streak going."}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">Your streak has ended</p>
                <p className="text-sm text-gray-500">
                  Start a new streak by completing a learning activity today!
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Activity Calendar - Requirements: 5.3 */}
      {showCalendar && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Activity Calendar</h3>
          <StreakCalendar />
        </div>
      )}
    </div>
  );
};

export default StreakStats;
