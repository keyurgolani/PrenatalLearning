/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

/**
 * LayoutContext for managing application layout state (grid/list)
 * Requirements: 3.1 - Default to grid layout
 * Requirements: 3.5 - Persist layout selection to localStorage
 * Requirements: 3.6 - Restore previously selected layout
 */

export type LayoutMode = 'grid' | 'list';

export interface LayoutContextValue {
  layout: LayoutMode;
  setLayout: (layout: LayoutMode) => void;
}

const LAYOUT_STORAGE_KEY = 'prenatal-learning-hub:layout';
const DEFAULT_LAYOUT: LayoutMode = 'grid';

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

/**
 * Load layout preference from localStorage
 */
function loadLayoutPreference(): LayoutMode {
  try {
    const stored = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (stored === 'grid' || stored === 'list') {
      return stored;
    }
    return DEFAULT_LAYOUT;
  } catch {
    return DEFAULT_LAYOUT;
  }
}

/**
 * Save layout preference to localStorage
 */
function saveLayoutPreference(layout: LayoutMode): void {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, layout);
  } catch {
    console.warn('Unable to save layout preference to localStorage');
  }
}

interface LayoutProviderProps {
  children: React.ReactNode;
}

/**
 * LayoutProvider component that manages layout state and persistence
 * Requirements: 3.1 - Display grid layout by default
 * Requirements: 3.5 - Persist selection to localStorage
 * Requirements: 3.6 - Restore previously selected layout on load
 */
export function LayoutProvider({ children }: LayoutProviderProps): React.ReactElement {
  const [layout, setLayoutState] = useState<LayoutMode>(() => {
    return loadLayoutPreference();
  });

  const setLayout = useCallback((newLayout: LayoutMode) => {
    setLayoutState(newLayout);
    saveLayoutPreference(newLayout);
  }, []);

  const contextValue = useMemo<LayoutContextValue>(() => ({
    layout,
    setLayout,
  }), [layout, setLayout]);

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

/**
 * Hook to access layout context
 * @throws Error if used outside of LayoutProvider
 */
export function useLayout(): LayoutContextValue {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}

export default LayoutProvider;
