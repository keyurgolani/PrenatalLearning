/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Theme, ThemeContextValue } from '../types/theme';
import { THEME_STORAGE_KEY, DEFAULT_THEME_ID } from '../types/theme';
import { themes, getThemeById, getDefaultTheme } from '../data/themes';

/**
 * ThemeContext for managing application-wide theme state
 * Requirements: 1.3, 1.4, 1.5 - Theme selection, persistence, and restoration
 */
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Apply theme colors as CSS custom properties to the document root
 */
function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement;
  
  // Set CSS custom properties for theme colors
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-surface', theme.colors.surface);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
  root.style.setProperty('--theme-border', theme.colors.border);
  root.style.setProperty('--theme-success', theme.colors.success);
  
  // Set category colors
  Object.entries(theme.colors.categoryColors).forEach(([category, color]) => {
    root.style.setProperty(`--theme-category-${category}`, color);
  });
  
  // Store the background gradient classes for use in components
  root.setAttribute('data-theme', theme.id);
  root.setAttribute('data-theme-bg', theme.colors.background);
}

/**
 * Load theme preference from localStorage
 */
function loadThemePreference(): string {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored || DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

/**
 * Save theme preference to localStorage
 */
function saveThemePreference(themeId: string): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // Storage unavailable (private browsing, quota exceeded)
    console.warn('Unable to save theme preference to localStorage');
  }
}


interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider component that manages theme state and persistence
 * Requirements: 1.3 - Apply theme within 200ms
 * Requirements: 1.4 - Persist selection to localStorage
 * Requirements: 1.5 - Restore previously selected theme on load
 */
export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Initialize with stored preference or default
    const storedThemeId = loadThemePreference();
    return getThemeById(storedThemeId) || getDefaultTheme();
  });

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  const setTheme = useCallback((themeId: string) => {
    const theme = getThemeById(themeId);
    if (theme) {
      setCurrentTheme(theme);
      saveThemePreference(themeId);
    } else {
      console.warn(`Theme "${themeId}" not found, keeping current theme`);
    }
  }, []);

  const contextValue = useMemo<ThemeContextValue>(() => ({
    currentTheme,
    themes,
    setTheme,
  }), [currentTheme, setTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @throws Error if used outside of ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeProvider;
