/**
 * Learning Path Data Structure
 * 
 * Defines the recommended learning sequences for the Prenatal Learning Hub.
 * Topics are ordered based on difficulty progression (foundational → intermediate → advanced)
 * and logical topic flow within categories.
 * 
 * Requirements:
 * - 2.3: Display topics in a recommended sequential order with progress indicators
 */

/**
 * Learning path definition with ordered story sequence
 */
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  storyOrder: number[]; // Story IDs in recommended order
}

/**
 * Learning path item with computed properties
 */
export interface LearningPathItem {
  storyId: number;
  order: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

/**
 * Default learning path based on difficulty progression
 * 
 * Order rationale:
 * 1. Start with foundational topics across different categories to build base knowledge
 * 2. Progress to intermediate topics that build on foundational concepts
 * 3. End with advanced topics that require prior understanding
 * 
 * Within each difficulty level, topics are grouped by category for coherent learning flow.
 */
export const defaultLearningPath: LearningPath = {
  id: 'default',
  name: 'Recommended Journey',
  description: 'A curated sequence from foundational to advanced topics, designed for expectant mothers to explore knowledge at a comfortable pace.',
  storyOrder: [
    // === FOUNDATIONAL TOPICS (12 stories) ===
    // Science & Universe - Foundational
    1,  // The Story of Everything: From Big Bang to You
    2,  // Dancing with Gravity: The Force That Holds Us
    
    // Technology - Foundational
    5,  // The Thinking Machine: How Computers Work
    8,  // The Web of All Things: How the Internet Connects Us
    
    // Biology - Foundational
    9,  // The Dance of DNA: Your Genetic Blueprint
    10, // The Symphony Inside: Your Body as an Orchestra
    
    // Mathematics - Foundational
    13, // The Language of the Universe: Numbers
    
    // Psychology - Foundational
    18, // The Rainbow of Feelings: Understanding Emotions
    20, // Growing Your Mind: The Power of Learning
    
    // Language - Foundational
    21, // The Magic of Words: How Language Began
    
    // Finance - Foundational
    25, // The Story of Money: From Shells to Digital
    
    // Society - Foundational
    29, // The Beautiful Tapestry: Celebrating Diversity
    
    // === INTERMEDIATE TOPICS (12 stories) ===
    // Science & Universe - Intermediate
    3,  // The Quantum Garden: Where Reality Gets Magical
    4,  // Starlight Stories: How Stars Live and Die
    
    // Technology - Intermediate
    6,  // Teaching Machines to Learn: The AI Story
    
    // Biology - Intermediate
    11, // The Hidden Garden: Your Microbiome
    12, // The Tree of Life: Evolution and Connection
    
    // Mathematics - Intermediate
    14, // Infinity and Beyond: The Endless Mystery
    15, // Nature's Secret Code: Fibonacci and Fractals
    16, // The Game of Chance: Probability in Life
    
    // Psychology - Intermediate
    17, // The Wonder of Consciousness: Your Amazing Mind
    19, // The Library of Memory: How We Remember
    
    // Language - Intermediate
    23, // The Universal Language: Music and the Soul
    24, // Speaking Without Words: Body Language
    
    // === ADVANCED TOPICS (8 stories) ===
    // Technology - Advanced
    7,  // The Great Chain of Trust: Blockchain Unveiled
    
    // Language - Advanced
    22, // The Ancient Tongue: Sanskrit and the Roots of Language
    
    // Finance - Advanced
    26, // The Dance of Supply and Demand: How Markets Work
    27, // Digital Gold: Understanding Cryptocurrency
    28, // Building Wealth: The Power of Compound Growth
    
    // Society - Advanced
    30, // Right and Wrong: The Journey of Ethics
    31, // The Voice of the People: Understanding Democracy
    32, // The Human Spirit: Art and Creativity
  ],
};

/**
 * Beginner-friendly path focusing only on foundational topics
 */
export const beginnerPath: LearningPath = {
  id: 'beginner',
  name: 'Gentle Start',
  description: 'Perfect for beginners—foundational topics that introduce core concepts in an accessible way.',
  storyOrder: [
    1,  // The Story of Everything: From Big Bang to You
    2,  // Dancing with Gravity: The Force That Holds Us
    5,  // The Thinking Machine: How Computers Work
    8,  // The Web of All Things: How the Internet Connects Us
    9,  // The Dance of DNA: Your Genetic Blueprint
    10, // The Symphony Inside: Your Body as an Orchestra
    13, // The Language of the Universe: Numbers
    18, // The Rainbow of Feelings: Understanding Emotions
    20, // Growing Your Mind: The Power of Learning
    21, // The Magic of Words: How Language Began
    25, // The Story of Money: From Shells to Digital
    29, // The Beautiful Tapestry: Celebrating Diversity
  ],
};

/**
 * Science & Technology focused path
 */
export const scienceTechPath: LearningPath = {
  id: 'science-tech',
  name: 'Science & Technology',
  description: 'Explore the wonders of the universe and the marvels of modern technology.',
  storyOrder: [
    // Science - Foundational to Advanced
    1,  // The Story of Everything: From Big Bang to You
    2,  // Dancing with Gravity: The Force That Holds Us
    3,  // The Quantum Garden: Where Reality Gets Magical
    4,  // Starlight Stories: How Stars Live and Die
    // Technology - Foundational to Advanced
    5,  // The Thinking Machine: How Computers Work
    8,  // The Web of All Things: How the Internet Connects Us
    6,  // Teaching Machines to Learn: The AI Story
    7,  // The Great Chain of Trust: Blockchain Unveiled
  ],
};

/**
 * Mind & Body focused path
 */
export const mindBodyPath: LearningPath = {
  id: 'mind-body',
  name: 'Mind & Body',
  description: 'Understand yourself better—explore biology, psychology, and the wonders of the human experience.',
  storyOrder: [
    // Biology
    9,  // The Dance of DNA: Your Genetic Blueprint
    10, // The Symphony Inside: Your Body as an Orchestra
    11, // The Hidden Garden: Your Microbiome
    12, // The Tree of Life: Evolution and Connection
    // Psychology
    18, // The Rainbow of Feelings: Understanding Emotions
    20, // Growing Your Mind: The Power of Learning
    17, // The Wonder of Consciousness: Your Amazing Mind
    19, // The Library of Memory: How We Remember
  ],
};

/**
 * Communication & Culture focused path
 */
export const communicationCulturePath: LearningPath = {
  id: 'communication-culture',
  name: 'Communication & Culture',
  description: 'Discover how humans connect, communicate, and build societies together.',
  storyOrder: [
    // Language
    21, // The Magic of Words: How Language Began
    23, // The Universal Language: Music and the Soul
    24, // Speaking Without Words: Body Language
    22, // The Ancient Tongue: Sanskrit and the Roots of Language
    // Society
    29, // The Beautiful Tapestry: Celebrating Diversity
    30, // Right and Wrong: The Journey of Ethics
    31, // The Voice of the People: Understanding Democracy
    32, // The Human Spirit: Art and Creativity
  ],
};

/**
 * Numbers & Money focused path
 */
export const numbersMoneyPath: LearningPath = {
  id: 'numbers-money',
  name: 'Numbers & Money',
  description: 'Master the language of mathematics and understand how money shapes our world.',
  storyOrder: [
    // Mathematics
    13, // The Language of the Universe: Numbers
    14, // Infinity and Beyond: The Endless Mystery
    15, // Nature's Secret Code: Fibonacci and Fractals
    16, // The Game of Chance: Probability in Life
    // Finance
    25, // The Story of Money: From Shells to Digital
    26, // The Dance of Supply and Demand: How Markets Work
    27, // Digital Gold: Understanding Cryptocurrency
    28, // Building Wealth: The Power of Compound Growth
  ],
};

/**
 * Advanced topics only path for those seeking deeper knowledge
 */
export const advancedPath: LearningPath = {
  id: 'advanced',
  name: 'Deep Dive',
  description: 'For curious minds ready for a challenge—intermediate and advanced topics that explore complex ideas.',
  storyOrder: [
    // Intermediate
    3,  // The Quantum Garden: Where Reality Gets Magical
    4,  // Starlight Stories: How Stars Live and Die
    6,  // Teaching Machines to Learn: The AI Story
    11, // The Hidden Garden: Your Microbiome
    12, // The Tree of Life: Evolution and Connection
    14, // Infinity and Beyond: The Endless Mystery
    15, // Nature's Secret Code: Fibonacci and Fractals
    16, // The Game of Chance: Probability in Life
    17, // The Wonder of Consciousness: Your Amazing Mind
    19, // The Library of Memory: How We Remember
    // Advanced
    7,  // The Great Chain of Trust: Blockchain Unveiled
    22, // The Ancient Tongue: Sanskrit and the Roots of Language
    26, // The Dance of Supply and Demand: How Markets Work
    27, // Digital Gold: Understanding Cryptocurrency
    28, // Building Wealth: The Power of Compound Growth
    30, // Right and Wrong: The Journey of Ethics
    31, // The Voice of the People: Understanding Democracy
    32, // The Human Spirit: Art and Creativity
  ],
};

/**
 * All available learning paths
 */
export const learningPaths: LearningPath[] = [
  defaultLearningPath,
  beginnerPath,
  scienceTechPath,
  mindBodyPath,
  communicationCulturePath,
  numbersMoneyPath,
  advancedPath,
];

/**
 * Get a learning path by ID
 * @param pathId - The learning path ID
 * @returns The learning path or undefined if not found
 */
export function getLearningPathById(pathId: string): LearningPath | undefined {
  return learningPaths.find(path => path.id === pathId);
}

/**
 * Get the default learning path
 * @returns The default learning path
 */
export function getDefaultLearningPath(): LearningPath {
  return defaultLearningPath;
}

export default defaultLearningPath;
