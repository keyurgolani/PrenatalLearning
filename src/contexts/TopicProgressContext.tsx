/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

/**
 * TopicProgressContext for managing topic learning progress
 * Requirements: 7.7 - Resume from last incomplete step when returning to a topic
 */

export type LearningStep = 'overview' | 'core-content' | 'practice' | 'integration' | 'exercises';

export const LEARNING_STEPS: LearningStep[] = [
  'overview',
  'core-content',
  'practice',
  'integration',
  'exercises',
];

export const STEP_LABELS: Record<LearningStep, string> = {
  'overview': 'Overview',
  'core-content': 'Core Content',
  'practice': 'Practice',
  'integration': 'Integration',
  'exercises': 'Exercises',
};

export interface TopicProgress {
  storyId: number;
  currentStep: LearningStep;
  completedSteps: LearningStep[];
  lastAccessedAt: string;
}

export interface TopicProgressContextValue {
  getTopicProgress: (storyId: number) => TopicProgress | null;
  setCurrentStep: (storyId: number, step: LearningStep) => void;
  completeStep: (storyId: number, step: LearningStep) => void;
  resetTopicProgress: (storyId: number) => void;
  isStepCompleted: (storyId: number, step: LearningStep) => boolean;
  getAllProgress: () => Record<number, TopicProgress>;
}

const TOPIC_PROGRESS_STORAGE_KEY = 'prenatal-learning-topic-progress';

const TopicProgressContext = createContext<TopicProgressContextValue | undefined>(undefined);

/**
 * Load topic progress from localStorage
 */
function loadTopicProgress(): Record<number, TopicProgress> {
  try {
    const stored = localStorage.getItem(TOPIC_PROGRESS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the structure
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<number, TopicProgress>;
      }
    }
    return {};
  } catch {
    console.warn('Failed to load topic progress from localStorage');
    return {};
  }
}


/**
 * Save topic progress to localStorage
 */
function saveTopicProgress(progress: Record<number, TopicProgress>): void {
  try {
    localStorage.setItem(TOPIC_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('Unable to save topic progress to localStorage');
  }
}

/**
 * Validate and repair corrupted progress data
 */
function validateProgress(progress: TopicProgress): TopicProgress {
  const validSteps = new Set(LEARNING_STEPS);
  
  // Ensure currentStep is valid
  const currentStep = validSteps.has(progress.currentStep) 
    ? progress.currentStep 
    : 'overview';
  
  // Filter out invalid completed steps
  const completedSteps = (progress.completedSteps || [])
    .filter(step => validSteps.has(step));
  
  return {
    ...progress,
    currentStep,
    completedSteps,
    lastAccessedAt: progress.lastAccessedAt || new Date().toISOString(),
  };
}

interface TopicProgressProviderProps {
  children: React.ReactNode;
}

/**
 * TopicProgressProvider component that manages topic progress state and persistence
 * Requirements: 7.7 - Resume from last incomplete step when returning to a topic
 */
export function TopicProgressProvider({ children }: TopicProgressProviderProps): React.ReactElement {
  const [progressMap, setProgressMap] = useState<Record<number, TopicProgress>>(() => {
    return loadTopicProgress();
  });

  // Persist to localStorage whenever progress changes
  useEffect(() => {
    saveTopicProgress(progressMap);
  }, [progressMap]);

  const getTopicProgress = useCallback((storyId: number): TopicProgress | null => {
    const progress = progressMap[storyId];
    if (!progress) return null;
    return validateProgress(progress);
  }, [progressMap]);

  const setCurrentStep = useCallback((storyId: number, step: LearningStep) => {
    setProgressMap(prev => {
      const existing = prev[storyId];
      const updated: TopicProgress = {
        storyId,
        currentStep: step,
        completedSteps: existing?.completedSteps || [],
        lastAccessedAt: new Date().toISOString(),
      };
      return { ...prev, [storyId]: updated };
    });
  }, []);

  const completeStep = useCallback((storyId: number, step: LearningStep) => {
    setProgressMap(prev => {
      const existing = prev[storyId];
      const completedSteps = existing?.completedSteps || [];
      
      // Add step to completed if not already there
      const newCompletedSteps = completedSteps.includes(step)
        ? completedSteps
        : [...completedSteps, step];
      
      // Move to next step if available
      const currentIndex = LEARNING_STEPS.indexOf(step);
      const nextStep = currentIndex < LEARNING_STEPS.length - 1
        ? LEARNING_STEPS[currentIndex + 1]
        : step;
      
      const updated: TopicProgress = {
        storyId,
        currentStep: nextStep,
        completedSteps: newCompletedSteps,
        lastAccessedAt: new Date().toISOString(),
      };
      return { ...prev, [storyId]: updated };
    });
  }, []);

  const resetTopicProgress = useCallback((storyId: number) => {
    setProgressMap(prev => {
      const { [storyId]: _removed, ...rest } = prev;
      void _removed; // Explicitly mark as intentionally unused
      return rest;
    });
  }, []);

  const isStepCompleted = useCallback((storyId: number, step: LearningStep): boolean => {
    const progress = progressMap[storyId];
    return progress?.completedSteps?.includes(step) || false;
  }, [progressMap]);

  const getAllProgress = useCallback((): Record<number, TopicProgress> => {
    return progressMap;
  }, [progressMap]);

  const contextValue = useMemo<TopicProgressContextValue>(() => ({
    getTopicProgress,
    setCurrentStep,
    completeStep,
    resetTopicProgress,
    isStepCompleted,
    getAllProgress,
  }), [getTopicProgress, setCurrentStep, completeStep, resetTopicProgress, isStepCompleted, getAllProgress]);

  return (
    <TopicProgressContext.Provider value={contextValue}>
      {children}
    </TopicProgressContext.Provider>
  );
}

/**
 * Hook to access topic progress context
 * @throws Error if used outside of TopicProgressProvider
 */
export function useTopicProgress(): TopicProgressContextValue {
  const context = useContext(TopicProgressContext);
  if (context === undefined) {
    throw new Error('useTopicProgress must be used within a TopicProgressProvider');
  }
  return context;
}

export default TopicProgressProvider;
