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
 * 49 stories total across 11 categories
 */
export const availableTopics: TopicData[] = [
  // Science & Universe (4 stories)
  { id: 1, title: 'The Story of Everything: From Big Bang to You', category: 'science' },
  { id: 2, title: 'Dancing with Gravity: The Force That Holds Us', category: 'science' },
  { id: 3, title: 'The Quantum Garden: Where Reality Gets Magical', category: 'science' },
  { id: 4, title: 'Starlight Stories: How Stars Live and Die', category: 'science' },
  
  // Technology & AI (4 stories)
  { id: 5, title: 'The Thinking Machine: How Computers Work', category: 'technology' },
  { id: 6, title: 'Teaching Machines to Learn: The AI Story', category: 'technology' },
  { id: 7, title: 'The Great Chain of Trust: Blockchain Unveiled', category: 'technology' },
  { id: 8, title: 'The Web of All Things: How the Internet Connects Us', category: 'technology' },
  
  // Biology & Life (4 stories)
  { id: 9, title: 'The Dance of DNA: Your Genetic Blueprint', category: 'biology' },
  { id: 10, title: 'The Symphony Inside: Your Body as an Orchestra', category: 'biology' },
  { id: 11, title: 'The Hidden Garden: Your Microbiome', category: 'biology' },
  { id: 12, title: 'The Tree of Life: Evolution and Connection', category: 'biology' },
  
  // Mathematics (4 stories)
  { id: 13, title: 'The Language of the Universe: Numbers', category: 'math' },
  { id: 14, title: 'Infinity and Beyond: The Endless Mystery', category: 'math' },
  { id: 15, title: "Nature's Secret Code: Fibonacci and Fractals", category: 'math' },
  { id: 16, title: 'The Game of Chance: Probability in Life', category: 'math' },
  
  // Psychology & Mind (4 stories)
  { id: 17, title: 'The Wonder of Consciousness: Your Amazing Mind', category: 'psychology' },
  { id: 18, title: 'The Rainbow of Feelings: Understanding Emotions', category: 'psychology' },
  { id: 19, title: 'The Library of Memory: How We Remember', category: 'psychology' },
  { id: 20, title: 'Growing Your Mind: The Power of Learning', category: 'psychology' },
  
  // Language & Communication (4 stories)
  { id: 21, title: 'The Magic of Words: How Language Began', category: 'language' },
  { id: 22, title: 'The Ancient Tongue: Sanskrit and the Roots of Language', category: 'language' },
  { id: 23, title: 'The Universal Language: Music and the Soul', category: 'language' },
  { id: 24, title: 'Speaking Without Words: Body Language', category: 'language' },
  
  // Finance (4 stories)
  { id: 25, title: 'The Story of Money: From Shells to Digital', category: 'finance' },
  { id: 26, title: 'The Dance of Supply and Demand: How Markets Work', category: 'finance' },
  { id: 27, title: 'Digital Gold: Understanding Cryptocurrency', category: 'finance' },
  { id: 28, title: 'Building Wealth: The Power of Compound Growth', category: 'finance' },
  
  // Society (4 stories)
  { id: 29, title: 'The Beautiful Tapestry: Celebrating Diversity', category: 'society' },
  { id: 30, title: 'Right and Wrong: The Journey of Ethics', category: 'society' },
  { id: 31, title: 'The Voice of the People: Understanding Democracy', category: 'society' },
  { id: 32, title: 'The Human Spirit: Art and Creativity', category: 'society' },
  
  // New Deep Dive Topics (Content Revamp)
  { id: 33, title: 'The Journey of a Signal: What Happens When You Type a URL', category: 'technology' },
  { id: 34, title: 'The Silent Architect: Unlocking Your Subconscious Mind', category: 'psychology' },
  { id: 35, title: 'The Word Weavers: How Large Language Models Think', category: 'technology' },
  
  // Nature & Environment Topics
  { id: 36, title: 'The Wood Wide Web: Forest Whisperers', category: 'nature' },
  { id: 37, title: 'The Water Cycle: The Journey of a Drop', category: 'nature' },
  { id: 38, title: 'The Story of Flight: Escaping Gravity', category: 'nature' },
  
  // Philosophy Topics
  { id: 39, title: 'Stoicism: The Inner Fortress', category: 'philosophy' },
  { id: 40, title: 'Color Theory: Painting with Light', category: 'society' },
  { id: 41, title: 'The Silk Road: The World\'s Ribbon', category: 'society' },
  
  // Indian Mythology & Spirituality Topics
  { id: 42, title: 'The Cosmic Dance: Shiva Nataraja and the Universe', category: 'mythology' },
  { id: 43, title: 'The Churning of the Ocean: Samudra Manthan', category: 'mythology' },
  { id: 44, title: 'The Avatars: Dashavatara and Evolution', category: 'mythology' },
  { id: 45, title: 'The Bhagavad Gita: The Song of Life', category: 'mythology' },
  { id: 46, title: 'Ayurveda: The Science of Life', category: 'mythology' },
  { id: 47, title: 'The Upanishads: The Inner Universe', category: 'mythology' },
  { id: 48, title: 'Ramayana: The Journey Home', category: 'mythology' },
  { id: 49, title: 'Yoga: Union of Body and Spirit', category: 'mythology' },
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
