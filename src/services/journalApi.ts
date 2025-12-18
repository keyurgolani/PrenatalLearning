/**
 * Journal API client for journal endpoints
 * 
 * This module provides API-like interface for journal operations.
 * Currently uses localStorage via journalService, but designed to be
 * easily migrated to real HTTP endpoints.
 * 
 * Requirements:
 * - 8.4: Save journal entries to server for logged-in users
 * - 8.5: Auto-save drafts every 30 seconds
 * - 9.1: Provide dedicated Journal page listing all entries
 * - 9.2: Allow filtering journal entries by story, category, or date range
 * - 9.3: Allow editing existing journal entries
 * - 9.4: Allow deleting journal entries with confirmation
 * 
 * Endpoints:
 * - POST /api/journal - Create entry
 * - GET /api/journal - List entries with filters
 * - PUT /api/journal/:id - Update entry
 * - DELETE /api/journal/:id - Delete entry
 * - POST /api/journal/draft - Save draft
 * - GET /api/journal/draft - Get draft
 */

import type {
  JournalEntry,
  JournalEntryData,
  JournalDraft,
  JournalFilters,
  JournalRecord,
} from '../types/journal';
import { journalService } from './journalService';

/**
 * Response wrapper for API-like responses
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * POST /api/journal
 * Create a new journal entry
 * Requirements: 8.4
 */
export async function createJournalEntry(
  profileId: string,
  data: JournalEntryData
): Promise<ApiResponse<JournalEntry>> {
  try {
    const entry = journalService.createEntry(profileId, data);
    return { success: true, data: entry };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create journal entry',
    };
  }
}


/**
 * GET /api/journal
 * Get journal entries with optional filters
 * Requirements: 9.1, 9.2
 */
export async function getJournalEntries(
  profileId: string,
  filters?: JournalFilters
): Promise<ApiResponse<JournalEntry[]>> {
  try {
    const entries = journalService.getEntries(profileId, filters);
    return { success: true, data: entries };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get journal entries',
    };
  }
}

/**
 * GET /api/journal/:id
 * Get a single journal entry by ID
 */
export async function getJournalEntry(
  profileId: string,
  entryId: string
): Promise<ApiResponse<JournalEntry>> {
  try {
    const entry = journalService.getEntry(profileId, entryId);
    if (!entry) {
      return { success: false, error: 'Journal entry not found' };
    }
    return { success: true, data: entry };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get journal entry',
    };
  }
}

/**
 * PUT /api/journal/:id
 * Update an existing journal entry
 * Requirements: 9.3
 */
export async function updateJournalEntry(
  profileId: string,
  entryId: string,
  data: Partial<JournalEntryData>
): Promise<ApiResponse<JournalEntry>> {
  try {
    const entry = journalService.updateEntry(profileId, entryId, data);
    if (!entry) {
      return { success: false, error: 'Journal entry not found' };
    }
    return { success: true, data: entry };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update journal entry',
    };
  }
}

/**
 * DELETE /api/journal/:id
 * Delete a journal entry
 * Requirements: 9.4
 */
export async function deleteJournalEntry(
  profileId: string,
  entryId: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const deleted = journalService.deleteEntry(profileId, entryId);
    if (!deleted) {
      return { success: false, error: 'Journal entry not found' };
    }
    return { success: true, data: { deleted: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete journal entry',
    };
  }
}

/**
 * POST /api/journal/draft
 * Save a draft entry
 * Requirements: 8.5
 */
export async function saveJournalDraft(
  profileId: string,
  data: JournalEntryData
): Promise<ApiResponse<JournalDraft>> {
  try {
    const draft = journalService.saveDraft(profileId, data);
    return { success: true, data: draft };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    };
  }
}

/**
 * GET /api/journal/draft
 * Get the current draft
 * Requirements: 8.5
 */
export async function getJournalDraft(
  profileId: string
): Promise<ApiResponse<JournalDraft | null>> {
  try {
    const draft = journalService.getDraft(profileId);
    return { success: true, data: draft };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get draft',
    };
  }
}

/**
 * DELETE /api/journal/draft
 * Clear the current draft
 */
export async function clearJournalDraft(
  profileId: string
): Promise<ApiResponse<{ cleared: boolean }>> {
  try {
    journalService.clearDraft(profileId);
    return { success: true, data: { cleared: true } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear draft',
    };
  }
}

/**
 * GET /api/journal/record
 * Get full journal record for a profile (for debugging/admin)
 */
export async function getJournalRecord(
  profileId: string
): Promise<ApiResponse<JournalRecord>> {
  try {
    const record = journalService.getJournalRecord(profileId);
    return { success: true, data: record };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get journal record',
    };
  }
}

/**
 * Journal API object for convenient access
 */
export const journalApi = {
  createEntry: createJournalEntry,
  getEntries: getJournalEntries,
  getEntry: getJournalEntry,
  updateEntry: updateJournalEntry,
  deleteEntry: deleteJournalEntry,
  saveDraft: saveJournalDraft,
  getDraft: getJournalDraft,
  clearDraft: clearJournalDraft,
  getRecord: getJournalRecord,
};

export default journalApi;
