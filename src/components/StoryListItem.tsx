import React from 'react';
import type { Story, Category } from '../types';

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
        flex items-stretch bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200
        hover:shadow-md cursor-pointer
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
              className="text-base font-semibold text-gray-800 truncate"
              data-testid="story-title"
            >
              {story.title}
            </h3>
            {isCompleted && (
              <span
                className="flex-shrink-0 bg-green-100 text-green-600 p-0.5 rounded-full"
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
            className="text-sm text-gray-600 leading-relaxed"
            data-testid="story-description"
          >
            {story.description}
          </p>
        </div>

        {/* Metadata Badges */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 flex-shrink-0">
          {/* Duration Badge */}
          <span 
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700 whitespace-nowrap"
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
            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${difficultyColors[story.difficulty]}`}
            data-testid="difficulty-badge"
          >
            {difficultyLabels[story.difficulty]}
          </span>

          {/* Category Badge */}
          <span 
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 whitespace-nowrap"
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
            className="ml-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 whitespace-nowrap"
          >
            View
          </button>
        </div>
      </div>
    </article>
  );
};

export default StoryListItem;
