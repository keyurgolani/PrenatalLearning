/**
 * Daily Puzzles Index
 * Central export for all puzzle data
 */

import { lateralThinkingPuzzles } from './lateralThinking';
import { numberSequencePuzzles } from './numberSequences';
import { logicGridPuzzles } from './logicGrids';
import { riddlePuzzles } from './riddles';
import type { DailyPuzzle, DailyPuzzleSet } from '../../../types/daily';

// Export individual puzzle collections
export { lateralThinkingPuzzles } from './lateralThinking';
export { numberSequencePuzzles } from './numberSequences';
export { logicGridPuzzles } from './logicGrids';
export { riddlePuzzles } from './riddles';

/**
 * All puzzles combined
 */
export const allPuzzles: DailyPuzzle[] = [
  ...lateralThinkingPuzzles,
  ...numberSequencePuzzles,
  ...logicGridPuzzles,
  ...riddlePuzzles,
];

/**
 * Get puzzles for a specific date
 * Returns 3 puzzles: easy, medium, hard
 */
export function getPuzzlesForDate(date: Date): DailyPuzzleSet {
  const dateStr = date.toISOString().split('T')[0];
  const dayOfYear = getDayOfYear(date);
  
  const easyPuzzles = allPuzzles.filter(p => p.difficulty === 'easy');
  const mediumPuzzles = allPuzzles.filter(p => p.difficulty === 'medium');
  const hardPuzzles = allPuzzles.filter(p => p.difficulty === 'hard');
  
  const selectedPuzzles: DailyPuzzle[] = [];
  
  if (easyPuzzles.length > 0) {
    selectedPuzzles.push(easyPuzzles[dayOfYear % easyPuzzles.length]);
  }
  
  if (mediumPuzzles.length > 0) {
    selectedPuzzles.push(mediumPuzzles[(dayOfYear + 1) % mediumPuzzles.length]);
  }
  
  if (hardPuzzles.length > 0) {
    selectedPuzzles.push(hardPuzzles[(dayOfYear + 2) % hardPuzzles.length]);
  }
  
  return {
    date: dateStr,
    puzzles: selectedPuzzles,
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
 * Get puzzles by type
 */
export function getPuzzlesByType(type: DailyPuzzle['type']): DailyPuzzle[] {
  return allPuzzles.filter(puzzle => puzzle.type === type);
}

/**
 * Get puzzles by difficulty
 */
export function getPuzzlesByDifficulty(difficulty: DailyPuzzle['difficulty']): DailyPuzzle[] {
  return allPuzzles.filter(puzzle => puzzle.difficulty === difficulty);
}
