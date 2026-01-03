import type { Story, CategoryId, DifficultyLevel, TopicExercise } from '../types';
import { getStoryTrimester } from './storyTrimesterMap';

// Import all story content from individual files
import { bigBangStory } from './stories/big-bang-story';
import { gravityStory } from './stories/gravity-story';
import { quantumStory } from './stories/quantum-story';
import { starsStory } from './stories/stars-story';
import { computerStory } from './stories/computer-story';
import { aiStory } from './stories/ai-story';
import { blockchainStory } from './stories/blockchain-story';
import { internetStory } from './stories/internet-story';
import { dnaStory } from './stories/dna-story';
import { bodySystemsStory } from './stories/body-systems-story';
import { microbiomeStory } from './stories/microbiome-story';
import { evolutionStory } from './stories/evolution-story';
import { numbersStory } from './stories/numbers-story';
import { infinityStory } from './stories/infinity-story';
import { fibonacciStory } from './stories/fibonacci-story';
import { probabilityStory } from './stories/probability-story';
import { consciousnessStory } from './stories/consciousness-story';
import { emotionsStory } from './stories/emotions-story';
import { memoryStory } from './stories/memory-story';
import { growthMindsetStory } from './stories/growth-mindset-story';
import { languageStory } from './stories/language-story';
import { sanskritStory } from './stories/sanskrit-story';
import { musicStory } from './stories/music-story';
import { bodyLanguageStory } from './stories/body-language-story';
import { moneyStory } from './stories/money-story';
import { marketsStory } from './stories/markets-story';
import { cryptocurrencyStory } from './stories/cryptocurrency-story';
import { wealthStory } from './stories/wealth-story';
import { diversityStory } from './stories/diversity-story';
import { ethicsStory } from './stories/ethics-story';
import { democracyStory } from './stories/democracy-story';
import { artStory } from './stories/art-story';
import { networkJourneyStory } from './stories/network-journey-story';
import { subconsciousMindStory } from './stories/subconscious-mind-story';
import { llmStory } from './stories/llm-story';

/**
 * Story data for the Prenatal Learning Hub
 * 
 * Requirements:
 * - 5.1: Stories across at least 8 distinct categories
 * - 5.2: At least 3 stories per category (we have 4 per category = 32 total)
 * - 5.3: Stories at foundational, intermediate, and advanced difficulty levels
 * - 5.4: Duration between 50-70 minutes per story
 * - 9.1: Full narrative scripts for one-hour reading sessions
 * - 9.2: Scientifically accurate explanations with accessible analogies
 * - 9.3: Key concepts and core truths for each topic
 */

// Type for the individual story file format
interface StoryFileContent {
  id: number;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  description: string;
  narrative: {
    introduction: string;
    coreContent: string;
    interactiveSection: string;
    integration: string;
  };
  keyConcepts: string[];
  analogies: (string | { concept: string; analogy: string })[];
  exercises: TopicExercise[];
}

/**
 * Convert story file content to Story format
 */
function convertToStory(storyFile: StoryFileContent): Story {
  // Convert analogies to string array if they're objects
  const analogiesAsStrings = storyFile.analogies.map(a => 
    typeof a === 'string' ? a : `${a.concept}: ${a.analogy}`
  );

  return {
    id: storyFile.id,
    title: storyFile.title,
    category: storyFile.category as CategoryId,
    duration: storyFile.duration,
    difficulty: storyFile.difficulty as DifficultyLevel,
    description: storyFile.description,
    recommendedTrimester: getStoryTrimester(storyFile.id),
    content: {
      narrative: storyFile.narrative,
      keyConcepts: storyFile.keyConcepts,
      analogies: analogiesAsStrings,
      exercises: storyFile.exercises,
    },
  };
}

/**
 * All stories in the Prenatal Learning Hub
 * 32 stories total: 4 per category across 8 categories
 * 
 * Content is imported from individual story files to ensure
 * the full narrative experience is available.
 */
export const stories: Story[] = [
  // Science & Universe (4 stories)
  convertToStory(bigBangStory as StoryFileContent),
  convertToStory(gravityStory as StoryFileContent),
  convertToStory(quantumStory as StoryFileContent),
  convertToStory(starsStory as StoryFileContent),
  
  // Technology & AI (4 stories)
  convertToStory(computerStory as StoryFileContent),
  convertToStory(aiStory as StoryFileContent),
  convertToStory(blockchainStory as StoryFileContent),
  convertToStory(internetStory as StoryFileContent),
  
  // Biology & Life (4 stories)
  convertToStory(dnaStory as StoryFileContent),
  convertToStory(bodySystemsStory as StoryFileContent),
  convertToStory(microbiomeStory as StoryFileContent),
  convertToStory(evolutionStory as StoryFileContent),
  
  // Mathematics (4 stories)
  convertToStory(numbersStory as StoryFileContent),
  convertToStory(infinityStory as StoryFileContent),
  convertToStory(fibonacciStory as StoryFileContent),
  convertToStory(probabilityStory as StoryFileContent),
  
  // Psychology & Mind (4 stories)
  convertToStory(consciousnessStory as StoryFileContent),
  convertToStory(emotionsStory as StoryFileContent),
  convertToStory(memoryStory as StoryFileContent),
  convertToStory(growthMindsetStory as StoryFileContent),
  
  // Language & Communication (4 stories)
  convertToStory(languageStory as StoryFileContent),
  convertToStory(sanskritStory as StoryFileContent),
  convertToStory(musicStory as StoryFileContent),
  convertToStory(bodyLanguageStory as StoryFileContent),
  
  // Finance (4 stories)
  convertToStory(moneyStory as StoryFileContent),
  convertToStory(marketsStory as StoryFileContent),
  convertToStory(cryptocurrencyStory as StoryFileContent),
  convertToStory(wealthStory as StoryFileContent),
  
  // Society (4 stories)
  convertToStory(diversityStory as StoryFileContent),
  convertToStory(ethicsStory as StoryFileContent),
  convertToStory(democracyStory as StoryFileContent),
  convertToStory(artStory as StoryFileContent),
  
  // New Deep Dive Topics (from Content Revamp)
  convertToStory(networkJourneyStory as StoryFileContent),  // Technology - "What Happens When..."
  convertToStory(subconsciousMindStory as StoryFileContent), // Psychology - Subconscious Mind
  convertToStory(llmStory as StoryFileContent), // Technology - Large Language Models
];

/**
 * Get a story by ID
 */
export function getStoryById(id: number): Story | undefined {
  return stories.find(story => story.id === id);
}

/**
 * Get stories by category
 */
export function getStoriesByCategory(category: CategoryId): Story[] {
  if (category === 'all') return stories;
  return stories.filter(story => story.category === category);
}

/**
 * Get stories by difficulty
 */
export function getStoriesByDifficulty(difficulty: DifficultyLevel): Story[] {
  return stories.filter(story => story.difficulty === difficulty);
}

/**
 * Search stories by title or description
 */
export function searchStories(query: string): Story[] {
  const lowerQuery = query.toLowerCase();
  return stories.filter(
    story =>
      story.title.toLowerCase().includes(lowerQuery) ||
      story.description.toLowerCase().includes(lowerQuery)
  );
}

export default stories;
