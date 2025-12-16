export {
  filterStories,
  filterByCategory,
  filterByDifficulty,
  searchStories,
  createDefaultFilterState,
} from './filterStories';

export {
  calculateProgress,
  toggleCompletion,
  isStoryCompleted,
  getCompletedCount,
} from './progressUtils';

export {
  validateQuizAnswer,
  validateMatchingPairs,
  validateSequence,
  validateFillBlank,
  validateAllFillBlanks,
  type QuizValidationResult,
  type UserMatch,
  type MatchValidationResult,
  type MatchingValidationResult,
  type SequenceValidationResult,
  type FillBlankValidationResult,
} from './exerciseValidation';
