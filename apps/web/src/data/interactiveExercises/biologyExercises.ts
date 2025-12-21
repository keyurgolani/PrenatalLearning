/**
 * Biology Topic Interactive Exercises
 * 
 * Interactive exercises for biology topics:
 * - DNA (ID: 9): base pair matching, replication sequencing
 * - Body Systems (ID: 10): organ-function matching
 * - Microbiome (ID: 11): ecosystem scenarios
 * - Evolution (ID: 12): timeline sequencing
 * 
 * Requirements: 4.3
 */

import type {
  InteractiveExercise,
  MatchingExercise,
  SequencingExercise,
  ScenarioExercise,
  QuizExercise,
} from '../../types/exercises';

// ============================================
// DNA Exercises (Topic ID: 9)
// ============================================

const dnaBasePairMatching: MatchingExercise = {
  id: 'dna-base-pair',
  type: 'matching',
  title: 'DNA Base Pairing',
  description: 'Match each DNA base with its complementary partner.',
  duration: 5,
  topicId: 9,
  instructions: 'In DNA, bases always pair in specific ways. Match each base with its partner.',
  pairs: [
    { id: 'dbp-1', left: 'Adenine (A)', right: 'Thymine (T)' },
    { id: 'dbp-2', left: 'Thymine (T)', right: 'Adenine (A)' },
    { id: 'dbp-3', left: 'Cytosine (C)', right: 'Guanine (G)' },
    { id: 'dbp-4', left: 'Guanine (G)', right: 'Cytosine (C)' },
  ],
};

const dnaReplicationSequencing: SequencingExercise = {
  id: 'dna-replication-seq',
  type: 'sequencing',
  title: 'DNA Replication Steps',
  description: 'Put the steps of DNA replication in the correct order.',
  duration: 5,
  topicId: 9,
  instructions: 'Arrange these steps in the order they occur during DNA copying.',
  items: [
    { id: 'drs-1', content: 'DNA double helix unwinds and unzips', correctPosition: 0 },
    { id: 'drs-2', content: 'The two strands separate', correctPosition: 1 },
    { id: 'drs-3', content: 'Free nucleotides match with exposed bases', correctPosition: 2 },
    { id: 'drs-4', content: 'New complementary strands form', correctPosition: 3 },
    { id: 'drs-5', content: 'Two identical DNA molecules result', correctPosition: 4 },
  ],
};

// ============================================
// Body Systems Exercises (Topic ID: 10)
// ============================================

const bodySystemsMatching: MatchingExercise = {
  id: 'body-systems-matching',
  type: 'matching',
  title: 'Organs and Their Functions',
  description: 'Match each organ with its primary function.',
  duration: 5,
  topicId: 10,
  instructions: 'Connect each organ to what it does in your body.',
  pairs: [
    { id: 'bsm-1', left: 'Heart', right: 'Pumps blood throughout the body' },
    { id: 'bsm-2', left: 'Lungs', right: 'Exchange oxygen and carbon dioxide' },
    { id: 'bsm-3', left: 'Brain', right: 'Controls thoughts, movements, and body functions' },
    { id: 'bsm-4', left: 'Stomach', right: 'Breaks down food with acids and enzymes' },
    { id: 'bsm-5', left: 'Kidneys', right: 'Filter waste from blood and make urine' },
    { id: 'bsm-6', left: 'Liver', right: 'Processes nutrients and removes toxins' },
  ],
};

const bodySystemsQuiz: QuizExercise = {
  id: 'body-systems-quiz',
  type: 'quiz',
  title: 'Body Systems Quiz',
  description: 'Test your knowledge of how body systems work together.',
  duration: 5,
  topicId: 10,
  questions: [
    {
      id: 'bsq-1',
      question: 'Which system carries oxygen from your lungs to your cells?',
      options: ['Nervous system', 'Circulatory system', 'Digestive system', 'Skeletal system'],
      correctIndex: 1,
      explanation: 'The circulatory system (heart and blood vessels) carries oxygen-rich blood from the lungs to every cell in your body.',
    },
    {
      id: 'bsq-2',
      question: 'Your baby\'s heart starts beating at about what age?',
      options: ['3 weeks', '3 months', '6 months', 'At birth'],
      correctIndex: 0,
      explanation: 'A baby\'s heart begins beating around 3 weeks after conception—often before the mother even knows she\'s pregnant!',
    },
    {
      id: 'bsq-3',
      question: 'How many times does the average heart beat in a day?',
      options: ['About 1,000', 'About 10,000', 'About 100,000', 'About 1,000,000'],
      correctIndex: 2,
      explanation: 'Your heart beats about 100,000 times every day, pumping blood through 60,000 miles of blood vessels!',
    },
  ],
};


// ============================================
// Microbiome Exercises (Topic ID: 11)
// ============================================

