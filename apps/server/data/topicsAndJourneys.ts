/**
 * Topics and Journeys Data
 * 
 * This file contains the available topics (stories) and journeys (learning paths)
 * that can be referenced in journal entries.
 * 
 * Note: This data mirrors the frontend data in src/data/stories.ts and src/data/learningPaths.ts
 * In a production system, this would ideally be stored in a database or shared configuration.
 */

import type { TopicData, JourneyData } from '../utils/referenceParser.js';

/**
 * Available topics (stories) in the Prenatal Learning Hub
 * 32 stories total: 4 per category across 8 categories
 */
export const availableTopics: TopicData[] = [
  // Science & Universe (4 stories)
  { id: 1, title: 'The Story of Everything: From Big Bang to You' },
  { id: 2, title: 'Dancing with Gravity: The Force That Holds Us' },
  { id: 3, title: 'The Quantum Garden: Where Reality Gets Magical' },
  { id: 4, title: 'Starlight Stories: How Stars Live and Die' },
  
  // Technology & AI (4 stories)
  { id: 5, title: 'The Thinking Machine: How Computers Work' },
  { id: 6, title: 'Teaching Machines to Learn: The AI Story' },
  { id: 7, title: 'The Great Chain of Trust: Blockchain Unveiled' },
  { id: 8, title: 'The Web of All Things: How the Internet Connects Us' },
  
  // Biology & Life (4 stories)
  { id: 9, title: 'The Dance of DNA: Your Genetic Blueprint' },
  { id: 10, title: 'The Symphony Inside: Your Body as an Orchestra' },
  { id: 11, title: 'The Hidden Garden: Your Microbiome' },
  { id: 12, title: 'The Tree of Life: Evolution and Connection' },
  
  // Mathematics (4 stories)
  { id: 13, title: 'The Language of the Universe: Numbers' },
  { id: 14, title: 'Infinity and Beyond: The Endless Mystery' },
  { id: 15, title: "Nature's Secret Code: Fibonacci and Fractals" },
  { id: 16, title: 'The Game of Chance: Probability in Life' },
  
  // Psychology & Mind (4 stories)
  { id: 17, title: 'The Wonder of Consciousness: Your Amazing Mind' },
  { id: 18, title: 'The Rainbow of Feelings: Understanding Emotions' },
  { id: 19, title: 'The Library of Memory: How We Remember' },
  { id: 20, title: 'Growing Your Mind: The Power of Learning' },
  
  // Language & Communication (4 stories)
  { id: 21, title: 'The Magic of Words: How Language Began' },
  { id: 22, title: 'The Ancient Tongue: Sanskrit and the Roots of Language' },
  { id: 23, title: 'The Universal Language: Music and the Soul' },
  { id: 24, title: 'Speaking Without Words: Body Language' },
  
  // Finance (4 stories)
  { id: 25, title: 'The Story of Money: From Shells to Digital' },
  { id: 26, title: 'The Dance of Supply and Demand: How Markets Work' },
  { id: 27, title: 'Digital Gold: Understanding Cryptocurrency' },
  { id: 28, title: 'Building Wealth: The Power of Compound Growth' },
  
  // Society (4 stories)
  { id: 29, title: 'The Beautiful Tapestry: Celebrating Diversity' },
  { id: 30, title: 'Right and Wrong: The Journey of Ethics' },
  { id: 31, title: 'The Voice of the People: Understanding Democracy' },
  { id: 32, title: 'The Human Spirit: Art and Creativity' },
];

/**
 * Available journeys (learning paths) in the Prenatal Learning Hub
 */
export const availableJourneys: JourneyData[] = [
  // Trimester-specific paths
  { id: 'first-trimester', name: 'First Trimester Journey' },
  { id: 'second-trimester', name: 'Second Trimester Journey' },
  { id: 'third-trimester', name: 'Third Trimester Journey' },
  
  // General paths
  { id: 'default', name: 'All In One Journey' },
  { id: 'beginner', name: 'Gentle Start' },
  { id: 'science-tech', name: 'Science & Technology' },
  { id: 'mind-body', name: 'Mind & Body' },
  { id: 'communication-culture', name: 'Communication & Culture' },
  { id: 'numbers-money', name: 'Numbers & Money' },
  { id: 'advanced', name: 'Deep Dive' },
];

/**
 * Get a topic by ID
 */
export function getTopicById(id: number): TopicData | undefined {
  return availableTopics.find(t => t.id === id);
}

/**
 * Get a topic by title (case-insensitive)
 */
export function getTopicByTitle(title: string): TopicData | undefined {
  return availableTopics.find(
    t => t.title.toLowerCase() === title.toLowerCase()
  );
}

/**
 * Get a journey by ID (case-insensitive)
 */
export function getJourneyById(id: string): JourneyData | undefined {
  return availableJourneys.find(
    j => j.id.toLowerCase() === id.toLowerCase()
  );
}

/**
 * Get a journey by name (case-insensitive)
 */
export function getJourneyByName(name: string): JourneyData | undefined {
  return availableJourneys.find(
    j => j.name.toLowerCase() === name.toLowerCase()
  );
}
