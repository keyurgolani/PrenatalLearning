/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { Trimester, TrimesterInfo } from '../types/trimester';
import { calculateTrimester } from '../utils/trimesterUtils';

/**
 * TrimesterContext for managing pregnancy trimester state
 * Requirements: 3.1, 3.2 - Calculate and display current trimester from due date
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
 * Load due date from localStorage
 */
function loadDueDate(): Date | null {
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
 * Save due date to localStorage
 */
function saveDueDate(date: Date | null): void {
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

interface TrimesterProviderProps {
  children: React.ReactNode;
}

/**
 * TrimesterProvider component that manages trimester state and persistence
 * Requirements: 3.1 - Calculate current trimester from due date
 * Requirements: 3.2 - Display current trimester and week number
 */
export function TrimesterProvider({ children }: TrimesterProviderProps): React.ReactElement {
  const [dueDate, setDueDateState] = useState<Date | null>(() => loadDueDate());

  // Persist to localStorage whenever due date changes
  useEffect(() => {
    saveDueDate(dueDate);
  }, [dueDate]);

  const setDueDate = useCallback((date: Date | null) => {
    setDueDateState(date);
  }, []);

  const clearDueDate = useCallback(() => {
    setDueDateState(null);
  }, []);

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
