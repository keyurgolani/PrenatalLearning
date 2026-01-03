/**
 * Daily Mix Component
 * Aggregates all daily activities into a single view
 */

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Vocabulary } from './Vocabulary';
import { Puzzles } from './Puzzles';
import { Facts } from './Facts';
import { BrainTeasers } from './BrainTeasers';
import { Mindfulness } from './Mindfulness';

export type DailySection = 'daily' | 'words' | 'puzzles' | 'facts' | 'teasers' | 'mindfulness';

interface DailyMixProps {
  onNavigate: (section: DailySection) => void;
}

const SectionHeader: React.FC<{
  title: string;
  onSeeMore: () => void;
  onRefresh?: () => void;
  icon?: React.ReactNode;
  subtitle?: string;
}> = ({ title, onSeeMore, onRefresh, icon, subtitle }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        {icon && (
          <div 
            className="p-2 rounded-lg"
            style={{ 
              backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3e8ff',
              color: currentTheme.colors.primary
            }}
          >
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold" style={{ color: currentTheme.colors.text }}>{title}</h2>
          {subtitle && (
            <p className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            title="Get new items"
            aria-label="Refresh content"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
        <button
          onClick={onSeeMore}
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: currentTheme.colors.primary }}
        >
          See More
        </button>
      </div>
    </div>
  );
};

export const DailyMix: React.FC<DailyMixProps> = ({ onNavigate }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [refreshKeys, setRefreshKeys] = React.useState<Record<string, number>>({});

  const handleRefresh = (section: string) => {
    setRefreshKeys(prev => ({
      ...prev,
      [section]: (prev[section] || 0) + 1
    }));
  };

  return (
    <div className="columns-1 md:columns-2 xl:columns-3 gap-6 animate-fade-in mx-auto pb-6">
      {/* Word of the Day */}
      <section className="break-inside-avoid mb-6 rounded-2xl p-4 border transition-colors" style={{ backgroundColor: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)', borderColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.2)' }}>
        <SectionHeader 
          title="Word of the Day" 
          subtitle="Expand your vocabulary"
          onSeeMore={() => onNavigate('words')}
          onRefresh={() => handleRefresh('words')}
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          )}
        />
        <div className="mt-4">
            <Vocabulary compact refreshKey={refreshKeys['words'] || 0} />
        </div>
      </section>

      {/* Mindfulness Moment */}
      <section className="break-inside-avoid mb-6 rounded-2xl p-4 border transition-colors" style={{ backgroundColor: isDark ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.05)', borderColor: isDark ? 'rgba(20, 184, 166, 0.3)' : 'rgba(20, 184, 166, 0.2)' }}>
        <SectionHeader 
          title="Mindfulness Moment" 
          subtitle="Connect with your baby"
          onSeeMore={() => onNavigate('mindfulness')}
          onRefresh={() => handleRefresh('mindfulness')}
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
        />
         <div className="mt-4">
            <Mindfulness compact refreshKey={refreshKeys['mindfulness'] || 0} />
        </div>
      </section>

      {/* Brain Teaser */}
      <section className="break-inside-avoid mb-6 rounded-2xl p-4 border transition-colors" style={{ backgroundColor: isDark ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0.05)', borderColor: isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)' }}>
        <SectionHeader 
          title="Brain Teaser" 
          subtitle="Quick mental exercise"
          onSeeMore={() => onNavigate('teasers')}
          onRefresh={() => handleRefresh('teasers')}
          icon={(
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
             </svg>
          )}
        />
         <div className="mt-4">
            <BrainTeasers compact refreshKey={refreshKeys['teasers'] || 0} />
         </div>
      </section>

      {/* Daily Puzzle */}
      <section className="break-inside-avoid mb-6 rounded-2xl p-4 border transition-colors" style={{ backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)', borderColor: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)' }}>
        <SectionHeader 
          title="Daily Puzzle" 
          subtitle="Challenge your mind"
          onSeeMore={() => onNavigate('puzzles')}
          onRefresh={() => handleRefresh('puzzles')}
          icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          )}
        />
         <div className="mt-4">
            <Puzzles compact refreshKey={refreshKeys['puzzles'] || 0} />
         </div>
      </section>

      {/* Daily Facts */}
      <section className="break-inside-avoid mb-6 rounded-2xl p-4 border transition-colors" style={{ backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)' }}>
        <SectionHeader 
          title="Did You Know?" 
          subtitle="Daily dose of knowledge"
          onSeeMore={() => onNavigate('facts')}
          onRefresh={() => handleRefresh('facts')}
           icon={(
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
           )}
        />
         <div className="mt-4">
            <Facts compact refreshKey={refreshKeys['facts'] || 0} />
         </div>
      </section>
    </div>
  );
};
