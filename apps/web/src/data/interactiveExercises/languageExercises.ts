/**
 * Language Topic Interactive Exercises
 * 
 * Interactive exercises for language topics:
 * - Language (ID: 21): pattern matching
 * - Sanskrit (ID: 22): sound recognition reflection
 * - Music (ID: 23): pattern identification
 * - Body Language (ID: 24): scenario interpretation
 * 
 * Requirements: 4.5
 */

import type {
  InteractiveExercise,
  MatchingExercise,
  ReflectionExercise,
  ScenarioExercise,
  QuizExercise,
} from '../../types/exercises';

// ============================================
// Language Exercises (Topic ID: 21)
// ============================================

const languagePatternMatching: MatchingExercise = {
  id: 'language-pattern-matching',
  type: 'matching',
  title: 'Language Patterns',
  description: 'Match language concepts with their examples.',
  duration: 5,
  topicId: 21,
  instructions: 'Connect each language concept with the correct example.',
  pairs: [
    { id: 'lpm-1', left: 'Onomatopoeia', right: 'Buzz, splash, meow' },
    { id: 'lpm-2', left: 'Alliteration', right: 'Peter Piper picked peppers' },
    { id: 'lpm-3', left: 'Rhyme', right: 'Cat and hat, moon and June' },
    { id: 'lpm-4', left: 'Metaphor', right: 'Life is a journey' },
    { id: 'lpm-5', left: 'Rhythm', right: 'The beat and flow of speech' },
  ],
};

const languageQuiz: QuizExercise = {
  id: 'language-quiz',
  type: 'quiz',
  title: 'Language Development',
  description: 'Learn about how babies develop language.',
  duration: 5,
  topicId: 21,
  questions: [
    {
      id: 'lq-1',
      question: 'When do babies start learning language?',
      options: ['At birth', 'At 6 months', 'Before birth, in the womb', 'When they say their first word'],
      correctIndex: 2,
      explanation: 'Babies begin learning language in the womb! They can hear and recognize their mother\'s voice, and newborns prefer their native language over others.',
    },
    {
      id: 'lq-2',
      question: 'What is "parentese" or "baby talk"?',
      options: [
        'Nonsense words that confuse babies',
        'High-pitched, melodic speech that helps babies learn',
        'Speaking in complete silence',
        'Only using single words',
      ],
      correctIndex: 1,
      explanation: 'Parentese—the natural sing-song way adults speak to babies—actually helps language development! The exaggerated tones help babies distinguish sounds and words.',
    },
    {
      id: 'lq-3',
      question: 'How many words does the average toddler learn per day during the "vocabulary explosion"?',
      options: ['1-2 words', '5-10 words', '20-30 words', '100 words'],
      correctIndex: 1,
      explanation: 'During the vocabulary explosion (around 18-24 months), toddlers can learn 5-10 new words per day! Their brains are incredibly efficient language-learning machines.',
    },
  ],
};

// ============================================
// Sanskrit Exercises (Topic ID: 22)
// ============================================

const sanskritReflection: ReflectionExercise = {
  id: 'sanskrit-reflection',
  type: 'reflection',
  title: 'The Music of Ancient Sounds',
  description: 'Reflect on the power of sound and ancient languages.',
  duration: 10,
  topicId: 22,
  prompts: [
    'Sanskrit is called the "mother of languages" and was designed with precise attention to how sounds are formed in the mouth. Try saying "Om" slowly. Notice where the sound begins (back of throat), moves through (middle), and ends (lips closing). What do you notice about this journey of sound?',
    'Many Sanskrit words are chosen for their vibrational quality, not just their meaning. Think about sounds that feel calming to you (perhaps "shh" or humming). Why might certain sounds feel soothing to both you and your baby?',
    'Your baby can hear your voice and responds to its rhythms and tones. If you were to choose sounds or words to share with your baby based purely on how they feel, what would you choose?',
  ],
};

// ============================================
// Music Exercises (Topic ID: 23)
// ============================================

const musicPatternQuiz: QuizExercise = {
  id: 'music-pattern-quiz',
  type: 'quiz',
  title: 'Musical Patterns',
  description: 'Explore the patterns that make music meaningful.',
  duration: 5,
  topicId: 23,
  questions: [
    {
      id: 'mpq-1',
      question: 'What is rhythm in music?',
      options: [
        'How loud or soft the music is',
        'The pattern of beats and timing',
        'The words in a song',
        'The instruments used',
      ],
      correctIndex: 1,
      explanation: 'Rhythm is the pattern of beats and timing that gives music its pulse. It\'s often the first element babies respond to—they can feel rhythm even in the womb!',
    },
    {
      id: 'mpq-2',
      question: 'Why do lullabies tend to be slow and repetitive?',
      options: [
        'Parents are too tired to sing fast songs',
        'Slow, repetitive patterns are calming and help babies sleep',
        'Babies can\'t hear fast music',
        'It\'s just tradition with no real reason',
      ],
      correctIndex: 1,
      explanation: 'Slow tempos and repetition activate the parasympathetic nervous system, promoting relaxation. This is why lullabies across all cultures share similar patterns!',
    },
    {
      id: 'mpq-3',
      question: 'Can babies in the womb hear music?',
      options: [
        'No, the womb is soundproof',
        'Yes, but only very loud music',
        'Yes, especially low frequencies and rhythms',
        'Only after 9 months',
      ],
      correctIndex: 2,
      explanation: 'Babies can hear music from about 18 weeks! Low frequencies travel best through fluid, so bass and rhythm are clearest. Babies often recognize music they heard in the womb.',
    },
  ],
};

