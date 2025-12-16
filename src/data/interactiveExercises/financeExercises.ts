/**
 * Finance Topic Interactive Exercises
 * 
 * Interactive exercises for finance topics:
 * - Money (ID: 25): value scenario decisions
 * - Markets (ID: 26): cause-effect matching
 * - Cryptocurrency (ID: 27): concept quiz
 * - Wealth (ID: 28): resource allocation scenarios
 * 
 * Requirements: 4.6
 */

import type {
  InteractiveExercise,
  ScenarioExercise,
  MatchingExercise,
  QuizExercise,
} from '../../types/exercises';

// ============================================
// Money Exercises (Topic ID: 25)
// ============================================

const moneyValueScenario1: ScenarioExercise = {
  id: 'money-value-scenario-1',
  type: 'scenario',
  title: 'Understanding Value',
  description: 'Explore what gives money its value.',
  duration: 5,
  topicId: 25,
  scenario: 'A $100 bill is just paper and ink—it costs only a few cents to print. Yet people will work for hours to earn one. What gives this piece of paper its value?',
  choices: [
    {
      id: 'mvs1-1',
      text: 'The paper and ink it\'s made from',
      feedback: 'The physical materials are nearly worthless! A $100 bill and a $1 bill use the same paper and ink. The value comes from something else entirely.',
      isOptimal: false,
    },
    {
      id: 'mvs1-2',
      text: 'Collective agreement and trust that it can be exchanged for goods',
      feedback: 'Exactly! Money is valuable because we all agree it is. This shared belief, backed by government and institutions, allows money to function as a medium of exchange. It\'s a remarkable social technology!',
      isOptimal: true,
    },
    {
      id: 'mvs1-3',
      text: 'Gold stored in a vault somewhere',
      feedback: 'This used to be true! Until 1971, US dollars were backed by gold. Today, most currencies are "fiat money"—valuable because of trust and government backing, not physical gold.',
      isOptimal: false,
    },
  ],
};

