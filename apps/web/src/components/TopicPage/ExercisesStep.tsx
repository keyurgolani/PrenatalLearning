import React, { useState, useCallback, useMemo } from 'react';
import type { Story, TopicExercise, ExerciseSessionResult } from '../../types';
import { getInteractiveExercises, hasInteractiveExercises } from '../../data/interactiveExercises';
import { exerciseStorageService } from '../../services/exerciseStorageService';
import { ExerciseModal } from '../exercises/ExerciseModal';
import { useTheme } from '../../contexts/ThemeContext';
import { useReadingMode } from '../../contexts/ReadingModeContext';

/**
 * ExercisesStep component - Interactive exercises step
 * Requirements: 7.3 - Display only the content for the current step
 */

interface ExercisesStepProps {
  story: Story;
}

const exerciseTypeLabels: Record<TopicExercise['type'], string> = {
  reflection: '🪞 Reflection',
  'thought-experiment': '💭 Thought Experiment',
  discussion: '💬 Discussion',
  creative: '🎨 Creative Activity',
  visualization: '✨ Visualization',
  breathing: '🌬️ Breathing',
};

const getExerciseTypeColors = (type: TopicExercise['type'], isDark: boolean): { backgroundColor: string; borderColor: string } => {
  const colors: Record<TopicExercise['type'], { light: { bg: string; border: string }; dark: { bg: string; border: string } }> = {
    reflection: { light: { bg: '#faf5ff', border: '#e9d5ff' }, dark: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' } },
    'thought-experiment': { light: { bg: '#eff6ff', border: '#bfdbfe' }, dark: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' } },
    discussion: { light: { bg: '#f0fdf4', border: '#bbf7d0' }, dark: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)' } },
    creative: { light: { bg: '#fff7ed', border: '#fed7aa' }, dark: { bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.3)' } },
    visualization: { light: { bg: '#eef2ff', border: '#c7d2fe' }, dark: { bg: 'rgba(99, 102, 241, 0.15)', border: 'rgba(99, 102, 241, 0.3)' } },
    breathing: { light: { bg: '#f0fdfa', border: '#99f6e4' }, dark: { bg: 'rgba(20, 184, 166, 0.15)', border: 'rgba(20, 184, 166, 0.3)' } },
  };
  const colorSet = colors[type];
  return isDark 
    ? { backgroundColor: colorSet.dark.bg, borderColor: colorSet.dark.border }
    : { backgroundColor: colorSet.light.bg, borderColor: colorSet.light.border };
};

/**
 * Helper to compute initial exercise completion status
 */
function computeInitialCompletionStatus(
  storyId: number,
  topicHasExercises: boolean,
  exerciseCount: number
): { completed: boolean; score?: number; exercisesCompleted?: number; totalExercises?: number } | null {
  if (!topicHasExercises) return null;
  
  const completionHistory = exerciseStorageService.getCompletionHistory();
  const topicCompletions = completionHistory.filter(h => h.topicId === storyId);
  
  if (topicCompletions.length === 0) return null;
  
  const scores = topicCompletions
    .filter(c => c.score !== undefined)
    .map(c => c.score as number);
  
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : undefined;

  return {
    completed: topicCompletions.length >= exerciseCount,
    score: averageScore,
    exercisesCompleted: topicCompletions.length,
    totalExercises: exerciseCount,
  };
}

export const ExercisesStep: React.FC<ExercisesStepProps> = ({ story }) => {
  const { currentTheme } = useTheme();
  const { settings: readingSettings } = useReadingMode();
  const isDark = currentTheme.isDark ?? false;
  const isReadingMode = readingSettings.readingModeEnabled;
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  
  const topicHasExercises = hasInteractiveExercises(story.id);
  const interactiveExercises = topicHasExercises ? getInteractiveExercises(story.id) : [];
  
  // Compute initial status using useMemo to avoid effect
  const initialStatus = useMemo(
    () => computeInitialCompletionStatus(story.id, topicHasExercises, interactiveExercises.length),
    [story.id, topicHasExercises, interactiveExercises.length]
  );
  
  const [exerciseCompletionStatus, setExerciseCompletionStatus] = useState<{
    completed: boolean;
    score?: number;
    exercisesCompleted?: number;
    totalExercises?: number;
  } | null>(initialStatus);

  const handleStartExercises = useCallback(() => {
    setShowExerciseModal(true);
  }, []);

  const handleCloseExerciseModal = useCallback(() => {
    setShowExerciseModal(false);
  }, []);

  const handleExerciseComplete = useCallback((results: ExerciseSessionResult) => {
    setExerciseCompletionStatus({
      completed: results.exercisesCompleted >= results.totalExercises,
      score: results.averageScore,
      exercisesCompleted: results.exercisesCompleted,
      totalExercises: results.totalExercises,
    });
    setShowExerciseModal(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Section Header - smaller in reading mode, expands on hover */}
      <div 
        className={`group text-center transition-all duration-300 ${
          isReadingMode 
            ? 'mb-4 opacity-60 hover:opacity-100 hover:mb-8' 
            : 'mb-8'
        }`}
      >
        <div 
          className={`inline-flex items-center justify-center rounded-full mb-4 transition-all duration-300 ${
            isReadingMode 
              ? 'w-0 h-0 opacity-0 group-hover:w-16 group-hover:h-16 group-hover:opacity-100' 
              : 'w-16 h-16'
          }`}
          style={isDark 
            ? { backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#F472B6' }
            : { backgroundColor: '#fce7f3', color: '#db2777' }
          }
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 
          className={`font-bold transition-all duration-300 ${
            isReadingMode 
              ? 'text-sm group-hover:text-2xl' 
              : 'text-2xl'
          }`}
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          Exercises
          <span 
            className={`ml-2 font-normal text-xs transition-all duration-300 ${
              isReadingMode 
                ? 'inline group-hover:hidden' 
                : 'hidden'
            }`}
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            · Activities
          </span>
        </h3>
        <p 
          className={`mt-2 transition-all duration-300 ${
            isReadingMode 
              ? 'h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100' 
              : ''
          }`}
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Reinforce your learning with activities
        </p>
      </div>

      {/* Interactive Exercises Section */}
      {topicHasExercises && (
        <div 
          className="rounded-2xl p-6"
          style={isDark 
            ? { backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)' }
            : { background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }
          }
        >
          <div className="flex items-center justify-between mb-4">
            <h4 
              className="text-lg font-semibold flex items-center"
              style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
            >
              <span className="mr-2">🎮</span> Interactive Exercises
            </h4>
            {exerciseCompletionStatus?.completed && (
              <span 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                style={isDark 
                  ? { backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80' }
                  : { backgroundColor: '#dcfce7', color: '#15803d' }
                }
              >
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
                {exerciseCompletionStatus.score !== undefined && ` (${exerciseCompletionStatus.score}%)`}
              </span>
            )}
          </div>
          
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }} className="mb-4">
            Test your understanding with {interactiveExercises.length} interactive exercise{interactiveExercises.length !== 1 ? 's' : ''}.
          </p>

          <button
            onClick={handleStartExercises}
            className="w-full py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg button-interactive hover-glow flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {exerciseCompletionStatus?.completed 
              ? 'Review Exercises' 
              : exerciseCompletionStatus?.exercisesCompleted 
                ? `Continue (${exerciseCompletionStatus.exercisesCompleted}/${exerciseCompletionStatus.totalExercises})`
                : 'Start Exercises'
            }
          </button>
        </div>
      )}

      {/* Topic-Specific Exercises */}
      {story.content.exercises.length > 0 && (
        <div 
          className="rounded-2xl p-6"
          style={{ 
            backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
          }}
        >
          <h4 
            className="text-lg font-semibold mb-4 flex items-center"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            <span className="mr-2">🎯</span> Topic-Specific Activities
          </h4>
          <div className="space-y-4">
            {story.content.exercises.map((exercise, index) => {
              const typeColors = getExerciseTypeColors(exercise.type, isDark);
              return (
                <div
                  key={index}
                  className="rounded-xl p-5"
                  style={{ 
                    backgroundColor: typeColors.backgroundColor,
                    border: `1px solid ${typeColors.borderColor}`
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                    >
                      {exerciseTypeLabels[exercise.type]}
                    </span>
                  </div>
                  <h5 
                    className="font-semibold mb-2"
                    style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
                  >
                    {exercise.title}
                  </h5>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
                  >
                    {exercise.description}
                  </p>
                  <div className="space-y-2">
                    {exercise.prompts.map((prompt, promptIndex) => (
                      <div key={promptIndex} className="flex items-start gap-2">
                        <span style={{ color: isDark ? '#C084FC' : '#a855f7' }} className="font-bold">→</span>
                        <p 
                          className="text-sm"
                          style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
                        >
                          {prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No exercises message */}
      {!topicHasExercises && story.content.exercises.length === 0 && (
        <div 
          className="text-center py-8 rounded-2xl"
          style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb' }}
        >
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(107, 114, 128, 0.2)' : '#e5e7eb' }}
          >
            <span className="text-2xl">📝</span>
          </div>
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}>
            No exercises available for this topic yet.
          </p>
        </div>
      )}

      {/* Exercise Modal */}
      {showExerciseModal && topicHasExercises && (
        <ExerciseModal
          topicId={story.id}
          exercises={interactiveExercises}
          onClose={handleCloseExerciseModal}
          onComplete={handleExerciseComplete}
        />
      )}
    </div>
  );
};

export default ExercisesStep;
