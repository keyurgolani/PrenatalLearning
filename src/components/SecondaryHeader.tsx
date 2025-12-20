import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTrimester } from '../contexts/TrimesterContext';
import { useKick } from '../contexts/KickContext';
import { useReadingMode } from '../contexts/ReadingModeContext';
import { ThemeSelector } from './ThemeSelector';
import { StreakBadge } from './StreakBadge';
import { KickGraph } from './kicks/KickGraph';
import { kickService, generateSessionId } from '../services/kickService';

/**
 * SecondaryHeader - Second row of the header with due date, stats, and controls
 * 
 * For logged-out users: Uses browser storage for streak/kick/progress
 * For logged-in users: Uses server data
 * 
 * In reading mode: Transforms into a floating semi-transparent bar
 */

interface SecondaryHeaderProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

/**
 * Calendar Popup Component for date selection
 */
interface CalendarPopupProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onClear: () => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ selectedDate, onSelectDate, onClear, onClose, triggerRef }) => {
  const { currentTheme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Start with selected date's month or current month
  const [viewDate, setViewDate] = useState(() => {
    const base = selectedDate || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Close on click outside (but not when clicking the trigger button)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      // Don't close if clicking the trigger button (let the button's onClick handle toggle)
      if (triggerRef?.current && triggerRef.current.contains(target)) {
        return;
      }
      if (popupRef.current && !popupRef.current.contains(target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, triggerRef]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === viewDate.getMonth() && 
           selectedDate.getFullYear() === viewDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onSelectDate(newDate);
    onClose();
  };

  const days = [];
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-10 h-10" />);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const selected = isSelected(day);
    const today = isToday(day);
    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
          selected 
            ? 'text-white shadow-md' 
            : today
              ? 'font-bold'
              : 'hover:bg-opacity-20'
        }`}
        style={{
          backgroundColor: selected ? currentTheme.colors.primary : today ? `${currentTheme.colors.primary}20` : 'transparent',
          color: selected ? '#ffffff' : currentTheme.isDark ? currentTheme.colors.text : '#374151',
        }}
      >
        {day}
      </button>
    );
  }

  return (
    <div
      ref={popupRef}
      className="absolute left-0 top-full mt-2 rounded-xl shadow-xl border overflow-hidden animate-pop-in"
      style={{
        backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
        zIndex: 9999,
        borderColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb',
        minWidth: '320px',
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          borderColor: currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6',
        }}
      >
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-base font-semibold text-white">{monthName}</span>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 px-3 pt-3">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div 
            key={d} 
            className="w-10 h-8 flex items-center justify-center text-xs font-semibold uppercase"
            style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1 p-3">
        {days}
      </div>

      {/* Footer with clear button */}
      {selectedDate && (
        <div 
          className="px-3 py-3 border-t"
          style={{ borderColor: currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6' }}
        >
          <button
            onClick={() => { onClear(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: currentTheme.isDark ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2',
              color: '#ef4444',
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

/**
 * Due Date Display/Setter component with calendar popup
 */
const DueDateControl: React.FC = () => {
  const { currentTheme } = useTheme();
  const { hasDueDate, currentTrimester, currentWeek, dueDate, setDueDate, clearDueDate } = useTrimester();
  const [showCalendar, setShowCalendar] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelectDate = useCallback((date: Date) => {
    setDueDate(date);
  }, [setDueDate]);

  const handleClearDate = useCallback(() => {
    clearDueDate();
  }, [clearDueDate]);

  const trimesterColors = {
    first: { bg: `${currentTheme.colors.primary}15`, text: currentTheme.colors.primary, border: `${currentTheme.colors.primary}30` },
    second: { bg: `${currentTheme.colors.primary}15`, text: currentTheme.colors.primary, border: `${currentTheme.colors.primary}30` },
    third: { bg: `${currentTheme.colors.primary}15`, text: currentTheme.colors.primary, border: `${currentTheme.colors.primary}30` },
  };

  const colors = currentTrimester && currentTrimester in trimesterColors 
    ? trimesterColors[currentTrimester as 'first' | 'second' | 'third'] 
    : trimesterColors.first;

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (hasDueDate && dueDate) {
    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-md"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.border,
          }}
        >
          <svg className="w-4 h-4" style={{ color: colors.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm font-semibold" style={{ color: colors.text }}>
            {currentTrimester === 'first' ? '1st' : currentTrimester === 'second' ? '2nd' : '3rd'} Tri
          </span>
          <span className="text-sm opacity-80" style={{ color: colors.text }}>
            Wk {currentWeek}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.text}20`, color: colors.text }}>
            {formatDate(dueDate)}
          </span>
        </button>
        {showCalendar && (
          <CalendarPopup
            selectedDate={dueDate}
            onSelectDate={handleSelectDate}
            onClear={handleClearDate}
            onClose={() => setShowCalendar(false)}
            triggerRef={buttonRef}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setShowCalendar(!showCalendar)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-md"
        style={{ 
          backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : `${currentTheme.colors.primary}10`,
          borderColor: currentTheme.isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}25`,
          color: currentTheme.isDark ? currentTheme.colors.textMuted : currentTheme.colors.primary,
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-medium">Set Due Date</span>
      </button>
      {showCalendar && (
        <CalendarPopup
          selectedDate={null}
          onSelectDate={handleSelectDate}
          onClear={handleClearDate}
          onClose={() => setShowCalendar(false)}
          triggerRef={buttonRef}
        />
      )}
    </div>
  );
};

/**
 * Kick Button with counter for the header - bounces when clicked
 * Shows a beautiful graph popup when clicking on the kick count
 */
const KickButton: React.FC = () => {
  const { currentTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { todayKicks, logKick } = useKick();
  const [isLogging, setIsLogging] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
  const [guestKicks, setGuestKicks] = useState(0);
  const [showGraph, setShowGraph] = useState(false);
  const graphRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close graph popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current && buttonRef.current.contains(target)) {
        return;
      }
      if (graphRef.current && !graphRef.current.contains(target)) {
        setShowGraph(false);
      }
    };
    if (showGraph) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showGraph]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGraph) setShowGraph(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showGraph]);

  // Get guest kicks from localStorage on mount and when kicks are logged
  useEffect(() => {
    if (!isAuthenticated) {
      const kicks = kickService.getAllKicks('guest');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      const todayKicksCount = kicks.filter(k => k.timestamp >= todayTimestamp).length;
      setGuestKicks(todayKicksCount);
    }

    const handleKickLogged = () => {
      if (!isAuthenticated) {
        const kicks = kickService.getAllKicks('guest');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();
        const todayKicksCount = kicks.filter(k => k.timestamp >= todayTimestamp).length;
        setGuestKicks(todayKicksCount);
      }
    };

    window.addEventListener('kickLogged', handleKickLogged);
    return () => window.removeEventListener('kickLogged', handleKickLogged);
  }, [isAuthenticated]);

  const displayKicks = isAuthenticated ? todayKicks : guestKicks;

  const handleKick = useCallback(async () => {
    if (isLogging) return;
    setIsLogging(true);
    setIsKicked(true);

    try {
      if (isAuthenticated) {
        await logKick();
      } else {
        // Guest mode - use localStorage
        kickService.logKick('guest', 0, 'Quick Kick', generateSessionId());
        // Force re-render by triggering a state update
        window.dispatchEvent(new CustomEvent('kickLogged'));
      }
    } catch (err) {
      console.error('Failed to log kick:', err);
    } finally {
      setIsLogging(false);
      // Reset kick animation after delay
      setTimeout(() => setIsKicked(false), 600);
    }
  }, [isAuthenticated, logKick, isLogging]);

  const handleCountClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      setShowGraph(prev => !prev);
    }
  }, [isAuthenticated]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleKick}
        disabled={isLogging}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium button-interactive disabled:opacity-70 ${isKicked ? 'animate-kick-bounce' : ''}`}
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, #ec4899)`,
          color: '#ffffff',
        }}
        title="Log a kick"
      >
        <svg 
          className={`w-4 h-4 ${isKicked ? 'animate-bounce' : ''}`}
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-sm">Kick</span>
        {displayKicks > 0 && (
          <button
            onClick={handleCountClick}
            className={`ml-0.5 px-1.5 py-0.5 text-sm font-bold bg-white/20 rounded-full transition-all ${isAuthenticated ? 'hover:bg-white/30 cursor-pointer' : ''}`}
            title={isAuthenticated ? "View kick activity" : "Today's kicks"}
          >
            {displayKicks}
          </button>
        )}
      </button>

