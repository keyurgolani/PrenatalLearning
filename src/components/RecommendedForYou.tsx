import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTrimester } from '../contexts/TrimesterContext';
import { useTheme } from '../contexts/ThemeContext';
import { filterStoriesByTrimester } from '../utils/trimesterUtils';
import type { Story, Category } from '../types';

interface RecommendedForYouProps {
  stories: Story[];
  categories: Category[];
  completedStories: number[];
  onSelectStory: (story: Story) => void;
  maxStories?: number;
}

/**
 * Calendar Popup Component for date selection - matches SecondaryHeader calendar
 */
interface CalendarPopupProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ selectedDate, onSelectDate, onClose, triggerRef }) => {
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

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

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
      className="absolute right-0 top-full mt-2 rounded-xl shadow-xl border overflow-hidden animate-pop-in"
      style={{
        backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
        borderColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb',
        minWidth: '320px',
        zIndex: 9999,
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
    </div>
  );
};

/**
 * RecommendedForYou component displays stories recommended for the user's current trimester
 * Requirements: 3.3, 3.4, 3.5
 * - Highlight content recommended for the current trimester
 * - Provide a "Recommended for You" section based on current trimester
 * - Prompt user to add due date if not set
 */
export const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  stories,
  categories,
  completedStories,
  onSelectStory,
  maxStories = 6,
}) => {
  const { currentTrimester, hasDueDate, setDueDate } = useTrimester();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const [showDatePicker, setShowDatePicker] = useState(false);

  const trimesterLabels: Record<string, string> = {
    first: 'First Trimester',
    second: 'Second Trimester',
    third: 'Third Trimester',
  };

  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSelectDate = useCallback((date: Date) => {
    setDueDate(date);
  }, [setDueDate]);

  // If no due date, show prompt to set one - subtle inline banner
  if (!hasDueDate) {
    return (
      <div 
        className="rounded-xl px-4 py-3 mb-6"
        style={{ 
          backgroundColor: isDark ? `${currentTheme.colors.primary}10` : `${currentTheme.colors.primary}08`,
          border: `1px solid ${isDark ? `${currentTheme.colors.primary}20` : `${currentTheme.colors.primary}15`}`
        }}
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.colors.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p 
            className="text-sm flex-1"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            <span style={{ color: isDark ? currentTheme.colors.text : '#374151' }}>Set your due date</span> for personalized recommendations
          </p>
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:shadow-md text-sm font-medium"
              style={{ 
                backgroundColor: isDark ? currentTheme.colors.surface : `${currentTheme.colors.primary}10`,
                borderColor: isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}25`,
                color: isDark ? currentTheme.colors.textMuted : currentTheme.colors.primary,
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Set Due Date
            </button>
            
            {showDatePicker && (
              <CalendarPopup
                selectedDate={null}
                onSelectDate={handleSelectDate}
                onClose={() => setShowDatePicker(false)}
                triggerRef={buttonRef}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter stories by current trimester and exclude completed ones
  const recommendedStories = filterStoriesByTrimester(stories, currentTrimester!)
    .filter(story => !completedStories.includes(story.id))
    .slice(0, maxStories);

  if (recommendedStories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 
            className="text-xl font-semibold"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            Recommended for You
          </h2>
          <span 
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff',
              color: isDark ? '#C084FC' : '#7c3aed'
            }}
          >
            {trimesterLabels[currentTrimester!]}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedStories.map((story) => {
          const category = getCategoryById(story.category);
          
          return (
            <article
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="rounded-xl overflow-hidden cursor-pointer card-interactive"
              style={{ 
                backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
                border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStory(story);
                }
              }}
              aria-label={`Read ${story.title}`}
            >
              {/* Category color bar */}
              <div className={`h-1 ${category?.color || 'bg-gray-400'}`} />
              
              <div className="p-4">
                <h3 
                  className="font-medium text-sm mb-2 line-clamp-2"
                  style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
                >
                  {story.title}
                </h3>
                
                <p 
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                >
                  {story.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs">
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff',
                      color: isDark ? '#C084FC' : '#7c3aed'
                    }}
                  >
                    {story.duration} min
                  </span>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f3f4f6',
                      color: isDark ? currentTheme.colors.textMuted : '#6b7280'
                    }}
                  >
                    {category?.name}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedForYou;
