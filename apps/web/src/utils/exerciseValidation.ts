/**
 * Exercise Validation Utilities
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

import type {
  QuizQuestion,
  MatchingPair,
  SequenceItem,
  FillBlankSentence,
} from '../types/exercises';

// ============================================
// Quiz Validation (Requirement 6.1)
// ============================================

/**
 * Result of validating a quiz answer
 */
export interface QuizValidationResult {
  correct: boolean;
  selectedIndex: number;
  correctIndex: number;
}

/**
 * Validates a quiz answer by comparing selected index against correct index
 * @param question - The quiz question with correct answer
 * @param selectedIndex - The index selected by the user
 * @returns Validation result with correctness
 */
export function validateQuizAnswer(
  question: QuizQuestion,
  selectedIndex: number
): QuizValidationResult {
  return {
    correct: selectedIndex === question.correctIndex,
    selectedIndex,
    correctIndex: question.correctIndex,
  };
}

// ============================================
// Matching Validation (Requirement 6.2)
// ============================================

/**
 * A user's match attempt pairing a left item with a right item
 */
export interface UserMatch {
  leftId: string;
  rightId: string;
}

/**
 * Result of validating a single match
 */
export interface MatchValidationResult {
  leftId: string;
  rightId: string;
  correct: boolean;
}

/**
 * Result of validating all matches
 */
export interface MatchingValidationResult {
  results: MatchValidationResult[];
  allCorrect: boolean;
  correctCount: number;
  totalCount: number;
}

/**
 * Validates user matches against defined pairs
 * @param pairs - The correct matching pairs
 * @param userMatches - The user's match attempts
 * @returns Per-pair correctness results
 */
export function validateMatchingPairs(
  pairs: MatchingPair[],
  userMatches: UserMatch[]
): MatchingValidationResult {
  // Create a map of correct pairs (leftId -> rightId based on pair.id)
  const correctPairMap = new Map<string, string>();
  pairs.forEach((pair) => {
    correctPairMap.set(pair.id, pair.id); // left and right share the same pair id
  });

  const results: MatchValidationResult[] = userMatches.map((match) => {
    // Find the pair that matches the leftId
    const leftPair = pairs.find((p) => p.id === match.leftId);
    // Check if the rightId matches the same pair
    const correct = leftPair !== undefined && match.rightId === match.leftId;

    return {
      leftId: match.leftId,
      rightId: match.rightId,
      correct,
    };
  });

  const correctCount = results.filter((r) => r.correct).length;

  return {
    results,
    allCorrect: correctCount === pairs.length && userMatches.length === pairs.length,
    correctCount,
    totalCount: pairs.length,
  };
}

// ============================================
// Sequence Validation (Requirement 6.3)
// ============================================

/**
 * Result of validating a sequence
 */
export interface SequenceValidationResult {
  correct: boolean;
  userSequence: string[];
  correctSequence: string[];
}

/**
 * Validates user sequence against correct positions
 * @param items - The sequence items with correct positions
 * @param userSequence - Array of item IDs in user's order
 * @returns Overall correctness result
 */
export function validateSequence(
  items: SequenceItem[],
  userSequence: string[]
): SequenceValidationResult {
  // Build the correct sequence by sorting items by correctPosition
  const sortedItems = [...items].sort((a, b) => a.correctPosition - b.correctPosition);
  const correctSequence = sortedItems.map((item) => item.id);

  // Check if user sequence matches correct sequence
  const correct =
    userSequence.length === correctSequence.length &&
    userSequence.every((id, index) => id === correctSequence[index]);

  return {
    correct,
    userSequence,
    correctSequence,
  };
}

// ============================================
// Fill-in-the-Blank Validation (Requirement 6.4)
// ============================================

/**
 * Result of validating a fill-in-the-blank answer
 */
export interface FillBlankValidationResult {
  sentenceId: string;
  userAnswer: string;
  correct: boolean;
  correctAnswer: string;
}

/**
 * Validates a fill-in-the-blank answer against exact match and acceptable variations
 * Uses case-insensitive comparison
 * @param sentence - The sentence with correct answer and variations
 * @param userAnswer - The user's input
 * @returns Validation result with correctness
 */
export function validateFillBlank(
  sentence: FillBlankSentence,
  userAnswer: string
): FillBlankValidationResult {
  const normalizedUserAnswer = userAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = sentence.answer.trim().toLowerCase();

  // Check exact match first
  let correct = normalizedUserAnswer === normalizedCorrectAnswer;

  // Check acceptable variations if not exact match
  if (!correct && sentence.acceptableAnswers) {
    correct = sentence.acceptableAnswers.some(
      (variation) => variation.trim().toLowerCase() === normalizedUserAnswer
    );
  }

  return {
    sentenceId: sentence.id,
    userAnswer,
    correct,
    correctAnswer: sentence.answer,
  };
}

/**
 * Validates multiple fill-in-the-blank answers
 * @param sentences - Array of sentences with correct answers
 * @param userAnswers - Map of sentence ID to user answer
 * @returns Array of validation results
 */
export function validateAllFillBlanks(
  sentences: FillBlankSentence[],
  userAnswers: Map<string, string>
): FillBlankValidationResult[] {
  return sentences.map((sentence) => {
    const userAnswer = userAnswers.get(sentence.id) || '';
    return validateFillBlank(sentence, userAnswer);
  });
}