      {/* Kick Graph Popup - only for authenticated users */}
      {showGraph && isAuthenticated && (
        <div
          ref={graphRef}
          className="absolute top-full mt-2 right-0 z-50 w-[400px] animate-pop-in"
          style={{
            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.15))',
          }}
        >
          <div 
            className="rounded-2xl overflow-hidden border"
            style={{
              backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
              borderColor: currentTheme.isDark ? currentTheme.colors.border : '#f3e8ff',
            }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}15, #ec489915)`,
                borderColor: currentTheme.isDark ? currentTheme.colors.border : '#f3e8ff',
              }}
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="font-semibold text-gray-800">Kick Activity</span>
              </div>
              <button
                onClick={() => setShowGraph(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Graph */}
            <div className="p-2">
              <KickGraph 
                days={7} 
                height={200} 
                showMilestones={true}
                chartType="bar"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Progress indicator - compact version
 */
const ProgressIndicator: React.FC<{ completed: number; total: number; percentage: number }> = ({ 
  completed, total, percentage 
}) => {
  const { currentTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-16 h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
      >
        <div
          className="p-2 rounded-lg button-interactive"
          style={{ 
            width: `${percentage}%`,
            background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          }}
        />
      </div>
      <span 
        className="text-sm font-medium tabular-nums"
        style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
      >
        {completed}/{total}
      </span>
    </div>
  );
};

export const SecondaryHeader: React.FC<SecondaryHeaderProps> = ({
  completedCount,
  totalCount,
  progressPercentage,
}) => {
  const { currentTheme } = useTheme();
  const { settings } = useReadingMode();

  // Don't render in reading mode - ReadingModeBar handles that
  if (settings.readingModeEnabled) {
    return null;
  }

  // Subtle theme-colored background
  const bgStyle = currentTheme.isDark 
    ? { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border,
      }
    : {
        background: `linear-gradient(135deg, ${currentTheme.colors.primary}08 0%, ${currentTheme.colors.secondary}08 100%)`,
        borderColor: `${currentTheme.colors.primary}15`,
      };

  return (
    <div 
      className="relative z-40 border-b transition-all"
      style={bgStyle}
    >
      <div className="px-4 lg:px-6 xl:px-8 2xl:px-12 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Due Date */}
          <div className="flex-shrink-0">
            <DueDateControl />
          </div>

          {/* Center: Stats (Streak, Kick, Progress) */}
          <div className="flex items-center gap-4">
            <StreakBadge compact />
            
            <div 
              className="w-px h-6"
              style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}20` }}
            />
            
            <KickButton />
            
            <div 
              className="w-px h-6"
              style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}20` }}
            />
            
            <ProgressIndicator 
              completed={completedCount} 
              total={totalCount} 
              percentage={progressPercentage} 
            />
          </div>

          {/* Right: Theme Controls */}
          <div className="flex-shrink-0">
            <ThemeSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryHeader;
