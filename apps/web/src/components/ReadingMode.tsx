import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useReadingMode, type ScrollSpeed, scrollSpeedLabels } from '../contexts/ReadingModeContext';
import { useTheme, useAuth } from '../contexts';
import { useKick } from '../contexts/KickContext';
import { useJournal } from '../contexts/JournalContext';
import {
  useAccessibility,
  fontSizeOptions,
  fontSizeLabels,
  fontFamilyOptions,
  fontFamilyConfig,
  type FontFamily,
  type FontSize,
} from '../contexts/AccessibilityContext';
import { kickService, generateSessionId } from '../services/kickService';

/**
 * ReadingMode component - Provides a distraction-free reading experience
 * Requirements: 8.2 - Hide header, footer, sidebar when enabled
 * Requirements: 8.3 - Display only story content with calming background
 * Requirements: 8.4 - Provide subtle exit button
 * Requirements: 8.5 - Apply soft, warm color palette optimized for relaxation
 * Requirements: 8.7 - Expand content to use full viewport width (adjustable)
 * Requirements: 10.1, 10.2, 10.5 - Auto-scroll controls
 */

type ContentWidth = 'narrow' | 'medium' | 'wide' | 'full';

const widthOptions: { value: ContentWidth; label: string; maxWidth: string }[] = [
  { value: 'narrow', label: 'Narrow', maxWidth: '640px' },
  { value: 'medium', label: 'Medium', maxWidth: '800px' },
  { value: 'wide', label: 'Wide', maxWidth: '1024px' },
  { value: 'full', label: 'Full', maxWidth: '100%' },
];

export interface ReadingModeProps {
  children: React.ReactNode;
  isEnabled: boolean;
  onExit: () => void;
  /** Optional slot for rendering additional controls (e.g., KickCounter) in the bottom bar */
  bottomBarSlot?: React.ReactNode;
  /** Optional ref to expose scroll container for external scroll control */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * ReadingModeBottomBar - Combined floating bar with auto-hide functionality
 */
interface ReadingModeBottomBarProps {
  settingsRef: React.RefObject<HTMLDivElement | null>;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  colors: { background: string; surface: string; text: string; textMuted: string; border: string };
  isDark: boolean;
  accessibilitySettings: { fontSize: string; fontFamily: FontFamily };
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  contentWidth: ContentWidth;
  handleWidthChange: (width: ContentWidth) => void;
  widthOptions: { value: ContentWidth; label: string; maxWidth: string }[];
  currentWidthOption: { value: ContentWidth; label: string; maxWidth: string };
  currentTheme: { id: string; name: string; isDark?: boolean; colors: { primary: string; secondary: string } };
  setTheme: (id: string) => void;
  themes: { id: string; name: string; isDark?: boolean }[];
  readingSettings: { autoScrollEnabled: boolean; autoScrollSpeed: ScrollSpeed };
  toggleAutoScroll: () => void;
  setAutoScrollSpeed: (speed: ScrollSpeed) => void;
  onExit: () => void;
  bottomBarSlot?: React.ReactNode;
  // Kick and journal props
  isAuthenticated: boolean;
  todayKicks: number;
  logKick: (note?: string) => Promise<unknown>;
  openJournal: () => void;
}

const ReadingModeBottomBar: React.FC<ReadingModeBottomBarProps> = ({
  settingsRef,
  showSettings,
  setShowSettings,
  colors,
  isDark,
  accessibilitySettings,
  setFontSize,
  setFontFamily,
  contentWidth,
  handleWidthChange,
  widthOptions,
  currentWidthOption,
  currentTheme,
  setTheme,
  themes,
  readingSettings,
  toggleAutoScroll,
  setAutoScrollSpeed,
  onExit,
  bottomBarSlot,
  isAuthenticated,
  todayKicks,
  logKick,
  openJournal,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
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

  const handleKick = useCallback(async () => {
    if (isLogging) return;
    setIsLogging(true);
    setIsKicked(true);

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
      setTimeout(() => setIsKicked(false), 600);
    }
  }, [isAuthenticated, logKick, isLogging]);

  // Auto-hide after inactivity
  useEffect(() => {
    const showBar = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        if (!showSettings) {
          setIsVisible(false);
        }
      }, 3000);
    };

