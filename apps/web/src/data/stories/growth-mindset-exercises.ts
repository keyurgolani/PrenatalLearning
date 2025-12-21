/**
 * Growth Mindset Story Exercises
 * 
 * Topic-specific exercises for "Growing Your Mind: The Power of Learning"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const growthMindsetExercises: Exercise[] = [
  // Growth Mindset Reflection (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Discovering Your Mindset',
    description: 'Reflect on your own beliefs about learning and ability.',
    duration: 12,
    prompts: [
      'Think about a skill you\'ve developed over time—perhaps cooking, driving, or a hobby. Remember when you first started and how far you\'ve come. What made the difference? Was it natural talent, or effort and practice?',
      'Consider a time when you faced a challenge and wanted to give up. What thoughts went through your mind? Did you think "I can\'t do this" or "I can\'t do this yet"? How did your beliefs affect your actions?',
      'Reflect on how you were praised as a child. Were you told you were "smart" or "talented"? Or were you praised for your effort and persistence? How do you think this shaped your approach to challenges?',
      'Write about an area of your life where you\'d like to develop a stronger growth mindset. What beliefs might be holding you back? What would change if you truly believed you could grow?'
    ],
    guidance: 'This reflection helps you become aware of your own mindset patterns. Awareness is the first step toward growth.'
  },
  {
    type: 'reflection',
    title: 'The Power of "Yet"',
    description: 'Practice transforming fixed statements into growth statements.',
    duration: 10,
    prompts: [
      'List three things you believe you "can\'t" do. Now add "yet" to each one. Notice how the feeling changes. "I can\'t" feels like a wall; "I can\'t yet" feels like a path.',
      'Think about your upcoming journey as a parent. What are you worried you won\'t be able to do? Write these fears, then transform each one with "yet." How does this shift your perspective?',
      'Imagine your child saying "I can\'t do it!" How would you respond? What would you want them to understand about the power of "yet"?',
      'Write a letter to yourself from one year in the future, describing all the things you\'ve learned that you couldn\'t do "yet" when you wrote this.'
    ],
    guidance: 'The word "yet" is a simple but powerful tool for shifting from a fixed to a growth mindset. Practice using it regularly.'
  },

  // Visualization of Brain Growing (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The Growing Garden',
    description: 'A guided visualization of your brain as a garden that grows with effort.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, let go of any tension and prepare to enter the garden of your mind.',
      'Imagine your brain as a beautiful garden. See the rich, dark soil—full of nutrients, full of potential. This is the foundation of your mind.',
      'Now watch as tiny green shoots begin to emerge. Each one represents a neural connection—a skill you\'ve learned, a memory you\'ve formed, a habit you\'ve built. See how many there are, how complex and beautiful.',
      'Notice the paths winding through the garden. The widest, most well-worn paths are the skills you use most often—walking, talking, reading. These connections are strong because you\'ve used them so many times.',
      'Now imagine learning something new. See a gardener (that\'s you!) planting a tiny seed. With attention and practice, watch it sprout, grow, and eventually become a strong plant connected to all the others.',
      'See your baby\'s brain as a new garden being prepared—soil being enriched, first seeds being planted. Every sound they hear, every movement they feel, every beat of your heart is planting seeds.',
      'Take a deep breath and slowly return from the garden, carrying the image of growth with you.'
    ],
    guidance: 'This visualization makes the abstract concept of neuroplasticity tangible. Return to this image whenever you need to remember that your brain can always grow.'
  },
  {
    type: 'visualization',
    title: 'Neurons Connecting',
    description: 'Visualize the physical process of learning in your brain.',
    duration: 12,
    prompts: [
      'Sit comfortably and close your eyes. Take a few deep breaths to settle into stillness.',
      'Imagine you\'re shrinking down, smaller and smaller, until you can see inside your own brain. You\'re surrounded by neurons—brain cells that look like trees with many branches.',
      'Watch as two neurons reach toward each other. Their branches stretch, seeking connection. When they touch, a tiny spark of electricity jumps between them. This is learning happening.',
      'Now watch as you practice something over and over. See the connection between those neurons growing stronger, thicker, faster. A substance called myelin wraps around the connection like insulation, making signals travel quicker.',
      'Imagine your baby\'s brain, where 250,000 new neurons are being created every minute. See the incredible activity—new cells forming, new connections being made, a universe of potential being built.',
      'Take a deep breath and slowly return to normal size, carrying the wonder of your growing brain with you.'
    ],
    guidance: 'Understanding the physical reality of brain growth can strengthen your belief in your ability to change and learn.'
  },

  // Discussion About Learning from Mistakes (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Embracing Mistakes',
    description: 'Questions to discuss with your partner, family, or friends about the value of mistakes.',
    duration: 15,
    prompts: [
      'Share a mistake you made that taught you something valuable. What did you learn? Would you have learned it any other way?',
      'How do you typically react when you make a mistake? Do you feel shame, frustration, curiosity? How would you like to react?',
      'Think about how you\'ll respond when your child makes mistakes. What messages do you want to send about the value of errors?',
      'Discuss: Why do you think our culture often treats mistakes as failures rather than learning opportunities? How might we change this?',
      'Share a time when someone else\'s mistake taught you something. How can we create environments where mistakes are safe to make?'
    ],
    guidance: 'These discussions help normalize mistakes as part of learning. The goal is to develop a healthier relationship with error and failure.'
  },
  {
    type: 'discussion',
    title: 'Effort vs. Talent',
    description: 'Explore beliefs about natural ability versus developed skill.',
    duration: 12,
    prompts: [
      'Think of someone you admire for their skill in something. Do you attribute their ability to natural talent or to years of practice? What evidence supports your view?',
      'Discuss: When we call someone "naturally talented," what effect might that have on them? On others who want to develop that skill?',
      'How will you praise your child? Will you focus on their intelligence and talent, or on their effort and strategies? Why does this distinction matter?',
      'Share an area where you once thought you had no talent but improved through effort. What changed your mind about your ability?'
    ],
    guidance: 'Research shows that praising effort over talent leads to greater resilience and achievement. These discussions help internalize this insight.'
  },

  // Breathing Exercise (Requirement 10.2)
  {
    type: 'breathing',
    title: 'Growth Breath',
    description: 'A breathing exercise that embodies the growth mindset.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes and take three natural breaths.',
      'As you breathe in, imagine you\'re breathing in possibility—the potential for growth, change, and learning. Feel your lungs expand with potential.',
      'As you breathe out, release any fixed beliefs—any thoughts of "I can\'t" or "I\'m not good enough." Let them go with your breath.',
      'Breathe in: "I am capable of growth." Feel the truth of this in your body.',
      'Breathe out: "I release my limitations." Feel the freedom of letting go.',
      'Breathe in: "Every challenge helps me grow." Welcome difficulty as a teacher.',
      'Breathe out: "Mistakes are how I learn." Release the fear of failure.',
      'Continue this pattern for a few more breaths, then rest in the peaceful awareness of your unlimited potential.'
    ],
    guidance: 'This breathing exercise helps embody the growth mindset physically. Use it whenever you face a challenge or feel stuck.'
  },

  // Thought Experiments (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The 10,000 Hour Question',
    description: 'Explore what deliberate practice could achieve.',
    duration: 12,
    prompts: [
      'Research suggests that world-class expertise in most fields requires about 10,000 hours of deliberate practice. That\'s roughly 3 hours a day for 10 years. Consider: what could you become expert at if you dedicated that time?',
      'Think about something you\'ve always wanted to learn but believed you "couldn\'t." If you practiced for just 30 minutes a day, you\'d accumulate over 180 hours in a year. What might be possible?',
      'Imagine your child at age 10, having spent thousands of hours practicing something they love. What might they have achieved? How does this change how you think about "natural talent"?',
      'Consider: If effort and practice are so powerful, why do we often give up so quickly? What beliefs or fears hold us back from putting in the time?'
    ],
    guidance: 'This thought experiment challenges the myth of natural talent and highlights the power of sustained effort.'
  },
  {
    type: 'thought-experiment',
    title: 'The Struggle Reframe',
    description: 'Practice reframing struggle as a sign of growth.',
    duration: 10,
    prompts: [
      'Think of something you\'re currently struggling with. Notice the feelings that come up—frustration, doubt, maybe even shame. Now imagine a scientist observing your brain during this struggle. What would they see? (Answer: intense activity, new connections forming, growth happening.)',
      'Consider: If struggle is actually the feeling of your brain growing, how might you relate to it differently? Could you welcome it instead of avoiding it?',
      'Imagine two people learning the same difficult skill. One thinks "This is hard, I must not be good at this." The other thinks "This is hard, my brain must be growing." Who do you think will learn more? Why?',
      'How might you help your child reframe struggle? What words would you use to help them see difficulty as growth rather than failure?'
    ],
    guidance: 'Reframing struggle as growth is one of the most powerful shifts you can make. Practice this perspective until it becomes natural.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Growth Mindset Art',
    description: 'Creative activities to express and reinforce growth mindset concepts.',
    duration: 20,
    prompts: [
      'Draw or paint your brain as a garden. Show the established plants (skills you have), the new sprouts (things you\'re learning), and the seeds waiting to be planted (future possibilities).',
      'Create a "Yet" poster for your baby\'s room. Write "I can\'t do it... YET!" in beautiful letters, surrounded by images of growth and possibility.',
      'Write a short poem or song about the growing brain. Something you might sing to your baby about their unlimited potential.',
      'Design a visual representation of neuroplasticity—how would you show neurons connecting, pathways strengthening, the brain changing?',
      'Create a "Growth Mindset Mantra" card that you can keep visible. Include phrases like "Mistakes help me learn" or "I grow through challenge."'
    ],
    guidance: 'Creative expression helps internalize growth mindset concepts. Display your creations where you\'ll see them regularly.'
  },

  // Journaling Prompts (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Growth Mindset Journal',
    description: 'Journaling prompts to deepen your growth mindset practice.',
    duration: 15,
    prompts: [
      'Describe a challenge you faced today. How did you respond? Looking back, how might a growth mindset have changed your approach?',
      'Write about a time when you surprised yourself by learning something you thought you couldn\'t. What made the difference?',
      'Reflect on the messages you received about intelligence and ability as a child. How have these shaped your beliefs? Which beliefs would you like to change?',
      'Write a letter to your baby about the power of their growing brain. What do you want them to know about their potential?',
      'Describe the parent you want to become. What skills do you need to develop? How will you approach this growth with a growth mindset?'
    ],
    guidance: 'Regular journaling helps track your growth mindset journey and reinforces new patterns of thinking.'
  }
];

/**
 * Get exercises by type
 */
export function getGrowthMindsetExercisesByType(type: Exercise['type']): Exercise[] {
  return growthMindsetExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getGrowthMindsetTotalExerciseDuration(): number {
  return growthMindsetExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getGrowthMindsetRecommendedSequence(): Exercise[] {
  return [
    growthMindsetExercises.find(e => e.title === 'Discovering Your Mindset')!,
    growthMindsetExercises.find(e => e.title === 'The Growing Garden')!,
    growthMindsetExercises.find(e => e.title === 'Growth Breath')!,
  ];
}

export default growthMindsetExercises;