const microbiomeScenario1: ScenarioExercise = {
  id: 'microbiome-scenario-1',
  type: 'scenario',
  title: 'The Gut Garden',
  description: 'Explore how your microbiome affects your health.',
  duration: 5,
  topicId: 11,
  scenario: 'Your gut contains trillions of bacteria—more bacterial cells than human cells in your entire body! These tiny organisms help digest food, produce vitamins, and even affect your mood. You\'ve been prescribed antibiotics for an infection. What should you consider?',
  choices: [
    {
      id: 'ms1-1',
      text: 'Antibiotics only kill bad bacteria, so there\'s nothing to worry about',
      feedback: 'Unfortunately, antibiotics can\'t distinguish between harmful and helpful bacteria. They often kill beneficial gut bacteria too, which is why some people experience digestive issues during antibiotic treatment.',
      isOptimal: false,
    },
    {
      id: 'ms1-2',
      text: 'Take the antibiotics as prescribed, but support your gut with probiotics and fiber',
      feedback: 'Great thinking! While antibiotics are sometimes necessary, you can help your microbiome recover by eating probiotic foods (yogurt, fermented foods) and fiber-rich foods that feed good bacteria.',
      isOptimal: true,
    },
    {
      id: 'ms1-3',
      text: 'Skip the antibiotics to protect your microbiome',
      feedback: 'If your doctor prescribed antibiotics, the infection likely needs treatment. Untreated infections can be dangerous. The better approach is to take them as prescribed while supporting gut health.',
      isOptimal: false,
    },
  ],
};

const microbiomeScenario2: ScenarioExercise = {
  id: 'microbiome-scenario-2',
  type: 'scenario',
  title: 'Baby\'s First Microbes',
  description: 'Learn how babies get their microbiome.',
  duration: 5,
  topicId: 11,
  scenario: 'Before birth, a baby\'s gut is nearly sterile. During and after birth, babies are colonized by bacteria that will shape their health for life. How does a baby typically get their first microbiome?',
  choices: [
    {
      id: 'ms2-1',
      text: 'From the hospital environment',
      feedback: 'While hospital bacteria can colonize babies, the primary source is the mother. Vaginal birth exposes babies to beneficial bacteria, and breastfeeding provides more microbes plus food for them.',
      isOptimal: false,
    },
    {
      id: 'ms2-2',
      text: 'From the mother during birth and through breastfeeding',
      feedback: 'Exactly! Babies receive their first microbes from their mother during vaginal birth and continue to receive beneficial bacteria through breastfeeding. This is one of nature\'s first gifts to a newborn.',
      isOptimal: true,
    },
    {
      id: 'ms2-3',
      text: 'Babies are born with a complete microbiome',
      feedback: 'Actually, babies are born with very few gut bacteria. Their microbiome develops rapidly in the first years of life, shaped by birth method, feeding, environment, and diet.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Evolution Exercises (Topic ID: 12)
// ============================================

const evolutionTimelineSequencing: SequencingExercise = {
  id: 'evolution-timeline-seq',
  type: 'sequencing',
  title: 'Evolution Timeline',
  description: 'Arrange these evolutionary milestones in chronological order.',
  duration: 5,
  topicId: 12,
  instructions: 'Put these events in order from earliest to most recent.',
  items: [
    { id: 'ets-1', content: 'First single-celled life appears', correctPosition: 0 },
    { id: 'ets-2', content: 'First multicellular organisms evolve', correctPosition: 1 },
    { id: 'ets-3', content: 'Fish develop and dominate the oceans', correctPosition: 2 },
    { id: 'ets-4', content: 'Life moves onto land', correctPosition: 3 },
    { id: 'ets-5', content: 'Dinosaurs rule the Earth', correctPosition: 4 },
    { id: 'ets-6', content: 'Mammals diversify after dinosaur extinction', correctPosition: 5 },
    { id: 'ets-7', content: 'Humans evolve in Africa', correctPosition: 6 },
  ],
};

const evolutionQuiz: QuizExercise = {
  id: 'evolution-quiz',
  type: 'quiz',
  title: 'Understanding Evolution',
  description: 'Test your knowledge of how evolution works.',
  duration: 5,
  topicId: 12,
  questions: [
    {
      id: 'eq-1',
      question: 'What is natural selection?',
      options: [
        'Animals choosing their mates',
        'Organisms with helpful traits surviving and reproducing more',
        'Scientists selecting which species to study',
        'Nature destroying weak species',
      ],
      correctIndex: 1,
      explanation: 'Natural selection means organisms with traits that help them survive are more likely to reproduce, passing those helpful traits to the next generation.',
    },
    {
      id: 'eq-2',
      question: 'Humans share about what percentage of DNA with chimpanzees?',
      options: ['50%', '75%', '98%', '100%'],
      correctIndex: 2,
      explanation: 'Humans and chimpanzees share about 98% of their DNA, reflecting our common ancestor from about 6-7 million years ago.',
    },
    {
      id: 'eq-3',
      question: 'How long did it take for life to evolve from single cells to humans?',
      options: ['Thousands of years', 'Millions of years', 'Billions of years', 'Hundreds of years'],
      correctIndex: 2,
      explanation: 'Life began about 3.8 billion years ago. It took billions of years of evolution to produce the diversity of life we see today, including humans.',
    },
  ],
};

// ============================================
// Export Biology Exercises
// ============================================

export const biologyExercises: Record<number, InteractiveExercise[]> = {
  // DNA (Topic ID: 9)
  9: [dnaBasePairMatching, dnaReplicationSequencing],
  // Body Systems (Topic ID: 10)
  10: [bodySystemsMatching, bodySystemsQuiz],
  // Microbiome (Topic ID: 11)
  11: [microbiomeScenario1, microbiomeScenario2],
  // Evolution (Topic ID: 12)
  12: [evolutionTimelineSequencing, evolutionQuiz],
};
