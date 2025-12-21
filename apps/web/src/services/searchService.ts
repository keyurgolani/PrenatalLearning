import type { Story } from '../types';
import { stories } from '../data/stories';
import { categories } from '../data/categories';

/**
 * Search Service for the Prenatal Learning Hub
 * 
 * Requirements:
 * - 1.1: Search across story titles, descriptions, key concepts, and analogies
 * - 1.3: Rank search results by relevance (title matches first, then description, then content)
 * 
 * Design Properties:
 * - Property 1: Search relevance ranking - title matches > description matches > content matches
 * - Property 2: Search highlight accuracy - highlighted portions contain the search query
 */

// Relevance score weights for different match locations
const RELEVANCE_WEIGHTS = {
  title: 100,
  description: 50,
  keyConcepts: 30,
  analogies: 20,
};

const RECENT_SEARCHES_KEY = 'prenatal-recent-searches';
const MAX_RECENT_SEARCHES = 10;
const MAX_SUGGESTIONS = 5;

export interface HighlightRange {
  start: number;
  end: number;
}

export interface MatchedField {
  field: 'title' | 'description' | 'keyConcepts' | 'analogies';
  matchedText: string;
  highlightRanges: HighlightRange[];
}

export interface SearchResult {
  story: Story;
  relevanceScore: number;
  matchedFields: MatchedField[];
}

export interface SearchSuggestion {
  type: 'story' | 'category' | 'concept' | 'recent';
  text: string;
  storyId?: number;
  categoryId?: string;
}

export interface RecentSearchesData {
  searches: string[];
  lastUpdated: string;
}


/**
 * Find all occurrences of a search term in text and return highlight ranges
 * @param text - The text to search in
 * @param query - The search query (case-insensitive)
 * @returns Array of highlight ranges [start, end]
 */
export function findHighlightRanges(text: string, query: string): HighlightRange[] {
  if (!query.trim()) return [];
  
  const ranges: HighlightRange[] = [];
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  
  let startIndex = 0;
  let index: number;
  
  while ((index = lowerText.indexOf(lowerQuery, startIndex)) !== -1) {
    ranges.push({
      start: index,
      end: index + lowerQuery.length,
    });
    startIndex = index + 1;
  }
  
  return ranges;
}

/**
 * Check if text contains the search query (case-insensitive)
 */
function textContainsQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase().trim());
}

/**
 * Calculate relevance score and matched fields for a story
 */
function calculateRelevance(story: Story, query: string): { score: number; matchedFields: MatchedField[] } {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return { score: 0, matchedFields: [] };
  }

  let score = 0;
  const matchedFields: MatchedField[] = [];

  // Check title
  if (textContainsQuery(story.title, normalizedQuery)) {
    score += RELEVANCE_WEIGHTS.title;
    matchedFields.push({
      field: 'title',
      matchedText: story.title,
      highlightRanges: findHighlightRanges(story.title, normalizedQuery),
    });
  }

  // Check description
  if (textContainsQuery(story.description, normalizedQuery)) {
    score += RELEVANCE_WEIGHTS.description;
    matchedFields.push({
      field: 'description',
      matchedText: story.description,
      highlightRanges: findHighlightRanges(story.description, normalizedQuery),
    });
  }

  // Check key concepts
  const matchingConcepts = story.content.keyConcepts.filter(concept => 
    textContainsQuery(concept, normalizedQuery)
  );
  if (matchingConcepts.length > 0) {
    score += RELEVANCE_WEIGHTS.keyConcepts * matchingConcepts.length;
    matchingConcepts.forEach(concept => {
      matchedFields.push({
        field: 'keyConcepts',
        matchedText: concept,
        highlightRanges: findHighlightRanges(concept, normalizedQuery),
      });
    });
  }

  // Check analogies
  const matchingAnalogies = story.content.analogies.filter(analogy => 
    textContainsQuery(analogy, normalizedQuery)
  );
  if (matchingAnalogies.length > 0) {
    score += RELEVANCE_WEIGHTS.analogies * matchingAnalogies.length;
    matchingAnalogies.forEach(analogy => {
      matchedFields.push({
        field: 'analogies',
        matchedText: analogy,
        highlightRanges: findHighlightRanges(analogy, normalizedQuery),
      });
    });
  }

  return { score, matchedFields };
}


