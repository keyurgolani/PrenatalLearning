import type { Story, FilterState, CategoryId, DifficultyLevel, DurationFilter, CompletionStatus, AdvancedFilterState } from '../types';

/**
 * Filter stories based on category, difficulty, and search term
 * 
 * Requirements:
 * - 1.2: WHEN a user selects a category filter THEN the System SHALL display only stories belonging to that category
 * - 1.3: WHEN a user searches for a story by keyword THEN the System SHALL return stories with matching titles or descriptions
 * - 8.1: WHEN a user selects a difficulty filter THEN the System SHALL display only stories matching that difficulty level
 * - 8.3: WHEN combining filters THEN the System SHALL apply both category and difficulty filters together with search terms
 * 
 * Design Properties:
 * - Property 1: Combined Filter Correctness - All filtered results match all active filters (AND logic)
 * - Property 2: Search Results Relevance - All search results contain the search term in title or description
 * 
 * @param stories - Array of stories to filter
 * @param filterState - Current filter state with category, difficulty, and search term
 * @returns Filtered array of stories matching all criteria
 */
export function filterStories(stories: Story[], filterState: FilterState): Story[] {
  const { selectedCategory, selectedDifficulty, searchTerm } = filterState;
  
  return stories.filter((story) => {
    // Category filter: if not 'all', story must belong to selected category
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    
    // Difficulty filter: if not 'all', story must match selected difficulty
    const matchesDifficulty = selectedDifficulty === 'all' || story.difficulty === selectedDifficulty;
    
    // Search filter: if search term is not empty, story title or description must contain it (case-insensitive)
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchesSearch = normalizedSearchTerm === '' || 
      story.title.toLowerCase().includes(normalizedSearchTerm) ||
      story.description.toLowerCase().includes(normalizedSearchTerm);
    
    // All filters must match (AND logic)
    return matchesCategory && matchesDifficulty && matchesSearch;
  });
}

/**
 * Filter stories by category only
 * 
 * @param stories - Array of stories to filter
 * @param category - Category to filter by ('all' returns all stories)
 * @returns Filtered array of stories
 */
export function filterByCategory(stories: Story[], category: CategoryId): Story[] {
  if (category === 'all') {
    return stories;
  }
  return stories.filter((story) => story.category === category);
}

/**
 * Filter stories by difficulty only
 * 
 * @param stories - Array of stories to filter
 * @param difficulty - Difficulty level to filter by ('all' returns all stories)
 * @returns Filtered array of stories
 */
export function filterByDifficulty(stories: Story[], difficulty: DifficultyLevel | 'all'): Story[] {
  if (difficulty === 'all') {
    return stories;
  }
  return stories.filter((story) => story.difficulty === difficulty);
}

/**
 * Search stories by keyword in title or description (case-insensitive)
 * 
 * @param stories - Array of stories to search
 * @param searchTerm - Search term to match against title and description
 * @returns Filtered array of stories containing the search term
 */
export function searchStories(stories: Story[], searchTerm: string): Story[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  
  if (normalizedSearchTerm === '') {
    return stories;
  }
  
  return stories.filter((story) => 
    story.title.toLowerCase().includes(normalizedSearchTerm) ||
    story.description.toLowerCase().includes(normalizedSearchTerm)
  );
}

/**
 * Create a default filter state
 * 
 * @returns Default filter state with no filters applied
 */
export function createDefaultFilterState(): FilterState {
  return {
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    searchTerm: '',
  };
}

/**
 * Categorize a story's duration into short, medium, or long
 * 
 * Requirements:
 * - 3.1: THE System SHALL provide a filter for story duration (short: <55min, medium: 55-60min, long: >60min)
 * 
 * Design Properties:
 * - Property 5: Duration filter categorization - stories are correctly categorized by duration
 * 
 * @param duration - Story duration in minutes
 * @returns Duration category: 'short', 'medium', or 'long'
 */
export function categorizeDuration(duration: number): 'short' | 'medium' | 'long' {
  if (duration < 55) {
    return 'short';
  } else if (duration <= 60) {
    return 'medium';
  } else {
    return 'long';
  }
}

/**
 * Filter stories by duration category
 * 
 * Requirements:
 * - 3.1: THE System SHALL provide a filter for story duration
 * 
 * @param stories - Array of stories to filter
 * @param duration - Duration filter ('all', 'short', 'medium', 'long')
 * @returns Filtered array of stories
 */
export function filterByDuration(stories: Story[], duration: DurationFilter): Story[] {
  if (duration === 'all') {
    return stories;
  }
  return stories.filter((story) => categorizeDuration(story.duration) === duration);
}

/**
 * Determine completion status of a story
 * 
 * Requirements:
 * - 3.2: THE System SHALL provide a filter for completion status (completed, in progress, not started)
 * 
 * @param storyId - Story ID to check
 * @param completedStories - Array of completed story IDs
 * @param inProgressStories - Array of in-progress story IDs
 * @returns Completion status: 'completed', 'in-progress', or 'not-started'
 */
