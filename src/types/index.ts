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
}

/**
 * Filter state for story library
 */
export interface FilterState {
  selectedCategory: CategoryId;
  searchTerm: string;
  selectedDifficulty: DifficultyLevel | 'all';
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
