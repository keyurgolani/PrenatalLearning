/**
 * Mathematics Topic Interactive Exercises
 * 
 * Interactive exercises for math topics:
 * - Numbers (ID: 13): pattern recognition quiz
 * - Infinity (ID: 14): concept scenarios
 * - Fibonacci (ID: 15): sequence completion
 * - Probability (ID: 16): scenario-based decisions
 * 
 * Requirements: 4.2
 */

import type {
  InteractiveExercise,
  QuizExercise,
  FillBlankExercise,
  ScenarioExercise,
  SequencingExercise,
} from '../../types/exercises';

// ============================================
// Numbers Exercises (Topic ID: 13)
// ============================================

const numbersPatternQuiz: QuizExercise = {
  id: 'numbers-pattern-quiz',
  type: 'quiz',
  title: 'Pattern Recognition',
  description: 'Identify the patterns hidden in these number sequences.',
  duration: 5,
  topicId: 13,
  questions: [
    {
      id: 'npq-1',
      question: 'What comes next in this sequence? 2, 4, 6, 8, __',
      options: ['9', '10', '12', '16'],
      correctIndex: 1,
      explanation: 'This is a sequence of even numbers, each increasing by 2. The next number is 10.',
    },
    {
      id: 'npq-2',
      question: 'What pattern do you see? 1, 4, 9, 16, 25, __',
      options: ['30', '36', '49', '32'],
      correctIndex: 1,
      explanation: 'These are perfect squares: 1², 2², 3², 4², 5². The next is 6² = 36.',
    },
    {
      id: 'npq-3',
      question: 'Complete the pattern: 3, 6, 12, 24, __',
      options: ['36', '48', '30', '96'],
      correctIndex: 1,
      explanation: 'Each number doubles the previous one. 24 × 2 = 48.',
    },
    {
      id: 'npq-4',
      question: 'What mathematical pattern appears in sunflower seeds, pinecones, and galaxies?',
      options: ['Random distribution', 'Fibonacci spirals', 'Perfect circles', 'Straight lines'],
      correctIndex: 1,
      explanation: 'The Fibonacci sequence creates spiral patterns found throughout nature, from tiny seeds to massive galaxies.',
    },
  ],
};

// ============================================
// Infinity Exercises (Topic ID: 14)
// ============================================

const infinityScenario1: ScenarioExercise = {
  id: 'infinity-scenario-1',
  type: 'scenario',
  title: 'Hilbert\'s Hotel',
  description: 'Explore the strange properties of infinity through a famous thought experiment.',
  duration: 5,
  topicId: 14,
  scenario: 'Imagine a hotel with infinitely many rooms, all occupied. A new guest arrives. The manager asks each guest to move to the next room (room 1 to room 2, room 2 to room 3, and so on forever). Now room 1 is empty! The new guest checks in. How is this possible?',
  choices: [
    {
      id: 'is1-1',
      text: 'It\'s impossible—if all rooms are full, there\'s no space',
      feedback: 'This seems logical, but infinity doesn\'t follow normal rules! With infinite rooms, there\'s always "room for one more" because you can always shift everyone down.',
      isOptimal: false,
    },
    {
      id: 'is1-2',
      text: 'Infinity plus one still equals infinity',
      feedback: 'Exactly! This is the key insight. Infinity is not a number but a concept. Adding to infinity doesn\'t make it "bigger"—it\'s still infinite. This is what makes infinity so fascinating and counterintuitive.',
      isOptimal: true,
    },
    {
      id: 'is1-3',
      text: 'Someone must leave for the new guest to enter',
      feedback: 'In a finite hotel, yes. But with infinite rooms, no one needs to leave. Everyone just shifts one room over, and a new room appears at the beginning!',
      isOptimal: false,
    },
  ],
};

const infinityScenario2: ScenarioExercise = {
  id: 'infinity-scenario-2',
  type: 'scenario',
  title: 'Counting Forever',
  description: 'Consider different sizes of infinity.',
  duration: 5,
  topicId: 14,
  scenario: 'There are infinitely many counting numbers (1, 2, 3, ...) and infinitely many fractions. But mathematician Georg Cantor proved that there are MORE real numbers (including decimals like π) than counting numbers! How can one infinity be bigger than another?',
  choices: [
    {
      id: 'is2-1',
      text: 'All infinities must be the same size',
      feedback: 'This seems intuitive, but Cantor proved otherwise! Some infinities are genuinely larger than others. The infinity of real numbers is "uncountable"—you can\'t list them all even with infinite time.',
      isOptimal: false,
    },
    {
      id: 'is2-2',
      text: 'You can pair counting numbers with fractions, but not with all real numbers',
      feedback: 'Correct! You can match every counting number to a fraction (they\'re both "countable infinities"). But real numbers are so dense that no matter how you try to list them, you\'ll always miss some.',
      isOptimal: true,
    },
    {
      id: 'is2-3',
      text: 'This must be a mathematical trick or error',
      feedback: 'Cantor\'s proof is rigorous and accepted by mathematicians worldwide. It reveals that infinity is far stranger and more wonderful than we might imagine!',
      isOptimal: false,
    },
  ],
};


// ============================================
// Fibonacci Exercises (Topic ID: 15)
// ============================================

