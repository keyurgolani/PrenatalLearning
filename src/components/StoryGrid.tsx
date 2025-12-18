import React, { useMemo } from 'react';
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
 * Grid: Wider cards in responsive columns
 * List: Single column vertical stack
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

  // Create a stable key based on story IDs to detect filter changes
  const storiesKey = useMemo(() => stories.map(s => s.id).join('-'), [stories]);

  if (stories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 animate-card-enter">
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

  // List layout - single column vertical stack, full width
  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-3 w-full" key={storiesKey}>
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className="animate-card-enter"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <StoryListItem
              story={story}
              category={getCategoryById(story.category)}
              isCompleted={completedStories.includes(story.id)}
              onViewStory={onViewStory}
            />
          </div>
        ))}
      </div>
    );
  }

  // Grid layout - responsive columns with staggered animation
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      key={storiesKey}
    >
      {stories.map((story, index) => (
        <div 
          key={story.id} 
          className="animate-card-enter"
          style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
        >
          <CompactStoryCard
            story={story}
            category={getCategoryById(story.category)}
            isCompleted={completedStories.includes(story.id)}
            onViewStory={onViewStory}
          />
        </div>
      ))}
    </div>
  );
};

export default StoryGrid;
