/**
 * ReadingProgressBar Component
 * 
 * Displays a progress bar at the top of the reading view that updates in real-time
 * based on scroll position.
 * 
 * Requirements:
 * - 11.1: Display a progress bar at the top of the reading view
 * - 11.5: When the user scrolls, update progress in real-time
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface ReadingProgressBarProps {
  /** Progress within current section (0-100) */
  sectionProgress: number;
  /** Overall story progress (0-100) */
  overallProgress: number;
  /** Whether to show section progress (default: true) */
  showSectionProgress?: boolean;
  /** Whether to show overall progress (default: true) */
  showOverallProgress?: boolean;
  /** Optional className for additional styling */
  className?: string;
  /** Whether the component is in a fixed position at top */
  fixed?: boolean;
}

/**
 * ReadingProgressBar component
 * Requirements: 11.1, 11.5
 */
export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  sectionProgress,
  overallProgress,
  showSectionProgress = true,
  showOverallProgress = true,
  className = '',
  fixed = false,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Clamp progress values between 0 and 100
  const clampedSectionProgress = Math.max(0, Math.min(100, sectionProgress));
  const clampedOverallProgress = Math.max(0, Math.min(100, overallProgress));

  const containerClasses = `
    ${fixed ? 'fixed top-0 left-0 right-0 z-50' : 'relative'}
    ${className}
  `.trim();

  return (
    <div 
      className={containerClasses}
      role="progressbar"
      aria-valuenow={Math.round(clampedSectionProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      {/* Section Progress Bar */}
      {showSectionProgress && (
        <div 
          className="h-1 w-full overflow-hidden"
          style={{ 
            backgroundColor: isDark 
              ? currentTheme.colors.border 
              : '#e5e7eb' 
          }}
        >
          <div
            className="h-full transition-all duration-150 ease-out"
            style={{
              width: `${clampedSectionProgress}%`,
              background: 'linear-gradient(90deg, #a855f7, #ec4899)',
            }}
          />
        </div>
      )}

      {/* Overall Progress Indicator (optional secondary bar) */}
      {showOverallProgress && showSectionProgress && (
        <div 
          className="h-0.5 w-full overflow-hidden"
          style={{ 
            backgroundColor: isDark 
              ? 'rgba(168, 85, 247, 0.1)' 
              : 'rgba(168, 85, 247, 0.1)' 
          }}
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${clampedOverallProgress}%`,
              backgroundColor: isDark ? '#22c55e' : '#16a34a',
            }}
          />
        </div>
      )}

      {/* Progress Text (shown when not fixed) */}
      {!fixed && (showSectionProgress || showOverallProgress) && (
        <div 
          className="flex items-center justify-between px-4 py-1 text-xs"
          style={{ 
            color: isDark 
              ? currentTheme.colors.textMuted 
              : '#6b7280' 
          }}
        >
          {showSectionProgress && (
            <span>Section: {Math.round(clampedSectionProgress)}%</span>
          )}
          {showOverallProgress && (
            <span>Overall: {Math.round(clampedOverallProgress)}%</span>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Compact version of the progress bar for fixed positioning
 * Shows only the progress bar without text
 */
export const FixedReadingProgressBar: React.FC<{
  sectionProgress: number;
  overallProgress?: number;
}> = ({ sectionProgress, overallProgress }) => {
  return (
    <ReadingProgressBar
      sectionProgress={sectionProgress}
      overallProgress={overallProgress ?? sectionProgress}
      showOverallProgress={false}
      fixed={true}
    />
  );
};

export default ReadingProgressBar;
