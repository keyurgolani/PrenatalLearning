/**
 * Daily Enrichment Content Type Definitions
 * Types for Words, Puzzles, Facts, Brain Teasers, and Mindfulness exercises
 */

// ============================================
// Word of the Day Types
// ============================================

export type WordLanguage = 
  | 'sanskrit' 
  | 'spanish' 
  | 'french' 
  | 'mandarin' 
  | 'hindi' 
  | 'english';

export interface DailyWord {
  id: string;
  word: string;
  language: WordLanguage;
  transliteration?: string;
  pronunciation: string;
  audioUrl?: string;
  meaning: string;
  partOfSpeech: string;
  etymology?: string;
  culturalNote?: string;
  examples: {
    original: string;
    translation: string;
  }[];
  relatedWords?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  dateAdded: string;
}

export interface DailyWordSet {
  date: string;
  words: DailyWord[];
  theme?: string;
}

// ============================================
// Multi-Language Concept Types
// ============================================

/**
 * A concept that can be expressed across multiple languages
 * Allows learning one meaning through different linguistic lenses
 */
export interface MultiLanguageConcept {
  id: string;
  concept: string; // The core meaning/concept in English
  category: 'emotion' | 'nature' | 'philosophy' | 'family' | 'action' | 'quality' | 'time' | 'body';
  description: string; // Deeper explanation of the concept
  translations: ConceptTranslation[];
  culturalInsight?: string; // How different cultures approach this concept
  prenatalConnection?: string; // How this concept relates to pregnancy/baby
  dateAdded: string;
}

export interface ConceptTranslation {
  language: WordLanguage;
  word: string;
  transliteration?: string;
  pronunciation: string;
  nuance?: string; // Language-specific nuance or connotation
  etymology?: string;
  example?: {
    original: string;
    translation: string;
  };
}

export interface DailyConceptSet {
  date: string;
  concepts: MultiLanguageConcept[];
}

// ============================================
// Daily Puzzle Types
// ============================================

export type PuzzleType = 
  | 'logic-grid'
  | 'lateral-thinking'
  | 'number-sequence'
  | 'word-puzzle'
  | 'visual-puzzle'
  | 'riddle';

export interface DailyPuzzle {
  id: string;
  type: PuzzleType;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  hints: string[];
  solution: string;
  explanation: string;
  timeEstimate: number;
  dateAdded: string;
}

export interface DailyPuzzleSet {
  date: string;
  puzzles: DailyPuzzle[];
}


// ============================================
// Daily Facts Types
// ============================================

export type FactCategory = 
  | 'science' 
  | 'history' 
  | 'nature' 
  | 'body' 
  | 'space' 
  | 'psychology' 
  | 'culture';

export interface DailyFact {
  id: string;
  category: FactCategory;
  fact: string;
  source: string;
  sourceUrl?: string;
  learnMore?: string;
  relatedTopicId?: number;
  image?: string;
  dateAdded: string;
}

export interface DailyFactSet {
  date: string;
  facts: DailyFact[];
}

// ============================================
// Brain Teaser Types
// ============================================

export type TeaserType = 
  | 'mathematical'
  | 'verbal'
  | 'spatial'
  | 'memory'
  | 'processing-speed';

export interface BrainTeaser {
  id: string;
  type: TeaserType;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  timeLimit?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface DailyTeaserSet {
  date: string;
  teasers: BrainTeaser[];
}

// ============================================
// Mindfulness Types
// ============================================

export type MindfulnessType = 
  | 'breathing' 
  | 'body-scan' 
  | 'gratitude' 
  | 'visualization' 
  | 'connection';

export interface MindfulnessExercise {
  id: string;
  type: MindfulnessType;
  title: string;
  duration: number;
  instructions: string[];
  audioUrl?: string;
  babyConnection?: string;
}

// ============================================
// Daily Progress Tracking
// ============================================

export interface DailyProgress {
  date: string;
  wordsLearned: string[];
  puzzlesSolved: string[];
  factsRead: string[];
  teasersCompleted: string[];
  mindfulnessCompleted: string[];
}

export interface DailyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalDaysActive: number;
}
