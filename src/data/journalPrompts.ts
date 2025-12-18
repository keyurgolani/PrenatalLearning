/**
 * Journal prompts for story-specific reflection
 * 
 * Requirements:
 * - 10.1: Display 2-3 reflection prompts relevant to the current story
 * - 10.2: Allow users to select a prompt to pre-fill the journal entry
 * - 10.3: Provide general prompts when not on a specific story page
 * - 10.4: Rotate prompts to provide variety over time
 * 
 * Design Properties:
 * - Property 14: Journal prompt count (2-3 per story)
 */

import type { JournalPrompt } from '../types/journal';
import { JOURNAL_CONSTANTS } from '../types/journal';

/**
 * General prompts for when no story is selected
 * Requirements: 10.3
 */
export const generalPrompts: JournalPrompt[] = [
  {
    id: 'general-1',
    text: 'What are you most looking forward to about becoming a parent?',
    category: 'reflection',
  },
  {
    id: 'general-2',
    text: 'How has your perspective on life changed since learning you were expecting?',
    category: 'reflection',
  },
  {
    id: 'general-3',
    text: 'What wisdom do you hope to pass on to your child?',
    category: 'reflection',
  },
  {
    id: 'general-4',
    text: 'Describe a moment today when you felt connected to your baby.',
    category: 'connection',
  },
  {
    id: 'general-5',
    text: 'What new thing did you learn today that surprised you?',
    category: 'learning',
  },
  {
    id: 'general-6',
    text: 'How are you feeling physically and emotionally right now?',
    category: 'wellness',
  },
  {
    id: 'general-7',
    text: 'What are three things you\'re grateful for today?',
    category: 'gratitude',
  },
  {
    id: 'general-8',
    text: 'Write a letter to your future child about this moment in time.',
    category: 'connection',
  },
];

/**
 * Story-specific prompts mapped by story ID
 * Requirements: 10.1
 */
