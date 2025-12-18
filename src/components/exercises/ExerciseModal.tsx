import React, { useState, useCallback } from 'react';
import type {
  InteractiveExercise,
  ExerciseResponse,
  ExerciseSessionResult,
} from '../../types/exercises';
import { exerciseStorageService } from '../../services/exerciseStorageService';
import { ExerciseEngine } from './ExerciseEngine';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Props for the ExerciseModal component
 */
export interface ExerciseModalProps {
  /** Topic ID for the exercises */
  topicId: number;
  /** Array of exercises to display */
  exercises: InteractiveExercise[];
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when all exercises are completed */
  onComplete: (results: ExerciseSessionResult) => void;
}

/**
 * ExerciseModal Component
 * 
 * Main container component that manages exercise sessions, including:
 * - Navigation between exercises
 * - Progress tracking
 * - Completion summary
 * - Exit with save functionality
 * 
 * Requirements:
 * - 2.1: Display interactive interface with exercise title, description, and prompts
 * - 2.6: Display completion summary with encouragement when exercise is completed
 * - 5.2: Display progress indicators showing current exercise and total exercises
 * - 5.3: Provide a way to save progress and return later
 * - 5.4: Offer navigation to the next exercise or return to the story
 */
export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  topicId,
  exercises,
  onClose,
  onComplete,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Map<string, ExerciseResponse>>(() => {
    // Initialize state from storage
    const savedResponses = exerciseStorageService.getResponses(topicId);
    const responseMap = new Map<string, ExerciseResponse>();
    savedResponses.forEach(response => {
      responseMap.set(response.exerciseId, response);
    });
    return responseMap;
  });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [sessionResult, setSessionResult] = useState<ExerciseSessionResult | null>(null);


  const currentExercise = exercises[currentIndex];
  const totalExercises = exercises.length;
  const isLastExercise = currentIndex === totalExercises - 1;

  /**
   * Handle answer submission from ExerciseEngine
   */
  const handleAnswer = useCallback((response: ExerciseResponse) => {
    setResponses(prev => {
      const newResponses = new Map(prev);
      newResponses.set(response.exerciseId, response);
      return newResponses;
    });
    
    // Save to storage immediately
    exerciseStorageService.saveResponse(response);
  }, []);

  /**
   * Navigate to the next exercise or complete the session
   */
  const handleNext = useCallback(() => {
    if (isLastExercise) {
      // Calculate session results
      const completedCount = Array.from(responses.values()).filter(r => r.completed).length;
      const scores = Array.from(responses.values())
        .filter(r => r.score !== undefined)
        .map(r => r.score as number);
      
      const averageScore = scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : undefined;

      const result: ExerciseSessionResult = {
        topicId,
        exercisesCompleted: completedCount,
        totalExercises,
        averageScore,
        completedAt: new Date().toISOString(),
      };

      setSessionResult(result);
      setIsSessionComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [isLastExercise, responses, topicId, totalExercises]);

  /**
   * Navigate to the previous exercise
   */
  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  /**
   * Handle exit button click - show confirmation if there's progress
   */
  const handleExitClick = useCallback(() => {
    if (responses.size > 0) {
      setShowExitConfirm(true);
    } else {
      onClose();
    }
  }, [responses.size, onClose]);

  /**
   * Confirm exit and save progress
   */
  const handleConfirmExit = useCallback(() => {
    // Progress is already saved via handleAnswer
    setShowExitConfirm(false);
    onClose();
  }, [onClose]);

  /**
   * Cancel exit confirmation
   */
  const handleCancelExit = useCallback(() => {
    setShowExitConfirm(false);
  }, []);

  /**
   * Handle session completion - return to story
   */
  const handleReturnToStory = useCallback(() => {
    if (sessionResult) {
      onComplete(sessionResult);
    }
    onClose();
  }, [sessionResult, onComplete, onClose]);

  /**
   * Get previous response for current exercise
   */
  const getPreviousResponse = useCallback(() => {
    return responses.get(currentExercise?.id);
  }, [responses, currentExercise]);

  // Don't render if no exercises
  if (!exercises || exercises.length === 0) {
    return null;
  }


  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleExitClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-8 pb-20">
        <div 
          className="relative rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden animate-pop-in"
          style={{ backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff' }}
        >
          {/* Header with progress indicator */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleExitClick}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label="Exit exercises"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 id="exercise-modal-title" className="text-lg font-semibold text-white">
                  Interactive Exercises
                </h2>
              </div>
              
              {/* Progress Indicator - Requirements 5.2 */}
              {!isSessionComplete && (
                <div className="flex items-center gap-2">
                  <span className="text-white/80 text-sm">Progress:</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white font-medium text-sm">
                    {currentIndex + 1} / {totalExercises}
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {!isSessionComplete && (
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
                />
              </div>
            )}
          </div>


          {/* Main Content Area */}
          <div className="p-6">
            {isSessionComplete && sessionResult ? (
              /* Completion Summary - Requirements 2.6, 5.4 */
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <span className="text-5xl">🎉</span>
                </div>
                <h3 
                  className="text-2xl font-bold mb-2"
                  style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
                >
                  Congratulations!
                </h3>
                <p 
                  className="mb-6"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
                >
                  You've completed all the exercises for this topic.
                </p>
                
                {/* Session Stats */}
                <div 
                  className="rounded-xl p-6 mb-6"
                  style={isDark 
                    ? { backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }
                    : { background: 'linear-gradient(to right, #faf5ff, #fdf2f8)' }
                  }
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold" style={{ color: isDark ? '#C084FC' : '#9333ea' }}>
                        {sessionResult.exercisesCompleted}
                      </p>
                      <p className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}>Exercises Completed</p>
                    </div>
                    {sessionResult.averageScore !== undefined && (
                      <div className="text-center">
                        <p className="text-3xl font-bold" style={{ color: isDark ? '#F472B6' : '#db2777' }}>
                          {sessionResult.averageScore}%
                        </p>
                        <p className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}>Average Score</p>
                      </div>
                    )}
                  </div>
                </div>

                <p 
                  className="mb-8"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
                >
                  {sessionResult.averageScore !== undefined && sessionResult.averageScore >= 80
                    ? "Excellent work! You've shown great understanding of this topic. 🌟"
                    : sessionResult.averageScore !== undefined && sessionResult.averageScore >= 60
                    ? "Good job! Keep exploring to deepen your understanding. 💪"
                    : "Great effort! Every step of learning is valuable. 💖"}
                </p>

                {/* Return to Story Button - Requirements 5.4 */}
                <button
                  onClick={handleReturnToStory}
                  className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
                >
                  Return to Story
                </button>
              </div>
            ) : (
              /* Exercise Content */
              <>
                <ExerciseEngine
                  exercise={currentExercise}
                  onAnswer={handleAnswer}
                  onNext={handleNext}
                  showFeedback={true}
                  previousResponse={getPreviousResponse()}
                />

                {/* Navigation Buttons - Requirements 5.4 */}
                <div 
                  className="flex justify-between items-center mt-6 pt-6"
                  style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
                >
                  <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                    style={currentIndex === 0 
                      ? { color: isDark ? 'rgba(156, 163, 175, 0.5)' : '#9ca3af', cursor: 'not-allowed' }
                      : { color: isDark ? currentTheme.colors.textMuted : '#4b5563' }
                    }
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
                  >
                    {isLastExercise ? 'Complete' : 'Next'}
                    {!isLastExercise && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Exit Confirmation Dialog - Requirements 5.3 */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={handleCancelExit}
          />
          <div 
            className="relative rounded-2xl shadow-xl max-w-sm w-full p-6"
            style={{ backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff' }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={isDark 
                  ? { backgroundColor: 'rgba(251, 191, 36, 0.2)' }
                  : { backgroundColor: '#fef3c7' }
                }
              >
                <span className="text-3xl">💾</span>
              </div>
              <h3 
                className="text-lg font-semibold mb-2"
                style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
              >
                Save & Exit?
              </h3>
              <p 
                className="mb-6"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
              >
                Your progress has been saved. You can continue where you left off later.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelExit}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-all"
                  style={isDark 
                    ? { backgroundColor: currentTheme.colors.surfaceHover, color: currentTheme.colors.textMuted }
                    : { backgroundColor: '#f3f4f6', color: '#4b5563' }
                  }
                >
                  Continue
                </button>
                <button
                  onClick={handleConfirmExit}
                  className="flex-1 px-4 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
                >
                  Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseModal;
