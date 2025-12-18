import React, { useState } from 'react';
import type { SequencingExercise as SequencingExerciseType, SequenceItem } from '../../types/exercises';
import { validateSequence } from '../../utils/exerciseValidation';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  
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

  const getItemStyle = (item: SequenceItem, index: number): React.CSSProperties => {
    if (!showFeedback) {
      return isDark 
        ? { backgroundColor: currentTheme.colors.surfaceHover, borderColor: currentTheme.colors.border }
        : { backgroundColor: '#ffffff', borderColor: '#e5e7eb' };
    }
    
    const correctIndex = correctSequence.indexOf(item.id);
    if (index === correctIndex) {
      return isDark 
        ? { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.4)' }
        : { backgroundColor: '#dcfce7', borderColor: '#4ade80' };
    }
    return isDark 
      ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }
      : { backgroundColor: '#fee2e2', borderColor: '#f87171' };
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div 
        className="rounded-xl p-4"
        style={isDark 
          ? { backgroundColor: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }
          : { backgroundColor: '#faf5ff' }
        }
      >
        <p style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}>{exercise.instructions}</p>
        <p 
          className="text-sm mt-2"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Use the arrows to arrange items in the correct order.
        </p>
      </div>

      {/* Sequence items */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4 rounded-lg border-2 transition-all"
            style={getItemStyle(item, index)}
          >
            {/* Position number */}
            <span 
              className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm"
              style={isDark 
                ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }
                : { backgroundColor: '#f3e8ff', color: '#7c3aed' }
              }
            >
              {index + 1}
            </span>

            {/* Content */}
            <span 
              className="flex-1"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
            >
              {item.content}
            </span>

            {/* Move buttons */}
            {!showFeedback && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded transition-all"
                  style={index === 0 
                    ? { color: isDark ? 'rgba(156, 163, 175, 0.3)' : '#d1d5db', cursor: 'not-allowed' }
                    : { color: isDark ? currentTheme.colors.textMuted : '#6b7280' }
                  }
                  aria-label="Move up"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="p-1 rounded transition-all"
                  style={index === items.length - 1 
                    ? { color: isDark ? 'rgba(156, 163, 175, 0.3)' : '#d1d5db', cursor: 'not-allowed' }
                    : { color: isDark ? currentTheme.colors.textMuted : '#6b7280' }
                  }
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
              <span style={{ 
                color: correctSequence.indexOf(item.id) === index 
                  ? (isDark ? '#4ADE80' : '#16a34a') 
                  : (isDark ? '#F87171' : '#dc2626'),
                fontSize: '1.125rem'
              }}>
                {correctSequence.indexOf(item.id) === index ? '✓' : '✗'}
              </span>
            )}
          </div>
        ))}
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
                {isCorrect ? 'Perfect sequence!' : 'Not quite right'}
              </p>
              {!isCorrect && (
                <p 
                  className="mt-1"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
                >
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
