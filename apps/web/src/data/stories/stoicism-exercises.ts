/**
 * Stoicism: The Inner Fortress - Exercises
 * 
 * Topic-specific exercises for "Stoicism: The Inner Fortress"
 * These exercises help mothers engage more deeply with Stoic philosophy
 * and practice emotional regulation techniques.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const stoicismExercises: Exercise[] = [
  // Reflection Exercises
  {
    type: 'reflection',
    title: 'Mapping Your Circles of Control',
    description: 'Reflect on what you can and cannot control in your current life situation.',
    duration: 12,
    prompts: [
      'Think about something that has been causing you stress or worry lately. Write it down.',
      'Now divide a page into two columns: "Within My Control" and "Outside My Control." Sort the different aspects of this situation into the appropriate column.',
      'Look at the "Outside My Control" column. How much of your mental energy have you been spending on these things? How does it feel to acknowledge that these are not yours to control?',
      'Look at the "Within My Control" column. What specific actions could you take today to address these aspects? How does focusing here change your sense of agency?',
      'Write a brief statement of acceptance for what you cannot control, and a commitment to action for what you can.'
    ],
    guidance: 'This exercise is based on Epictetus\'s dichotomy of control. Be honest with yourself about what truly is and isn\'t within your power. Remember: your thoughts, judgments, and responses are always within your control.'
  },
  {
    type: 'reflection',
    title: 'Building Your Inner Citadel',
    description: 'Reflect on the qualities and practices that strengthen your inner fortress of peace.',
    duration: 10,
    prompts: [
      'Imagine your Inner Citadel—your personal fortress of peace. What does it look like? Describe its walls, its gates, its interior.',
      'What virtues form the foundation of your citadel? (Examples: patience, courage, wisdom, compassion, integrity)',
      'What practices help you retreat to your Inner Citadel when life becomes chaotic? (Examples: breathing, walking, journaling, prayer)',
      'Think of a time when you successfully found inner peace despite external chaos. What helped you access your citadel in that moment?',
      'What would you like to strengthen in your Inner Citadel? What daily practices could help you build these stronger walls?'
    ],
    guidance: 'The Inner Citadel is a metaphor used by Marcus Aurelius. Your citadel is unique to you—there\'s no right or wrong way to imagine it. The key is that it represents a place of peace that is always available within you.'
  },

  // Thought Experiments
  {
    type: 'thought-experiment',
    title: 'The View from Above',
    description: 'Practice the Stoic meditation of gaining cosmic perspective on your concerns.',
    duration: 10,
    prompts: [
      'Think of something that has been bothering you—a worry, a frustration, a conflict.',
      'Now imagine rising up above your body, looking down at yourself. See yourself in your room, in your building.',
      'Rise higher. See your neighborhood, your city, your country. Your concern is now invisible from this height.',
      'Rise higher still. See the Earth as a blue marble in space. See the solar system, the galaxy, the vast cosmos.',
      'From this cosmic perspective, how does your concern appear? What truly matters when viewed from this height?',
      'Slowly return to your body, bringing with you the gift of perspective. How has your relationship to this concern shifted?'
    ],
    guidance: 'This is a classic Stoic meditation practiced by Marcus Aurelius. The goal is not to dismiss your concerns as unimportant, but to gain perspective on what truly matters and to see your problems in proper proportion.'
  },
  {
    type: 'thought-experiment',
    title: 'Premeditatio Malorum: Preparing for Challenges',
    description: 'Practice the Stoic technique of mentally preparing for difficulties.',
    duration: 12,
    prompts: [
      'The Stoics practiced "premeditatio malorum"—imagining potential difficulties in advance, not to worry, but to prepare.',
      'Think about an upcoming event or situation that makes you anxious. What could go wrong?',
      'For each potential difficulty, ask yourself: "If this happened, what would I do? How would I respond with virtue?"',
      'Imagine yourself handling each challenge with grace, patience, and wisdom. See yourself remaining calm and centered.',
      'Now ask: "What is the worst that could realistically happen? Could I survive it? Could I even grow from it?"',
      'How does mentally preparing for difficulties change your relationship to the upcoming event?'
    ],
    guidance: 'This practice is not about pessimism or worry—it\'s about building resilience by mentally rehearsing wise responses to challenges. The Stoics believed that by preparing for difficulties, we rob them of their power to disturb us.'
  },

  // Visualization Exercises
  {
    type: 'visualization',
    title: 'The Mountain Meditation',
    description: 'A guided visualization to cultivate Stoic stability and groundedness.',
    duration: 15,
    prompts: [
      'Sit comfortably and close your eyes. Take three deep breaths, releasing tension with each exhale.',
      'Imagine yourself becoming a great mountain. Feel your base spreading wide, rooting deep into the earth.',
      'Your body becomes stone—solid, stable, unmovable. Your peak rises toward the sky, touching the clouds.',
      'Now imagine the weather changing around you. Morning mist swirls at your base. Feel it, but remain still.',
      'The sun rises and warms your slopes. Afternoon clouds gather. Rain begins to fall. You remain unmoved.',
      'A storm approaches. Wind howls. Lightning flashes. Thunder roars. You stand firm, grounded, at peace.',
      'The storm passes. Stars emerge. The moon rises. Through all changes, you remain—constant, patient, strong.',
      'Slowly return to your body, but carry the mountain\'s stability with you. You can be this grounded in daily life.',
      'Place your hands on your belly and share this mountain-strength with your baby.'
    ],
    guidance: 'This visualization embodies the Stoic ideal of remaining centered regardless of external circumstances. Practice it whenever you need to find stability amidst chaos.'
  },
  {
    type: 'visualization',
    title: 'Meeting Your Inner Sage',
    description: 'Visualize receiving wisdom from an inner guide embodying Stoic virtues.',
    duration: 12,
    prompts: [
      'Close your eyes and breathe deeply. Imagine walking along a peaceful path toward your Inner Citadel.',
      'As you approach the gates, you see a figure waiting for you—your Inner Sage, embodying perfect wisdom and peace.',
      'This sage might appear as one of the great Stoics (Marcus Aurelius, Seneca, Epictetus) or as a wise figure unique to you.',
      'Approach your sage and sit with them. Feel their calm presence, their deep peace, their loving wisdom.',
      'Ask your sage: "What do I most need to understand right now?" Listen quietly for their response.',
      'Ask: "How can I find more peace in my current situation?" Again, listen with an open heart.',
      'Thank your sage for their wisdom. Know that this wise presence lives within you and is always available.',
      'Slowly return to the present, carrying the sage\'s wisdom with you.'
    ],
    guidance: 'The Stoics often imagined how a perfectly wise person would handle their situations. This visualization helps you access your own inner wisdom by personifying it as a guide.'
  },

  // Breathing Exercises
  {
    type: 'breathing',
    title: 'The Pause Practice',
    description: 'A breathing technique to create space between stimulus and response.',
    duration: 8,
    prompts: [
      'This practice helps you create the crucial pause between what happens and how you respond.',
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts, imagining you are breathing in clarity and calm.',
      'Hold for 4 counts. This is the pause—the space where you choose your response.',
      'Breathe out slowly for 6 counts, releasing reactivity and tension.',
      'Repeat this cycle 5 times, each time deepening your sense of the pause.',
      'Now think of a situation that typically triggers a reactive response in you.',
      'Imagine that situation arising. Breathe in (4 counts). Hold—this is your pause (4 counts). Breathe out your chosen response (6 counts).',
      'Practice this breathing pattern whenever you feel reactive. The pause is your freedom.'
    ],
    guidance: 'The Stoics emphasized that we always have a choice in how we respond. This breathing practice physically creates the pause that allows for that choice. Use it in daily life whenever you feel triggered.'
  },
  {
    type: 'breathing',
    title: 'Breathing into Acceptance',
    description: 'A breathing practice for accepting what cannot be changed.',
    duration: 6,
    prompts: [
      'Sit comfortably and bring to mind something you have been struggling to accept—something outside your control.',
      'Breathe in deeply, acknowledging the reality of this situation. Don\'t fight it; simply acknowledge it.',
      'Breathe out slowly, releasing your resistance. Whisper internally: "I accept what I cannot change."',
      'Breathe in again, this time focusing on what you CAN control—your response, your attitude, your choices.',
      'Breathe out, committing to wise action within your sphere of control.',
      'Continue this pattern: breathing in acceptance of what is, breathing out commitment to wise response.',
      'End by placing your hands on your belly and breathing peace to your baby.'
    ],
    guidance: 'Acceptance is not resignation or approval—it\'s simply acknowledging reality as it is. From this place of acceptance, we can respond wisely rather than wasting energy fighting what cannot be changed.'
  },

  // Creative Exercises
  {
    type: 'creative',
    title: 'Letter from Your Future Self',
    description: 'Write a letter from your wise future self offering Stoic guidance.',
    duration: 15,
    prompts: [
      'Imagine yourself 20 years from now—wiser, more peaceful, having navigated many of life\'s challenges with grace.',
      'This future you has fully developed their Inner Citadel. They embody Stoic virtues: wisdom, courage, justice, temperance.',
      'Now, write a letter from this future self to your present self. What wisdom would they share?',
      'What would they say about the things you\'re currently worried about?',
      'What advice would they give about building your Inner Citadel?',
      'What would they want you to know about raising your child with Stoic wisdom?',
      'End the letter with words of encouragement and love from your future self to your present self.'
    ],
    guidance: 'This exercise helps you access your own inner wisdom by projecting it into a future version of yourself. The advice you write is wisdom you already possess—you\'re simply giving yourself permission to hear it.'
  },
  {
    type: 'creative',
    title: 'Your Personal Stoic Maxims',
    description: 'Create your own collection of Stoic-inspired wisdom statements.',
    duration: 12,
    prompts: [
      'The Stoics often distilled their wisdom into short, memorable maxims. Now it\'s your turn to create your own.',
      'Write a maxim about what you can and cannot control. (Example: "I am the captain of my responses, not the master of the sea.")',
      'Write a maxim about finding peace amidst chaos. (Example: "The storm rages outside; within, I tend my garden.")',
      'Write a maxim about responding rather than reacting. (Example: "Between the spark and the flame, I choose.")',
      'Write a maxim about perspective. (Example: "From the stars, my troubles are stardust.")',
      'Write a maxim you want to pass on to your child about resilience.',
      'Choose your favorite maxim and write it somewhere you\'ll see it daily.'
    ],
    guidance: 'Creating your own maxims helps internalize Stoic wisdom in your own words. These personal statements can become anchors you return to in difficult moments.'
  },

  // Discussion Exercises
  {
    type: 'discussion',
    title: 'Stoic Parenting Conversations',
    description: 'Questions to discuss with your partner about raising children with Stoic wisdom.',
    duration: 15,
    prompts: [
      'How can we model the dichotomy of control for our child? What language might we use to help them understand what they can and cannot control?',
      'When our child faces disappointment or frustration, how can we help them find their Inner Citadel without dismissing their feelings?',
      'What Stoic virtues (wisdom, courage, justice, temperance) do we most want to cultivate in our family? How can we model these?',
      'How do we currently handle our own emotional reactions in front of our child? How might we improve?',
      'The Stoics valued perspective. How can we help our child develop a healthy sense of proportion about life\'s challenges?',
      'What family practices might help us all build stronger Inner Citadels together?'
    ],
    guidance: 'These conversations can help you and your partner align on how to incorporate Stoic wisdom into your parenting approach. Remember: children learn more from what we model than from what we say.'
  }
];

/**
 * Get Stoicism exercises by type
 */
export function getStoicismExercisesByType(type: Exercise['type']): Exercise[] {
  return stoicismExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all Stoicism exercises
 */
export function getStoicismTotalExerciseDuration(): number {
  return stoicismExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a Stoicism session
 */
export function getStoicismRecommendedSequence(): Exercise[] {
  return [
    stoicismExercises.find(e => e.title === 'The Pause Practice')!,
    stoicismExercises.find(e => e.title === 'The Mountain Meditation')!,
    stoicismExercises.find(e => e.title === 'Mapping Your Circles of Control')!,
  ];
}

export default stoicismExercises;
