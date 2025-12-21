import React, { useMemo } from 'react';
import type { Story, Category } from '../types';
import type { LastViewedData } from '../services/continueService';
import { formatLastViewedDate } from '../services/continueService';
import { STEP_LABELS } from '../contexts/TopicProgressContext';
import { useTheme } from '../contexts/ThemeContext';

/**
 * ContinueLearningCard component - Displays a prominent card for continuing learning
 * 
 * Requirements:
 * - 5.2: THE System SHALL display a prominent "Continue Learning" card on the home page
 * - 5.3: THE Continue Learning card SHALL show the story title, progress percentage, and last viewed date
 * - 5.4: WHEN clicked, THE System SHALL navigate directly to the last viewed section of the story
 * - 5.5: IF no story is in progress, THE System SHALL suggest the next story in the active learning path
 */

interface ContinueLearningCardProps {
  /** Last viewed data from continue service */
  lastViewed: LastViewedData | null;
  /** The story being continued (from lastViewed.storyId) */
  story: Story | null;
  /** Category for the story */
  category?: Category;
  /** Next suggested story if no story is in progress */
  suggestedStory?: Story | null;
  /** Category for the suggested story */
  suggestedCategory?: Category;
  /** Callback when user clicks to continue */
  onContinue: () => void;
  /** Callback when user clicks to start suggested story */
  onStartSuggested?: () => void;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  lastViewed,
  story,
  category,
  suggestedStory,
  suggestedCategory,
  onContinue,
  onStartSuggested,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Format the last viewed date
  const formattedDate = useMemo(() => {
    if (!lastViewed?.lastViewedAt) return null;
    return formatLastViewedDate(lastViewed.lastViewedAt);
  }, [lastViewed]);

  // Get the section label
  const sectionLabel = useMemo(() => {
    if (!lastViewed?.sectionName) return null;
    return STEP_LABELS[lastViewed.sectionName] || lastViewed.sectionName;
  }, [lastViewed]);

  // Card styles based on theme
  const cardStyle: React.CSSProperties = isDark
    ? {
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border,
      }
    : {
        backgroundColor: 'white',
      };

  const textStyle: React.CSSProperties = isDark
    ? { color: currentTheme.colors.text }
    : { color: '#1f2937' };

  const mutedTextStyle: React.CSSProperties = isDark
    ? { color: currentTheme.colors.textMuted }
    : { color: '#6b7280' };

  // If we have a story in progress, show the continue card
  if (story && lastViewed) {
    return (
      <article
        className={`
          rounded-2xl shadow-lg overflow-hidden transition-all duration-300
          hover:shadow-xl border
          ${isDark ? 'border-opacity-20' : 'border-gray-100'}
        `}
        style={cardStyle}
        role="region"
        aria-label="Continue Learning"
      >
        {/* Category Color Bar */}
        <div
          className={`h-2 ${category?.color || 'bg-purple-500'}`}
          aria-hidden="true"
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="p-2 rounded-lg"
              style={isDark 
                ? { backgroundColor: 'rgba(168, 85, 247, 0.2)' }
                : { backgroundColor: '#f3e8ff' }
              }
            >
              <svg 
                className="w-5 h-5 text-purple-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 
              className="text-lg font-semibold"
              style={textStyle}
            >
              Continue Learning
            </h2>
          </div>

          {/* Story Info */}
          <div className="mb-4">
            <h3 
              className="text-xl font-bold mb-2 line-clamp-2"
              style={textStyle}
            >
              {story.title}
            </h3>
            
            {/* Progress and metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm" style={mutedTextStyle}>
              {/* Progress percentage */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {lastViewed.progressPercentage}% complete
              </span>

              {/* Last viewed date */}
              {formattedDate && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formattedDate}
                </span>
              )}

              {/* Current section */}
              {sectionLabel && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {sectionLabel}
                </span>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-5">
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}
            >
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${lastViewed.progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={lastViewed.progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${lastViewed.progressPercentage}% complete`}
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 button-interactive hover-glow shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus-ring"
            aria-label={`Continue learning ${story.title}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            </svg>
            Continue Learning
          </button>
        </div>
      </article>
    );
  }

  // If no story in progress but we have a suggested story, show suggestion
  if (suggestedStory && onStartSuggested) {
    return (
      <article
        className={`
          rounded-2xl shadow-lg overflow-hidden transition-all duration-300
          hover:shadow-xl border
          ${isDark ? 'border-opacity-20' : 'border-gray-100'}
        `}
        style={cardStyle}
        role="region"
        aria-label="Start Learning"
      >
        {/* Category Color Bar */}
        <div
          className={`h-2 ${suggestedCategory?.color || 'bg-green-500'}`}
          aria-hidden="true"
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="p-2 rounded-lg"
              style={isDark 
                ? { backgroundColor: 'rgba(74, 222, 128, 0.2)' }
                : { backgroundColor: '#dcfce7' }
              }
            >
              <svg 
                className="w-5 h-5 text-green-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
            </div>
            <h2 
              className="text-lg font-semibold"
              style={textStyle}
            >
              Start Your Journey
            </h2>
          </div>

          {/* Story Info */}
          <div className="mb-4">
            <h3 
              className="text-xl font-bold mb-2 line-clamp-2"
              style={textStyle}
            >
              {suggestedStory.title}
            </h3>
            
            <p 
              className="text-sm line-clamp-2 mb-3"
              style={mutedTextStyle}
            >
              {suggestedStory.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-sm" style={mutedTextStyle}>
              {/* Duration */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {suggestedStory.duration} min
              </span>

              {/* Difficulty */}
              <span 
                className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                style={isDark 
                  ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' }
                  : { backgroundColor: '#dcfce7', color: '#15803d' }
                }
              >
                {suggestedStory.difficulty}
              </span>

              {/* Category */}
              <span>{suggestedCategory?.name || 'Unknown'}</span>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStartSuggested}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 focus-ring"
            aria-label={`Start learning ${suggestedStory.title}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Start Learning
          </button>
        </div>
      </article>
    );
  }

  // If no story in progress and no suggestion, show empty state
  return (
    <article
      className={`
        rounded-2xl shadow-lg overflow-hidden transition-all duration-300
        border
        ${isDark ? 'border-opacity-20' : 'border-gray-100'}
      `}
      style={cardStyle}
      role="region"
      aria-label="Learning Progress"
    >
      <div className="p-6 text-center">
        <div 
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={isDark 
            ? { backgroundColor: 'rgba(168, 85, 247, 0.2)' }
            : { backgroundColor: '#f3e8ff' }
          }
        >
          <svg 
            className="w-8 h-8 text-purple-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" 
            />
          </svg>
        </div>
        <h2 
          className="text-lg font-semibold mb-2"
          style={textStyle}
        >
          All Caught Up!
        </h2>
        <p style={mutedTextStyle}>
          You've completed all available stories. Great job on your learning journey!
        </p>
      </div>
    </article>
  );
};

export default ContinueLearningCard;
