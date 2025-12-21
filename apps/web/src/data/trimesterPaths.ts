import type { LearningPath } from './learningPaths';

/**
 * Trimester-specific Learning Paths
 * 
 * These paths are tailored to each stage of pregnancy, featuring content
 * appropriate for the physical and emotional journey of expectant mothers.
 * 
 * Requirements:
 * - 2.1: THE System SHALL provide three trimester-specific learning paths
 * - 2.2: EACH trimester learning path SHALL contain 8-12 stories appropriate for that stage
 * - 2.3: THE System SHALL order stories within trimester paths from foundational to more complex topics
 */

/**
 * First Trimester Journey (Weeks 1-12)
 * 
 * Focus: Foundational, gentle topics for early pregnancy
 * Stories are ordered from most accessible to slightly more complex within the foundational level.
 * Includes stories marked as 'any' that are valuable at all stages.
 * 
 * Total: 10 stories (8 first-trimester + 2 any-trimester)
 */
export const firstTrimesterPath: LearningPath = {
  id: 'first-trimester',
  name: 'First Trimester Journey',
  description: 'Gentle foundational topics perfect for early pregnancy—build your knowledge base with accessible, calming content.',
  storyOrder: [
    // Foundational topics - ordered by accessibility
    18, // The Rainbow of Feelings: Understanding Emotions (gentle intro to psychology)
    13, // The Language of the Universe: Numbers (foundational math)
    21, // The Magic of Words: How Language Began (foundational language)
    25, // The Story of Money: From Shells to Digital (foundational finance)
    1,  // The Story of Everything: From Big Bang to You (foundational science)
    2,  // Dancing with Gravity: The Force That Holds Us (foundational physics)
    5,  // The Thinking Machine: How Computers Work (foundational tech)
    8,  // The Web of All Things: How the Internet Connects Us (foundational connectivity)
    // Any-trimester stories valuable for first trimester
    29, // The Beautiful Tapestry: Celebrating Diversity (valuable at any stage)
    20, // Growing Your Mind: The Power of Learning (growth mindset)
  ],
};

/**
 * Second Trimester Journey (Weeks 13-26)
 * 
 * Focus: Expanding knowledge as baby grows
 * Stories progress from intermediate concepts that build on first trimester foundations.
 * Includes stories marked as 'any' that complement the learning journey.
 * 
 * Total: 10 stories (9 second-trimester + 1 any-trimester)
 */
export const secondTrimesterPath: LearningPath = {
  id: 'second-trimester',
  name: 'Second Trimester Journey',
  description: 'Expanding knowledge as your baby grows—intermediate topics that build on foundational concepts.',
  storyOrder: [
    // Biology - relevant as baby develops
    9,  // The Dance of DNA: Your Genetic Blueprint
    10, // The Symphony Inside: Your Body as an Orchestra
    // Psychology - intermediate
    19, // The Library of Memory: How We Remember
    // Language & Communication
    23, // The Universal Language: Music and the Soul
    24, // Speaking Without Words: Body Language
    // Science - intermediate complexity
    3,  // The Quantum Garden: Where Reality Gets Magical
    4,  // Starlight Stories: How Stars Live and Die
    // Technology - intermediate
    6,  // Teaching Machines to Learn: The AI Story
    // Math & Finance - intermediate
    14, // Infinity and Beyond: The Endless Mystery
    // Any-trimester story
    32, // The Human Spirit: Art and Creativity
  ],
};

/**
 * Third Trimester Journey (Weeks 27-40)
 * 
 * Focus: Deeper topics as you prepare for arrival
 * Stories cover more complex and philosophical topics, preparing for the journey ahead.
 * Includes stories marked as 'any' that provide reflection and perspective.
 * 
 * Total: 12 stories (10 third-trimester + 2 any-trimester)
 */
export const thirdTrimesterPath: LearningPath = {
  id: 'third-trimester',
  name: 'Third Trimester Journey',
  description: 'Deeper topics as you prepare for arrival—complex ideas that inspire reflection and wonder.',
  storyOrder: [
    // Biology - preparing for birth
    11, // The Hidden Garden: Your Microbiome
    12, // The Tree of Life: Evolution and Connection
    // Psychology - deep philosophical topics
    17, // The Wonder of Consciousness: Your Amazing Mind
    // Math - advanced concepts
    15, // Nature's Secret Code: Fibonacci and Fractals
    16, // The Game of Chance: Probability in Life
    // Finance - planning for future
    26, // The Dance of Supply and Demand: How Markets Work
    28, // Building Wealth: The Power of Compound Growth
    27, // Digital Gold: Understanding Cryptocurrency
    // Technology - advanced
    7,  // The Great Chain of Trust: Blockchain Unveiled
    // Language - advanced
    22, // The Ancient Tongue: Sanskrit and the Roots of Language
    // Society - deeper philosophical topics
    30, // Right and Wrong: The Journey of Ethics
    31, // The Voice of the People: Understanding Democracy
  ],
};

/**
 * All trimester learning paths
 */
export const trimesterPaths: LearningPath[] = [
  firstTrimesterPath,
  secondTrimesterPath,
  thirdTrimesterPath,
];

/**
 * Get a trimester path by trimester name
 * @param trimester - 'first', 'second', or 'third'
 * @returns The corresponding learning path or undefined
 */
export function getTrimesterPath(trimester: 'first' | 'second' | 'third'): LearningPath | undefined {
  const pathId = `${trimester}-trimester`;
  return trimesterPaths.find(path => path.id === pathId);
}
