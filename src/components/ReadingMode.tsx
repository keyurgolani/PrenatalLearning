import React, { useEffect, useState, useRef } from 'react';
import { useReadingMode, type ScrollSpeed, scrollSpeedLabels } from '../contexts/ReadingModeContext';
import { useTheme } from '../contexts';
import {
  useAccessibility,
  fontSizeOptions,
  fontSizeLabels,
  fontFamilyOptions,
  fontFamilyConfig,
  type FontFamily,
} from '../contexts/AccessibilityContext';

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
}

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


export const ReadingMode: React.FC<ReadingModeProps> = ({ children, isEnabled, onExit, bottomBarSlot }) => {
  const { currentTheme, setTheme, themes } = useTheme();
  const { settings: accessibilitySettings, setFontSize, setFontFamily } = useAccessibility();
  const { settings: readingSettings, toggleAutoScroll, setAutoScrollSpeed, pauseAutoScroll } = useReadingMode();
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
      {/* Exit button at top right */}
      <button
        onClick={onExit}
        className="fixed top-4 right-4 z-50 p-2 rounded-full opacity-50 hover:opacity-100 transition-all duration-200"
        style={{
          backgroundColor: colors.surface,
          color: colors.textMuted,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.border}`,
        }}
        aria-label="Exit reading mode (Press Escape)"
        title="Exit reading mode (Escape)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

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


      {/* Bottom controls bar */}
      <div
        ref={settingsRef}
        data-reading-controls
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-200"
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
                        : isDark
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
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
                  <option key={family} value={family}>
                    {fontFamilyConfig[family].label}
                  </option>
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
                        : isDark
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-100'
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
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          style={{
            backgroundColor: isDark ? 'rgba(42, 40, 38, 0.98)' : 'rgba(255, 252, 248, 0.98)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            border: `1px solid ${colors.border}`,
          }}
        >
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

          {/* Font Size indicator */}
          <div className="flex items-center gap-1" title="Font Size">
            <svg className="w-3 h-3" style={{ color: colors.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="text-xs font-medium" style={{ color: colors.text }}>{accessibilitySettings.fontSize.toUpperCase()}</span>
          </div>

          <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

          {/* Font Family indicator */}
          <div className="flex items-center gap-1" title="Font Family">
            <span className="text-xs font-medium" style={{ color: colors.text }}>{fontFamilyConfig[accessibilitySettings.fontFamily].label}</span>
          </div>

          <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

          {/* Width indicator */}
          <div className="flex items-center gap-1" title="Content Width">
            <svg className="w-3 h-3" style={{ color: colors.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="text-xs font-medium" style={{ color: colors.text }}>{currentWidthOption.label}</span>
          </div>

          <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

          {/* Theme indicator */}
          <div className="flex items-center gap-1" title={`Theme: ${currentTheme.name}`}>
            {isDark ? (
              <svg className="w-3.5 h-3.5" style={{ color: colors.text }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" style={{ color: colors.text }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-xs font-medium hidden sm:inline" style={{ color: colors.text }}>{currentTheme.name.split(' ')[0]}</span>
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

          <div className="w-px h-4" style={{ backgroundColor: colors.border }} />

          {/* Keyboard hint */}
          <div className="text-xs flex items-center gap-1" style={{ color: colors.textMuted }}>
            <kbd className="px-1.5 py-0.5 rounded font-mono text-xs" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }}>Esc</kbd>
            <span>to exit</span>
          </div>

          {/* Optional bottom bar slot */}
          {bottomBarSlot && (
            <>
              <div className="w-px h-4" style={{ backgroundColor: colors.border }} />
              {bottomBarSlot}
            </>
          )}
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">Reading mode is active. Press Escape to exit.</div>

      {/* Reading mode sticky player styles */}
      <style>{`
        .reading-mode-container.player-is-sticky .narrate-button-container {
          position: fixed;
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 45;
          width: calc(100% - 32px);
          max-width: ${currentWidthOption.maxWidth === '100%' ? 'calc(100% - 32px)' : currentWidthOption.maxWidth};
          padding: 12px 24px;
          background: ${isDark ? 'rgba(42, 40, 38, 0.98)' : 'rgba(255, 252, 248, 0.98)'};
          backdrop-filter: blur(12px);
          border: 1px solid ${colors.border};
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          animation: slideDown 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (min-width: 768px) {
          .reading-mode-container.player-is-sticky .narrate-button-container { padding: 16px 40px; }
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
