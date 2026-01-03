/**
 * Classic Riddles
 * Traditional word puzzles and brain teasers
 */

import type { DailyPuzzle } from '../../../types/daily';

export const riddlePuzzles: DailyPuzzle[] = [
  {
    id: 'riddle-001',
    type: 'riddle',
    title: 'The Endless Resource',
    difficulty: 'easy',
    content: 'The more you take, the more you leave behind. What am I?',
    hints: [
      'Think about walking.',
      'What do you create when you walk?',
      'Look behind you after a walk on the beach.'
    ],
    solution: 'Footsteps',
    explanation: 'When you walk, each step you take leaves a footprint behind. The more steps you take, the more footprints you leave.',
    timeEstimate: 2,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-002',
    type: 'riddle',
    title: 'The Weightless Wonder',
    difficulty: 'easy',
    content: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?',
    hints: [
      'Think about representations of the world.',
      'You might find me on a wall or in a book.',
      'I show you places without being those places.'
    ],
    solution: 'A map',
    explanation: 'A map shows cities, mountains, and water, but only as symbols and drawings, not the real things.',
    timeEstimate: 2,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-003',
    type: 'riddle',
    title: 'The Silent Speaker',
    difficulty: 'medium',
    content: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?',
    hints: [
      'Think about sounds that travel.',
      'What happens when you shout in a canyon?',
      'I repeat what you say.'
    ],
    solution: 'An echo',
    explanation: 'An echo "speaks" by reflecting sound waves and "hears" the original sound, but has no physical form. Wind can carry sound to create echoes.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-004',
    type: 'riddle',
    title: 'The Keeper of Secrets',
    difficulty: 'medium',
    content: 'I have keys but no locks. I have space but no room. You can enter but cannot go inside. What am I?',
    hints: [
      'Think about things with keys that aren\'t doors.',
      'What kind of space isn\'t physical?',
      'You use me to write.'
    ],
    solution: 'A keyboard',
    explanation: 'A keyboard has keys (but no locks), a space bar (but no room), and you can press enter (but cannot physically go inside).',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-005',
    type: 'riddle',
    title: 'The Invisible Force',
    difficulty: 'easy',
    content: 'You can catch me but cannot throw me. What am I?',
    hints: [
      'Think about things you "catch" that aren\'t objects.',
      'What might you catch in winter?',
      'It\'s related to health.'
    ],
    solution: 'A cold',
    explanation: 'You can catch a cold (get sick), but you cannot throw it like a physical object.',
    timeEstimate: 2,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-006',
    type: 'riddle',
    title: 'The Paradox',
    difficulty: 'hard',
    content: 'What can travel around the world while staying in a corner?',
    hints: [
      'Think about things that go on letters or packages.',
      'What stays in one place on an envelope?',
      'It\'s small and sticky.'
    ],
    solution: 'A stamp',
    explanation: 'A postage stamp stays in the corner of an envelope but can travel around the world as the letter is delivered.',
    timeEstimate: 4,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-007',
    type: 'riddle',
    title: 'The Living Contradiction',
    difficulty: 'medium',
    content: 'I am not alive, but I grow. I don\'t have lungs, but I need air. I don\'t have a mouth, but water kills me. What am I?',
    hints: [
      'Think about something dangerous.',
      'What grows but isn\'t living?',
      'Firefighters fight against me.'
    ],
    solution: 'Fire',
    explanation: 'Fire grows (spreads) but isn\'t alive. It needs oxygen (air) to burn, and water extinguishes it.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'riddle-008',
    type: 'riddle',
    title: 'The Time Traveler',
    difficulty: 'hard',
    content: 'I am always coming but never arrive. What am I?',
    hints: [
      'Think about time.',
      'What is always in the future?',
      'It\'s always one day away.'
    ],
    solution: 'Tomorrow',
    explanation: 'Tomorrow is always coming (it\'s always the next day), but when it arrives, it becomes today, so tomorrow never actually arrives.',
    timeEstimate: 4,
    dateAdded: '2025-01-01'
  }
];

export default riddlePuzzles;
