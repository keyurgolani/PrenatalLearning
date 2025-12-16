/**
 * Money Story Exercises
 * 
 * Topic-specific exercises for "The Story of Money: From Shells to Bitcoin"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const moneyExercises: Exercise[] = [
  // Barter Simulation Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Barter Challenge',
    description: 'Experience the difficulties of barter firsthand through an imaginative exercise.',
    duration: 15,
    prompts: [
      'Imagine you are a baker in ancient times. You have fresh bread but need a new cooking pot. The potter, however, wants fish, not bread. How would you solve this problem?',
      'Now imagine you need five different things: cloth, tools, medicine, firewood, and seeds. Each person who has these things wants something different. Map out the chain of trades you would need to make.',
      'Consider the time and effort involved in all these trades. How much of your day would be spent just trying to get what you need?',
      'Now imagine someone introduces a simple solution: small metal discs that everyone agrees to accept. How does this change everything?',
      'Reflect: What other problems might arise in a barter economy? Think about saving for the future, comparing values, or trading with strangers.',
      'Consider how money freed humans to specialize—to become expert bakers, potters, or doctors—instead of having to produce everything themselves.'
    ],
    guidance: 'This thought experiment helps you viscerally understand why money was such a revolutionary invention. The "double coincidence of wants" problem made barter incredibly inefficient.'
  },
  {
    type: 'thought-experiment',
    title: 'Inventing Money',
    description: 'Imagine you are tasked with creating a new form of money for your community.',
    duration: 12,
    prompts: [
      'If you had to invent money from scratch, what would you use? Think about what properties would make something good money.',
      'Your money needs to be durable—it shouldn\'t rot or break easily. What materials would work?',
      'It needs to be divisible—you should be able to make change. How would you handle this?',
      'It needs to be portable—easy to carry around. What size and weight would be practical?',
      'It needs to be recognizable—people should be able to tell real money from fake. How would you prevent counterfeiting?',
      'It needs to be scarce—if anyone could make unlimited amounts, it would become worthless. How would you control the supply?',
      'Now compare your invention to historical forms of money: shells, gold coins, paper bills, digital currency. What did each get right?'
    ],
    guidance: 'This exercise helps you understand the properties that make good money. Throughout history, humans have discovered these properties through trial and error.'
  },

  // Reflection on Value (Requirement 10.1)
  {
    type: 'reflection',
    title: 'What Is Value?',
    description: 'Explore the deep question of what makes things valuable.',
    duration: 15,
    prompts: [
      'Think of something you own that has great monetary value. Why is it worth so much? Is it the materials, the craftsmanship, the brand, or something else?',
      'Now think of something you own that has little monetary value but is precious to you. What makes it valuable in your eyes?',
      'Consider water and diamonds. Water is essential for life; diamonds are not. Yet diamonds cost far more. What does this tell us about value?',
      'Think about how the value of things changes. A winter coat is more valuable in December than in July. A rare baseball card is valuable to collectors but not to others. What determines these shifts?',
      'Reflect on your own labor. How do you decide what your time is worth? What factors influence how much you\'re paid for your work?',
      'Consider your baby: they will be priceless to you, yet they will also need money to live. How do you reconcile these two kinds of value?'
    ],
    guidance: 'Value is one of the deepest puzzles in economics and philosophy. This reflection helps you see that value is not fixed but created through human needs, desires, and agreements.'
  },
  {
    type: 'reflection',
    title: 'Your Money Story',
    description: 'Reflect on your personal relationship with money throughout your life.',
    duration: 12,
    prompts: [
      'What is your earliest memory involving money? Perhaps receiving an allowance, buying something special, or learning about saving?',
      'How did your family talk about money when you were growing up? Was it discussed openly or kept private? What attitudes did you absorb?',
      'Think about a time when having money (or not having it) significantly affected your life. What did you learn from that experience?',
      'What emotions do you associate with money? Security? Anxiety? Freedom? Stress? Where do these feelings come from?',
      'How has your relationship with money changed as you\'ve grown older? What wisdom have you gained?',
      'What do you want to teach your child about money? What values and habits do you hope to pass on?'
    ],
    guidance: 'Our relationship with money is deeply personal, shaped by family, culture, and experience. Understanding your own money story helps you consciously choose what to pass on to your child.'
  },

  // Discussion About Trust in Exchange (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Trust and Money',
    description: 'Questions to discuss with your partner, family, or friends about the role of trust in our monetary system.',
    duration: 15,
    prompts: [
      'Money only works because we trust it. What would happen if everyone suddenly lost faith in a currency? (This has happened in history—look up hyperinflation.)',
      'We trust banks to keep our money safe. But banks lend out most of what we deposit. Does this surprise you? How do you feel about it?',
      'Credit cards let us buy things with money we don\'t have yet, trusting that we\'ll pay later. What are the benefits and risks of this system?',
      'Cryptocurrency aims to create trust through technology rather than institutions. Do you find this more or less trustworthy than traditional money?',
      'Different cultures have different attitudes toward debt, saving, and spending. What cultural values shape your approach to money?',
      'If you could redesign the monetary system, what would you change? What would you keep the same?'
    ],
    guidance: 'These questions explore the invisible web of trust that makes our monetary system work. There are no right answers—the goal is thoughtful conversation about systems we often take for granted.'
  },
  {
    type: 'discussion',
    title: 'Money and Happiness',
    description: 'Explore the complex relationship between money and well-being.',
    duration: 12,
    prompts: [
      'Research suggests that money increases happiness up to a point, then the effect diminishes. Why might this be? What does money provide that makes us happier?',
      'Think about the happiest people you know. Are they the wealthiest? What seems to contribute most to their happiness?',
      'Consider the phrase "money can\'t buy happiness." Is this true? What can money buy that contributes to happiness? What can\'t it buy?',
      'How much money would be "enough" for you? What would you do differently if you had more? Less?',
      'Some people sacrifice health, relationships, or integrity to make more money. When does the pursuit of money become harmful?',
      'What do you want your child to understand about the relationship between money and a good life?'
    ],
    guidance: 'The relationship between money and happiness is nuanced. This discussion helps you think about what role you want money to play in your family\'s life.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Design Your Own Currency',
    description: 'Create a currency for your family, complete with values and designs.',
    duration: 20,
    prompts: [
      'Imagine creating a special currency just for your family. What would you call it? What values would it represent?',
      'Design the bills or coins. What images would you put on them? Perhaps family symbols, meaningful places, or inspiring figures?',
      'Decide what your currency can "buy" within the family. Maybe extra story time, choosing dinner, or a special outing?',
      'Think about how family members can "earn" this currency. Through chores? Acts of kindness? Learning new things?',
      'Consider the exchange rate: how much of your family currency equals real money, or is it completely separate?',
      'Sketch out your designs. Even simple drawings can capture the spirit of what you want your family currency to represent.',
      'Reflect: What does this exercise teach you about what your family values? How might you actually implement something like this?'
    ],
    guidance: 'This creative exercise makes abstract concepts concrete. Many families use systems like this to teach children about earning, saving, and spending in a safe, playful context.'
  },
  {
    type: 'creative',
    title: 'A Letter About Wealth',
    description: 'Write a letter to your child about what true wealth means to you.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear [baby\'s name], I want to tell you about wealth—not just money, but true richness in life..."',
      'Describe a time when you felt truly wealthy, even if you didn\'t have much money. What made you feel rich?',
      'Share your hopes for your child\'s financial future. What do you want them to have? What do you want them to understand?',
      'Write about the non-monetary wealth you\'re giving them: love, education, values, family, experiences.',
      'Offer advice about money that you wish someone had told you when you were young.',
      'End with your vision of a rich life—one that balances material needs with deeper sources of fulfillment.'
    ],
    guidance: 'This letter becomes a precious gift for your child. Someday they can read your thoughts about wealth and understand the values you wanted to share.'
  },

  // Visualization (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The River of Exchange',
    description: 'A guided visualization of the flow of value through human history.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself standing beside a great river that flows through time.',
      'Look upstream and see the earliest humans, sharing food around a fire. Watch as they begin to trade—a tool for a hide, berries for fish. This is the beginning of exchange.',
      'See the river widen as shells and beads begin to flow in the current. These are the first moneys, carrying trust from person to person.',
      'Watch as glittering coins appear—gold and silver from ancient kingdoms, stamped with the faces of kings and emperors.',
      'See paper notes flutter on the surface like leaves, promises written and passed from hand to hand across continents.',
      'Notice the river becoming electric, pulsing with digital signals. Numbers flow at the speed of light, connecting the whole world.',
      'Now see yourself in this river. Every purchase you make, every payment you receive, connects you to this ancient flow of human cooperation.',
      'Look downstream toward your baby\'s future. What new forms will the river take? What will remain the same?',
      'Take a deep breath and return, carrying with you a sense of connection to this vast human story.'
    ],
    guidance: 'This visualization helps you feel the continuity of human exchange across time. Money changes form, but the underlying reality—humans cooperating through trade—remains constant.'
  },
  {
    type: 'visualization',
    title: 'The Web of Trust',
    description: 'Visualize the invisible network of trust that makes money work.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine holding a simple dollar bill (or your local currency).',
      'Now see golden threads extending from the bill, connecting to everyone who accepts this currency. Millions of threads, spanning the globe.',
      'Follow one thread to a shopkeeper who will accept your bill for groceries. See another thread to your employer who pays you with these bills.',
      'Watch as the threads multiply, connecting every person who trusts this currency to every other person. A vast web of mutual trust.',
      'Notice how the web pulses with activity—every transaction strengthens the threads, every exchange reinforces the trust.',
      'Now imagine what would happen if the threads began to break—if people stopped trusting the currency. See the web unravel.',
      'Return to the strong, vibrant web. This is the invisible infrastructure of modern life, built entirely on shared belief.',
      'Open your eyes, understanding that every time you use money, you participate in this remarkable web of human trust.'
    ],
    guidance: 'This visualization makes visible the invisible trust that underlies all money. It\'s a powerful reminder that our economic system is fundamentally a social agreement.'
  },

  // Breathing Exercise
  {
    type: 'breathing',
    title: 'Abundance Breath',
    description: 'A breathing exercise focused on cultivating a sense of abundance and gratitude.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine breathing in abundance, all the gifts in your life.',
      'Hold for 2 counts—feel gratitude filling your heart.',
      'Breathe out slowly for 6 counts—release any feelings of scarcity or worry about "not enough."',
      'Repeat this cycle: In (abundance)... Hold (gratitude)... Out (release scarcity)...',
      'With each breath, remind yourself: you have enough. You are enough. There is enough.',
      'Think of your baby receiving this message through your calm, abundant breath.',
      'Continue for 5 more cycles, cultivating a deep sense of sufficiency.',
      'End with three natural breaths, carrying this feeling of abundance into your day.'
    ],
    guidance: 'Our relationship with money is often colored by fear of scarcity. This breathing exercise helps cultivate a healthier sense of abundance and sufficiency.'
  },

  // Additional thought experiment
  {
    type: 'thought-experiment',
    title: 'A World Without Money',
    description: 'Imagine how society would function without any form of money.',
    duration: 12,
    prompts: [
      'Imagine waking up tomorrow in a world where money no longer exists. How would you get food? Shelter? Healthcare?',
      'Think about your job. Without money, why would you do it? How would you be compensated for your work?',
      'Consider complex goods like smartphones or airplanes. How would these be produced without money to coordinate millions of workers and resources?',
      'Some communities have experimented with gift economies or time banks. How do these work? What are their limitations?',
      'Science fiction often imagines post-scarcity societies where money is unnecessary. What would need to change for this to be possible?',
      'Reflect: What does this thought experiment teach you about the role money plays in organizing human cooperation?'
    ],
    guidance: 'This thought experiment helps you appreciate how deeply money is woven into the fabric of modern society. It\'s not just about buying things—it\'s about coordinating human activity on a massive scale.'
  }
];

/**
 * Get exercises by type
 */
export function getMoneyExercisesByType(type: Exercise['type']): Exercise[] {
  return moneyExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getMoneyTotalExerciseDuration(): number {
  return moneyExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getMoneyRecommendedSequence(): Exercise[] {
  return [
    moneyExercises.find(e => e.title === 'Abundance Breath')!,
    moneyExercises.find(e => e.title === 'The Barter Challenge')!,
    moneyExercises.find(e => e.title === 'What Is Value?')!,
  ];
}

export default moneyExercises;
