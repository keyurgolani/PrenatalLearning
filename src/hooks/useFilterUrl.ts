import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { AdvancedFilterState, CategoryId, DifficultyLevel, DurationFilter, CompletionStatus, Trimester } from '../types';

/**
 * URL Query Parameter Keys (for documentation)
 * Requirements: 4.1, 4.2
 * 
 * q: search query
 * cat: category
 * diff: difficulty
 * dur: duration
 * status: completion status
 */

/**
 * Default filter state with no filters applied
 */
const DEFAULT_FILTER_STATE: AdvancedFilterState = {
  selectedCategory: 'all',
  selectedDifficulty: 'all',
  searchTerm: '',
  selectedDuration: 'all',
  selectedCompletionStatus: 'all',
  selectedTrimester: 'all',
};

/**
 * Valid category values for validation
 */
const VALID_CATEGORIES: CategoryId[] = [
  'all', 'science', 'technology', 'biology', 'math', 
  'psychology', 'language', 'finance', 'society'
];

/**
 * Valid difficulty values for validation
 */
const VALID_DIFFICULTIES: (DifficultyLevel | 'all')[] = [
  'all', 'foundational', 'intermediate', 'advanced'
];

/**
 * Valid duration values for validation
 */
const VALID_DURATIONS: DurationFilter[] = ['all', 'short', 'medium', 'long'];

/**
 * Valid completion status values for validation
 */
const VALID_STATUSES: CompletionStatus[] = ['all', 'completed', 'in-progress', 'not-started'];

/**
 * Valid trimester values for validation
 */
const VALID_TRIMESTERS: (Trimester | 'all')[] = ['all', 'first', 'second', 'third', 'any'];

/**
 * Serialize filter state to URL query parameters
 * 
 * Requirements:
 * - 4.1: THE System SHALL persist filter selections in the URL query parameters
 * 
 * Design Properties:
 * - Property 8: URL filter serialization round-trip
 * 
 * @param filters - Filter state to serialize
 * @returns URLSearchParams object
 */
export function serializeFiltersToUrl(filters: AdvancedFilterState): URLSearchParams {
  const params = new URLSearchParams();
  
  if (filters.searchTerm && filters.searchTerm.trim() !== '') {
    params.set('q', filters.searchTerm.trim());
  }
  if (filters.selectedCategory !== 'all') {
    params.set('cat', filters.selectedCategory);
  }
  if (filters.selectedDifficulty !== 'all') {
    params.set('diff', filters.selectedDifficulty);
  }
  if (filters.selectedDuration !== 'all') {
    params.set('dur', filters.selectedDuration);
  }
  if (filters.selectedCompletionStatus !== 'all') {
    params.set('status', filters.selectedCompletionStatus);
  }
  if (filters.selectedTrimester !== 'all') {
    params.set('tri', filters.selectedTrimester);
  }
  
  return params;
}

/**
 * Parse URL query parameters to filter state
 * 
 * Requirements:
 * - 4.2: THE System SHALL restore filters when navigating back to the explore page
 * 
 * Design Properties:
 * - Property 8: URL filter serialization round-trip
 * 
 * @param params - URLSearchParams to parse
 * @returns Parsed filter state
 */
export function parseFiltersFromUrl(params: URLSearchParams): AdvancedFilterState {
  const searchTerm = params.get('q') || '';
  
  const categoryParam = params.get('cat');
  const selectedCategory: CategoryId = 
    categoryParam && VALID_CATEGORIES.includes(categoryParam as CategoryId)
      ? (categoryParam as CategoryId)
      : 'all';
  
  const difficultyParam = params.get('diff');
  const selectedDifficulty: DifficultyLevel | 'all' = 
    difficultyParam && VALID_DIFFICULTIES.includes(difficultyParam as DifficultyLevel | 'all')
      ? (difficultyParam as DifficultyLevel | 'all')
      : 'all';
  
  const durationParam = params.get('dur');
  const selectedDuration: DurationFilter = 
    durationParam && VALID_DURATIONS.includes(durationParam as DurationFilter)
      ? (durationParam as DurationFilter)
      : 'all';
  
  const statusParam = params.get('status');
  const selectedCompletionStatus: CompletionStatus = 
    statusParam && VALID_STATUSES.includes(statusParam as CompletionStatus)
      ? (statusParam as CompletionStatus)
      : 'all';
  
  const trimesterParam = params.get('tri');
  const selectedTrimester: Trimester | 'all' = 
    trimesterParam && VALID_TRIMESTERS.includes(trimesterParam as Trimester | 'all')
      ? (trimesterParam as Trimester | 'all')
      : 'all';
  
  return {
    selectedCategory,
    selectedDifficulty,
    searchTerm,
    selectedDuration,
    selectedCompletionStatus,
    selectedTrimester,
  };
}


/**
 * Hook result interface
 */
interface UseFilterUrlResult {
  filters: AdvancedFilterState;
  setFilter: <K extends keyof AdvancedFilterState>(key: K, value: AdvancedFilterState[K]) => void;
  setFilters: (filters: Partial<AdvancedFilterState>) => void;
  clearFilters: () => void;
  updateUrl: (filters: AdvancedFilterState) => void;
}

/**
 * Custom hook for managing filter state synchronized with URL query parameters
 * 
 * Requirements:
 * - 4.1: THE System SHALL persist filter selections in the URL query parameters
 * - 4.2: THE System SHALL restore filters when navigating back to the explore page
 * 
 * Design Properties:
 * - Property 8: URL filter serialization round-trip
 * 
 * @returns Filter state and update functions
 */
export function useFilterUrl(): UseFilterUrlResult {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parse current filters from URL
  const filters = useMemo(() => parseFiltersFromUrl(searchParams), [searchParams]);
  
  // Update URL with new filter state
  const updateUrl = useCallback((newFilters: AdvancedFilterState) => {
    const params = serializeFiltersToUrl(newFilters);
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);
  
  // Set a single filter value
  const setFilter = useCallback(<K extends keyof AdvancedFilterState>(
    key: K, 
    value: AdvancedFilterState[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    updateUrl(newFilters);
  }, [filters, updateUrl]);
  
  // Set multiple filter values at once
  const setFilters = useCallback((partialFilters: Partial<AdvancedFilterState>) => {
    const newFilters = { ...filters, ...partialFilters };
    updateUrl(newFilters);
  }, [filters, updateUrl]);
  
  // Clear all filters to default state
  const clearFilters = useCallback(() => {
    updateUrl(DEFAULT_FILTER_STATE);
  }, [updateUrl]);
  
  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
    updateUrl,
  };
}

export default useFilterUrl;
