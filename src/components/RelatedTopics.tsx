import React, { useMemo } from 'react';
import type { Story, Category } from '../types';
import type { RelatedStory } from '../services/relatedService';
import { getRelatedStories } from '../services/relatedService';
import { useTheme } from '../contexts/ThemeContext';

/**
 * RelatedTopics component - Displays related story suggestions
 * 
 * Requirements:
 * - 6.1: WHEN a user completes a story, THE System SHALL display 3 related topic suggestions
 * - 6.4: THE System SHALL display related topics in the completion summary screen
 * - 6.5: THE System SHALL also show related topics in a sidebar on the story page
 */

interface RelatedTopicsProps {
  /** The current story to find related topics for */
  storyId: number;
  /** All available stories */
  stories: Story[];
  /** Array of completed story IDs */
  completedStories: number[];
  /** Categories for displaying category info */
  categories: Category[];
  /** Callback when a related story is selected */
  onSelectStory: (story: Story) => void;
  /** Display mode - 'card' for completion summary, 'sidebar' for story page sidebar */
  displayMode?: 'card' | 'sidebar';
}

export const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  storyId,
  stories,
  completedStories,
  categories,
  onSelectStory,
  displayMode = 'card',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Get related stories
  const relatedStories = useMemo(() => {
    return getRelatedStories(storyId, stories, completedStories);
  }, [storyId, stories, completedStories]);

  // Get category by ID
  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find(c => c.id === categoryId);
  };

  // If no related stories, don't render anything
  if (relatedStories.length === 0) {
    return null;
  }

  // Sidebar mode - compact vertical list (renders inside a parent card)
  if (displayMode === 'sidebar') {
    return (
      <div>
        <h3 
          className="text-sm font-semibold uppercase tracking-wider mb-4"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Related Topics
        </h3>
        <div className="space-y-2">
          {relatedStories.map((relatedStory, index) => {
            const category = getCategoryById(relatedStory.story.category);
            const isCompleted = completedStories.includes(relatedStory.story.id);
            
            return (
              <button
                key={relatedStory.story.id}
                onClick={() => onSelectStory(relatedStory.story)}
                className="w-full text-left p-3 rounded-xl transition-all hover:shadow-md focus-ring flex items-start gap-3 animate-slide-up"
                style={{ 
                  backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                  animationDelay: `${index * 0.05}s`,
                }}
                aria-label={`View related topic: ${relatedStory.story.title}`}
              >
                {/* Category icon circle - matching ProgressStepper style */}
                <div 
                  className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${category?.color || 'bg-gray-400'}`}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 
                    className="font-medium text-sm line-clamp-2"
                    style={{ color: isDark ? currentTheme.colors.text : '#374151' }}
                  >
                    {relatedStory.story.title}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}>
                    <span>{relatedStory.story.duration} min</span>
                    <span>•</span>
                    <span className="capitalize">{relatedStory.story.difficulty}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Card mode - for completion summary (horizontal cards)
  return (
    <div className="w-full">
      <h3 
        className="text-lg font-semibold mb-4 text-center"
        style={{ color: isDark ? currentTheme.colors.text : '#374151' }}
      >
        Continue Your Learning Journey
      </h3>
      <p 
        className="text-sm text-center mb-6"
        style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
      >
        Based on what you just learned, you might enjoy these topics:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {relatedStories.map((relatedStory, index) => (
          <RelatedStoryCard
            key={relatedStory.story.id}
            relatedStory={relatedStory}
            category={getCategoryById(relatedStory.story.category)}
            isCompleted={completedStories.includes(relatedStory.story.id)}
            onSelect={() => onSelectStory(relatedStory.story)}
            isDark={isDark}
            theme={currentTheme}
            animationDelay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Individual related story card component
 */
interface RelatedStoryCardProps {
  relatedStory: RelatedStory;
  category: Category | undefined;
  isCompleted: boolean;
  onSelect: () => void;
  isDark: boolean;
  theme: ReturnType<typeof useTheme>['currentTheme'];
  animationDelay?: number;
}

const RelatedStoryCard: React.FC<RelatedStoryCardProps> = ({
  relatedStory,
  category,
  isCompleted,
  onSelect,
  isDark,
  theme,
  animationDelay = 0,
}) => {
  return (
    <button
      onClick={onSelect}
      className="text-left rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all hover:scale-[1.02] focus-ring animate-card-enter"
      style={{ 
        backgroundColor: isDark ? theme.colors.surface : '#ffffff',
        border: `1px solid ${isDark ? theme.colors.border : '#e5e7eb'}`,
        animationDelay: `${animationDelay}s`
      }}
      aria-label={`Start learning: ${relatedStory.story.title}`}
    >
      {/* Category color header */}
      <div className={`h-2 ${category?.color || 'bg-gray-400'}`} />
      
      <div className="p-4">
        {/* Category badge */}
        <span 
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium text-white ${category?.color || 'bg-gray-400'} mb-2`}
        >
          {category?.name || 'Unknown'}
        </span>
        
        {/* Title */}
        <h4 
          className="font-semibold text-sm line-clamp-2 mb-2"
          style={{ color: isDark ? theme.colors.text : '#374151' }}
        >
          {relatedStory.story.title}
        </h4>
        
        {/* Description */}
        <p 
          className="text-xs line-clamp-2 mb-3"
          style={{ color: isDark ? theme.colors.textMuted : '#6b7280' }}
        >
          {relatedStory.story.description}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2" style={{ color: isDark ? theme.colors.textMuted : '#9ca3af' }}>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {relatedStory.story.duration} min
            </span>
            <span>•</span>
            <span className="capitalize">{relatedStory.story.difficulty}</span>
          </div>
          
          {isCompleted ? (
            <span className="flex items-center gap-1 text-green-500">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Done
            </span>
          ) : (
            <span 
              className="text-purple-500 font-medium"
            >
              Start →
            </span>
          )}
        </div>
        
        {/* Relatedness reasons (subtle) */}
        {relatedStory.reasons.length > 0 && (
          <div 
            className="mt-3 pt-2 text-xs"
            style={{ 
              borderTop: `1px solid ${isDark ? theme.colors.border : '#f3f4f6'}`,
              color: isDark ? theme.colors.textMuted : '#9ca3af'
            }}
          >
            {relatedStory.reasons.slice(0, 2).join(' • ')}
          </div>
        )}
      </div>
    </button>
  );
};

export default RelatedTopics;