const moneyValueScenario2: ScenarioExercise = {
  id: 'money-value-scenario-2',
  type: 'scenario',
  title: 'Teaching Kids About Money',
  description: 'Consider how to introduce money concepts to children.',
  duration: 5,
  topicId: 25,
  scenario: 'Your child (imagine them at age 5) asks for a toy at the store. You want to use this as a teaching moment about money. What approach best introduces healthy money concepts?',
  choices: [
    {
      id: 'mvs2-1',
      text: '"We can\'t afford it" (even if you can)',
      feedback: 'This common response can create anxiety about money. Children may worry about family finances or feel deprived. It also misses a chance to teach about choices and priorities.',
      isOptimal: false,
    },
    {
      id: 'mvs2-2',
      text: '"That\'s not in our plan for today. Let\'s talk about saving for things we want."',
      feedback: 'Great approach! This teaches that spending involves choices and planning, not just having or not having money. It opens a conversation about saving, priorities, and delayed gratification.',
      isOptimal: true,
    },
    {
      id: 'mvs2-3',
      text: 'Buy it to avoid the conversation',
      feedback: 'While easier in the moment, this misses a valuable teaching opportunity. Children benefit from learning that we make choices about spending, and that wanting something doesn\'t mean getting it immediately.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Markets Exercises (Topic ID: 26)
// ============================================

const marketsCauseEffectMatching: MatchingExercise = {
  id: 'markets-cause-effect',
  type: 'matching',
  title: 'Market Cause and Effect',
  description: 'Match economic causes with their typical effects.',
  duration: 5,
  topicId: 26,
  instructions: 'Connect each economic event with its typical result.',
  pairs: [
    { id: 'mce-1', left: 'High demand, low supply', right: 'Prices increase' },
    { id: 'mce-2', left: 'Low demand, high supply', right: 'Prices decrease' },
    { id: 'mce-3', left: 'Central bank prints more money', right: 'Inflation may increase' },
    { id: 'mce-4', left: 'Interest rates rise', right: 'Borrowing becomes more expensive' },
    { id: 'mce-5', left: 'Consumer confidence increases', right: 'Spending and economic growth rise' },
  ],
};

const marketsScenario: ScenarioExercise = {
  id: 'markets-scenario',
  type: 'scenario',
  title: 'The Invisible Hand',
  description: 'Understand how markets coordinate millions of decisions.',
  duration: 5,
  topicId: 26,
  scenario: 'Every day, millions of people in a city need food, but no single person plans what to grow, ship, or sell. Yet grocery stores are stocked, restaurants have ingredients, and people eat. How does this coordination happen without a central planner?',
  choices: [
    {
      id: 'ms-1',
      text: 'Government agencies plan everything behind the scenes',
      feedback: 'In market economies, most food distribution happens without government planning. While regulations exist, the day-to-day coordination emerges from millions of individual decisions guided by prices.',
      isOptimal: false,
    },
    {
      id: 'ms-2',
      text: 'Prices act as signals, coordinating supply and demand automatically',
      feedback: 'Exactly! This is Adam Smith\'s "invisible hand." When demand rises, prices rise, signaling producers to make more. When supply exceeds demand, prices fall. No central planner needed—prices coordinate everything!',
      isOptimal: true,
    },
    {
      id: 'ms-3',
      text: 'It\'s just luck that it works out',
      feedback: 'It might seem like magic, but there\'s a system at work! Prices carry information about scarcity and desire, guiding millions of decisions toward coordination. It\'s one of humanity\'s most remarkable achievements.',
      isOptimal: false,
    },
  ],
};


// ============================================
// Cryptocurrency Exercises (Topic ID: 27)
// ============================================

const cryptoConceptQuiz: QuizExercise = {
  id: 'crypto-concept-quiz',
  type: 'quiz',
  title: 'Cryptocurrency Basics',
  description: 'Test your understanding of cryptocurrency concepts.',
  duration: 5,
  topicId: 27,
  questions: [
    {
      id: 'ccq-1',
      question: 'What is a blockchain?',
      options: [
        'A type of computer virus',
        'A chain of linked records that is very hard to change',
        'A physical chain used in banking',
        'A social media platform',
      ],
      correctIndex: 1,
      explanation: 'A blockchain is a chain of linked data blocks. Each block contains records and a reference to the previous block, making it extremely difficult to alter past records without detection.',
    },
    {
      id: 'ccq-2',
      question: 'Why is Bitcoin called "decentralized"?',
      options: [
        'It\'s stored in one central location',
        'No single authority controls it—it\'s maintained by a network',
        'It can only be used in certain countries',
        'It\'s managed by a single company',
      ],
      correctIndex: 1,
      explanation: 'Bitcoin is decentralized because no single bank, government, or company controls it. Instead, thousands of computers worldwide maintain the network together.',
    },
    {
      id: 'ccq-3',
      question: 'What problem does cryptocurrency aim to solve?',
      options: [
        'Making the internet faster',
        'Enabling trust and transactions without middlemen',
        'Replacing all physical money immediately',
        'Making computers more powerful',
      ],
      correctIndex: 1,
      explanation: 'Cryptocurrency enables people to transfer value directly to each other without needing banks or other intermediaries to verify the transaction. It creates trust through technology.',
    },
  ],
};

const cryptoScenario: ScenarioExercise = {
  id: 'crypto-scenario',
  type: 'scenario',
  title: 'Digital Trust',
  description: 'Understand how cryptocurrency creates trust without intermediaries.',
  duration: 5,
  topicId: 27,
  scenario: 'Traditionally, if you want to send money to someone across the world, you need banks to verify and process the transaction. This takes days and costs fees. Cryptocurrency offers an alternative. How does it create trust without banks?',
  choices: [
    {
      id: 'cs-1',
      text: 'A single powerful computer verifies everything',
      feedback: 'This would create a central point of control and failure. Cryptocurrency\'s innovation is that NO single entity has control—trust comes from the network itself.',
      isOptimal: false,
    },
    {
      id: 'cs-2',
      text: 'Thousands of computers verify transactions together using cryptography',
      feedback: 'Correct! The network reaches consensus through many computers checking each other\'s work. Cryptographic math ensures that transactions can\'t be faked. Trust emerges from the system, not from any authority.',
      isOptimal: true,
    },
    {
      id: 'cs-3',
      text: 'There is no verification—you just have to trust people',
      feedback: 'Actually, cryptocurrency provides MORE verification than traditional systems! Every transaction is checked by thousands of computers and recorded permanently. "Don\'t trust, verify" is a crypto motto.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Wealth Exercises (Topic ID: 28)
// ============================================

const wealthAllocationScenario1: ScenarioExercise = {
  id: 'wealth-allocation-scenario-1',
  type: 'scenario',
  title: 'Resource Allocation',
  description: 'Explore how to think about allocating limited resources.',
  duration: 5,
  topicId: 28,
  scenario: 'You have a limited amount of money each month after necessities. Financial advisors often recommend dividing discretionary income between saving, investing, giving, and enjoying. How might you think about this allocation?',
  choices: [
    {
      id: 'was1-1',
      text: 'Save everything—you never know what might happen',
      feedback: 'While saving is important, extreme saving can lead to missing out on life experiences and opportunities. Balance is key—some saving, some investing, some enjoying the present.',
      isOptimal: false,
    },
    {
      id: 'was1-2',
      text: 'Balance between present enjoyment, future security, and helping others',
      feedback: 'Wise approach! A balanced allocation honors multiple values: enjoying today, preparing for tomorrow, and contributing to others. The specific percentages depend on your situation and values.',
      isOptimal: true,
    },
    {
      id: 'was1-3',
      text: 'Spend it all—you can\'t take it with you',
      feedback: 'While enjoying life is important, having no savings creates vulnerability. Unexpected expenses, job changes, or opportunities require some financial cushion. Balance present and future needs.',
      isOptimal: false,
    },
  ],
};

const wealthAllocationScenario2: ScenarioExercise = {
  id: 'wealth-allocation-scenario-2',
  type: 'scenario',
  title: 'True Wealth',
  description: 'Consider what wealth really means.',
  duration: 5,
  topicId: 28,
  scenario: 'Two people: Person A has a high income but works 80 hours a week, has little time for family, and feels stressed. Person B earns less but has time for loved ones, hobbies, and feels content. Who is wealthier?',
  choices: [
    {
      id: 'was2-1',
      text: 'Person A—wealth is measured by money',
      feedback: 'Money is one form of wealth, but not the only one. If high income comes at the cost of health, relationships, and happiness, is it truly wealth? Many high earners feel "time poor."',
      isOptimal: false,
    },
    {
      id: 'was2-2',
      text: 'Wealth includes time, relationships, health, and contentment—not just money',
      feedback: 'Exactly! True wealth is multidimensional. Money is a tool, but time with loved ones, good health, meaningful work, and inner peace are also forms of wealth. The richest life balances all of these.',
      isOptimal: true,
    },
    {
      id: 'was2-3',
      text: 'Person B—money doesn\'t matter at all',
      feedback: 'Money does matter—it provides security, options, and the ability to help others. But it\'s not everything. The key is finding a balance where money serves your life, rather than your life serving money.',
      isOptimal: false,
    },
  ],
};

// ============================================
// Export Finance Exercises
// ============================================

export const financeExercises: Record<number, InteractiveExercise[]> = {
  // Money (Topic ID: 25)
  25: [moneyValueScenario1, moneyValueScenario2],
  // Markets (Topic ID: 26)
  26: [marketsCauseEffectMatching, marketsScenario],
  // Cryptocurrency (Topic ID: 27)
  27: [cryptoConceptQuiz, cryptoScenario],
  // Wealth (Topic ID: 28)
  28: [wealthAllocationScenario1, wealthAllocationScenario2],
};
