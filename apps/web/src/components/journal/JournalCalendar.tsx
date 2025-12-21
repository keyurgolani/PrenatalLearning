import React, { useMemo, useCallback } from 'react';

/**
 * JournalCalendar component - Month view calendar with entry indicators
 * 
 * Requirements:
 * - 10.3: THE System SHALL display journal entries in a calendar view organized by date
 * - 10.7: THE System SHALL display a visual indicator showing days with journal entries on the calendar
 */

export interface JournalCalendarProps {
  /** Currently selected date */
  selectedDate: Date;
  /** Callback when a date is selected */
  onDateSelect: (date: Date) => void;
  /** Set of date strings (YYYY-MM-DD) that have entries */
  datesWithEntries: Set<string>;
  /** Current view month (0-11) */
  viewMonth: number;
  /** Current view year */
  viewYear: number;
  /** Callback to navigate to previous month */
  onPrevMonth: () => void;
  /** Callback to navigate to next month */
  onNextMonth: () => void;
  /** Optional custom class name */
  className?: string;
  /** Whether to disable future dates (default: true) */
  disableFutureDates?: boolean;
}

/**
 * Month names for display
 */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Day names for calendar header
 */
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Get days in a month
 */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
 */
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Format date as YYYY-MM-DD using LOCAL timezone
 * This ensures consistency between calendar display and date comparisons
 * Requirements: 18.5, 18.6 - Fix date mismatch issues
 */
function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateKey(date1) === formatDateKey(date2);
}

/**
 * JournalCalendar - A reusable month view calendar component
 * 
 * Features:
 * - Month view with day cells
 * - Visual indicators for days with entries (Requirements: 10.7)
 * - Click to select date (Requirements: 10.3)
 * - Navigation between months
 * - Highlights today and selected date
 * - Optionally disables future dates
 */
export const JournalCalendar: React.FC<JournalCalendarProps> = ({
  selectedDate,
  onDateSelect,
  datesWithEntries,
  viewMonth,
  viewYear,
  onPrevMonth,
  onNextMonth,
  className = '',
  disableFutureDates = true,
}) => {
  const today = useMemo(() => new Date(), []);

  /**
   * Handle date selection
   * Requirements: 10.3 - Click to select date
   */
  const handleDateSelect = useCallback((day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    onDateSelect(newDate);
  }, [viewYear, viewMonth, onDateSelect]);

  /**
   * Render calendar grid
   * Requirements: 10.3, 10.7
   */
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: React.ReactNode[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="h-8 w-8" 
          aria-hidden="true"
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const dateKey = formatDateKey(date);
      const hasEntry = datesWithEntries.has(dateKey);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      const isFuture = disableFutureDates && date > today;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isFuture && handleDateSelect(day)}
          disabled={isFuture}
          className={`
            relative h-8 w-8 rounded-full text-sm font-medium transition-all
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
            ${isSelected 
              ? 'bg-purple-600 text-white' 
              : isToday 
                ? 'bg-purple-100 text-purple-700' 
                : isFuture 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'
            }
          `}
          aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}${hasEntry ? ' - has entry' : ''}${isToday ? ' - today' : ''}`}
          aria-selected={isSelected}
          aria-current={isToday ? 'date' : undefined}
        >
          {day}
          {/* Entry indicator - Requirements: 10.7 */}
          {hasEntry && (
            <span 
              className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                isSelected ? 'bg-white' : 'bg-purple-500'
              }`}
              aria-hidden="true"
            />
          )}
        </button>
      );
    }

    return days;
  }, [viewYear, viewMonth, datesWithEntries, selectedDate, today, disableFutureDates, handleDateSelect]);

  return (
    <div className={`journal-calendar ${className}`} role="application" aria-label="Journal calendar">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1.5 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span 
          className="font-medium text-gray-700"
          aria-live="polite"
          aria-atomic="true"
        >
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1.5 rounded-full hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Next month"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar grid */}
      <div 
        className="grid grid-cols-7 gap-1" 
        role="grid"
        aria-label={`${MONTH_NAMES[viewMonth]} ${viewYear} calendar`}
      >
        {/* Day headers */}
        {DAY_NAMES.map(day => (
          <div 
            key={day} 
            className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
            role="columnheader"
            aria-label={day}
          >
            {day}
          </div>
        ))}
        {/* Calendar days */}
        {calendarDays}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" aria-hidden="true" />
          <span>Has entry</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-purple-100 flex items-center justify-center text-[10px] text-purple-700" aria-hidden="true">
            {today.getDate()}
          </span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default JournalCalendar;
