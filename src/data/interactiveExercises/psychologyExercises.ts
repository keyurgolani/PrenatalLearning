/**
 * Psychology Topic Interactive Exercises
 * 
 * Interactive exercises for psychology topics:
 * - Consciousness (ID: 17): reflection prompts
 * - Emotions (ID: 18): scenario analysis
 * - Memory (ID: 19): concept matching
 * - Growth Mindset (ID: 20): scenario-based choices
 * 
 * Requirements: 4.4
 */

import type {
  InteractiveExercise,
  ReflectionExercise,
  ScenarioExercise,
  MatchingExercise,
} from '../../types/exercises';

// ============================================
// Consciousness Exercises (Topic ID: 17)
// ============================================

const consciousnessReflection: ReflectionExercise = {
  id: 'consciousness-reflection',
  type: 'reflection',
  title: 'Exploring Your Awareness',
  description: 'Reflect on the nature of your own consciousness and awareness.',
  duration: 10,
  topicId: 17,
  prompts: [
    'Close your eyes for a moment. What do you notice? Thoughts, sensations, sounds? This noticing IS consciousness. How would you describe the experience of being aware?',
    'Your baby is developing their own consciousness right now. What do you imagine their inner experience might be like? What might they be aware of?',
    'Think about a moment when you felt fully present and aware. What made that moment special? How did it feel different from being on "autopilot"?',
  ],
};

// ============================================
// Emotions Exercises (Topic ID: 18)
// ============================================

const emotionsScenario1: ScenarioExercise = {
  id: 'emotions-scenario-1',
  type: 'scenario',
  title: 'Understanding Emotional Responses',
  description: 'Explore how emotions work and how to respond to them.',
  duration: 5,
  topicId: 18,
  scenario: 'You receive unexpected news that changes your plans for the day. You notice your heart rate increasing, your thoughts racing, and a tight feeling in your chest. What is the most helpful way to understand and respond to these sensations?',
  choices: [
    {
      id: 'es1-1',
      text: 'Push the feelings away and focus on staying calm',
      feedback: 'While staying calm is valuable, suppressing emotions often makes them stronger. Emotions carry important information and acknowledging them is the first step to processing them effectively.',
      isOptimal: false,
    },
    {
      id: 'es1-2',
      text: 'Recognize these as normal stress responses and take a few deep breaths',
      feedback: 'Excellent approach! Recognizing physical sensations as normal emotional responses helps you respond thoughtfully rather than react automatically. Deep breathing activates your calming nervous system.',
      isOptimal: true,
    },
    {
      id: 'es1-3',
      text: 'Analyze why you shouldn\'t feel this way',
      feedback: 'Trying to logic away emotions rarely works. Emotions aren\'t always "logical"—they\'re signals from your body and mind. Accepting them without judgment is more effective than arguing with them.',
      isOptimal: false,
    },
  ],
};

const emotionsScenario2: ScenarioExercise = {
  id: 'emotions-scenario-2',
  type: 'scenario',
  title: 'Emotions and Your Baby',
  description: 'Explore how your emotions might affect your baby.',
  duration: 5,
  topicId: 18,
  scenario: 'Research shows that babies in the womb can sense their mother\'s emotional states through hormones and other signals. You\'ve been feeling stressed lately. How should you think about this?',
  choices: [
    {
      id: 'es2-1',
      text: 'I need to be happy all the time for my baby\'s sake',
      feedback: 'This creates an impossible standard that adds more stress! All emotions are normal and healthy. Babies benefit from experiencing the full range of emotions through you—it helps them develop emotional resilience.',
      isOptimal: false,
    },
    {
      id: 'es2-2',
      text: 'My emotions are natural, and managing stress healthily is what matters most',
      feedback: 'Perfect perspective! Experiencing stress is normal and unavoidable. What matters is how you cope with it. Healthy stress management—rest, support, self-care—benefits both you and your baby.',
      isOptimal: true,
    },
    {
      id: 'es2-3',
      text: 'My stress will definitely harm my baby',
      feedback: 'Occasional stress is a normal part of life and won\'t harm your baby. Chronic, severe stress can have effects, but the solution is self-compassion and support, not worry about worrying!',
      isOptimal: false,
    },
  ],
};


// ============================================
// Memory Exercises (Topic ID: 19)
// ============================================

const memoryConceptMatching: MatchingExercise = {
  id: 'memory-concept-matching',
  type: 'matching',
  title: 'Types of Memory',
  description: 'Match each type of memory with its description.',
  duration: 5,
  topicId: 19,
  instructions: 'Connect each memory type with what it stores.',
  pairs: [
    { id: 'mcm-1', left: 'Short-term memory', right: 'Holds information for seconds to minutes' },
    { id: 'mcm-2', left: 'Long-term memory', right: 'Stores information for years or a lifetime' },
    { id: 'mcm-3', left: 'Procedural memory', right: 'Remembers how to do things (like riding a bike)' },
    { id: 'mcm-4', left: 'Episodic memory', right: 'Recalls personal experiences and events' },
    { id: 'mcm-5', left: 'Semantic memory', right: 'Stores facts and general knowledge' },
  ],
};

