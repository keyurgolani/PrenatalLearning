/**
 * AI Story Exercises
 * 
 * Topic-specific exercises for "Teaching Machines to Learn: The AI Story"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const aiExercises: Exercise[] = [
  // Pattern Recognition Activity (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Pattern Detective',
    description: 'Practice pattern recognition—the core skill that powers AI—by finding patterns in everyday life.',
    duration: 12,
    prompts: [
      'Look at your hand. What patterns do you see? The lines on your palm, the arrangement of fingers, the pattern of knuckles. AI learns to recognize hands by finding these same patterns.',
      'Now look around the room. Pick three objects. What patterns make each one recognizable? A chair has legs, a seat, a back. A book has a rectangular shape, pages, a spine.',
      'Think about faces. What patterns help you recognize someone? The distance between eyes, the shape of the nose, the curve of the smile. AI uses these same patterns for facial recognition.',
      'Listen to the sounds around you. What patterns do you hear? The rhythm of traffic, the melody of birds, the pattern of footsteps. AI learns to recognize sounds by finding patterns in audio waves.',
      'Consider your baby\'s movements. Are there patterns? Times when they\'re more active, positions they prefer? You\'re doing pattern recognition right now!',
      'Reflect: How does knowing that AI is essentially a "pattern finder" change how you think about it? Does it seem more or less magical?'
    ],
    guidance: 'This exercise helps you experience pattern recognition firsthand. AI does this same process, but with millions of examples and mathematical precision. You do it with intuition and understanding.'
  },
  {
    type: 'thought-experiment',
    title: 'Training Your Own AI',
    description: 'Imagine you\'re training an AI to recognize something—experience the process of machine learning.',
    duration: 15,
    prompts: [
      'Choose something to "train" an imaginary AI to recognize—maybe your favorite fruit, a type of flower, or a family pet.',
      'What examples would you show it? Think of all the variations: different angles, lighting, sizes, colors. An apple can be red, green, or yellow; whole or sliced; on a tree or in a bowl.',
      'What would you label each example? "Apple" or "not apple"? How would you handle edge cases—like apple juice or an apple-shaped decoration?',
      'Now imagine your AI makes a mistake—it calls a tomato an apple. How would you correct it? What additional examples might help?',
      'Think about bias: if you only showed red apples, your AI might not recognize green ones. What does this teach us about the importance of diverse training data?',
      'Reflect: Training AI requires thinking carefully about what you want it to learn. How is this similar to teaching a child?'
    ],
    guidance: 'This thought experiment reveals the challenges of machine learning: the need for diverse examples, clear labels, and careful correction. It also shows why AI can have biases—it learns from the data it\'s given.'
  },

  // Learning vs Programming Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'Rules vs Learning: Two Ways to Teach',
    description: 'Explore the difference between programming with rules and teaching through examples.',
    duration: 12,
    prompts: [
      'Imagine trying to write rules for recognizing a cat. You might start: "Has four legs, has fur, has whiskers, has a tail." But what about a three-legged cat? A hairless cat? A cat with no tail?',
      'Now imagine showing someone a thousand pictures of cats instead. They\'d learn to recognize cats without needing explicit rules—they\'d just "know" a cat when they see one.',
      'This is the difference between traditional programming (explicit rules) and machine learning (learning from examples). Which approach works better for complex, fuzzy concepts?',
      'Think about how you learned to recognize faces. Did someone give you rules? Or did you learn from seeing thousands of faces throughout your life?',
      'Consider language: did you learn grammar rules first, or did you learn to speak by hearing examples and getting feedback?',
      'Reflect: What are some things that are easier to learn from examples than from rules? What might still need explicit rules?'
    ],
    guidance: 'This exercise illuminates why machine learning was such a breakthrough. Some things are too complex for rules but can be learned from examples—just like how humans naturally learn.'
  },
  {
    type: 'thought-experiment',
    title: 'The Impossible Rulebook',
    description: 'Appreciate why machine learning was necessary by trying to write rules for a complex task.',
    duration: 10,
    prompts: [
      'Try to write rules for recognizing the emotion in a face. Start with "happy": What makes a face look happy? Upturned mouth? Crinkled eyes? Raised cheeks?',
      'Now consider: What about a polite smile that doesn\'t reach the eyes? A laugh that looks like crying? A subtle smirk?',
      'Try writing rules for "beautiful music." What makes music beautiful? Certain chord progressions? Specific rhythms? How do you capture the feeling?',
      'Consider: How many rules would you need to describe every possible cat, every emotion, every beautiful song? The rulebook would be infinite!',
      'This is why AI needed to learn from examples instead of following rules. Some knowledge is too vast and nuanced to write down.',
      'Reflect: What does this tell us about the knowledge stored in your own brain—knowledge you can\'t easily put into words?'
    ],
    guidance: 'This exercise shows why traditional programming couldn\'t solve certain problems. The "impossible rulebook" demonstrates the power of learning from examples.'
  },

  // Reflection on AI in Future Life (Requirement 10.1)
  {
    type: 'reflection',
    title: 'AI in Your Baby\'s World',
    description: 'Reflect on how AI might shape your child\'s future and what values you want to instill.',
    duration: 15,
    prompts: [
      'When your baby is grown, AI will likely be even more present in daily life. What excites you about this future? What concerns you?',
      'Think about the AI you interact with today: voice assistants, recommendations, search engines. How do you want your child to relate to these tools?',
      'AI can be a powerful helper, but it can also be a distraction or a crutch. What boundaries or guidelines might you set for your child\'s AI use?',
      'Consider the skills that will matter in an AI-rich world: creativity, critical thinking, emotional intelligence, ethical reasoning. How might you nurture these in your child?',
      'AI learns from data, which can include human biases. How will you teach your child to think critically about AI\'s outputs and limitations?',
      'Write a short letter to your future child about AI—what you hope they\'ll understand, how you hope they\'ll use it, what you want them to remember about being human.'
    ],
    guidance: 'This reflection helps you think intentionally about raising a child in an AI-rich world. There are no right answers—just thoughtful consideration of values and hopes.'
  },
  {
    type: 'reflection',
    title: 'What Makes Us Human',
    description: 'Reflect on the uniquely human qualities that AI cannot replicate.',
    duration: 10,
    prompts: [
      'AI can recognize emotions in faces, but can it feel emotions? What\'s the difference between recognizing and feeling?',
      'AI can generate art and music, but does it experience the joy of creation? What does creativity mean without consciousness?',
      'Think about love—the love you feel for your baby. Could an AI ever truly love? What would be missing?',
      'Consider meaning and purpose. AI can process information, but can it find meaning in life? What gives your life meaning?',
      'Reflect on consciousness itself—the experience of being aware, of having an inner life. This remains one of the great mysteries that AI hasn\'t touched.',
      'Write down three things that make you irreplaceably human—qualities no AI could ever truly have.'
    ],
    guidance: 'This reflection celebrates human uniqueness in an age of AI. It\'s not about fearing AI, but appreciating what makes us special.'
  },

  // Visualization Exercise (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Journey Through a Neural Network',
    description: 'A guided visualization through the layers of an artificial neural network.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself shrinking down until you\'re small enough to enter a computer.',
      'You find yourself at the entrance to a neural network—a vast structure of glowing nodes connected by shimmering threads.',
      'You\'re standing at the input layer. Information flows in—imagine it as a stream of light representing an image of a flower.',
      'Watch as the light splits into thousands of tiny streams, each flowing to a different node. Each node examines a tiny piece of the image—a patch of color, an edge, a texture.',
      'Now follow the streams as they flow deeper into the network. The nodes in this layer combine information: "I see a curved edge AND a pink color—maybe a petal?"',
      'Deeper still, the patterns become more complex: "Multiple petals arranged in a circle, green stem below—this looks like a flower!"',
      'Finally, you reach the output layer. All the information has been refined and combined. A single node glows brightly: "Rose."',
      'Now imagine the network learning. A teacher says "Wrong—that\'s a peony, not a rose." Watch as the connections shimmer and adjust, some growing stronger, others weaker.',
      'Take a deep breath and slowly return to normal size, carrying with you an understanding of how AI learns to see.'
    ],
    guidance: 'This visualization makes the abstract concept of neural networks tangible. It helps you understand how AI processes information through layers of pattern recognition.'
  },
  {
    type: 'visualization',
    title: 'Your Baby\'s Learning Brain',
    description: 'Visualize the incredible learning happening in your baby\'s developing brain.',
    duration: 12,
    prompts: [
      'Close your eyes and place your hands on your belly. Take slow, deep breaths.',
      'Imagine you can see inside, to your baby\'s growing brain. It\'s a universe of neurons—86 billion of them, more than stars you can see in the night sky.',
      'Watch as new connections form. Every sound you make, every movement, every heartbeat creates new pathways in this neural universe.',
      'See how your voice creates patterns of activity—neurons lighting up in response to the rhythm and tone of your words.',
      'Imagine the connections strengthening with repetition. The more you talk, sing, and share, the stronger these pathways become.',
      'Now compare this to an AI neural network. Your baby\'s brain has more neurons, more connections, and something AI doesn\'t have—consciousness, feeling, the spark of life.',
      'Your baby is learning right now, in ways more profound than any AI. And you are their most important teacher.',
      'Open your eyes, knowing that every moment of connection is shaping your baby\'s incredible learning brain.'
    ],
    guidance: 'This visualization connects the AI story to your baby\'s development. It celebrates the wonder of biological learning while honoring the bond between parent and child.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'AI Ethics and Values',
    description: 'Questions to discuss with your partner, family, or friends about AI\'s role in society.',
    duration: 15,
    prompts: [
      'AI learns from human-created data, which can include biases. How should we address AI bias? Whose responsibility is it?',
      'Some worry AI will replace human jobs. Others say it will create new opportunities. What do you think? How should society prepare?',
      'AI can create art, write stories, and compose music. Is AI-generated art "real" art? Does it matter who or what creates something beautiful?',
      'Should there be limits on what AI can do? What tasks should remain exclusively human?',
      'How do we ensure AI benefits everyone, not just those who create or control it?',
      'What values do you hope will guide AI development in your child\'s lifetime?'
    ],
    guidance: 'These questions don\'t have easy answers—they\'re meant to spark thoughtful conversation about AI\'s role in our world and our responsibility to shape it wisely.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Letter to an AI',
    description: 'Write a letter to an AI, exploring what you\'d want it to understand about being human.',
    duration: 15,
    prompts: [
      'Imagine an AI that wants to understand humans better. What would you tell it about being human that it couldn\'t learn from data?',
      'Describe the feeling of love—not the definition, but the experience. How would you explain it to something that can\'t feel?',
      'Tell the AI about a meaningful moment in your life. What made it meaningful? Could data capture that meaning?',
      'Explain what it\'s like to anticipate your baby\'s arrival. The hope, the fear, the love, the wonder.',
      'What would you want AI to know about human values? About what matters most to us?',
      'End your letter with advice: How should AI serve humanity? What should it never try to replace?'
    ],
    guidance: 'This creative exercise helps articulate what makes human experience unique. It\'s also a meaningful reflection on your own humanity and values.'
  },
  {
    type: 'creative',
    title: 'The AI That Learned to Love',
    description: 'Write a short story about an AI trying to understand human emotions.',
    duration: 20,
    prompts: [
      'Create a character: an AI that has learned to recognize emotions in faces and voices, but wants to understand what emotions actually feel like.',
      'What does your AI observe about human love? The way parents look at children, the way partners hold hands, the way friends laugh together?',
      'How does your AI try to understand love? Does it analyze data? Ask questions? Try to simulate the experience?',
      'What does your AI discover about the limits of its understanding? What can\'t it grasp no matter how much data it processes?',
      'How does your story end? Does the AI find peace with its limitations? Does it gain new appreciation for humans?',
      'Consider reading this story to your baby someday as a way to discuss AI and human uniqueness.'
    ],
    guidance: 'This creative exercise explores the boundary between artificial and human intelligence through storytelling. It\'s a meaningful way to process complex ideas about consciousness and emotion.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Learning Breath',
    description: 'A breathing exercise that mirrors the learning process—taking in, processing, and growing.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine taking in new information, new experiences, like training data flowing into a network.',
      'Hold for 2 counts—imagine processing, finding patterns, making connections.',
      'Breathe out slowly for 6 counts—imagine integrating what you\'ve learned, growing, becoming wiser.',
      'Repeat this cycle: In (4)... Hold (2)... Out (6)...',
      'With each cycle, imagine your understanding deepening, your connections strengthening, your wisdom growing.',
      'Now think of your baby, learning with every breath, every heartbeat, every moment of connection with you.',
      'Continue for 5 more cycles, feeling the rhythm of learning—input, process, grow.',
      'End with three natural breaths, feeling grateful for the gift of learning—yours and your baby\'s.'
    ],
    guidance: 'This breathing exercise connects the abstract concept of machine learning to the physical experience of breathing and growing. It\'s calming while reinforcing the lesson.'
  }
];

/**
 * Get exercises by type
 */
export function getAIExercisesByType(type: Exercise['type']): Exercise[] {
  return aiExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getAITotalExerciseDuration(): number {
  return aiExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getAIRecommendedSequence(): Exercise[] {
  return [
    aiExercises.find(e => e.title === 'Learning Breath')!,
    aiExercises.find(e => e.title === 'The Pattern Detective')!,
    aiExercises.find(e => e.title === 'AI in Your Baby\'s World')!,
  ];
}

export default aiExercises;
