import React, { useMemo, useEffect, useState } from 'react';
import type { Story, Category } from '../types';
import type { LayoutMode } from '../contexts/LayoutContext';
import { CompactStoryCard } from './CompactStoryCard';
import { StoryListItem } from './StoryListItem';

/**
 * Hook to get the current number of columns based on screen width
 */
function useColumnCount(): number {
  const [columnCount, setColumnCount] = useState(() => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width >= 1536) return 4; // 2xl
    if (width >= 1024) return 3; // lg
    if (width >= 640) return 2;  // sm
    return 1;
  });

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1536) setColumnCount(4);
      else if (width >= 1024) setColumnCount(3);
      else if (width >= 640) setColumnCount(2);
      else setColumnCount(1);
    };

    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  return columnCount;
}

/**
 * Distribute stories into columns for row-first animation ordering
 * This reorders stories so that when CSS columns fill top-to-bottom,
 * the animation delays create a row-by-row appearance effect
 */
function distributeToColumns<T>(items: T[], columnCount: number): T[] {
  if (columnCount <= 1) return items;
  
  const columns: T[][] = Array.from({ length: columnCount }, () => []);
  
  // Distribute items round-robin across columns
  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });
  
  // Flatten back: all items from col1, then col2, etc.
  return columns.flat();
}

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
  
  // Get column count for masonry distribution (must be called before any returns)
  const columnCount = useColumnCount();
  
  // Distribute stories for row-first animation ordering
  const distributedStories = useMemo(
    () => distributeToColumns(stories, columnCount),
    [stories, columnCount]
  );
  
  // Create a map of original index for animation delay calculation
  const originalIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    stories.forEach((story, index) => map.set(story.id, index));
    return map;
  }, [stories]);

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

  // Masonry layout using CSS columns for natural flow of variable-height cards
  // Stories are reordered so animation delays create row-by-row appearance
  return (
    <div 
      className="columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-5"
      key={storiesKey}
    >
      {distributedStories.map((story) => {
        const originalIndex = originalIndexMap.get(story.id) ?? 0;
        return (
          <div 
            key={story.id} 
            className="animate-card-enter break-inside-avoid"
            style={{ animationDelay: `${Math.min(originalIndex * 40, 400)}ms` }}
          >
            <CompactStoryCard
              story={story}
              category={getCategoryById(story.category)}
              isCompleted={completedStories.includes(story.id)}
              onViewStory={onViewStory}
            />
          </div>
        );
      })}
    </div>
  );
};

export default StoryGrid;
