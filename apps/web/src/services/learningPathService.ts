import type { Story } from '../types';
import { 
  defaultLearningPath, 
  type LearningPath, 
  type LearningPathItem 
} from '../data/learningPaths';

/**
 * Learning Path Service
 * 
 * Provides functions to manage learning path navigation and progress.
 * 
 * Requirements:
 * - 2.3: Display topics in a recommended sequential order with progress indicators
 * - 2.4: Display the current topic position and total topics in the path
 * - 2.5: Highlight the next recommended topic after completion
 */

/**
 * Get ordered stories based on the learning path sequence
 * @param stories - All available stories
 * @param learningPath - The learning path to use (defaults to default path)
 * @returns Stories ordered according to the learning path
 */
export function getOrderedStories(
  stories: Story[],
  learningPath: LearningPath = defaultLearningPath
): Story[] {
  const storyMap = new Map(stories.map(story => [story.id, story]));
  
  return learningPath.storyOrder
    .map(id => storyMap.get(id))
    .filter((story): story is Story => story !== undefined);
}

/**
 * Get the current position in the learning path
 * @param completedStoryIds - Array of completed story IDs
 * @param learningPath - The learning path to use
 * @returns The current position (1-indexed) or 0 if no progress
 */
export function getCurrentPosition(
  completedStoryIds: number[],
  learningPath: LearningPath = defaultLearningPath
): number {
  const completedSet = new Set(completedStoryIds);
  
  // Find the first uncompleted story in the path
  for (let i = 0; i < learningPath.storyOrder.length; i++) {
    if (!completedSet.has(learningPath.storyOrder[i])) {
      return i + 1; // 1-indexed position
    }
  }
  
  // All stories completed
  return learningPath.storyOrder.length;
}

/**
 * Get the next topic to study in the learning path
 * @param completedStoryIds - Array of completed story IDs
 * @param stories - All available stories
 * @param learningPath - The learning path to use
 * @returns The next story to study or null if all completed
 */
export function getNextTopic(
  completedStoryIds: number[],
  stories: Story[],
  learningPath: LearningPath = defaultLearningPath
): Story | null {
  const completedSet = new Set(completedStoryIds);
  const storyMap = new Map(stories.map(story => [story.id, story]));
  
  // Find the first uncompleted story in the path
  for (const storyId of learningPath.storyOrder) {
    if (!completedSet.has(storyId)) {
      return storyMap.get(storyId) || null;
    }
  }
  
  return null; // All completed
}

/**
 * Get the current topic (the one being studied or next to study)
 * @param completedStoryIds - Array of completed story IDs
 * @param stories - All available stories
 * @param learningPath - The learning path to use
 * @returns The current story or null if all completed
 */
export function getCurrentTopic(
  completedStoryIds: number[],
  stories: Story[],
  learningPath: LearningPath = defaultLearningPath
): Story | null {
  return getNextTopic(completedStoryIds, stories, learningPath);
}

/**
 * Build learning path items with computed properties
 * @param stories - All available stories
 * @param completedStoryIds - Array of completed story IDs
 * @param learningPath - The learning path to use
 * @returns Array of learning path items with status information
 */
export function buildLearningPathItems(
  stories: Story[],
  completedStoryIds: number[],
  learningPath: LearningPath = defaultLearningPath
): LearningPathItem[] {
  const completedSet = new Set(completedStoryIds);
  const storyMap = new Map(stories.map(story => [story.id, story]));
  
  // Find the first uncompleted story index
  let currentIndex = learningPath.storyOrder.findIndex(
    id => !completedSet.has(id)
  );
  
  // If all completed, set currentIndex to -1 (no current)
  if (currentIndex === -1) {
    currentIndex = learningPath.storyOrder.length; // Past the end
  }
  
  return learningPath.storyOrder
    .map((storyId, index) => {
      const story = storyMap.get(storyId);
      if (!story) return null;
      
      return {
        storyId,
        order: index + 1,
        isCompleted: completedSet.has(storyId),
        isCurrent: index === currentIndex,
        isNext: index === currentIndex + 1,
      };
    })
    .filter((item): item is LearningPathItem => item !== null);
}

/**
 * Get progress statistics for the learning path
 * @param completedStoryIds - Array of completed story IDs
 * @param learningPath - The learning path to use
 * @returns Progress statistics
 */
export function getProgressStats(
  completedStoryIds: number[],
  learningPath: LearningPath = defaultLearningPath
): {
  completed: number;
  total: number;
  percentage: number;
  currentPosition: number;
} {
  const completedSet = new Set(completedStoryIds);
  const completedInPath = learningPath.storyOrder.filter(id => 
    completedSet.has(id)
  ).length;
  
  const total = learningPath.storyOrder.length;
  const percentage = total > 0 ? Math.round((completedInPath / total) * 100) : 0;
  
  return {
    completed: completedInPath,
    total,
    percentage,
    currentPosition: getCurrentPosition(completedStoryIds, learningPath),
  };
}

/**
 * Check if a story is in the learning path
 * @param storyId - The story ID to check
 * @param learningPath - The learning path to use
 * @returns True if the story is in the path
 */
export function isStoryInPath(
  storyId: number,
  learningPath: LearningPath = defaultLearningPath
): boolean {
  return learningPath.storyOrder.includes(storyId);
}

/**
 * Get the position of a story in the learning path
 * @param storyId - The story ID to find
 * @param learningPath - The learning path to use
 * @returns The position (1-indexed) or -1 if not found
 */
export function getStoryPosition(
  storyId: number,
  learningPath: LearningPath = defaultLearningPath
): number {
  const index = learningPath.storyOrder.indexOf(storyId);
  return index === -1 ? -1 : index + 1;
}

export default {
  getOrderedStories,
  getCurrentPosition,
  getNextTopic,
  getCurrentTopic,
  buildLearningPathItems,
  getProgressStats,
  isStoryInPath,
  getStoryPosition,
};
