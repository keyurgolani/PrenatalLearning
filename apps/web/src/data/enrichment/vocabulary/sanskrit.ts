/**
 * Sanskrit Words Collection
 * Ancient wisdom words with deep philosophical meaning
 */

import type { DailyWord } from '../../../types/daily';

export const sanskritWords: DailyWord[] = [
  {
    id: 'sanskrit-001',
    word: 'प्रज्ञा',
    language: 'sanskrit',
    transliteration: 'Prajñā',
    pronunciation: '/prʌdʒ.njɑː/',
    meaning: 'Wisdom, discernment, insight; the highest form of knowledge that leads to enlightenment',
    partOfSpeech: 'noun',
    etymology: 'From "pra" (before, forth) + "jñā" (to know). Literally "knowing before" or "foreknowledge".',
    culturalNote: 'In Buddhist philosophy, prajñā is one of the six perfections and represents wisdom that perceives the true nature of reality.',
    examples: [
      { original: 'प्रज्ञा परमं धनम्', translation: 'Wisdom is the supreme wealth' }
    ],
    relatedWords: ['jñāna (knowledge)', 'vidyā (learning)', 'bodhi (awakening)'],
    difficulty: 'intermediate',
    category: 'philosophy',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-002',
    word: 'शांति',
    language: 'sanskrit',
    transliteration: 'Shānti',
    pronunciation: '/ʃɑːn.tiː/',
    meaning: 'Peace, tranquility, calmness of mind; inner serenity',
    partOfSpeech: 'noun',
    etymology: 'From the root "śam" meaning to be calm or quiet.',
    culturalNote: 'Often chanted three times (Shānti, Shānti, Shānti) to invoke peace in body, speech, and mind.',
    examples: [
      { original: 'ॐ शांति शांति शांति', translation: 'Om Peace Peace Peace' }
    ],
    relatedWords: ['śama (calmness)', 'kṣānti (patience)'],
    difficulty: 'beginner',
    category: 'spirituality',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-003',
    word: 'धर्म',
    language: 'sanskrit',
    transliteration: 'Dharma',
    pronunciation: '/dʰʌr.mʌ/',
    meaning: 'Cosmic law, duty, righteousness; the natural order that sustains the universe',
    partOfSpeech: 'noun',
    etymology: 'From the root "dhṛ" meaning to hold, maintain, or support.',
    culturalNote: 'One of the most complex concepts in Indian philosophy, encompassing ethics, duty, law, and cosmic order.',
    examples: [
      { original: 'धर्मो रक्षति रक्षितः', translation: 'Dharma protects those who protect it' }
    ],
    relatedWords: ['karma (action)', 'satya (truth)', 'ahimsa (non-violence)'],
    difficulty: 'intermediate',
    category: 'philosophy',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-004',
    word: 'आनन्द',
    language: 'sanskrit',
    transliteration: 'Ānanda',
    pronunciation: '/ɑː.nʌn.dʌ/',
    meaning: 'Bliss, joy, happiness; the highest state of spiritual fulfillment',
    partOfSpeech: 'noun',
    etymology: 'From "ā" (towards) + "nand" (to rejoice).',
    culturalNote: 'In Vedantic philosophy, ānanda is considered one of the three aspects of ultimate reality: Sat-Chit-Ānanda (Being-Consciousness-Bliss).',
    examples: [
      { original: 'सच्चिदानन्द', translation: 'Being-Consciousness-Bliss (the nature of the Self)' }
    ],
    relatedWords: ['sukha (happiness)', 'harṣa (delight)', 'prīti (love)'],
    difficulty: 'beginner',
    category: 'spirituality',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-005',
    word: 'अहिंसा',
    language: 'sanskrit',
    transliteration: 'Ahiṃsā',
    pronunciation: '/ʌ.hɪm.sɑː/',
    meaning: 'Non-violence, non-harm; the principle of not causing injury to any living being',
    partOfSpeech: 'noun',
    etymology: 'From "a" (not) + "hiṃsā" (violence, harm).',
    culturalNote: 'A fundamental principle in Hinduism, Buddhism, and Jainism. Mahatma Gandhi made it central to his philosophy of peaceful resistance.',
    examples: [
      { original: 'अहिंसा परमो धर्मः', translation: 'Non-violence is the highest duty' }
    ],
    relatedWords: ['karuṇā (compassion)', 'dayā (mercy)', 'maitrī (friendliness)'],
    difficulty: 'beginner',
    category: 'ethics',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-006',
    word: 'योग',
    language: 'sanskrit',
    transliteration: 'Yoga',
    pronunciation: '/joʊ.ɡʌ/',
    meaning: 'Union, connection; the discipline of uniting body, mind, and spirit',
    partOfSpeech: 'noun',
    etymology: 'From the root "yuj" meaning to yoke, join, or unite.',
    culturalNote: 'While known globally for physical postures, yoga encompasses eight limbs including ethics, breath control, and meditation.',
    examples: [
      { original: 'योगश्चित्तवृत्तिनिरोधः', translation: 'Yoga is the cessation of the fluctuations of the mind' }
    ],
    relatedWords: ['āsana (posture)', 'prāṇāyāma (breath control)', 'dhyāna (meditation)'],
    difficulty: 'beginner',
    category: 'practice',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-007',
    word: 'मन्त्र',
    language: 'sanskrit',
    transliteration: 'Mantra',
    pronunciation: '/mʌn.trʌ/',
    meaning: 'Sacred utterance, mystical formula; words or sounds believed to have spiritual power',
    partOfSpeech: 'noun',
    etymology: 'From "man" (to think) + "tra" (instrument). Literally "instrument of thought".',
    culturalNote: 'Mantras are used in meditation and ritual, believed to create specific vibrations that affect consciousness.',
    examples: [
      { original: 'ॐ मणि पद्मे हूँ', translation: 'Om Mani Padme Hum (The jewel is in the lotus)' }
    ],
    relatedWords: ['japa (repetition)', 'bīja (seed syllable)', 'stotra (hymn)'],
    difficulty: 'beginner',
    category: 'spirituality',
    dateAdded: '2025-01-01'
  },
  {
    id: 'sanskrit-008',
    word: 'सत्य',
    language: 'sanskrit',
    transliteration: 'Satya',
    pronunciation: '/sʌt.jʌ/',
    meaning: 'Truth, reality; that which is real and unchanging',
    partOfSpeech: 'noun',
    etymology: 'From "sat" meaning being, existence, or truth.',
    culturalNote: 'Gandhi adopted "Satyagraha" (holding onto truth) as his method of non-violent resistance.',
    examples: [
      { original: 'सत्यमेव जयते', translation: 'Truth alone triumphs' }
    ],
    relatedWords: ['ṛta (cosmic order)', 'dharma (righteousness)', 'sat (being)'],
    difficulty: 'beginner',
    category: 'philosophy',
    dateAdded: '2025-01-01'
  }
];

export default sanskritWords;
