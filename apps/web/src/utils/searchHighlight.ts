import type { HighlightRange } from '../services/searchService';

/**
 * Search Highlight Utilities
 * 
 * Requirements:
 * - 1.2: Display search results with highlighted matching terms
 * 
 * Design Properties:
 * - Property 2: Search highlight accuracy - highlighted portions contain the search query
 */

/**
 * Find all occurrences of a search term in text and return highlight ranges
 * @param text - The text to search in
 * @param query - The search query (case-insensitive)
 * @returns Array of highlight ranges { start, end }
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
 * Segment text into parts based on highlight ranges
 * Returns an array of segments with isHighlighted flag
 */
export interface TextSegment {
  text: string;
  isHighlighted: boolean;
}

/**
 * Split text into segments based on highlight ranges
 * @param text - The original text
 * @param ranges - Array of highlight ranges
 * @returns Array of text segments with highlight flags
 */
export function segmentText(text: string, ranges: HighlightRange[]): TextSegment[] {
  if (ranges.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  // Sort ranges by start position
  const sortedRanges = [...ranges].sort((a, b) => a.start - b.start);
  
  const segments: TextSegment[] = [];
  let currentIndex = 0;

  for (const range of sortedRanges) {
    // Add non-highlighted text before this range
    if (range.start > currentIndex) {
      segments.push({
        text: text.slice(currentIndex, range.start),
        isHighlighted: false,
      });
    }

    // Add highlighted text
    segments.push({
      text: text.slice(range.start, range.end),
      isHighlighted: true,
    });

    currentIndex = range.end;
  }

  // Add remaining non-highlighted text
  if (currentIndex < text.length) {
    segments.push({
      text: text.slice(currentIndex),
      isHighlighted: false,
    });
  }

  return segments;
}

/**
 * Generate segments for text with a search query
 * Convenience function that combines findHighlightRanges and segmentText
 * @param text - The text to highlight
 * @param query - The search query
 * @returns Array of text segments with highlight flags
 */
export function highlightText(text: string, query: string): TextSegment[] {
  const ranges = findHighlightRanges(text, query);
  return segmentText(text, ranges);
}

export default {
  findHighlightRanges,
  segmentText,
  highlightText,
};
