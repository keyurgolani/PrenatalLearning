import React, { useState, useCallback } from 'react';
import type { Story, Category, TopicExercise, ExerciseSessionResult } from '../types';
import { getInteractiveExercises, hasInteractiveExercises } from '../data/interactiveExercises';
import { getStoryContent } from '../data';
import { exerciseStorageService } from '../services/exerciseStorageService';
import { ExerciseModal } from './exercises/ExerciseModal';
import { DetailedStoryContent } from './DetailedStoryContent';

interface StoryDetailModalProps {
  story: Story;
  category: Category | undefined;
  isCompleted: boolean;
  onClose: () => void;
  onToggleComplete: (storyId: number) => void;
}

/**
 * StoryDetailModal component for displaying full story content
 * 
 * Requirements:
 * - 3.1: Display a detailed view with the full story structure
 * - 3.2: Show the four sections: Introduction, Core Concept, Interactive Elements, and Integration
 * - 3.3: Display recommended mother activities
 * - 3.4: Show a sample content preview of the narrative style
 * - 6.1: Display associated exercises and activities
 * - 6.2: Include reflection prompts for journaling
 * - 6.3: Include breathing and relaxation guidance
 * - 6.4: Include visualization suggestions
 * - 9.1: Display a full narrative script
 * - 9.2: Include scientifically accurate explanations with accessible analogies
 * - 10.1-10.4: Display topic-specific exercises
 */
