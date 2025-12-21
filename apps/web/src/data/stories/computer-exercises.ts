/**
 * Computer Story Exercises
 * 
 * Topic-specific exercises for "The Thinking Machine: How Computers Work"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const computerExercises: Exercise[] = [
  // Binary Counting Activity (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'Binary Counting on Your Fingers',
    description: 'Learn to count in binary using your fingers—the same way computers count!',
    duration: 10,
    prompts: [
      'Hold up one hand with all fingers down. This represents 0 in binary.',
      'Now raise just your thumb. This is 1. Your thumb represents the "ones place" in binary.',
      'Put your thumb down and raise your pointer finger. This is 2 (written as "10" in binary). Your pointer represents the "twos place."',
      'Raise both thumb AND pointer together. This is 3 (1+2, written as "11" in binary).',
      'Now try: middle finger alone = 4, middle + thumb = 5, middle + pointer = 6, all three = 7.',
      'Keep going! Ring finger = 8, pinky = 16. With all five fingers up, you can show 31 (1+2+4+8+16)!',
      'Practice counting from 0 to 10 using just your fingers in binary. Notice how the pattern works—each finger is worth double the previous one.'
    ],
    guidance: 'This activity shows how computers use simple on/off switches to represent any number. Each finger is like a transistor—either up (on/1) or down (off/0). With just 5 switches, you can count to 31!'
  },
  {
    type: 'creative',
    title: 'Binary Name Art',
    description: 'Write your baby\'s name in binary code and create art from the pattern.',
    duration: 15,
    prompts: [
      'Each letter has a binary code. A=01000001, B=01000010, C=01000011, and so on.',
      'Look up the binary code for each letter in your baby\'s name (or use a simple online converter).',
      'Write out the binary sequence for the name. For example, "JOY" might be: 01001010 01001111 01011001',
      'Now turn this into art! Draw a row of circles for each letter—fill in circles for 1s, leave empty for 0s.',
      'Or use colors: one color for 1, another for 0. Create a colorful pattern that secretly spells your baby\'s name!',
      'Frame your binary name art as a unique, meaningful decoration for the nursery.'
    ],
    guidance: 'This activity connects the abstract concept of binary to something personal and creative. Your baby\'s name, encoded in the language of computers, becomes a beautiful piece of art.'
  },

  // Digital vs Analog Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'Digital vs Analog: Two Ways of Seeing the World',
    description: 'Explore the difference between the smooth, continuous analog world and the stepped, precise digital world.',
    duration: 12,
    prompts: [
      'Look at an old-fashioned clock with hands that sweep smoothly around the face. This is analog—the hands can point to any position, smoothly flowing through infinite points.',
      'Now imagine a digital clock showing "3:42." It jumps from one number to the next—there\'s no in-between. This is digital—discrete steps, not smooth flow.',
      'Think about a dimmer switch for lights (analog—infinite brightness levels) versus an on/off switch (digital—only two states).',
      'Music on a vinyl record is analog—the grooves are smooth waves. Music on a computer is digital—millions of tiny number samples that approximate the wave.',
      'Your baby\'s heartbeat is analog—a smooth, continuous rhythm. A heart monitor displays it digitally—sampling many times per second to create a picture.',
      'Consider: What is lost when we convert analog to digital? What is gained? (Hint: digital is easier to copy perfectly, store, and transmit, but it\'s always an approximation of the smooth original.)',
      'Reflect: The natural world is analog, but computers are digital. How do computers bridge this gap to show us pictures, play us music, and connect us to the analog world?'
    ],
    guidance: 'Understanding digital vs analog helps explain why computers work the way they do. They must convert our smooth, continuous world into discrete steps—and do it so finely that we can\'t tell the difference.'
  },
  {
    type: 'thought-experiment',
    title: 'The Staircase and the Ramp',
    description: 'A simple analogy to understand digital versus analog.',
    duration: 8,
    prompts: [
      'Imagine walking up a smooth ramp. You can stop at any height—there are infinite possible positions. This is like analog.',
      'Now imagine walking up stairs. You can only stand on specific steps—there are limited, discrete positions. This is like digital.',
      'If the stairs are very small (like tiny steps), they start to feel almost like a ramp. This is what computers do—they use so many tiny digital steps that it seems smooth to us.',
      'A digital photo is made of tiny squares called pixels. If the pixels are small enough, the image looks smooth and continuous to our eyes.',
      'Digital music samples sound waves thousands of times per second. Our ears can\'t detect the tiny steps, so it sounds smooth.',
      'Reflect: How does knowing this change how you think about the photos on your phone or the music you stream?'
    ],
    guidance: 'This analogy helps visualize how digital approximates analog. The key insight is that with enough small steps, digital can represent analog so well that we can\'t perceive the difference.'
  },

  // Reflection on Computation in Daily Life (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Computers in Your Day',
    description: 'Reflect on how many computers touch your daily life.',
    duration: 10,
    prompts: [
      'Think about your morning routine. How many computers did you interact with? (Hint: phone alarm, coffee maker, microwave, car, traffic lights...)',
      'Consider the journey of a text message you send. It travels through your phone\'s processor, through cell towers with computers, through internet servers, to another phone. How many computers touched that simple "hello"?',
      'When you buy something with a card, computers verify your identity, check your balance, transfer money, update records, and send you a receipt—all in seconds.',
      'Medical equipment that monitors your baby uses computers to process signals and display information. How does knowing this make you feel about technology in healthcare?',
      'Reflect: Are there moments in your day that are completely free of computer involvement? How does this awareness change your perspective?',
      'Write about one way computers have made your pregnancy journey easier or more connected.'
    ],
    guidance: 'This reflection helps appreciate how deeply computers are woven into modern life. It\'s not about judging this as good or bad, but simply becoming aware of it.'
  },
  {
    type: 'reflection',
    title: 'The Invisible Helpers',
    description: 'Appreciate the computers working silently in the background of your life.',
    duration: 8,
    prompts: [
      'Your refrigerator might have a computer managing temperature. Your car has dozens of computers controlling everything from fuel injection to airbags.',
      'When you stream a video, computers compress it, send it across the world, decompress it, and display it—all so smoothly you don\'t notice.',
      'Think about a time when technology failed (internet outage, phone died, car wouldn\'t start). How did it feel? What did you realize you depended on?',
      'Consider the people who designed, built, and programmed all these invisible helpers. Thousands of human minds working together to make your life easier.',
      'Write a short "thank you note" to the invisible computers in your life. What would you say?'
    ],
    guidance: 'Gratitude for technology can coexist with healthy boundaries around its use. This exercise cultivates appreciation for the human ingenuity behind our digital helpers.'
  },

  // Visualization Exercise (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Journey Inside a Computer Chip',
    description: 'A guided visualization through the microscopic world inside a computer.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, imagine yourself shrinking smaller and smaller.',
      'You are now the size of a grain of sand, standing on the surface of a computer chip. The landscape around you looks like a vast city of geometric shapes.',
      'Look down at the "streets" below you—these are pathways where electricity flows, carrying information as pulses of energy.',
      'See the transistors—billions of tiny switches arranged in perfect patterns. Watch as they flicker on and off, faster than you can perceive, creating rivers of light.',
      'Follow a pulse of electricity as it travels through a logic gate. Watch it meet another pulse, and together they create a new signal—a decision has been made!',
      'Zoom out slightly and see the patterns forming—data flowing like streams, calculations rippling through the chip like waves.',
      'Now imagine a single thought: "I love you." Watch as it becomes electrical signals in a phone, travels through this chip city, and emerges as a message on a screen far away.',
      'Take a deep breath and slowly return to normal size, carrying with you the wonder of this microscopic world.',
      'Open your eyes, knowing that right now, billions of these tiny switches are working in devices all around you.'
    ],
    guidance: 'This visualization makes the abstract concept of computer processing tangible and wondrous. It helps develop appreciation for the incredible engineering inside everyday devices.'
  },
  {
    type: 'visualization',
    title: 'The Logic Gate Garden',
    description: 'Visualize logic gates as a magical garden where decisions bloom.',
    duration: 10,
    prompts: [
      'Imagine a garden where the flowers are logic gates. Each flower has two stems (inputs) and one bloom (output).',
      'See an AND flower: it only blooms when BOTH stems receive water (both inputs are 1). If only one stem is watered, the flower stays closed.',
      'See an OR flower: it blooms if EITHER stem receives water. One drop on either stem, and the flower opens.',
      'See a NOT flower: this quirky bloom does the opposite! Water it, and it closes. Stop watering, and it opens.',
      'Watch as a gardener (the programmer) arranges these flowers in patterns. Water flows through the garden, and different flowers bloom in sequence, creating a beautiful display.',
      'This display is a calculation! The pattern of blooming flowers represents the answer to a question.',
      'Imagine your baby someday learning to arrange these logic flowers, creating their own patterns, their own programs, their own digital gardens.'
    ],
    guidance: 'This whimsical visualization makes logic gates approachable and memorable. The garden metaphor connects abstract computing concepts to the natural world.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Technology and Humanity',
    description: 'Questions to discuss with your partner, family, or friends about computers and human life.',
    duration: 15,
    prompts: [
      'Computers can process information faster than humans, but they can\'t feel emotions. What does this tell us about what makes humans special?',
      'How do you want your child to relate to technology? What boundaries or values do you want to instill?',
      'The first computer filled a room; now we carry more power in our pockets. What might computers look like when your child is grown?',
      'Some people worry that AI and computers will replace human jobs and connections. Others see them as tools that free us for more meaningful work. What do you think?',
      'How can we teach children to use technology as a tool without becoming dependent on it?',
      'What aspects of human experience can never be replicated by computers? (Love, creativity, spirituality, humor...)'
    ],
    guidance: 'These questions don\'t have right answers—they\'re meant to spark thoughtful conversation about technology\'s role in human life and how to raise children in a digital world.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Design Your Dream Computer',
    description: 'Imagine and describe a computer that would help your family in a unique way.',
    duration: 15,
    prompts: [
      'If you could design a computer to help with any aspect of parenting, what would it do? Describe its features.',
      'Draw or sketch what this computer might look like. Would it be worn, carried, or placed in your home?',
      'What would you NOT want this computer to do? What boundaries would you set?',
      'Write a short story about a day in your life with this dream computer. How does it help without taking over?',
      'Now imagine your child, grown up, designing computers. What problems might they solve? What would you hope they create?'
    ],
    guidance: 'This creative exercise encourages thoughtful engagement with technology\'s possibilities and limitations. It\'s also a fun way to dream about the future.'
  },
  {
    type: 'creative',
    title: 'The Computer That Couldn\'t',
    description: 'Write a story about what computers cannot do.',
    duration: 12,
    prompts: [
      'Write a short children\'s story about a computer that tried to do something only humans can do—like feel love, appreciate beauty, or comfort a crying child.',
      'In your story, how does the computer realize its limitation? How does it feel about this? (Or can it feel at all?)',
      'End your story with a message about what makes humans special.',
      'Consider reading this story to your baby someday as a way to discuss technology and humanity.',
      'Illustrate one scene from your story if you enjoy drawing.'
    ],
    guidance: 'This creative exercise helps process the relationship between humans and machines. It\'s also a meaningful keepsake—a story you wrote for your child about what makes them irreplaceable.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Binary Breathing',
    description: 'A breathing exercise using the rhythm of binary—on and off, in and out.',
    duration: 5,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—this is "1," the switch is on, energy flowing in.',
      'Breathe out slowly for 4 counts—this is "0," the switch is off, releasing and relaxing.',
      'Now let\'s count in binary with our breath:',
      'Breathe in (1)... breathe out (0)... that\'s 2 in binary (10).',
      'Breathe in (1)... breathe out (1)... that\'s 3 in binary (11).',
      'Breathe in (1)... breathe out (0)... breathe in (0)... that\'s 4 in binary (100).',
      'Continue breathing, feeling how simple patterns—just in and out—can represent anything.',
      'End with three slow breaths, feeling connected to your baby and to the simple beauty of binary.'
    ],
    guidance: 'This breathing exercise connects the abstract concept of binary to the physical experience of breathing. It\'s calming while also reinforcing the lesson.'
  }
];

/**
 * Get exercises by type
 */
export function getComputerExercisesByType(type: Exercise['type']): Exercise[] {
  return computerExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getComputerTotalExerciseDuration(): number {
  return computerExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getComputerRecommendedSequence(): Exercise[] {
  return [
    computerExercises.find(e => e.title === 'Binary Breathing')!,
    computerExercises.find(e => e.title === 'Binary Counting on Your Fingers')!,
    computerExercises.find(e => e.title === 'Computers in Your Day')!,
  ];
}

export default computerExercises;
