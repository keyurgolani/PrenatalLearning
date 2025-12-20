import React, { useState, useCallback } from 'react';
import type {
  InteractiveExercise,
  ExerciseResponse,
  ExerciseResponseData,
  QuizResponseData,
  MatchingResponseData,
  SequencingResponseData,
  FillBlankResponseData,
  ScenarioResponseData,
  ReflectionResponseData,
  BreathingResponseData,
} from '../../types/exercises';
import type { UserMatch, FillBlankValidationResult } from '../../utils/exerciseValidation';
import { QuizExercise } from './QuizExercise';
import { MatchingExercise } from './MatchingExercise';
import { SequencingExercise } from './SequencingExercise';
import { FillBlankExercise } from './FillBlankExercise';
import { ScenarioExercise } from './ScenarioExercise';
import { ReflectionExercise } from './ReflectionExercise';
import { BreathingExercise } from './BreathingExercise';

/**
 * Props for the ExerciseEngine component
 */
export interface ExerciseEngineProps {
  /** The exercise to render */
  exercise: InteractiveExercise;
  /** Callback when user submits an answer */
  onAnswer: (response: ExerciseResponse) => void;
  /** Callback when exercise is completed */
  onNext: () => void;
  /** Whether to show feedback after answer submission */
  showFeedback: boolean;
  /** Previous response data for reflection exercises */
  previousResponse?: ExerciseResponse;
}

/**
 * ExerciseEngine Component
 * 
 * Core logic component that determines exercise type and renders the appropriate
 * component, handles answer submissions, manages feedback display state, and
 * tracks completion status.
 * 
 * Requirements:
 * - 2.1: Display interactive interface with exercise title, description, and prompts
 * - 2.6: Display completion summary with encouragement when exercise is completed
 */
