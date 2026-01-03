/**
 * Daily Mindfulness Exercises
 * Breathing, body-scan, gratitude, visualization, and connection exercises
 */

import type { MindfulnessExercise } from '../../../types/daily';

export const mindfulnessExercises: MindfulnessExercise[] = [
  // Breathing exercises
  {
    id: 'breathing-001',
    type: 'breathing',
    title: 'Ocean Breath',
    duration: 180,
    instructions: [
      'Find a comfortable seated position with your spine straight.',
      'Close your eyes and place one hand on your belly.',
      'Breathe in slowly through your nose for 4 counts, feeling your belly rise.',
      'Hold gently for 2 counts.',
      'Exhale slowly through your mouth for 6 counts, like waves receding.',
      'Repeat this cycle, imagining ocean waves with each breath.',
    ],
    babyConnection: 'Your rhythmic breathing creates a gentle rocking motion for your baby, like being cradled by ocean waves.',
  },
  {
    id: 'breathing-002',
    type: 'breathing',
    title: '4-7-8 Calming Breath',
    duration: 240,
    instructions: [
      'Sit comfortably and relax your shoulders.',
      'Place the tip of your tongue behind your upper front teeth.',
      'Exhale completely through your mouth.',
      'Inhale quietly through your nose for 4 counts.',
      'Hold your breath for 7 counts.',
      'Exhale completely through your mouth for 8 counts.',
      'This is one cycle. Complete 4 cycles.',
    ],
    babyConnection: 'This calming technique reduces stress hormones, creating a peaceful environment for your baby.',
  },
  {
    id: 'breathing-003',
    type: 'breathing',
    title: 'Box Breathing',
    duration: 200,
    instructions: [
      'Visualize a square in your mind.',
      'Inhale for 4 counts as you trace the first side.',
      'Hold for 4 counts as you trace the second side.',
      'Exhale for 4 counts as you trace the third side.',
      'Hold for 4 counts as you trace the fourth side.',
      'Continue for 5 complete squares.',
    ],
    babyConnection: 'The steady rhythm of box breathing helps regulate your nervous system, which your baby can sense.',
  },

  // Body-scan exercises
  {
    id: 'bodyscan-001',
    type: 'body-scan',
    title: 'Progressive Relaxation',
    duration: 300,
    instructions: [
      'Lie down comfortably on your left side with a pillow between your knees.',
      'Starting with your feet, notice any tension and consciously release it.',
      'Move up to your calves, then thighs, releasing tension as you go.',
      'Notice your lower back and hips, sending breath to any tight areas.',
      'Continue up through your belly, chest, shoulders, arms, and hands.',
      'Finally, relax your neck, jaw, and face muscles.',
      'Rest in this relaxed state for a few moments.',
    ],
    babyConnection: 'As you release tension, your baby feels the softening of your muscles and the calm in your body.',
  },
  {
    id: 'bodyscan-002',
    type: 'body-scan',
    title: 'Womb Awareness',
    duration: 240,
    instructions: [
      'Place both hands gently on your belly.',
      'Close your eyes and take three deep breaths.',
      'Bring your awareness to the space beneath your hands.',
      'Notice any sensations - warmth, movement, or stillness.',
      'Imagine a soft golden light surrounding your baby.',
      'Send feelings of love and safety with each exhale.',
      'Stay present with these sensations for several minutes.',
    ],
    babyConnection: 'This focused attention strengthens the bond between you and your baby through intentional presence.',
  },

  // Gratitude exercises
  {
    id: 'gratitude-001',
    type: 'gratitude',
    title: 'Three Good Things',
    duration: 180,
    instructions: [
      'Take a moment to settle into stillness.',
      'Think of three good things that happened today, no matter how small.',
      'For each one, recall the specific details - what you saw, heard, or felt.',
      'Notice how your body responds as you remember these moments.',
      'Silently express gratitude for each experience.',
      'Carry this feeling of appreciation with you.',
    ],
    babyConnection: 'Gratitude releases positive hormones that cross the placenta, bathing your baby in feelings of wellbeing.',
  },
  {
    id: 'gratitude-002',
    type: 'gratitude',
    title: 'Body Appreciation',
    duration: 200,
    instructions: [
      'Sit comfortably and close your eyes.',
      'Thank your heart for beating steadily, nourishing you and your baby.',
      'Thank your lungs for each breath that brings oxygen to your little one.',
      'Thank your body for creating and nurturing new life.',
      'Thank your mind for learning and growing alongside your baby.',
      'Rest in appreciation for this miraculous process.',
    ],
    babyConnection: 'Appreciating your body creates positive associations that support a healthy pregnancy mindset.',
  },

  // Visualization exercises
  {
    id: 'visualization-001',
    type: 'visualization',
    title: 'Meeting Your Baby',
    duration: 300,
    instructions: [
      'Close your eyes and take several deep breaths.',
      'Imagine yourself in a peaceful, beautiful place.',
      'Picture yourself holding your baby for the first time.',
      'Notice the weight of your baby in your arms.',
      'See your baby\'s face, their tiny fingers and toes.',
      'Feel the love flowing between you.',
      'Speak softly to your baby, sharing your hopes and dreams.',
      'When ready, gently return to the present moment.',
    ],
    babyConnection: 'Positive visualization helps prepare your mind and heart for the beautiful moment of meeting your baby.',
  },
  {
    id: 'visualization-002',
    type: 'visualization',
    title: 'Safe Space',
    duration: 240,
    instructions: [
      'Breathe deeply and let your body relax.',
      'Imagine a place where you feel completely safe and at peace.',
      'It could be real or imagined - a beach, forest, or cozy room.',
      'Notice the colors, sounds, and scents of this place.',
      'Feel the safety and comfort surrounding you.',
      'Know that you can return to this place anytime you need calm.',
    ],
    babyConnection: 'Creating a mental safe space helps you manage stress, which benefits both you and your baby.',
  },

  // Connection exercises
  {
    id: 'connection-001',
    type: 'connection',
    title: 'Heartbeat Harmony',
    duration: 180,
    instructions: [
      'Place one hand on your heart and one on your belly.',
      'Feel your own heartbeat under your hand.',
      'Know that your baby can hear this rhythm constantly.',
      'Imagine your heartbeats synchronizing.',
      'Send love through this connection with each beat.',
      'Whisper or think loving words to your baby.',
    ],
    babyConnection: 'Your heartbeat is the first sound your baby knows - this exercise deepens that primal bond.',
  },
  {
    id: 'connection-002',
    type: 'connection',
    title: 'Light of Love',
    duration: 240,
    instructions: [
      'Sit quietly with your hands on your belly.',
      'Imagine a warm, golden light in your heart center.',
      'With each breath, let this light grow brighter.',
      'See the light flowing down to surround your baby.',
      'Feel the warmth and love in this light.',
      'Know that your baby is bathed in your love.',
      'Rest in this connection for several breaths.',
    ],
    babyConnection: 'This visualization strengthens the emotional bond and creates positive associations for your baby.',
  },
  {
    id: 'connection-003',
    type: 'connection',
    title: 'Singing to Baby',
    duration: 200,
    instructions: [
      'Choose a simple song or lullaby you love.',
      'Place your hands on your belly.',
      'Hum or sing softly to your baby.',
      'Feel the vibrations traveling through your body.',
      'Notice if your baby responds with movement.',
      'Continue for as long as feels comfortable.',
    ],
    babyConnection: 'Babies recognize and are soothed by songs they heard in the womb after birth.',
  },
];

/**
 * Get mindfulness exercise for a specific date
 */
export function getMindfulnessForDate(date: Date): MindfulnessExercise {
  const dayOfYear = getDayOfYear(date);
  return mindfulnessExercises[dayOfYear % mindfulnessExercises.length];
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get exercises by type
 */
export function getMindfulnessByType(type: MindfulnessExercise['type']): MindfulnessExercise[] {
  return mindfulnessExercises.filter(ex => ex.type === type);
}

/**
 * Get all mindfulness exercises
 */
export function getAllMindfulnessExercises(): MindfulnessExercise[] {
  return mindfulnessExercises;
}
