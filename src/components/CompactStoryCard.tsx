import React from 'react';
import type { Story, Category } from '../types';

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

  const difficultyColors = {
    foundational: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const difficultyLabels = {
    foundational: 'Foundational',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <article
      className={`
        bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-200
        hover:shadow-lg cursor-pointer break-inside-avoid mb-6
        ${isCompleted ? 'ring-2 ring-green-400' : ''}
      `}
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
      {/* Category Color Bar */}
      <div
        className={`h-2 ${category?.color || 'bg-gray-400'}`}
        aria-label={`Category: ${category?.name || 'Unknown'}`}
        data-testid="category-indicator"
      />

      <div className="p-5">
        {/* Header with Title and Completion Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            className="text-base font-semibold text-gray-800 leading-snug"
            data-testid="story-title"
          >
            {story.title}
          </h3>
          {isCompleted && (
            <span
              className="flex-shrink-0 bg-green-100 text-green-600 p-1 rounded-full"
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
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          {story.description}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Duration Badge */}
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
            data-testid="duration-badge"
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
            {story.duration} min
          </span>

          {/* Difficulty Badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${difficultyColors[story.difficulty]}`}
            data-testid="difficulty-badge"
          >
            {difficultyLabels[story.difficulty]}
          </span>

          {/* Category Badge */}
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
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
