import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useReadingMode } from '../contexts/ReadingModeContext';
import { useAuth } from '../contexts/AuthContext';
import { useJournal } from '../contexts/JournalContext';

interface FloatingStatusBarProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  /** When true, shows only a compact FAB button */
  compact?: boolean;
}

/**
 * FloatingStatusBar - Journal access bar for logged-in users
 * 
 * This bar provides quick access to journaling features.
 * Kick logging and other stats are now in the SecondaryHeader.
 * 
 * For logged-in users: Shows journal button that morphs into the journal modal
 * For guests: Hidden (they don't have journal access)
 * In reading mode: Hidden (ReadingModeBar handles controls)
 */
export const FloatingStatusBar: React.FC<FloatingStatusBarProps> = () => {
  const { currentTheme } = useTheme();
  const { settings } = useReadingMode();
  const { isAuthenticated } = useAuth();
  const { openJournal, isOpen: isJournalOpen } = useJournal();
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isReadingModeActive = settings.readingModeEnabled;

  // Don't show for guests - they don't have journal access
  if (!isAuthenticated) {
    return null;
  }

  // Don't show in reading mode - ReadingModeBar handles that
  if (isReadingModeActive) {
    return null;
  }

  // Don't show when journal is open
  if (isJournalOpen) {
    return null;
  }

  // Spacing - aligned with Continue button in TopicPage footer
  const bottomSpacing = '2rem';
  const rightSpacing = 'calc(3rem - 2px)';

  return (
    <div 
      ref={containerRef}
      className="fixed z-40"
      style={{
        bottom: bottomSpacing,
        right: rightSpacing,
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}60, ${currentTheme.colors.secondary}60)`,
          opacity: isHovered ? 1 : 0.5,
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 300ms ease-out',
        }}
      />
      
      {/* Journal FAB Button */}
      <button
        onClick={() => {
          setIsHovered(false);
          openJournal();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.primary})`,
          transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
          boxShadow: isHovered 
            ? `0 8px 32px ${currentTheme.colors.primary}60, 0 4px 16px rgba(0,0,0,0.25)`
            : `0 4px 24px ${currentTheme.colors.primary}40`,
        }}
        aria-label="Open Journal"
        title="Open Journal"
      >
        <svg 
          className="w-6 h-6 text-white" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>

      {/* Label on hover */}
      <div 
        className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-200"
        style={{
          backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
          border: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'translateX(0)' : 'translateX(8px)',
          pointerEvents: 'none',
        }}
      >
        <span 
          className="text-sm font-medium"
          style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#374151' }}
        >
          Journal
        </span>
      </div>
    </div>
  );
};

export default FloatingStatusBar;
