import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { DurationFilter, CompletionStatus, Trimester } from '../types';

interface AdvancedFiltersProps {
  selectedDuration: DurationFilter;
  selectedCompletionStatus: CompletionStatus;
  selectedTrimester?: Trimester | 'all';
  onDurationChange: (duration: DurationFilter) => void;
  onCompletionStatusChange: (status: CompletionStatus) => void;
  onTrimesterChange?: (trimester: Trimester | 'all') => void;
}

/**
 * AdvancedFilters component for duration, completion status filtering, and presets
 * 
 * Requirements:
 * - 3.1: THE System SHALL provide a filter for story duration (short: <55min, medium: 55-60min, long: >60min)
 * - 3.2: THE System SHALL provide a filter for completion status (completed, in progress, not started)
 * - 3.5: THE System SHALL display the count of matching stories when filters are applied
 * - 3.6: THE System SHALL provide a "Clear all filters" button when any filters are active
 * - 4.3: THE System SHALL allow logged-in users to save filter combinations as named presets
 * - 4.4: THE System SHALL provide quick-access buttons for common filter combinations
 */
export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  selectedDuration,
  selectedCompletionStatus,
  selectedTrimester,
  onDurationChange,
  onCompletionStatusChange,
  onTrimesterChange,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  const durationOptions: { value: DurationFilter; label: string }[] = [
    { value: 'all', label: 'All Durations' },
    { value: 'short', label: 'Short (<55 min)' },
    { value: 'medium', label: 'Medium (55-60 min)' },
    { value: 'long', label: 'Long (>60 min)' },
  ];

  const completionOptions: { value: CompletionStatus; label: string }[] = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'not-started', label: 'Not Started' },
  ];

  const trimesterOptions: { value: Trimester | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Trimesters', color: 'bg-gray-400' },
    { value: 'first', label: 'First Trimester', color: 'bg-pink-500' },
    { value: 'second', label: 'Second Trimester', color: 'bg-purple-500' },
    { value: 'third', label: 'Third Trimester', color: 'bg-indigo-500' },
    { value: 'any', label: 'Any Trimester', color: 'bg-teal-500' },
  ];

  const labelStyle = {
    color: isDark ? currentTheme.colors.text : '#374151',
  };

  const inactiveButtonStyle = {
    color: isDark ? currentTheme.colors.text : '#4b5563',
    backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
  };

  const borderStyle = { borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' };

  return (
    <div className="space-y-0">
      {/* Trimester Filter - Requirements: 1.2, 1.3 */}
      {onTrimesterChange && (
        <div className="pb-2.5 mb-2.5 border-b" style={borderStyle}>
          <h3 
            className="text-xs font-semibold mb-2 flex items-center gap-1.5"
            style={labelStyle}
          >
            <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Trimester
          </h3>
          <div className="space-y-1" role="group" aria-label="Trimester filter">
            {trimesterOptions.map(({ value, label, color }) => {
              const isActive = selectedTrimester === value;
              return (
                <button
                  key={value}
                  onClick={() => onTrimesterChange(value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium button-interactive flex items-center gap-2 focus-ring ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'hover:bg-gray-100'
                  }`}
                  style={!isActive ? inactiveButtonStyle : undefined}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${label}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : color}`} aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Duration Filter */}
      <div className="pb-2.5 mb-2.5 border-b" style={borderStyle}>
        <h3 
          className="text-xs font-semibold mb-2 flex items-center gap-1.5"
          style={labelStyle}
        >
          <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Duration
        </h3>
        <div className="space-y-1" role="group" aria-label="Duration filter">
          {durationOptions.map(({ value, label }) => {
            const isActive = selectedDuration === value;
            return (
              <button
                key={value}
                onClick={() => onDurationChange(value)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 focus-ring ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-gray-100'
                }`}
                style={!isActive ? inactiveButtonStyle : undefined}
                aria-pressed={isActive}
                aria-label={`Filter by ${label}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : 'bg-purple-400'}`} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Completion Status Filter */}
      <div>
        <h3 
          className="text-xs font-semibold mb-2 flex items-center gap-1.5"
          style={labelStyle}
        >
          <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Progress Status
        </h3>
        <div className="space-y-1" role="group" aria-label="Completion status filter">
          {completionOptions.map(({ value, label }) => {
            const isActive = selectedCompletionStatus === value;
            const colorClass = {
              all: 'bg-gray-400',
              completed: 'bg-green-500',
              'in-progress': 'bg-yellow-500',
              'not-started': 'bg-gray-400',
            }[value];
            
            return (
              <button
                key={value}
                onClick={() => onCompletionStatusChange(value)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 focus-ring ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-gray-100'
                }`}
                style={!isActive ? inactiveButtonStyle : undefined}
                aria-pressed={isActive}
                aria-label={`Filter by ${label} status`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : colorClass}`} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
