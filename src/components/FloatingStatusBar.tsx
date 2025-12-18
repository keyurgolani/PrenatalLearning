import React, { useState, useRef, useEffect } from 'react';
import { ThemeSelector } from './ThemeSelector';
import { FontSizeControl } from './FontSizeControl';
import { TrimesterDisplay } from './TrimesterDisplay';
import { StreakBadge } from './StreakBadge';
import { useTheme } from '../contexts/ThemeContext';
import { useReadingMode } from '../contexts/ReadingModeContext';

interface FloatingStatusBarProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  /** When true, shows only a compact FAB button with settings */
  compact?: boolean;
}

/**
 * Settings popup content (shared between bar and FAB)
 */
const SettingsPopupContent: React.FC<{ onClose?: () => void }> = () => {
  const { currentTheme } = useTheme();
  
  return (
    <div className="space-y-4">
      <div>
        <label 
          className="text-xs font-medium uppercase tracking-wide mb-2 block"
          style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Theme
        </label>
        <ThemeSelector variant="dropdown" />
      </div>
      <div>
        <label 
          className="text-xs font-medium uppercase tracking-wide mb-2 block"
          style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Font Size
        </label>
        <FontSizeControl />
      </div>
    </div>
  );
};

/**
 * Floating status bar that morphs between full bar and compact FAB
 */