const musicReflection: ReflectionExercise = {
  id: 'music-reflection',
  type: 'reflection',
  title: 'Your Musical Connection',
  description: 'Reflect on music\'s role in your life and your baby\'s development.',
  duration: 8,
  topicId: 23,
  prompts: [
    'What music moves you emotionally? Think of a song that makes you feel peaceful, joyful, or connected. Why do you think it affects you this way?',
    'Hum or sing softly to your baby right now. Notice how it feels in your body—the vibration, the breath, the rhythm. What do you imagine your baby experiences?',
    'What songs or sounds do you want to share with your child as they grow? What musical memories do you hope to create together?',
  ],
};


// ============================================
// Body Language Exercises (Topic ID: 24)
// ============================================

const bodyLanguageScenario1: ScenarioExercise = {
  id: 'body-language-scenario-1',
  type: 'scenario',
  title: 'Reading Nonverbal Cues',
  description: 'Practice interpreting body language in everyday situations.',
  duration: 5,
  topicId: 24,
  scenario: 'You\'re talking to a friend who says "I\'m fine" but their arms are crossed, they\'re avoiding eye contact, and their voice is flat. What is their body language telling you?',
  choices: [
    {
      id: 'bls1-1',
      text: 'They\'re fine—they said so',
      feedback: 'Words are only part of communication! Research shows that when words and body language conflict, we tend to believe the body language. Nonverbal cues often reveal true feelings.',
      isOptimal: false,
    },
    {
      id: 'bls1-2',
      text: 'Their body language suggests they may not be fine and might need support',
      feedback: 'Exactly! Crossed arms, avoided eye contact, and flat tone often indicate discomfort or distress. Gently acknowledging what you observe ("You seem a bit down—want to talk?") shows you care.',
      isOptimal: true,
    },
    {
      id: 'bls1-3',
      text: 'They\'re being rude by not making eye contact',
      feedback: 'Avoiding eye contact can mean many things—shyness, discomfort, cultural norms, or processing emotions. It\'s rarely about rudeness. Approaching with curiosity rather than judgment is more helpful.',
      isOptimal: false,
    },
  ],
};

const bodyLanguageScenario2: ScenarioExercise = {
  id: 'body-language-scenario-2',
  type: 'scenario',
  title: 'Baby\'s First Language',
  description: 'Understand how babies communicate before words.',
  duration: 5,
  topicId: 24,
  scenario: 'Newborns can\'t speak, but they communicate constantly through body language. A baby turns their head away, closes their eyes, and arches their back during playtime. What might they be communicating?',
  choices: [
    {
      id: 'bls2-1',
      text: 'They want more stimulation and excitement',
      feedback: 'Actually, these are signs of overstimulation! Turning away, closing eyes, and arching back are a baby\'s way of saying "I need a break." Recognizing these cues helps you respond to your baby\'s needs.',
      isOptimal: false,
    },
    {
      id: 'bls2-2',
      text: 'They\'re overstimulated and need a calm break',
      feedback: 'Correct! Babies have limited ways to communicate, so they use their bodies. These "disengagement cues" mean they need less stimulation. A calm, quiet moment helps them regulate.',
      isOptimal: true,
    },
    {
      id: 'bls2-3',
      text: 'They\'re being difficult or fussy for no reason',
      feedback: 'Babies always have reasons for their behavior—they just can\'t tell us in words! Learning to read their body language helps you understand and meet their needs, building trust and connection.',
      isOptimal: false,
    },
  ],
};

const bodyLanguageMatching: MatchingExercise = {
  id: 'body-language-matching',
  type: 'matching',
  title: 'Universal Expressions',
  description: 'Match emotions with their universal facial expressions.',
  duration: 5,
  topicId: 24,
  instructions: 'Connect each emotion with how it typically appears on the face.',
  pairs: [
    { id: 'blm-1', left: 'Happiness', right: 'Raised cheeks, crinkled eyes, upturned mouth' },
    { id: 'blm-2', left: 'Sadness', right: 'Downturned mouth, drooping eyelids, furrowed brow' },
    { id: 'blm-3', left: 'Surprise', right: 'Raised eyebrows, wide eyes, open mouth' },
    { id: 'blm-4', left: 'Fear', right: 'Wide eyes, raised eyebrows, tense mouth' },
    { id: 'blm-5', left: 'Disgust', right: 'Wrinkled nose, raised upper lip, narrowed eyes' },
  ],
};

// ============================================
// Export Language Exercises
// ============================================

export const languageExercises: Record<number, InteractiveExercise[]> = {
  // Language (Topic ID: 21)
  21: [languagePatternMatching, languageQuiz],
  // Sanskrit (Topic ID: 22)
  22: [sanskritReflection],
  // Music (Topic ID: 23)
  23: [musicPatternQuiz, musicReflection],
  // Body Language (Topic ID: 24)
  24: [bodyLanguageScenario1, bodyLanguageScenario2, bodyLanguageMatching],
};
