/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * ViewModeContext for managing application view mode state
 * Requirements: 2.1 - Default to Learning Path Mode
 * Requirements: 2.6 - Preserve filter and search state when switching modes
 */

export type ViewMode = 'explore' | 'learning-path';

export interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const VIEW_MODE_STORAGE_KEY = 'prenatal-learning-hub:view-mode';
const DEFAULT_VIEW_MODE: ViewMode = 'learning-path';

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

/**
 * Load view mode preference from localStorage
 */
function loadViewModePreference(): ViewMode {
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (stored === 'explore' || stored === 'learning-path') {
      return stored;
    }
    return DEFAULT_VIEW_MODE;
  } catch {
    return DEFAULT_VIEW_MODE;
  }
}

/**
 * Save view mode preference to localStorage
 */
function saveViewModePreference(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    console.warn('Unable to save view mode preference to localStorage');
  }
}

interface ViewModeProviderProps {
  children: React.ReactNode;
}

/**
 * ViewModeProvider component that manages view mode state and persistence
 * Requirements: 2.1 - Display Learning Path Mode as default
 * Requirements: 2.6 - Preserve filter state when switching modes
 */
export function ViewModeProvider({ children }: ViewModeProviderProps): React.ReactElement {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    return loadViewModePreference();
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    saveViewModePreference(mode);
  }, []);

  const contextValue = useMemo<ViewModeContextValue>(() => ({
    viewMode,
    setViewMode,
  }), [viewMode, setViewMode]);

  return (
    <ViewModeContext.Provider value={contextValue}>
      {children}
    </ViewModeContext.Provider>
  );
}

/**
 * Hook to access view mode context
 * @throws Error if used outside of ViewModeProvider
 */
export function useViewMode(): ViewModeContextValue {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

export default ViewModeProvider;
