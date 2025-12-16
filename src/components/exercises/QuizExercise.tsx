import React, { useState } from 'react';
import type { QuizExercise as QuizExerciseType, QuizQuestion } from '../../types/exercises';
import { validateQuizAnswer } from '../../utils/exerciseValidation';

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

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Question {currentQuestionIndex + 1} of {exercise.questions.length}</span>
        <div className="flex gap-1">
          {exercise.questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx < currentQuestionIndex
                  ? 'bg-purple-500'
                  : idx === currentQuestionIndex
                  ? 'bg-purple-300'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="bg-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = index === currentQuestion.correctIndex;
            
            let optionStyle = 'bg-white border-gray-200 hover:border-purple-300';
            if (showFeedback) {
              if (isCorrectOption) {
                optionStyle = 'bg-green-50 border-green-400';
              } else if (isSelected && !isCorrectOption) {
                optionStyle = 'bg-red-50 border-red-400';
              }
            } else if (isSelected) {
              optionStyle = 'bg-purple-100 border-purple-400';
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showFeedback}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionStyle} ${
                  showFeedback ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    isSelected ? 'border-purple-500 bg-purple-500 text-white' : 'border-gray-300 text-gray-500'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-700">{option}</span>
                  {showFeedback && isCorrectOption && (
                    <span className="ml-auto text-green-600">✓</span>
                  )}
                  {showFeedback && isSelected && !isCorrectOption && (
                    <span className="ml-auto text-red-600">✗</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`rounded-xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? 'Excellent!' : 'Not quite, but that\'s okay!'}
              </p>
              <p className="text-gray-700 mt-1">{currentQuestion.explanation}</p>
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
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedOption === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
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