/**
 * Search stories across titles, descriptions, key concepts, and analogies
 * Returns results ranked by relevance score
 * 
 * @param query - Search query string
 * @param storyList - Optional array of stories to search (defaults to all stories)
 * @returns Array of search results sorted by relevance score (highest first)
 */
export function search(query: string, storyList: Story[] = stories): SearchResult[] {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const story of storyList) {
    const { score, matchedFields } = calculateRelevance(story, normalizedQuery);
    if (score > 0) {
      results.push({
        story,
        relevanceScore: score,
        matchedFields,
      });
    }
  }

  // Sort by relevance score (highest first)
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Get all unique key concepts from all stories
 */
function getAllKeyConcepts(storyList: Story[] = stories): string[] {
  const conceptSet = new Set<string>();
  for (const story of storyList) {
    for (const concept of story.content.keyConcepts) {
      conceptSet.add(concept);
    }
  }
  return Array.from(conceptSet);
}

/**
 * Get search suggestions based on query
 * Returns up to 5 suggestions from story titles, categories, and key concepts
 * 
 * @param query - Search query string
 * @param storyList - Optional array of stories to search (defaults to all stories)
 * @returns Array of search suggestions (max 5)
 */
export function getSuggestions(query: string, storyList: Story[] = stories): SearchSuggestion[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return [];
  }

  const suggestions: SearchSuggestion[] = [];

  // Add matching story titles
  for (const story of storyList) {
    if (story.title.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({
        type: 'story',
        text: story.title,
        storyId: story.id,
      });
    }
    if (suggestions.length >= MAX_SUGGESTIONS) break;
  }

  // Add matching categories
  if (suggestions.length < MAX_SUGGESTIONS) {
    for (const category of categories) {
      if (category.id !== 'all' && category.name.toLowerCase().includes(normalizedQuery)) {
        suggestions.push({
          type: 'category',
          text: category.name,
          categoryId: category.id,
        });
      }
      if (suggestions.length >= MAX_SUGGESTIONS) break;
    }
  }

  // Add matching key concepts
  if (suggestions.length < MAX_SUGGESTIONS) {
    const allConcepts = getAllKeyConcepts(storyList);
    for (const concept of allConcepts) {
      if (concept.toLowerCase().includes(normalizedQuery)) {
        // Avoid duplicates
        if (!suggestions.some(s => s.text.toLowerCase() === concept.toLowerCase())) {
          suggestions.push({
            type: 'concept',
            text: concept,
          });
        }
      }
      if (suggestions.length >= MAX_SUGGESTIONS) break;
    }
  }

  return suggestions.slice(0, MAX_SUGGESTIONS);
}

/**
 * Get recent searches from localStorage
 * @returns Array of recent search strings (most recent first)
 */
export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!data) return [];
    
    const parsed: RecentSearchesData = JSON.parse(data);
    return parsed.searches || [];
  } catch {
    return [];
  }
}

/**
 * Add a search query to recent searches
 * @param query - Search query to add
 */
export function addRecentSearch(query: string): void {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return;

  try {
    const searches = getRecentSearches();
    
    // Remove if already exists (to move to front)
    const filtered = searches.filter(s => s.toLowerCase() !== normalizedQuery.toLowerCase());
    
    // Add to front
    filtered.unshift(normalizedQuery);
    
    // Keep only max recent searches
    const trimmed = filtered.slice(0, MAX_RECENT_SEARCHES);
    
    const data: RecentSearchesData = {
      searches: trimmed,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is not available
  }
}

/**
 * Clear all recent searches
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Export the search service interface
export const searchService = {
  search,
  getSuggestions,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  findHighlightRanges,
};

export default searchService;
