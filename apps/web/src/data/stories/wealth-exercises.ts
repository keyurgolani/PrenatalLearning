/**
 * Wealth Story Exercises
 * 
 * Topic-specific exercises for "Building Your Future: Wealth and Wisdom"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const wealthExercises: Exercise[] = [
  // Compound Interest Visualization (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The Growing Tree of Wealth',
    description: 'A guided visualization of compound interest as a growing tree.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself in a peaceful garden.',
      'In your hands, you hold a tiny seed. This seed represents your first savings—small, but full of potential.',
      'Plant the seed in rich, dark soil. Feel the earth cool and alive beneath your fingers.',
      'Now watch as time begins to flow. Days pass like heartbeats. See tiny roots spreading beneath the surface—invisible growth, but essential.',
      'A green shoot emerges, reaching toward the sun. This is your savings beginning to show results.',
      'Watch years flow by like clouds. The shoot becomes a sapling. The sapling grows branches. Each branch represents your returns earning their own returns.',
      'See the tree mature—strong trunk, spreading canopy, deep roots. Birds nest in its branches. Fruit appears.',
      'Now notice something magical: seeds are falling from your tree, and new saplings are sprouting around it. Your wealth is creating more wealth.',
      'Step back and see the grove that has grown from your single seed. This is compound interest—patient growth creating abundance.',
      'Take a deep breath and return, carrying with you the patience and trust of the gardener.'
    ],
    guidance: 'This visualization makes the abstract concept of compound interest tangible and emotional. The tree metaphor helps you feel the power of patient, consistent growth.'
  },
  {
    type: 'visualization',
    title: 'The Snowball Rolling Downhill',
    description: 'Visualize the exponential growth of compound returns.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine yourself at the top of a gentle, snow-covered hill.',
      'In your hands is a small snowball—just a handful of snow packed together. This represents your initial savings.',
      'Gently release the snowball and watch it begin to roll down the hill.',
      'At first, it moves slowly, picking up just a little snow with each rotation. The growth seems small.',
      'But watch as it continues. Each rotation adds more snow, and now the ball is bigger, so each rotation picks up even more.',
      'The snowball grows faster and faster. What started as something you could hold in your hand is now the size of a basketball, then a beach ball.',
      'By the time it reaches the bottom of the hill, it\'s enormous—far larger than you could have made by hand.',
      'This is compound interest: small beginnings, patient rolling, exponential results.',
      'Now imagine many snowballs, started at different times. The ones started earlier are much larger. This is why starting early matters so much.',
      'Open your eyes, understanding that every day you save, your snowball grows.'
    ],
    guidance: 'The snowball metaphor perfectly captures how compound interest accelerates over time. Early contributions have the longest time to roll and grow.'
  },

  // Reflection on Goals and Patience (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Your Relationship with Patience',
    description: 'Explore your personal experience with delayed gratification and patience.',
    duration: 15,
    prompts: [
      'Think of a time when you waited for something and the waiting made it sweeter. What was it? How did the anticipation feel?',
      'Now think of a time when you couldn\'t wait and grabbed something immediately. How did that feel afterward? Any regrets?',
      'Consider your natural tendencies: Are you more of a "one marshmallow now" or "two marshmallows later" person? Has this changed over time?',
      'What helps you be patient? What strategies do you use when you want something but know waiting is wiser?',
      'Think about the biggest things you\'ve achieved in life. How much patience did they require? What kept you going during the waiting?',
      'How do you want to model patience for your child? What lessons about waiting and delayed gratification do you hope to teach?',
      'Reflect: Patience isn\'t just about money—it\'s about trusting the process of growth in all areas of life. Where else might more patience serve you?'
    ],
    guidance: 'Our relationship with patience shapes our financial lives profoundly. Understanding your patterns helps you work with your nature rather than against it.'
  },
  {
    type: 'reflection',
    title: 'Defining Your "Enough"',
    description: 'Reflect on what financial security and sufficiency mean to you personally.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine a life where money is no longer a worry. Not unlimited wealth, but genuine security. What does that feel like in your body?',
      'What would "enough" money allow you to do? Make a mental list of the freedoms it would provide.',
      'Now consider: what would "enough" NOT include? What luxuries or status symbols don\'t actually matter to you?',
      'Think about the wealthiest people you know personally. Are they the happiest? What does their example teach you?',
      'Consider this: studies show happiness increases with income up to a point, then levels off. What do you think that point might be for you?',
      'What non-financial forms of wealth do you already have in abundance? How might you cultivate more of these?',
      'Write or speak your personal definition of "enough." This clarity will guide your financial decisions.'
    ],
    guidance: 'Knowing your "enough" prevents the endless pursuit of more. It\'s the foundation of contentment and wise financial planning.'
  },

  // Discussion About Value and Priorities (Requirement 10.4)
  {
    type: 'discussion',
    title: 'Values and Money',
    description: 'Questions to discuss with your partner or family about aligning money with values.',
    duration: 15,
    prompts: [
      'What are your family\'s top three values? (Examples: security, adventure, education, generosity, freedom) How do your spending habits reflect—or contradict—these values?',
      'Think about your biggest purchases in the last year. Which ones still bring you joy? Which ones do you regret? What pattern do you notice?',
      'How do you and your partner differ in your approaches to money? How can these differences become strengths rather than conflicts?',
      'What money lessons did you learn from your parents—both explicitly taught and implicitly modeled? Which do you want to pass on? Which do you want to change?',
      'If you received an unexpected windfall of $10,000, what would you do with it? What does your answer reveal about your priorities?',
      'How do you want your child to think about money? What\'s the most important financial lesson you hope to teach them?',
      'Discuss: Is it possible to be both financially responsible AND generous? How do you balance saving for your future with giving to others?'
    ],
    guidance: 'Money conversations can be challenging but are essential for family alignment. These questions help surface values and create shared understanding.'
  },
  {
    type: 'discussion',
    title: 'The True Cost of Things',
    description: 'Explore the concept of opportunity cost and true value.',
    duration: 12,
    prompts: [
      'Think about a regular expense in your life—perhaps a subscription, a habit, or a convenience. Calculate what that money could become in 20 years if invested instead. Does this change how you feel about it?',
      'Consider the phrase "time is money." In what ways is this true? In what ways is it misleading?',
      'Discuss: When is it worth paying more for quality? When is the cheaper option actually wiser?',
      'Think about something you own that cost a lot but brings little joy. What would you do differently if you could go back?',
      'Consider something inexpensive that brings you great joy. What makes it so valuable despite its low cost?',
      'How do you decide what\'s worth spending money on? What questions do you ask yourself before a purchase?',
      'Discuss the difference between price and value. Can you think of examples where these are very different?'
    ],
    guidance: 'Understanding true cost—including opportunity cost—transforms how we think about spending. These discussions build financial wisdom.'
  },

  // Thought Experiments (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Compound Interest Challenge',
    description: 'Experience the power of compound growth through mental calculation.',
    duration: 15,
    prompts: [
      'Imagine you have $1,000 and it doubles every 7 years (roughly 10% annual return). How much would you have after 7 years? ($2,000)',
      'After 14 years? ($4,000) After 21 years? ($8,000) After 28 years? ($16,000) After 35 years? ($32,000)',
      'Now imagine you started with $10,000 instead. Run through the same doublings. After 35 years? ($320,000)',
      'Here\'s the key insight: the first doubling took you from $1,000 to $2,000—a gain of $1,000. The last doubling took you from $16,000 to $32,000—a gain of $16,000. Same percentage, vastly different amounts.',
      'Now consider: what if you added $100 every month to your growing investment? How would that change the final number?',
      'Think about your own timeline. How many "doubling periods" do you have until retirement? What could you start with?',
      'Reflect: Why do you think most people don\'t take advantage of compound interest? What barriers exist? How might you overcome them?'
    ],
    guidance: 'Running these numbers yourself makes compound interest real and personal. The math is simple but the implications are profound.'
  },
  {
    type: 'thought-experiment',
    title: 'The Millionaire Next Door',
    description: 'Explore the surprising habits of those who build lasting wealth.',
    duration: 12,
    prompts: [
      'Picture a millionaire in your mind. What do they look like? What do they drive? Where do they live? What do they wear?',
      'Now consider this research finding: most millionaires don\'t look like millionaires. They drive used cars, live in modest homes, and avoid flashy displays of wealth. Why might this be?',
      'Think about the difference between income and wealth. Someone earning $500,000 but spending $500,000 has no wealth. Someone earning $50,000 but saving $10,000 is building wealth. Which matters more for financial security?',
      'Consider "lifestyle inflation"—the tendency to spend more as you earn more. How might you protect yourself from this trap?',
      'Imagine two people: one earns twice as much as the other but saves nothing; the other earns half as much but saves 20%. Who will be wealthier in 30 years?',
      'Think about status symbols—expensive cars, designer clothes, big houses. What are people really buying? Is there another way to meet those needs?',
      'Reflect: What would it mean to "look poor but be rich" versus "look rich but be poor"? Which would you choose?'
    ],
    guidance: 'This thought experiment challenges common assumptions about wealth. True wealth is often invisible, built quietly through consistent habits.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Letter to Your Future Self',
    description: 'Write a letter about your financial hopes and commitments.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear Future Me, I\'m writing to you about our financial journey..."',
      'Describe your current financial situation honestly—not to judge, but to document where you\'re starting.',
      'Write about your hopes and dreams. What do you want your financial life to look like in 10 years? 20 years?',
      'Make specific commitments. What habits will you build? What will you start doing? Stop doing?',
      'Acknowledge the challenges you expect to face. What might tempt you off course? How will you stay committed?',
      'Write words of encouragement for the difficult times. What do you want to remember when patience is hard?',
      'End with a vision of the freedom and security you\'re building toward. Make it vivid and emotional.',
      'Seal this letter and set a reminder to read it in one year. Then write a new one.'
    ],
    guidance: 'Writing to your future self creates accountability and clarity. This letter becomes a touchstone for your financial journey.'
  },
  {
    type: 'creative',
    title: 'The Three Jars Plan',
    description: 'Design a practical system for managing money with intention.',
    duration: 12,
    prompts: [
      'Draw or imagine three jars labeled: SPEND, SAVE, SHARE.',
      'Decide on percentages: What portion of income goes to each jar? A common starting point is 70% spend, 20% save, 10% share. What feels right for you?',
      'For the SPEND jar: What categories does this cover? How will you track spending to stay within this amount?',
      'For the SAVE jar: What are you saving for? Short-term goals? Emergency fund? Long-term investments? How will you keep this money separate and growing?',
      'For the SHARE jar: Who or what will you support? Charity? Family? Community? How does giving align with your values?',
      'Think about how you\'ll implement this system practically. Separate accounts? Actual jars? Budgeting app?',
      'Consider how you\'ll teach this system to your child someday. What age-appropriate version might work for them?',
      'Commit to trying this system for one month. What adjustments might you need to make?'
    ],
    guidance: 'The three jars system is simple but powerful. It ensures intentionality in spending, saving, and sharing—the three essential uses of money.'
  },

  // Breathing Exercise
  {
    type: 'breathing',
    title: 'Abundance and Patience Breath',
    description: 'A breathing exercise connecting patience with abundance.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands resting on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine breathing in patience, the willingness to wait for good things.',
      'Hold for 4 counts—feel the patience settling into your body, calming any urgency or anxiety.',
      'Breathe out slowly for 6 counts—release any feelings of scarcity, of "not enough," of needing things now.',
      'Repeat this cycle: In (patience)... Hold (settling)... Out (releasing scarcity)...',
      'As you breathe, imagine your wealth growing slowly and steadily, like a tree adding rings year by year.',
      'With each breath, affirm: "I have enough. I am building more. Time is my ally."',
      'Think of your baby receiving this calm, patient energy. You are modeling trust in the process of growth.',
      'Continue for 5 more cycles, feeling more grounded and peaceful with each breath.',
      'End with three natural breaths, carrying this patience and abundance into your day.'
    ],
    guidance: 'Financial anxiety often manifests physically. This breathing exercise helps cultivate the calm, patient mindset that supports wise financial decisions.'
  },

  // Additional reflection
  {
    type: 'reflection',
    title: 'Your Wealth Beyond Money',
    description: 'Inventory all the forms of wealth in your life.',
    duration: 10,
    prompts: [
      'List five people who love you and whom you love. This is relationship wealth—priceless and irreplaceable.',
      'List five things your body can do that you\'re grateful for. This is health wealth—the foundation of all other wealth.',
      'List five skills or knowledge areas you possess. This is human capital—wealth that can never be taken from you.',
      'List five experiences that have shaped who you are. This is experiential wealth—the richness of a life fully lived.',
      'List five things you\'re looking forward to. This is hope wealth—the anticipation that makes life sweet.',
      'Now consider: if you lost all your money but kept everything on these lists, would you still be wealthy?',
      'Reflect: How might remembering these forms of wealth change your relationship with money?'
    ],
    guidance: 'This exercise provides perspective. Money is important, but it\'s just one form of wealth among many. Remembering this prevents money from becoming an unhealthy obsession.'
  }
];

/**
 * Get exercises by type
 */
export function getWealthExercisesByType(type: Exercise['type']): Exercise[] {
  return wealthExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getWealthTotalExerciseDuration(): number {
  return wealthExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getWealthRecommendedSequence(): Exercise[] {
  return [
    wealthExercises.find(e => e.title === 'Abundance and Patience Breath')!,
    wealthExercises.find(e => e.title === 'The Growing Tree of Wealth')!,
    wealthExercises.find(e => e.title === 'Defining Your "Enough"')!,
  ];
}

export default wealthExercises;