    showBar();
    document.addEventListener('mousemove', showBar);
    document.addEventListener('touchstart', showBar);
    document.addEventListener('keydown', showBar);

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      document.removeEventListener('mousemove', showBar);
      document.removeEventListener('touchstart', showBar);
      document.removeEventListener('keydown', showBar);
    };
  }, [showSettings]);

  // Keep visible when settings are open
  useEffect(() => {
    if (showSettings) {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
  }, [showSettings]);

  return (
     
    <div
      ref={settingsRef}
      data-reading-controls
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } ${isVisible && !isHovered && !showSettings ? 'opacity-50' : 'opacity-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded settings panel */}
      {showSettings && (
        <div
          className="flex flex-col gap-3 px-4 py-3 rounded-2xl animate-pop-in"
          style={{
            backgroundColor: isDark ? 'rgba(42, 40, 38, 0.98)' : 'rgba(255, 252, 248, 0.98)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Font Size */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-14" style={{ color: colors.textMuted }}>Size</span>
            <div className="flex items-center gap-1" role="group" aria-label="Font size">
              {fontSizeOptions.map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    accessibilitySettings.fontSize === size
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  style={accessibilitySettings.fontSize !== size ? { color: colors.textMuted } : undefined}
                  aria-pressed={accessibilitySettings.fontSize === size}
                  title={fontSizeLabels[size]}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-14" style={{ color: colors.textMuted }}>Font</span>
            <select
              id="reading-font-family"
              name="reading-font-family"
              value={accessibilitySettings.fontFamily}
              onChange={(e) => setFontFamily(e.target.value as FontFamily)}
              className="px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
              aria-label="Font family"
            >
              {fontFamilyOptions.map((family) => (
                <option key={family} value={family}>{fontFamilyConfig[family].label}</option>
              ))}
            </select>
          </div>

          {/* Width selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-14" style={{ color: colors.textMuted }}>Width</span>
            <div className="flex items-center gap-1" role="group" aria-label="Content width">
              {widthOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleWidthChange(option.value)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                    contentWidth === option.value
                      ? 'bg-purple-600 text-white'
                      : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  style={contentWidth !== option.value ? { color: colors.textMuted } : undefined}
                  aria-pressed={contentWidth === option.value}
                  title={`${option.label} width (${option.maxWidth})`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium w-14" style={{ color: colors.textMuted }}>Theme</span>
            <select
              id="reading-theme"
              name="reading-theme"
              value={currentTheme.id}
              onChange={(e) => setTheme(e.target.value)}
              className="px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                color: colors.text,
                border: `1px solid ${colors.border}`,
              }}
              aria-label="Select theme"
            >
              <optgroup label="Light Themes">
                {themes.filter((t) => !t.isDark).map((theme) => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </optgroup>
              <optgroup label="Dark Themes">
                {themes.filter((t) => t.isDark).map((theme) => (
                  <option key={theme.id} value={theme.id}>{theme.name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      )}

      {/* Main control bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-full flex-wrap justify-center"
        style={{
          backgroundColor: isDark ? 'rgba(42, 40, 38, 0.98)' : 'rgba(255, 252, 248, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          border: `1px solid ${colors.border}`,
        }}
      >
        {/* Exit button */}
        <button
          onClick={onExit}
          className="p-1.5 rounded-full transition-all hover:bg-red-100 hover:text-red-600"
          style={{ color: colors.textMuted }}
          aria-label="Exit reading mode"
          title="Exit reading mode (Esc)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

        {/* Settings toggle button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-1.5 rounded-full transition-all ${showSettings ? 'bg-purple-600 text-white' : ''}`}
          style={!showSettings ? { color: colors.textMuted } : undefined}
          aria-label="Toggle reading settings"
          aria-expanded={showSettings}
          title="Customize reading settings"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

        {/* Current settings indicators */}
        <div className="flex items-center gap-1 text-xs" style={{ color: colors.text }}>
          <span>{accessibilitySettings.fontSize.toUpperCase()}</span>
          <span>•</span>
          <span>{fontFamilyConfig[accessibilitySettings.fontFamily as FontFamily].label}</span>
          <span>•</span>
          <span>{currentWidthOption.label}</span>
        </div>

        <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

        {/* Auto-scroll controls */}
        <button
          onClick={toggleAutoScroll}
          className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all"
          style={{
            backgroundColor: readingSettings.autoScrollEnabled ? (isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)') : 'transparent',
            color: readingSettings.autoScrollEnabled ? '#22c55e' : colors.textMuted,
          }}
          aria-label={readingSettings.autoScrollEnabled ? 'Pause auto-scroll' : 'Start auto-scroll'}
          aria-pressed={readingSettings.autoScrollEnabled}
          title={readingSettings.autoScrollEnabled ? 'Pause auto-scroll' : 'Start auto-scroll'}
        >
          {readingSettings.autoScrollEnabled ? (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
          <span className="text-xs font-medium">{readingSettings.autoScrollEnabled ? 'Pause' : 'Scroll'}</span>
        </button>

        {/* Speed selector */}
        <select
          id="reading-auto-scroll-speed"
          name="reading-auto-scroll-speed"
          value={readingSettings.autoScrollSpeed}
          onChange={(e) => setAutoScrollSpeed(e.target.value as ScrollSpeed)}
          className="px-1.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            color: colors.text,
            border: `1px solid ${colors.border}`,
          }}
          aria-label="Auto-scroll speed"
          title="Auto-scroll speed"
        >
          {(['slow', 'medium', 'fast'] as ScrollSpeed[]).map((speed) => (
            <option key={speed} value={speed}>{scrollSpeedLabels[speed]}</option>
          ))}
        </select>

        {/* Optional bottom bar slot */}
        {bottomBarSlot && (
          <>
            <div className="w-px h-4" style={{ backgroundColor: colors.border }} />
            {bottomBarSlot}
          </>
        )}

        <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

        {/* Kick Button */}
        <button
          onClick={handleKick}
          disabled={isLogging}
          className={`flex items-center gap-1 px-3 py-1 rounded-full font-medium button-interactive disabled:opacity-70 ${isKicked ? 'animate-kick-bounce' : ''}`}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, #ec4899)`,
            color: '#ffffff',
          }}
          title="Log a kick"
        >
          <svg 
            className={`w-3.5 h-3.5 ${isKicked ? 'animate-bounce' : ''}`}
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span className="text-xs">Kick</span>
          {displayKicks > 0 && (
            <span className="ml-0.5 px-1 py-0.5 text-xs font-bold bg-white/20 rounded-full">
              {displayKicks}
            </span>
          )}
        </button>

        {/* Journal Button - Only for logged-in users - More prominent styling */}
        {isAuthenticated && (
          <button
            onClick={() => openJournal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium button-interactive shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            }}
            title="Open Journal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-semibold">Journal</span>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Reading mode calming background colors
 * Soft, warm palette optimized for relaxation
 */
const readingModeColors = {
  light: {
    background: 'linear-gradient(135deg, #fef9f3 0%, #fdf6ed 50%, #fef5e7 100%)',
    surface: '#fffcf8',
    text: '#4a4543',
    textMuted: '#7a7573',
    border: '#f0ebe5',
  },
  dark: {
    background: 'linear-gradient(135deg, #1a1918 0%, #1f1e1c 50%, #242220 100%)',
    surface: '#2a2826',
    text: '#e8e4e0',
    textMuted: '#a8a4a0',
    border: '#3a3836',
  },
};


export const ReadingMode: React.FC<ReadingModeProps> = ({ children, isEnabled, onExit, bottomBarSlot, scrollContainerRef: externalScrollRef }) => {
  const { currentTheme, setTheme, themes } = useTheme();
  const { settings: accessibilitySettings, setFontSize, setFontFamily } = useAccessibility();
  const { settings: readingSettings, toggleAutoScroll, setAutoScrollSpeed, pauseAutoScroll } = useReadingMode();
  const { isAuthenticated } = useAuth();
  const { todayKicks, logKick } = useKick();
  const { openJournal } = useJournal();
  const isDark = currentTheme.isDark ?? false;
  const colors = isDark ? readingModeColors.dark : readingModeColors.light;
  const [showSettings, setShowSettings] = useState(false);

  // Load saved width preference from localStorage
  const [contentWidth, setContentWidth] = useState<ContentWidth>(() => {
    const saved = localStorage.getItem('readingModeWidth');
    return (saved as ContentWidth) || 'medium';
  });

  // Save width preference when it changes
  const handleWidthChange = (width: ContentWidth) => {
    setContentWidth(width);
    localStorage.setItem('readingModeWidth', width);
  };

  const currentWidthOption = widthOptions.find((w) => w.value === contentWidth) || widthOptions[1];
  const internalScrollRef = useRef<HTMLDivElement>(null);
  // Use external ref if provided, otherwise use internal ref
  const scrollContainerRef = externalScrollRef || internalScrollRef;
  const settingsRef = useRef<HTMLDivElement>(null);
  const [isPlayerSticky, setIsPlayerSticky] = useState(false);

  // Close settings when clicking outside
  useEffect(() => {
    if (!showSettings) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettings]);

  // Track scroll to make player sticky
  useEffect(() => {
    if (!isEnabled) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsPlayerSticky(container.scrollTop > 120);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollContainerRef is a ref that doesn't change
  }, [isEnabled]);

  // Prevent body scroll when reading mode is active
  useEffect(() => {
    if (isEnabled) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEnabled]);

  // Auto-scroll functionality - Requirements 10.3
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const autoScrollEnabledRef = useRef(readingSettings.autoScrollEnabled);
  const autoScrollSpeedRef = useRef(readingSettings.autoScrollSpeed);

  useEffect(() => {
    autoScrollEnabledRef.current = readingSettings.autoScrollEnabled;
  }, [readingSettings.autoScrollEnabled]);

  useEffect(() => {
    autoScrollSpeedRef.current = readingSettings.autoScrollSpeed;
  }, [readingSettings.autoScrollSpeed]);

  const scrollSpeedPx: Record<ScrollSpeed, number> = {
    slow: 30,
    medium: 60,
    fast: 100,
  };

  useEffect(() => {
    if (!isEnabled || !readingSettings.autoScrollEnabled) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    const scroll = (timestamp: number) => {
      if (!autoScrollEnabledRef.current) return;

      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const pixelsPerSecond = scrollSpeedPx[autoScrollSpeedRef.current];
      const scrollAmount = pixelsPerSecond * deltaTime;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        pauseAutoScroll();
        return;
      }

      container.scrollTop += scrollAmount;
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    lastTimeRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollContainerRef is a ref, scrollSpeedPx is a constant
  }, [isEnabled, readingSettings.autoScrollEnabled, pauseAutoScroll]);

  // Pause auto-scroll on user interaction - Requirements 10.4
  useEffect(() => {
    if (!isEnabled || !readingSettings.autoScrollEnabled) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const handleUserInteraction = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-reading-controls]')) return;
      pauseAutoScroll();
    };

    container.addEventListener('wheel', handleUserInteraction, { passive: true });
    container.addEventListener('touchstart', handleUserInteraction, { passive: true });

    return () => {
      container.removeEventListener('wheel', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scrollContainerRef is a ref that doesn't change
  }, [isEnabled, readingSettings.autoScrollEnabled, pauseAutoScroll]);

  if (!isEnabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className={`fixed inset-0 z-50 overflow-y-auto reading-mode-container ${isPlayerSticky ? 'player-is-sticky' : ''}`}
      style={{ background: colors.background }}
      role="dialog"
      aria-modal="true"
      aria-label="Reading mode view"
    >


      {/* Centered content container - Requirements 8.7 */}
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-20" style={{ color: colors.text }}>
        <div
          className="w-full rounded-2xl shadow-lg reading-mode-content transition-all duration-300"
          style={{
            maxWidth: currentWidthOption.maxWidth,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Sticky audio player container */}
          <div className="reading-mode-sticky-wrapper" />
          <div
            className="p-6 md:p-10 reading-mode-inner"
            style={{ fontFamily: fontFamilyConfig[accessibilitySettings.fontFamily].value }}
          >
            {children}
          </div>
        </div>
      </div>


      {/* Bottom controls bar - auto-hides after inactivity */}
      <ReadingModeBottomBar
        settingsRef={settingsRef}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        colors={colors}
        isDark={isDark}
        accessibilitySettings={accessibilitySettings}
        setFontSize={setFontSize}
        setFontFamily={setFontFamily}
        contentWidth={contentWidth}
        handleWidthChange={handleWidthChange}
        widthOptions={widthOptions}
        currentWidthOption={currentWidthOption}
        currentTheme={currentTheme}
        setTheme={setTheme}
        themes={themes}
        readingSettings={readingSettings}
        toggleAutoScroll={toggleAutoScroll}
        setAutoScrollSpeed={setAutoScrollSpeed}
        onExit={onExit}
        bottomBarSlot={bottomBarSlot}
        isAuthenticated={isAuthenticated}
        todayKicks={todayKicks}
        logKick={logKick}
        openJournal={openJournal}
      />

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">Reading mode is active. Press Escape to exit.</div>

      {/* Reading mode sticky player styles */}
      <style>{`
        .reading-mode-container.player-is-sticky .audio-narration-wrapper,
        .reading-mode-container.player-is-sticky .narrate-button-container {
          position: sticky;
          top: 16px;
          left: 0;
          right: 0;
          z-index: 45;
          margin: 0 auto 24px auto;
          width: 100%;
          max-width: ${currentWidthOption.maxWidth === '100%' ? '100%' : currentWidthOption.maxWidth};
          padding: 12px 24px;
          background: ${isDark ? 'rgba(42, 40, 38, 0.98)' : 'rgba(255, 252, 248, 0.98)'};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid ${colors.border};
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform:translateY(0); }
        }
        @media (min-width: 768px) {
          .reading-mode-container.player-is-sticky .audio-narration-wrapper,
          .reading-mode-container.player-is-sticky .narrate-button-container { 
            padding: 16px 40px; 
          }
        }
      `}</style>
    </div>
  );
};


/**
 * ReadingModeToggle component - Button to toggle reading mode
 * Requirements: 8.1 - Provide a "Reading Mode" toggle accessible from the story page
 */
export interface ReadingModeToggleProps {
  className?: string;
}

export const ReadingModeToggle: React.FC<ReadingModeToggleProps> = ({ className = '' }) => {
  const { settings, toggleReadingMode } = useReadingMode();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  return (
    <button
      onClick={toggleReadingMode}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${className}`}
      style={{
        backgroundColor: settings.readingModeEnabled
          ? isDark
            ? 'rgba(168, 85, 247, 0.2)'
            : 'rgba(168, 85, 247, 0.1)'
          : isDark
            ? currentTheme.colors.surface
            : 'rgba(255, 255, 255, 0.8)',
        color: settings.readingModeEnabled ? '#a855f7' : isDark ? currentTheme.colors.text : '#4b5563',
        border: settings.readingModeEnabled
          ? '1px solid rgba(168, 85, 247, 0.3)'
          : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
      aria-label={settings.readingModeEnabled ? 'Exit reading mode' : 'Enter reading mode'}
      aria-pressed={settings.readingModeEnabled}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        {settings.readingModeEnabled ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        )}
      </svg>
      <span className="text-sm font-medium">{settings.readingModeEnabled ? 'Exit Reading' : 'Reading Mode'}</span>
    </button>
  );
};

// Backwards compatibility aliases
export const FocusMode = ReadingMode;
export const FocusModeToggle = ReadingModeToggle;

export default ReadingMode;
