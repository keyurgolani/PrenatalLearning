/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * ViewModeContext for managing application view mode state via routes
 * /explore - Explore mode
 * /journey or / - Learning Path (Journey) mode
 */

export type ViewMode = 'explore' | 'learning-path';

export interface ViewModeContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const ViewModeContext = createContext<ViewModeContextValue | undefined>(undefined);

interface ViewModeProviderProps {
  children: React.ReactNode;
}

/**
 * ViewModeProvider component that derives view mode from current route
 */
export function ViewModeProvider({ children }: ViewModeProviderProps): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Derive view mode from current path
  const viewMode: ViewMode = useMemo(() => {
    if (location.pathname.startsWith('/explore')) {
      return 'explore';
    }
    return 'learning-path';
  }, [location.pathname]);

  // Navigate to appropriate route when view mode changes
  const setViewMode = useCallback((mode: ViewMode) => {
    if (mode === 'explore') {
      navigate('/explore');
    } else {
      navigate('/journey');
    }
  }, [navigate]);

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