const memoryScenario: ScenarioExercise = {
  id: 'memory-scenario',
  type: 'scenario',
  title: 'Building Baby\'s Memory',
  description: 'Explore how early experiences shape memory development.',
  duration: 5,
  topicId: 19,
  scenario: 'Your baby\'s brain is forming millions of neural connections every day. While they won\'t consciously remember being in the womb, research suggests prenatal experiences can influence development. What kinds of experiences might be meaningful?',
  choices: [
    {
      id: 'ms-1',
      text: 'Only educational content like classical music and language tapes',
      feedback: 'While some parents enjoy playing music, there\'s no evidence that specific "educational" content in the womb creates smarter babies. What matters more is your overall wellbeing and connection.',
      isOptimal: false,
    },
    {
      id: 'ms-2',
      text: 'Your voice, heartbeat, and the rhythm of daily life',
      feedback: 'Exactly! Babies recognize their mother\'s voice at birth and are soothed by familiar sounds. Your heartbeat, voice, and daily rhythms create a foundation of familiarity and security.',
      isOptimal: true,
    },
    {
      id: 'ms-3',
      text: 'Nothing matters since babies can\'t form memories yet',
      feedback: 'While babies don\'t form conscious memories, their brains are actively developing and responding to their environment. Early experiences shape neural pathways even without explicit memory.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Growth Mindset Exercises (Topic ID: 20)
// ============================================

const growthMindsetScenario1: ScenarioExercise = {
  id: 'growth-mindset-scenario-1',
  type: 'scenario',
  title: 'Facing Challenges',
  description: 'Explore how mindset affects how we approach difficulties.',
  duration: 5,
  topicId: 20,
  scenario: 'You\'re learning something new—maybe a skill for parenting, a hobby, or something for work. After several attempts, you\'re still struggling. What thought pattern reflects a growth mindset?',
  choices: [
    {
      id: 'gms1-1',
      text: '"I\'m just not good at this. Some people have talent and I don\'t."',
      feedback: 'This is a fixed mindset—believing abilities are set in stone. Research shows this belief actually limits learning because it makes us avoid challenges and give up easily.',
      isOptimal: false,
    },
    {
      id: 'gms1-2',
      text: '"I\'m not good at this YET. What can I learn from my mistakes?"',
      feedback: 'This is growth mindset! The word "yet" is powerful—it acknowledges current struggle while believing in future improvement. Viewing mistakes as learning opportunities accelerates growth.',
      isOptimal: true,
    },
    {
      id: 'gms1-3',
      text: '"I should be able to do this easily. Something is wrong with me."',
      feedback: 'This combines fixed mindset with harsh self-judgment. Learning is supposed to be challenging! Struggle is a sign of growth, not a sign of inadequacy.',
      isOptimal: false,
    },
  ],
};

const growthMindsetScenario2: ScenarioExercise = {
  id: 'growth-mindset-scenario-2',
  type: 'scenario',
  title: 'Praising Your Child',
  description: 'Learn how different types of praise affect mindset development.',
  duration: 5,
  topicId: 20,
  scenario: 'Your child (imagine them a few years from now) has just completed a puzzle. You want to encourage them. Research shows that HOW you praise matters for developing a growth mindset. Which response is most beneficial?',
  choices: [
    {
      id: 'gms2-1',
      text: '"You\'re so smart! You\'re a natural at puzzles!"',
      feedback: 'Praising intelligence can actually backfire! Children praised for being "smart" often avoid challenges to protect that label. They may think: "If I fail, I\'m not smart anymore."',
      isOptimal: false,
    },
    {
      id: 'gms2-2',
      text: '"I love how you kept trying different pieces until you found the right ones!"',
      feedback: 'Perfect! Praising effort and strategy teaches children that persistence leads to success. This builds resilience and a love of learning that lasts a lifetime.',
      isOptimal: true,
    },
    {
      id: 'gms2-3',
      text: '"Good job!" (without specifics)',
      feedback: 'Generic praise is better than criticism, but it doesn\'t teach much. Specific praise about effort, strategy, or improvement helps children understand what leads to success.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Export Psychology Exercises
// ============================================

export const psychologyExercises: Record<number, InteractiveExercise[]> = {
  // Consciousness (Topic ID: 17)
  17: [consciousnessReflection],
  // Emotions (Topic ID: 18)
  18: [emotionsScenario1, emotionsScenario2],
  // Memory (Topic ID: 19)
  19: [memoryConceptMatching, memoryScenario],
  // Growth Mindset (Topic ID: 20)
  20: [growthMindsetScenario1, growthMindsetScenario2],
};
