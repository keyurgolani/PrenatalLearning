/**
 * Interactive Exercise Type Definitions
 * Requirements: 2.1, 6.1, 6.2, 6.3, 6.4, 6.5
 */

// ============================================
// Exercise Type Union
// ============================================

/**
 * All supported interactive exercise types
 */
export type InteractiveExerciseType =
  | 'quiz'
  | 'matching'
  | 'sequencing'
  | 'fill-blank'
  | 'scenario'
  | 'reflection'
  | 'breathing'
  | 'visualization';

// ============================================
// Base Exercise Interface
// ============================================

/**
 * Common properties shared by all exercise types
 */
export interface BaseExercise {
  id: string;
  type: InteractiveExerciseType;
  title: string;
  description: string;
  duration: number; // minutes
  topicId: number;
  guidance?: string;
}

// ============================================
// Quiz Exercise (Requirement 6.1)
// ============================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizExercise extends BaseExercise {
  type: 'quiz';
  questions: QuizQuestion[];
}


// ============================================
// Matching Exercise (Requirement 6.2)
// ============================================

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: MatchingPair[];
  instructions: string;
}

// ============================================
// Sequencing Exercise (Requirement 6.3)
// ============================================

export interface SequenceItem {
  id: string;
  content: string;
  correctPosition: number;
}

export interface SequencingExercise extends BaseExercise {
  type: 'sequencing';
  items: SequenceItem[];
  instructions: string;
}

// ============================================
// Fill-in-the-Blank Exercise (Requirement 6.4)
// ============================================

export interface FillBlankSentence {
  id: string;
  template: string; // e.g., "The Big Bang occurred ___ billion years ago"
  answer: string;
  acceptableAnswers: string[]; // variations that are also correct
  hint?: string;
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentences: FillBlankSentence[];
}

// ============================================
// Scenario Exercise (Requirement 6.5)
// ============================================

export interface ScenarioChoice {
  id: string;
  text: string;
  feedback: string;
  isOptimal: boolean;
}

export interface ScenarioExercise extends BaseExercise {
  type: 'scenario';
  scenario: string;
  choices: ScenarioChoice[];
}

// ============================================
// Reflection Exercise (Requirement 2.2)
// ============================================

export interface ReflectionExercise extends BaseExercise {
  type: 'reflection';
  prompts: string[];
}

// ============================================
// Breathing Exercise (Requirement 2.5)
// ============================================

export interface BreathingPattern {
  inhale: number; // seconds
  hold: number;
  exhale: number;
}

export interface BreathingExercise extends BaseExercise {
  type: 'breathing';
  pattern: BreathingPattern;
  cycles: number;
  prompts: string[];
}

// ============================================
// Visualization Exercise (Requirement 2.4)
// ============================================

export interface VisualizationExercise extends BaseExercise {
  type: 'visualization';
  prompts: string[];
  intervalSeconds?: number;
  audioGuidance?: boolean;
}

// ============================================
// Union Type for All Exercises
// ============================================

export type InteractiveExercise =
  | QuizExercise
  | MatchingExercise
  | SequencingExercise
  | FillBlankExercise
  | ScenarioExercise
  | ReflectionExercise
  | BreathingExercise
  | VisualizationExercise;


// ============================================
// Response Data Interfaces
// ============================================

/**
 * Quiz response data (Requirement 6.1)
 */
export interface QuizResponseData {
  answers: {
    questionId: string;
    selectedIndex: number;
    correct: boolean;
  }[];
}

/**
 * Matching response data (Requirement 6.2)
 */
export interface MatchingResponseData {
  matches: {
    leftId: string;
    rightId: string;
    correct: boolean;
  }[];
}

/**
 * Sequencing response data (Requirement 6.3)
 */
export interface SequencingResponseData {
  sequence: string[]; // item IDs in user's order
  correct: boolean;
}

/**
 * Fill-in-the-blank response data (Requirement 6.4)
 */
export interface FillBlankResponseData {
  answers: {
    sentenceId: string;
    userAnswer: string;
    correct: boolean;
  }[];
}

/**
 * Scenario response data (Requirement 6.5)
 */
export interface ScenarioResponseData {
  selectedChoiceId: string;
}

/**
 * Reflection response data (Requirement 2.2)
 */
export interface ReflectionResponseData {
  responses: {
    promptIndex: number;
    text: string;
  }[];
}

/**
 * Breathing response data (Requirement 2.5)
 */
export interface BreathingResponseData {
  cyclesCompleted: number;
  totalDuration: number; // seconds
}

/**
 * Visualization response data (Requirement 2.4)
 */
export interface VisualizationResponseData {
  promptsViewed: number;
  totalDuration: number; // seconds
}

/**
 * Union type for all response data variants
 */
export type ExerciseResponseData =
  | QuizResponseData
  | MatchingResponseData
  | SequencingResponseData
  | FillBlankResponseData
  | ScenarioResponseData
  | ReflectionResponseData
  | BreathingResponseData
  | VisualizationResponseData;


// ============================================
// Exercise Response Interface (Requirement 3.1, 3.4)
// ============================================

/**
 * Complete exercise response with metadata
 * Persisted to localStorage as JSON
 */
export interface ExerciseResponse {
  exerciseId: string;
  topicId: number;
  timestamp: string; // ISO date string
  type: InteractiveExerciseType;
  data: ExerciseResponseData;
  completed: boolean;
  score?: number; // percentage for scored exercises
}

// ============================================
// Exercise Completion Record (Requirement 3.3)
// ============================================

/**
 * Record of a completed exercise for history tracking
 */
export interface ExerciseCompletionRecord {
  topicId: number;
  exerciseId: string;
  completedAt: string; // ISO date string
  score?: number;
}

// ============================================
// Exercise Storage Data (Requirement 3.4)
// ============================================

/**
 * Complete storage structure for exercise data
 * Serialized as JSON in localStorage
 */
export interface ExerciseStorageData {
  responses: ExerciseResponse[];
  completionHistory: ExerciseCompletionRecord[];
  lastUpdated: string; // ISO date string
}

// ============================================
// Exercise Session Types
// ============================================

/**
 * Result of an exercise session
 */
export interface ExerciseSessionResult {
  topicId: number;
  exercisesCompleted: number;
  totalExercises: number;
  averageScore?: number;
  completedAt: string;
}
