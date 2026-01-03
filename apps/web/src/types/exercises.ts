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
  | 'visualization'
  | 'interactive-simulation'
  | 'logic-puzzle'
  | 'builder'
  | 'pattern-analysis'
  | 'guided-practice';

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
// Interactive Simulation Exercise (NEW)
// ============================================

export interface SimulationVariable {
  name: string;
  label: string;
  type: 'slider' | 'toggle' | 'select';
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

export interface SimulationExplanation {
  condition: string;
  text: string;
}

export interface InteractiveSimulationExercise extends BaseExercise {
  type: 'interactive-simulation';
  simulationType: 'physics' | 'network' | 'neural' | 'probability' | 'wave';
  variables: SimulationVariable[];
  explanations: SimulationExplanation[];
  canvasWidth?: number;
  canvasHeight?: number;
}

// ============================================
// Logic Puzzle Exercise (NEW)
// ============================================

export interface LogicClue {
  id: string;
  text: string;
  hint?: string;
}

export interface LogicPuzzleExercise extends BaseExercise {
  type: 'logic-puzzle';
  puzzleType: 'grid' | 'sequence' | 'elimination' | 'lateral';
  scenario: string;
  clues: LogicClue[];
  grid?: {
    rows: string[];
    columns: string[];
    categories?: string[];
  };
  solution: Record<string, string>;
  difficulty: 'easy' | 'medium' | 'hard';
  successMessage: string;
}

// ============================================
// Builder Exercise (NEW)
// ============================================

export interface BuilderComponent {
  id: string;
  label: string;
  type: 'input' | 'select' | 'textarea' | 'drag-drop';
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  helpText?: string;
}

export interface BuilderExample {
  inputs: Record<string, string>;
  output: string;
  explanation: string;
}

export interface BuilderExercise extends BaseExercise {
  type: 'builder';
  builderType: 'text' | 'visual' | 'code' | 'diagram';
  instructions: string;
  components: BuilderComponent[];
  template: string;
  examples: BuilderExample[];
  previewEnabled: boolean;
  successCriteria: string[];
}

// ============================================
// Pattern Analysis Exercise (NEW)
// ============================================

export interface PatternDataItem {
  value: string | number;
  image?: string;
  metadata?: Record<string, string>;
}

export interface AnalysisStep {
  prompt: string;
  expectedInsight: string;
  hint?: string;
  inputType: 'text' | 'select' | 'multiple-choice';
  options?: string[];
}

export interface PatternAnalysisExercise extends BaseExercise {
  type: 'pattern-analysis';
  dataType: 'numerical' | 'visual' | 'behavioral' | 'textual';
  dataset: PatternDataItem[];
  hiddenPattern: string;
  analysisSteps: AnalysisStep[];
  patternTypes: ('sequence' | 'grouping' | 'relationship' | 'anomaly')[];
  reflection: string;
  revealAnimation?: boolean;
}

// ============================================
// Guided Practice Exercise (NEW)
// ============================================

export interface PracticeStep {
  id: string;
  instruction: string;
  duration: number;
  audioUrl?: string;
  visualGuide?: 'breathing-circle' | 'progress-bar' | 'timer' | 'none';
  checkpoint?: {
    question: string;
    options: string[];
    feedback: Record<string, string>;
  };
  transitionText?: string;
}

export interface GuidedPracticeExercise extends BaseExercise {
  type: 'guided-practice';
  practiceType: 'meditation' | 'breathing' | 'visualization' | 'physical' | 'mental';
  totalDuration: number;
  steps: PracticeStep[];
  backgroundAudioUrl?: string;
  completionReflection: string[];
  canPause: boolean;
  canSkip: boolean;
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
  | VisualizationExercise
  | InteractiveSimulationExercise
  | LogicPuzzleExercise
  | BuilderExercise
  | PatternAnalysisExercise
  | GuidedPracticeExercise;


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
 * Interactive Simulation response data (NEW)
 */
export interface InteractiveSimulationResponseData {
  variableChanges: { name: string; value: number | string | boolean }[];
  totalDuration: number;
  explanationsViewed: string[];
}

/**
 * Logic Puzzle response data (NEW)
 */
export interface LogicPuzzleResponseData {
  attempts: number;
  hintsUsed: number;
  solved: boolean;
  solutionTime: number;
}

/**
 * Builder response data (NEW)
 */
export interface BuilderResponseData {
  inputs: Record<string, string>;
  output: string;
  criteriaMatched: string[];
}

/**
 * Pattern Analysis response data (NEW)
 */
export interface PatternAnalysisResponseData {
  stepResponses: { stepIndex: number; response: string; correct: boolean }[];
  patternIdentified: boolean;
}

/**
 * Guided Practice response data (NEW)
 */
export interface GuidedPracticeResponseData {
  stepsCompleted: number;
  totalSteps: number;
  checkpointResponses: { stepId: string; response: string }[];
  totalDuration: number;
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
  | VisualizationResponseData
  | InteractiveSimulationResponseData
  | LogicPuzzleResponseData
  | BuilderResponseData
  | PatternAnalysisResponseData
  | GuidedPracticeResponseData;


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
