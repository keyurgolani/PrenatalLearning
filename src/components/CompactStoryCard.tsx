import React from 'react';
import type { Story, Category, Trimester } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getTotalReadingTime, formatReadingTime } from '../utils/readingTime';
import { AudioNarrationBadge } from './AudioNarrationBadge';

/**
 * Trimester badge colors and labels
 * Requirements: 1.4 - Display trimester badge with trimester-specific colors
 */
const trimesterConfig: Record<Trimester, { label: string; lightClass: string; darkStyle: React.CSSProperties }> = {
  first: {
    label: '1st Tri',
    lightClass: 'bg-pink-100 text-pink-700',
    darkStyle: { backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#F472B6' },
  },
  second: {
    label: '2nd Tri',
    lightClass: 'bg-purple-100 text-purple-700',
    darkStyle: { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' },
  },
  third: {
    label: '3rd Tri',
    lightClass: 'bg-indigo-100 text-indigo-700',
    darkStyle: { backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC' },
  },
  any: {
    label: 'All Tri',
    lightClass: 'bg-teal-100 text-teal-700',
    darkStyle: { backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#5EEAD4' },
  },
};

interface CompactStoryCardProps {
  story: Story;
  category: Category | undefined;
  isCompleted: boolean;
  onViewStory: (story: Story) => void;
}

/**
 * CompactStoryCard component for displaying story preview
 *
 * Requirements:
 * - 4.2: Show full description without truncation
 * - 4.3: Show title, category indicator, duration, and difficulty level
 *
 * Design Properties:
 * - Property 8: Compact Card Information Completeness
 */
export const CompactStoryCard: React.FC<CompactStoryCardProps> = ({
  story,
  category,
  isCompleted,
  onViewStory,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Theme-aware difficulty colors - muted in dark mode
  const difficultyColors = isDark
    ? {
        foundational: '',
        intermediate: '',
        advanced: '',
      }
    : {
        foundational: 'bg-green-100 text-green-700',
        intermediate: 'bg-yellow-100 text-yellow-700',
        advanced: 'bg-red-100 text-red-700',
      };

  // Dark mode difficulty badge styles
  const darkDifficultyStyles = {
    foundational: { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' },
    intermediate: { backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' },
    advanced: { backgroundColor: 'rgba(248, 113, 113, 0.2)', color: '#F87171' },
  };

  const difficultyLabels = {
    foundational: 'Foundational',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  // Theme-aware card styles
  const cardStyle: React.CSSProperties = isDark
    ? {
        backgroundColor: currentTheme.colors.surface,
        '--glow-color': `${currentTheme.colors.primary}40`,
      } as React.CSSProperties
    : {};

  const cardHoverStyle: React.CSSProperties = isDark
    ? { backgroundColor: currentTheme.colors.surfaceHover }
    : {};

  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <article
      className={`
        shadow-sm overflow-hidden card-interactive theme-colors
        cursor-pointer break-inside-avoid mb-6
        ${isDark ? '' : 'bg-white'}
        ${isCompleted ? 'border-2 border-green-400' : 'border-2 border-transparent'}
        ${isFocused ? 'active' : ''}
      `}
      style={{ 
        borderRadius: '1.5rem',
        ...(isHovered ? { ...cardStyle, ...cardHoverStyle } : cardStyle),
        ...(isCompleted ? {
          backgroundColor: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.05)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        } : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={() => onViewStory(story)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewStory(story);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View story: ${story.title}`}
    >
      {/* Category Color Bar - with rounded top corners */}
      <div
        className={`h-2 ${category?.color || 'bg-gray-400'}`}
        style={{ borderRadius: '1.5rem 1.5rem 0 0' }}
        aria-label={`Category: ${category?.name || 'Unknown'}`}
        data-testid="category-indicator"
      />

      <div className="p-5">
        {/* Header with Title and Completion Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className={`text-base font-semibold leading-snug transition-theme ${isDark ? '' : 'text-gray-800'}`}
            style={isDark ? { color: currentTheme.colors.text } : {}}
            data-testid="story-title"
          >
            {story.title}
          </h3>
          {isCompleted && (
            <span
              className={`flex-shrink-0 p-1 rounded-full animate-badge-pop ${isDark ? '' : 'bg-green-100 text-green-600'}`}
              style={isDark ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' } : {}}
              aria-label="Completed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>

        {/* Full Description */}
        <p
          className={`text-sm mb-4 leading-relaxed transition-theme ${isDark ? '' : 'text-gray-600'}`}
          style={isDark ? { color: currentTheme.colors.textMuted } : {}}
        >
          {story.description}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Narration Badge */}
          <AudioNarrationBadge storyId={story.id} />

          {/* Trimester Badge - Requirements 1.4: Display trimester badge on story cards */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? '' : trimesterConfig[story.recommendedTrimester].lightClass}`}
            style={isDark ? trimesterConfig[story.recommendedTrimester].darkStyle : {}}
            title={`Recommended for ${story.recommendedTrimester === 'any' ? 'all trimesters' : `${story.recommendedTrimester} trimester`}`}
            data-testid="trimester-badge"
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {trimesterConfig[story.recommendedTrimester].label}
          </span>

          {/* Reading Time Badge - Requirements 9.3: Display total story reading time on story cards */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? '' : 'bg-purple-100 text-purple-700'}`}
            style={isDark ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' } : {}}
            data-testid="duration-badge"
            title={`Estimated reading time: ${formatReadingTime(getTotalReadingTime(story))}`}
          >
            <svg
              className="w-3.5 h-3.5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatReadingTime(getTotalReadingTime(story))} read
          </span>

          {/* Difficulty Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[story.difficulty]}`}
            style={isDark ? darkDifficultyStyles[story.difficulty] : {}}
            data-testid="difficulty-badge"
          >
            {difficultyLabels[story.difficulty]}
          </span>

          {/* Category Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDark ? '' : 'bg-gray-100 text-gray-600'}`}
            style={isDark ? { backgroundColor: 'rgba(148, 163, 184, 0.2)', color: currentTheme.colors.textMuted } : {}}
            data-testid="category-badge"
          >
            {category?.name || 'Unknown'}
          </span>
        </div>
      </div>
    </article>
  );
};

export default CompactStoryCard;
