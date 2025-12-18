/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Scroll speed options for auto-scroll feature
 * Requirements: 10.2 - Allow users to select scroll speed (slow, medium, fast)
 */
export type ScrollSpeed = 'slow' | 'medium' | 'fast';

/**
 * Scroll speed in pixels per second
 */
export const scrollSpeedPx: Record<ScrollSpeed, number> = {
  slow: 30,
  medium: 60,
  fast: 100,
};

/**
 * Scroll speed labels for display
 */
export const scrollSpeedLabels: Record<ScrollSpeed, string> = {
  slow: 'Slow',
  medium: 'Medium',
  fast: 'Fast',
};

/**
 * Reading mode settings interface
 * Requirements: 8.1 - Provide a "Reading Mode" toggle accessible from the story page
 */
export interface ReadingModeSettings {
  readingModeEnabled: boolean;
  autoScrollEnabled: boolean;
  autoScrollSpeed: ScrollSpeed;
  readingPace: number; // words per minute
}

/**
 * Context value interface
 */
export interface ReadingModeContextValue {
  settings: ReadingModeSettings;
  toggleReadingMode: () => void;
  toggleAutoScroll: () => void;
  setAutoScrollSpeed: (speed: ScrollSpeed) => void;
  setReadingPace: (wpm: number) => void;
  pauseAutoScroll: () => void;
  resumeAutoScroll: () => void;
  exitReadingMode: () => void;
}

const STORAGE_KEY = 'prenatal-reading-preferences';

const defaultSettings: ReadingModeSettings = {
  readingModeEnabled: false,
  autoScrollEnabled: false,
  autoScrollSpeed: 'medium',
  readingPace: 200, // default 200 words per minute
};


const ReadingModeContext = createContext<ReadingModeContextValue | undefined>(undefined);

/**
 * Load reading mode settings from localStorage
 */
function loadSettings(): ReadingModeSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        readingModeEnabled: false, // Always start with reading mode disabled
        autoScrollEnabled: false, // Always start with auto-scroll disabled
        autoScrollSpeed: parsed.autoScrollSpeed || defaultSettings.autoScrollSpeed,
        readingPace: parsed.readingPace || defaultSettings.readingPace,
      };
    }
  } catch {
    // Storage unavailable or invalid data
  }
  return defaultSettings;
}

/**
 * Save reading mode settings to localStorage
 * Note: readingModeEnabled and autoScrollEnabled are not persisted
 */
function saveSettings(settings: ReadingModeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      autoScrollSpeed: settings.autoScrollSpeed,
      readingPace: settings.readingPace,
    }));
  } catch {
    console.warn('Unable to save reading mode settings to localStorage');
  }
}

interface ReadingModeProviderProps {
  children: React.ReactNode;
}

/**
 * ReadingModeProvider component
 * Manages reading mode and auto-scroll settings
 * Requirements: 8.1 - Provide a "Reading Mode" toggle accessible from the story page
 */
export function ReadingModeProvider({ children }: ReadingModeProviderProps): React.ReactElement {
  const [settings, setSettings] = useState<ReadingModeSettings>(loadSettings);

  // Apply reading mode class to document body when enabled
  useEffect(() => {
    if (settings.readingModeEnabled) {
      document.body.classList.add('reading-mode-active');
      document.documentElement.setAttribute('data-reading-mode', 'true');
    } else {
      document.body.classList.remove('reading-mode-active');
      document.documentElement.setAttribute('data-reading-mode', 'false');
    }
  }, [settings.readingModeEnabled]);

  // Handle Escape key to exit reading mode
  // Requirements: 8.6 - Support keyboard shortcut (Escape) to exit Reading Mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && settings.readingModeEnabled) {
        setSettings(prev => ({ ...prev, readingModeEnabled: false }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.readingModeEnabled]);

  const toggleReadingMode = useCallback(() => {
    setSettings(prev => ({ ...prev, readingModeEnabled: !prev.readingModeEnabled }));
  }, []);

  const exitReadingMode = useCallback(() => {
    setSettings(prev => ({ ...prev, readingModeEnabled: false }));
  }, []);

  const toggleAutoScroll = useCallback(() => {
    setSettings(prev => ({ ...prev, autoScrollEnabled: !prev.autoScrollEnabled }));
  }, []);

  const setAutoScrollSpeed = useCallback((speed: ScrollSpeed) => {
    setSettings(prev => {
      const newSettings = { ...prev, autoScrollSpeed: speed };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const setReadingPace = useCallback((wpm: number) => {
    setSettings(prev => {
      const newSettings = { ...prev, readingPace: wpm };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const pauseAutoScroll = useCallback(() => {
    setSettings(prev => ({ ...prev, autoScrollEnabled: false }));
  }, []);

  const resumeAutoScroll = useCallback(() => {
    setSettings(prev => ({ ...prev, autoScrollEnabled: true }));
  }, []);

  const contextValue = useMemo<ReadingModeContextValue>(() => ({
    settings,
    toggleReadingMode,
    toggleAutoScroll,
    setAutoScrollSpeed,
    setReadingPace,
    pauseAutoScroll,
    resumeAutoScroll,
    exitReadingMode,
  }), [settings, toggleReadingMode, toggleAutoScroll, setAutoScrollSpeed, setReadingPace, pauseAutoScroll, resumeAutoScroll, exitReadingMode]);

  return (
    <ReadingModeContext.Provider value={contextValue}>
      {children}
    </ReadingModeContext.Provider>
  );
}

/**
 * Hook to access reading mode context
 * @throws Error if used outside of ReadingModeProvider
 */
export function useReadingMode(): ReadingModeContextValue {
  const context = useContext(ReadingModeContext);
  if (context === undefined) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider');
  }
  return context;
}

export default ReadingModeProvider;