export const storyPrompts: Record<number, JournalPrompt[]> = {
  // Story 1: Big Bang
  1: [
    { id: 's1-1', storyId: 1, text: 'How does knowing you\'re made of star stuff change how you see yourself and your baby?' },
    { id: 's1-2', storyId: 1, text: 'What part of the cosmic story resonates most with your journey to parenthood?' },
    { id: 's1-3', storyId: 1, text: 'If you could tell your baby one thing about the universe, what would it be?' },
  ],
  // Story 2: Gravity
  2: [
    { id: 's2-1', storyId: 2, text: 'How do you feel gravity connecting you to your baby right now?' },
    { id: 's2-2', storyId: 2, text: 'What invisible forces in your life keep you grounded and centered?' },
    { id: 's2-3', storyId: 2, text: 'Reflect on the balance between holding on and letting go in parenthood.' },
  ],
  // Story 3: Quantum
  3: [
    { id: 's3-1', storyId: 3, text: 'What possibilities feel most exciting about your baby\'s future?' },
    { id: 's3-2', storyId: 3, text: 'How does uncertainty make you feel about the journey ahead?' },
    { id: 's3-3', storyId: 3, text: 'In what ways do you feel connected to your baby across space and time?' },
  ],
  // Story 4: Stars
  4: [
    { id: 's4-1', storyId: 4, text: 'What light do you hope to bring into your child\'s life?' },
    { id: 's4-2', storyId: 4, text: 'How does the life cycle of stars mirror the journey of parenthood?' },
    { id: 's4-3', storyId: 4, text: 'What legacy do you want to leave for future generations?' },
  ],
  // Story 5: Computers
  5: [
    { id: 's5-1', storyId: 5, text: 'How do you hope technology will shape your child\'s world?' },
    { id: 's5-2', storyId: 5, text: 'What values about technology do you want to teach your child?' },
    { id: 's5-3', storyId: 5, text: 'Reflect on the simple building blocks that create complex things in life.' },
  ],
  // Story 6: AI
  6: [
    { id: 's6-1', storyId: 6, text: 'What uniquely human qualities do you want to nurture in your child?' },
    { id: 's6-2', storyId: 6, text: 'How do you feel about AI being part of your child\'s future?' },
    { id: 's6-3', storyId: 6, text: 'What patterns have you noticed in your own learning journey?' },
  ],
  // Story 7: Blockchain
  7: [
    { id: 's7-1', storyId: 7, text: 'How do you build trust in your relationships?' },
    { id: 's7-2', storyId: 7, text: 'What values do you want to be unchangeable in your family?' },
    { id: 's7-3', storyId: 7, text: 'Reflect on the importance of transparency and honesty in parenting.' },
  ],
  // Story 8: Internet
  8: [
    { id: 's8-1', storyId: 8, text: 'How has connection with others supported you during pregnancy?' },
    { id: 's8-2', storyId: 8, text: 'What communities do you want your child to be part of?' },
    { id: 's8-3', storyId: 8, text: 'Reflect on the balance between digital and real-world connections.' },
  ],
  // Story 9: DNA
  9: [
    { id: 's9-1', storyId: 9, text: 'What traits do you hope your baby inherits from you or your partner?' },
    { id: 's9-2', storyId: 9, text: 'How does understanding DNA change how you think about your baby?' },
    { id: 's9-3', storyId: 9, text: 'What family stories do you want to pass down through generations?' },
  ],
  // Story 10: Evolution
  10: [
    { id: 's10-1', storyId: 10, text: 'How have you evolved as a person during this pregnancy?' },
    { id: 's10-2', storyId: 10, text: 'What adaptations have you made to prepare for parenthood?' },
    { id: 's10-3', storyId: 10, text: 'Reflect on the long chain of ancestors that led to this moment.' },
  ],
  // Story 11: Body Systems
  11: [
    { id: 's11-1', storyId: 11, text: 'How has your appreciation for your body changed during pregnancy?' },
    { id: 's11-2', storyId: 11, text: 'What amazes you most about how your body is nurturing your baby?' },
    { id: 's11-3', storyId: 11, text: 'Reflect on the teamwork happening inside you right now.' },
  ],
  // Story 12: Microbiome
  12: [
    { id: 's12-1', storyId: 12, text: 'How do you think about the tiny helpers living inside you?' },
    { id: 's12-2', storyId: 12, text: 'What steps are you taking to support your health during pregnancy?' },
    { id: 's12-3', storyId: 12, text: 'Reflect on the invisible communities that support life.' },
  ],
  // Story 13: Numbers
  13: [
    { id: 's13-1', storyId: 13, text: 'What numbers are meaningful in your pregnancy journey?' },
    { id: 's13-2', storyId: 13, text: 'How do you feel about counting down to your due date?' },
    { id: 's13-3', storyId: 13, text: 'Reflect on the patterns you see in your daily life.' },
  ],
  // Story 14: Fibonacci
  14: [
    { id: 's14-1', storyId: 14, text: 'Where do you see natural patterns in your pregnancy?' },
    { id: 's14-2', storyId: 14, text: 'How does growth build upon itself in your life?' },
    { id: 's14-3', storyId: 14, text: 'Reflect on the beauty of mathematical patterns in nature.' },
  ],
  // Story 15: Probability
  15: [
    { id: 's15-1', storyId: 15, text: 'How do you handle uncertainty in your pregnancy journey?' },
    { id: 's15-2', storyId: 15, text: 'What unlikely events led to this moment in your life?' },
    { id: 's15-3', storyId: 15, text: 'Reflect on the role of chance in creating your family.' },
  ],
  // Story 16: Infinity
  16: [
    { id: 's16-1', storyId: 16, text: 'What feels infinite about your love for your baby?' },
    { id: 's16-2', storyId: 16, text: 'How do you think about the endless possibilities ahead?' },
    { id: 's16-3', storyId: 16, text: 'Reflect on moments that feel timeless during pregnancy.' },
  ],
  // Story 17: Memory
  17: [
    { id: 's17-1', storyId: 17, text: 'What memories from your pregnancy do you want to preserve?' },
    { id: 's17-2', storyId: 17, text: 'How do you hope your child will remember their childhood?' },
    { id: 's17-3', storyId: 17, text: 'Reflect on a cherished memory from your own childhood.' },
  ],
  // Story 18: Emotions
  18: [
    { id: 's18-1', storyId: 18, text: 'What emotions have surprised you during pregnancy?' },
    { id: 's18-2', storyId: 18, text: 'How do you want to teach your child about feelings?' },
    { id: 's18-3', storyId: 18, text: 'Reflect on how your emotional landscape has changed.' },
  ],
  // Story 19: Consciousness
  19: [
    { id: 's19-1', storyId: 19, text: 'When do you feel most present and aware during pregnancy?' },
    { id: 's19-2', storyId: 19, text: 'What do you wonder about your baby\'s inner experience?' },
    { id: 's19-3', storyId: 19, text: 'Reflect on the mystery of consciousness and awareness.' },
  ],
  // Story 20: Growth Mindset
  20: [
    { id: 's20-1', storyId: 20, text: 'What challenges have helped you grow during pregnancy?' },
    { id: 's20-2', storyId: 20, text: 'How do you want to encourage a love of learning in your child?' },
    { id: 's20-3', storyId: 20, text: 'Reflect on a time when effort led to improvement.' },
  ],
  // Story 21: Language
  21: [
    { id: 's21-1', storyId: 21, text: 'What words do you find yourself saying to your baby?' },
    { id: 's21-2', storyId: 21, text: 'How do you hope to communicate with your child?' },
    { id: 's21-3', storyId: 21, text: 'Reflect on the power of words in shaping relationships.' },
  ],
  // Story 22: Body Language
  22: [
    { id: 's22-1', storyId: 22, text: 'How do you communicate with your baby without words?' },
    { id: 's22-2', storyId: 22, text: 'What non-verbal cues do you notice from your baby?' },
    { id: 's22-3', storyId: 22, text: 'Reflect on the importance of touch and presence.' },
  ],
  // Story 23: Sanskrit
  23: [
    { id: 's23-1', storyId: 23, text: 'What ancient wisdom resonates with your parenting journey?' },
    { id: 's23-2', storyId: 23, text: 'How do you connect with traditions from the past?' },
    { id: 's23-3', storyId: 23, text: 'Reflect on the roots of language and meaning.' },
  ],
  // Story 24: Music
  24: [
    { id: 's24-1', storyId: 24, text: 'What music do you play for your baby?' },
    { id: 's24-2', storyId: 24, text: 'How does music make you feel during pregnancy?' },
    { id: 's24-3', storyId: 24, text: 'Reflect on the rhythm and harmony in your life.' },
  ],
  // Story 25: Money
  25: [
    { id: 's25-1', storyId: 25, text: 'What financial values do you want to teach your child?' },
    { id: 's25-2', storyId: 25, text: 'How are you preparing financially for parenthood?' },
    { id: 's25-3', storyId: 25, text: 'Reflect on what wealth means to you beyond money.' },
  ],
  // Story 26: Markets
  26: [
    { id: 's26-1', storyId: 26, text: 'How do you balance wants and needs in preparing for baby?' },
    { id: 's26-2', storyId: 26, text: 'What economic lessons do you want to share with your child?' },
    { id: 's26-3', storyId: 26, text: 'Reflect on the value of things that can\'t be bought.' },
  ],
  // Story 27: Cryptocurrency
  27: [
    { id: 's27-1', storyId: 27, text: 'How do you think about your child\'s financial future?' },
    { id: 's27-2', storyId: 27, text: 'What role might digital currencies play in their life?' },
    { id: 's27-3', storyId: 27, text: 'Reflect on how money and value are changing.' },
  ],
  // Story 28: Wealth
  28: [
    { id: 's28-1', storyId: 28, text: 'What non-material wealth do you want to give your child?' },
    { id: 's28-2', storyId: 28, text: 'How do you define a rich and fulfilling life?' },
    { id: 's28-3', storyId: 28, text: 'Reflect on the abundance in your life right now.' },
  ],
  // Story 29: Ethics
  29: [
    { id: 's29-1', storyId: 29, text: 'What moral values are most important to teach your child?' },
    { id: 's29-2', storyId: 29, text: 'How do you make difficult decisions?' },
    { id: 's29-3', storyId: 29, text: 'Reflect on what it means to live a good life.' },
  ],
  // Story 30: Democracy
  30: [
    { id: 's30-1', storyId: 30, text: 'How do you want your child to participate in society?' },
    { id: 's30-2', storyId: 30, text: 'What civic values do you hope to instill?' },
    { id: 's30-3', storyId: 30, text: 'Reflect on the importance of voice and choice.' },
  ],
  // Story 31: Diversity
  31: [
    { id: 's31-1', storyId: 31, text: 'How will you teach your child to appreciate differences?' },
    { id: 's31-2', storyId: 31, text: 'What diverse perspectives do you want to share?' },
    { id: 's31-3', storyId: 31, text: 'Reflect on the beauty of human diversity.' },
  ],
  // Story 32: Art
  32: [
    { id: 's32-1', storyId: 32, text: 'How do you express creativity during pregnancy?' },
    { id: 's32-2', storyId: 32, text: 'What art or beauty do you want to share with your child?' },
    { id: 's32-3', storyId: 32, text: 'Reflect on the role of creativity in your life.' },
  ],
};


