/**
 * Markets Story Exercises
 * 
 * Topic-specific exercises for "The Great Exchange: How Markets Work"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const marketsExercises: Exercise[] = [
  // Simple Trading Thought Experiment (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Island Trading Game',
    description: 'Experience the emergence of markets through an imaginative trading scenario.',
    duration: 15,
    prompts: [
      'Imagine you\'re on an island with four other people. Each person has a different skill: one can fish, one can gather fruit, one can build shelters, one can make clothes, and you can make tools.',
      'On day one, everyone works alone. The fisher has lots of fish but no shelter. The builder has a great hut but is hungry. How comfortable is everyone?',
      'On day two, people start trading. The fisher trades fish for shelter-building help. The fruit gatherer trades fruit for clothes. What happens to everyone\'s quality of life?',
      'Now imagine someone suggests using shells as money. Instead of trading fish directly for shelter, you trade fish for shells, then shells for shelter. How does this change things?',
      'What if the fisher catches fewer fish one day? How do the shell-prices of fish change? How does this affect everyone else\'s decisions?',
      'Reflect: What did you learn about how markets emerge naturally when people have different skills and needs?'
    ],
    guidance: 'This thought experiment helps you understand how markets arise spontaneously from human diversity and how prices coordinate behavior without central planning.'
  },
  {
    type: 'thought-experiment',
    title: 'The Price Signal',
    description: 'Explore how prices communicate information across a market.',
    duration: 12,
    prompts: [
      'Imagine you\'re a farmer deciding what to plant next season. You could plant wheat, corn, or soybeans. How would you decide?',
      'You notice that wheat prices have been rising steadily. What is this price telling you? What might be causing it?',
      'If you plant more wheat because of high prices, and many other farmers do the same, what will happen to wheat prices next year?',
      'Now imagine you\'re a baker seeing wheat prices rise. What decisions might you make? Raise bread prices? Use less wheat? Find substitutes?',
      'Consider how this information traveled: no one sent you a message saying "plant more wheat" or "use less wheat." The price itself carried the message.',
      'Reflect: How is a price like a language that everyone in the market can understand?'
    ],
    guidance: 'This exercise illustrates how prices serve as signals that coordinate the decisions of millions of people without any central authority.'
  },

  // Reflection on Value and Scarcity (Requirement 10.1)
  {
    type: 'reflection',
    title: 'The Scarcity Reflection',
    description: 'Contemplate the role of scarcity in creating value.',
    duration: 15,
    prompts: [
      'Think about water and diamonds. Water is essential for life; we would die without it. Diamonds are pretty but not necessary. Yet diamonds cost far more than water. Why?',
      'Consider the air you\'re breathing right now. It\'s absolutely essential, yet it\'s free. What does this tell you about the relationship between necessity and price?',
      'Think about something that used to be expensive but is now cheap (like calculators or long-distance phone calls). What changed to make it less scarce?',
      'Now think about something that used to be cheap but is now expensive (like housing in popular cities or certain foods). What changed to make it more scarce?',
      'Consider your own time—perhaps the scarcest resource of all. How do you decide what your time is worth? What would you never trade your time for?',
      'Reflect: If scarcity creates value, what does this mean for things that are truly abundant, like love or kindness?'
    ],
    guidance: 'This reflection helps you understand the paradox of value—why essential things can be cheap and non-essential things expensive—and the central role of scarcity in economics.'
  },
  {
    type: 'reflection',
    title: 'Your Market Participation',
    description: 'Reflect on your daily participation in markets.',
    duration: 12,
    prompts: [
      'Think about everything you\'ve bought in the last week. How many different markets did you participate in? Food, transportation, entertainment, services?',
      'For each purchase, consider: who made or provided what you bought? Where did it come from? How many people were involved in getting it to you?',
      'Think about your work or the work of your household. What do you "sell" in the labor market? What skills, time, or effort do you exchange for income?',
      'Consider a purchase you made recently where you felt you got a good deal. Why did it feel like a good exchange? What made both you and the seller willing to trade?',
      'Think about a time when you decided NOT to buy something because the price was too high. What did that price signal to you? What did you do instead?',
      'Reflect: How would your daily life be different if there were no markets—if you had to produce everything yourself or rely only on gifts?'
    ],
    guidance: 'This reflection helps you see how deeply markets are woven into daily life and how they enable the complex coordination that makes modern life possible.'
  },

  // Discussion About Fair Exchange (Requirement 10.4)
  {
    type: 'discussion',
    title: 'What Makes Exchange Fair?',
    description: 'Questions to discuss with your partner, family, or friends about fairness in markets.',
    duration: 15,
    prompts: [
      'When is a trade "fair"? Is it fair if both people agree to it? What if one person has much more information than the other?',
      'Consider price gouging during emergencies—like selling water for $50 a bottle during a hurricane. Is this fair? Does it serve any useful purpose?',
      'Think about wages. What makes a wage "fair"? Should it be based on how hard the work is? How much skill it requires? How much value it creates?',
      'Consider the global market. Is it fair that workers in some countries earn much less than workers in others for similar work? What factors create these differences?',
      'Think about bargaining power. When one side of a trade has much more power than the other, can the exchange still be fair? What protections might be needed?',
      'Discuss: Are there some things that should never be bought or sold? What makes certain exchanges feel wrong even if both parties agree?'
    ],
    guidance: 'These questions explore the ethics of markets. There are no easy answers—the goal is thoughtful conversation about fairness, power, and the limits of exchange.'
  },
  {
    type: 'discussion',
    title: 'Markets and Society',
    description: 'Explore the broader role of markets in society.',
    duration: 12,
    prompts: [
      'Markets are good at producing things people want to buy. But what about things people need but can\'t afford? How should society handle this?',
      'Consider public goods like national defense, clean air, or basic research. Why can\'t markets provide these well? What alternatives exist?',
      'Think about externalities—costs that fall on people outside a transaction, like pollution. How can society address these market failures?',
      'Some argue markets should be limited to certain spheres of life. Should there be markets for organs? For votes? For citizenship? Where do you draw the line?',
      'Consider how markets have changed over time. What new markets have emerged in your lifetime? What old markets have disappeared?',
      'Discuss: What role do you want markets to play in your child\'s future? What should be left to markets, and what should be handled differently?'
    ],
    guidance: 'These questions explore the relationship between markets and other social institutions. Markets are powerful tools, but they work best within a framework of laws, norms, and values.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Design a Marketplace',
    description: 'Create an imaginary marketplace and explore how it would function.',
    duration: 20,
    prompts: [
      'Imagine you\'re designing a marketplace for your community. What would be sold there? Food? Crafts? Services? Ideas?',
      'Think about the physical layout. Where would different vendors be located? How would buyers find what they need?',
      'Consider the rules of your marketplace. Would there be quality standards? Price regulations? Hours of operation?',
      'Design a way to handle disputes. What if a buyer is unhappy with a purchase? What if a seller isn\'t paid?',
      'Think about how prices would be set. Would vendors set their own prices? Would there be bargaining? Auctions?',
      'Consider how your marketplace would handle scarcity. If a popular item runs out, what happens? How do you prevent hoarding?',
      'Sketch out your marketplace design. Even simple drawings can help you think through how it would work.',
      'Reflect: What did you learn about market design from this exercise? What trade-offs did you have to make?'
    ],
    guidance: 'This creative exercise helps you think about the institutions and rules that make markets work. Real markets don\'t just happen—they\'re designed, regulated, and maintained.'
  },
  {
    type: 'creative',
    title: 'A Letter About Exchange',
    description: 'Write a letter to your child about the value of fair exchange.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear [baby\'s name], I want to tell you about one of the most important skills in life: the art of fair exchange..."',
      'Share a story about a trade or exchange that taught you something important. What did you learn?',
      'Explain what makes an exchange "fair" in your view. What principles should guide how we trade with others?',
      'Write about the importance of keeping promises and honoring agreements. Why is trust essential for exchange?',
      'Share your hopes for how your child will participate in markets—as a buyer, a seller, a worker, a creator.',
      'End with advice about balancing market participation with other values—generosity, community, relationships that aren\'t based on exchange.'
    ],
    guidance: 'This letter becomes a gift for your child, sharing your wisdom about exchange, fairness, and the role of markets in a good life.'
  },

  // Visualization (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The Dance of Supply and Demand',
    description: 'A guided visualization of markets as a beautiful dance.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself in a great ballroom, watching a dance.',
      'See two dancers enter the floor. One is Supply, dressed in gold, moving gracefully when prices rise. The other is Demand, dressed in silver, leaping joyfully when prices fall.',
      'Watch as they dance toward each other. Supply reaches up toward high prices; Demand reaches down toward low prices. They spiral closer and closer.',
      'See them meet in the middle—the equilibrium point. For a moment, they dance in perfect harmony, neither pulling up nor down.',
      'Now watch as something changes. More buyers enter the ballroom, wanting to dance with Demand. See how this pulls the equilibrium upward, and Supply spins faster.',
      'Watch as more sellers arrive, joining Supply. See how this pushes the equilibrium downward, and Demand leaps higher.',
      'Zoom out and see thousands of these dances happening simultaneously—one for every product, every service, every market in the world.',
      'See how the dances are connected—a change in one affects the others, rippling across the ballroom like waves.',
      'Take a deep breath and return, carrying with you this image of markets as a beautiful, coordinated dance.'
    ],
    guidance: 'This visualization helps you see markets not as cold, mechanical systems but as dynamic, organic processes—a dance of human needs and human creativity.'
  },
  {
    type: 'visualization',
    title: 'The Web of Trade',
    description: 'Visualize the global connections created by markets.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine holding a simple object—perhaps a cup of coffee or a piece of fruit.',
      'Now see golden threads extending from this object, connecting to everyone who helped create it.',
      'Follow one thread to a farmer in a distant country, tending crops under a different sun. See their hands, their work, their life.',
      'Follow another thread to a factory worker, assembling or processing. See the machines, the rhythm of production.',
      'Follow threads to truck drivers, ship captains, warehouse workers, store clerks—all the people who moved this object to your hands.',
      'See the threads multiply, connecting each of these people to others—their suppliers, their customers, their families.',
      'Zoom out and see the entire world wrapped in these golden threads—a web of trade connecting billions of people.',
      'Feel your place in this web. You are both a receiver and a giver, connected to people you\'ll never meet.',
      'Take a deep breath and return, carrying with you a sense of gratitude for this vast network of cooperation.'
    ],
    guidance: 'This visualization helps you appreciate the invisible connections that markets create, linking your daily life to people around the world.'
  },

  // Breathing Exercise
  {
    type: 'breathing',
    title: 'The Exchange Breath',
    description: 'A breathing exercise focused on the rhythm of giving and receiving.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine receiving abundance, gifts flowing toward you.',
      'Hold for 2 counts—feel gratitude for what you\'ve received.',
      'Breathe out slowly for 6 counts—imagine giving generously, sharing what you have.',
      'Hold for 2 counts—feel the satisfaction of giving.',
      'Repeat this cycle: Receive... Gratitude... Give... Satisfaction...',
      'With each breath, feel the natural rhythm of exchange—the flow of giving and receiving that sustains all life.',
      'Think of your baby, receiving nourishment from you, giving you joy in return. This is the original exchange.',
      'Continue for 5 more cycles, feeling the balance of give and take.',
      'End with three natural breaths, carrying this sense of balanced exchange into your day.'
    ],
    guidance: 'This breathing exercise connects the abstract concept of market exchange to the physical reality of breathing—the most fundamental exchange of all.'
  },

  // Additional thought experiment
  {
    type: 'thought-experiment',
    title: 'The Auction Experiment',
    description: 'Experience price discovery through an imaginary auction.',
    duration: 12,
    prompts: [
      'Imagine you\'re at an auction for a beautiful painting. You love it and would pay up to $500 for it. The bidding starts at $100.',
      'Another bidder offers $150. Do you bid higher? How much? Why?',
      'The bidding continues: $200, $250, $300. At each step, you must decide: is it still worth it to you?',
      'At $450, only you and one other bidder remain. They bid $475. What do you do?',
      'Now imagine the same auction, but you\'re the seller. You paid $200 for the painting. What\'s the minimum you\'d accept?',
      'Consider: the final price depends on who\'s in the room, how much they want the painting, and how much they can pay. There\'s no "true" price—only the price that emerges from the auction.',
      'Reflect: What does this teach you about how markets discover prices? How is everyday shopping similar to and different from an auction?'
    ],
    guidance: 'This thought experiment illustrates price discovery—how markets figure out what things are worth through the interaction of buyers and sellers.'
  }
];

/**
 * Get exercises by type
 */
export function getMarketsExercisesByType(type: Exercise['type']): Exercise[] {
  return marketsExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getMarketsTotalExerciseDuration(): number {
  return marketsExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getMarketsRecommendedSequence(): Exercise[] {
  return [
    marketsExercises.find(e => e.title === 'The Exchange Breath')!,
    marketsExercises.find(e => e.title === 'The Island Trading Game')!,
    marketsExercises.find(e => e.title === 'The Scarcity Reflection')!,
  ];
}

export default marketsExercises;
