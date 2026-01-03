/**
 * Spanish Words Collection
 * Beautiful and expressive Spanish vocabulary
 */

import type { DailyWord } from '../../../types/daily';

export const spanishWords: DailyWord[] = [
  {
    id: 'spanish-001',
    word: 'Madrugada',
    language: 'spanish',
    pronunciation: '/ma.ðɾu.ˈɣa.ða/',
    meaning: 'The early hours of the morning, between midnight and dawn; a time of quiet reflection',
    partOfSpeech: 'noun',
    etymology: 'From "madrugar" (to wake early), derived from Latin "maturare" (to ripen, mature).',
    culturalNote: 'In Spanish culture, madrugada is often associated with deep conversations, creativity, and intimate moments.',
    examples: [
      { original: 'Trabajamos hasta la madrugada', translation: 'We worked until the early morning hours' }
    ],
    relatedWords: ['amanecer (dawn)', 'alba (daybreak)', 'noche (night)'],
    difficulty: 'intermediate',
    category: 'time',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-002',
    word: 'Sobremesa',
    language: 'spanish',
    pronunciation: '/so.βɾe.ˈme.sa/',
    meaning: 'The time spent lingering at the table after a meal, talking and enjoying company',
    partOfSpeech: 'noun',
    etymology: 'From "sobre" (over) + "mesa" (table). Literally "over the table".',
    culturalNote: 'A cherished Spanish tradition that can last for hours, emphasizing the importance of conversation and connection.',
    examples: [
      { original: 'La sobremesa duró tres horas', translation: 'The after-dinner conversation lasted three hours' }
    ],
    relatedWords: ['tertulia (gathering)', 'charla (chat)', 'convivencia (coexistence)'],
    difficulty: 'intermediate',
    category: 'culture',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-003',
    word: 'Querencia',
    language: 'spanish',
    pronunciation: '/ke.ˈɾen.θja/',
    meaning: 'A place where one feels safe, at home; a sanctuary where one draws strength',
    partOfSpeech: 'noun',
    etymology: 'From "querer" (to want, to love).',
    culturalNote: 'Originally a bullfighting term for the spot in the ring where the bull feels safest, now used metaphorically for any place of comfort.',
    examples: [
      { original: 'Esta casa es mi querencia', translation: 'This house is my sanctuary' }
    ],
    relatedWords: ['hogar (home)', 'refugio (refuge)', 'arraigo (rootedness)'],
    difficulty: 'advanced',
    category: 'emotions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-004',
    word: 'Estrenar',
    language: 'spanish',
    pronunciation: '/es.tɾe.ˈnaɾ/',
    meaning: 'To use or wear something for the first time; to premiere',
    partOfSpeech: 'verb',
    etymology: 'From Latin "strena" (gift, omen).',
    culturalNote: 'Spanish speakers often celebrate "estrenar" new items, especially clothes, as a special occasion.',
    examples: [
      { original: 'Voy a estrenar mis zapatos nuevos', translation: 'I am going to wear my new shoes for the first time' }
    ],
    relatedWords: ['inaugurar (inaugurate)', 'debutar (debut)', 'comenzar (begin)'],
    difficulty: 'beginner',
    category: 'actions',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-005',
    word: 'Duende',
    language: 'spanish',
    pronunciation: '/ˈdwen.de/',
    meaning: 'A mysterious, ineffable quality of art that deeply moves the soul; artistic magic',
    partOfSpeech: 'noun',
    etymology: 'Originally meant "goblin" or "spirit", evolved to describe artistic inspiration.',
    culturalNote: 'Federico García Lorca wrote extensively about duende in flamenco, describing it as a force that rises from the soles of the feet.',
    examples: [
      { original: 'El cantaor tiene duende', translation: 'The flamenco singer has that magical quality' }
    ],
    relatedWords: ['arte (art)', 'pasión (passion)', 'alma (soul)'],
    difficulty: 'advanced',
    category: 'art',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-006',
    word: 'Empalagar',
    language: 'spanish',
    pronunciation: '/em.pa.la.ˈɣaɾ/',
    meaning: 'To be sickeningly sweet; to overwhelm with excessive sweetness or sentimentality',
    partOfSpeech: 'verb',
    etymology: 'From "paladar" (palate).',
    culturalNote: 'Used both literally for overly sweet food and figuratively for excessive sentimentality.',
    examples: [
      { original: 'Este pastel me empalaga', translation: 'This cake is too sweet for me' }
    ],
    relatedWords: ['dulce (sweet)', 'hostigar (to cloy)', 'saturar (saturate)'],
    difficulty: 'intermediate',
    category: 'sensations',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-007',
    word: 'Desvelado',
    language: 'spanish',
    pronunciation: '/des.be.ˈla.ðo/',
    meaning: 'Unable to sleep; kept awake; sleepless',
    partOfSpeech: 'adjective',
    etymology: 'From "des" (un-) + "velar" (to stay awake, watch over).',
    culturalNote: 'Often used to describe the state of being kept awake by thoughts, worries, or excitement.',
    examples: [
      { original: 'Estuve desvelado pensando en ti', translation: 'I was kept awake thinking about you' }
    ],
    relatedWords: ['insomnio (insomnia)', 'trasnochar (stay up late)', 'vigilia (vigil)'],
    difficulty: 'intermediate',
    category: 'states',
    dateAdded: '2025-01-01'
  },
  {
    id: 'spanish-008',
    word: 'Friolento',
    language: 'spanish',
    pronunciation: '/fɾjo.ˈlen.to/',
    meaning: 'Someone who is very sensitive to cold; always feeling cold',
    partOfSpeech: 'adjective',
    etymology: 'From "frío" (cold) + "-lento" (suffix indicating tendency).',
    culturalNote: 'A common trait discussed in Spanish-speaking cultures, often with affection.',
    examples: [
      { original: 'Soy muy friolento, siempre llevo suéter', translation: 'I get cold easily, I always wear a sweater' }
    ],
    relatedWords: ['frío (cold)', 'helado (frozen)', 'abrigado (bundled up)'],
    difficulty: 'beginner',
    category: 'personality',
    dateAdded: '2025-01-01'
  }
];

export default spanishWords;
