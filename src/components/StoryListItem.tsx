import React from 'react';
import type { Story, Category, Trimester } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getTotalReadingTime, formatReadingTime } from '../utils/readingTime';

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

interface StoryListItemProps {
  story: Story;
  category: Category | undefined;
  isCompleted: boolean;
  onViewStory: (story: Story) => void;
}

/**
 * StoryListItem component for displaying story in horizontal list format
 * 
 * Requirements:
 * - 3.4: Show cards in horizontal format with image, title, description, and metadata visible
 * 
 * Design Properties:
 * - Property 7: List Card Information Completeness
 */
export const StoryListItem: React.FC<StoryListItemProps> = ({
  story,
  category,
  isCompleted,
  onViewStory,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

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

  return (
    <article
      className={`
        flex items-stretch rounded-3xl shadow-sm overflow-hidden card-interactive
        hover:shadow-md cursor-pointer focus-ring
        ${isDark ? '' : 'bg-white'}
        ${isCompleted ? 'border-2 border-green-400' : 'border-2 border-transparent'}
      `}
      style={{
        ...(isDark ? { backgroundColor: currentTheme.colors.surface } : {}),
        ...(isCompleted ? {
          backgroundColor: isDark ? 'rgba(34, 197, 94, 0.08)' : 'rgba(34, 197, 94, 0.05)',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        } : {})
      }}
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
      {/* Category Color Bar (vertical) */}
      <div
        className={`w-2 flex-shrink-0 ${category?.color || 'bg-gray-400'}`}
        aria-label={`Category: ${category?.name || 'Unknown'}`}
        data-testid="category-indicator"
      />

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className="text-base font-semibold truncate"
              style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
              data-testid="story-title"
            >
              {story.title}
            </h3>
            {isCompleted && (
              <span
                className="flex-shrink-0 p-0.5 rounded-full"
                style={isDark ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' } : { backgroundColor: '#dcfce7', color: '#16a34a' }}
                aria-label="Completed"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
            data-testid="story-description"
          >
            {story.description}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
          {/* Trimester Badge - Requirements 1.4: Display trimester badge on story cards */}
          <span
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${isDark ? '' : trimesterConfig[story.recommendedTrimester].lightClass}`}
            style={isDark ? trimesterConfig[story.recommendedTrimester].darkStyle : {}}
            title={`Recommended for ${story.recommendedTrimester === 'any' ? 'all trimesters' : `${story.recommendedTrimester} trimester`}`}
            data-testid="trimester-badge"
          >
            {trimesterConfig[story.recommendedTrimester].label}
          </span>

          {/* Reading Time Badge - Requirements 9.3: Display total story reading time on story cards */}
          <span 
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${isDark ? '' : 'bg-purple-100 text-purple-700'}`}
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
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${difficultyColors[story.difficulty]}`}
            style={isDark ? darkDifficultyStyles[story.difficulty] : {}}
            data-testid="difficulty-badge"
          >
            {difficultyLabels[story.difficulty]}
          </span>

          {/* Category Badge */}
          <span 
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${isDark ? '' : 'bg-gray-100 text-gray-600'}`}
            style={isDark ? { backgroundColor: 'rgba(148, 163, 184, 0.2)', color: currentTheme.colors.textMuted } : {}}
            data-testid="category-badge"
          >
            {category?.name || 'Unknown'}
          </span>

          {/* View Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewStory(story);
            }}
            className="ml-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 button-interactive whitespace-nowrap"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};

export default StoryListItem;
