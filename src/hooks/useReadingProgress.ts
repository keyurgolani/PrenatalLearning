/**
 * useReadingProgress Hook
 * 
 * Calculates reading progress from scroll position and tracks overall story progress.
 * 
 * Requirements:
 * - 11.2: Update the progress bar based on scroll position within the current section
 * - 11.3: Show overall story progress (sections completed / total sections)
 * - 11.5: When the user scrolls, update progress in real-time
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { LearningStep } from '../contexts/TopicProgressContext';
import { LEARNING_STEPS } from '../contexts/TopicProgressContext';

/**
 * Result interface for useReadingProgress hook
 */
export interface UseReadingProgressResult {
  /** Progress within current section (0-100) based on scroll position */
  sectionProgress: number;
  /** Overall story progress (0-100) based on sections completed */
  overallProgress: number;
  /** Name of the current section */
  currentSection: LearningStep;
  /** Estimated time remaining in minutes */
  estimatedTimeRemaining: number;
}

/**
 * Calculate scroll progress percentage
 * Requirements: 11.2 - Update progress bar based on scroll position
 * 
 * Formula: (scrollTop / (scrollHeight - clientHeight)) * 100
 * 
 * @param scrollTop - Current scroll position from top
 * @param scrollHeight - Total scrollable height
 * @param clientHeight - Visible height of the container
 * @returns Progress percentage (0-100)
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  
  // Handle edge cases
  if (maxScroll <= 0) {
    return 100; // Content fits in viewport, consider it 100% read
  }
  
  if (scrollTop <= 0) {
    return 0;
  }
  
  if (scrollTop >= maxScroll) {
    return 100;
  }
  
  return (scrollTop / maxScroll) * 100;
}

/**
 * Calculate overall story progress based on completed sections
 * Requirements: 11.3 - Show overall story progress (sections completed / total sections)
 * 
 * @param completedSteps - Array of completed learning steps
 * @param currentSectionProgress - Progress within current section (0-100)
 * @returns Overall progress percentage (0-100)
 */
export function calculateOverallProgress(
  completedSteps: LearningStep[],
  currentSectionProgress: number
): number {
  const totalSteps = LEARNING_STEPS.length;
  const completedCount = completedSteps.length;
  
  // Each completed step contributes equally to overall progress
  // Current section progress contributes proportionally
  const completedProgress = (completedCount / totalSteps) * 100;
  const currentContribution = (currentSectionProgress / 100) * (100 / totalSteps);
  
  return Math.min(100, completedProgress + currentContribution);
}

interface UseReadingProgressOptions {
  /** Reference to the scrollable container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Current learning step/section */
  currentStep: LearningStep;
  /** Array of completed learning steps */
  completedSteps: LearningStep[];
  /** Total estimated reading time in minutes */
  totalReadingTime?: number;
}

/**
 * Hook to track reading progress based on scroll position
 * Requirements: 11.2, 11.3, 11.5
 * 
 * @param options - Configuration options
 * @returns Reading progress information
 */
export function useReadingProgress({
  containerRef,
  currentStep,
  completedSteps,
  totalReadingTime = 0,
}: UseReadingProgressOptions): UseReadingProgressResult {
  const [sectionProgress, setSectionProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Calculate section progress from scroll position
  const updateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setSectionProgress(0);
      return;
    }

    const { scrollTop, scrollHeight, clientHeight } = container;
    const progress = calculateScrollProgress(scrollTop, scrollHeight, clientHeight);
    setSectionProgress(progress);
  }, [containerRef]);

  // Throttled scroll handler using requestAnimationFrame
  // Requirements: 11.5 - Update progress in real-time on scroll
  const handleScroll = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial progress calculation - use setTimeout to avoid synchronous setState
    const initialTimeoutId = setTimeout(() => {
      updateProgress();
    }, 0);

    // Add scroll listener
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(initialTimeoutId);
      container.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [containerRef, handleScroll, updateProgress]);

  // Recalculate when current step changes
  useEffect(() => {
    // Reset section progress when step changes - use setTimeout to avoid synchronous setState
    const resetTimeoutId = setTimeout(() => {
      setSectionProgress(0);
    }, 0);
    // Recalculate after a brief delay to allow DOM to update
    const recalcTimeoutId = setTimeout(updateProgress, 100);
    return () => {
      clearTimeout(resetTimeoutId);
      clearTimeout(recalcTimeoutId);
    };
  }, [currentStep, updateProgress]);

  // Calculate overall progress
  const overallProgress = calculateOverallProgress(completedSteps, sectionProgress);

  // Calculate estimated time remaining
  const estimatedTimeRemaining = Math.ceil(
    totalReadingTime * ((100 - overallProgress) / 100)
  );

  return {
    sectionProgress,
    overallProgress,
    currentSection: currentStep,
    estimatedTimeRemaining,
  };
}

export default useReadingProgress;