export const FloatingStatusBar: React.FC<FloatingStatusBarProps> = ({
  completedCount,
  totalCount,
  progressPercentage,
  compact = false,
}) => {
  const { currentTheme } = useTheme();
  const { settings } = useReadingMode();
  const [isHovered, setIsHovered] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isReadingModeActive = settings.readingModeEnabled;

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide completely in reading mode when compact
  if (compact && isReadingModeActive) {
    return null;
  }

  // Spacing: 3rem base, adjusted by 2px
  const bottomSpacing = 'calc(3rem - 2px)'; // Move down by 2px
  const rightSpacing = 'calc(3rem - 2px)';  // Move right by 2px (for FAB)

  return (
    <div 
      ref={containerRef}
      className="fixed z-40"
      style={{
        bottom: bottomSpacing,
        // Animate position: center for bar, right for FAB
        left: compact ? 'auto' : '50%',
        right: compact ? rightSpacing : 'auto',
        transform: compact ? 'translateX(0)' : 'translateX(-50%)',
        // Smooth morphing transition
        transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}${compact ? '60' : '40'}, ${currentTheme.colors.secondary}${compact ? '60' : '40'})`,
          opacity: isHovered ? 1 : (compact ? 0.5 : 0.5),
          transform: isHovered ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      {/* Main container that morphs - NO overflow:hidden to allow popups */}
      <div 
        className="relative backdrop-blur-md cursor-default"
        style={{ 
          // Morph dimensions with explicit min/max for smoother animation
          width: compact ? '56px' : 'auto',
          minWidth: compact ? '56px' : '400px',
          height: compact ? '56px' : 'auto',
          padding: compact ? '0' : '1rem 1.5rem',
          borderRadius: '9999px',
          // Background with smooth transition
          background: compact 
            ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
            : (currentTheme.isDark 
              ? `linear-gradient(135deg, ${currentTheme.colors.surface}f0, ${currentTheme.colors.surface}e0)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))'),
          border: compact 
            ? 'none' 
            : `1px solid ${isHovered ? currentTheme.colors.primary + '50' : (currentTheme.isDark ? currentTheme.colors.border : 'rgba(0,0,0,0.08)')}`,
          boxShadow: isHovered 
            ? `0 8px 32px ${currentTheme.colors.primary}${compact ? '60' : '30'}, 0 4px 16px rgba(0,0,0,${compact ? '0.25' : '0.1'})`
            : `0 4px 24px ${compact ? currentTheme.colors.primary + '40' : 'rgba(0, 0, 0, 0.15)'}`,
          transform: isHovered ? (compact ? 'scale(1.1) translateY(-2px)' : 'translateY(-2px)') : 'translateY(0)',
          // Smooth morphing transition for all properties
          transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          // No overflow:hidden - popups need to be visible
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={compact ? () => setIsSettingsOpen(!isSettingsOpen) : undefined}
      >
        {/* Shimmer effect on hover (bar mode only) */}
        {!compact && (
          <div 
            className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
            style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.3s' }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, ${currentTheme.colors.primary}10, transparent)`,
                animation: isHovered ? 'shimmer 2s infinite' : 'none',
              }}
            />
          </div>
        )}

        {/* FAB mode: just the gear icon - crossfades with bar content */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: compact ? 1 : 0,
            transform: compact ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-180deg)',
            pointerEvents: compact ? 'auto' : 'none',
            transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <svg 
            className="w-6 h-6 text-white"
            style={{ 
              transform: isSettingsOpen ? 'rotate(90deg)' : (isHovered ? 'rotate(45deg)' : 'rotate(0deg)'),
              transition: 'transform 300ms ease-out',
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Bar mode: full content - crossfades with FAB icon */}
        <div 
          className="flex items-center gap-4"
          style={{
            opacity: compact ? 0 : 1,
            transform: compact ? 'scale(0.5)' : 'scale(1)',
            pointerEvents: compact ? 'none' : 'auto',
            whiteSpace: 'nowrap',
            transition: 'all 600ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Streak */}
          <div className="transform transition-transform duration-200 hover:scale-110">
            <StreakBadge compact />
          </div>

          {/* Divider */}
          <div 
            className="w-px h-6 transition-all duration-300"
            style={{ 
              backgroundColor: isHovered 
                ? `${currentTheme.colors.primary}30` 
                : (currentTheme.isDark ? currentTheme.colors.border : 'rgba(0,0,0,0.1)')
            }}
          />

          {/* Trimester */}
          <div className="transform transition-transform duration-200 hover:scale-105">
            <TrimesterDisplay />
          </div>

          {/* Divider */}
          <div 
            className="w-px h-6 transition-all duration-300"
            style={{ 
              backgroundColor: isHovered 
                ? `${currentTheme.colors.primary}30` 
                : (currentTheme.isDark ? currentTheme.colors.border : 'rgba(0,0,0,0.1)')
            }}
          />

          {/* Progress */}
          <div className="flex items-center gap-2 group">
            <div 
              className="w-20 rounded-full h-2 overflow-hidden transition-all duration-300"
              style={{ 
                backgroundColor: currentTheme.isDark ? currentTheme.colors.border : 'rgba(0,0,0,0.08)',
                boxShadow: isHovered ? `inset 0 1px 2px rgba(0,0,0,0.1)` : 'none'
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ 
                  width: `${progressPercentage}%`,
                  background: `linear-gradient(90deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    animation: 'shimmer 2s infinite',
                  }}
                />
              </div>
            </div>
            <span 
              className="text-xs font-semibold tabular-nums transition-colors duration-300"
              style={{ 
                color: isHovered 
                  ? currentTheme.colors.primary 
                  : (currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280')
              }}
            >
              {completedCount}/{totalCount}
            </span>
          </div>

          {/* Divider */}
          <div 
            className="w-px h-6 transition-all duration-300"
            style={{ 
              backgroundColor: isHovered 
                ? `${currentTheme.colors.primary}30` 
                : (currentTheme.isDark ? currentTheme.colors.border : 'rgba(0,0,0,0.1)')
            }}
          />

          {/* Settings button (bar mode) */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-300"
            style={{
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.primary,
            }}
            aria-label="Settings"
            aria-expanded={isSettingsOpen}
          >
            <svg 
              className="w-4 h-4 transition-transform duration-300" 
              style={{ transform: isSettingsOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings popup - positioned above the bar/FAB */}
      {isSettingsOpen && (
        <div 
          className="absolute bottom-full mb-3 w-64 rounded-xl shadow-xl p-4 z-50 animate-pop-in"
          style={{
            // In compact mode: align to right edge of FAB
            // In bar mode: align to right side (near settings button)
            right: 0,
            backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
            border: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <SettingsPopupContent />
        </div>
      )}
    </div>
  );
};

export default FloatingStatusBar;
