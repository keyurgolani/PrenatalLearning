/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { JournalEntry, JournalEntryData, MoodType } from '../types/journal';
import { useAuth } from './AuthContext';
import { useProfile } from './ProfileContext';
import { get, post, put, del, ApiError } from '../services/apiClient';
import { journalService, getEffectiveJournalDate } from '../services/journalService';
import { GUEST_PROFILE_ID } from '../services/guestStorageService';

/**
 * Types for journal entry creation and updates
 * Requirements: 10.4, 10.5 - Create and edit journal entries
 * Requirements: 11.1, 11.8, 11.9 - Mood is optional, entries can have mood only (no content required)
 */
export interface CreateJournalEntry {
  content?: string;
  mood?: MoodType | null;
  topicReferences?: Array<{ topicId: number; title: string }>;
  journeyReferences?: Array<{ journeyId: string; title: string }>;
}

export interface UpdateJournalEntry {
  content?: string;
  mood?: MoodType | null;
  kickCount?: number;
  topicReferences?: Array<{ topicId: number; title: string }>;
  journeyReferences?: Array<{ journeyId: string; title: string }>;
}

/**
 * Extended JournalEntry type for API responses
 */
interface ApiJournalEntry {
  id: string;
  userId?: string;
  journalDate: string; // Logical date for the entry
  content: string;
  mood?: MoodType | null;
  kickCount?: number;
  entryType?: 'text' | 'voice';
  topicReferences?: Array<{ topicId: number; title: string }>;
  journeyReferences?: Array<{ journeyId: string; title: string }>;
  voiceNoteIds?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * JournalContext value interface
 * Requirements: 10.2 - Open journal popup/modal
 * Requirements: 10.4 - Add new journal entries
 * Requirements: 10.5 - View and edit past journal entries
 * Requirements: 10.9 - Multiple entries per date allowed
 * Requirements: 10.8, 10.11 - Late-night journaling support
 */
export interface JournalContextValue {
  entries: JournalEntry[];
  selectedDate: Date;
  /** Effective date adjusted for late-night journaling (before 4AM = previous day) */
  effectiveDate: Date;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  /** Origin rect for morph animation */
  morphOrigin: { x: number; y: number; width: number; height: number } | null;
  openJournal: (originRect?: { x: number; y: number; width: number; height: number }) => void;
  closeJournal: () => void;
  selectDate: (date: Date) => void;
  createEntry: (data: CreateJournalEntry) => Promise<void>;
  updateEntry: (id: string, data: UpdateJournalEntry) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  /** @deprecated Use todayEntries instead - kept for backward compatibility */
  todayEntry: JournalEntry | null;
  /** @deprecated Use selectedDateEntries instead - kept for backward compatibility */
  selectedDateEntry: JournalEntry | null;
  /** All entries for today (Requirements: 10.9) */
  todayEntries: JournalEntry[];
  /** All entries for the selected date (Requirements: 10.9) */
  selectedDateEntries: JournalEntry[];
  refreshEntries: () => Promise<void>;
  clearError: () => void;
}

/**
 * JournalContext for managing journal entries and modal state
 * Requirements: 10.2, 10.4, 10.5
 */
const JournalContext = createContext<JournalContextValue | undefined>(undefined);

interface JournalProviderProps {
  children: React.ReactNode;
}

interface JournalEntriesResponse {
  entries: ApiJournalEntry[];
}

interface JournalEntryResponse {
  entry: ApiJournalEntry;
}

/**
 * Normalize date to midnight in LOCAL timezone for consistent date comparison
 * This ensures the selected date in the calendar matches what the user sees
 * Requirements: 10.4 - Date normalization for journal entries
 * Requirements: 18.5, 18.6 - Selected date matches entries
 */
function normalizeToMidnightLocal(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

/**
 * Get date string in YYYY-MM-DD format using LOCAL timezone
 * This ensures consistency between calendar display and date comparisons
 * Requirements: 18.5, 18.6 - Fix date mismatch issues
 */
function getDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parse a journalDate string (ISO format) and extract the date portion
 * This handles the case where journalDate is stored as midnight UTC
 * but we want to compare using the date portion only
 * Requirements: 18.5, 18.6 - Fix date mismatch issues
 */
function getDateStringFromJournalDate(journalDate: string): string {
  // journalDate is stored as ISO string like "2024-12-18T00:00:00.000Z"
  // Extract just the date portion (YYYY-MM-DD)
  return journalDate.split('T')[0];
}

/**
 * Convert API journal entry to local JournalEntry format
 */
function convertApiEntry(apiEntry: ApiJournalEntry): JournalEntry {
  return {
    id: apiEntry.id,
    userId: apiEntry.userId,
    title: '', // API entries don't have title, use empty string
    content: apiEntry.content,
    mood: apiEntry.mood || undefined,
    kickCount: apiEntry.kickCount,
    journalDate: apiEntry.journalDate, // Logical date for the entry
    entryType: apiEntry.entryType || 'text',
    voiceNoteIds: apiEntry.voiceNoteIds || [], // Voice note IDs for voice entries
    createdAt: new Date(apiEntry.createdAt).getTime(),
    updatedAt: new Date(apiEntry.updatedAt).getTime(),
  };
}

/**
 * JournalProvider component that manages journal state
 * Requirements: 10.2 - Open journal popup/modal
 * Requirements: 10.4 - Add new journal entries to current date
 * Requirements: 10.5 - View and edit past journal entries
 */
export function JournalProvider({ children }: JournalProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  // Default selected date to effective date (previous day if before 4AM)
  // Requirements: 10.8, 10.11 - Late-night journaling support
  const [selectedDate, setSelectedDate] = useState<Date>(() => getEffectiveJournalDate());
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [morphOrigin, setMorphOrigin] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  
  // Track previous auth state to detect login transitions
  const previousAuthState = React.useRef(isAuthenticated);
  const hasMigratedGuestData = React.useRef(false);
  
  /**
   * Calculate the effective date for late-night journaling
   * Requirements: 10.8 - Entries created between midnight and 4AM belong to previous day
   * Requirements: 10.11 - Default selected date to effective date
   */
  const effectiveDate = useMemo(() => getEffectiveJournalDate(), []);

  /**
   * Fetch journal entries from API or local storage
   */
  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && activeProfile) {
        // Fetch from API for authenticated users
        const response = await get<JournalEntriesResponse>('/journal');
        const convertedEntries = response.entries.map(convertApiEntry);
        setEntries(convertedEntries);
      } else {
        // Use local storage for guests
        const localEntries = journalService.getEntries(GUEST_PROFILE_ID);
        setEntries(localEntries);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to load journal entries');
      }
      console.error('Failed to fetch journal entries:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile]);

  // Load entries when authentication state or profile changes
  // Also migrate guest entries when user logs in
  useEffect(() => {
    const loadAndMigrateEntries = async () => {
      // User just logged in (was not authenticated, now is)
      if (isAuthenticated && activeProfile && !previousAuthState.current && !hasMigratedGuestData.current) {
        // Get guest entries before fetching from server
        const guestEntries = journalService.getEntries(GUEST_PROFILE_ID);
        
        // Fetch server entries
        await fetchEntries();
        
        // Migrate guest entries if any exist
        if (guestEntries.length > 0) {
          try {
            // Create each guest entry on the server
            for (const guestEntry of guestEntries) {
              const dateString = guestEntry.journalDate 
                ? guestEntry.journalDate.split('T')[0]
                : new Date(guestEntry.createdAt).toISOString().split('T')[0];
              const journalDateISO = `${dateString}T00:00:00.000Z`;
              
              await post<JournalEntryResponse>('/journal', {
                journalDate: journalDateISO,
                content: guestEntry.content || '',
                mood: guestEntry.mood,
                kickCount: guestEntry.kickCount,
              });
            }
            
            console.log(`Migrated ${guestEntries.length} journal entries from guest session`);
            
            // Clear guest entries after successful migration
            // Note: We don't clear localStorage here to preserve data in case of issues
            
            // Refresh entries to include migrated ones
            await fetchEntries();
          } catch (err) {
            console.warn('Failed to migrate some guest journal entries:', err);
          }
        }
        
        hasMigratedGuestData.current = true;
      } else {
        // Normal fetch (page refresh or profile change)
        await fetchEntries();
      }
      
      // Reset migration flag when user logs out
      if (!isAuthenticated && previousAuthState.current) {
        hasMigratedGuestData.current = false;
      }
      
      previousAuthState.current = isAuthenticated;
    };
    
    loadAndMigrateEntries();
  }, [fetchEntries, isAuthenticated, activeProfile]);

  /**
   * Open the journal modal with optional morph animation origin
   * Requirements: 10.2 - Open journal popup/modal
   */
  const openJournal = useCallback((originRect?: { x: number; y: number; width: number; height: number }) => {
    setMorphOrigin(originRect || null);
    setIsOpen(true);
  }, []);

  /**
   * Close the journal modal
   */
  const closeJournal = useCallback(() => {
    setIsOpen(false);
    setMorphOrigin(null);
  }, []);

  /**
   * Select a date for viewing/editing entries
   * Requirements: 10.5 - View past journal entries by selecting a date
   * Requirements: 18.5, 18.6 - Ensure selected date matches calendar display
   */
  const selectDate = useCallback((date: Date) => {
    setSelectedDate(normalizeToMidnightLocal(date));
  }, []);

  /**
   * Create a new journal entry
   * Requirements: 10.4 - Add new journal entries to current date
   * Requirements: 10.9 - Multiple entries per date allowed
   * Requirements: 18.5, 18.6 - Use selected date correctly
   */
  const createEntry = useCallback(async (data: CreateJournalEntry): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && activeProfile) {
        // Create via API for authenticated users
        // Multiple entries per date are now allowed (Requirements: 10.9, 18.3)
        // Use the selected date's date string (YYYY-MM-DD) and append UTC midnight
        // This ensures the server stores the correct logical date regardless of timezone
        // Requirements: 18.5, 18.6 - Selected date in calendar matches the date used for entries
        const dateString = getDateString(selectedDate);
        const journalDateISO = `${dateString}T00:00:00.000Z`;
        
        const response = await post<JournalEntryResponse>('/journal', {
          journalDate: journalDateISO, // Logical date for the entry (YYYY-MM-DDT00:00:00.000Z)
          content: data.content || '', // Default to empty string if not provided (Requirements: 11.8)
          mood: data.mood, // Optional and nullable (Requirements: 11.1, 11.9)
          topicReferences: data.topicReferences,
          journeyReferences: data.journeyReferences,
        });
        
        const newEntry = convertApiEntry(response.entry);
        setEntries(prev => [newEntry, ...prev]);
      } else {
        // Use local storage for guests
        const entryData: JournalEntryData = {
          title: getDateString(selectedDate),
          content: data.content || '', // Default to empty string if not provided (Requirements: 11.8)
          mood: data.mood || undefined, // Optional (Requirements: 11.1, 11.9)
        };
        
        const newEntry = journalService.createEntry(GUEST_PROFILE_ID, entryData);
        setEntries(prev => [newEntry, ...prev]);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create journal entry');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile, selectedDate]);

  /**
   * Update an existing journal entry
   * Requirements: 10.5 - Edit past journal entries
   */
  const updateEntry = useCallback(async (id: string, data: UpdateJournalEntry): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && activeProfile) {
        // Update via API for authenticated users
        const response = await put<JournalEntryResponse>(`/journal/${id}`, {
          content: data.content,
          mood: data.mood,
          kickCount: data.kickCount,
          topicReferences: data.topicReferences,
          journeyReferences: data.journeyReferences,
        });
        
        const updatedEntry = convertApiEntry(response.entry);
        setEntries(prev => prev.map(entry => 
          entry.id === id ? updatedEntry : entry
        ));
      } else {
        // Use local storage for guests
        const updateData: Partial<JournalEntryData> = {};
        if (data.content !== undefined) updateData.content = data.content;
        // Convert null to undefined for local storage compatibility (Requirements: 11.9)
        if (data.mood !== undefined) updateData.mood = data.mood ?? undefined;
        
        const updatedEntry = journalService.updateEntry(GUEST_PROFILE_ID, id, updateData);
        if (updatedEntry) {
          setEntries(prev => prev.map(entry => 
            entry.id === id ? updatedEntry : entry
          ));
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update journal entry');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile]);

  /**
   * Delete a journal entry
   */
  const deleteEntry = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (isAuthenticated && activeProfile) {
        // Delete via API for authenticated users
        await del(`/journal/${id}`);
        setEntries(prev => prev.filter(entry => entry.id !== id));
      } else {
        // Use local storage for guests
        const deleted = journalService.deleteEntry(GUEST_PROFILE_ID, id);
        if (deleted) {
          setEntries(prev => prev.filter(entry => entry.id !== id));
        }
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete journal entry');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, activeProfile]);

  /**
   * Refresh entries from the server/storage
   */
  const refreshEntries = useCallback(async (): Promise<void> => {
    await fetchEntries();
  }, [fetchEntries]);

  /**
   * Clear any errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Get all entries for today (using effective date for late-night journaling), sorted by createdAt (newest first)
   * Requirements: 10.8 - Entries created between midnight and 4AM belong to previous day
   * Requirements: 10.9 - Multiple entries per date allowed
   * Requirements: 18.5, 18.6 - Use local timezone for date comparison
   */
  const todayEntries = useMemo(() => {
    // Use effective date to account for late-night journaling
    const todayString = getDateString(effectiveDate);
    
    return entries
      .filter(entry => {
        // Use journalDate if available, otherwise fall back to createdAt
        // journalDate is stored as ISO string with UTC midnight, extract date portion directly
        if (entry.journalDate) {
          return getDateStringFromJournalDate(entry.journalDate) === todayString;
        }
        return getDateString(new Date(entry.createdAt)) === todayString;
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first
  }, [entries, effectiveDate]);

  /**
   * Get today's first entry if it exists (for backward compatibility)
   * @deprecated Use todayEntries instead
   */
  const todayEntry = useMemo(() => {
    return todayEntries.length > 0 ? todayEntries[0] : null;
  }, [todayEntries]);

  /**
   * Get all entries for the selected date, sorted by createdAt (newest first)
   * Requirements: 10.9 - Multiple entries per date allowed
   * Requirements: 18.5, 18.6 - Use local timezone for date comparison
   */
  const selectedDateEntries = useMemo(() => {
    const selectedString = getDateString(selectedDate);
    
    return entries
      .filter(entry => {
        // Use journalDate if available, otherwise fall back to createdAt
        // journalDate is stored as ISO string with UTC midnight, extract date portion directly
        if (entry.journalDate) {
          return getDateStringFromJournalDate(entry.journalDate) === selectedString;
        }
        return getDateString(new Date(entry.createdAt)) === selectedString;
      })
      .sort((a, b) => b.createdAt - a.createdAt); // Newest first
  }, [entries, selectedDate]);

  /**
   * Get the first entry for the selected date if it exists (for backward compatibility)
   * @deprecated Use selectedDateEntries instead
   */
  const selectedDateEntry = useMemo(() => {
    return selectedDateEntries.length > 0 ? selectedDateEntries[0] : null;
  }, [selectedDateEntries]);

  const contextValue = useMemo<JournalContextValue>(() => ({
    entries,
    selectedDate,
    effectiveDate,
    isOpen,
    isLoading,
    error,
    morphOrigin,
    openJournal,
    closeJournal,
    selectDate,
    createEntry,
    updateEntry,
    deleteEntry,
    todayEntry,
    selectedDateEntry,
    todayEntries,
    selectedDateEntries,
    refreshEntries,
    clearError,
  }), [
    entries,
    selectedDate,
    effectiveDate,
    isOpen,
    isLoading,
    error,
    morphOrigin,
    openJournal,
    closeJournal,
    selectDate,
    createEntry,
    updateEntry,
    deleteEntry,
    todayEntry,
    selectedDateEntry,
    todayEntries,
    selectedDateEntries,
    refreshEntries,
    clearError,
  ]);

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  );
}

/**
 * Hook to access journal context
 * @throws Error if used outside of JournalProvider
 */
export function useJournal(): JournalContextValue {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}

export default JournalProvider;
