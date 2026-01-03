import type { Trimester } from '../types/trimester';

/**
 * Maps story IDs to their recommended trimester.
 * 
 * Assignment rationale:
 * - First trimester (weeks 1-12): Foundational, gentle topics for early pregnancy
 * - Second trimester (weeks 13-26): Expanding knowledge as baby grows
 * - Third trimester (weeks 27-40): Deeper, more complex topics preparing for arrival
 * - Any: Topics suitable for all stages of pregnancy
 * 
 * Requirements: 1.1
 */
export const storyTrimesterMap: Record<number, Trimester> = {
  // SCIENCE & UNIVERSE
  1: 'first',    // Big Bang - foundational cosmic story
  2: 'first',    // Gravity - foundational physics
  3: 'second',   // Quantum - intermediate complexity
  4: 'second',   // Stars - intermediate astronomy

  // TECHNOLOGY & AI
  5: 'first',    // Computers - foundational tech
  6: 'second',   // AI - intermediate complexity
  7: 'third',    // Blockchain - advanced topic
  8: 'first',    // Internet - foundational connectivity

  // BIOLOGY
  9: 'second',   // DNA - relevant as baby develops
  10: 'second',  // Body Systems - understanding body changes
  11: 'third',   // Microbiome - preparing for birth/feeding
  12: 'third',   // Evolution - deeper biological concepts

  // MATH
  13: 'first',   // Numbers - foundational math
  14: 'second',  // Infinity - intermediate abstraction
  15: 'second',  // Fibonacci - patterns in nature
  16: 'third',   // Probability - advanced concepts

  // PSYCHOLOGY
  17: 'third',   // Consciousness - deep philosophical topic
  18: 'first',   // Emotions - relevant throughout, gentle intro
  19: 'second',  // Memory - intermediate psychology
  20: 'any',     // Growth Mindset - valuable at any stage

  // LANGUAGE
  21: 'first',   // Language origins - foundational
  22: 'third',   // Sanskrit - advanced linguistic topic
  23: 'second',  // Music - universal, intermediate
  24: 'second',  // Body Language - communication skills

  // FINANCE
  25: 'first',   // Money basics - foundational
  26: 'second',  // Markets - intermediate economics
  27: 'third',   // Cryptocurrency - advanced finance
  28: 'third',   // Wealth building - planning for future

  // SOCIETY
  29: 'any',     // Diversity - valuable at any stage
  30: 'third',   // Ethics - deeper philosophical topic
  31: 'third',   // Democracy - complex societal topic
  32: 'any',     // Art & Creativity - valuable at any stage

  // NEW DEEP DIVE TOPICS (Content Revamp)
  33: 'third',   // Network Journey - advanced technical deep dive
  34: 'second',  // Subconscious Mind - valuable for prenatal bonding
  35: 'third',   // LLM Story - advanced AI topic
};

/**
 * Gets the recommended trimester for a story.
 * Returns 'any' if the story ID is not found.
 */
export function getStoryTrimester(storyId: number): Trimester {
  return storyTrimesterMap[storyId] ?? 'any';
}
