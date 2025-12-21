/**
 * Science Topic Interactive Exercises
 * 
 * Interactive exercises for science topics:
 * - Big Bang (ID: 1): timeline sequencing, scale quiz
 * - Gravity (ID: 2): cause-effect matching, concept quiz
 * - Quantum (ID: 3): scenario-based thought experiments
 * - Stars (ID: 4): lifecycle sequencing, element matching
 * 
 * Requirements: 4.1
 */

import type {
  InteractiveExercise,
  QuizExercise,
  MatchingExercise,
  SequencingExercise,
  ScenarioExercise,
} from '../../types/exercises';

// ============================================
// Big Bang Exercises (Topic ID: 1)
// ============================================

const bigBangTimelineSequencing: SequencingExercise = {
  id: 'bigbang-timeline-seq',
  type: 'sequencing',
  title: 'Cosmic Timeline',
  description: 'Put these cosmic events in the order they occurred, from earliest to most recent.',
  duration: 5,
  topicId: 1,
  instructions: 'Drag and drop to arrange these events in chronological order.',
  items: [
    { id: 'bb-1', content: 'The Big Bang occurs', correctPosition: 0 },
    { id: 'bb-2', content: 'First atoms (hydrogen and helium) form', correctPosition: 1 },
    { id: 'bb-3', content: 'First stars ignite', correctPosition: 2 },
    { id: 'bb-4', content: 'Heavy elements created in supernovas', correctPosition: 3 },
    { id: 'bb-5', content: 'Our solar system forms', correctPosition: 4 },
    { id: 'bb-6', content: 'Life begins on Earth', correctPosition: 5 },
  ],
};

const bigBangScaleQuiz: QuizExercise = {
  id: 'bigbang-scale-quiz',
  type: 'quiz',
  title: 'Cosmic Scale Quiz',
  description: 'Test your understanding of the scale and timeline of the universe.',
  duration: 5,
  topicId: 1,
  questions: [
    {
      id: 'bbq-1',
      question: 'How old is the universe?',
      options: ['4.6 billion years', '13.8 billion years', '1 million years', '100 billion years'],
      correctIndex: 1,
      explanation: 'The universe is approximately 13.8 billion years old, dating back to the Big Bang.',
    },
    {
      id: 'bbq-2',
      question: 'What were the first elements created after the Big Bang?',
      options: ['Carbon and oxygen', 'Iron and gold', 'Hydrogen and helium', 'Nitrogen and sulfur'],
      correctIndex: 2,
      explanation: 'Hydrogen and helium were the first elements to form as the universe cooled after the Big Bang.',
    },
    {
      id: 'bbq-3',
      question: 'Where were the heavier elements in your body (like carbon and iron) created?',
      options: ['In the Big Bang', 'Inside stars', 'On Earth', 'In black holes'],
      correctIndex: 1,
      explanation: 'Heavy elements were forged inside stars through nuclear fusion and spread across space when stars exploded.',
    },
  ],
};


// ============================================
// Gravity Exercises (Topic ID: 2)
// ============================================

const gravityCauseEffectMatching: MatchingExercise = {
  id: 'gravity-cause-effect',
  type: 'matching',
  title: 'Gravity Cause and Effect',
  description: 'Match each gravitational phenomenon with its effect.',
  duration: 5,
  topicId: 2,
  instructions: 'Match each cause on the left with its effect on the right.',
  pairs: [
    { id: 'gm-1', left: 'Earth\'s gravity', right: 'Keeps us on the ground' },
    { id: 'gm-2', left: 'Sun\'s gravity', right: 'Keeps planets in orbit' },
    { id: 'gm-3', left: 'Moon\'s gravity', right: 'Creates ocean tides' },
    { id: 'gm-4', left: 'Black hole gravity', right: 'Nothing can escape, not even light' },
    { id: 'gm-5', left: 'Massive objects bending spacetime', right: 'Light bends around galaxies' },
  ],
};

const gravityConceptQuiz: QuizExercise = {
  id: 'gravity-concept-quiz',
  type: 'quiz',
  title: 'Understanding Gravity',
  description: 'Test your knowledge of how gravity works.',
  duration: 5,
  topicId: 2,
  questions: [
    {
      id: 'gq-1',
      question: 'According to Einstein, what is gravity?',
      options: [
        'A force that pulls objects together',
        'The bending of space and time by massive objects',
        'Magnetic attraction between planets',
        'The rotation of the Earth',
      ],
      correctIndex: 1,
      explanation: 'Einstein showed that gravity is actually the bending of spacetime by massive objects, not a pulling force.',
    },
    {
      id: 'gq-2',
      question: 'What happens to time near a massive object like a black hole?',
      options: ['Time speeds up', 'Time slows down', 'Time stays the same', 'Time reverses'],
      correctIndex: 1,
      explanation: 'Time moves slower near massive objects. This effect, called time dilation, has been measured with precise clocks.',
    },
    {
      id: 'gq-3',
      question: 'Why do astronauts float in the space station?',
      options: [
        'There is no gravity in space',
        'They are falling around Earth continuously',
        'The space station creates anti-gravity',
        'They are too far from Earth',
      ],
      correctIndex: 1,
      explanation: 'Astronauts are in constant freefall around Earth. They and the station fall together, creating the sensation of weightlessness.',
    },
  ],
};

// ============================================
// Quantum Exercises (Topic ID: 3)
// ============================================

