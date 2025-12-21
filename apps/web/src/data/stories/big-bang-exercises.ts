/**
 * Big Bang Story Exercises
 * 
 * Topic-specific exercises for "The Story of Everything: From Big Bang to You"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

export interface Exercise {
  type: 'reflection' | 'thought-experiment' | 'discussion' | 'creative' | 'visualization' | 'breathing';
  title: string;
  description: string;
  duration: number; // in minutes
  prompts: string[];
  guidance?: string;
}

export const bigBangExercises: Exercise[] = [
  // Reflection Prompts about Origins and Existence (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Your Place in the Cosmic Story',
    description: 'Reflect on your connection to the universe and what it means for you and your baby.',
    duration: 10,
    prompts: [
      'How does it feel to know that the atoms in your body—and your baby\'s body—were forged inside ancient stars billions of years ago?',
      'Think about the journey those atoms took: from the Big Bang, through the hearts of stars, across space, to Earth, and finally to you. What emotions arise?',
      'Your baby is the latest chapter in a 13.8 billion year story. What do you hope they will add to this cosmic narrative?',
      'Write a short letter to your baby explaining their cosmic origins in your own words.'
    ],
    guidance: 'Find a quiet, comfortable space. Take a few deep breaths before beginning. There are no right or wrong answers—simply let your thoughts and feelings flow.'
  },
  {
    type: 'reflection',
    title: 'The Miracle of Existence',
    description: 'Contemplate the wonder of existence itself.',
    duration: 8,
    prompts: [
      'Why do you think there is something rather than nothing? What does existence mean to you?',
      'Consider all the events that had to happen—from the Big Bang to the formation of Earth to the evolution of life—for you to be here, pregnant with your baby. How does this chain of events make you feel?',
      'What aspects of the universe\'s story fill you with the most wonder?',
      'How might sharing this sense of cosmic wonder shape your child\'s view of the world?'
    ],
    guidance: 'This exercise invites deep contemplation. Don\'t rush—let each question sit with you for a moment before moving to the next.'
  },

  // Thought Experiment about Cosmic Expansion (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'Riding the Expanding Universe',
    description: 'Imagine what it would be like to experience the expansion of the universe.',
    duration: 12,
    prompts: [
      'Imagine you are a tiny point floating in space at the moment of the Big Bang. Everything is incredibly hot and dense. Now feel space itself beginning to stretch around you. You\'re not moving through space—space itself is growing. What does this feel like?',
      'Picture yourself as a chocolate chip in rising bread dough. As the dough expands, you see other chips drifting away from you in all directions. But you\'re not moving—the dough between you is simply growing. How does this change your understanding of cosmic expansion?',
      'If you could watch the universe expand in fast-forward over 13.8 billion years, what would you see? Describe the journey from a tiny speck to the vast cosmos we know today.',
      'The universe is still expanding right now, even as you read this. Galaxies are drifting apart. How does knowing this ongoing expansion make you feel about your place in the cosmos?'
    ],
    guidance: 'Close your eyes for each prompt. Let your imagination create vivid images. Don\'t worry about scientific accuracy—focus on the feeling and wonder of the experience.'
  },
  {
    type: 'thought-experiment',
    title: 'Before the Beginning',
    description: 'Contemplate what existed before the Big Bang.',
    duration: 8,
    prompts: [
      'Scientists say that time itself began with the Big Bang. What does it mean for there to be no "before"? Can you imagine a state without time?',
      'Everything that exists—every star, planet, person, and atom—was once contained in a point smaller than a grain of sand. How can something so small contain so much potential?',
      'If you could ask the universe one question about its origins, what would it be?'
    ],
    guidance: 'These are questions without definitive answers. The goal is not to find answers but to experience the wonder of contemplating the unknowable.'
  },

  // Visualization Exercise for Cosmic Timeline (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Journey Through Cosmic Time',
    description: 'A guided visualization through the 13.8 billion year history of the universe.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, let go of the present moment and prepare to travel through time.',
      'You are floating in darkness. Suddenly, a brilliant flash of light—the Big Bang. Feel the intense heat, the rapid expansion. Watch as the universe blooms like a cosmic flower.',
      'Time passes. The universe cools. See the first light emerge as the cosmic fog lifts—the universe\'s first sunrise, a gentle glow filling all of space.',
      'Now watch as gravity gathers clouds of gas. See the first stars ignite—massive, brilliant beacons in the darkness. Feel their warmth across the void.',
      'Watch a star explode in a supernova, scattering its gifts across space—carbon, oxygen, iron, gold. These are the seeds of planets and life.',
      'See our solar system form—the Sun igniting, planets coalescing from dust and gas. Watch Earth take shape, blue and beautiful.',
      'Fast-forward through billions of years of life on Earth—single cells, fish, dinosaurs, mammals. See humanity emerge, looking up at the stars with wonder.',
      'Now see yourself, here in this moment, carrying new life within you. Your baby, the latest miracle in this 13.8 billion year story.',
      'Take a deep breath and slowly return to the present, carrying the wonder of this cosmic journey with you.'
    ],
    guidance: 'This visualization works best in a quiet, comfortable space. You may want to record yourself reading the prompts slowly, or have a partner read them to you. Allow 30-60 seconds between each prompt.'
  },
  {
    type: 'visualization',
    title: 'The Star Within',
    description: 'Visualize the star stuff within you and your baby.',
    duration: 10,
    prompts: [
      'Place your hands on your belly. Close your eyes and breathe deeply.',
      'Imagine you can see inside your body, down to the atomic level. See the atoms that make up your cells—carbon, oxygen, hydrogen, nitrogen.',
      'Now imagine each atom glowing with a faint light—the light of the star where it was born. Your body is filled with starlight.',
      'See your baby, also glowing with this ancient starlight. The same atoms that were forged in stellar furnaces billions of years ago now form your child.',
      'Feel the connection—you and your baby, both made of stars, both carrying the light of the cosmos within you.',
      'Whisper to your baby: "You are made of stars, little one. You carry the light of the universe within you."'
    ],
    guidance: 'This visualization helps create a tangible sense of cosmic connection. Practice it whenever you want to feel connected to your baby and to the universe.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Cosmic Conversations',
    description: 'Questions to discuss with your partner, family, or friends about our cosmic origins.',
    duration: 15,
    prompts: [
      'What does it mean to you that we are all made of star stuff? How does this knowledge change how you see yourself and others?',
      'If the universe is 13.8 billion years old and humans have existed for only about 300,000 years, what does this tell us about our place in cosmic history?',
      'How do you think knowing about the Big Bang and cosmic evolution might shape your child\'s sense of wonder and curiosity?',
      'Some people find the vastness of the universe overwhelming; others find it comforting. Which do you feel, and why?',
      'What stories about the universe do you want to share with your child as they grow?'
    ],
    guidance: 'These questions are meant to spark meaningful conversations. There are no right answers—the goal is to explore ideas together and deepen your sense of wonder.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Cosmic Art',
    description: 'Creative activities to express your connection to the cosmic story.',
    duration: 20,
    prompts: [
      'Draw or paint the Big Bang as you imagine it—not scientifically accurate, but emotionally true. What colors, shapes, and feelings emerge?',
      'Create a "cosmic family tree" showing the journey from the Big Bang to your baby. Include stars, supernovas, the solar system, Earth, and your family.',
      'Write a short poem or song about your baby\'s cosmic origins. It doesn\'t have to rhyme—just let the words flow.',
      'Collect small objects that represent different stages of cosmic history (a candle for stars, a rock for planets, a photo of your baby\'s ultrasound for new life) and create a small altar or display.',
      'Write a bedtime story for your baby about their journey from stardust to your arms.'
    ],
    guidance: 'Don\'t worry about artistic skill—these activities are about expression and connection, not perfection. Let your creativity flow freely.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Breathing with the Cosmos',
    description: 'A breathing exercise that connects you to the rhythm of the universe.',
    duration: 5,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts, imagining you are breathing in starlight—ancient light that has traveled across the universe.',
      'Hold for 2 counts, feeling the starlight fill your body and reach your baby.',
      'Breathe out slowly for 6 counts, imagining you are releasing any tension or worry into the vastness of space.',
      'Repeat this cycle 7 times—one breath for each key milestone: the Big Bang, cosmic expansion, first light, first stars, supernovas, solar system formation, and the miracle of life.',
      'End by placing both hands on your belly and whispering: "We are made of stars, little one. We are part of the universe\'s greatest story."'
    ],
    guidance: 'This breathing exercise can be done anytime you want to feel connected to your baby and to the cosmos. It\'s especially calming before sleep or during moments of stress.'
  }
];

/**
 * Get exercises by type
 */
export function getExercisesByType(type: Exercise['type']): Exercise[] {
  return bigBangExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getTotalExerciseDuration(): number {
  return bigBangExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getRecommendedSequence(): Exercise[] {
  return [
    bigBangExercises.find(e => e.title === 'Breathing with the Cosmos')!,
    bigBangExercises.find(e => e.title === 'Journey Through Cosmic Time')!,
    bigBangExercises.find(e => e.title === 'Your Place in the Cosmic Story')!,
  ];
}

export default bigBangExercises;
