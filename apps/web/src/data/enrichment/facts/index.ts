/**
 * Daily Facts Index
 * Fascinating facts across various categories
 */

import type { DailyFact, DailyFactSet } from '../../../types/daily';

export const dailyFacts: DailyFact[] = [
  // Science Facts
  {
    id: 'fact-sci-001',
    category: 'science',
    fact: 'A teaspoon of neutron star material would weigh about 6 billion tons on Earth.',
    source: 'NASA',
    learnMore: 'Neutron stars are the collapsed cores of massive stars, so dense that a sugar-cube-sized amount would weigh as much as Mount Everest.',
    relatedTopicId: 4,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-sci-002',
    category: 'science',
    fact: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
    source: 'NASA',
    learnMore: 'The Sun is about 93 million miles away. Light travels at 186,000 miles per second, so it takes over 8 minutes to cover that distance.',
    relatedTopicId: 4,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-sci-003',
    category: 'science',
    fact: 'There are more possible iterations of a game of chess than there are atoms in the observable universe.',
    source: 'Scientific American',
    learnMore: 'The Shannon number estimates there are 10^120 possible chess games, while there are only about 10^80 atoms in the observable universe.',
    relatedTopicId: 16,
    dateAdded: '2025-01-01'
  },
  
  // Body Facts
  {
    id: 'fact-body-001',
    category: 'body',
    fact: 'Your brain uses about 20% of your total energy, despite being only 2% of your body weight.',
    source: 'Scientific American',
    learnMore: 'The brain requires constant energy to maintain electrical signals between neurons and support cognitive functions.',
    relatedTopicId: 17,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-body-002',
    category: 'body',
    fact: 'Babies are born with about 300 bones, but adults have only 206 because many bones fuse together.',
    source: 'NIH',
    learnMore: 'Bone fusion occurs throughout childhood and adolescence, with the process completing around age 25.',
    relatedTopicId: 10,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-body-003',
    category: 'body',
    fact: 'Your stomach gets a new lining every 3-4 days to prevent it from digesting itself.',
    source: 'NIH',
    learnMore: 'The stomach produces hydrochloric acid strong enough to dissolve metal, so it needs constant renewal of its protective mucus lining.',
    relatedTopicId: 10,
    dateAdded: '2025-01-01'
  },
  
  // Nature Facts
  {
    id: 'fact-nature-001',
    category: 'nature',
    fact: 'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.',
    source: 'Smithsonian',
    learnMore: 'Honey\'s low moisture content and acidic pH create an environment where bacteria cannot survive.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-nature-002',
    category: 'nature',
    fact: 'Octopuses have three hearts and blue blood.',
    source: 'National Geographic',
    learnMore: 'Two hearts pump blood to the gills, while the third pumps it to the body. Their blood is blue because it contains copper-based hemocyanin.',
    relatedTopicId: 12,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-nature-003',
    category: 'nature',
    fact: 'A single tree can absorb about 48 pounds of carbon dioxide per year.',
    source: 'EPA',
    learnMore: 'Trees are crucial carbon sinks, converting CO2 into oxygen and storing carbon in their wood, leaves, and roots.',
    dateAdded: '2025-01-01'
  },
  
  // Space Facts
  {
    id: 'fact-space-001',
    category: 'space',
    fact: 'One day on Venus is longer than one year on Venus.',
    source: 'NASA',
    learnMore: 'Venus rotates so slowly that it takes 243 Earth days to complete one rotation, but only 225 Earth days to orbit the Sun.',
    relatedTopicId: 2,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-space-002',
    category: 'space',
    fact: 'There is a planet made largely of diamond, called 55 Cancri e.',
    source: 'NASA',
    learnMore: 'This super-Earth is twice the size of our planet and may have a surface covered in graphite and diamond.',
    relatedTopicId: 4,
    dateAdded: '2025-01-01'
  },
  
  // Psychology Facts
  {
    id: 'fact-psych-001',
    category: 'psychology',
    fact: 'The brain cannot feel pain because it has no pain receptors.',
    source: 'NIH',
    learnMore: 'This is why brain surgery can be performed while the patient is awake. Headaches come from pain receptors in surrounding tissues.',
    relatedTopicId: 17,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-psych-002',
    category: 'psychology',
    fact: 'Humans can only maintain about 150 stable social relationships at a time (Dunbar\'s number).',
    source: 'Oxford University',
    learnMore: 'This cognitive limit is related to the size of the neocortex and applies across cultures and throughout history.',
    relatedTopicId: 18,
    dateAdded: '2025-01-01'
  },
  
  // History Facts
  {
    id: 'fact-hist-001',
    category: 'history',
    fact: 'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
    source: 'Historical Records',
    learnMore: 'The Great Pyramid was built around 2560 BCE, Cleopatra lived around 30 BCE, and the Moon landing was in 1969 CE.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-hist-002',
    category: 'history',
    fact: 'Oxford University is older than the Aztec Empire.',
    source: 'Oxford University Archives',
    learnMore: 'Teaching at Oxford began in 1096, while the Aztec Empire was founded in 1428.',
    dateAdded: '2025-01-01'
  },
  
  // Culture Facts
  {
    id: 'fact-culture-001',
    category: 'culture',
    fact: 'There are more than 7,000 languages spoken in the world today.',
    source: 'Ethnologue',
    learnMore: 'About 40% of these languages are endangered, with fewer than 1,000 speakers each.',
    relatedTopicId: 21,
    dateAdded: '2025-01-01'
  },
  {
    id: 'fact-culture-002',
    category: 'culture',
    fact: 'The shortest war in history lasted 38-45 minutes between Britain and Zanzibar in 1896.',
    source: 'Guinness World Records',
    learnMore: 'The Anglo-Zanzibar War began at 9:00 AM and ended by 9:45 AM when the Sultan\'s palace was destroyed.',
    dateAdded: '2025-01-01'
  }
];

/**
 * Get facts for a specific date
 * Returns 5 facts from different categories
 */
export function getFactsForDate(date: Date): DailyFactSet {
  const dateStr = date.toISOString().split('T')[0];
  const dayOfYear = getDayOfYear(date);
  
  const categories = ['science', 'body', 'nature', 'space', 'psychology', 'history', 'culture'];
  const selectedFacts: DailyFact[] = [];
  
  // Select one fact from each of 5 different categories
  for (let i = 0; i < 5; i++) {
    const category = categories[(dayOfYear + i) % categories.length];
    const categoryFacts = dailyFacts.filter(f => f.category === category);
    if (categoryFacts.length > 0) {
      selectedFacts.push(categoryFacts[(dayOfYear + i) % categoryFacts.length]);
    }
  }
  
  return {
    date: dateStr,
    facts: selectedFacts,
  };
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get facts by category
 */
export function getFactsByCategory(category: DailyFact['category']): DailyFact[] {
  return dailyFacts.filter(fact => fact.category === category);
}

/**
 * All facts
 */
export const allFacts = dailyFacts;

export default dailyFacts;
