/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { Trimester, TrimesterInfo } from '../types/trimester';
import { calculateTrimester } from '../utils/trimesterUtils';
import { useAuth } from './AuthContext';

/**
 * TrimesterContext for managing pregnancy trimester state
 * Requirements: 3.1, 3.2 - Calculate and display current trimester from due date
 * 
 * For logged-in users: Due date is persisted to the server
 * For guests: Due date is stored in localStorage
 */

const DUE_DATE_STORAGE_KEY = 'prenatal-learning-due-date';

export interface TrimesterContextValue {
  /** The due date if set */
  dueDate: Date | null;
  /** Calculated trimester info based on due date */
  trimesterInfo: TrimesterInfo | null;
  /** Current trimester or null if no due date */
  currentTrimester: Trimester | null;
  /** Current week number or null if no due date */
  currentWeek: number | null;
  /** Whether a due date has been set */
  hasDueDate: boolean;
  /** Set the due date */
  setDueDate: (date: Date | null) => void;
  /** Clear the due date */
  clearDueDate: () => void;
}

const TrimesterContext = createContext<TrimesterContextValue | undefined>(undefined);

/**
 * Load due date from localStorage (for guests)
 */
function loadDueDateFromStorage(): Date | null {
  try {
    const stored = localStorage.getItem(DUE_DATE_STORAGE_KEY);
    if (stored) {
      const date = new Date(stored);
      // Validate the date is valid
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return null;
  } catch {
    console.warn('Failed to load due date from localStorage');
    return null;
  }
}

/**
 * Save due date to localStorage (for guests)
 */
function saveDueDateToStorage(date: Date | null): void {
  try {
    if (date) {
      localStorage.setItem(DUE_DATE_STORAGE_KEY, date.toISOString());
    } else {
      localStorage.removeItem(DUE_DATE_STORAGE_KEY);
    }
  } catch {
    console.warn('Unable to save due date to localStorage');
  }
}

/**
 * Save due date to server (for logged-in users)
 */
async function saveDueDateToServer(date: Date | null): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dueDate: date ? date.toISOString() : null,
      }),
    });
    
    if (!response.ok) {
      console.warn('Failed to save due date to server');
    }
  } catch (err) {
    console.warn('Failed to save due date to server:', err);
  }
}

/**
 * Load due date from server (for logged-in users)
 */
async function loadDueDateFromServer(): Promise<Date | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.preferences?.dueDate) {
        const date = new Date(data.preferences.dueDate);
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
    return null;
  } catch (err) {
    console.warn('Failed to load due date from server:', err);
    return null;
  }
}

interface TrimesterProviderProps {
  children: React.ReactNode;
}

/**
 * TrimesterProvider component that manages trimester state and persistence
 * Requirements: 3.1 - Calculate current trimester from due date
 * Requirements: 3.2 - Display current trimester and week number
 * 
 * For logged-in users: Syncs due date with server
 * For guests: Uses localStorage
 */
export function TrimesterProvider({ children }: TrimesterProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const [dueDate, setDueDateState] = useState<Date | null>(() => loadDueDateFromStorage());
  const [, setIsLoadingFromServer] = useState(false);
  const hasLoadedFromServer = useRef(false);
  const previousAuthState = useRef(isAuthenticated);

  // Load due date from server when user logs in
  useEffect(() => {
    // Only load from server when auth state changes to authenticated
    if (isAuthenticated && !hasLoadedFromServer.current) {
      setIsLoadingFromServer(true);
      loadDueDateFromServer().then((serverDueDate) => {
        if (serverDueDate) {
          setDueDateState(serverDueDate);
          // Also update localStorage for offline access
          saveDueDateToStorage(serverDueDate);
        }
        hasLoadedFromServer.current = true;
        setIsLoadingFromServer(false);
      });
    }
    
    // Reset the flag when user logs out
    if (!isAuthenticated && previousAuthState.current) {
      hasLoadedFromServer.current = false;
    }
    
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated]);

  // Set due date - saves to server for logged-in users, localStorage for guests
  const setDueDate = useCallback((date: Date | null) => {
    setDueDateState(date);
    
    // Always save to localStorage for offline access
    saveDueDateToStorage(date);
    
    // If logged in, also save to server
    if (isAuthenticated) {
      saveDueDateToServer(date);
    }
  }, [isAuthenticated]);

  const clearDueDate = useCallback(() => {
    setDueDateState(null);
    
    // Clear from localStorage
    saveDueDateToStorage(null);
    
    // If logged in, also clear on server
    if (isAuthenticated) {
      saveDueDateToServer(null);
    }
  }, [isAuthenticated]);

  // Calculate trimester info from due date
  const trimesterInfo = useMemo<TrimesterInfo | null>(() => {
    if (!dueDate) return null;
    return calculateTrimester(dueDate);
  }, [dueDate]);

  const currentTrimester = useMemo<Trimester | null>(() => {
    return trimesterInfo?.trimester ?? null;
  }, [trimesterInfo]);

  const currentWeek = useMemo<number | null>(() => {
    return trimesterInfo?.weekNumber ?? null;
  }, [trimesterInfo]);

  const hasDueDate = dueDate !== null;

  const contextValue = useMemo<TrimesterContextValue>(() => ({
    dueDate,
    trimesterInfo,
    currentTrimester,
    currentWeek,
    hasDueDate,
    setDueDate,
    clearDueDate,
  }), [dueDate, trimesterInfo, currentTrimester, currentWeek, hasDueDate, setDueDate, clearDueDate]);

  return (
    <TrimesterContext.Provider value={contextValue}>
      {children}
    </TrimesterContext.Provider>
  );
}

/**
 * Hook to access trimester context
 * @throws Error if used outside of TrimesterProvider
 */
export function useTrimester(): TrimesterContextValue {
  const context = useContext(TrimesterContext);
  if (context === undefined) {
    throw new Error('useTrimester must be used within a TrimesterProvider');
  }
  return context;
}

export default TrimesterProvider;
