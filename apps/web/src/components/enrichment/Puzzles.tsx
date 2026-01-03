/**
 * Daily Puzzles Component
 * Displays puzzles with hints and solutions
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getPuzzlesForDate, allPuzzles, getPuzzlesByDifficulty } from '../../data/enrichment/puzzles';
import type { DailyPuzzle } from '../../types/daily';

const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
  easy: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  medium: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  hard: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
};

const difficultyColorsDark: Record<string, { bg: string; text: string; border: string }> = {
  easy: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' },
  medium: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24', border: 'rgba(251, 191, 36, 0.3)' },
  hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' },
};

interface PuzzleCardProps {
  puzzle: DailyPuzzle;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ puzzle }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const colors = isDark ? difficultyColorsDark[puzzle.difficulty] : difficultyColors[puzzle.difficulty];

  const revealNextHint = () => {
    if (hintsRevealed < puzzle.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 
              className="font-semibold mb-1"
              style={{ color: currentTheme.colors.text }}
            >
              {puzzle.title}
            </h3>
            <div className="flex items-center gap-2">
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium capitalize"
                style={{ 
                  backgroundColor: colors.bg, 
                  color: colors.text,
                  border: `1px solid ${colors.border}`,
                }}
              >
                {puzzle.difficulty}
              </span>
              <span 
                className="text-xs"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                ~{puzzle.timeEstimate} min
              </span>
            </div>
          </div>
        </div>

        {/* Puzzle content */}
        <p 
          className="text-sm leading-relaxed"
          style={{ color: currentTheme.colors.text }}
        >
          {puzzle.content}
        </p>
      </div>

      {/* Hints section */}
      <div 
        className="px-4 py-3"
        style={{ 
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
          borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span 
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            Hints ({hintsRevealed}/{puzzle.hints.length})
          </span>
          {hintsRevealed < puzzle.hints.length && (
            <button
              onClick={revealNextHint}
              className="text-xs font-medium transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              Reveal Hint
            </button>
          )}
        </div>

        {hintsRevealed > 0 && (
          <div className="space-y-2">
            {puzzle.hints.slice(0, hintsRevealed).map((hint, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2 text-sm animate-fade-in"
              >
                <svg 
                  className="w-4 h-4 mt-0.5 flex-shrink-0"
                  style={{ color: currentTheme.colors.primary }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span style={{ color: currentTheme.colors.text }}>{hint}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Solution section */}
      <div 
        className="px-4 py-3"
        style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
      >
        {!showSolution ? (
          <button
            onClick={() => setShowSolution(true)}
            className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
              color: currentTheme.colors.text,
            }}
          >
            Reveal Solution
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div>
              <h4 
                className="text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                Solution
              </h4>
              <p 
                className="text-sm font-medium"
                style={{ color: currentTheme.colors.text }}
              >
                {puzzle.solution}
              </p>
            </div>
            <div>
              <h4 
                className="text-xs font-semibold uppercase tracking-wide mb-1"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                Explanation
              </h4>
              <p 
                className="text-sm"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {puzzle.explanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Puzzles: React.FC<{ compact?: boolean; refreshKey?: number }> = ({ compact, refreshKey }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [filter, setFilter] = useState<'today' | 'easy' | 'medium' | 'hard' | 'all'>('all');

  const todaysPuzzles = useMemo(() => getPuzzlesForDate(new Date()), []);

  const [randomPuzzles, setRandomPuzzles] = useState<typeof allPuzzles | null>(null);

  React.useEffect(() => {
    if (!refreshKey) {
        setRandomPuzzles(null);
        return;
    }
    setRandomPuzzles([...allPuzzles].sort(() => 0.5 - Math.random()).slice(0, 1));
  }, [refreshKey]);

  const displayPuzzles = useMemo(() => {
    if (compact) {
        return (refreshKey && randomPuzzles) ? randomPuzzles : todaysPuzzles.puzzles.slice(0, 1);
    }
    // When not compact, even if filter was 'today' (legacy), default to all or specific filters
    switch (filter) {
      case 'today':
        return allPuzzles; // Override 'today' to 'all' for non-daily mix tabs
      case 'easy':
        return getPuzzlesByDifficulty('easy');
      case 'medium':
        return getPuzzlesByDifficulty('medium');
      case 'hard':
        return getPuzzlesByDifficulty('hard');
      case 'all':
        return allPuzzles;
      default:
        return allPuzzles;
    }
  }, [filter, todaysPuzzles, compact, refreshKey, randomPuzzles]);

  const filters: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All Puzzles' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  return (
    <div className="space-y-6">
      {/* Filter tabs - Hidden in compact mode */}
      {!compact && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              style={{
                backgroundColor: filter === f.id 
                  ? currentTheme.colors.primary 
                  : isDark ? currentTheme.colors.surface : 'white',
                color: filter === f.id ? 'white' : currentTheme.colors.text,
                border: filter === f.id 
                  ? 'none' 
                  : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Results count - Hidden in compact mode */}
      {!compact && (
        <p 
          className="text-sm"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          {displayPuzzles.length} puzzle{displayPuzzles.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Puzzle cards */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        {displayPuzzles.map((puzzle) => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} />
        ))}
      </div>

      {displayPuzzles.length === 0 && (
        <div 
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'white',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
            No puzzles available
          </p>
        </div>
      )}
    </div>
  );
};

export default Puzzles;
