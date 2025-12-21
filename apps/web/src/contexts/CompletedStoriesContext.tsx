/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

/**
 * CompletedStoriesContext for managing completed topic/story tracking
 * 
 * For logged-in users: Progress is persisted to the server
 * For guests: Progress is stored in localStorage
 */

const STORAGE_KEY = 'prenatal-learning-completed-stories';

export interface CompletedStoriesContextValue {
  completedStories: number[];
  handleToggleComplete: (storyId: number) => void;
  handleCompleteTopic: (storyId: number) => void;
}

const CompletedStoriesContext = createContext<CompletedStoriesContextValue | undefined>(undefined);

/**
 * Load completed stories from localStorage
 */
function loadFromLocalStorage(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch {
    console.warn('Failed to load completed stories from localStorage');
    return [];
  }
}

/**
 * Save completed stories to localStorage
 */
function saveToLocalStorage(stories: number[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  } catch {
    console.warn('Unable to save completed stories to localStorage');
  }
}

/**
 * Save completed stories to server (for logged-in users)
 */
async function saveToServer(stories: number[]): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completedStories: stories,
      }),
    });
    
    if (!response.ok) {
      console.warn('Failed to save completed stories to server');
    }
  } catch (err) {
    console.warn('Failed to save completed stories to server:', err);
  }
}

/**
 * Load completed stories from server (for logged-in users)
 */
async function loadFromServer(): Promise<number[] | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      return (data.preferences?.completedStories as number[]) || [];
    }
    return null;
  } catch (err) {
    console.warn('Failed to load completed stories from server:', err);
    return null;
  }
}

interface CompletedStoriesProviderProps {
  children: React.ReactNode;
}

/**
 * CompletedStoriesProvider component that manages completed stories state and persistence
 * 
 * For logged-in users: Syncs with server
 * For guests: Uses localStorage
 */
export function CompletedStoriesProvider({ children }: CompletedStoriesProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const [completedStories, setCompletedStories] = useState<number[]>(() => {
    return loadFromLocalStorage();
  });
  const hasLoadedFromServer = useRef(false);
  const previousAuthState = useRef(isAuthenticated);
  // Use a ref to track current auth state for use in callbacks to avoid stale closures
  const isAuthenticatedRef = useRef(isAuthenticated);
  
  // Keep the ref in sync with the current auth state
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Load from server when user logs in and merge with localStorage data
  useEffect(() => {
    // User just logged in (was not authenticated, now is)
    if (isAuthenticated && !previousAuthState.current && !hasLoadedFromServer.current) {
      // Get current localStorage data before loading from server
      const localData = loadFromLocalStorage();
      
      loadFromServer().then((serverData) => {
        if (serverData !== null) {
          // Merge localStorage data with server data (union of both)
          const mergedData = [...new Set([...serverData, ...localData])];
          
          // If there's new data from localStorage, save merged data to server
          if (localData.length > 0 && mergedData.length > serverData.length) {
            saveToServer(mergedData);
            console.log(`Migrated ${mergedData.length - serverData.length} completed stories from guest session`);
          }
          
          setCompletedStories(mergedData);
          saveToLocalStorage(mergedData);
        }
        // If serverData is null (error), keep using localStorage data
        hasLoadedFromServer.current = true;
      });
    }
    // User was already authenticated on mount (page refresh)
    else if (isAuthenticated && !hasLoadedFromServer.current) {
      loadFromServer().then((serverData) => {
        if (serverData !== null) {
          setCompletedStories(serverData);
          saveToLocalStorage(serverData);
        }
        hasLoadedFromServer.current = true;
      });
    }
    
    // Reset the flag when user logs out
    if (!isAuthenticated && previousAuthState.current) {
      hasLoadedFromServer.current = false;
    }
    
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated]);

  // Persist to localStorage whenever completed stories change
  useEffect(() => {
    saveToLocalStorage(completedStories);
  }, [completedStories]);

  const handleToggleComplete = useCallback((storyId: number) => {
    setCompletedStories((prev) => {
      const newStories = prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId];
      
      // If logged in, also save to server (use ref to get current auth state)
      if (isAuthenticatedRef.current) {
        saveToServer(newStories);
      }
      
      return newStories;
    });
  }, []);

  const handleCompleteTopic = useCallback((storyId: number) => {
    setCompletedStories((prev) => {
      if (prev.includes(storyId)) {
        return prev;
      }
      const newStories = [...prev, storyId];
      
      // If logged in, also save to server (use ref to get current auth state)
      if (isAuthenticatedRef.current) {
        saveToServer(newStories);
      }
      
      return newStories;
    });
  }, []);

  const contextValue = useMemo<CompletedStoriesContextValue>(() => ({
    completedStories,
    handleToggleComplete,
    handleCompleteTopic,
  }), [completedStories, handleToggleComplete, handleCompleteTopic]);

  return (
    <CompletedStoriesContext.Provider value={contextValue}>
      {children}
    </CompletedStoriesContext.Provider>
  );
}

/**
 * Hook to access completed stories context
 * @throws Error if used outside of CompletedStoriesProvider
 */
export function useCompletedStories(): CompletedStoriesContextValue {
  const context = useContext(CompletedStoriesContext);
  if (context === undefined) {
    throw new Error('useCompletedStories must be used within a CompletedStoriesProvider');
  }
  return context;
}

export default CompletedStoriesProvider;
