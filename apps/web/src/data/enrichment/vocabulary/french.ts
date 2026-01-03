/**
 * French Words Collection
 * Elegant and nuanced French vocabulary
 */

import type { DailyWord } from '../../../types/daily';

export const frenchWords: DailyWord[] = [
  {
    id: 'french-001',
    word: 'Dépaysement',
    language: 'french',
    pronunciation: '/de.pɛi.zə.mɑ̃/',
    meaning: 'The feeling of being in a foreign country; disorientation from being somewhere unfamiliar',
    partOfSpeech: 'noun',
    etymology: 'From "dé-" (un-) + "pays" (country). Literally "un-countrying".',
    culturalNote: 'Can be both positive (exciting novelty) or negative (homesickness), capturing the complex emotions of travel.',
    examples: [
      { original: 'Le dépaysement était total', translation: 'The sense of being somewhere completely different was total' }
    ],
    relatedWords: ['voyage (travel)', 'étranger (foreign)', 'nostalgie (nostalgia)'],
    difficulty: 'advanced',
    category: 'emotions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-002',
    word: 'Flâner',
    language: 'french',
    pronunciation: '/flɑ.ne/',
    meaning: 'To stroll aimlessly, taking in the surroundings; to wander without purpose',
    partOfSpeech: 'verb',
    etymology: 'Possibly from Old Norse "flana" (to rush about).',
    culturalNote: 'The "flâneur" is a celebrated figure in French culture, especially in Paris, representing the art of observing urban life.',
    examples: [
      { original: 'J\'aime flâner dans les rues de Paris', translation: 'I love to stroll through the streets of Paris' }
    ],
    relatedWords: ['se promener (to walk)', 'errer (to wander)', 'déambuler (to amble)'],
    difficulty: 'intermediate',
    category: 'actions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-003',
    word: 'Retrouvailles',
    language: 'french',
    pronunciation: '/ʁə.tʁu.vaj/',
    meaning: 'The joy of reuniting with someone after a long separation',
    partOfSpeech: 'noun (plural)',
    etymology: 'From "retrouver" (to find again, to meet again).',
    culturalNote: 'Always used in plural form, emphasizing the mutual nature of reunion.',
    examples: [
      { original: 'Les retrouvailles étaient émouvantes', translation: 'The reunion was moving' }
    ],
    relatedWords: ['réunion (reunion)', 'rencontre (meeting)', 'embrassade (embrace)'],
    difficulty: 'intermediate',
    category: 'emotions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-004',
    word: 'Sortable',
    language: 'french',
    pronunciation: '/sɔʁ.tabl/',
    meaning: 'Presentable enough to be taken out in public; socially acceptable',
    partOfSpeech: 'adjective',
    etymology: 'From "sortir" (to go out) + "-able" (able to be).',
    culturalNote: 'Often used humorously about children or partners who are finally ready to be seen in public.',
    examples: [
      { original: 'Il n\'est pas sortable ce soir', translation: 'He is not presentable enough to go out tonight' }
    ],
    relatedWords: ['présentable (presentable)', 'convenable (suitable)', 'décent (decent)'],
    difficulty: 'intermediate',
    category: 'social',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-005',
    word: 'Empêchement',
    language: 'french',
    pronunciation: '/ɑ̃.pɛʃ.mɑ̃/',
    meaning: 'An unexpected obstacle or hindrance that prevents you from doing something',
    partOfSpeech: 'noun',
    etymology: 'From "empêcher" (to prevent).',
    culturalNote: 'A polite way to explain why you cannot attend something without giving specific details.',
    examples: [
      { original: 'J\'ai eu un empêchement de dernière minute', translation: 'I had a last-minute obstacle' }
    ],
    relatedWords: ['obstacle (obstacle)', 'contretemps (setback)', 'difficulté (difficulty)'],
    difficulty: 'intermediate',
    category: 'situations',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-006',
    word: 'Crapoter',
    language: 'french',
    pronunciation: '/kʁa.pɔ.te/',
    meaning: 'To smoke without inhaling; to puff on a cigarette superficially',
    partOfSpeech: 'verb',
    etymology: 'From "crapaud" (toad), possibly referring to puffing cheeks like a toad.',
    culturalNote: 'Often used to describe someone who smokes for appearance rather than habit.',
    examples: [
      { original: 'Il ne fume pas vraiment, il crapote', translation: 'He does not really smoke, he just puffs' }
    ],
    relatedWords: ['fumer (to smoke)', 'inhaler (to inhale)', 'souffler (to blow)'],
    difficulty: 'advanced',
    category: 'actions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-007',
    word: 'Cartonner',
    language: 'french',
    pronunciation: '/kaʁ.tɔ.ne/',
    meaning: 'To be a huge success; to hit it big (slang)',
    partOfSpeech: 'verb',
    etymology: 'From "carton" (cardboard/target), originally meaning to hit the target.',
    culturalNote: 'Modern slang used for movies, songs, or anything that becomes very popular.',
    examples: [
      { original: 'Ce film a cartonné au box-office', translation: 'This film was a huge hit at the box office' }
    ],
    relatedWords: ['réussir (to succeed)', 'triompher (to triumph)', 'exploser (to explode)'],
    difficulty: 'intermediate',
    category: 'success',
    dateAdded: '2025-01-01'
  },
  {
    id: 'french-008',
    word: 'Douceur',
    language: 'french',
    pronunciation: '/du.sœʁ/',
    meaning: 'Sweetness, gentleness, softness; a pleasant mildness',
    partOfSpeech: 'noun',
    etymology: 'From Latin "dulcor" (sweetness).',
    culturalNote: 'Embodies the French appreciation for gentle pleasures and refined sensations.',
    examples: [
      { original: 'La douceur de vivre', translation: 'The sweetness of living' }
    ],
    relatedWords: ['tendresse (tenderness)', 'délicatesse (delicacy)', 'suavité (suavity)'],
    difficulty: 'beginner',
    category: 'qualities',
    dateAdded: '2025-01-01'
  }
];

export default frenchWords;
