/**
 * Lateral Thinking Puzzles
 * Situation puzzles that require creative thinking
 */

import type { DailyPuzzle } from '../../../types/daily';

export const lateralThinkingPuzzles: DailyPuzzle[] = [
  {
    id: 'lateral-001',
    type: 'lateral-thinking',
    title: 'The Elevator Mystery',
    difficulty: 'medium',
    content: 'A man lives on the 10th floor of a building. Every day he takes the elevator down to the ground floor to go to work. When he returns, he takes the elevator to the 7th floor and walks up the stairs to reach his apartment on the 10th floor. However, on rainy days, he takes the elevator all the way up. Why?',
    hints: [
      'Think about what might be different on rainy days.',
      'Consider what the man might be carrying on rainy days.',
      'The man is shorter than average.'
    ],
    solution: 'The man is short and can only reach the button for the 7th floor. On rainy days, he uses his umbrella to press the 10th floor button.',
    explanation: 'This puzzle challenges us to question our assumptions. We assume the man can reach all elevator buttons, but the puzzle never states this.',
    timeEstimate: 5,
    dateAdded: '2025-01-01'
  },
  {
    id: 'lateral-002',
    type: 'lateral-thinking',
    title: 'The Surgeon\'s Dilemma',
    difficulty: 'easy',
    content: 'A father and son are in a car accident. The father dies at the scene. The son is rushed to the hospital and needs immediate surgery. The surgeon looks at the boy and says, "I cannot operate on this boy, he is my son." How is this possible?',
    hints: [
      'Think about who else could be the boy\'s parent.',
      'Consider all possibilities for who the surgeon could be.',
      'Challenge your assumptions about the surgeon.'
    ],
    solution: 'The surgeon is the boy\'s mother.',
    explanation: 'This puzzle reveals unconscious bias - many people assume surgeons are male. The simple answer is that the surgeon is the boy\'s mother.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'lateral-003',
    type: 'lateral-thinking',
    title: 'The Deadly Choice',
    difficulty: 'hard',
    content: 'A man is found dead in a field. Next to him is an unopened package. There are no other people, animals, or vehicles around. How did he die?',
    hints: [
      'Think about how the man got to the field.',
      'Consider what kind of package might be found in a field.',
      'The man was not walking when he arrived at the field.'
    ],
    solution: 'The man was skydiving and his parachute (the unopened package) failed to open.',
    explanation: 'The "unopened package" is a parachute that failed to deploy. The man fell to his death while skydiving.',
    timeEstimate: 7,
    dateAdded: '2025-01-01'
  },
  {
    id: 'lateral-004',
    type: 'lateral-thinking',
    title: 'The Cabin in the Woods',
    difficulty: 'medium',
    content: 'Two people are found dead inside a cabin in the woods. The cabin is locked from the inside. There are no signs of struggle, no weapons, and no poison. The only unusual thing is that the cabin is filled with water. How did they die?',
    hints: [
      'Think about what kind of cabin this might be.',
      'Consider where cabins can be found besides forests.',
      'The cabin is not a traditional wooden structure.'
    ],
    solution: 'The cabin is the cabin of an airplane that crashed into a lake. The two people are the pilots who drowned.',
    explanation: 'The word "cabin" has multiple meanings. In this case, it refers to an airplane cockpit, not a wooden cabin in the forest.',
    timeEstimate: 6,
    dateAdded: '2025-01-01'
  },
  {
    id: 'lateral-005',
    type: 'lateral-thinking',
    title: 'The Antique Shop',
    difficulty: 'easy',
    content: 'A woman walks into an antique shop and sees a beautiful mirror. The shopkeeper says, "This mirror is over 200 years old and has never been used." The woman immediately knows the shopkeeper is lying. How?',
    hints: [
      'Think about what mirrors do.',
      'Consider what "used" means for a mirror.',
      'How would the shopkeeper know what the mirror looks like?'
    ],
    solution: 'If the mirror had never been used, no one would know what it looks like because they would never have looked into it. The shopkeeper must have looked at it to describe it.',
    explanation: 'A mirror is "used" simply by looking at it. If the shopkeeper can describe the mirror, they must have looked at it, meaning it has been used.',
    timeEstimate: 3,
    dateAdded: '2025-01-01'
  },
  {
    id: 'lateral-006',
    type: 'lateral-thinking',
    title: 'The Light Switch',
    difficulty: 'hard',
    content: 'You are outside a room with three light switches. Inside the room is a single light bulb. You can only enter the room once. How can you determine which switch controls the light bulb?',
    hints: [
      'Think about properties of light bulbs besides being on or off.',
      'Consider what happens to a light bulb when it has been on for a while.',
      'You can manipulate the switches before entering the room.'
    ],
    solution: 'Turn on switch 1 and wait 10 minutes. Turn it off and turn on switch 2. Enter the room. If the bulb is on, it\'s switch 2. If it\'s off but warm, it\'s switch 1. If it\'s off and cold, it\'s switch 3.',
    explanation: 'Light bulbs generate heat when on. By using both the light and heat properties, you can identify all three switches with one room entry.',
    timeEstimate: 8,
    dateAdded: '2025-01-01'
  }
];

export default lateralThinkingPuzzles;
