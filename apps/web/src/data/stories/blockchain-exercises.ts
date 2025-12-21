/**
 * Blockchain Story Exercises
 * 
 * Topic-specific exercises for "The Great Chain of Trust: Blockchain Unveiled"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const blockchainExercises: Exercise[] = [
  // Trust and Verification Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Trust Spectrum',
    description: 'Explore different types of trust in your life and how verification plays a role.',
    duration: 12,
    prompts: [
      'Think about someone you trust completely—perhaps a family member or close friend. What makes you trust them? Is it their track record? Their character? Your shared history?',
      'Now think about a stranger you had to trust recently—maybe a doctor, a contractor, or an online seller. How did you decide to trust them? Did you look for reviews, credentials, or recommendations?',
      'Consider a time when trust was broken. How did it feel? What would have helped prevent that situation?',
      'Blockchain offers "trustless" trust—you don\'t need to trust any individual because the system itself is trustworthy. Can you think of situations where this would be valuable?',
      'Reflect: What\'s the difference between trusting a person and trusting a system? Which feels more comfortable to you?',
      'Think about your baby: they will trust you completely, without verification. How does this unconditional trust make you feel? What responsibility does it carry?'
    ],
    guidance: 'This exercise helps you understand the different kinds of trust in life. Blockchain addresses trust between strangers, but the deepest trust—like between parent and child—transcends any technology.'
  },
  {
    type: 'thought-experiment',
    title: 'The Unchangeable Record',
    description: 'Imagine a world where certain records could never be changed—exploring the implications of immutability.',
    duration: 15,
    prompts: [
      'Imagine your medical records were on a blockchain—permanent, secure, and always available. What benefits would this bring? What concerns might arise?',
      'Think about voting: if every vote were recorded on a blockchain, permanently and transparently. How might this change elections? What new challenges might emerge?',
      'Consider your own life: what moments or achievements would you want permanently recorded, unchangeable forever?',
      'Now consider the flip side: are there things you\'d want the ability to change or erase? How do we balance permanence with the right to be forgotten?',
      'Blockchain makes tampering visible, but it can\'t prevent lies from being recorded in the first place. How important is it that the original information is true?',
      'Reflect: In what areas of life is permanence valuable? In what areas is the ability to change and grow more important?'
    ],
    guidance: 'This thought experiment explores the double-edged nature of immutability. Permanent records can protect truth, but they also raise questions about privacy and the right to change.'
  },

  // Visualization of Chain of Blocks (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Building the Chain',
    description: 'A guided visualization of how blocks are created and linked in a blockchain.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself in a vast, peaceful digital space filled with soft, glowing light.',
      'Before you floats a single glowing cube—the first block. Inside it, you can see records glowing like fireflies: transactions, agreements, promises.',
      'Watch as the block seals itself. A unique pattern appears on its surface—its fingerprint, its hash. This pattern is unlike any other in the universe.',
      'Now a new block begins to form beside it. New records flow in, new promises, new truths. But before it can seal, it must connect to the first block.',
      'See a beam of light extend from the new block to the old one, carrying the first block\'s fingerprint. The new block now contains proof of its connection to the past.',
      'The second block seals, creating its own unique fingerprint—a fingerprint that includes the first block\'s fingerprint within it.',
      'Watch as more blocks form, each connecting to the last, each carrying the fingerprints of all that came before. The chain grows longer, stronger, more trustworthy.',
      'Now zoom out and see thousands of identical chains, spread across the world like a constellation. All the same. All watching each other. All preserving the same truth.',
      'Take a deep breath and slowly return, carrying with you an understanding of how blockchain builds trust through connection.'
    ],
    guidance: 'This visualization makes the abstract concept of blockchain tangible. The chain of blocks, each connected to the last, creates a structure where truth is preserved through connection.'
  },
  {
    type: 'visualization',
    title: 'The Glass Notebook',
    description: 'Visualize the blockchain as a magical glass notebook that everyone can see.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine holding a beautiful notebook made entirely of crystal-clear glass.',
      'As you watch, words begin to appear on the pages—not written by any hand, but emerging from within the glass itself. These are records, agreements, truths.',
      'Notice that the words glow softly, visible from any angle. Anyone looking at the notebook can see exactly what\'s written.',
      'Try to erase a word. Notice how the glass resists—the words have become part of the glass itself, permanent and unchangeable.',
      'Now imagine thousands of identical glass notebooks appearing around the world. Each one shows exactly the same words, updating in perfect synchrony.',
      'Watch as someone tries to change a word in one notebook. Immediately, all the other notebooks flash a warning—the change doesn\'t match! The tampering is caught.',
      'Feel the weight of the notebook in your hands. This is trust made visible—a record that everyone can see and no one can change.',
      'Gently set down the notebook and open your eyes, understanding how blockchain creates transparency and permanence.'
    ],
    guidance: 'The glass notebook analogy makes blockchain\'s key properties intuitive: transparency (everyone can see), immutability (nothing can be erased), and distribution (thousands of copies).'
  },

  // Reflection on Digital Trust (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Trust in Your Baby\'s Digital World',
    description: 'Reflect on how digital trust will shape your child\'s future.',
    duration: 15,
    prompts: [
      'Your baby will grow up in a world where much of life happens online. What concerns do you have about digital trust and safety?',
      'Think about the digital records that already exist about you—bank accounts, medical records, social media. How do you feel about who controls these records?',
      'Blockchain offers a way to control your own digital identity and records. How might this change your child\'s relationship with institutions and authorities?',
      'Consider the balance between transparency and privacy. Blockchain makes records visible and permanent—when is this good? When might it be problematic?',
      'What values do you want to teach your child about trust in the digital world? About verifying information? About protecting privacy?',
      'Write a short reflection: What kind of digital world do you hope your child will inherit? What role might blockchain play in creating that world?'
    ],
    guidance: 'This reflection helps you think intentionally about raising a child in an increasingly digital world. Blockchain is one tool for building trust online, but human wisdom must guide its use.'
  },
  {
    type: 'reflection',
    title: 'The Meaning of Trust',
    description: 'Explore what trust means to you and how it shapes your relationships.',
    duration: 12,
    prompts: [
      'What does trust mean to you? Is it about reliability? Honesty? Vulnerability? Something else?',
      'Think about how trust is built. What actions or qualities make someone trustworthy in your eyes?',
      'Consider how trust is broken. What betrayals are forgivable? What would be unforgivable?',
      'Blockchain creates "trustless" systems—trust through verification rather than faith. But can verification ever fully replace faith in relationships?',
      'Think about the trust you\'re building with your baby. They will trust you before they can verify anything. What does this pure, unconditional trust teach us?',
      'Reflect: How has your understanding of trust changed over your life? How might it continue to evolve?'
    ],
    guidance: 'This reflection explores trust as a fundamental human experience. While blockchain addresses practical trust between strangers, the deepest trust is built through love and relationship.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Blockchain and Society',
    description: 'Questions to discuss with your partner, family, or friends about blockchain\'s impact on society.',
    duration: 15,
    prompts: [
      'Blockchain could make voting more transparent and verifiable. Would you trust a blockchain-based voting system? What concerns would you have?',
      'Some say blockchain will reduce the power of banks, governments, and big corporations. Is this a good thing? What might be lost if these institutions lose influence?',
      'Blockchain records are permanent—they can\'t be erased. How does this interact with the "right to be forgotten"? Should people be able to erase their digital past?',
      'Cryptocurrency (like Bitcoin) uses blockchain but also uses a lot of energy. How should we balance technological innovation with environmental responsibility?',
      'Blockchain enables "smart contracts" that execute automatically. What happens when a smart contract produces an unfair result? Who is responsible?',
      'If blockchain becomes widespread, what new skills or knowledge will people need? How should education adapt?'
    ],
    guidance: 'These questions don\'t have easy answers—they\'re meant to spark thoughtful conversation about how blockchain might reshape society and what values should guide its development.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Your Personal Chain of Trust',
    description: 'Create a visual representation of the trust relationships in your life.',
    duration: 20,
    prompts: [
      'Get a piece of paper and draw yourself in the center. This is your first "block."',
      'Now draw the people you trust most closely around you, connected by lines. These are the next blocks in your chain—your inner circle of trust.',
      'Add another ring of people you trust but less intimately—friends, colleagues, extended family. Connect them to your inner circle.',
      'Add institutions you trust—maybe your bank, your doctor, your government. How do these connections feel different from personal trust?',
      'Now add your baby to the picture. Where do they fit? They trust you completely—draw that connection strong and bright.',
      'Look at your chain of trust. What patterns do you see? Where is trust strongest? Where might it need strengthening?',
      'Consider: How might blockchain fit into this picture? What connections might it strengthen or change?'
    ],
    guidance: 'This creative exercise makes abstract trust relationships visible. It helps you see the web of trust that supports your life and where your baby fits into that web.'
  },
  {
    type: 'creative',
    title: 'A Letter to the Future',
    description: 'Write a letter to your child about trust, to be read when they\'re older.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear [baby\'s name], I\'m writing this before you were born, thinking about trust..."',
      'Tell them about a time when someone\'s trust in you made a difference. How did it feel to be trusted?',
      'Share a lesson you\'ve learned about trust—maybe from a time it was broken, or a time it was beautifully kept.',
      'Explain what you hope they\'ll understand about trust in the digital world. What should they verify? What should they take on faith?',
      'Tell them about the trust you\'re building with them right now, even before they\'re born. Every moment of care is a block in your chain.',
      'End with your hopes for their future—a world where trust is easier to build and harder to break.'
    ],
    guidance: 'This letter becomes a precious record of your thoughts and hopes. Someday, your child can read it and understand the trust you were building before they were even born.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Chain of Trust Breath',
    description: 'A breathing exercise that builds trust breath by breath, like blocks in a chain.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine this breath as a new block, filled with love and trust.',
      'Hold for 2 counts—imagine the block sealing, becoming permanent.',
      'Breathe out slowly for 6 counts—imagine the block connecting to all the breaths before, forming a chain.',
      'Repeat this cycle: In (4)... Hold (2)... Out (6)...',
      'With each breath, your chain grows longer. Each breath is a promise of love, permanently recorded in your body and your baby\'s.',
      'Think of your baby feeling this rhythm—your heartbeat, your breath, building trust with every moment.',
      'Continue for 5 more cycles, feeling the chain of trust grow stronger.',
      'End with three natural breaths, knowing that the trust you\'re building is more permanent than any blockchain.'
    ],
    guidance: 'This breathing exercise connects the blockchain concept to the physical experience of building trust with your baby. Each breath is a block in the chain of your relationship.'
  },

  // Additional thought experiment
  {
    type: 'thought-experiment',
    title: 'The Consensus Game',
    description: 'Experience how consensus works by imagining group decision-making without a leader.',
    duration: 10,
    prompts: [
      'Imagine you\'re in a group of 100 people, and you need to agree on something—maybe what color to paint a room. There\'s no leader, no boss, no one in charge.',
      'How would you reach agreement? Would you vote? Would you discuss until everyone agrees? What if some people try to cheat or manipulate?',
      'Now imagine you can\'t even talk to everyone—you can only communicate with a few neighbors, who communicate with their neighbors, and so on.',
      'This is the challenge blockchain solves: getting thousands of computers to agree on truth without any central authority.',
      'Think about the rules that might help: majority wins, cheaters are punished, everyone can verify everyone else\'s claims.',
      'Reflect: What makes consensus possible? What values—honesty, transparency, accountability—are essential for groups to agree without leaders?'
    ],
    guidance: 'This thought experiment helps you understand consensus mechanisms intuitively. It\'s about how groups can find truth together, even without trusting any single member.'
  }
];

/**
 * Get exercises by type
 */
export function getBlockchainExercisesByType(type: Exercise['type']): Exercise[] {
  return blockchainExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getBlockchainTotalExerciseDuration(): number {
  return blockchainExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getBlockchainRecommendedSequence(): Exercise[] {
  return [
    blockchainExercises.find(e => e.title === 'Chain of Trust Breath')!,
    blockchainExercises.find(e => e.title === 'The Trust Spectrum')!,
    blockchainExercises.find(e => e.title === 'Trust in Your Baby\'s Digital World')!,
  ];
}

export default blockchainExercises;
