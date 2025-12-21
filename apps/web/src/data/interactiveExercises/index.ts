/**
 * Interactive Exercises Index
 * 
 * Central export for all topic-specific interactive exercises
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7
 */

export * from './scienceExercises';
export * from './mathExercises';
export * from './biologyExercises';
export * from './psychologyExercises';
export * from './languageExercises';
export * from './financeExercises';
export * from './societyExercises';

import { scienceExercises } from './scienceExercises';
import { mathExercises } from './mathExercises';
import { biologyExercises } from './biologyExercises';
import { psychologyExercises } from './psychologyExercises';
import { languageExercises } from './languageExercises';
import { financeExercises } from './financeExercises';
import { societyExercises } from './societyExercises';
import type { InteractiveExercise } from '../../types/exercises';

/**
 * All interactive exercises mapped by topic ID
 */
export const interactiveExercisesByTopic: Record<number, InteractiveExercise[]> = {
  // Science topics (IDs 1-4)
  ...scienceExercises,
  // Math topics (IDs 13-16)
  ...mathExercises,
  // Biology topics (IDs 9-12)
  ...biologyExercises,
  // Psychology topics (IDs 17-20)
  ...psychologyExercises,
  // Language topics (IDs 21-24)
  ...languageExercises,
  // Finance topics (IDs 25-28)
  ...financeExercises,
  // Society topics (IDs 29-32)
  ...societyExercises,
};

/**
 * Get interactive exercises for a specific topic
 */
export function getInteractiveExercises(topicId: number): InteractiveExercise[] {
  return interactiveExercisesByTopic[topicId] || [];
}

/**
 * Check if a topic has interactive exercises
 */
export function hasInteractiveExercises(topicId: number): boolean {
  return topicId in interactiveExercisesByTopic && interactiveExercisesByTopic[topicId].length > 0;
}
