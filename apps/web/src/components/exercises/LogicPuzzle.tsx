/**
 * Logic Puzzle Exercise Component
 * Grid-based deduction puzzles with hints and solution verification
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { LogicPuzzleExercise as LogicPuzzleType } from '../../types/exercises';

interface Props {
  exercise: LogicPuzzleType;
  onComplete: () => void;
}

type CellState = 'empty' | 'yes' | 'no';

export const LogicPuzzle: React.FC<Props> = ({ exercise, onComplete }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [gridState, setGridState] = useState<Record<string, CellState>>({});
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const cluesWithHints = useMemo(() => {
    return exercise.clues.map((clue, idx) => ({
      ...clue,
      revealed: idx < hintsRevealed,
    }));
  }, [exercise.clues, hintsRevealed]);

  const revealNextHint = () => {
    if (hintsRevealed < exercise.clues.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const handleGridCellClick = (rowKey: string, colKey: string) => {
    const key = `${rowKey}-${colKey}`;
    const currentState = gridState[key] || 'empty';
    const nextState: CellState = currentState === 'empty' ? 'yes' : currentState === 'yes' ? 'no' : 'empty';
    setGridState({ ...gridState, [key]: nextState });
  };

  const handleAnswerChange = (key: string, value: string) => {
    setUserAnswers({ ...userAnswers, [key]: value });
  };

  const checkSolution = () => {
    // For grid puzzles, check if user's grid matches solution
    if (exercise.puzzleType === 'grid' && exercise.grid) {
      let correct = true;
      for (const [key, value] of Object.entries(exercise.solution)) {
        const userValue = userAnswers[key];
        if (userValue !== value) {
          correct = false;
          break;
        }
      }
      setIsCorrect(correct);
    } else {
      // For other puzzle types, check direct answers
      let correct = true;
      for (const [key, value] of Object.entries(exercise.solution)) {
        if (userAnswers[key]?.toLowerCase().trim() !== value.toLowerCase().trim()) {
          correct = false;
          break;
        }
      }
      setIsCorrect(correct);
    }
  };

  const renderGridPuzzle = () => {
    if (!exercise.grid) return null;
    
    const { rows, columns } = exercise.grid;
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                className="p-2 text-left text-sm font-medium"
                style={{ color: currentTheme.colors.text }}
              />
              {columns.map((col) => (
                <th 
                  key={col}
                  className="p-2 text-center text-sm font-medium"
                  style={{ color: currentTheme.colors.text }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td 
                  className="p-2 text-sm font-medium"
                  style={{ color: currentTheme.colors.text }}
                >
                  {row}
                </td>
                {columns.map((col) => {
                  const key = `${row}-${col}`;
                  const state = gridState[key] || 'empty';
                  
                  return (
                    <td key={col} className="p-1">
                      <button
                        onClick={() => handleGridCellClick(row, col)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          backgroundColor: state === 'yes' 
                            ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7')
                            : state === 'no'
                              ? (isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2')
                              : isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                        }}
                        aria-label={`${row} - ${col}: ${state}`}
                      >
                        {state === 'yes' && (
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {state === 'no' && (
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderAnswerInputs = () => {
    const solutionKeys = Object.keys(exercise.solution);
    
    return (
      <div className="space-y-3">
        <h4 
          className="text-sm font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          Your Answers
        </h4>
        {solutionKeys.map((key) => (
          <div key={key} className="flex items-center gap-3">
            <label 
              className="text-sm min-w-[100px]"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {key}:
            </label>
            <input
              type="text"
              value={userAnswers[key] || ''}
              onChange={(e) => handleAnswerChange(key, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg text-sm transition-colors focus-ring"
              style={{
                backgroundColor: isDark ? currentTheme.colors.surfaceHover : 'white',
                color: currentTheme.colors.text,
                border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
              placeholder="Enter your answer..."
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Scenario */}
      <div 
        className="p-4 rounded-xl"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <p 
          className="text-sm leading-relaxed"
          style={{ color: currentTheme.colors.text }}
        >
          {exercise.scenario}
        </p>
      </div>

      {/* Clues */}
      <div 
        className="p-4 rounded-xl space-y-3"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <h4 
            className="text-sm font-semibold"
            style={{ color: currentTheme.colors.text }}
          >
            Clues
          </h4>
          {hintsRevealed < exercise.clues.length && (
            <button
              onClick={revealNextHint}
              className="text-xs font-medium transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              Reveal Hint ({hintsRevealed}/{exercise.clues.length})
            </button>
          )}
        </div>
        
        <ul className="space-y-2">
          {exercise.clues.map((clue, idx) => (
            <li 
              key={clue.id}
              className="flex items-start gap-2 text-sm"
            >
              <span 
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.border : '#e5e7eb',
                  color: currentTheme.colors.text,
                }}
              >
                {idx + 1}
              </span>
              <span style={{ color: currentTheme.colors.text }}>
                {clue.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Revealed hints */}
        {cluesWithHints.filter(c => c.revealed && c.hint).length > 0 && (
          <div 
            className="mt-3 pt-3 space-y-2"
            style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}` }}
          >
            <h5 
              className="text-xs font-semibold uppercase tracking-wide"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              Hints
            </h5>
            {cluesWithHints.filter(c => c.revealed && c.hint).map((clue) => (
              <p 
                key={clue.id}
                className="text-sm animate-fade-in"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {clue.hint}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Grid puzzle (if applicable) */}
      {exercise.puzzleType === 'grid' && exercise.grid && (
        <div 
          className="p-4 rounded-xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'white',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <h4 
            className="text-sm font-semibold mb-3"
            style={{ color: currentTheme.colors.text }}
          >
            Logic Grid
          </h4>
          {renderGridPuzzle()}
          <p 
            className="text-xs mt-2"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            Click cells to mark: empty → yes → no → empty
          </p>
        </div>
      )}

      {/* Answer inputs */}
      <div 
        className="p-4 rounded-xl"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        {renderAnswerInputs()}
      </div>

      {/* Result feedback */}
      {isCorrect !== null && (
        <div 
          className="p-4 rounded-xl animate-fade-in"
          style={{
            backgroundColor: isCorrect
              ? (isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4')
              : (isDark ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb'),
            border: `1px solid ${isCorrect
              ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#bbf7d0')
              : (isDark ? 'rgba(251, 191, 36, 0.2)' : '#fde68a')
            }`,
          }}
        >
          <p 
            className="text-sm font-medium"
            style={{ 
              color: isCorrect 
                ? (isDark ? '#4ade80' : '#166534')
                : (isDark ? '#fbbf24' : '#92400e')
            }}
          >
            {isCorrect ? exercise.successMessage : 'Not quite right. Try again or reveal the solution.'}
          </p>
        </div>
      )}

      {/* Solution reveal */}
      {showSolution && (
        <div 
          className="p-4 rounded-xl animate-fade-in"
          style={{
            backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
            border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
          }}
        >
          <h4 
            className="text-sm font-semibold mb-2"
            style={{ color: currentTheme.colors.text }}
          >
            Solution
          </h4>
          <ul className="space-y-1">
            {Object.entries(exercise.solution).map(([key, value]) => (
              <li 
                key={key}
                className="text-sm"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                <span className="font-medium">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={checkSolution}
          className="flex-1 py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          Check Solution
        </button>
        {!showSolution && (
          <button
            onClick={() => setShowSolution(true)}
            className="px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
              color: currentTheme.colors.text,
            }}
          >
            Reveal
          </button>
        )}
      </div>

      {/* Complete button */}
      {(isCorrect || showSolution) && (
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-medium text-white transition-colors animate-fade-in"
          style={{ backgroundColor: '#22c55e' }}
        >
          Continue
        </button>
      )}
    </div>
  );
};

export default LogicPuzzle;
