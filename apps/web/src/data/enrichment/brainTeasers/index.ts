/**
 * Brain Teasers Index
 * Quick mental exercises across different cognitive domains
 */

import type { BrainTeaser, DailyTeaserSet } from '../../../types/daily';

export const brainTeasers: BrainTeaser[] = [
  // Mathematical Teasers
  {
    id: 'math-001',
    type: 'mathematical',
    question: 'If you have 3 apples and you take away 2, how many apples do you have?',
    options: ['1', '2', '3', '0'],
    answer: '2',
    explanation: 'You took 2 apples, so you have 2 apples. The question asks how many YOU have, not how many are left.',
    difficulty: 'easy'
  },
  {
    id: 'math-002',
    type: 'mathematical',
    question: 'A bat and ball cost $1.10 together. The bat costs $1.00 more than the ball. How much does the ball cost?',
    options: ['$0.10', '$0.05', '$0.15', '$0.01'],
    answer: '$0.05',
    explanation: 'If the ball costs $0.05, then the bat costs $1.05 ($1.00 more). Together: $0.05 + $1.05 = $1.10.',
    difficulty: 'medium'
  },
  {
    id: 'math-003',
    type: 'mathematical',
    question: 'What is half of 2 plus 2?',
    options: ['1', '2', '3', '4'],
    answer: '3',
    explanation: 'Following order of operations: half of 2 is 1, plus 2 equals 3.',
    difficulty: 'easy'
  },
  {
    id: 'math-004',
    type: 'mathematical',
    question: 'If 5 machines take 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
    options: ['100 minutes', '5 minutes', '20 minutes', '1 minute'],
    answer: '5 minutes',
    explanation: 'Each machine makes 1 widget in 5 minutes. So 100 machines would each make 1 widget in 5 minutes = 100 widgets.',
    difficulty: 'hard'
  },
  
  // Verbal Teasers
  {
    id: 'verbal-001',
    type: 'verbal',
    question: 'What word becomes shorter when you add two letters to it?',
    answer: 'Short',
    explanation: 'The word "short" becomes "shorter" when you add "er" - but the word itself describes something shorter!',
    difficulty: 'medium'
  },
  {
    id: 'verbal-002',
    type: 'verbal',
    question: 'What 5-letter word becomes shorter when you add 2 letters?',
    answer: 'Short',
    explanation: 'Add "er" to "short" and you get "shorter" - a word that means less long!',
    difficulty: 'medium'
  },
  {
    id: 'verbal-003',
    type: 'verbal',
    question: 'I am a word of letters three. Add two and fewer there will be. What word am I?',
    answer: 'Few',
    explanation: '"Few" has 3 letters. Add "er" to get "fewer" - which means a smaller amount!',
    difficulty: 'hard'
  },
  
  // Spatial Teasers
  {
    id: 'spatial-001',
    type: 'spatial',
    question: 'If you fold a square piece of paper in half twice, then cut off one corner, how many holes will you have when you unfold it?',
    options: ['1', '2', '4', '0'],
    answer: '1',
    explanation: 'When you cut one corner of the folded paper, you create one hole in the center when unfolded (if you cut the folded corner).',
    difficulty: 'medium'
  },
  {
    id: 'spatial-002',
    type: 'spatial',
    question: 'How many squares are on a standard 8x8 chessboard? (Count all sizes)',
    options: ['64', '204', '91', '128'],
    answer: '204',
    explanation: '64 (1x1) + 49 (2x2) + 36 (3x3) + 25 (4x4) + 16 (5x5) + 9 (6x6) + 4 (7x7) + 1 (8x8) = 204 squares.',
    difficulty: 'hard'
  },
  
  // Memory Teasers
  {
    id: 'memory-001',
    type: 'memory',
    question: 'Remember this sequence: 7, 3, 9, 1, 5. What was the third number?',
    options: ['3', '9', '1', '7'],
    answer: '9',
    explanation: 'The sequence was 7, 3, 9, 1, 5. The third number is 9.',
    difficulty: 'easy'
  },
  {
    id: 'memory-002',
    type: 'memory',
    question: 'Remember: Blue, Red, Green, Yellow, Purple. What color was between Green and Purple?',
    options: ['Blue', 'Red', 'Yellow', 'Orange'],
    answer: 'Yellow',
    explanation: 'The sequence was Blue, Red, Green, Yellow, Purple. Yellow is between Green and Purple.',
    difficulty: 'easy'
  },
  
  // Processing Speed
  {
    id: 'speed-001',
    type: 'processing-speed',
    question: 'Quick! What is 7 + 8?',
    options: ['14', '15', '16', '17'],
    answer: '15',
    explanation: '7 + 8 = 15. Speed exercises help improve mental calculation.',
    timeLimit: 5,
    difficulty: 'easy'
  },
  {
    id: 'speed-002',
    type: 'processing-speed',
    question: 'Quick! What is 12 × 11?',
    options: ['121', '132', '122', '131'],
    answer: '132',
    explanation: '12 × 11 = 132. A trick: 12 × 11 = 12 × 10 + 12 = 120 + 12 = 132.',
    timeLimit: 10,
    difficulty: 'medium'
  },
  {
    id: 'speed-003',
    type: 'processing-speed',
    question: 'Quick! Which is larger: 3/4 or 5/7?',
    options: ['3/4', '5/7', 'They are equal', 'Cannot determine'],
    answer: '3/4',
    explanation: '3/4 = 0.75 and 5/7 ≈ 0.714. So 3/4 is larger.',
    timeLimit: 15,
    difficulty: 'hard'
  }
];

/**
 * Get teasers for a specific date
 * Returns 3 teasers of varying difficulty
 */
export function getTeasersForDate(date: Date): DailyTeaserSet {
  const dateStr = date.toISOString().split('T')[0];
  const dayOfYear = getDayOfYear(date);
  
  const easyTeasers = brainTeasers.filter(t => t.difficulty === 'easy');
  const mediumTeasers = brainTeasers.filter(t => t.difficulty === 'medium');
  const hardTeasers = brainTeasers.filter(t => t.difficulty === 'hard');
  
  const selectedTeasers: BrainTeaser[] = [];
  
  if (easyTeasers.length > 0) {
    selectedTeasers.push(easyTeasers[dayOfYear % easyTeasers.length]);
  }
  if (mediumTeasers.length > 0) {
    selectedTeasers.push(mediumTeasers[(dayOfYear + 1) % mediumTeasers.length]);
  }
  if (hardTeasers.length > 0) {
    selectedTeasers.push(hardTeasers[(dayOfYear + 2) % hardTeasers.length]);
  }
  
  return {
    date: dateStr,
    teasers: selectedTeasers,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get teasers by type
 */
export function getTeasersByType(type: BrainTeaser['type']): BrainTeaser[] {
  return brainTeasers.filter(teaser => teaser.type === type);
}

/**
 * Get teasers by difficulty
 */
export function getTeasersByDifficulty(difficulty: BrainTeaser['difficulty']): BrainTeaser[] {
  return brainTeasers.filter(teaser => teaser.difficulty === difficulty);
}

/**
 * All teasers
 */
export const allTeasers = brainTeasers;

export default brainTeasers;
