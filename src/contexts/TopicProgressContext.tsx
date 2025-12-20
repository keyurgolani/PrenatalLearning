/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

/**
 * TopicProgressContext for managing topic learning progress
 * Requirements: 7.7 - Resume from last incomplete step when returning to a topic
 * 
 * For logged-in users: Progress is persisted to the server
 * For guests: Progress is stored in localStorage
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
 * Save topic progress to server (for logged-in users)
 */
async function saveProgressToServer(progress: Record<number, TopicProgress>): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topicProgress: progress,
      }),
    });
    
    if (!response.ok) {
      console.warn('Failed to save topic progress to server');
    }
  } catch (err) {
    console.warn('Failed to save topic progress to server:', err);
  }
}

/**
 * Load topic progress from server (for logged-in users)
 * Returns the progress map from server, or empty object if none exists
 * Returns null only on error
 */
async function loadProgressFromServer(): Promise<Record<number, TopicProgress> | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/preferences`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      // Return the progress from server, or empty object if null/undefined
      return (data.preferences?.topicProgress as Record<number, TopicProgress>) || {};
    }
    return null;
  } catch (err) {
    console.warn('Failed to load topic progress from server:', err);
    return null;
  }
}

/**
 * Validate and repair corrupted progress data
 */
function validateProgress(progress: TopicProgress): TopicProgress {
  const validSteps = new Set(LEARNING_STEPS);
  
  const currentStep = validSteps.has(progress.currentStep as LearningStep) 
    ? progress.currentStep 
    : 'overview';
  
  const completedSteps = (progress.completedSteps || [])
    .filter(step => validSteps.has(step as LearningStep)) as LearningStep[];
  
  return {
    ...progress,
    currentStep: currentStep as LearningStep,
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
 * 
 * For logged-in users: Syncs progress with server
 * For guests: Uses localStorage
 */
export function TopicProgressProvider({ children }: TopicProgressProviderProps): React.ReactElement {
  const { isAuthenticated } = useAuth();
  const [progressMap, setProgressMap] = useState<Record<number, TopicProgress>>(() => {
    return loadTopicProgress();
  });
  const hasLoadedFromServer = useRef(false);
  const previousAuthState = useRef(isAuthenticated);
  // Use a ref to track current auth state for use in callbacks to avoid stale closures
  const isAuthenticatedRef = useRef(isAuthenticated);
  
  // Keep the ref in sync with the current auth state
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Load progress from server when user logs in and merge with localStorage data
  useEffect(() => {
    // User just logged in (was not authenticated, now is)
    if (isAuthenticated && !previousAuthState.current && !hasLoadedFromServer.current) {
      // Get current localStorage data before loading from server
      const localData = loadTopicProgress();
      
      loadProgressFromServer().then((serverProgress) => {
        if (serverProgress !== null) {
          // Merge localStorage data with server data
          // For each topic, keep the one with more progress (more completed steps)
          const mergedProgress: Record<number, TopicProgress> = { ...serverProgress };
          let hasNewData = false;
          
          for (const [storyIdStr, localProgress] of Object.entries(localData)) {
            const storyId = Number(storyIdStr);
            const serverProgressForTopic = serverProgress[storyId];
            
            if (!serverProgressForTopic) {
              // Topic doesn't exist on server, add it
              mergedProgress[storyId] = localProgress;
              hasNewData = true;
            } else {
              // Topic exists on both - keep the one with more completed steps
              const localCompletedCount = localProgress.completedSteps?.length || 0;
              const serverCompletedCount = serverProgressForTopic.completedSteps?.length || 0;
              
              if (localCompletedCount > serverCompletedCount) {
                mergedProgress[storyId] = localProgress;
                hasNewData = true;
              }
            }
          }
          
          // If there's new data from localStorage, save merged data to server
          if (hasNewData) {
            saveProgressToServer(mergedProgress);
            console.log('Migrated topic progress from guest session');
          }
          
          setProgressMap(mergedProgress);
          saveTopicProgress(mergedProgress);
        }
        // If serverProgress is null (error), keep using localStorage data
        hasLoadedFromServer.current = true;
      });
    }
    // User was already authenticated on mount (page refresh)
    else if (isAuthenticated && !hasLoadedFromServer.current) {
      loadProgressFromServer().then((serverProgress) => {
        if (serverProgress !== null) {
          setProgressMap(serverProgress);
          saveTopicProgress(serverProgress);
        }
        hasLoadedFromServer.current = true;
      });
    }
    
    // Reset the flag when user logs out
    if (!isAuthenticated && previousAuthState.current) {
      hasLoadedFromServer.current = false;
    }
    
    previousAuthState.current = isAuthenticated;
  }, [isAuthenticated]);

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
      const newProgress = { ...prev, [storyId]: updated };
      
      // If logged in, also save to server (use ref to get current auth state)
      if (isAuthenticatedRef.current) {
        saveProgressToServer(newProgress);
      }
      
      return newProgress;
    });
  }, []);

  const completeStep = useCallback((storyId: number, step: LearningStep) => {
    setProgressMap(prev => {
      const existing = prev[storyId];
      const completedSteps = existing?.completedSteps || [];
      
      const newCompletedSteps = completedSteps.includes(step)
        ? completedSteps
        : [...completedSteps, step];
      
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
      const newProgress = { ...prev, [storyId]: updated };
      
      // If logged in, also save to server (use ref to get current auth state)
      if (isAuthenticatedRef.current) {
        saveProgressToServer(newProgress);
      }
      
      return newProgress;
    });
  }, []);

  const resetTopicProgress = useCallback((storyId: number) => {
    setProgressMap(prev => {
      const { [storyId]: _removed, ...rest } = prev;
      void _removed;
      
      // If logged in, also save to server (use ref to get current auth state)
      if (isAuthenticatedRef.current) {
        saveProgressToServer(rest);
      }
      
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
