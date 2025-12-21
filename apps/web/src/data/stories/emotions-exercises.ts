/**
 * Emotions Story Exercises
 * 
 * Topic-specific exercises for "The Rainbow of Feelings: Understanding Emotions"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const emotionsExercises: Exercise[] = [
  // Emotion Identification Activity (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Naming the Weather Inside',
    description: 'Practice identifying and naming your emotions throughout the day.',
    duration: 12,
    prompts: [
      'Take a moment right now to check in with yourself. What emotion are you feeling? Try to name it specifically—not just "good" or "bad," but the actual feeling: content, anxious, hopeful, tired, grateful, worried?',
      'Where do you feel this emotion in your body? Emotions often have physical signatures—a warmth in the chest, a tightness in the shoulders, a flutter in the stomach. Notice where your current feeling lives.',
      'Think back over the past 24 hours. What emotions have you experienced? Try to identify at least five different feelings you\'ve had. Notice how your emotional weather has changed.',
      'Consider: are there emotions you tend to avoid or push away? Are there feelings you\'re more comfortable with than others? What might you learn from the emotions you resist?'
    ],
    guidance: 'Emotion identification is the foundation of emotional intelligence. The more precisely you can name your feelings, the better you can understand and manage them. This skill will help you model emotional awareness for your baby.'
  },
  {
    type: 'reflection',
    title: 'The Emotion Body Map',
    description: 'Explore where different emotions show up in your body.',
    duration: 10,
    prompts: [
      'Think of a time you felt pure joy. Where did you feel it in your body? Perhaps a lightness in your chest, a smile spreading across your face, energy in your limbs?',
      'Now recall a moment of sadness. Where did that emotion live? Perhaps heaviness in your heart, a lump in your throat, tiredness in your whole body?',
      'Remember a time you felt afraid. Where did fear show up? Perhaps a racing heart, tension in your shoulders, a knot in your stomach?',
      'Consider anger. When you\'ve felt frustrated or upset, where does that emotion manifest? Perhaps heat in your face, clenching in your jaw, tension in your hands?',
      'Finally, think of love—the feeling you have for your baby. Where does love live in your body? Notice how this emotion feels different from the others.'
    ],
    guidance: 'Understanding the physical signatures of emotions helps you catch feelings early, before they become overwhelming. Your body often knows what you\'re feeling before your mind does.'
  },

  // Breathing Exercise for Emotional Calm (Requirement 10.2)
  {
    type: 'breathing',
    title: 'The Calming Breath',
    description: 'A breathing technique to activate your body\'s relaxation response and soothe strong emotions.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes and take a moment to notice how you feel.',
      'We\'re going to practice 4-7-8 breathing, a technique that activates your parasympathetic nervous system—your body\'s natural calming system.',
      'Breathe in slowly through your nose for 4 counts: one... two... three... four.',
      'Hold your breath gently for 7 counts: one... two... three... four... five... six... seven.',
      'Exhale slowly through your mouth for 8 counts: one... two... three... four... five... six... seven... eight.',
      'Let\'s repeat this three more times. With each cycle, feel your body relaxing more deeply.',
      'Notice how you feel now compared to when you started. Your baby feels this calm too—your relaxation response crosses the placenta.',
      'You can use this technique anytime you feel overwhelmed by emotions. It\'s like pressing a reset button for your nervous system.'
    ],
    guidance: 'The extended exhale is key—it signals to your brain that you\'re safe, reducing stress hormones and promoting calm. Practice this when you\'re already calm so it becomes automatic when you need it.'
  },
  {
    type: 'breathing',
    title: 'Riding the Emotional Wave',
    description: 'A breathing practice for moving through difficult emotions without being overwhelmed.',
    duration: 12,
    prompts: [
      'This exercise helps you ride emotional waves rather than being swept away by them. Sit comfortably and close your eyes.',
      'Think of a mildly difficult emotion you\'ve experienced recently—not your most intense feeling, but something manageable. Let yourself feel it slightly.',
      'Now imagine this emotion as a wave in the ocean. See it rising, building, approaching.',
      'As the wave rises, breathe in slowly. Feel the emotion building, but stay grounded.',
      'At the crest of the wave, hold your breath briefly. You\'re at the peak of the feeling.',
      'As you exhale slowly, imagine the wave passing, receding, dissolving back into the ocean. The emotion is moving through you.',
      'Repeat this several times: breathe in as the wave rises, hold at the crest, exhale as it passes.',
      'Remember: emotions are like waves. They rise, they crest, they fall. You can\'t stop them, but you can learn to ride them.'
    ],
    guidance: 'This technique teaches that emotions are temporary and survivable. By breathing through them rather than fighting them, you allow feelings to move through you naturally.'
  },

  // Reflection on Feelings (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Emotions as Messengers',
    description: 'Reflect on what your emotions are trying to tell you.',
    duration: 15,
    prompts: [
      'Think of a recent emotion you experienced. What message might it have been carrying? If happiness, what was it saying "yes" to? If fear, what was it protecting you from? If anger, what boundary was being crossed?',
      'Consider an emotion you often try to avoid or suppress. What might happen if you listened to it instead? What wisdom might it be trying to share?',
      'Reflect on how your emotional patterns have changed during pregnancy. Are there feelings that have intensified? New emotions you\'ve discovered? What might these changes be teaching you?',
      'Write a letter to one of your emotions—perhaps one you struggle with. Thank it for trying to help you. Ask it what it needs you to understand.'
    ],
    guidance: 'Every emotion carries information. When we treat feelings as messengers rather than problems, we can learn from them and respond more wisely.'
  },
  {
    type: 'reflection',
    title: 'Your Emotional Heritage',
    description: 'Reflect on how you learned about emotions and what you want to pass on.',
    duration: 12,
    prompts: [
      'Think about how emotions were handled in your family growing up. Were feelings openly expressed or kept private? Were some emotions more acceptable than others?',
      'What messages did you receive about emotions as a child? "Big girls don\'t cry"? "Don\'t be angry"? "Always look on the bright side"? How have these messages shaped you?',
      'Consider what you want to do differently with your own child. What emotional lessons do you want to pass on? What patterns do you want to change?',
      'Write down three things you want your child to know about emotions. These will be the foundation of their emotional education.'
    ],
    guidance: 'We often unconsciously repeat the emotional patterns we learned in childhood. Reflecting on your emotional heritage helps you choose consciously what to pass on.'
  },

  // Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'A World Without Emotions',
    description: 'Explore the purpose of emotions through imagination.',
    duration: 10,
    prompts: [
      'Imagine you woke up tomorrow and couldn\'t feel any emotions at all. No happiness, no sadness, no fear, no love. How would your day be different?',
      'Without fear, would you still avoid dangerous situations? Without joy, would you still seek out beautiful experiences? Without love, would you still care for your baby?',
      'Consider: emotions evolved because they helped our ancestors survive. Fear kept them safe from predators. Disgust protected them from disease. Love bonded them to their children. What would happen to a species without emotions?',
      'Now appreciate your emotions anew. Even the difficult ones serve a purpose. What would you lose if you couldn\'t feel sadness? What would you miss if you never felt anger?'
    ],
    guidance: 'This thought experiment helps us appreciate that emotions aren\'t problems to be eliminated—they\'re essential guides that help us navigate life.'
  },
  {
    type: 'thought-experiment',
    title: 'The Emotion Advisor Council',
    description: 'Imagine your emotions as advisors with different perspectives.',
    duration: 12,
    prompts: [
      'Imagine you\'re a wise ruler, and your emotions are advisors sitting around a council table. Each one has a different perspective and different concerns.',
      'Fear speaks up: "I\'m worried about the future. What if something goes wrong?" What valid concerns might Fear be raising? What does Fear need to feel heard?',
      'Joy responds: "But look at all the wonderful things happening! The baby is growing, love is abundant." What is Joy celebrating? What does Joy want you to notice?',
      'Sadness adds: "I miss how things used to be. Change is hard." What losses is Sadness honoring? What does Sadness need you to acknowledge?',
      'As the wise ruler, how do you respond to all your advisors? How do you honor each perspective while making wise decisions?'
    ],
    guidance: 'This exercise helps you see emotions as parts of yourself with valid perspectives, rather than forces to be controlled. All your inner advisors deserve to be heard.'
  },

  // Visualization (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The Weather Inside',
    description: 'A guided visualization exploring your emotional landscape.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, let go of distractions and turn your attention inward.',
      'Imagine you\'re looking up at your inner sky—the sky inside your mind where your emotional weather plays out. What do you see? Is it sunny? Cloudy? Stormy? Calm?',
      'Notice that this sky is always changing. Watch as clouds drift by, as the light shifts, as the weather patterns move. This is the nature of emotions—always in motion.',
      'Now imagine you can see the sun behind any clouds. It\'s always there, even when hidden. This sun represents your core self—calm, aware, unchanging beneath the weather.',
      'See a small, new sky forming nearby—your baby\'s emotional sky, just beginning to develop. It\'s mostly calm and peaceful, influenced by your weather.',
      'Imagine a gentle rainbow connecting your sky to your baby\'s. Your emotional weather flows across this bridge. Send calm, loving weather to your little one.',
      'Take a few more breaths, resting in the awareness that you are not your weather—you are the sky itself, vast enough to hold any emotion.',
      'Slowly return to the room, carrying this perspective with you.'
    ],
    guidance: 'This visualization helps you develop a healthy relationship with emotions—experiencing them fully while knowing you are more than any single feeling.'
  },
  {
    type: 'visualization',
    title: 'The Rainbow of Feelings',
    description: 'Visualize the full spectrum of emotions as colors.',
    duration: 10,
    prompts: [
      'Sit comfortably and close your eyes. Take a few deep breaths.',
      'Imagine a beautiful rainbow arcing across your inner sky. Each color represents a different emotion.',
      'See the red of passion and anger—intense, powerful, energizing. This color gives you strength to stand up for what matters.',
      'See the orange of excitement and enthusiasm—warm, vibrant, motivating. This color drives you toward new experiences.',
      'See the yellow of joy and happiness—bright, sunny, uplifting. This color celebrates life\'s goodness.',
      'See the green of peace and balance—calm, natural, healing. This color restores and renews you.',
      'See the blue of sadness and depth—quiet, reflective, meaningful. This color honors what you love.',
      'See the purple of wonder and mystery—rich, spiritual, transcendent. This color connects you to something greater.',
      'All these colors together make the rainbow complete. All these emotions together make you fully human. Appreciate the full spectrum.',
      'Take a deep breath and slowly open your eyes, carrying the rainbow within you.'
    ],
    guidance: 'This visualization helps you appreciate that all emotions have value and beauty. A life with only one color would be impoverished—we need the full rainbow.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Conversations About Feelings',
    description: 'Questions to discuss with your partner, family, or friends about emotions.',
    duration: 15,
    prompts: [
      'How do you typically handle difficult emotions? Do you express them, suppress them, or something in between? How has this approach served you?',
      'What emotions do you find most challenging? Fear? Anger? Sadness? Why do you think these particular feelings are hard for you?',
      'How do you want to respond when your baby cries or shows distress? What do you want them to learn about emotions from how you react?',
      'What role do you think emotions should play in decision-making? Should we follow our feelings or override them with logic?',
      'How can partners support each other emotionally during pregnancy and parenthood? What do you need when you\'re feeling overwhelmed?'
    ],
    guidance: 'Discussing emotions openly helps normalize them and builds emotional intimacy. These conversations can strengthen your relationship and prepare you for parenting together.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Expressing the Rainbow',
    description: 'Creative activities to explore and express your emotional world.',
    duration: 20,
    prompts: [
      'Create an "emotion color wheel"—assign colors to different feelings and create a visual representation of your emotional palette. What colors dominate? What colors are missing?',
      'Write a short poem or letter to your baby about emotions. What do you want them to know about feelings? What wisdom would you share?',
      'Draw or paint your current emotional weather. Don\'t worry about artistic skill—just let the colors and shapes express how you feel.',
      'Create a playlist of songs that represent different emotions. What music captures joy for you? Sadness? Peace? Love?',
      'Write a journal entry from your baby\'s perspective, imagining what emotions they might be experiencing in the womb. What might they be feeling?'
    ],
    guidance: 'Creative expression is a powerful way to process emotions. Art, music, and writing can help you access and express feelings that are hard to put into words.'
  },

  // Journaling Prompts (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Emotion Journal',
    description: 'Journaling prompts to deepen your emotional awareness.',
    duration: 15,
    prompts: [
      'Describe your emotional state right now in as much detail as possible. What are you feeling? Where do you feel it? What triggered it? What does it need?',
      'Write about a time when you successfully navigated a difficult emotion. What helped? What did you learn? How can you apply this in the future?',
      'Reflect on the emotions you\'ve felt most strongly during pregnancy. How has your emotional landscape changed? What new feelings have emerged?',
      'Write about the emotional relationship you hope to have with your child. How do you want to respond to their feelings? What emotional skills do you want to model?',
      'Consider: what would it mean to let emotions be your guides rather than your masters? How would your life be different if you fully trusted your feelings while still choosing your responses?'
    ],
    guidance: 'Regular journaling about emotions builds self-awareness and helps you process feelings. Even a few minutes of emotional writing can provide clarity and relief.'
  }
];

/**
 * Get exercises by type
 */
export function getEmotionsExercisesByType(type: Exercise['type']): Exercise[] {
  return emotionsExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getEmotionsTotalExerciseDuration(): number {
  return emotionsExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getEmotionsRecommendedSequence(): Exercise[] {
  return [
    emotionsExercises.find(e => e.title === 'Naming the Weather Inside')!,
    emotionsExercises.find(e => e.title === 'The Calming Breath')!,
    emotionsExercises.find(e => e.title === 'The Weather Inside')!,
  ];
}

export default emotionsExercises;
