/**
 * Fibonacci and Fractals Story Exercises
 * 
 * Topic-specific exercises for "Nature's Secret Code: Fibonacci and Fractals"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const fibonacciExercises: Exercise[] = [
  // Pattern Spotting Activity (Requirement 10.1, 10.2)
  {
    type: 'reflection',
    title: 'Fibonacci in Your World',
    description: 'Discover and document Fibonacci patterns in your everyday environment.',
    duration: 15,
    prompts: [
      'Look at any flowers you have access to—real or in photographs. Count the petals. Many flowers have Fibonacci numbers of petals: lilies have 3, buttercups have 5, delphiniums have 8, marigolds have 13, daisies often have 21, 34, or 55. What do you find?',
      'Examine a pinecone, pineapple, or artichoke if you have one. Try to count the spirals going in each direction. Do you find Fibonacci numbers?',
      'Look at the plants in your home or garden. Notice how leaves are arranged on stems. Many plants position leaves at angles that follow Fibonacci patterns to maximize sunlight. What arrangements do you observe?',
      'Think about the spirals you encounter daily—in shells, in the way water drains, in the curl of a cat\'s tail when sleeping. Which ones might follow the Golden Ratio?',
      'Write about how it feels to suddenly see mathematical patterns in things you\'ve looked at your whole life without noticing.'
    ],
    guidance: 'This exercise trains your eye to see Fibonacci patterns. Don\'t worry if your counts aren\'t perfect—the goal is to start noticing these patterns everywhere.'
  },
  {
    type: 'reflection',
    title: 'Fractals All Around',
    description: 'Identify and reflect on fractal patterns in nature and your environment.',
    duration: 12,
    prompts: [
      'Look at a tree, either outside your window or in a photograph. Notice how the trunk splits into branches, branches into smaller branches, and those into twigs. Describe this branching pattern in your own words.',
      'Examine a head of broccoli or cauliflower (Romanesco is especially dramatic). Notice how each floret looks like a miniature version of the whole. How does this self-similarity make you feel?',
      'Think about the fractal patterns inside your own body—your branching blood vessels, your lungs with their millions of tiny air sacs, your neurons with their branching dendrites. What emotions arise when you consider this?',
      'Look at clouds, coastlines on a map, or the edge of a leaf. Notice the irregular, jagged quality that repeats at different scales. Where else do you see this kind of roughness?',
      'Write about a fractal pattern that particularly moves or amazes you. Why does it stand out?'
    ],
    guidance: 'Fractals are everywhere once you start looking. This exercise helps you develop "fractal vision"—the ability to see self-similarity in the world around you.'
  },

  // Spiral Drawing Exercise (Requirement 10.2, 10.4)
  {
    type: 'creative',
    title: 'Drawing the Golden Spiral',
    description: 'Create your own Fibonacci spiral through a step-by-step drawing exercise.',
    duration: 20,
    prompts: [
      'Get a piece of paper and a pencil. Start by drawing a small square, about 1cm x 1cm. This represents the number 1.',
      'Draw another 1cm x 1cm square next to it. Now you have two squares side by side, representing 1, 1.',
      'Below these two squares, draw a 2cm x 2cm square that spans both of them. Now you have 1, 1, 2.',
      'To the right of your arrangement, draw a 3cm x 3cm square. Your pattern now shows 1, 1, 2, 3.',
      'Above everything, draw a 5cm x 5cm square. Then to the left, an 8cm x 8cm square. Continue as far as your paper allows.',
      'Now, starting in the smallest square, draw a quarter-circle arc from one corner to the opposite corner. Continue this arc through each square, always curving in the same direction.',
      'Step back and look at your spiral. This is the Fibonacci spiral, an approximation of the Golden Spiral found throughout nature.',
      'How does it feel to have drawn this ancient pattern with your own hands? Write a few sentences about the experience.'
    ],
    guidance: 'Don\'t worry about perfection—the goal is to experience the pattern through creation. You can use graph paper to make the squares more precise if you prefer.'
  },
  {
    type: 'creative',
    title: 'Fractal Art Creation',
    description: 'Create simple fractal patterns through drawing or collage.',
    duration: 18,
    prompts: [
      'Draw a simple tree: start with a trunk, then add two branches at the top. On each branch, add two smaller branches. On each of those, add two even smaller branches. Continue until your branches are tiny. You\'ve created a fractal tree!',
      'Try drawing a Koch snowflake: Start with a triangle. On each side, draw a smaller triangle pointing outward (like a Star of David). On each new side, draw an even smaller triangle. Continue for 3-4 iterations.',
      'Create a "fractal collage" by cutting out similar shapes in decreasing sizes and arranging them so smaller versions nest inside or branch from larger ones.',
      'Draw a fern frond: Start with a curved stem. Add leaflets along one side, each one a smaller curved shape. On each leaflet, add even smaller leaflets. Notice how the whole emerges from repetition.',
      'Photograph or sketch your creations. Write about what you learned from making fractals by hand.'
    ],
    guidance: 'Creating fractals by hand helps you understand how simple rules create complex patterns. Embrace imperfection—nature\'s fractals aren\'t perfect either!'
  },

  // Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'Zooming Into Infinity',
    description: 'Explore the concept of infinite detail through imagination.',
    duration: 10,
    prompts: [
      'Imagine you have a magical magnifying glass that can zoom in forever. You\'re looking at the edge of the Mandelbrot set. As you zoom in, you see spirals and tendrils and tiny copies of the whole set. Zoom in more—more detail appears. Zoom in a million times—still more detail. What does it feel like to explore something with infinite complexity?',
      'Now imagine zooming into a coastline. From space, you see the general shape. From a plane, you see bays and peninsulas. From the ground, you see rocks and coves. With a magnifying glass, you see pebbles and grains of sand. At every scale, there\'s more detail. Where does the coastline "end"?',
      'Think about the boundary between "inside" and "outside" your body. Your skin seems like a clear boundary, but zoom in and you find pores, hair follicles, bacteria, cells with their own boundaries. Is there a definite edge to "you"?',
      'What does it mean for something to have infinite detail? Can our finite minds truly grasp infinity, or can we only approach it?'
    ],
    guidance: 'These thought experiments stretch your imagination toward infinity. There are no right answers—the goal is to feel the wonder of infinite complexity.'
  },
  {
    type: 'thought-experiment',
    title: 'Simple Rules, Complex Beauty',
    description: 'Contemplate how complexity emerges from simplicity.',
    duration: 10,
    prompts: [
      'The Fibonacci sequence comes from one simple rule: add the two previous numbers. Yet this rule creates patterns found in galaxies and flowers. What other simple rules in nature create complex results?',
      'A snowflake forms from water molecules following simple physical laws, yet each one is unique and intricate. How does simplicity give birth to complexity?',
      'Your baby is growing from a single cell, following instructions in DNA. Simple chemical rules, repeated trillions of times, are creating a human being. What does this tell you about the relationship between simplicity and complexity?',
      'If complex beauty can emerge from simple rules, what does this suggest about the nature of creativity? About the nature of the universe itself?'
    ],
    guidance: 'This exercise explores one of nature\'s deepest mysteries: the emergence of complexity from simplicity. Let yourself wonder without needing answers.'
  },

  // Reflection on Nature's Mathematics (Requirement 10.1, 10.3)
  {
    type: 'visualization',
    title: 'The Spiral Journey',
    description: 'A guided visualization through nature\'s spiral patterns.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, let go of thoughts and prepare to journey through spirals.',
      'You\'re standing in a sunflower field at golden hour. Walk up to the tallest sunflower and look into its face. See the seeds arranged in perfect spirals—some curving left, some curving right. Count them if you can: 34 one way, 55 the other. Fibonacci numbers, grown from sunlight and soil.',
      'Now you\'re on a beach, holding a nautilus shell. Trace the spiral with your finger, feeling each chamber slightly larger than the last. This creature grew this shell over years, adding chambers in the Golden Ratio without ever knowing mathematics.',
      'You\'re in a galaxy now, looking down at the Milky Way. See its spiral arms sweeping outward, the same mathematical curve as the shell in your hand. The same pattern, from centimeters to light-years.',
      'Now you\'re inside your own body, traveling through your lungs. See the airways branching, branching, branching—fractal pathways carrying life-giving oxygen. You are made of the same patterns as galaxies and shells.',
      'Finally, feel your baby curled in a spiral inside you. The fetal position—nature\'s favorite shape for new life. You are holding a spiral within a spiral within a spiral.',
      'Take a deep breath and slowly return, carrying the wonder of spirals with you.'
    ],
    guidance: 'This visualization connects you to spiral patterns across all scales. Read slowly, allowing 20-30 seconds between prompts for the images to form.'
  },
  {
    type: 'visualization',
    title: 'The Fractal Forest',
    description: 'A guided visualization exploring self-similarity in nature.',
    duration: 12,
    prompts: [
      'Close your eyes and breathe deeply. You\'re entering a forest where fractal patterns are visible to your magical sight.',
      'Stand before an ancient oak tree. See how the trunk divides into great limbs, limbs into branches, branches into twigs, twigs into the tiniest stems holding leaves. The same branching pattern, repeated at every scale.',
      'Kneel beside a fern. Pick one frond and hold it up. See how it\'s made of smaller fronds, which are made of even smaller fronds. Each part contains the pattern of the whole.',
      'Look up at the clouds. See how large billows are made of smaller billows, which are made of even smaller puffs. Fractal patterns in water vapor, painted across the sky.',
      'A stream runs through the forest. Follow it and see how it joins other streams, which join larger streams, which join rivers. The same branching pattern as the trees, but in reverse—tributaries flowing together instead of branches spreading apart.',
      'Lightning flashes in the distance. For an instant, you see its branching path—the same pattern as the trees, the streams, the blood vessels in your own body. Everything connected by the same mathematical truth.',
      'Take a breath of fractal air and return to the present, seeing the world with new eyes.'
    ],
    guidance: 'This visualization helps you internalize the concept of self-similarity. Let the images form naturally without forcing them.'
  },

  // Breathing Exercise (Requirement 10.3)
  {
    type: 'breathing',
    title: 'Golden Ratio Breathing',
    description: 'A breathing exercise based on the Golden Ratio proportion.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. We\'re going to breathe using the Golden Ratio—approximately 1.6 to 1.',
      'Breathe in for 3 counts... breathe out for 5 counts. (5 ÷ 3 ≈ 1.67, close to the Golden Ratio)',
      'Again: in for 3... out for 5...',
      'Continue this pattern, feeling the natural, pleasing rhythm of the Golden Ratio.',
      'Now try: in for 5 counts... out for 8 counts. (8 ÷ 5 = 1.6, even closer to the Golden Ratio)',
      'Again: in for 5... out for 8...',
      'Feel how this proportion creates a sense of balance and calm.',
      'Finally, try: in for 8 counts... out for 13 counts. (13 ÷ 8 = 1.625)',
      'This longer breath brings deep relaxation while maintaining the Golden proportion.',
      'Return to natural breathing, carrying the Golden Ratio\'s harmony in your body.'
    ],
    guidance: 'The Golden Ratio creates naturally pleasing proportions, even in breath. Don\'t strain—adjust the counts to what feels comfortable while maintaining the approximate ratio.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'The Mathematics of Beauty',
    description: 'Questions to explore with your partner, family, or friends about patterns and beauty.',
    duration: 15,
    prompts: [
      'Why do you think we find Fibonacci spirals and Golden Ratio proportions beautiful? Is it learned, or is it built into our brains through evolution?',
      'The same patterns appear in living things (sunflowers, shells) and non-living things (galaxies, hurricanes). What does this suggest about the nature of reality?',
      'Fractals show that infinite complexity can arise from simple rules. What does this tell us about creativity, about life, about the universe?',
      'How might you help your child notice and appreciate these patterns as they grow? What activities or observations would you share?',
      'Some people see these patterns as evidence of design; others see them as evidence of natural laws. What do you think? Does it matter?'
    ],
    guidance: 'These questions invite deep conversation about mathematics, beauty, and meaning. There are no right answers—the goal is to explore ideas together.'
  },

  // Creative Journaling (Requirement 10.4)
  {
    type: 'creative',
    title: 'Pattern Journal',
    description: 'Journaling prompts to deepen your connection to Fibonacci and fractal patterns.',
    duration: 15,
    prompts: [
      'Write about your first memory of noticing a pattern in nature. What did you see? How did it make you feel? Did anyone share that moment with you?',
      'Describe a spiral that has meaning to you—perhaps a shell you collected, a flower you love, or even the spiral of your own ear. What does this spiral represent in your life?',
      'Write a letter to your baby about the patterns you hope they\'ll notice in the world. What Fibonacci spirals will you point out? What fractals will you explore together?',
      'Imagine you could talk to Leonardo Fibonacci. What would you ask him about his famous sequence? What would you tell him about where his numbers appear in nature?',
      'Write a short poem or paragraph using Fibonacci numbers to structure it—perhaps 1 word, then 1 word, then 2 words, then 3, then 5, then 8...'
    ],
    guidance: 'Journaling helps process and personalize what you\'ve learned. Write freely without worrying about perfection—let the patterns guide your thoughts.'
  }
];

/**
 * Get exercises by type
 */
export function getFibonacciExercisesByType(type: Exercise['type']): Exercise[] {
  return fibonacciExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getFibonacciTotalExerciseDuration(): number {
  return fibonacciExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getFibonacciRecommendedSequence(): Exercise[] {
  return [
    fibonacciExercises.find(e => e.title === 'Golden Ratio Breathing')!,
    fibonacciExercises.find(e => e.title === 'The Spiral Journey')!,
    fibonacciExercises.find(e => e.title === 'Fibonacci in Your World')!,
  ];
}

export default fibonacciExercises;
