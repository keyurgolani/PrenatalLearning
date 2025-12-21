/**
 * Progress tracking utilities for the Prenatal Learning Hub
 * 
 * Requirements:
 * - 2.3: WHEN a user views the header THEN the System SHALL display overall progress as a percentage
 * - 2.4: WHEN a user marks a completed story as incomplete THEN the System SHALL update the completion status
 * 
 * Design Properties:
 * - Property 6: Progress Calculation Accuracy - percentage equals (completed/total) * 100, rounded
 * - Property 7: Completion Toggle Idempotence - toggling twice returns to original state
 */

/**
 * Calculate progress percentage from completed stories
 * 
 * @param completedCount - Number of completed stories
 * @param totalCount - Total number of stories
 * @returns Progress percentage rounded to nearest integer (0-100)
 * 
 * Design Property 6: Progress Calculation Accuracy
 * *For any* set of completed story IDs, the displayed progress percentage SHALL equal
 * (completed count / total stories count) * 100, rounded to the nearest integer.
 * **Validates: Requirements 2.3**
 */
export function calculateProgress(completedCount: number, totalCount: number): number {
  // Handle edge case: no stories
  if (totalCount <= 0) {
    return 0;
  }
  
  // Handle edge case: negative completed count
  if (completedCount < 0) {
    return 0;
  }
  
  // Cap completed at total (can't complete more than exists)
  const safeCompleted = Math.min(completedCount, totalCount);
  
  // Calculate percentage and round to nearest integer
  const percentage = (safeCompleted / totalCount) * 100;
  return Math.round(percentage);
}

/**
 * Toggle a story's completion status in the completed stories list
 * 
 * @param completedStories - Current array of completed story IDs
 * @param storyId - Story ID to toggle
 * @returns New array with the story ID added or removed
 * 
 * Design Property 7: Completion Toggle Idempotence
 * *For any* story, toggling completion twice (complete then incomplete) SHALL return
 * the story to its original completion state.
 * **Validates: Requirements 2.4**
 */
export function toggleCompletion(completedStories: number[], storyId: number): number[] {
  const isCompleted = completedStories.includes(storyId);
  
  if (isCompleted) {
    // Remove from completed list
    return completedStories.filter((id) => id !== storyId);
  } else {
    // Add to completed list
    return [...completedStories, storyId];
  }
}

/**
 * Check if a story is completed
 * 
 * @param completedStories - Array of completed story IDs
 * @param storyId - Story ID to check
 * @returns true if the story is in the completed list
 */
export function isStoryCompleted(completedStories: number[], storyId: number): boolean {
  return completedStories.includes(storyId);
}

/**
 * Get the count of completed stories
 * 
 * @param completedStories - Array of completed story IDs
 * @returns Number of completed stories
 */
export function getCompletedCount(completedStories: number[]): number {
  return completedStories.length;
}

export default {
  calculateProgress,
  toggleCompletion,
  isStoryCompleted,
  getCompletedCount,
};
