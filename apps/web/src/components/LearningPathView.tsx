import React from 'react';
import type { Story, Category } from '../types';
import {
  buildLearningPathItems,
  getProgressStats,
} from '../services/learningPathService';
import { type LearningPath } from '../data/learningPaths';
import { useTheme } from '../contexts/ThemeContext';
import { AudioNarrationBadge } from './AudioNarrationBadge';

interface LearningPathViewProps {
  stories: Story[];
  categories: Category[];
  completedStories: number[];
  onSelectTopic: (story: Story) => void;
  selectedPath: LearningPath;
}

/**
 * LearningPathView component for displaying topics in a guided learning sequence
 * Features a connected timeline showing the journey progression
 */
export const LearningPathView: React.FC<LearningPathViewProps> = ({
  stories,
  categories,
  completedStories,
  onSelectTopic,
  selectedPath,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const pathItems = buildLearningPathItems(stories, completedStories, selectedPath);
  const stats = getProgressStats(completedStories, selectedPath);
  const storyMap = new Map(stories.map((s) => [s.id, s]));

  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const difficultyColors = isDark
    ? {
        foundational: '',
        intermediate: '',
        advanced: '',
      }
    : {
        foundational: 'bg-green-100 text-green-700 border-green-200',
        intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        advanced: 'bg-red-100 text-red-700 border-red-200',
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
    <div className="space-y-6">
      {/* Progress Header */}
      <div 
        className="rounded-2xl shadow-sm p-6 animate-fade-in"
        style={{ backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 
              className="text-xl font-semibold"
              style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
            >
              {selectedPath.name}
            </h2>
            <p 
              className="text-sm mt-1"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
            >
              {selectedPath.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.completed}/{stats.total}
              </div>
              <div 
                className="text-xs"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                Topics Completed
              </div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className={isDark ? '' : 'text-gray-200'}
                  style={isDark ? { color: currentTheme.colors.border } : undefined}
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - stats.percentage / 100)}`}
                  className="text-purple-600 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span 
                  className="text-sm font-semibold"
                  style={{ color: isDark ? currentTheme.colors.text : '#374151' }}
                >
                  {stats.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Timeline - extra padding for node hover effects (scale + glow) */}
      <div className="relative pl-6 pt-2 pr-4 overflow-visible">
        {pathItems.map((item, index) => {
          const story = storyMap.get(item.storyId);
          if (!story) return null;

          const category = getCategoryById(story.category);
          const isCurrentOrNext = item.isCurrent || item.isNext;
          const isLast = index === pathItems.length - 1;

          // Calculate stagger delay class based on index (max 10)
          const staggerClass = `stagger-${Math.min(index + 1, 10)}`;

          return (
            <div key={item.storyId} className={`relative animate-card-enter ${staggerClass}`}>
              {/* Topic Card */}
              <div className="flex items-start gap-4 mb-6">
                {/* Timeline Node with connector - extra padding for hover glow effect */}
                <div className="relative flex-shrink-0 z-10 p-3 overflow-visible">
                  {/* Connector line to next node */}
                  {!isLast && (
                    <div className="absolute left-1/2 top-[60px] -translate-x-1/2 w-0.5 h-[calc(100%+0.5rem)] z-0">
                      <div 
                        className={`w-full h-full ${
                          item.isCompleted 
                            ? 'bg-gradient-to-b from-green-400 to-green-300' 
                            : isDark 
                              ? 'bg-gradient-to-b from-gray-600 to-gray-700'
                              : 'bg-gradient-to-b from-gray-300 to-gray-200'
                        }`}
                      />
                      {/* Arrow indicator pointing to next node */}
                      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${
                        item.isCompleted ? 'text-green-400' : isDark ? 'text-gray-600' : 'text-gray-300'
                      }`}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 16l-6-6h12l-6 6z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* The Node itself with hover effects */}
                  <button
                    type="button"
                    className={`
                      timeline-node w-12 h-12 rounded-full border-3 flex items-center justify-center
                      shadow-sm cursor-pointer
                      ${item.isCompleted 
                        ? 'node-completed bg-green-500 border-green-400 text-white' 
                        : item.isCurrent 
                          ? 'node-current bg-purple-500 border-purple-400 text-white ring-4 ring-purple-100' 
                          : 'node-pending'
                      }
                    `}
                    style={
                      !item.isCompleted && !item.isCurrent
                        ? { 
                            backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
                            borderColor: isDark ? currentTheme.colors.border : '#d1d5db',
                            color: isDark ? currentTheme.colors.textMuted : '#9ca3af'
                          }
                        : undefined
                    }
                    onClick={() => onSelectTopic(story)}
                    aria-label={`Go to ${story.title}`}
                  >
                    {item.isCompleted ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-lg font-bold">{item.order}</span>
                    )}
                  </button>
                </div>

                {/* Card Content */}
                <article
                  className={`
                    flex-1 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 ease-out
                    hover:shadow-lg card-interactive cursor-pointer border-2 focus-ring
                    ${item.isCurrent 
                      ? 'border-purple-300 shadow-md' 
                      : item.isCompleted 
                        ? 'border-green-200' 
                        : 'border-transparent'
                    }
                  `}
                  style={{ 
                    backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
                    '--glow-color': isDark ? `${currentTheme.colors.primary}40` : 'rgba(139, 92, 246, 0.5)'
                  } as React.CSSProperties}
                  onClick={() => onSelectTopic(story)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTopic(story);
                    }
                  }}
                   
                  tabIndex={0}
                  aria-label={`${item.isCurrent ? 'Current topic: ' : ''}${story.title}${item.isCompleted ? ' (Completed)' : ''}`}
                >
                  {/* Category Color Bar */}
                  <div
                    className={`h-1.5 ${category?.color || 'bg-gray-400'}`}
                    aria-hidden="true"
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Status badges */}
                        <div className="flex items-center gap-2 mb-1.5">
                          {item.isCurrent && (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse animate-badge-pop ${isDark ? '' : 'bg-purple-100 text-purple-700'}`}
                              style={isDark ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' } : {}}
                            >
                              {stats.completed === 0 ? '★ First Step' : '▶ Current Step'}
                            </span>
                          )}
                          {item.isNext && !item.isCurrent && (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold animate-badge-pop ${isDark ? '' : 'bg-blue-100 text-blue-700'}`}
                              style={isDark ? { backgroundColor: 'rgba(96, 165, 250, 0.2)', color: '#60A5FA' } : {}}
                            >
                              Up Next
                            </span>
                          )}
                          {item.isCompleted && (
                            <span 
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold animate-badge-pop ${isDark ? '' : 'bg-green-100 text-green-700'}`}
                              style={isDark ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' } : {}}
                            >
                              ✓ Completed
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 
                          className="text-base font-semibold leading-tight"
                          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
                        >
                          {story.title}
                        </h3>

                        {/* Description - show for current/next topics */}
                        {isCurrentOrNext && (
                          <p 
                            className="text-sm mt-1.5 line-clamp-2"
                            style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
                          >
                            {story.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {/* Audio Narration Badge */}
                          <AudioNarrationBadge storyId={story.id} />
                          
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isDark ? '' : 'bg-purple-100 text-purple-700'}`}
                            style={isDark ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' } : {}}
                          >
                            <svg
                              className="w-3 h-3 mr-1"
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
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[story.difficulty]}`}
                            style={isDark ? darkDifficultyStyles[story.difficulty] : {}}
                          >
                            {difficultyLabels[story.difficulty]}
                          </span>
                          <span 
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isDark ? '' : 'bg-gray-100 text-gray-600'}`}
                            style={isDark ? { backgroundColor: 'rgba(148, 163, 184, 0.2)', color: currentTheme.colors.textMuted } : {}}
                          >
                            {category?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {item.isCurrent ? (
                          <button
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm animate-gentle-bounce animate-click focus-ring"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(story);
                            }}
                            aria-label={`${stats.completed === 0 ? 'Get started with' : 'Continue'} ${story.title}`}
                          >
                            {stats.completed === 0 ? 'Get Started' : 'Continue'}
                          </button>
                        ) : item.isCompleted ? (
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors animate-gentle-bounce animate-click focus-ring ${isDark ? '' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            style={isDark ? { backgroundColor: currentTheme.colors.surfaceHover, color: currentTheme.colors.textMuted } : {}}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(story);
                            }}
                            aria-label={`Review ${story.title}`}
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 animate-gentle-bounce animate-click focus-ring ${isDark ? '' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            style={isDark ? { backgroundColor: currentTheme.colors.surface, color: currentTheme.colors.textMuted } : {}}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(story);
                            }}
                            aria-label={`Preview ${story.title}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {stats.completed === stats.total && stats.total > 0 && (
        <div 
          className="rounded-xl p-6 text-center border-2 animate-bounce-in"
          style={{ 
            background: isDark ? currentTheme.colors.surface : 'linear-gradient(to right, rgb(240 253 244), rgb(236 253 245))',
            borderColor: isDark ? 'rgba(74, 222, 128, 0.3)' : '#bbf7d0'
          }}
        >
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: isDark ? 'rgba(74, 222, 128, 0.2)' : '#dcfce7' }}
          >
            <svg 
              className="w-8 h-8" 
              style={{ color: isDark ? '#4ADE80' : '#16a34a' }}
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            🎉 Journey Complete!
          </h3>
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}>
            You've completed all topics in this learning path. Feel free to revisit any topic to refresh your knowledge.
          </p>
        </div>
      )}
    </div>
  );
};

export default LearningPathView;
