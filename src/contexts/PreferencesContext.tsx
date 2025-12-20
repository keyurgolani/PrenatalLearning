/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { 
  UserPreferences, 
  PreferencesContextValue,
  ThemePreference,
  FontSizePreference,
  ReadingModePreference,
} from '../types/auth';
import { DEFAULT_USER_PREFERENCES } from '../types/auth';
import { useAuth } from './AuthContext';
import { get, put, ApiError } from '../services/apiClient';

/**
 * PreferencesContext for managing user preferences
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5 - User preferences persistence and sync
 */
const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

interface PreferencesProviderProps {
  children: React.ReactNode;
}

interface PreferencesResponse {
  preferences: UserPreferences;
}

interface UpdatePreferencesResponse {
  message: string;
  preferences: UserPreferences;
}

// Local storage key for guest preferences
const GUEST_PREFERENCES_KEY = 'prenatal_hub_guest_preferences';

/**
 * Load preferences from localStorage for guest users
 */
function loadGuestPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(GUEST_PREFERENCES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_USER_PREFERENCES,
        ...parsed,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.warn('Failed to load guest preferences:', err);
  }
  return {
    ...DEFAULT_USER_PREFERENCES,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Save preferences to localStorage for guest users
 */
function saveGuestPreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(GUEST_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (err) {
    console.warn('Failed to save guest preferences:', err);
  }
}


/**
 * Apply theme preference to the document
 * Requirements: 9.1 - Persist theme preferences
 */
function applyThemePreference(theme: ThemePreference): void {
  const root = document.documentElement;
  
  if (theme === 'system') {
    // Use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme-mode', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme-mode', theme);
  }
}

/**
 * Apply font size preference to the document
 * Requirements: 9.4 - Persist reading preferences
 */
function applyFontSizePreference(fontSize: FontSizePreference): void {
  const root = document.documentElement;
  root.setAttribute('data-font-size', fontSize);
  
  // Apply font size scale
  const fontSizeScale: Record<FontSizePreference, string> = {
    small: '0.875',
    medium: '1',
    large: '1.125',
  };
  root.style.setProperty('--font-size-scale', fontSizeScale[fontSize]);
}

/**
 * Apply reading mode preference to the document
 * Requirements: 9.4 - Persist reading preferences
 */
function applyReadingModePreference(readingMode: ReadingModePreference): void {
  const root = document.documentElement;
  root.setAttribute('data-reading-mode', readingMode);
}

/**
 * Apply accessibility preferences to the document
 * Requirements: 9.2 - Persist accessibility settings
 */
function applyAccessibilityPreferences(accessibility: UserPreferences['accessibility']): void {
  const root = document.documentElement;
  
  if (accessibility.reduceMotion) {
    root.setAttribute('data-reduce-motion', 'true');
  } else {
    root.removeAttribute('data-reduce-motion');
  }
  
  if (accessibility.highContrast) {
    root.setAttribute('data-high-contrast', 'true');
  } else {
    root.removeAttribute('data-high-contrast');
  }
  
  if (accessibility.screenReader) {
    root.setAttribute('data-screen-reader', 'true');
  } else {
    root.removeAttribute('data-screen-reader');
  }
}

/**
 * Apply all preferences to the document
 */
function applyAllPreferences(preferences: UserPreferences): void {
  applyThemePreference(preferences.theme);
  applyFontSizePreference(preferences.fontSize);
  applyReadingModePreference(preferences.readingMode);
  applyAccessibilityPreferences(preferences.accessibility);
}


/**
 * PreferencesProvider component that manages user preferences state
 * Requirements: 9.1 - Persist theme preferences to user account
 * Requirements: 9.2 - Persist accessibility settings to user account
 * Requirements: 9.3 - Persist notification preferences to user account
 * Requirements: 9.4 - Persist reading preferences to user account
 * Requirements: 9.5 - Apply saved preferences on login
 */
export function PreferencesProvider({ children }: PreferencesProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadGuestPreferences());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch preferences from the server for authenticated users
   * Requirements: 9.5 - Apply saved preferences on login
   */
  const fetchPreferences = useCallback(async () => {
    if (!isAuthenticated) {
      // Load from localStorage for guests
      const guestPrefs = loadGuestPreferences();
      setPreferences(guestPrefs);
      applyAllPreferences(guestPrefs);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await get<PreferencesResponse>('/preferences');
      setPreferences(response.preferences);
      applyAllPreferences(response.preferences);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load preferences');
      }
      console.error('Failed to fetch preferences:', err);
      
      // Fall back to guest preferences on error
      const guestPrefs = loadGuestPreferences();
      setPreferences(guestPrefs);
      applyAllPreferences(guestPrefs);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load preferences when authentication state changes
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  // Apply preferences whenever they change
  useEffect(() => {
    applyAllPreferences(preferences);
  }, [preferences]);

  // Listen for system theme changes when using 'system' theme
  useEffect(() => {
    if (preferences.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyThemePreference('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme]);


  /**
   * Update preferences
   * Requirements: 9.1, 9.2, 9.3, 9.4 - Update and persist preferences
   */
  const updatePreferences = useCallback(async (
    updates: Partial<Omit<UserPreferences, 'updatedAt'>>
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    // Optimistically update local state
    const updatedPrefs: UserPreferences = {
      ...preferences,
      ...updates,
      // Merge nested objects
      notifications: updates.notifications 
        ? { ...preferences.notifications, ...updates.notifications }
        : preferences.notifications,
      accessibility: updates.accessibility
        ? { ...preferences.accessibility, ...updates.accessibility }
        : preferences.accessibility,
      updatedAt: new Date().toISOString(),
    };

    // Apply immediately for responsive UI
    setPreferences(updatedPrefs);
    applyAllPreferences(updatedPrefs);

    if (!isAuthenticated) {
      // Save to localStorage for guests
      saveGuestPreferences(updatedPrefs);
      setIsLoading(false);
      return;
    }

    try {
      // Sync to server for authenticated users
      const response = await put<UpdatePreferencesResponse>('/preferences', updates);
      setPreferences(response.preferences);
      applyAllPreferences(response.preferences);
    } catch (err) {
      // Revert on error
      setPreferences(preferences);
      applyAllPreferences(preferences);
      
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update preferences');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, preferences]);

  /**
   * Refresh preferences from the server
   */
  const refreshPreferences = useCallback(async (): Promise<void> => {
    await fetchPreferences();
  }, [fetchPreferences]);

  /**
   * Clear any preference errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = useMemo<PreferencesContextValue>(() => ({
    preferences,
    isLoading,
    error,
    updatePreferences,
    refreshPreferences,
    clearError,
  }), [
    preferences,
    isLoading,
    error,
    updatePreferences,
    refreshPreferences,
    clearError,
  ]);

  return (
    <PreferencesContext.Provider value={contextValue}>
      {children}
    </PreferencesContext.Provider>
  );
}

/**
 * Hook to access preferences context
 * @throws Error if used outside of PreferencesProvider
 */
export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}

export default PreferencesProvider;
