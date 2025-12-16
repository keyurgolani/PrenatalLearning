import type { Story, FilterState, CategoryId, DifficultyLevel } from '../types';

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

export default filterStories;
