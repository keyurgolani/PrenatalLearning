/**
 * Memory Story Exercises
 * 
 * Topic-specific exercises for "The Library of Memory: How We Remember"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const memoryExercises: Exercise[] = [
  // Memory Visualization Exercise (Requirement 10.1, 10.3)
  {
    type: 'visualization',
    title: 'Walking Through Your Memory Library',
    description: 'A guided visualization to explore the library of your memories.',
    duration: 15,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes and take three deep breaths.',
      'Imagine yourself standing before a magnificent library—the library of your memory. See the grand entrance, the beautiful architecture.',
      'Push open the doors and step inside. Notice the endless shelves stretching in every direction, filled with books of every size and color. Each book is a memory.',
      'Walk to the section of childhood memories. Find a book that represents a happy moment from when you were young. Pick it up and open it. Let the memory come alive—the sights, sounds, feelings.',
      'Now walk to a different section—recent memories. Find the book that holds the moment you learned you were expecting your baby. Open it and relive that precious moment.',
      'Notice a special area being prepared—a nursery for new memories. This is where your baby\'s first memories are beginning to form. See the small, beautiful books starting to appear on these shelves.',
      'Place your hand on your belly and imagine adding a new book to your baby\'s collection: the memory of this moment, of your love, of your voice.',
      'Take a deep breath and slowly return from the library, carrying its wonder with you.'
    ],
    guidance: 'This visualization helps you experience memory as something tangible and precious. The library metaphor makes abstract concepts concrete and meaningful.'
  },

  // Reflection on Cherished Memories (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Treasures of Memory',
    description: 'Reflect on your most cherished memories and what makes them special.',
    duration: 12,
    prompts: [
      'Think of three memories that you treasure most. What makes these particular moments so precious to you? What emotions are attached to them?',
      'Notice how these memories feel different from ordinary recollections. They may be more vivid, more detailed, more emotionally charged. This is the amygdala at work, highlighting important experiences.',
      'Consider: what do you hope will become your baby\'s most treasured memories? What moments do you want to create that they will carry with them always?',
      'Write about a memory that shaped who you are today. How did this experience change you? How does remembering it still affect you?'
    ],
    guidance: 'Cherished memories reveal what matters most to us. Reflecting on them helps us understand ourselves and think about the memories we want to create for our children.'
  },

  // Journaling Prompt about Experiences (Requirement 10.1, 10.4)
  {
    type: 'reflection',
    title: 'Memory Journal: Capturing Moments',
    description: 'Journaling prompts to deepen your appreciation of memory and experience.',
    duration: 15,
    prompts: [
      'Describe a memory that comes back to you through a specific smell or sound. What is the trigger, and what memory does it unlock? How does it feel when this memory suddenly appears?',
      'Write about something you learned that you\'ll never forget—a skill, a lesson, a piece of wisdom. How did this knowledge become part of you?',
      'Reflect on a memory that has changed over time. Perhaps you remember an event differently now than you did years ago. What does this tell you about how memory works?',
      'Write a letter to your future child about a memory you want to share with them someday. What story from your life do you most want them to know?',
      'Consider the memories you\'re making right now, during pregnancy. What moments do you want to remember? How can you be more present to capture these precious times?'
    ],
    guidance: 'Journaling about memory helps you appreciate its role in your life and think intentionally about the memories you\'re creating during this special time.'
  },

  // Thought Experiment about Memory (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Nature of Remembering',
    description: 'Explore how memory shapes our understanding of ourselves and the world.',
    duration: 12,
    prompts: [
      'Imagine you woke up tomorrow with no memories of your past. You would know facts and skills, but have no personal history. How would this change who you are? What would be lost?',
      'Scientists have discovered that every time we recall a memory, we slightly change it. Our memories are not perfect recordings but reconstructions. How does this change how you think about your past?',
      'Consider two people who experienced the same event but remember it differently. Whose memory is "correct"? What does this tell us about the nature of memory and truth?',
      'Your baby will have no conscious memories of being in the womb, yet this time is shaping their brain and their earliest sense of safety and love. How can something be formative without being remembered?'
    ],
    guidance: 'These thought experiments reveal the complex nature of memory—how it shapes identity, how it can be imperfect, and how it connects to who we are.'
  },

  // Breathing Exercise for Memory (Requirement 10.3)
  {
    type: 'breathing',
    title: 'Breathing Through Memories',
    description: 'A breathing exercise that connects breath with memory and presence.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes and take three deep breaths.',
      'As you breathe in, think of a happy memory from your past. Let it fill you like the breath fills your lungs.',
      'As you breathe out, release the memory gently, knowing it remains safely stored in your library.',
      'Breathe in again, this time thinking of a moment of learning—a time when you discovered something new.',
      'Breathe out, appreciating how that knowledge has become part of you.',
      'Breathe in once more, thinking of this present moment—your baby, your love, this experience.',
      'Breathe out, knowing that this moment is becoming a memory, a treasure being stored.',
      'Continue breathing gently, aware that every breath is a moment, every moment a potential memory.',
      'Place your hands on your belly and imagine your baby breathing with you, forming their own first memories of rhythm and peace.'
    ],
    guidance: 'This exercise connects the physical act of breathing with the mental process of memory, helping you appreciate how present moments become lasting treasures.'
  },

  // Visualization of Memory Formation (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Watching a Memory Form',
    description: 'Visualize the process of memory formation in the brain.',
    duration: 12,
    prompts: [
      'Close your eyes and take a few deep breaths. Imagine you can see inside your brain.',
      'See the hippocampus—a small, seahorse-shaped structure deep in your brain. This is your master librarian, always at work.',
      'Now imagine an experience happening—perhaps hearing a beautiful piece of music. Watch as signals flow from your ears to your brain.',
      'See the hippocampus spring into action, creating connections between different brain areas—the sound of the music, the emotions it evokes, the context of where you are.',
      'Watch as these connections form a web, a network that represents this memory. The hippocampus is creating an index, a map to find this experience again.',
      'Now imagine yourself falling asleep. See the hippocampus replaying the day\'s experiences, strengthening important memories, filing them away for long-term storage.',
      'See the memory moving from the hippocampus to the neocortex, becoming a permanent part of your library.',
      'Open your eyes, knowing that this very visualization is now being encoded as a memory in your own brain.'
    ],
    guidance: 'This visualization makes the abstract process of memory formation tangible, helping you appreciate the remarkable work your brain does constantly.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Conversations About Memory',
    description: 'Questions to discuss with your partner, family, or friends about memory and remembering.',
    duration: 15,
    prompts: [
      'What is your earliest memory? How old were you? What do you think made this particular moment memorable?',
      'Do you and a family member remember a shared event differently? What might account for these differences?',
      'How do you think technology (photos, videos, social media) is changing how we remember? Is this good or bad?',
      'What memories do you most want to create with your child? What experiences do you hope they\'ll remember?',
      'If you could perfectly preserve one memory to revisit whenever you wanted, which would you choose and why?'
    ],
    guidance: 'Discussing memory with others reveals how personal and varied our experiences of remembering are. These conversations can deepen relationships and shared understanding.'
  },

  // Creative Activity (Requirement 10.4)
  {
    type: 'creative',
    title: 'Creating Memory Treasures',
    description: 'Creative activities to honor and preserve memories.',
    duration: 20,
    prompts: [
      'Create a "memory map" of your life—a visual representation of your most important memories. Draw or collage images that represent key moments, connecting them to show how they relate.',
      'Write a "memory letter" to your baby, describing the memories you\'re making during pregnancy. What do you want them to know about this time?',
      'Start a "memory jar" for your pregnancy—write brief notes about special moments and place them in a jar to read later.',
      'Create a playlist of songs that hold memories for you. For each song, write a brief note about the memory it evokes.',
      'Draw or paint what the "library of your memory" looks like to you. What sections does it have? What are the most prominent books?'
    ],
    guidance: 'Creative activities help us process and preserve memories in tangible ways. These projects can become treasures to share with your child someday.'
  },

  // Reflection on Sleep and Memory (Requirement 10.1)
  {
    type: 'reflection',
    title: 'The Gift of Sleep',
    description: 'Reflect on the connection between sleep and memory.',
    duration: 10,
    prompts: [
      'Think about a time when you learned something and then "slept on it." Did you find that you understood or remembered it better the next day? What might have been happening in your brain?',
      'Consider your sleep during pregnancy. Knowing that sleep helps consolidate memories, how might you prioritize rest for both yourself and your developing baby?',
      'Reflect on dreams. Have you ever dreamed about something you experienced during the day? Scientists believe this might be your brain processing and storing memories.',
      'Write about what you hope your baby dreams about in the womb. What peaceful memories might they be forming even now?'
    ],
    guidance: 'Understanding the connection between sleep and memory can help you appreciate the importance of rest, especially during pregnancy when your baby\'s brain is rapidly developing.'
  },

  // Thought Experiment on Emotion and Memory (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Emotional Highlighter',
    description: 'Explore how emotions shape what we remember.',
    duration: 10,
    prompts: [
      'Think of a highly emotional memory—either positive or negative. Notice how vivid and detailed it is compared to ordinary memories. Why do you think emotional experiences are remembered more strongly?',
      'Consider: if you could remove the emotional charge from a painful memory while keeping the facts, would you? What might be lost along with the pain?',
      'Knowing that positive emotions enhance memory, how might you create more joyful learning experiences for your child? How can you make important moments emotionally meaningful?',
      'Reflect on the emotions your baby might be experiencing in the womb. How might your emotional state be shaping their earliest memories and sense of the world?'
    ],
    guidance: 'Emotions are powerful memory enhancers. Understanding this connection helps us appreciate why certain memories stand out and how we can create meaningful experiences.'
  }
];

/**
 * Get exercises by type
 */
export function getMemoryExercisesByType(type: Exercise['type']): Exercise[] {
  return memoryExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getMemoryTotalExerciseDuration(): number {
  return memoryExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getMemoryRecommendedSequence(): Exercise[] {
  return [
    memoryExercises.find(e => e.title === 'Walking Through Your Memory Library')!,
    memoryExercises.find(e => e.title === 'Treasures of Memory')!,
    memoryExercises.find(e => e.title === 'Breathing Through Memories')!,
  ];
}

export default memoryExercises;
