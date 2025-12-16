import React from 'react';
import type { Story, Category } from '../types';
import {
  buildLearningPathItems,
  getProgressStats,
} from '../services/learningPathService';
import { type LearningPath } from '../data/learningPaths';

interface LearningPathViewProps {
  stories: Story[];
  categories: Category[];
  completedStories: number[];
  onSelectTopic: (story: Story) => void;
  selectedPath: LearningPath;
}

/**
 * LearningPathView component for displaying topics in a guided learning sequence
 *
 * Requirements:
 * - 2.3: Display topics in a recommended sequential order with progress indicators
 * - 2.4: Display the current topic position and total topics in the path
 * - 2.5: Highlight the next recommended topic after completion
 */
export const LearningPathView: React.FC<LearningPathViewProps> = ({
  stories,
  categories,
  completedStories,
  onSelectTopic,
  selectedPath,
}) => {
  const pathItems = buildLearningPathItems(stories, completedStories, selectedPath);
  const stats = getProgressStats(completedStories, selectedPath);
  const storyMap = new Map(stories.map((s) => [s.id, s]));

  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const difficultyColors = {
    foundational: 'bg-green-100 text-green-700 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    advanced: 'bg-red-100 text-red-700 border-red-200',
  };

  const difficultyLabels = {
    foundational: 'Foundational',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedPath.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedPath.description}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Progress Stats */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.completed}/{stats.total}
              </div>
              <div className="text-xs text-gray-500">Topics Completed</div>
            </div>
            {/* Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
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
                <span className="text-sm font-semibold text-gray-700">
                  {stats.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {pathItems.map((item) => {
            const story = storyMap.get(item.storyId);
            if (!story) return null;

            const category = getCategoryById(story.category);
            const isCurrentOrNext = item.isCurrent || item.isNext;

            return (
              <div
                key={item.storyId}
                className={`
                  relative flex items-start gap-4 pl-4
                  ${item.isCurrent ? 'animate-pulse-subtle' : ''}
                `}
              >
                {/* Timeline Node */}
                <div
                  className={`
                    relative flex-shrink-0 w-5 h-5 rounded-full border-2 
                    flex items-center justify-center
                    ${item.isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : item.isCurrent 
                        ? 'bg-purple-500 border-purple-500 ring-4 ring-purple-100' 
                        : 'bg-white border-gray-300'
                    }
                  `}
                >
                  {item.isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {item.isCurrent && !item.isCompleted && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Topic Card */}
                <article
                  className={`
                    flex-1 bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200
                    hover:shadow-md cursor-pointer
                    ${item.isCurrent ? 'ring-2 ring-purple-400 shadow-md' : ''}
                    ${item.isCompleted ? 'opacity-90' : ''}
                  `}
                  onClick={() => onSelectTopic(story)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTopic(story);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.isCurrent ? 'Current topic: ' : ''}${story.title}${item.isCompleted ? ' (Completed)' : ''}`}
                >
                  {/* Category Color Bar */}
                  <div
                    className={`h-1 ${category?.color || 'bg-gray-400'}`}
                    aria-hidden="true"
                  />

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Position and Status */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Topic {item.order} of {stats.total}
                          </span>
                          {item.isCurrent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Current
                            </span>
                          )}
                          {item.isNext && !item.isCurrent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Up Next
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-semibold text-gray-800 leading-tight">
                          {story.title}
                        </h3>

                        {/* Description - show for current/next topics */}
                        {isCurrentOrNext && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {story.description}
                          </p>
                        )}

                        {/* Metadata */}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[story.difficulty]}`}>
                            {difficultyLabels[story.difficulty]}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            {category?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Completion Status */}
                      <div className="flex-shrink-0">
                        {item.isCompleted ? (
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        ) : item.isCurrent ? (
                          <button
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTopic(story);
                            }}
                          >
                            Start
                          </button>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-400">
                              {item.order}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Message */}
      {stats.completed === stats.total && stats.total > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Congratulations! 🎉
          </h3>
          <p className="text-gray-600">
            You've completed all topics in the learning path. Feel free to revisit any topic to refresh your knowledge.
          </p>
        </div>
      )}
    </div>
  );
};

export default LearningPathView;
