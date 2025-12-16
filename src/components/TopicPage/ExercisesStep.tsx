import React, { useState, useCallback, useMemo } from 'react';
import type { Story, TopicExercise, ExerciseSessionResult } from '../../types';
import { getInteractiveExercises, hasInteractiveExercises } from '../../data/interactiveExercises';
import { exerciseStorageService } from '../../services/exerciseStorageService';
import { ExerciseModal } from '../exercises/ExerciseModal';

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

const exerciseTypeColors: Record<TopicExercise['type'], string> = {
  reflection: 'bg-purple-50 border-purple-200',
  'thought-experiment': 'bg-blue-50 border-blue-200',
  discussion: 'bg-green-50 border-green-200',
  creative: 'bg-orange-50 border-orange-200',
  visualization: 'bg-indigo-50 border-indigo-200',
  breathing: 'bg-teal-50 border-teal-200',
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
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Exercises</h3>
        <p className="text-gray-500 mt-2">Reinforce your learning with activities</p>
      </div>

      {/* Interactive Exercises Section */}
      {topicHasExercises && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center">
              <span className="mr-2">🎮</span> Interactive Exercises
            </h4>
            {exerciseCompletionStatus?.completed && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
                {exerciseCompletionStatus.score !== undefined && ` (${exerciseCompletionStatus.score}%)`}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">
            Test your understanding with {interactiveExercises.length} interactive exercise{interactiveExercises.length !== 1 ? 's' : ''}.
          </p>

          <button
            onClick={handleStartExercises}
            className="w-full py-3 px-6 rounded-xl font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
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
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span> Topic-Specific Activities
          </h4>
          <div className="space-y-4">
            {story.content.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`rounded-xl p-5 border ${exerciseTypeColors[exercise.type]}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    {exerciseTypeLabels[exercise.type]}
                  </span>
                </div>
                <h5 className="font-semibold text-gray-800 mb-2">{exercise.title}</h5>
                <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
                <div className="space-y-2">
                  {exercise.prompts.map((prompt, promptIndex) => (
                    <div key={promptIndex} className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">→</span>
                      <p className="text-gray-700 text-sm">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No exercises message */}
      {!topicHasExercises && story.content.exercises.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-gray-600">No exercises available for this topic yet.</p>
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