const quantumScenario1: ScenarioExercise = {
  id: 'quantum-scenario-1',
  type: 'scenario',
  title: 'The Double-Slit Mystery',
  description: 'Explore the strange behavior of particles in the quantum world.',
  duration: 5,
  topicId: 3,
  scenario: 'Scientists shoot electrons one at a time through two slits in a barrier. When they don\'t observe which slit each electron goes through, the electrons create an interference pattern on the screen behind—as if each electron went through BOTH slits at once! But when they add a detector to see which slit the electron passes through, the interference pattern disappears. What do you think this tells us about the nature of reality?',
  choices: [
    {
      id: 'qs1-1',
      text: 'Electrons are just very small balls that we can\'t see properly',
      feedback: 'This classical view doesn\'t explain the interference pattern. Particles in the quantum world behave differently than everyday objects—they can exist as waves of probability until observed.',
      isOptimal: false,
    },
    {
      id: 'qs1-2',
      text: 'Observation somehow affects what the electron does',
      feedback: 'Exactly! In quantum mechanics, the act of observation appears to "collapse" the wave function, forcing the particle to choose a definite state. This is one of the most profound mysteries in physics.',
      isOptimal: true,
    },
    {
      id: 'qs1-3',
      text: 'The experiment must have errors',
      feedback: 'This experiment has been repeated countless times with the same results. The quantum world truly behaves in ways that seem impossible by everyday standards.',
      isOptimal: false,
    },
  ],
};

const quantumScenario2: ScenarioExercise = {
  id: 'quantum-scenario-2',
  type: 'scenario',
  title: 'Schrödinger\'s Thought Experiment',
  description: 'Consider the famous thought experiment about quantum superposition.',
  duration: 5,
  topicId: 3,
  scenario: 'Imagine a cat in a sealed box with a device that has a 50% chance of releasing poison based on a quantum event. According to quantum mechanics, until we open the box and observe, the quantum event exists in superposition—both happened and didn\'t happen. Does this mean the cat is both alive and dead at the same time?',
  choices: [
    {
      id: 'qs2-1',
      text: 'Yes, the cat is truly both alive and dead until observed',
      feedback: 'This is one interpretation! The Copenhagen interpretation suggests that quantum superposition applies until observation. However, most physicists believe something called "decoherence" prevents such large-scale superpositions.',
      isOptimal: false,
    },
    {
      id: 'qs2-2',
      text: 'No, the cat is either alive or dead—we just don\'t know which',
      feedback: 'This is the "hidden variables" view. While intuitive, experiments have shown that quantum particles don\'t have definite states before measurement—the uncertainty is fundamental, not just our ignorance.',
      isOptimal: false,
    },
    {
      id: 'qs2-3',
      text: 'Quantum rules work for tiny particles but break down for large objects like cats',
      feedback: 'This is closest to current understanding! Through a process called decoherence, quantum superpositions become classical states very quickly for large objects. The cat is never truly in superposition.',
      isOptimal: true,
    },
  ],
};


// ============================================
// Stars Exercises (Topic ID: 4)
// ============================================

const starsLifecycleSequencing: SequencingExercise = {
  id: 'stars-lifecycle-seq',
  type: 'sequencing',
  title: 'Life of a Star',
  description: 'Arrange the stages of a star\'s life cycle in the correct order.',
  duration: 5,
  topicId: 4,
  instructions: 'Put these stages of a star\'s life in order from birth to death.',
  items: [
    { id: 'sl-1', content: 'Gas cloud (nebula) begins to collapse', correctPosition: 0 },
    { id: 'sl-2', content: 'Protostar forms and heats up', correctPosition: 1 },
    { id: 'sl-3', content: 'Nuclear fusion ignites—a star is born', correctPosition: 2 },
    { id: 'sl-4', content: 'Star shines steadily for billions of years', correctPosition: 3 },
    { id: 'sl-5', content: 'Star expands into a red giant', correctPosition: 4 },
    { id: 'sl-6', content: 'Star dies (supernova or white dwarf)', correctPosition: 5 },
  ],
};

const starsElementMatching: MatchingExercise = {
  id: 'stars-element-matching',
  type: 'matching',
  title: 'Elements from Stars',
  description: 'Match each element with where it was created.',
  duration: 5,
  topicId: 4,
  instructions: 'Match each element with its cosmic origin.',
  pairs: [
    { id: 'sem-1', left: 'Hydrogen', right: 'Created in the Big Bang' },
    { id: 'sem-2', left: 'Helium', right: 'Created in the Big Bang and in stars' },
    { id: 'sem-3', left: 'Carbon and Oxygen', right: 'Fused in the cores of stars' },
    { id: 'sem-4', left: 'Iron', right: 'Created in massive stars before they explode' },
    { id: 'sem-5', left: 'Gold and Uranium', right: 'Created in supernova explosions' },
  ],
};

// ============================================
// Export Science Exercises
// ============================================

export const scienceExercises: Record<number, InteractiveExercise[]> = {
  // Big Bang (Topic ID: 1)
  1: [bigBangTimelineSequencing, bigBangScaleQuiz],
  // Gravity (Topic ID: 2)
  2: [gravityCauseEffectMatching, gravityConceptQuiz],
  // Quantum (Topic ID: 3)
  3: [quantumScenario1, quantumScenario2],
  // Stars (Topic ID: 4)
  4: [starsLifecycleSequencing, starsElementMatching],
};
