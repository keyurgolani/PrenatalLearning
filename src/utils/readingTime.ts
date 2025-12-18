/**
 * Reading Time Utility
 * 
 * Calculates estimated reading time based on word count and reading pace.
 * 
 * Requirements:
 * - 9.1: Calculate and display estimated reading time for each story section
 * - 9.2: Base reading time on word count using an average reading speed of 200 words per minute
 * - 9.5: Adjust reading time estimates based on user's selected reading pace if available
 */

import type { Story, StoryContent } from '../types';

/**
 * Default reading pace in words per minute
 * Requirements: 9.2 - Average reading speed of 200 words per minute
 */
export const DEFAULT_READING_PACE = 200;

/**
 * Count words in a text string
 * @param text - The text to count words in
 * @returns Number of words in the text
 */
export function countWords(text: string): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Trim and split by whitespace, filter out empty strings
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  return words.length;
}

/**
 * Calculate reading time in minutes from word count
 * Requirements: 9.1, 9.2, 9.5
 * 
 * @param wordCount - Number of words to read
 * @param readingPace - Words per minute (default: 200)
 * @returns Estimated reading time in minutes (rounded up)
 */
export function calculateReadingTime(wordCount: number, readingPace: number = DEFAULT_READING_PACE): number {
  if (wordCount <= 0 || readingPace <= 0) {
    return 0;
  }
  
  // Round up to nearest minute
  return Math.ceil(wordCount / readingPace);
}

/**
 * Calculate reading time for a text string
 * @param text - The text to calculate reading time for
 * @param readingPace - Words per minute (default: 200)
 * @returns Estimated reading time in minutes
 */
export function getReadingTimeForText(text: string, readingPace: number = DEFAULT_READING_PACE): number {
  const wordCount = countWords(text);
  return calculateReadingTime(wordCount, readingPace);
}

/**
 * Section names for story content
 */
export type SectionName = 'introduction' | 'coreContent' | 'interactiveSection' | 'integration';

/**
 * Section reading time information
 */
export interface SectionReadingTime {
  name: SectionName;
  label: string;
  wordCount: number;
  readingTimeMinutes: number;
}

/**
 * Story reading time information
 */
export interface StoryReadingTime {
  totalWordCount: number;
  totalReadingTimeMinutes: number;
  sections: SectionReadingTime[];
}

/**
 * Section labels for display
 */
export const SECTION_LABELS: Record<SectionName, string> = {
  introduction: 'Introduction',
  coreContent: 'Core Content',
  interactiveSection: 'Interactive Section',
  integration: 'Integration',
};

/**
 * Calculate reading times for all sections of a story
 * Requirements: 9.1, 9.3, 9.4
 * 
 * @param content - Story content with narrative sections
 * @param readingPace - Words per minute (default: 200)
 * @returns Reading time information for the story and each section
 */
export function getStoryReadingTime(content: StoryContent, readingPace: number = DEFAULT_READING_PACE): StoryReadingTime {
  const sectionNames: SectionName[] = ['introduction', 'coreContent', 'interactiveSection', 'integration'];
  
  const sections: SectionReadingTime[] = sectionNames.map(name => {
    const text = content.narrative[name];
    const wordCount = countWords(text);
    const readingTimeMinutes = calculateReadingTime(wordCount, readingPace);
    
    return {
      name,
      label: SECTION_LABELS[name],
      wordCount,
      readingTimeMinutes,
    };
  });
  
  const totalWordCount = sections.reduce((sum, section) => sum + section.wordCount, 0);
  const totalReadingTimeMinutes = calculateReadingTime(totalWordCount, readingPace);
  
  return {
    totalWordCount,
    totalReadingTimeMinutes,
    sections,
  };
}

/**
 * Get total reading time for a story
 * Requirements: 9.3 - Display total story reading time on story cards
 * 
 * @param story - The story to calculate reading time for
 * @param readingPace - Words per minute (default: 200)
 * @returns Total reading time in minutes
 */
export function getTotalReadingTime(story: Story, readingPace: number = DEFAULT_READING_PACE): number {
  const { totalReadingTimeMinutes } = getStoryReadingTime(story.content, readingPace);
  return totalReadingTimeMinutes;
}

/**
 * Format reading time for display
 * @param minutes - Reading time in minutes
 * @returns Formatted string (e.g., "5 min", "1 hr 15 min")
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) {
    return '< 1 min';
  }
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return hours === 1 ? '1 hr' : `${hours} hrs`;
  }
  
  return hours === 1 
    ? `1 hr ${remainingMinutes} min`
    : `${hours} hrs ${remainingMinutes} min`;
}
