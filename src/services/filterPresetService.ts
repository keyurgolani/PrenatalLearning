import type { AdvancedFilterState } from '../types';
import { storageService } from './storageService';

/**
 * Filter preset definition
 * Requirements: 4.3, 4.4, 4.5
 */
export interface FilterPreset {
  id: string;
  name: string;
  filters: AdvancedFilterState;
  isBuiltIn: boolean;
}

/**
 * Storage key for user-created filter presets
 */
const PRESETS_STORAGE_KEY = 'prenatal-filter-presets';

/**
 * Built-in filter presets for quick access
 * Requirements: 4.4 - THE System SHALL provide quick-access buttons for common filter combinations
 */
export const BUILT_IN_PRESETS: FilterPreset[] = [
  {
    id: 'not-started',
    name: 'Not Started',
    filters: {
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      searchTerm: '',
      selectedDuration: 'all',
      selectedCompletionStatus: 'not-started',
      selectedTrimester: 'all',
    },
    isBuiltIn: true,
  },
  {
    id: 'in-progress',
    name: 'In Progress',
    filters: {
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      searchTerm: '',
      selectedDuration: 'all',
      selectedCompletionStatus: 'in-progress',
      selectedTrimester: 'all',
    },
    isBuiltIn: true,
  },
  {
    id: 'completed',
    name: 'Completed',
    filters: {
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      searchTerm: '',
      selectedDuration: 'all',
      selectedCompletionStatus: 'completed',
      selectedTrimester: 'all',
    },
    isBuiltIn: true,
  },
  {
    id: 'quick-reads',
    name: 'Quick Reads',
    filters: {
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      searchTerm: '',
      selectedDuration: 'short',
      selectedCompletionStatus: 'all',
      selectedTrimester: 'all',
    },
    isBuiltIn: true,
  },
  {
    id: 'beginner-friendly',
    name: 'Beginner Friendly',
    filters: {
      selectedCategory: 'all',
      selectedDifficulty: 'foundational',
      searchTerm: '',
      selectedDuration: 'all',
      selectedCompletionStatus: 'all',
      selectedTrimester: 'all',
    },
    isBuiltIn: true,
  },
];

/**
 * Generate a unique ID for user presets
 */
function generatePresetId(): string {
  return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all user-created presets from storage
 * 
 * Requirements:
 * - 4.3: THE System SHALL allow logged-in users to save filter combinations as named presets
 * 
 * @returns Array of user-created filter presets
 */
export function getUserPresets(): FilterPreset[] {
  const stored = storageService.get(PRESETS_STORAGE_KEY);
  if (!stored) {
    return [];
  }
  
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.map((preset: FilterPreset) => ({
        ...preset,
        isBuiltIn: false,
      }));
    }
    return [];
  } catch {
    console.error('Failed to parse filter presets from storage');
    return [];
  }
}

/**
 * Get all presets (built-in + user-created)
 * 
 * @returns Array of all filter presets
 */
export function getAllPresets(): FilterPreset[] {
  return [...BUILT_IN_PRESETS, ...getUserPresets()];
}

/**
 * Save a new user preset
 * 
 * Requirements:
 * - 4.3: THE System SHALL allow logged-in users to save filter combinations as named presets
 * 
 * @param name - Name for the preset
 * @param filters - Filter state to save
 * @returns The created preset
 */
export function savePreset(name: string, filters: AdvancedFilterState): FilterPreset {
  const userPresets = getUserPresets();
  
  const newPreset: FilterPreset = {
    id: generatePresetId(),
    name: name.trim(),
    filters: { ...filters },
    isBuiltIn: false,
  };
  
  const updatedPresets = [...userPresets, newPreset];
  storageService.set(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
  
  return newPreset;
}

/**
 * Delete a user preset
 * 
 * @param presetId - ID of the preset to delete
 * @returns true if deleted, false if not found or is built-in
 */
export function deletePreset(presetId: string): boolean {
  const userPresets = getUserPresets();
  const filteredPresets = userPresets.filter(p => p.id !== presetId);
  
  if (filteredPresets.length === userPresets.length) {
    return false; // Preset not found
  }
  
  storageService.set(PRESETS_STORAGE_KEY, JSON.stringify(filteredPresets));
  return true;
}

/**
 * Get a preset by ID
 * 
 * @param presetId - ID of the preset to find
 * @returns The preset or undefined if not found
 */
export function getPresetById(presetId: string): FilterPreset | undefined {
  return getAllPresets().find(p => p.id === presetId);
}

/**
 * Check if current filters match a preset
 * 
 * @param filters - Current filter state
 * @param preset - Preset to compare against
 * @returns true if filters match the preset
 */
export function filtersMatchPreset(filters: AdvancedFilterState, preset: FilterPreset): boolean {
  return (
    filters.selectedCategory === preset.filters.selectedCategory &&
    filters.selectedDifficulty === preset.filters.selectedDifficulty &&
    filters.searchTerm === preset.filters.searchTerm &&
    filters.selectedDuration === preset.filters.selectedDuration &&
    filters.selectedCompletionStatus === preset.filters.selectedCompletionStatus &&
    filters.selectedTrimester === preset.filters.selectedTrimester
  );
}

/**
 * Find which preset (if any) matches the current filters
 * 
 * @param filters - Current filter state
 * @returns The matching preset or undefined
 */
export function findMatchingPreset(filters: AdvancedFilterState): FilterPreset | undefined {
  return getAllPresets().find(preset => filtersMatchPreset(filters, preset));
}

export default {
  getUserPresets,
  getAllPresets,
  savePreset,
  deletePreset,
  getPresetById,
  filtersMatchPreset,
  findMatchingPreset,
  BUILT_IN_PRESETS,
};
