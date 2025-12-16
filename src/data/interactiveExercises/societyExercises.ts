/**
 * Society Topic Interactive Exercises
 * 
 * Interactive exercises for society topics:
 * - Diversity (ID: 29): perspective scenarios
 * - Ethics (ID: 30): ethical reasoning scenarios
 * - Democracy (ID: 31): decision-making scenarios
 * - Art (ID: 32): creative reflection prompts
 * 
 * Requirements: 4.7
 */

import type {
  InteractiveExercise,
  ScenarioExercise,
  ReflectionExercise,
} from '../../types/exercises';

// ============================================
// Diversity Exercises (Topic ID: 29)
// ============================================

const diversityPerspectiveScenario1: ScenarioExercise = {
  id: 'diversity-perspective-1',
  type: 'scenario',
  title: 'Walking in Another\'s Shoes',
  description: 'Practice perspective-taking to understand different experiences.',
  duration: 5,
  topicId: 29,
  scenario: 'A new family moves into your neighborhood from a different country. Their children speak a different language at home, eat different foods, and celebrate different holidays. Some neighbors seem uncomfortable with the differences. How might you approach this situation?',
  choices: [
    {
      id: 'dps1-1',
      text: 'They should adapt to fit in with everyone else',
      feedback: 'While learning local customs is helpful, expecting people to abandon their culture erases valuable diversity. Communities are enriched when people share their unique backgrounds while also connecting across differences.',
      isOptimal: false,
    },
    {
      id: 'dps1-2',
      text: 'Reach out with curiosity and welcome—differences can enrich our community',
      feedback: 'Wonderful approach! Curiosity and welcome create connection. You might learn new recipes, hear fascinating stories, or gain perspectives you\'d never considered. Diversity, embraced with openness, strengthens communities.',
      isOptimal: true,
    },
    {
      id: 'dps1-3',
      text: 'Keep to yourself—it\'s not your business',
      feedback: 'While respecting privacy is good, isolation can make newcomers feel unwelcome. A simple friendly gesture can make a huge difference to someone in a new place. Community is built through connection.',
      isOptimal: false,
    },
  ],
};

