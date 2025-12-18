import React, { useState, useMemo } from 'react';
import { useStreak } from '../contexts/StreakContext';
import type { ActivityDay } from '../types/streak';

/**
 * StreakCalendar component for displaying activity calendar view
 * Requirements: 5.3 - Show a calendar view of learning activity days
 */

interface StreakCalendarProps {
  /** Custom class name */
  className?: string;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Get activity intensity class based on activity count
 */
function getActivityIntensity(count: number): string {
  if (count === 0) return 'bg-gray-100';
  if (count === 1) return 'bg-green-200';
  if (count === 2) return 'bg-green-300';
  if (count <= 4) return 'bg-green-400';
  return 'bg-green-500';
}

/**
 * Get days in a month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week for the first day of a month (0 = Sunday)
 */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({
  className = '',
}) => {
  const { getActivityCalendar } = useStreak();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());


  // Get activity data for current month
  const activityData = useMemo(() => {
    const data = getActivityCalendar(currentYear, currentMonth + 1);
    // Convert to map for easy lookup
    const map = new Map<string, ActivityDay>();
    data.forEach(day => map.set(day.date, day));
    return map;
  }, [getActivityCalendar, currentYear, currentMonth]);

  // Generate calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isFuture = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    return date > today;
  };

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}>
      {/* Header with month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
          disabled={currentYear === today.getFullYear() && currentMonth === today.getMonth()}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Activity calendar">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateStr = formatDate(currentYear, currentMonth, day);
          const activity = activityData.get(dateStr);
          const activityCount = activity?.activityCount || 0;
          const future = isFuture(day);

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-md flex items-center justify-center text-sm
                ${future ? 'bg-gray-50 text-gray-300' : getActivityIntensity(activityCount)}
                ${isToday(day) ? 'ring-2 ring-purple-500 ring-offset-1' : ''}
                ${activityCount > 0 ? 'text-white font-medium' : 'text-gray-600'}
              `}
              title={activityCount > 0 ? `${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}` : 'No activity'}
              role="gridcell"
              aria-label={`${MONTHS[currentMonth]} ${day}, ${activityCount} ${activityCount === 1 ? 'activity' : 'activities'}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 5].map(count => (
            <div
              key={count}
              className={`w-3 h-3 rounded-sm ${getActivityIntensity(count)}`}
              title={`${count} activities`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default StreakCalendar;
