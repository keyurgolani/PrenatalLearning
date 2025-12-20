import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

import { useKick } from '../contexts/KickContext';
import { useReadingMode } from '../contexts/ReadingModeContext';
import { useJournal } from '../contexts/JournalContext';
import { ThemeSelector } from './ThemeSelector';
import { FontSizeControl } from './FontSizeControl';
import { kickService, generateSessionId } from '../services/kickService';

/**
 * ReadingModeBar - Floating semi-transparent bar shown during reading mode
 * 
 * Contains:
 * - Kick logging button with counter
 * - Reading mode accessibility controls (theme, font size, auto-scroll)
 * - ESC to exit indicator
 * - Journal button (for logged-in users)
 */

interface ReadingModeBarProps {
  onExit: () => void;
  /** Auto-scroll controls */
  autoScrollEnabled?: boolean;
  onToggleAutoScroll?: () => void;
  scrollSpeed?: 'slow' | 'medium' | 'fast';
  onScrollSpeedChange?: (speed: 'slow' | 'medium' | 'fast') => void;
}

export const ReadingModeBar: React.FC<ReadingModeBarProps> = ({
  onExit,
  autoScrollEnabled = false,
  onToggleAutoScroll,
  scrollSpeed = 'medium',
  onScrollSpeedChange,
}) => {
  const { currentTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { todayKicks, logKick } = useKick();
  const { settings } = useReadingMode();
  const { openJournal } = useJournal();
  const [isLogging, setIsLogging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [guestKicks, setGuestKicks] = useState(0);

  // Get guest kicks from localStorage on mount and when kicks are logged
  useEffect(() => {
    const getGuestKicksCount = () => {
      const kicks = kickService.getAllKicks('guest');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();
      return kicks.filter(k => k.timestamp >= todayTimestamp).length;
    };

    setGuestKicks(getGuestKicksCount());

    const handleKickLogged = () => {
      setGuestKicks(getGuestKicksCount());
    };
    window.addEventListener('kickLogged', handleKickLogged);
    return () => window.removeEventListener('kickLogged', handleKickLogged);
  }, []);

  const displayKicks = isAuthenticated ? todayKicks : guestKicks;

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Auto-hide bar after inactivity, show on mouse move
  useEffect(() => {
    let hideTimeout: number;
    
    const showBar = () => {
      setIsVisible(true);
      clearTimeout(hideTimeout);
      hideTimeout = window.setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    showBar();
    document.addEventListener('mousemove', showBar);
    document.addEventListener('touchstart', showBar);

    return () => {
      clearTimeout(hideTimeout);
      document.removeEventListener('mousemove', showBar);
      document.removeEventListener('touchstart', showBar);
    };
  }, []);

  const handleKick = useCallback(async () => {
    if (isLogging) return;
    setIsLogging(true);

    try {
      if (isAuthenticated) {
        await logKick();
      } else {
        kickService.logKick('guest', 0, 'Quick Kick', generateSessionId());
        window.dispatchEvent(new CustomEvent('kickLogged'));
      }
    } catch (err) {
      console.error('Failed to log kick:', err);
    } finally {
      setIsLogging(false);
    }
  }, [isAuthenticated, logKick, isLogging]);

  if (!settings.readingModeEnabled) {
    return null;
  }

  return (
    <div 
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div 
        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-lg border"
        style={{
          backgroundColor: currentTheme.isDark 
            ? `${currentTheme.colors.surface}e0` 
            : 'rgba(255, 255, 255, 0.9)',
          borderColor: currentTheme.isDark 
            ? currentTheme.colors.border 
            : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Theme Selector */}
        <div className="flex items-center gap-1">
          <ThemeSelector variant="dropdown" />
        </div>

        <div 
          className="w-px h-5"
          style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
        />

        {/* Font Size Control */}
        <FontSizeControl compact />

        <div 
          className="w-px h-5"
          style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
        />

        {/* Auto-scroll toggle */}
        {onToggleAutoScroll && (
          <>
            <button
              onClick={onToggleAutoScroll}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium transition-colors ${
                autoScrollEnabled 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'hover:bg-gray-100'
              }`}
              style={{
                color: !autoScrollEnabled 
                  ? (currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280')
                  : undefined,
              }}
              title={autoScrollEnabled ? 'Stop auto-scroll' : 'Start auto-scroll'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Scroll
            </button>

            {/* Speed selector when auto-scroll is enabled */}
            {autoScrollEnabled && onScrollSpeedChange && (
              <select
                id="auto-scroll-speed"
                name="auto-scroll-speed"
                value={scrollSpeed}
                onChange={(e) => onScrollSpeedChange(e.target.value as 'slow' | 'medium' | 'fast')}
                className="px-2 py-1 text-sm rounded-lg border bg-white"
                style={{
                  borderColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb',
                  backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
                  color: currentTheme.isDark ? currentTheme.colors.text : '#374151',
                }}
                aria-label="Auto-scroll speed"
              >
                <option value="slow">Slow</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast</option>
              </select>
            )}

            <div 
              className="w-px h-5"
              style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
            />
          </>
        )}

        {/* ESC to exit indicator */}
        <div 
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ 
            backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6',
          }}
        >
          <kbd 
            className="px-1.5 py-0.5 text-xs font-mono font-semibold rounded"
            style={{
              backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
              color: currentTheme.isDark ? currentTheme.colors.text : '#374151',
              border: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#d1d5db'}`,
            }}
          >
            Esc
          </kbd>
          <span 
            className="text-sm"
            style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            to exit
          </span>
        </div>

        <div 
          className="w-px h-5"
          style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
        />

        {/* Kick Button */}
        <button
          onClick={handleKick}
          disabled={isLogging}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full font-medium transition-all hover:scale-105 disabled:opacity-70"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, #ec4899)`,
            color: '#ffffff',
          }}
          title="Log a kick"
        >
          <svg 
            className={`w-4 h-4 ${isLogging ? 'animate-bounce' : ''}`}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-sm">Kick</span>
          {displayKicks > 0 && (
            <span className="ml-0.5 px-1.5 py-0.5 text-xs font-bold bg-white/20 rounded-full">
              {displayKicks}
            </span>
          )}
        </button>

        {/* Journal Button - Only for logged-in users */}
        {isAuthenticated && (
          <>
            <div 
              className="w-px h-5"
              style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb' }}
            />
            <button
              onClick={() => openJournal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.secondary}, ${currentTheme.colors.primary})`,
                color: '#ffffff',
              }}
              title="Open Journal"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm hidden sm:inline">Journal</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReadingModeBar;
