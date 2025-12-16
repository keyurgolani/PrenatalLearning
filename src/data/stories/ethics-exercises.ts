/**
 * Ethics Story Exercises
 * 
 * Topic-specific exercises for "What is Right?: The Journey of Ethics"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const ethicsExercises: Exercise[] = [
  // Moral Dilemma Thought Experiment (Requirement 10.1, 10.2)
  {
    type: 'thought-experiment',
    title: 'Exploring Moral Dilemmas',
    description: 'Thought experiments to explore ethical reasoning and the complexity of moral choices.',
    duration: 15,
    prompts: [
      'Imagine you find a wallet on the street with a large amount of cash and an ID. No one is around. What would you do? Now imagine the owner is wealthy. Does that change anything? What if they were poor? What principles guide your thinking?',
      'A friend asks you to tell a small lie to help them avoid an embarrassing situation. The lie would hurt no one. Would you do it? What if the lie could prevent someone from being hurt? Where do you draw the line with honesty?',
      'You witness a stranger being treated unfairly, but speaking up might cause problems for you. What would you do? What factors would you consider? What does courage in ethics look like?',
      'Imagine you could help one person a lot or help ten people a little with the same effort. Which would you choose? What does this reveal about how you think about doing good?',
      'Think about a time when doing the right thing was difficult. What made it hard? What helped you make the right choice? What did you learn from that experience?'
    ],
    guidance: 'These dilemmas have no perfect answers—that is the point. They help us examine our values and reasoning. Approach them with curiosity, not anxiety about finding the "right" answer.'
  },
  {
    type: 'thought-experiment',
    title: 'The Golden Rule in Practice',
    description: 'Explore how the Golden Rule applies to everyday situations.',
    duration: 12,
    prompts: [
      'Think of a recent interaction where you were frustrated with someone. Now imagine yourself in their position—their circumstances, their pressures, their perspective. Does this change how you see the situation?',
      'Consider how you would want to be treated if you made a mistake at work or in a relationship. How does this inform how you should treat others when they make mistakes?',
      'Imagine you are elderly and need help with daily tasks. How would you want to be treated? What does this tell you about how we should treat older people in our society?',
      'Think about someone you disagree with strongly. Can you imagine their perspective? What might they be trying to protect or achieve? How would you want them to treat you despite your disagreement?',
      'Consider a time when someone treated you with unexpected kindness. How did it feel? How can you create that feeling for others?'
    ],
    guidance: 'The Golden Rule requires imagination—the ability to truly put ourselves in another\'s place. Practice this skill and watch how it transforms your relationships.'
  },

  // Reflection on Kindness (Requirement 10.1, 10.3)
  {
    type: 'reflection',
    title: 'The Power of Kindness',
    description: 'Reflect on kindness in your life and its ripple effects.',
    duration: 12,
    prompts: [
      'Think of the kindest person you know. What makes them kind? What specific actions or qualities stand out? How does being around them make you feel?',
      'Recall a time when someone showed you unexpected kindness. How did it affect you? Did it change how you treated others afterward?',
      'Think about a small act of kindness you performed recently. Can you imagine how it might have rippled outward—affecting the person you helped, and then others they encountered?',
      'Consider the relationship between kindness and strength. Some people think kindness is weakness. What do you think? Can you think of examples where kindness required courage?',
      'What barriers sometimes prevent you from being as kind as you would like to be? Busyness? Self-consciousness? Fear? How might you overcome these barriers?'
    ],
    guidance: 'Kindness is a skill that grows with practice. Reflecting on it helps us become more intentional about cultivating it in our lives.'
  },
  {
    type: 'reflection',
    title: 'Cultivating Compassion',
    description: 'Explore the nature of compassion and how to develop it.',
    duration: 12,
    prompts: [
      'What is the difference between empathy (feeling what others feel) and compassion (wanting to help)? Can you have one without the other? Which do you find easier?',
      'Think about someone who is suffering—perhaps someone you know, or someone you have heard about. What would genuine compassion look like in response to their situation?',
      'Consider the Buddhist teaching that all beings want to be happy and free from suffering. How does holding this truth in mind change how you see difficult people?',
      'Reflect on self-compassion. Are you as kind to yourself as you are to others? What would it look like to treat yourself with the same compassion you would offer a good friend?',
      'How do you want to model compassion for your baby? What do you hope they will learn about caring for others from watching you?'
    ],
    guidance: 'Compassion is the heart of ethics. It can be cultivated through practice, reflection, and intentional attention to the suffering and joy of others.'
  },

  // Discussion about Values (Requirement 10.3, 10.4)
  {
    type: 'discussion',
    title: 'Conversations About Values',
    description: 'Questions to discuss with your partner, family, or friends about ethics and values.',
    duration: 15,
    prompts: [
      'What values are most important to you? Honesty? Kindness? Fairness? Courage? Loyalty? How did you come to hold these values? How do they guide your daily choices?',
      'What ethical lessons do you hope to teach your child? How will you teach them—through words, through example, through both?',
      'Discuss a moral issue where good people disagree. Can you understand both sides? What does this teach us about the complexity of ethics?',
      'Talk about moral courage—times when doing the right thing required bravery. What made it possible to act courageously? What can we learn from these examples?',
      'How do you handle situations where your values conflict with each other? For example, when honesty might hurt someone\'s feelings, or when loyalty to one person conflicts with fairness to another?'
    ],
    guidance: 'These conversations can deepen your relationships and clarify your values. Approach them with openness and genuine curiosity about others\' perspectives.'
  },
  {
    type: 'discussion',
    title: 'Ethics in Everyday Life',
    description: 'Discuss how ethical principles apply to daily decisions and relationships.',
    duration: 12,
    prompts: [
      'Think about the ethical dimensions of everyday choices: what you buy, how you treat service workers, how you speak about others when they are not present. How do small choices reflect our values?',
      'Discuss the ethics of honesty in relationships. When, if ever, is it okay to withhold the truth? How do we balance honesty with kindness?',
      'Talk about fairness in your family or community. What does fairness mean to you? How do you handle situations that seem unfair?',
      'Consider the ethics of how we use our time and attention. What do our choices about time say about our values? How do we balance self-care with care for others?',
      'Discuss how you want to handle moral disagreements with your child as they grow. How will you teach them to think for themselves while also passing on your values?'
    ],
    guidance: 'Ethics is not just about big dramatic choices—it is woven into the fabric of everyday life. These discussions help us become more intentional about living our values.'
  },

  // Visualization (Requirement 10.2, 10.3)
  {
    type: 'visualization',
    title: 'The Ripples of Your Actions',
    description: 'A guided visualization exploring how your actions affect others.',
    duration: 12,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine you are standing by a perfectly still pond on a peaceful morning. The water is like a mirror, reflecting the sky.',
      'Pick up a small stone. This stone represents an act of kindness you have done—perhaps a word of encouragement, a helping hand, a moment of patience. Drop the stone gently into the water.',
      'Watch the ripples spread outward in perfect circles, expanding further and further. Each ripple represents the effect of your kindness spreading to others.',
      'Now imagine you can see where those ripples go. The person you helped feels better. They are kinder to someone else. That person passes it on. The ripples keep spreading, touching lives you will never know about.',
      'Pick up another stone. This one represents an act of kindness you could do today—something small but meaningful. Drop it in and watch the ripples spread.',
      'Now imagine your baby, grown up, standing by this same pond. See them dropping their own stones of kindness, creating their own ripples. Feel the joy of knowing you helped shape a person who makes the world better.',
      'Take a deep breath and slowly return to the present, carrying the awareness that your actions matter more than you know.'
    ],
    guidance: 'This visualization helps you feel the real impact of ethical choices. Small acts of goodness create ripples that spread far beyond what we can see.'
  },
  {
    type: 'visualization',
    title: 'Meeting Your Wisest Self',
    description: 'A visualization to connect with your inner moral wisdom.',
    duration: 10,
    prompts: [
      'Close your eyes and breathe deeply. Imagine yourself walking along a peaceful path through a beautiful forest. The air is fresh, the light is golden, and you feel completely safe.',
      'Ahead, you see a clearing with a comfortable place to sit. As you approach, you notice someone waiting for you. This is your wisest self—the version of you who has all the wisdom, compassion, and clarity you aspire to.',
      'Sit down with your wisest self. Notice how they look at you with complete acceptance and love. They know all your struggles and still see your goodness.',
      'Ask your wisest self: "What do I need to know about living a good life?" Listen quietly for whatever answer comes.',
      'Ask: "How can I be more compassionate—to others and to myself?" Again, listen for the response.',
      'Ask: "What values should I pass on to my child?" Receive whatever wisdom is offered.',
      'Thank your wisest self. Know that this wisdom is always available to you—it lives within you. Take a deep breath and slowly return to the present.'
    ],
    guidance: 'We often have more moral wisdom than we realize. This visualization helps you access your own inner guidance about how to live well.'
  },

  // Creative Activity (Requirement 10.4)
  {
    type: 'creative',
    title: 'Writing Your Values',
    description: 'Creative activities to clarify and express your ethical values.',
    duration: 18,
    prompts: [
      'Write a letter to your baby about the values you hope to pass on to them. What do you want them to know about being a good person? What wisdom do you want to share?',
      'Create a "values inventory"—a list of the principles that matter most to you. For each value, write a sentence about why it matters and how you try to live it.',
      'Write about a moral hero in your life—someone whose character you admire. What specific qualities do they have? What have you learned from them?',
      'Compose a short "ethical creed"—a statement of the principles you try to live by. Keep it simple and personal. This could be something you share with your child someday.',
      'Write a reflection on a time you faced a difficult moral choice. What did you decide? What did you learn? What would you tell your child about navigating such situations?'
    ],
    guidance: 'Writing helps clarify our thinking. These activities help you articulate your values so you can live them more intentionally and share them with your child.'
  },
  {
    type: 'creative',
    title: 'Kindness in Action',
    description: 'Creative activities to practice and spread kindness.',
    duration: 15,
    prompts: [
      'Create a "kindness plan" for the coming week. Identify three specific acts of kindness you will do—one for a family member, one for a friend, and one for a stranger.',
      'Write a gratitude letter to someone who has shown you kindness or taught you about ethics. You can send it or keep it—the act of writing itself is valuable.',
      'Design a "kindness jar" for your family. Each day, write down one kind thing you did or witnessed and put it in the jar. Read them together at the end of each week.',
      'Create a list of "random acts of kindness" you could do. Keep it somewhere visible and try to do one each day.',
      'Write a short story or poem about kindness for your baby. It could be about an animal who learns to be kind, or a child who discovers the power of compassion.'
    ],
    guidance: 'Ethics is not just about thinking—it is about doing. These activities help translate values into action and create habits of kindness.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Loving-Kindness Breathing',
    description: 'A breathing exercise to cultivate compassion and goodwill.',
    duration: 10,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes and feel your baby\'s presence.',
      'Breathe in slowly, imagining you are breathing in peace and calm. Breathe out slowly, sending love to your baby.',
      'Now, as you breathe, silently repeat these phrases: "May I be happy. May I be healthy. May I be safe. May I live with ease."',
      'Think of someone you love. As you breathe, send them these wishes: "May you be happy. May you be healthy. May you be safe. May you live with ease."',
      'Think of someone neutral—perhaps someone you see regularly but don\'t know well. Send them the same wishes.',
      'Think of someone you find difficult. This is challenging, but try to send them the same wishes. Remember, they too want to be happy.',
      'Finally, extend these wishes to all beings everywhere: "May all beings be happy. May all beings be healthy. May all beings be safe. May all beings live with ease."',
      'Rest in this feeling of universal goodwill. This is the heart of ethics—wishing well for all.'
    ],
    guidance: 'This ancient practice, called loving-kindness or metta meditation, has been shown to increase compassion and wellbeing. Practice it regularly to cultivate a compassionate heart.'
  }
];

/**
 * Get Ethics exercises by type
 */
export function getEthicsExercisesByType(type: Exercise['type']): Exercise[] {
  return ethicsExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all Ethics exercises
 */
export function getEthicsTotalExerciseDuration(): number {
  return ethicsExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for an Ethics session
 */
export function getEthicsRecommendedSequence(): Exercise[] {
  return [
    ethicsExercises.find(e => e.title === 'Loving-Kindness Breathing')!,
    ethicsExercises.find(e => e.title === 'The Power of Kindness')!,
    ethicsExercises.find(e => e.title === 'Exploring Moral Dilemmas')!,
  ];
}

export default ethicsExercises;