const diversityPerspectiveScenario2: ScenarioExercise = {
  id: 'diversity-perspective-2',
  type: 'scenario',
  title: 'Teaching Children About Differences',
  description: 'Consider how to help children understand and appreciate diversity.',
  duration: 5,
  topicId: 29,
  scenario: 'Your child (imagine them at age 4) points at someone who looks different and asks loudly, "Why do they look like that?" The person can hear. How do you respond?',
  choices: [
    {
      id: 'dps2-1',
      text: 'Shush them and quickly walk away',
      feedback: 'While understandable, this teaches children that differences are shameful or shouldn\'t be discussed. Children are naturally curious—it\'s an opportunity to model respectful curiosity.',
      isOptimal: false,
    },
    {
      id: 'dps2-2',
      text: 'Calmly explain that people come in wonderful variety, and that\'s what makes the world interesting',
      feedback: 'Perfect! Treating the question as natural curiosity (which it is!) normalizes diversity. You might add, "Just like flowers come in different colors, people do too. Isn\'t that wonderful?" This builds appreciation for differences.',
      isOptimal: true,
    },
    {
      id: 'dps2-3',
      text: 'Tell them it\'s rude to notice differences',
      feedback: 'Noticing differences is natural and not inherently rude. What matters is how we respond to differences—with respect and curiosity rather than judgment. Teaching children to pretend they don\'t see differences isn\'t helpful.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Ethics Exercises (Topic ID: 30)
// ============================================

const ethicsReasoningScenario1: ScenarioExercise = {
  id: 'ethics-reasoning-1',
  type: 'scenario',
  title: 'The Trolley Problem',
  description: 'Explore a classic ethical dilemma.',
  duration: 5,
  topicId: 30,
  scenario: 'A runaway trolley is heading toward five people on the track. You can pull a lever to divert it to another track, but one person is on that track. Do nothing and five die; pull the lever and one dies. What do you do?',
  choices: [
    {
      id: 'ers1-1',
      text: 'Pull the lever—saving five lives is better than saving one',
      feedback: 'This is utilitarian reasoning: maximize good outcomes. Most people choose this. But consider: you\'re actively causing one death rather than passively allowing five. Does that distinction matter morally?',
      isOptimal: false,
    },
    {
      id: 'ers1-2',
      text: 'Don\'t pull—actively killing someone is different from letting people die',
      feedback: 'This reflects deontological ethics: some actions are wrong regardless of outcomes. There\'s a moral difference between doing and allowing. But is letting five die when you could save them truly innocent?',
      isOptimal: false,
    },
    {
      id: 'ers1-3',
      text: 'This dilemma shows that ethics is complex—both choices involve moral cost',
      feedback: 'Insightful! This famous dilemma has no "right" answer—it reveals tensions between different ethical frameworks. Utilitarians and deontologists disagree, and both have valid points. Ethics often involves tragic tradeoffs.',
      isOptimal: true,
    },
  ],
};

const ethicsReasoningScenario2: ScenarioExercise = {
  id: 'ethics-reasoning-2',
  type: 'scenario',
  title: 'Honesty and Kindness',
  description: 'Navigate when values seem to conflict.',
  duration: 5,
  topicId: 30,
  scenario: 'A friend shows you a creative project they\'ve worked hard on and asks what you think. You don\'t think it\'s very good. They seem excited and proud. What do you say?',
  choices: [
    {
      id: 'ers2-1',
      text: 'Be completely honest—they asked for your opinion',
      feedback: 'Honesty is important, but brutal honesty without kindness can damage relationships and discourage people. There\'s a difference between honesty and cruelty. How we deliver truth matters.',
      isOptimal: false,
    },
    {
      id: 'ers2-2',
      text: 'Find genuine positives to mention, then offer constructive suggestions if asked',
      feedback: 'This balances honesty and kindness! You can be truthful without being harsh. Acknowledging effort and finding real positives, while being gently honest if they want feedback, respects both values.',
      isOptimal: true,
    },
    {
      id: 'ers2-3',
      text: 'Lie and say it\'s great to protect their feelings',
      feedback: 'While kind in intention, dishonesty can backfire. If they share it widely and receive harsh feedback, they may feel betrayed that you didn\'t warn them. Kindness and honesty can coexist.',
      isOptimal: false,
    },
  ],
};


// ============================================
// Democracy Exercises (Topic ID: 31)
// ============================================

const democracyDecisionScenario1: ScenarioExercise = {
  id: 'democracy-decision-1',
  type: 'scenario',
  title: 'Majority vs. Minority Rights',
  description: 'Explore the tension between majority rule and protecting minorities.',
  duration: 5,
  topicId: 31,
  scenario: 'In a democracy, the majority rules. But what if 60% of people vote to take away rights from the other 40%? Is that democratic? How should democracies handle this tension?',
  choices: [
    {
      id: 'dds1-1',
      text: 'The majority should always win—that\'s what democracy means',
      feedback: 'Pure majority rule can become "tyranny of the majority." If 51% can oppress 49%, minorities have no protection. This is why most democracies have constitutions that protect fundamental rights from majority votes.',
      isOptimal: false,
    },
    {
      id: 'dds1-2',
      text: 'Democracies need both majority rule AND protected rights that can\'t be voted away',
      feedback: 'Exactly! Healthy democracies balance majority decision-making with constitutional protections for fundamental rights. Some things—like free speech, fair trials, equal treatment—shouldn\'t depend on winning a vote.',
      isOptimal: true,
    },
    {
      id: 'dds1-3',
      text: 'Minorities should just try to become the majority',
      feedback: 'This ignores that some minorities can never become majorities (ethnic groups, people with disabilities, etc.). Democracy must protect everyone, not just those who can win elections.',
      isOptimal: false,
    },
  ],
};

const democracyDecisionScenario2: ScenarioExercise = {
  id: 'democracy-decision-2',
  type: 'scenario',
  title: 'Informed Citizenship',
  description: 'Consider what makes democracy work well.',
  duration: 5,
  topicId: 31,
  scenario: 'Democracy depends on citizens making decisions. But many issues are complex—economics, science, foreign policy. How can ordinary people make good decisions about things experts spend lifetimes studying?',
  choices: [
    {
      id: 'dds2-1',
      text: 'Leave decisions to experts—regular people can\'t understand complex issues',
      feedback: 'This leads to technocracy, not democracy. Experts have knowledge but also biases and blind spots. Democratic input ensures decisions reflect people\'s values, not just technical optimization.',
      isOptimal: false,
    },
    {
      id: 'dds2-2',
      text: 'Citizens can learn enough to make value judgments, while experts provide information',
      feedback: 'Well said! Citizens don\'t need to be experts—they need to understand tradeoffs and express their values. Experts inform; citizens decide. This is why education and free press are vital to democracy.',
      isOptimal: true,
    },
    {
      id: 'dds2-3',
      text: 'Just vote based on gut feeling—that\'s what democracy is',
      feedback: 'While everyone\'s vote counts equally, informed votes lead to better outcomes. Democracy works best when citizens engage with issues, consider evidence, and think about consequences—not just react emotionally.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Art Exercises (Topic ID: 32)
// ============================================

const artCreativeReflection: ReflectionExercise = {
  id: 'art-creative-reflection',
  type: 'reflection',
  title: 'The Artist Within',
  description: 'Reflect on creativity and its role in your life.',
  duration: 10,
  topicId: 32,
  prompts: [
    'Think of a time when you created something—it could be a meal, a garden, a solution to a problem, or traditional art. What did the act of creating feel like? What made it meaningful?',
    'Children are naturally creative—they draw, build, imagine, and play without worrying about being "good." When did you stop thinking of yourself as creative? What would it mean to reclaim that identity?',
    'Your baby will be born with creative potential. How do you hope to nurture their creativity? What creative experiences do you want to share with them?',
  ],
};

const artPerspectiveScenario: ScenarioExercise = {
  id: 'art-perspective-scenario',
  type: 'scenario',
  title: 'What Is Art?',
  description: 'Explore the nature and purpose of art.',
  duration: 5,
  topicId: 32,
  scenario: 'Someone shows you a canvas that\'s entirely one shade of blue. They say it\'s art worth millions. Another person shows you a detailed, realistic painting of a landscape that took months to create. Which is "real" art?',
  choices: [
    {
      id: 'aps-1',
      text: 'Only the realistic painting—art requires skill and effort',
      feedback: 'Skill is one aspect of art, but not the only one. The blue canvas might evoke emotion, challenge assumptions, or express an idea. Art history is full of "simple" works that changed how we see the world.',
      isOptimal: false,
    },
    {
      id: 'aps-2',
      text: 'Both can be art—art is about expression, meaning, and the response it evokes',
      feedback: 'Thoughtful answer! Art can be technically skilled OR conceptually powerful OR emotionally moving—or all three. What makes something "art" is complex and personal. Both works might be meaningful in different ways.',
      isOptimal: true,
    },
    {
      id: 'aps-3',
      text: 'Neither—true art is only in museums',
      feedback: 'Art exists everywhere—in street murals, children\'s drawings, handmade crafts, and yes, museums. Limiting art to institutions misses the creative expression that surrounds us daily.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Export Society Exercises
// ============================================

export const societyExercises: Record<number, InteractiveExercise[]> = {
  // Diversity (Topic ID: 29)
  29: [diversityPerspectiveScenario1, diversityPerspectiveScenario2],
  // Ethics (Topic ID: 30)
  30: [ethicsReasoningScenario1, ethicsReasoningScenario2],
  // Democracy (Topic ID: 31)
  31: [democracyDecisionScenario1, democracyDecisionScenario2],
  // Art (Topic ID: 32)
  32: [artCreativeReflection, artPerspectiveScenario],
};