export const ExerciseEngine: React.FC<ExerciseEngineProps> = ({
  exercise,
  onAnswer,
  onNext,
  showFeedback,
  previousResponse,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | undefined>(undefined);

  /**
   * Create an ExerciseResponse object from response data
   */
  const createResponse = useCallback(
    (data: ExerciseResponseData, completed: boolean, score?: number): ExerciseResponse => {
      return {
        exerciseId: exercise.id,
        topicId: exercise.topicId,
        timestamp: new Date().toISOString(),
        type: exercise.type,
        data,
        completed,
        score,
      };
    },
    [exercise.id, exercise.topicId, exercise.type]
  );

  /**
   * Handle quiz answer submission
   */
  const handleQuizAnswer = useCallback(
    (questionId: string, selectedIndex: number, correct: boolean) => {
      // Build cumulative quiz response data
      const existingData = (previousResponse?.data as QuizResponseData) || { answers: [] };
      const newAnswers = [
        ...existingData.answers.filter(a => a.questionId !== questionId),
        { questionId, selectedIndex, correct },
      ];
      
      const data: QuizResponseData = { answers: newAnswers };
      const response = createResponse(data, false);
      onAnswer(response);
    },
    [createResponse, onAnswer, previousResponse]
  );

  /**
   * Handle quiz completion
   */
  const handleQuizComplete = useCallback(() => {
    if (exercise.type !== 'quiz') return;
    
    const existingData = (previousResponse?.data as QuizResponseData) || { answers: [] };
    const correctCount = existingData.answers.filter(a => a.correct).length;
    const totalQuestions = exercise.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    setCurrentScore(score);
    setIsCompleted(true);
    
    const response = createResponse(existingData, true, score);
    onAnswer(response);
  }, [exercise, createResponse, onAnswer, previousResponse]);

  /**
   * Handle matching exercise answer
   */
  const handleMatchingAnswer = useCallback(
    (matches: UserMatch[], allCorrect: boolean) => {
      const data: MatchingResponseData = {
        matches: matches.map(m => ({
          leftId: m.leftId,
          rightId: m.rightId,
          correct: allCorrect, // Will be updated with individual results
        })),
      };
      
      const score = allCorrect ? 100 : Math.round(
        (matches.filter((_, i) => data.matches[i]?.correct).length / matches.length) * 100
      );
      
      const response = createResponse(data, false, score);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle matching exercise completion
   */
  const handleMatchingComplete = useCallback(() => {
    setIsCompleted(true);
    onNext();
  }, [onNext]);

  /**
   * Handle sequencing exercise answer
   */
  const handleSequencingAnswer = useCallback(
    (sequence: string[], correct: boolean) => {
      const data: SequencingResponseData = { sequence, correct };
      const score = correct ? 100 : 0;
      
      setCurrentScore(score);
      const response = createResponse(data, false, score);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle sequencing exercise completion
   */
  const handleSequencingComplete = useCallback(() => {
    setIsCompleted(true);
    onNext();
  }, [onNext]);

  /**
   * Handle fill-blank exercise answer
   */
  const handleFillBlankAnswer = useCallback(
    (answers: Map<string, string>, results: FillBlankValidationResult[]) => {
      const data: FillBlankResponseData = {
        answers: results.map(r => ({
          sentenceId: r.sentenceId,
          userAnswer: answers.get(r.sentenceId) || '',
          correct: r.correct,
        })),
      };
      
      const correctCount = results.filter(r => r.correct).length;
      const score = Math.round((correctCount / results.length) * 100);
      
      setCurrentScore(score);
      const response = createResponse(data, false, score);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle fill-blank exercise completion
   */
  const handleFillBlankComplete = useCallback(() => {
    setIsCompleted(true);
    onNext();
  }, [onNext]);

  /**
   * Handle scenario exercise answer
   */
  const handleScenarioAnswer = useCallback(
    (selectedChoiceId: string) => {
      const data: ScenarioResponseData = { selectedChoiceId };
      const response = createResponse(data, false);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle scenario exercise completion
   */
  const handleScenarioComplete = useCallback(() => {
    setIsCompleted(true);
    
    const existingData = previousResponse?.data as ScenarioResponseData;
    if (existingData) {
      const response = createResponse(existingData, true);
      onAnswer(response);
    }
    
    onNext();
  }, [createResponse, onAnswer, onNext, previousResponse]);

  /**
   * Handle reflection exercise auto-save
   */
  const handleReflectionAutoSave = useCallback(
    (data: ReflectionResponseData) => {
      const response = createResponse(data, false);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle reflection exercise completion
   */
  const handleReflectionComplete = useCallback(() => {
    setIsCompleted(true);
    
    const existingData = previousResponse?.data as ReflectionResponseData;
    if (existingData) {
      const response = createResponse(existingData, true);
      onAnswer(response);
    }
    
    onNext();
  }, [createResponse, onAnswer, onNext, previousResponse]);

  /**
   * Handle breathing exercise answer
   */
  const handleBreathingAnswer = useCallback(
    (data: BreathingResponseData) => {
      const response = createResponse(data, false);
      onAnswer(response);
    },
    [createResponse, onAnswer]
  );

  /**
   * Handle breathing exercise completion
   */
  const handleBreathingComplete = useCallback(() => {
    setIsCompleted(true);
    
    const existingData = previousResponse?.data as BreathingResponseData;
    if (existingData) {
      const response = createResponse(existingData, true);
      onAnswer(response);
    }
    
    onNext();
  }, [createResponse, onAnswer, onNext, previousResponse]);


  /**
   * Render the appropriate exercise component based on type
   */
  const renderExercise = () => {
    switch (exercise.type) {
      case 'quiz':
        return (
          <QuizExercise
            exercise={exercise}
            onAnswer={handleQuizAnswer}
            onComplete={handleQuizComplete}
          />
        );

      case 'matching':
        return (
          <MatchingExercise
            exercise={exercise}
            onAnswer={handleMatchingAnswer}
            onComplete={handleMatchingComplete}
          />
        );

      case 'sequencing':
        return (
          <SequencingExercise
            exercise={exercise}
            onAnswer={handleSequencingAnswer}
            onComplete={handleSequencingComplete}
          />
        );

      case 'fill-blank':
        return (
          <FillBlankExercise
            exercise={exercise}
            onAnswer={handleFillBlankAnswer}
            onComplete={handleFillBlankComplete}
          />
        );

      case 'scenario':
        return (
          <ScenarioExercise
            exercise={exercise}
            onAnswer={handleScenarioAnswer}
            onComplete={handleScenarioComplete}
          />
        );

      case 'reflection':
        return (
          <ReflectionExercise
            exercise={exercise}
            previousResponses={previousResponse?.data as ReflectionResponseData}
            onAutoSave={handleReflectionAutoSave}
            onComplete={handleReflectionComplete}
          />
        );

      case 'breathing':
        return (
          <BreathingExercise
            exercise={exercise}
            onAnswer={handleBreathingAnswer}
            onComplete={handleBreathingComplete}
          />
        );

      case 'visualization':
        // Visualization exercises use the same component as reflection for now
        // with sequential prompt display
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Visualization Exercise</h4>
                  <p className="text-gray-600">{exercise.description}</p>
                </div>
              </div>
            </div>
            {exercise.prompts.map((prompt, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700">{prompt}</p>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={onNext}
                className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 button-interactive"
              >
                Continue
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Unknown exercise type</p>
          </div>
        );
    }
  };

  return (
    <div className="exercise-engine">
      {/* Exercise header with title and description */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{exercise.title}</h3>
        <p className="text-gray-600">{exercise.description}</p>
        {exercise.guidance && (
          <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">💡 Tip:</span> {exercise.guidance}
            </p>
          </div>
        )}
      </div>

      {/* Exercise content */}
      {renderExercise()}

      {/* Completion summary (shown when exercise is completed and showFeedback is true) */}
      {isCompleted && showFeedback && currentScore !== undefined && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 text-lg">Exercise Complete!</h4>
              <p className="text-green-700">
                {currentScore >= 80
                  ? "Excellent work! You've mastered this concept."
                  : currentScore >= 60
                  ? "Good job! Keep practicing to strengthen your understanding."
                  : "Nice effort! Review the material and try again to improve."}
              </p>
              {currentScore !== undefined && (
                <p className="text-green-600 font-medium mt-1">Score: {currentScore}%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseEngine;
