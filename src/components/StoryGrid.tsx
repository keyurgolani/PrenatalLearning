import React from 'react';
import type { Story, Category } from '../types';
import type { LayoutMode } from '../contexts/LayoutContext';
import { CompactStoryCard } from './CompactStoryCard';
import { StoryListItem } from './StoryListItem';

interface StoryGridProps {
  stories: Story[];
  categories: Category[];
  completedStories: number[];
  onToggleComplete?: (storyId: number) => void;
  onViewStory: (story: Story) => void;
  layout?: LayoutMode;
}

/**
 * StoryGrid component for displaying stories in grid or list layout
 * 
 * Requirements:
 * - 1.1: Display all available stories organized by category
 * - 3.2: Display topics in single-column list format when list layout selected
 * - 3.3: Display topics in multi-column grid format when grid layout selected
 * - 4.1: Display at least 6 topic cards above the fold on desktop viewports
 * - 4.4: Display cards in a responsive grid layout with consistent styling
 */
export const StoryGrid: React.FC<StoryGridProps> = ({
  stories,
  categories,
  completedStories,
  onViewStory,
  layout = 'grid',
}) => {
  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-purple-50 rounded-full p-6 mb-4">
          <svg
            className="w-12 h-12 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No stories found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Try adjusting your filters or search term to discover more wonderful stories for you and your baby.
        </p>
      </div>
    );
  }

  // List layout - single column with horizontal cards
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {stories.map((story) => (
          <StoryListItem
            key={story.id}
            story={story}
            category={getCategoryById(story.category)}
            isCompleted={completedStories.includes(story.id)}
            onViewStory={onViewStory}
          />
        ))}
      </div>
    );
  }

  // Masonry grid layout using CSS columns for variable height cards
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {stories.map((story) => (
        <CompactStoryCard
          key={story.id}
          story={story}
          category={getCategoryById(story.category)}
          isCompleted={completedStories.includes(story.id)}
          onViewStory={onViewStory}
        />
      ))}
    </div>
  );
};

export default StoryGrid;
