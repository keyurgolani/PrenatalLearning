/**
 * Daily Facts Component
 * Displays interesting facts across various categories
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getFactsForDate, allFacts, getFactsByCategory } from '../../data/enrichment/facts';
import type { DailyFact, FactCategory } from '../../types/daily';

const categoryIcons: Record<FactCategory, React.ReactNode> = {
  science: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  history: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  nature: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  body: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  space: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  psychology: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  culture: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const categoryColors: Record<FactCategory, string> = {
  science: '#3b82f6',
  history: '#f59e0b',
  nature: '#22c55e',
  body: '#ec4899',
  space: '#8b5cf6',
  psychology: '#06b6d4',
  culture: '#f97316',
};

interface FactCardProps {
  fact: DailyFact;
}

const FactCard: React.FC<FactCardProps> = ({ fact }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [expanded, setExpanded] = useState(false);

  const categoryColor = categoryColors[fact.category];

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
    >
      <div className="p-4">
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span 
            className="p-1.5 rounded-lg"
            style={{ 
              backgroundColor: isDark ? `${categoryColor}20` : `${categoryColor}15`,
              color: categoryColor,
            }}
          >
            {categoryIcons[fact.category]}
          </span>
          <span 
            className="text-xs font-medium uppercase tracking-wide capitalize"
            style={{ color: categoryColor }}
          >
            {fact.category}
          </span>
        </div>

        {/* Fact content */}
        <p 
          className="text-sm leading-relaxed mb-3"
          style={{ color: currentTheme.colors.text }}
        >
          {fact.fact}
        </p>

        {/* Source */}
        <div className="flex items-center justify-between">
          <span 
            className="text-xs"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            Source: {fact.source}
          </span>
          
          {(fact.learnMore || fact.sourceUrl) && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-medium transition-colors"
              style={{ color: currentTheme.colors.primary }}
            >
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </div>

        {/* Expanded content */}
        {expanded && (
          <div 
            className="mt-3 pt-3 space-y-2 animate-fade-in"
            style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
          >
            {fact.learnMore && (
              <p 
                className="text-sm"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {fact.learnMore}
              </p>
            )}
            {fact.sourceUrl && (
              <a
                href={fact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                style={{ color: currentTheme.colors.primary }}
              >
                Read more
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Facts: React.FC<{ compact?: boolean; refreshKey?: number }> = ({ compact, refreshKey }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [filter, setFilter] = useState<'today' | FactCategory | 'all'>('all');

  const todaysFacts = useMemo(() => getFactsForDate(new Date()), []);

  const [randomFacts, setRandomFacts] = useState<typeof allFacts | null>(null);

  React.useEffect(() => {
    if (!refreshKey) {
        setRandomFacts(null);
        return;
    }
    setRandomFacts([...allFacts].sort(() => 0.5 - Math.random()).slice(0, 2));
  }, [refreshKey]);

  const displayFacts = useMemo(() => {
    if (compact) {
        return (refreshKey && randomFacts) ? randomFacts : todaysFacts.facts.slice(0, 2);
    }
    if (filter === 'today') {
      return allFacts; // Override 'today' to 'all'
    } else if (filter === 'all') {
      return allFacts;
    } else {
      return getFactsByCategory(filter);
    }
  }, [filter, todaysFacts, compact, refreshKey, randomFacts]);

  const categories: FactCategory[] = ['science', 'history', 'nature', 'body', 'space', 'psychology', 'culture'];

  return (
    <div className="space-y-6">
      {/* Filter tabs - Hidden in compact mode */}
      {!compact && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden">
          <button
            onClick={() => setFilter('all')}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            style={{
              backgroundColor: filter === 'all' 
                ? currentTheme.colors.primary 
                : isDark ? currentTheme.colors.surface : 'white',
              color: filter === 'all' ? 'white' : currentTheme.colors.text,
              border: filter === 'all' 
                ? 'none' 
                : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          >
            All Facts
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap capitalize"
              style={{
                backgroundColor: filter === cat 
                  ? categoryColors[cat]
                  : isDark ? currentTheme.colors.surface : 'white',
                color: filter === cat ? 'white' : currentTheme.colors.text,
                border: filter === cat 
                  ? 'none' 
                  : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
            >
              {cat}
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
          {displayFacts.length} fact{displayFacts.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Fact cards */}
      <div className={`grid gap-4 ${compact ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {displayFacts.map((fact) => (
          <FactCard key={fact.id} fact={fact} />
        ))}
      </div>

      {displayFacts.length === 0 && (
        <div 
          className="text-center py-12 rounded-2xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'white',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
            No facts available
          </p>
        </div>
      )}
    </div>
  );
};

export default Facts;
