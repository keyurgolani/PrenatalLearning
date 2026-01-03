/**
 * Number Sequence Puzzles
 * Pattern recognition with numbers
 */

import type { DailyPuzzle } from '../../../types/daily';

export const numberSequencePuzzles: DailyPuzzle[] = [
  {
    id: 'sequence-001',
    type: 'number-sequence',
    title: 'Simple Addition',
    difficulty: 'easy',
    content: 'What comes next in this sequence? 2, 4, 6, 8, __',
    hints: [
      'Look at the difference between consecutive numbers.',
      'Each number increases by the same amount.',
      'These are even numbers.'
    ],
    solution: '10',
    explanation: 'This is a sequence of even numbers, each increasing by 2. The pattern is +2 for each step.',
    timeEstimate: 1,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-002',
    type: 'number-sequence',
    title: 'Perfect Squares',
    difficulty: 'easy',
    content: 'What comes next? 1, 4, 9, 16, 25, __',
    hints: [
      'Try to find what operation creates each number.',
      'Think about multiplication.',
      'Each number is something times itself.'
    ],
    solution: '36',
    explanation: 'These are perfect squares: 1², 2², 3², 4², 5². The next is 6² = 36.',
    timeEstimate: 2,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-003',
    type: 'number-sequence',
    title: 'Fibonacci',
    difficulty: 'medium',
    content: 'What comes next? 1, 1, 2, 3, 5, 8, 13, __',
    hints: [
      'Look at how each number relates to the previous ones.',
      'Try adding pairs of consecutive numbers.',
      'This is a famous mathematical sequence.'
    ],
    solution: '21',
    explanation: 'This is the Fibonacci sequence. Each number is the sum of the two preceding numbers: 8 + 13 = 21.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-004',
    type: 'number-sequence',
    title: 'Doubling',
    difficulty: 'easy',
    content: 'What comes next? 3, 6, 12, 24, __',
    hints: [
      'Compare each number to the one before it.',
      'Think about multiplication.',
      'Each number is twice the previous.'
    ],
    solution: '48',
    explanation: 'Each number doubles the previous one. 24 × 2 = 48.',
    timeEstimate: 1,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-005',
    type: 'number-sequence',
    title: 'Triangular Numbers',
    difficulty: 'medium',
    content: 'What comes next? 1, 3, 6, 10, 15, __',
    hints: [
      'Look at the differences between consecutive numbers.',
      'The differences themselves form a pattern.',
      'Think about stacking objects in a triangle.'
    ],
    solution: '21',
    explanation: 'These are triangular numbers. The differences are 2, 3, 4, 5, so the next difference is 6. 15 + 6 = 21.',
    timeEstimate: 4,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-006',
    type: 'number-sequence',
    title: 'Prime Numbers',
    difficulty: 'medium',
    content: 'What comes next? 2, 3, 5, 7, 11, 13, __',
    hints: [
      'What special property do all these numbers share?',
      'Think about divisibility.',
      'These numbers can only be divided by 1 and themselves.'
    ],
    solution: '17',
    explanation: 'These are prime numbers - numbers divisible only by 1 and themselves. The next prime after 13 is 17.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-007',
    type: 'number-sequence',
    title: 'Alternating Pattern',
    difficulty: 'hard',
    content: 'What comes next? 1, 4, 2, 8, 3, 12, 4, __',
    hints: [
      'Try looking at every other number separately.',
      'There might be two patterns interleaved.',
      'Odd positions: 1, 2, 3, 4... Even positions: 4, 8, 12...'
    ],
    solution: '16',
    explanation: 'Two sequences are interleaved: 1, 2, 3, 4, 5... and 4, 8, 12, 16... The next number in the second sequence is 16.',
    timeEstimate: 5,
    dateAdded: '2025-01-01'
  },
  {
    id: 'sequence-008',
    type: 'number-sequence',
    title: 'Cube Numbers',
    difficulty: 'hard',
    content: 'What comes next? 1, 8, 27, 64, 125, __',
    hints: [
      'Think about three-dimensional shapes.',
      'Each number is something multiplied by itself three times.',
      'These are perfect cubes.'
    ],
    solution: '216',
    explanation: 'These are cube numbers: 1³, 2³, 3³, 4³, 5³. The next is 6³ = 216.',
    timeEstimate: 4,
    dateAdded: '2025-01-01'
  }
];

export default numberSequencePuzzles;