/**
 * Get prompts for a specific story
 * Returns 2-3 prompts (Property 14)
 * Requirements: 10.1, 10.4
 */
export function getPromptsForStory(storyId: number): JournalPrompt[] {
  const prompts = storyPrompts[storyId] || [];
  
  if (prompts.length === 0) {
    // Fall back to general prompts if no story-specific prompts
    return selectRandomPrompts(generalPrompts, JOURNAL_CONSTANTS.MAX_PROMPTS_PER_STORY);
  }
  
  // Rotate prompts based on current date for variety (Requirements: 10.4)
  const dayOfYear = getDayOfYear();
  const rotatedPrompts = rotateArray(prompts, dayOfYear % prompts.length);
  
  // Return 2-3 prompts (Property 14)
  const count = Math.min(
    Math.max(JOURNAL_CONSTANTS.MIN_PROMPTS_PER_STORY, prompts.length),
    JOURNAL_CONSTANTS.MAX_PROMPTS_PER_STORY
  );
  
  return rotatedPrompts.slice(0, count);
}

/**
 * Get general prompts (when no story is selected)
 * Requirements: 10.3
 */
export function getGeneralPrompts(): JournalPrompt[] {
  return selectRandomPrompts(generalPrompts, JOURNAL_CONSTANTS.MAX_PROMPTS_PER_STORY);
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Rotate array by n positions
 */
function rotateArray<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return arr;
  const rotation = n % arr.length;
  return [...arr.slice(rotation), ...arr.slice(0, rotation)];
}

/**
 * Select random prompts from array
 * Uses day-based seed for consistent daily selection
 */
function selectRandomPrompts(prompts: JournalPrompt[], count: number): JournalPrompt[] {
  if (prompts.length <= count) return prompts;
  
  // Use day of year as seed for consistent daily selection
  const dayOfYear = getDayOfYear();
  const shuffled = [...prompts].sort((a, b) => {
    const hashA = simpleHash(a.id + dayOfYear);
    const hashB = simpleHash(b.id + dayOfYear);
    return hashA - hashB;
  });
  
  return shuffled.slice(0, count);
}

/**
 * Simple hash function for consistent ordering
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}

export default {
  generalPrompts,
  storyPrompts,
  getPromptsForStory,
  getGeneralPrompts,
};
