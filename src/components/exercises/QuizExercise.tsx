import React, { useState } from 'react';
import type { QuizExercise as QuizExerciseType, QuizQuestion } from '../../types/exercises';
import { validateQuizAnswer } from '../../utils/exerciseValidation';
import { useTheme } from '../../contexts/ThemeContext';

interface QuizExerciseProps {
  exercise: QuizExerciseType;
  onAnswer: (questionId: string, selectedIndex: number, correct: boolean) => void;
  onComplete: () => void;
}

/**
 * QuizExercise Component
 * 
 * Renders multiple-choice questions with immediate feedback.
 * 
 * Requirements:
 * - 6.1: Present multiple-choice questions with immediate feedback on correctness
 * - 6.6: Display encouraging feedback with hints or explanations for incorrect answers
 */
export const QuizExercise: React.FC<QuizExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion: QuizQuestion = exercise.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exercise.questions.length - 1;

  const handleOptionSelect = (index: number) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const result = validateQuizAnswer(currentQuestion, selectedOption);
    setIsCorrect(result.correct);
    setShowFeedback(true);
    onAnswer(currentQuestion.id, selectedOption, result.correct);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const getOptionStyle = (_index: number, isSelected: boolean, isCorrectOption: boolean): React.CSSProperties => {
    if (showFeedback) {
      if (isCorrectOption) {
        return isDark 
          ? { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)' }
          : { backgroundColor: '#f0fdf4', borderColor: '#4ade80' };
      } else if (isSelected && !isCorrectOption) {
        return isDark 
          ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }
          : { backgroundColor: '#fef2f2', borderColor: '#f87171' };
      }
      return isDark 
        ? { backgroundColor: currentTheme.colors.surfaceHover, borderColor: currentTheme.colors.border }
        : { backgroundColor: '#ffffff', borderColor: '#e5e7eb' };
    } else if (isSelected) {
      return isDark 
        ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', borderColor: 'rgba(168, 85, 247, 0.5)' }
        : { backgroundColor: '#f3e8ff', borderColor: '#a855f7' };
    }
    return isDark 
      ? { backgroundColor: currentTheme.colors.surfaceHover, borderColor: currentTheme.colors.border }
      : { backgroundColor: '#ffffff', borderColor: '#e5e7eb' };
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div 
        className="flex items-center justify-between text-sm"
        style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
      >
        <span>Question {currentQuestionIndex + 1} of {exercise.questions.length}</span>
        <div className="flex gap-1">
          {exercise.questions.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: idx < currentQuestionIndex
                  ? (isDark ? '#C084FC' : '#a855f7')
                  : idx === currentQuestionIndex
                  ? (isDark ? 'rgba(168, 85, 247, 0.5)' : '#d8b4fe')
                  : (isDark ? 'rgba(107, 114, 128, 0.3)' : '#e5e7eb')
              }}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div 
        className="rounded-xl p-6"
        style={isDark 
          ? { backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }
          : { backgroundColor: '#faf5ff' }
        }
      >
        <h3 
          className="text-lg font-medium mb-4"
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = index === currentQuestion.correctIndex;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showFeedback}
                className="w-full text-left p-4 rounded-lg border-2 transition-all"
                style={{
                  ...getOptionStyle(index, isSelected, isCorrectOption),
                  cursor: showFeedback ? 'default' : 'pointer'
                }}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium"
                    style={isSelected 
                      ? { borderColor: '#a855f7', backgroundColor: '#a855f7', color: '#ffffff' }
                      : { borderColor: isDark ? 'rgba(156, 163, 175, 0.4)' : '#d1d5db', color: isDark ? currentTheme.colors.textMuted : '#6b7280' }
                    }
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}>{option}</span>
                  {showFeedback && isCorrectOption && (
                    <span className="ml-auto" style={{ color: isDark ? '#4ADE80' : '#16a34a' }}>✓</span>
                  )}
                  {showFeedback && isSelected && !isCorrectOption && (
                    <span className="ml-auto" style={{ color: isDark ? '#F87171' : '#dc2626' }}>✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div 
          className="rounded-xl p-4"
          style={isCorrect 
            ? (isDark 
                ? { backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }
                : { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' })
            : (isDark 
                ? { backgroundColor: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)' }
                : { backgroundColor: '#fffbeb', border: '1px solid #fde68a' })
          }
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
            <div>
              <p 
                className="font-medium"
                style={{ color: isCorrect 
                  ? (isDark ? '#4ADE80' : '#166534')
                  : (isDark ? '#FBBF24' : '#92400e')
                }}
              >
                {isCorrect ? 'Excellent!' : 'Not quite, but that\'s okay!'}
              </p>
              <p 
                className="mt-1"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
              >
                {currentQuestion.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-6 py-2 rounded-lg font-medium transition-all"
            style={selectedOption === null 
              ? { 
                  backgroundColor: isDark ? 'rgba(107, 114, 128, 0.2)' : '#e5e7eb', 
                  color: isDark ? 'rgba(156, 163, 175, 0.5)' : '#9ca3af',
                  cursor: 'not-allowed'
                }
              : { backgroundColor: '#a855f7', color: '#ffffff' }
            }
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            {isLastQuestion ? 'Complete' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizExercise;