export function getCompletionStatus(
  storyId: number,
  completedStories: number[],
  inProgressStories: number[]
): 'completed' | 'in-progress' | 'not-started' {
  if (completedStories.includes(storyId)) {
    return 'completed';
  }
  if (inProgressStories.includes(storyId)) {
    return 'in-progress';
  }
  return 'not-started';
}

/**
 * Filter stories by completion status
 * 
 * Requirements:
 * - 3.2: THE System SHALL provide a filter for completion status
 * 
 * @param stories - Array of stories to filter
 * @param status - Completion status filter
 * @param completedStories - Array of completed story IDs
 * @param inProgressStories - Array of in-progress story IDs
 * @returns Filtered array of stories
 */
export function filterByCompletionStatus(
  stories: Story[],
  status: CompletionStatus,
  completedStories: number[],
  inProgressStories: number[]
): Story[] {
  if (status === 'all') {
    return stories;
  }
  return stories.filter((story) => {
    const storyStatus = getCompletionStatus(story.id, completedStories, inProgressStories);
    return storyStatus === status;
  });
}

/**
 * Filter stories with advanced filters (category, difficulty, search, duration, completion status, trimester)
 * 
 * Requirements:
 * - 1.3: WHEN a user selects a trimester filter, THE System SHALL display only stories recommended for that trimester
 * - 1.5: THE System SHALL allow stories marked as "any" to appear in all trimester filters
 * - 3.4: THE System SHALL allow combining multiple filters simultaneously
 * 
 * Design Properties:
 * - Property 2: Trimester filter correctness - filtered stories include all stories with that trimester AND all stories marked as 'any'
 * - Property 6: Filter combination correctness - All filtered results satisfy ALL active filter conditions
 * 
 * @param stories - Array of stories to filter
 * @param filterState - Advanced filter state with all filter options
 * @param completedStories - Array of completed story IDs
 * @param inProgressStories - Array of in-progress story IDs
 * @returns Filtered array of stories matching all criteria
 */
export function filterStoriesAdvanced(
  stories: Story[],
  filterState: AdvancedFilterState,
  completedStories: number[],
  inProgressStories: number[]
): Story[] {
  const { 
    selectedCategory, 
    selectedDifficulty, 
    searchTerm, 
    selectedDuration, 
    selectedCompletionStatus,
    selectedTrimester
  } = filterState;
  
  return stories.filter((story) => {
    // Category filter: if not 'all', story must belong to selected category
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    
    // Difficulty filter: if not 'all', story must match selected difficulty
    const matchesDifficulty = selectedDifficulty === 'all' || story.difficulty === selectedDifficulty;
    
    // Search filter: if search term is not empty, story title or description must contain it (case-insensitive)
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const matchesSearch = normalizedSearchTerm === '' || 
      story.title.toLowerCase().includes(normalizedSearchTerm) ||
      story.description.toLowerCase().includes(normalizedSearchTerm);
    
    // Duration filter: if not 'all', story must match duration category
    const matchesDuration = selectedDuration === 'all' || 
      categorizeDuration(story.duration) === selectedDuration;
    
    // Completion status filter: if not 'all', story must match completion status
    const storyStatus = getCompletionStatus(story.id, completedStories, inProgressStories);
    const matchesCompletionStatus = selectedCompletionStatus === 'all' || 
      storyStatus === selectedCompletionStatus;
    
    // Trimester filter: if not 'all', story must match trimester OR be marked as 'any'
    // Requirements 1.3, 1.5
    const matchesTrimester = selectedTrimester === 'all' || 
      story.recommendedTrimester === selectedTrimester || 
      story.recommendedTrimester === 'any';
    
    // All filters must match (AND logic)
    return matchesCategory && matchesDifficulty && matchesSearch && matchesDuration && matchesCompletionStatus && matchesTrimester;
  });
}

/**
 * Count the number of active filters
 * 
 * Requirements:
 * - 3.5: THE System SHALL display the count of matching stories when filters are applied
 * 
 * @param filterState - Advanced filter state
 * @returns Number of active filters (excluding 'all' values and empty search)
 */
export function countActiveFilters(filterState: AdvancedFilterState): number {
  let count = 0;
  if (filterState.selectedCategory !== 'all') count++;
  if (filterState.selectedDifficulty !== 'all') count++;
  if (filterState.searchTerm.trim() !== '') count++;
  if (filterState.selectedDuration !== 'all') count++;
  if (filterState.selectedCompletionStatus !== 'all') count++;
  if (filterState.selectedTrimester !== 'all') count++;
  return count;
}

/**
 * Create a default advanced filter state
 * 
 * @returns Default advanced filter state with no filters applied
 */
export function createDefaultAdvancedFilterState(): AdvancedFilterState {
  return {
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    searchTerm: '',
    selectedDuration: 'all',
    selectedCompletionStatus: 'all',
    selectedTrimester: 'all',
  };
}

export default filterStories;