const fibonacciSequenceCompletion: FillBlankExercise = {
  id: 'fibonacci-sequence',
  type: 'fill-blank',
  title: 'Complete the Fibonacci Sequence',
  description: 'Fill in the missing numbers in the famous Fibonacci sequence.',
  duration: 5,
  topicId: 15,
  sentences: [
    {
      id: 'fib-1',
      template: 'The Fibonacci sequence starts: 1, 1, 2, 3, 5, ___',
      answer: '8',
      acceptableAnswers: ['8', 'eight'],
      hint: 'Add the two previous numbers: 3 + 5 = ?',
    },
    {
      id: 'fib-2',
      template: 'Continuing the sequence: 5, 8, 13, ___',
      answer: '21',
      acceptableAnswers: ['21', 'twenty-one', 'twenty one'],
      hint: 'Add the two previous numbers: 8 + 13 = ?',
    },
    {
      id: 'fib-3',
      template: 'The pattern continues: 13, 21, 34, ___',
      answer: '55',
      acceptableAnswers: ['55', 'fifty-five', 'fifty five'],
      hint: 'Add the two previous numbers: 21 + 34 = ?',
    },
  ],
};

const fibonacciNatureSequencing: SequencingExercise = {
  id: 'fibonacci-nature-seq',
  type: 'sequencing',
  title: 'Fibonacci in Nature',
  description: 'Order these natural objects by how many Fibonacci spirals they typically have.',
  duration: 5,
  topicId: 15,
  instructions: 'Arrange from fewest to most spirals (all are Fibonacci numbers!).',
  items: [
    { id: 'fn-1', content: 'Lily flower petals (3)', correctPosition: 0 },
    { id: 'fn-2', content: 'Buttercup petals (5)', correctPosition: 1 },
    { id: 'fn-3', content: 'Daisy petals (often 13)', correctPosition: 2 },
    { id: 'fn-4', content: 'Pinecone spirals (often 21)', correctPosition: 3 },
    { id: 'fn-5', content: 'Sunflower seed spirals (often 34 or 55)', correctPosition: 4 },
  ],
};

// ============================================
// Probability Exercises (Topic ID: 16)
// ============================================

const probabilityScenario1: ScenarioExercise = {
  id: 'probability-scenario-1',
  type: 'scenario',
  title: 'The Birthday Paradox',
  description: 'Explore a surprising result in probability.',
  duration: 5,
  topicId: 16,
  scenario: 'In a room of just 23 people, there\'s a 50% chance that two people share a birthday. With 70 people, it\'s 99.9% certain! This seems impossible—there are 365 days in a year. How can the probability be so high with so few people?',
  choices: [
    {
      id: 'ps1-1',
      text: 'The math must be wrong—23 people is too few',
      feedback: 'The math is correct! Our intuition fails because we think about the chance of someone sharing YOUR birthday. But we\'re asking about ANY two people sharing ANY birthday—many more possible matches.',
      isOptimal: false,
    },
    {
      id: 'ps1-2',
      text: 'We\'re comparing every person to every other person, creating many possible matches',
      feedback: 'Exactly! With 23 people, there are 253 different pairs to compare. Each pair has a small chance of matching, but with so many pairs, the overall probability adds up quickly.',
      isOptimal: true,
    },
    {
      id: 'ps1-3',
      text: 'Birthdays aren\'t evenly distributed throughout the year',
      feedback: 'While true (more babies are born in certain months), this isn\'t the main reason. The paradox works even with perfectly distributed birthdays because of how many pairs we\'re comparing.',
      isOptimal: false,
    },
  ],
};

const probabilityScenario2: ScenarioExercise = {
  id: 'probability-scenario-2',
  type: 'scenario',
  title: 'The Monty Hall Problem',
  description: 'A famous probability puzzle from a game show.',
  duration: 5,
  topicId: 16,
  scenario: 'You\'re on a game show with three doors. Behind one is a car; behind the others, goats. You pick door 1. The host, who knows what\'s behind each door, opens door 3 to reveal a goat. He asks: "Do you want to switch to door 2?" Should you switch?',
  choices: [
    {
      id: 'ps2-1',
      text: 'It doesn\'t matter—it\'s 50/50 between the two remaining doors',
      feedback: 'This is what most people think, but it\'s wrong! Your original choice had a 1/3 chance of being right. The other two doors together had 2/3. When the host reveals a goat, that 2/3 probability transfers to the remaining door.',
      isOptimal: false,
    },
    {
      id: 'ps2-2',
      text: 'Yes, switch! Switching gives you a 2/3 chance of winning',
      feedback: 'Correct! This counterintuitive result has been proven mathematically and through simulations. The host\'s action gives you information—switching doubles your chances of winning!',
      isOptimal: true,
    },
    {
      id: 'ps2-3',
      text: 'No, stick with your original choice—trust your gut',
      feedback: 'While trusting your gut feels right, the math says otherwise. Your original choice had only a 1/3 chance. Switching gives you 2/3. Always switch!',
      isOptimal: false,
    },
  ],
};

// ============================================
// Export Math Exercises
// ============================================

export const mathExercises: Record<number, InteractiveExercise[]> = {
  // Numbers (Topic ID: 13)
  13: [numbersPatternQuiz],
  // Infinity (Topic ID: 14)
  14: [infinityScenario1, infinityScenario2],
  // Fibonacci (Topic ID: 15)
  15: [fibonacciSequenceCompletion, fibonacciNatureSequencing],
  // Probability (Topic ID: 16)
  16: [probabilityScenario1, probabilityScenario2],
};
