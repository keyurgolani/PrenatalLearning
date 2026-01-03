/**
 * Daily Words Index
 * Central export for all word data across languages
 */

import { sanskritWords } from './sanskrit';
import { spanishWords } from './spanish';
import { frenchWords } from './french';
import { englishAdvancedWords } from './englishAdvanced';
import type { DailyWord, DailyWordSet } from '../../../types/daily';

// Export individual language collections
export { sanskritWords } from './sanskrit';
export { spanishWords } from './spanish';
export { frenchWords } from './french';
export { englishAdvancedWords } from './englishAdvanced';

// Export multi-language concepts
export { multiLanguageConcepts, getConceptsForDate, searchConcepts } from './concepts';

/**
 * All words combined
 */
export const allWords: DailyWord[] = [
  ...sanskritWords,
  ...spanishWords,
  ...frenchWords,
  ...englishAdvancedWords,
];

/**
 * Get words for a specific date
 * Uses a deterministic algorithm based on date to select words
 */
export function getWordsForDate(date: Date): DailyWordSet {
  const dateStr = date.toISOString().split('T')[0];
  const dayOfYear = getDayOfYear(date);
  
  // Select 4 words: one from each language category
  const selectedWords: DailyWord[] = [];
  
  // Sanskrit word
  if (sanskritWords.length > 0) {
    selectedWords.push(sanskritWords[dayOfYear % sanskritWords.length]);
  }
  
  // Spanish word
  if (spanishWords.length > 0) {
    selectedWords.push(spanishWords[(dayOfYear + 1) % spanishWords.length]);
  }
  
  // French word
  if (frenchWords.length > 0) {
    selectedWords.push(frenchWords[(dayOfYear + 2) % frenchWords.length]);
  }
  
  // English advanced word
  if (englishAdvancedWords.length > 0) {
    selectedWords.push(englishAdvancedWords[(dayOfYear + 3) % englishAdvancedWords.length]);
  }
  
  return {
    date: dateStr,
    words: selectedWords,
  };
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Search words by term
 */
export function searchWords(term: string): DailyWord[] {
  const lowerTerm = term.toLowerCase();
  return allWords.filter(word => 
    word.word.toLowerCase().includes(lowerTerm) ||
    word.meaning.toLowerCase().includes(lowerTerm) ||
    word.transliteration?.toLowerCase().includes(lowerTerm)
  );
}

/**
 * Get words by language
 */
export function getWordsByLanguage(language: DailyWord['language']): DailyWord[] {
  return allWords.filter(word => word.language === language);
}

/**
 * Get words by difficulty
 */
export function getWordsByDifficulty(difficulty: DailyWord['difficulty']): DailyWord[] {
  return allWords.filter(word => word.difficulty === difficulty);
}
