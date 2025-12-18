import React, { useState, useRef, useEffect } from 'react';
import { useTrimester } from '../contexts/TrimesterContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * TrimesterDisplay component for showing current trimester and week in the header
 * Requirements: 3.2 - Display current trimester and week number in profile area
 */
export const TrimesterDisplay: React.FC = () => {
  const { currentTrimester, currentWeek, hasDueDate, setDueDate, clearDueDate } = useTrimester();
  const { currentTheme } = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDatePicker]);

  const trimesterLabels: Record<string, string> = {
    first: '1st Trimester',
    second: '2nd Trimester',
    third: '3rd Trimester',
  };

  const trimesterColors: Record<string, string> = {
    first: 'bg-pink-500',
    second: 'bg-purple-500',
    third: 'bg-indigo-500',
  };

  const handleSetDueDate = () => {
    if (dateInput) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        setDueDate(date);
        setShowDatePicker(false);
        setDateInput('');
      }
    }
  };

  if (!hasDueDate) {
    return (
      <div className="relative" ref={containerRef}>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="flex items-center h-8 gap-2 px-3 rounded-lg transition-colors"
          style={{
            backgroundColor: `${currentTheme.colors.primary}15`,
            color: currentTheme.colors.primary,
          }}
          aria-label="Set due date for personalized recommendations"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-medium hidden sm:inline leading-none">Set Due Date</span>
        </button>
        
        {showDatePicker && (
          <div 
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 rounded-xl shadow-xl z-50 min-w-[240px] animate-pop-in"
            style={{ 
              backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
              border: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb'}`
            }}
          >
            <label 
              className="block text-sm font-medium mb-2"
              style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#374151' }}
            >
              Expected Due Date
            </label>
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ 
                backgroundColor: currentTheme.isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                borderColor: currentTheme.isDark ? currentTheme.colors.border : '#d1d5db',
                color: currentTheme.isDark ? currentTheme.colors.text : '#1f2937'
              }}
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowDatePicker(false)}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg"
                style={{ 
                  backgroundColor: currentTheme.isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                  color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSetDueDate}
                className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className="flex items-center h-8 gap-2 px-3 rounded-lg transition-colors cursor-pointer"
        style={{
          backgroundColor: `${currentTheme.colors.primary}15`,
          color: currentTheme.isDark ? currentTheme.colors.text : '#374151',
        }}
        aria-label="Click to change or clear due date"
        title="Click to change or clear due date"
      >
        {/* Trimester indicator */}
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${trimesterColors[currentTrimester || 'first']}`} />
          <span className="text-xs font-medium leading-none">
            {trimesterLabels[currentTrimester || 'first']}
          </span>
        </div>
        
        {/* Week number */}
        <span 
          className="text-xs leading-none"
          style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Week {currentWeek}
        </span>
        
        {/* Edit indicator */}
        <svg 
          className="w-3 h-3 ml-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDatePicker && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-4 rounded-xl shadow-xl z-50 min-w-[240px] animate-pop-in"
          style={{ 
            backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
            border: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb'}`
          }}
        >
          <label 
            className="block text-sm font-medium mb-2"
            style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#374151' }}
          >
            Change Due Date
          </label>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm"
            style={{ 
              backgroundColor: currentTheme.isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
              borderColor: currentTheme.isDark ? currentTheme.colors.border : '#d1d5db',
              color: currentTheme.isDark ? currentTheme.colors.text : '#1f2937'
            }}
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowDatePicker(false)}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg"
              style={{ 
                backgroundColor: currentTheme.isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSetDueDate}
              disabled={!dateInput}
              className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update
            </button>
          </div>
          
          {/* Clear due date option */}
          <button
            onClick={() => {
              clearDueDate();
              setShowDatePicker(false);
              setDateInput('');
            }}
            className="w-full mt-3 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            style={{
              borderColor: currentTheme.isDark ? 'rgba(239, 68, 68, 0.3)' : undefined,
              backgroundColor: currentTheme.isDark ? 'rgba(239, 68, 68, 0.1)' : undefined,
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Due Date
          </button>
        </div>
      )}
    </div>
  );
};

export default TrimesterDisplay;
