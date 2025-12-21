/**
 * Probability Story Exercises
 * 
 * Topic-specific exercises for "The Game of Chance: Probability in Life"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const probabilityExercises: Exercise[] = [
  // Coin Flip Thought Experiment (Requirement 10.1, 10.2)
  {
    type: 'thought-experiment',
    title: 'The Coin Flip Meditation',
    description: 'Explore the nature of randomness and possibility through the simple coin flip.',
    duration: 12,
    prompts: [
      'Imagine holding a coin in your hand. Feel its weight, its temperature, the ridges on its edge. This simple object is a gateway to understanding chance.',
      'Now imagine flipping the coin into the air. Watch it spin, catching the light. In this moment, before it lands, both outcomes exist as possibilities—heads and tails, equally likely, waiting to become real.',
      'The coin lands. One possibility becomes reality; the other fades away. But here\'s the profound part: the coin has no memory of this flip. The next flip is completely fresh, with the same 50-50 chance.',
      'Think about the gambler\'s fallacy—the mistaken belief that after several heads, tails is "due." Why do our brains want to believe this? What does it reveal about how we naturally think about patterns?',
      'Now imagine flipping the coin a thousand times. While each individual flip is unpredictable, the overall result will be very close to 500 heads. How does this Law of Large Numbers make you feel about the relationship between randomness and predictability?',
      'Write about a time when you fell for the gambler\'s fallacy—expecting something to happen because it "should" balance out. How might you think differently now?'
    ],
    guidance: 'This exercise uses the simple coin flip to explore deep concepts about randomness, independence, and the Law of Large Numbers. Take your time with each prompt.'
  },
  {
    type: 'thought-experiment',
    title: 'The Birthday Paradox Exploration',
    description: 'Discover why our intuition about probability is often wrong.',
    duration: 10,
    prompts: [
      'Before reading further, guess: How many people need to be in a room for there to be a 50% chance that two of them share a birthday? Write down your guess.',
      'The answer is just 23 people. Were you surprised? Most people guess much higher—around 180. Why do you think our intuition is so far off?',
      'The key insight is that we\'re not asking if someone shares YOUR birthday—we\'re asking if ANY two people share A birthday. With 23 people, there are 253 different pairs to check!',
      'Think about other situations where the number of possible combinations is much larger than we intuitively expect. How might this affect decisions in daily life?',
      'Write about a time when probability surprised you—when something you thought was unlikely turned out to be quite common, or vice versa.'
    ],
    guidance: 'The birthday paradox is a perfect example of how mathematical thinking can reveal truths that contradict our intuition. Let yourself be surprised!'
  },

  // Reflection on Chance in Life (Requirement 10.1, 10.3)
  {
    type: 'reflection',
    title: 'The Improbability of You',
    description: 'Reflect on the incredible chain of chance events that led to this moment.',
    duration: 15,
    prompts: [
      'Think about the chain of events that led to your existence. Your parents meeting, their parents meeting, and so on back through generations. Each meeting was improbable, yet here you are.',
      'Scientists estimate that the probability of you existing—with your exact genetic makeup—is about 1 in 10^2,685,000. That\'s a number so small it\'s essentially zero, yet here you are. How does this make you feel?',
      'Now think about your baby. Another incredibly improbable combination of genes, another unique person who has never existed before and will never exist again. Write about the wonder of this.',
      'Consider how chance encounters have shaped your life—meeting your partner, finding your career, the friends who became family. How does recognizing the role of chance change how you view your life story?',
      'Write a letter to your baby about the beautiful improbability of their existence and the wonderful uncertainties that await them.'
    ],
    guidance: 'This reflection helps you appreciate the profound role of chance in creating the miracle of life. Let yourself feel the wonder of improbability.'
  },
  {
    type: 'reflection',
    title: 'Decisions Under Uncertainty',
    description: 'Reflect on how you make decisions when outcomes are uncertain.',
    duration: 12,
    prompts: [
      'Think of a significant decision you made recently where the outcome was uncertain. How did you weigh the different possibilities? Did you think about probabilities explicitly?',
      'Consider the concept of expected value—the average outcome if you could repeat a decision many times. How might this way of thinking help you make better decisions?',
      'Reflect on a decision that turned out badly despite being a good decision at the time. How do you distinguish between a bad decision and a good decision with an unlucky outcome?',
      'Think about how you handle uncertainty emotionally. Do you find it stressful, exciting, or something else? How might understanding probability help you feel more at peace with uncertainty?',
      'Write about how you hope to teach your child to make good decisions under uncertainty. What wisdom would you share?'
    ],
    guidance: 'Good decision-making under uncertainty is a crucial life skill. This reflection helps you examine and improve your own approach.'
  },

  // Decision-Making Discussion (Requirement 10.2, 10.4)
  {
    type: 'discussion',
    title: 'Probability in Daily Life',
    description: 'Questions to explore with your partner, family, or friends about chance and decision-making.',
    duration: 15,
    prompts: [
      'When you hear a weather forecast says "70% chance of rain," what does that mean to you? How does it affect your decisions? Discuss how different people interpret probability statements.',
      'Think about insurance, investing, and other financial decisions that involve probability. How comfortable are you with thinking about expected values and risk? How might you improve?',
      'Discuss the gambler\'s fallacy and why it\'s so tempting to believe. Have you ever caught yourself thinking something was "due" to happen? How can we train ourselves to think more accurately?',
      'Talk about the difference between a good decision and a good outcome. Can a decision be right even if it turns out badly? How do you evaluate your past decisions?',
      'How might you help your child develop good probabilistic thinking as they grow? What games, activities, or conversations might help?'
    ],
    guidance: 'These questions invite deep conversation about how we think about chance and make decisions. There are no right answers—the goal is to explore ideas together.'
  },
  {
    type: 'discussion',
    title: 'Randomness and Fairness',
    description: 'Explore how randomness creates fairness and why we trust chance.',
    duration: 12,
    prompts: [
      'Why do we flip coins to make fair decisions? What makes randomness feel fair? Discuss situations where you\'ve used randomness to decide something.',
      'Think about lotteries, jury selection, and scientific experiments—all use randomness to ensure fairness. Why is randomness better than human judgment in these cases?',
      'Discuss the phrase "luck is what happens when preparation meets opportunity." How do probability and personal effort interact in creating success?',
      'Some people believe in luck as a force that can be good or bad. How does understanding probability change how you think about luck?',
      'Talk about how you might explain fairness and randomness to a child. What examples would you use?'
    ],
    guidance: 'This discussion explores the deep connection between randomness and fairness—a concept that underlies much of how society functions.'
  },

  // Visualization Exercise (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The Probability Garden',
    description: 'A guided visualization exploring the landscape of possible futures.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. With each exhale, let go of the need for certainty. Prepare to enter the probability garden.',
      'You\'re standing at the entrance to a beautiful garden. But this is no ordinary garden—it\'s a garden of possibilities, where you can see the likelihood of different futures.',
      'Before you are many paths, each leading to a different possibility. Some paths are wide and well-lit—these are the likely outcomes, the things that will probably happen. Others are narrow and dim—these are the unlikely but possible futures.',
      'Walk toward the widest, brightest path. This represents the most probable future—the one where things go as expected. Feel its solidity beneath your feet. This is where you\'ll probably end up.',
      'Now notice the smaller paths branching off. These are the surprises, the unexpected turns. Some lead to wonderful places you never imagined—chance encounters, lucky breaks, beautiful coincidences. Others lead to challenges that will make you stronger.',
      'You can\'t know which path you\'ll actually walk. But you can see that most paths lead somewhere good. The probability garden shows you that while uncertainty exists, hope is reasonable.',
      'Look down at your belly. Your baby will walk their own paths through their own probability garden. You can\'t choose their path, but you can help them learn to navigate uncertainty with wisdom and grace.',
      'Take a deep breath of possibility and slowly return to the present, carrying the peace of the probability garden with you.'
    ],
    guidance: 'This visualization helps you make peace with uncertainty by seeing it as a garden of possibilities rather than a source of anxiety. Read slowly, allowing time for images to form.'
  },

  // Breathing Exercise (Requirement 10.3)
  {
    type: 'breathing',
    title: 'Breathing with Uncertainty',
    description: 'A breathing exercise to help you find peace with not knowing.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. We\'re going to breathe with the rhythm of uncertainty and acceptance.',
      'Breathe in slowly, thinking: "I don\'t know exactly what will happen..."',
      'Breathe out slowly, thinking: "...and that\'s okay."',
      'Again: Breathe in... "I can\'t control everything..."',
      'Breathe out... "...but I can make good choices."',
      'Breathe in... "The future is uncertain..."',
      'Breathe out... "...and full of wonderful possibilities."',
      'Breathe in... "I trust in probability..."',
      'Breathe out... "...good things are likely."',
      'Continue breathing naturally, feeling the peace that comes from accepting uncertainty while trusting in likelihood.',
      'Place your hands on your belly and feel your baby—a beautiful certainty in an uncertain world. Some things we can count on.'
    ],
    guidance: 'This breathing exercise helps transform anxiety about uncertainty into peaceful acceptance. The rhythm of breath mirrors the rhythm of possibility and reality.'
  },

  // Creative Activity (Requirement 10.4)
  {
    type: 'creative',
    title: 'Probability Journal',
    description: 'Document and reflect on probability in your daily life.',
    duration: 20,
    prompts: [
      'For one day, notice every time you encounter probability—weather forecasts, traffic predictions, medical statistics, games of chance, decisions under uncertainty. Write down each instance.',
      'For each instance you noticed, write about how probability was being used. Was it explicit (like a percentage) or implicit (like "probably" or "likely")? How did it affect your thinking or decisions?',
      'Create a "probability poem" where each line describes something with a different likelihood, from nearly impossible to nearly certain. For example: "A meteor striking my house today... / Rain falling somewhere on Earth... / The sun rising tomorrow..."',
      'Write about a time when an unlikely event happened to you. How did it feel? How does understanding probability help explain that even unlikely events happen sometimes?',
      'Write a letter to your future child about the role of chance in your life—the lucky breaks, the chance encounters, the improbable events that shaped who you are.'
    ],
    guidance: 'Journaling about probability helps you notice how pervasive it is in daily life and develop more accurate intuitions about chance.'
  },
  {
    type: 'creative',
    title: 'Games of Chance',
    description: 'Explore probability through simple games and activities.',
    duration: 15,
    prompts: [
      'If you have a coin, flip it 20 times and record the results. Did you get exactly 10 heads? Probably not—but you likely got somewhere between 7 and 13. This is the Law of Large Numbers in action.',
      'If you have two dice, roll them 36 times and record the sums. Which sum appeared most often? (It should be 7, which has the highest probability.) How close were your results to the theoretical probabilities?',
      'Think of a simple game you could play with your child someday to teach them about probability. Describe the game and what it would teach.',
      'Create a "probability scale" for your life right now—list 5-10 events and estimate their probability, from very unlikely to very likely. How confident are you in your estimates?',
      'Design a simple experiment you could do to test a probability question. What would you test? How would you interpret the results?'
    ],
    guidance: 'Hands-on experience with games of chance builds intuition about probability. Don\'t worry about getting "right" results—the variation itself is the lesson!'
  },

  // Integration Exercise (Requirement 10.1, 10.4)
  {
    type: 'reflection',
    title: 'Embracing Uncertainty',
    description: 'Reflect on how understanding probability can bring peace and wisdom.',
    duration: 12,
    prompts: [
      'Think about an area of your life where uncertainty causes you stress. How might thinking about it in terms of probability—rather than certainty or complete unknowing—help you feel more at peace?',
      'Consider the phrase "hope for the best, prepare for the worst." How does probability thinking help you do both—maintaining hope while being realistic about risks?',
      'Reflect on the difference between things you can control and things you can only influence probabilistically. How does this distinction help you focus your energy wisely?',
      'Write about what it means to make peace with uncertainty. How can you embrace not knowing while still making good decisions and maintaining hope?',
      'As you prepare to welcome your baby into an uncertain world, what wisdom about probability and chance do you most want to share with them?'
    ],
    guidance: 'This final reflection helps integrate probability thinking into a philosophy of life—finding peace and wisdom in uncertainty.'
  }
];

/**
 * Get exercises by type
 */
export function getProbabilityExercisesByType(type: Exercise['type']): Exercise[] {
  return probabilityExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getProbabilityTotalExerciseDuration(): number {
  return probabilityExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getProbabilityRecommendedSequence(): Exercise[] {
  return [
    probabilityExercises.find(e => e.title === 'Breathing with Uncertainty')!,
    probabilityExercises.find(e => e.title === 'The Coin Flip Meditation')!,
    probabilityExercises.find(e => e.title === 'The Improbability of You')!,
  ];
}

export default probabilityExercises;
