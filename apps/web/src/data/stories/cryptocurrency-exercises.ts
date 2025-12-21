/**
 * Cryptocurrency Story Exercises
 * 
 * Topic-specific exercises for "Digital Gold: Cryptocurrency Explained"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const cryptocurrencyExercises: Exercise[] = [
  // Thought Experiment about Digital Ownership (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Digital Ownership Experiment',
    description: 'Explore what it means to truly own something in the digital world.',
    duration: 15,
    prompts: [
      'Think about something digital you "own"—maybe music, ebooks, or photos in the cloud. Do you truly own it? What happens if the company that provides it goes away?',
      'Now imagine owning a Bitcoin. No company can take it from you, freeze it, or deny you access. You hold the keys. How does this feel different from other digital ownership?',
      'Consider the responsibility: if you lose your private keys, no one can help you recover your Bitcoin. Is this freedom empowering or frightening? Perhaps both?',
      'Think about your baby\'s future: they\'ll grow up with digital possessions. What would you want them to understand about digital ownership and responsibility?',
      'Imagine a world where all your important documents—birth certificate, property deeds, diplomas—were on a blockchain you controlled. What would change?',
      'Reflect: What\'s the relationship between ownership and responsibility? Does true ownership require accepting full responsibility?'
    ],
    guidance: 'This exercise explores the revolutionary concept of self-sovereign digital ownership. Cryptocurrency gives individuals control, but also responsibility—a trade-off worth understanding deeply.'
  },
  {
    type: 'thought-experiment',
    title: 'The Scarcity Thought Experiment',
    description: 'Explore how scarcity creates value and what it means for something to be truly limited.',
    duration: 12,
    prompts: [
      'Think about something scarce that you value—perhaps a family heirloom, a rare book, or a limited edition item. What makes its scarcity meaningful to you?',
      'Now consider Bitcoin\'s scarcity: exactly 21 million will ever exist, guaranteed by mathematics. How is this different from the scarcity of gold or rare art?',
      'Governments can print more money whenever they choose. What are the advantages of this flexibility? What are the disadvantages?',
      'Imagine if your savings could never be diluted by inflation—if the money you saved today would have the same purchasing power in 50 years. How would this change your relationship with saving?',
      'Consider: Is scarcity always good? What about things we want to be abundant—like food, healthcare, or love?',
      'Reflect on your baby: their time with you is scarce and precious. How does knowing something is limited change how you value it?'
    ],
    guidance: 'This thought experiment helps you understand why scarcity matters in economics and how Bitcoin\'s programmed scarcity differs from natural scarcity.'
  },

  // Reflection on Future of Money (Requirement 10.1)
  {
    type: 'reflection',
    title: 'The Future of Money',
    description: 'Reflect on how money might evolve and what this means for your child\'s future.',
    duration: 15,
    prompts: [
      'Think about how money has changed in your lifetime. Did your parents use cash more than you do? Do you remember life before debit cards or mobile payments?',
      'Imagine your child at age 20. What forms of money might they use? Will they carry cash? Use cryptocurrency? Something we haven\'t invented yet?',
      'Consider the values you want to teach your child about money. How might cryptocurrency fit into—or challenge—these values?',
      'Reflect on trust: Traditional money requires trusting banks and governments. Cryptocurrency requires trusting code and mathematics. Which feels more natural to you? Why?',
      'Think about financial inclusion: billions of people lack access to banking. Cryptocurrency could give them access to financial services. How important is this possibility?',
      'Write a short reflection: What do you hope the financial world looks like when your child is an adult? What role might cryptocurrency play?'
    ],
    guidance: 'This reflection helps you think intentionally about the financial world your child will inherit and what values you want to instill about money and technology.'
  },
  {
    type: 'reflection',
    title: 'Trust in Institutions vs. Trust in Code',
    description: 'Explore the different kinds of trust that underpin traditional finance and cryptocurrency.',
    duration: 12,
    prompts: [
      'Think about the institutions you trust with your money—banks, governments, employers. What makes you trust them? Have they ever let you down?',
      'Now consider trusting computer code instead. The rules are transparent, unchangeable, and apply equally to everyone. What appeals to you about this? What concerns you?',
      'Reflect on a time when an institution protected you—maybe a bank reversed a fraudulent charge, or insurance covered an unexpected loss. Could code provide the same protection?',
      'Consider the opposite: a time when an institution failed you or others. Could a decentralized system have done better?',
      'Think about your baby: what kind of trust will they need to navigate the world? Trust in people? Trust in institutions? Trust in technology?',
      'Reflect: Is there a way to have the best of both worlds—the flexibility of human institutions and the reliability of code?'
    ],
    guidance: 'This reflection explores the fundamental question at the heart of cryptocurrency: what should we trust, and why? There\'s no single right answer.'
  },

  // Discussion about Trust and Technology (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Cryptocurrency and Society',
    description: 'Questions to discuss with your partner, family, or friends about cryptocurrency\'s impact on society.',
    duration: 15,
    prompts: [
      'Should cryptocurrency be regulated like traditional money? What rules would make sense? What rules would defeat its purpose?',
      'Cryptocurrency uses significant energy for mining. How should we balance technological innovation with environmental responsibility?',
      'Some people have made fortunes in cryptocurrency; others have lost everything. Should there be protections for investors? Or is "buyer beware" the right approach?',
      'Cryptocurrency can be used for both good (financial inclusion, protection from inflation) and ill (money laundering, ransomware). How do we encourage the good while limiting the bad?',
      'If cryptocurrency becomes widespread, what happens to traditional banks? To government control of money? Are these changes good or bad?',
      'What would you want your child to understand about cryptocurrency before they\'re old enough to invest in it?'
    ],
    guidance: 'These questions don\'t have easy answers—they\'re meant to spark thoughtful conversation about how cryptocurrency might reshape society and what values should guide its development.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Letter to Your Future Investor',
    description: 'Write a letter to your child about money, value, and making wise financial decisions.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear [baby\'s name], I\'m writing this before you were born, thinking about money and what I want you to understand..."',
      'Share a lesson you\'ve learned about money—maybe from a mistake, a success, or watching others.',
      'Explain what you think makes something truly valuable. Is it scarcity? Usefulness? Beauty? Meaning?',
      'Tell them about cryptocurrency and why people find it exciting or concerning. What questions should they ask before investing in anything?',
      'Share your hopes for their financial future. What does "financial success" mean to you? Is it wealth? Security? Freedom? Generosity?',
      'End with your deepest wish for them—something that money can\'t buy but that makes life truly rich.'
    ],
    guidance: 'This letter becomes a precious record of your thoughts about money and value. Someday, your child can read it and understand the wisdom you wanted to share.'
  },
  {
    type: 'creative',
    title: 'Mapping Your Financial Trust Network',
    description: 'Create a visual map of who and what you trust with your financial life.',
    duration: 15,
    prompts: [
      'Get a piece of paper and draw yourself in the center.',
      'Around you, draw the institutions you trust with money—banks, employers, government, insurance companies. How strong is each connection?',
      'Add the people you trust financially—family members, financial advisors, business partners. How do these relationships differ from institutional trust?',
      'Now add technology: payment apps, online banking, maybe cryptocurrency. Where does your trust in technology fit?',
      'Look at your map. Where is trust strongest? Where is it weakest? Where might cryptocurrency fit in or change things?',
      'Consider your baby: what financial trust network do you hope they\'ll have? What would you add or remove from your current map?'
    ],
    guidance: 'This creative exercise makes abstract trust relationships visible. It helps you see the web of financial trust that supports your life and consider how new technologies might change it.'
  },

  // Visualization Exercise (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The 21 Million Coins',
    description: 'Visualize Bitcoin\'s fixed supply and what digital scarcity means.',
    duration: 12,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself floating in space, surrounded by stars.',
      'Before you appears a vast treasure chest, glowing with golden light. Inside are exactly 21 million coins—every Bitcoin that will ever exist.',
      'Watch as coins slowly leave the chest, distributed to miners around the world. The chest grows lighter, but never empty—some coins always remain to be mined.',
      'See the halving happen: the flow of coins slows by half. Then half again. The remaining coins become more precious as they become harder to obtain.',
      'Zoom out and see millions of people around the world, each holding their portion of these 21 million coins. Some hold many; most hold fractions. But the total never changes.',
      'Now see traditional money being printed—endless streams of new bills flowing from government presses. Compare this to the fixed, finite treasure of Bitcoin.',
      'Take a deep breath and return, carrying with you an understanding of what it means for something to be truly, mathematically scarce.'
    ],
    guidance: 'This visualization makes Bitcoin\'s scarcity tangible. Understanding that there will only ever be 21 million helps explain why some see it as "digital gold."'
  },
  {
    type: 'visualization',
    title: 'The Decentralized Network',
    description: 'Visualize how cryptocurrency operates without any central authority.',
    duration: 10,
    prompts: [
      'Close your eyes and imagine a traditional bank—a grand building with vaults, guards, and a central computer keeping all the records.',
      'Now watch as the building dissolves. The records scatter into thousands of pieces, each piece flying to a different computer around the world.',
      'See these computers lighting up like stars—in homes, offices, data centers across every continent. Each one holds a complete copy of all the records.',
      'Watch a transaction happen: someone sends cryptocurrency. The message ripples out to all the computers simultaneously. They all verify it. They all record it.',
      'Try to imagine attacking this network. There\'s no central building to rob, no single computer to hack. You\'d have to compromise thousands of machines at once.',
      'Feel the resilience of this network—no single point of failure, no single authority, just thousands of equal participants all keeping each other honest.',
      'Take a deep breath and return, understanding how decentralization creates a new kind of trust.'
    ],
    guidance: 'This visualization helps you understand decentralization intuitively. The power of cryptocurrency comes from having no center—and therefore no single point of failure or control.'
  },

  // Breathing Exercise
  {
    type: 'breathing',
    title: 'Abundance and Scarcity Breath',
    description: 'A breathing exercise exploring the balance between scarcity and abundance.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine breathing in abundance, the infinite love surrounding your baby.',
      'Hold for 2 counts—feel the fullness, the completeness of this moment.',
      'Breathe out slowly for 6 counts—imagine releasing scarcity thinking, any fears of "not enough."',
      'Repeat this cycle: In (abundance)... Hold (fullness)... Out (release scarcity)...',
      'With each breath, remember: some things are scarce by design, like Bitcoin. But love, kindness, and connection are infinitely abundant.',
      'Think of your baby receiving this message: "There is always enough love. You are always enough."',
      'Continue for 5 more cycles, feeling the balance between valuing what\'s scarce and celebrating what\'s abundant.',
      'End with three natural breaths, knowing that true wealth is measured in love, not coins.'
    ],
    guidance: 'This breathing exercise connects cryptocurrency\'s theme of scarcity to the abundance of love. It reminds us that while some things are valuable because they\'re limited, the most important things are unlimited.'
  },

  // Additional thought experiment
  {
    type: 'thought-experiment',
    title: 'The Trustless Trust Experiment',
    description: 'Explore what it means to trust a system rather than a person or institution.',
    duration: 12,
    prompts: [
      'Think about a vending machine. You put in money, press a button, and get a snack. You don\'t need to trust the machine\'s intentions—you trust that the mechanism works.',
      'Cryptocurrency works similarly: you don\'t need to trust any person or company. You trust that the code works as designed. How does this feel different from trusting a bank?',
      'Consider: What happens when the code has a bug? When a smart contract does something unexpected? There\'s no customer service to call, no manager to complain to.',
      'Think about the trade-off: traditional systems have human judgment (which can be wise or corrupt). Code-based systems have rigid rules (which can be fair or inflexible).',
      'Imagine explaining "trustless trust" to your child. How would you help them understand when to trust systems and when to trust people?',
      'Reflect: In your own life, when do you prefer the reliability of systems? When do you prefer the flexibility of human judgment?'
    ],
    guidance: 'This thought experiment explores the philosophical heart of cryptocurrency: replacing trust in people with trust in systems. Both have strengths and weaknesses.'
  }
];

/**
 * Get exercises by type
 */
export function getCryptocurrencyExercisesByType(type: Exercise['type']): Exercise[] {
  return cryptocurrencyExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getCryptocurrencyTotalExerciseDuration(): number {
  return cryptocurrencyExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getCryptocurrencyRecommendedSequence(): Exercise[] {
  return [
    cryptocurrencyExercises.find(e => e.title === 'Abundance and Scarcity Breath')!,
    cryptocurrencyExercises.find(e => e.title === 'The Digital Ownership Experiment')!,
    cryptocurrencyExercises.find(e => e.title === 'The Future of Money')!,
  ];
}

export default cryptocurrencyExercises;
