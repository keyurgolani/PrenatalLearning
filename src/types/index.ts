import type { Trimester } from './trimester';

/**
 * Category identifier type for story categorization
 */
export type CategoryId =
  | 'all'
  | 'science'
  | 'technology'
  | 'biology'
  | 'math'
  | 'psychology'
  | 'language'
  | 'finance'
  | 'society';

/**
 * Difficulty level classification for stories
 */
export type DifficultyLevel = 'foundational' | 'intermediate' | 'advanced';

/**
 * Category definition with display properties
 */
export interface Category {
  id: CategoryId;
  name: string;
  color: string; // Tailwind color class
}

/**
 * Exercise type classification
 */
export type ExerciseType = 'reflection' | 'thought-experiment' | 'discussion' | 'creative' | 'visualization' | 'breathing';

/**
 * Topic-specific exercise for deeper engagement
 */
export interface TopicExercise {
  type: ExerciseType;
  title: string;
  description: string;
  prompts: string[];
}

/**
 * Full story content with narrative sections
 */
export interface StoryContent {
  narrative: {
    introduction: string;      // 5-minute opening
    coreContent: string;       // 30-minute main content
    interactiveSection: string; // 15-minute guided activities
    integration: string;       // 10-minute closing
  };
  keyConcepts: string[];       // 3-5 core truths
  analogies: string[];         // Accessible metaphors
  exercises: TopicExercise[];
}

/**
 * Story definition with metadata and content
 */
export interface Story {
  id: number;
  title: string;
  category: CategoryId;
  duration: number; // minutes (50-70)
  description: string;
  difficulty: DifficultyLevel;
  content: StoryContent;
  recommendedTrimester: Trimester;
}

/**
 * Duration filter categories for story filtering
 * - short: < 55 minutes
 * - medium: 55-60 minutes
 * - long: > 60 minutes
 */
export type DurationFilter = 'all' | 'short' | 'medium' | 'long';

/**
 * Completion status filter for story filtering
 */
export type CompletionStatus = 'all' | 'completed' | 'in-progress' | 'not-started';

/**
 * Filter state for story library
 */
export interface FilterState {
  selectedCategory: CategoryId;
  searchTerm: string;
  selectedDifficulty: DifficultyLevel | 'all';
}

/**
 * Advanced filter state with additional filtering options
 * Requirements: 1.2, 1.3, 3.1, 3.2, 3.4
 */
export interface AdvancedFilterState extends FilterState {
  selectedDuration: DurationFilter;
  selectedCompletionStatus: CompletionStatus;
  selectedTrimester: Trimester | 'all';
}

/**
 * Progress tracking state
 */
export interface ProgressState {
  completedStories: number[];
}

/**
 * Storage service interface for persistence
 */
export interface StorageService {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

/**
 * External resource type classification
 */
export type ExternalResourceType = 'video' | 'article' | 'tutorial' | 'interactive';

/**
 * External resource for curated third-party educational content
 */
export interface ExternalResource {
  id: string;
  title: string;
  source: string;
  type: ExternalResourceType;
  url: string;
  embedUrl?: string; // For embeddable content (e.g., YouTube embed URLs)
  thumbnailUrl?: string;
  description?: string;
}

// Re-export all exercise types
export * from './exercises';

// Re-export theme types
export * from './theme';

// Re-export trimester types
export * from './trimester';

// Re-export streak types
export * from './streak';

// Re-export kick types
export * from './kick';

// Re-export journal types
export * from './journal';

// Re-export dashboard types
export * from './dashboard';

// Re-export media types
export * from './media';
