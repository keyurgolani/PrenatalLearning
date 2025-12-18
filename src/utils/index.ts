export {
  filterStories,
  filterByCategory,
  filterByDifficulty,
  searchStories,
  createDefaultFilterState,
  categorizeDuration,
  filterByDuration,
  getCompletionStatus,
  filterByCompletionStatus,
  filterStoriesAdvanced,
  countActiveFilters,
  createDefaultAdvancedFilterState,
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

export {
  hexToRgb,
  getRelativeLuminance,
  calculateContrastRatio,
  meetsWcagAA,
  meetsWcagAALargeText,
  meetsWcagAAA,
} from './contrastUtils';

export {
  findHighlightRanges,
  segmentText,
  highlightText,
  type TextSegment,
} from './searchHighlight';

export {
  DEFAULT_READING_PACE,
  countWords,
  calculateReadingTime,
  getReadingTimeForText,
  getStoryReadingTime,
  getTotalReadingTime,
  formatReadingTime,
  SECTION_LABELS,
  type SectionName,
  type SectionReadingTime,
  type StoryReadingTime,
} from './readingTime';

export {
  getWeekNumber,
  getTrimesterFromWeek,
  calculateTrimester,
  filterStoriesByTrimester,
} from './trimesterUtils';

export {
  splitIntoParagraphs,
  cleanTextForManifest,
  generateAudioFilename,
  generateImageFilename,
  generateAudioManifestTemplate,
  generateImageManifestTemplate,
  getAllSectionNames,
  countTotalParagraphs,
  getParagraphCountsBySection,
} from './manifestGenerator';

export {
  SUPPORTED_AUDIO_FORMATS,
  SUPPORTED_IMAGE_FORMATS,
  isValidAudioFormat,
  isValidImageFormat,
} from './mediaValidation';

export {
  parseImageFilename,
  determineInlineImagePlacements,
  getPositionedImages,
  type InlineImagePlacement,
} from './contentImageMatcher';
