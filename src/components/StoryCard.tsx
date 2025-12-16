import React from 'react';
import type { Story, Category } from '../types';

interface StoryCardProps {
  story: Story;
  category: Category | undefined;
  isCompleted: boolean;
  onToggleComplete: (storyId: number) => void;
  onViewStory: (story: Story) => void;
}

/**
 * StoryCard component for displaying story preview
 * 
 * Requirements:
 * - 1.4: Display story title, description, duration, difficulty level, and category indicator
 * - 2.2: Display a visual indicator for completed stories
 * - 4.4: Display cards in a responsive grid layout with consistent styling
 * 
 * Design Properties:
 * - Property 3: Story Card Information Completeness
 * - Property 5: Completion Visual Indicator
 */
export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  category,
  isCompleted,
  onToggleComplete,
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
        bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300
        hover:shadow-xl hover:scale-[1.02]
        ${isCompleted ? 'ring-2 ring-green-400' : ''}
      `}
    >
      {/* Category Color Bar */}
      <div
        className={`h-2 ${category?.color || 'bg-gray-400'}`}
        aria-label={`Category: ${category?.name || 'Unknown'}`}
      />

      <div className="p-5">
        {/* Header with Title and Completion Status */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold text-gray-800 leading-tight">
            {story.title}
          </h3>
          {isCompleted && (
            <span
              className="flex-shrink-0 bg-green-100 text-green-600 p-1 rounded-full"
              aria-label="Completed"
            >
              <svg
                className="w-5 h-5"
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

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {story.description}
        </p>

        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Duration Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
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
          >
            {difficultyLabels[story.difficulty]}
          </span>

          {/* Category Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            {category?.name || 'Unknown'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewStory(story)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Begin Story
          </button>
          <button
            onClick={() => onToggleComplete(story.id)}
            className={`
              px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
              ${isCompleted
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? '✓' : '○'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
