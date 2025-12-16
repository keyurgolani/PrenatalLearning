import React, { useState } from 'react';
import type { SequencingExercise as SequencingExerciseType, SequenceItem } from '../../types/exercises';
import { validateSequence } from '../../utils/exerciseValidation';

interface SequencingExerciseProps {
  exercise: SequencingExerciseType;
  onAnswer: (sequence: string[], correct: boolean) => void;
  onComplete: () => void;
}

/**
 * SequencingExercise Component
 * 
 * Renders a reorderable list of items with button-based reordering.
 * 
 * Requirements:
 * - 6.3: Allow reordering of items into the correct sequence with validation
 */
export const SequencingExercise: React.FC<SequencingExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  // Initialize with shuffled items
  const [items, setItems] = useState<SequenceItem[]>(() => {
    return [...exercise.items].sort(() => Math.random() - 0.5);
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctSequence, setCorrectSequence] = useState<string[]>([]);

  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    if (showFeedback) return;
    
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= items.length) return;

    const newItems = [...items];
    [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
    setItems(newItems);
  };

  const handleSubmit = () => {
    const userSequence = items.map(item => item.id);
    const result = validateSequence(exercise.items, userSequence);
    
    setIsCorrect(result.correct);
    setCorrectSequence(result.correctSequence);
    setShowFeedback(true);
    onAnswer(userSequence, result.correct);
  };

  const getItemStyle = (item: SequenceItem, index: number) => {
    if (!showFeedback) {
      return 'bg-white border-gray-200';
    }
    
    const correctIndex = correctSequence.indexOf(item.id);
    if (index === correctIndex) {
      return 'bg-green-100 border-green-400';
    }
    return 'bg-red-100 border-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-4">
        <p className="text-gray-700">{exercise.instructions}</p>
        <p className="text-sm text-gray-500 mt-2">
          Use the arrows to arrange items in the correct order.
        </p>
      </div>

      {/* Sequence items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${getItemStyle(item, index)}`}
          >
            {/* Position number */}
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium text-sm">
              {index + 1}
            </span>

            {/* Content */}
            <span className="flex-1 text-gray-700">{item.content}</span>

            {/* Move buttons */}
            {!showFeedback && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded transition-all ${
                    index === 0
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  aria-label="Move up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className={`p-1 rounded transition-all ${
                    index === items.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  aria-label="Move down"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Feedback indicator */}
            {showFeedback && (
              <span className={`text-lg ${
                correctSequence.indexOf(item.id) === index ? 'text-green-600' : 'text-red-600'
              }`}>
                {correctSequence.indexOf(item.id) === index ? '✓' : '✗'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`rounded-xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
            <div>
              <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                {isCorrect ? 'Perfect sequence!' : 'Not quite right'}
              </p>
              {!isCorrect && (
                <p className="text-gray-600 mt-1">
                  The items highlighted in red are in the wrong position. The correct order is shown by the position numbers.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            Check Sequence
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default SequencingExercise;
