/**
 * Brain Teasers Component
 * Interactive brain teasers with multiple choice answers
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getTeasersForDate, allTeasers, getTeasersByType, getTeasersByDifficulty } from '../../data/enrichment/brainTeasers';
import type { BrainTeaser, TeaserType } from '../../types/daily';

const teaserTypeLabels: Record<TeaserType, string> = {
  mathematical: 'Math',
  verbal: 'Verbal',
  spatial: 'Spatial',
  memory: 'Memory',
  'processing-speed': 'Speed',
};

const difficultyColors: Record<string, { bg: string; text: string }> = {
  easy: { bg: '#dcfce7', text: '#166534' },
  medium: { bg: '#fef3c7', text: '#92400e' },
  hard: { bg: '#fee2e2', text: '#991b1b' },
};

const difficultyColorsDark: Record<string, { bg: string; text: string }> = {
  easy: { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ade80' },
  medium: { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' },
  hard: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
};

interface TeaserCardProps {
  teaser: BrainTeaser;
}

const TeaserCard: React.FC<TeaserCardProps> = ({ teaser }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userInput, setUserInput] = useState('');

  const colors = isDark ? difficultyColorsDark[teaser.difficulty] : difficultyColors[teaser.difficulty];
  const isCorrect = selectedAnswer === teaser.answer || userInput.toLowerCase().trim() === teaser.answer.toLowerCase().trim();

  const handleSubmit = () => {
    if (teaser.options) {
      if (selectedAnswer) {
        setShowResult(true);
      }
    } else {
      if (userInput.trim()) {
        setShowResult(true);
      }
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setUserInput('');
    setShowResult(false);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span 
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ 
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
              color: currentTheme.colors.text,
            }}
          >
            {teaserTypeLabels[teaser.type]}
          </span>
          <span 
            className="px-2 py-0.5 rounded text-xs font-medium capitalize"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {teaser.difficulty}
          </span>
          {teaser.timeLimit && (
            <span 
              className="text-xs"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {teaser.timeLimit}s
            </span>
          )}
        </div>

        {/* Question */}
        <p 
          className="text-sm font-medium mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          {teaser.question}
        </p>

        {/* Answer options or input */}
        {teaser.options ? (
          <div className="space-y-2 mb-4">
            {teaser.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = showResult && option === teaser.answer;
              const isWrongSelection = showResult && isSelected && !isCorrectOption;

              return (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                  className="w-full text-left p-3 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: isCorrectOption
                      ? (isDark ? 'rgba(34, 197, 94, 0.15)' : '#dcfce7')
                      : isWrongSelection
                        ? (isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2')
                        : isSelected
                          ? (isDark ? `${currentTheme.colors.primary}30` : '#f3e8ff')
                          : isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                    color: currentTheme.colors.text,
                    border: `1px solid ${
                      isCorrectOption
                        ? (isDark ? 'rgba(34, 197, 94, 0.3)' : '#86efac')
                        : isWrongSelection
                          ? (isDark ? 'rgba(239, 68, 68, 0.3)' : '#fca5a5')
                          : isSelected
                            ? currentTheme.colors.primary
                            : 'transparent'
                    }`,
                    cursor: showResult ? 'default' : 'pointer',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-5 h-5 rounded-full border flex items-center justify-center text-xs"
                      style={{
                        borderColor: isSelected ? currentTheme.colors.primary : (isDark ? currentTheme.colors.border : '#d1d5db'),
                        backgroundColor: isSelected ? currentTheme.colors.primary : 'transparent',
                        color: isSelected ? 'white' : (isDark ? currentTheme.colors.textMuted : '#6b7280'),
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isCorrectOption && (
                      <svg className="w-4 h-4 ml-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isWrongSelection && (
                      <svg className="w-4 h-4 ml-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={showResult}
              placeholder="Type your answer..."
              className="w-full px-4 py-2.5 rounded-lg text-sm transition-colors focus-ring"
              style={{
                backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                color: currentTheme.colors.text,
                border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
        )}

        {/* Submit/Reset button */}
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={teaser.options ? !selectedAnswer : !userInput.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: (teaser.options ? selectedAnswer : userInput.trim())
                ? currentTheme.colors.primary
                : isDark ? currentTheme.colors.surfaceHover : '#e5e7eb',
              color: (teaser.options ? selectedAnswer : userInput.trim())
                ? 'white'
                : isDark ? currentTheme.colors.textMuted : '#9ca3af',
              cursor: (teaser.options ? selectedAnswer : userInput.trim()) ? 'pointer' : 'not-allowed',
            }}
          >
            Check Answer
          </button>
        ) : (
          <div className="space-y-3">
            {/* Result */}
            <div 
              className="p-3 rounded-lg"
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
                className="text-sm font-medium mb-1"
                style={{ 
                  color: isCorrect 
                    ? (isDark ? '#4ade80' : '#166534')
                    : (isDark ? '#fbbf24' : '#92400e')
                }}
              >
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </p>
              <p 
                className="text-sm"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {teaser.explanation}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                color: currentTheme.colors.text,
              }}
            >
              Try Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const BrainTeasers: React.FC<{ compact?: boolean; refreshKey?: number }> = ({ compact, refreshKey }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [filter, setFilter] = useState<'today' | TeaserType | 'easy' | 'medium' | 'hard' | 'all'>('all');

  const todaysTeasers = useMemo(() => getTeasersForDate(new Date()), []);

  const [randomTeasers, setRandomTeasers] = useState<typeof allTeasers | null>(null);

  React.useEffect(() => {
    if (!refreshKey) {
        setRandomTeasers(null);
        return;
    }
    setRandomTeasers([...allTeasers].sort(() => 0.5 - Math.random()).slice(0, 1));
  }, [refreshKey]);

  const displayTeasers = useMemo(() => {
    if (compact) {
        return (refreshKey && randomTeasers) ? randomTeasers : todaysTeasers.teasers.slice(0, 1);
    }
    switch (filter) {
      case 'today':
        return allTeasers; // Override
      case 'mathematical':
      case 'verbal':
      case 'spatial':
      case 'memory':
      case 'processing-speed':
        return getTeasersByType(filter);
      case 'easy':
      case 'medium':
      case 'hard':
        return getTeasersByDifficulty(filter);
      case 'all':
        return allTeasers;
      default:
        return allTeasers;
    }
  }, [filter, todaysTeasers, compact, refreshKey, randomTeasers]);

  const filters: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'mathematical', label: 'Math' },
    { id: 'verbal', label: 'Verbal' },
    { id: 'spatial', label: 'Spatial' },
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
          {displayTeasers.length} teaser{displayTeasers.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Teaser cards */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {displayTeasers.map((teaser) => (
          <TeaserCard key={teaser.id} teaser={teaser} />
        ))}
      </div>

      {displayTeasers.length === 0 && (
        <div 
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'white',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
            No brain teasers available
          </p>
        </div>
      )}
    </div>
  );
};

export default BrainTeasers;