export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  category,
  isCompleted,
  onClose,
  onToggleComplete,
}) => {
  // State for exercise modal
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showDetailedContent, setShowDetailedContent] = useState(false);
  const [exerciseCompletionStatus, setExerciseCompletionStatus] = useState<{
    completed: boolean;
    score?: number;
    exercisesCompleted?: number;
    totalExercises?: number;
  } | null>(null);

  // Check if detailed story content is available
  const hasDetailedContent = !!getStoryContent(story.id);

  // Check if topic has interactive exercises
  const topicHasExercises = hasInteractiveExercises(story.id);
  const interactiveExercises = topicHasExercises ? getInteractiveExercises(story.id) : [];

  // Load exercise completion status on mount
  React.useEffect(() => {
    if (topicHasExercises) {
      const completionHistory = exerciseStorageService.getCompletionHistory();
      const topicCompletions = completionHistory.filter(h => h.topicId === story.id);
      
      if (topicCompletions.length > 0) {
        const scores = topicCompletions
          .filter(c => c.score !== undefined)
          .map(c => c.score as number);
        
        const averageScore = scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : undefined;

        setExerciseCompletionStatus({
          completed: topicCompletions.length >= interactiveExercises.length,
          score: averageScore,
          exercisesCompleted: topicCompletions.length,
          totalExercises: interactiveExercises.length,
        });
      }
    }
  }, [story.id, topicHasExercises, interactiveExercises.length]);

  // Handle opening exercise modal
  const handleStartExercises = useCallback(() => {
    setShowExerciseModal(true);
  }, []);

  // Handle closing exercise modal
  const handleCloseExerciseModal = useCallback(() => {
    setShowExerciseModal(false);
  }, []);

  // Handle exercise completion
  const handleExerciseComplete = useCallback((results: ExerciseSessionResult) => {
    setExerciseCompletionStatus({
      completed: results.exercisesCompleted >= results.totalExercises,
      score: results.averageScore,
      exercisesCompleted: results.exercisesCompleted,
      totalExercises: results.totalExercises,
    });
    setShowExerciseModal(false);
  }, []);

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

  const sectionDurations = {
    introduction: '~5 minutes',
    coreContent: '~30 minutes',
    interactiveSection: '~15 minutes',
    integration: '~10 minutes',
  };

  const sectionLabels = {
    introduction: 'Introduction',
    coreContent: 'Core Concept',
    interactiveSection: 'Interactive Elements',
    integration: 'Integration',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-8 pb-20">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Category Color Header */}
          <div className={`h-3 ${category?.color || 'bg-gray-400'}`} />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header Section */}
          <div className="p-8 pb-6 bg-gradient-to-b from-purple-50 to-white">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${category?.color || 'bg-gray-400'} mb-3`}>
                  {category?.name || 'Unknown Category'}
                </span>
                <h2 id="modal-title" className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {story.title}
                </h2>
                <p className="text-gray-600">{story.description}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {story.duration} minutes
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                story.difficulty === 'foundational' ? 'bg-green-100 text-green-700' :
                story.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {story.difficulty.charAt(0).toUpperCase() + story.difficulty.slice(1)}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Completed
                </span>
              )}
              {/* Exercise Completion Badge - Requirements 4.8 */}
              {exerciseCompletionStatus?.completed && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Exercises Done
                  {exerciseCompletionStatus.score !== undefined && (
                    <span className="ml-1">({exerciseCompletionStatus.score}%)</span>
                  )}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap gap-3">
              {/* Start Exercises Button - Requirements 5.1 */}
              {topicHasExercises && (
                <button
                  onClick={handleStartExercises}
                  className="inline-flex items-center px-4 py-2.5 rounded-xl font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {exerciseCompletionStatus?.completed 
                    ? 'Review Exercises' 
                    : exerciseCompletionStatus?.exercisesCompleted 
                      ? `Continue Exercises (${exerciseCompletionStatus.exercisesCompleted}/${exerciseCompletionStatus.totalExercises})`
                      : `Start Interactive Exercises (${interactiveExercises.length})`
                  }
                </button>
              )}

              {/* Explore Full Content Button */}
              {hasDetailedContent && (
                <button
                  onClick={() => setShowDetailedContent(!showDetailedContent)}
                  className={`inline-flex items-center px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    showDetailedContent
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {showDetailedContent ? 'Hide Full Content' : 'Explore Full Story Content'}
                </button>
              )}
            </div>
          </div>

          {/* Detailed Story Content - Full narratives and exercises */}
          {showDetailedContent && hasDetailedContent && (
            <div className="p-8 pt-4 border-b border-gray-200 bg-gradient-to-b from-indigo-50/50 to-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>📚</span> Full Story Content
                </h3>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
                  Detailed narratives for reading aloud
                </span>
              </div>
              <DetailedStoryContent storyId={story.id} />
            </div>
          )}

          {/* Content Sections */}
          <div className="p-8 pt-4 space-y-8">
            {/* Key Concepts */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">💡</span> Key Concepts
              </h3>
              <ul className="space-y-2">
                {story.content.keyConcepts.map((concept, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Analogies */}
            {story.content.analogies.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2">🌈</span> Helpful Analogies
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {story.content.analogies.map((analogy, index) => (
                      <li key={index} className="text-gray-700 italic">
                        "{analogy}"
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Story Structure - Four Sections */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📖</span> Story Structure
              </h3>
              <div className="space-y-4">
                {(Object.keys(sectionLabels) as Array<keyof typeof sectionLabels>).map((key) => (
                  <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <h4 className="font-medium text-gray-800">{sectionLabels[key]}</h4>
                      <span className="text-sm text-gray-500">{sectionDurations[key]}</span>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {story.content.narrative[key]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mother Activities */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🤰</span> Recommended Mother Activities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <h4 className="font-medium text-pink-800 mb-1">💕 Gentle Touch</h4>
                  <p className="text-sm text-pink-700">Place hands on belly, sending loving thoughts to your baby</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-medium text-blue-800 mb-1">🌬️ Breathing Exercise</h4>
                  <p className="text-sm text-blue-700">Deep, rhythmic breathing to relax and connect</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-medium text-purple-800 mb-1">✨ Visualization</h4>
                  <p className="text-sm text-purple-700">Imagine concepts as colors and feelings flowing to baby</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <h4 className="font-medium text-amber-800 mb-1">📝 Journaling</h4>
                  <p className="text-sm text-amber-700">Record your thoughts and feelings after each session</p>
                </div>
              </div>
            </section>

            {/* Topic-Specific Exercises */}
            {story.content.exercises.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span> Topic-Specific Exercises
                </h3>
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
                      <h4 className="font-semibold text-gray-800 mb-2">{exercise.title}</h4>
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
              </section>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex gap-4">
            <button
              onClick={() => onToggleComplete(story.id)}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                isCompleted
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg'
              }`}
            >
              {isCompleted ? '✓ Completed - Click to Unmark' : 'Mark as Complete'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Exercise Modal - Requirements 5.1 */}
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

export default StoryDetailModal;

// Note: ExerciseModal is rendered conditionally within the component
