import type { Story } from '../types';

/**
 * Related Topics Service
 * 
 * Calculates and returns related stories based on category, difficulty,
 * and shared key concepts. Prioritizes uncompleted stories.
 * 
 * Requirements:
 * - 6.1: WHEN a user completes a story, THE System SHALL display 3 related topic suggestions
 * - 6.2: THE System SHALL determine related topics based on category, difficulty, and shared key concepts
 * - 6.3: THE System SHALL prioritize suggesting uncompleted stories
 * 
 * Design Properties:
 * - Same category: +30 points
 * - Same difficulty: +10 points
 * - Shared key concepts: +20 points per concept
 * - Not completed: +50 points (prioritize uncompleted)
 */

/**
 * Related story with relatedness score and reasons
 */
export interface RelatedStory {
  story: Story;
  relatednessScore: number;
  reasons: string[];
}

/**
 * Scoring weights for relatedness calculation
 */
const SCORING_WEIGHTS = {
  SAME_CATEGORY: 30,
  SAME_DIFFICULTY: 10,
  SHARED_CONCEPT: 20,
  NOT_COMPLETED: 50,
} as const;

/**
 * Maximum number of related stories to return
 */
const MAX_RELATED_STORIES = 3;

/**
 * Calculate the relatedness score between two stories
 * @param sourceStory - The story to find related stories for
 * @param targetStory - A potential related story
 * @param completedStoryIds - Set of completed story IDs
 * @returns RelatedStory with score and reasons
 */
function calculateRelatedness(
  sourceStory: Story,
  targetStory: Story,
  completedStoryIds: Set<number>
): RelatedStory {
  let score = 0;
  const reasons: string[] = [];

  // Same category: +30 points
  if (sourceStory.category === targetStory.category) {
    score += SCORING_WEIGHTS.SAME_CATEGORY;
    reasons.push('Same category');
  }

  // Same difficulty: +10 points
  if (sourceStory.difficulty === targetStory.difficulty) {
    score += SCORING_WEIGHTS.SAME_DIFFICULTY;
    reasons.push('Same difficulty');
  }

  // Shared key concepts: +20 points per concept
  const sourceConceptsLower = sourceStory.content.keyConcepts.map(c => c.toLowerCase());
  const targetConceptsLower = targetStory.content.keyConcepts.map(c => c.toLowerCase());
  
  const sharedConcepts: string[] = [];
  for (const sourceConcept of sourceConceptsLower) {
    for (const targetConcept of targetConceptsLower) {
      // Check for significant word overlap (at least 3 characters)
      const sourceWords = sourceConcept.split(/\s+/).filter(w => w.length >= 3);
      const targetWords = targetConcept.split(/\s+/).filter(w => w.length >= 3);
      
      const hasOverlap = sourceWords.some(sw => 
        targetWords.some(tw => sw === tw || sw.includes(tw) || tw.includes(sw))
      );
      
      if (hasOverlap && !sharedConcepts.includes(targetConcept)) {
        sharedConcepts.push(targetConcept);
        score += SCORING_WEIGHTS.SHARED_CONCEPT;
      }
    }
  }
  
  if (sharedConcepts.length > 0) {
    reasons.push(`Shared concepts: ${sharedConcepts.length}`);
  }

  // Not completed: +50 points (prioritize uncompleted)
  if (!completedStoryIds.has(targetStory.id)) {
    score += SCORING_WEIGHTS.NOT_COMPLETED;
    reasons.push('Not yet completed');
  }

  return {
    story: targetStory,
    relatednessScore: score,
    reasons,
  };
}

/**
 * Get related stories for a given story
 * @param storyId - The ID of the story to find related stories for
 * @param stories - All available stories
 * @param completedStories - Array of completed story IDs
 * @returns Array of up to 3 related stories, sorted by relatedness score
 */
export function getRelatedStories(
  storyId: number,
  stories: Story[],
  completedStories: number[] = []
): RelatedStory[] {
  const sourceStory = stories.find(s => s.id === storyId);
  if (!sourceStory) {
    return [];
  }

  const completedStoryIds = new Set(completedStories);

  // Calculate relatedness for all other stories
  const relatedStories = stories
    .filter(s => s.id !== storyId) // Exclude the source story
    .map(targetStory => calculateRelatedness(sourceStory, targetStory, completedStoryIds))
    .filter(rs => rs.relatednessScore > 0) // Only include stories with some relatedness
    .sort((a, b) => b.relatednessScore - a.relatednessScore) // Sort by score descending
    .slice(0, MAX_RELATED_STORIES); // Take top 3

  return relatedStories;
}

/**
 * Get related stories by story object (convenience function)
 * @param story - The story to find related stories for
 * @param stories - All available stories
 * @param completedStories - Array of completed story IDs
 * @returns Array of up to 3 related stories
 */
export function getRelatedStoriesForStory(
  story: Story,
  stories: Story[],
  completedStories: number[] = []
): RelatedStory[] {
  return getRelatedStories(story.id, stories, completedStories);
}

// Export service object for convenience
export const relatedService = {
  getRelatedStories,
  getRelatedStoriesForStory,
  SCORING_WEIGHTS,
  MAX_RELATED_STORIES,
};

export default relatedService;
