/**
 * Multi-Language Concepts Collection
 * Learn one concept across multiple languages simultaneously
 */

import type { MultiLanguageConcept } from '../../../types/daily';

export const multiLanguageConcepts: MultiLanguageConcept[] = [
  {
    id: 'concept-001',
    concept: 'Love',
    category: 'emotion',
    description: 'The profound feeling of deep affection, care, and attachment. One of the most universal human experiences, yet expressed with unique nuances in every language.',
    translations: [
      {
        language: 'sanskrit',
        word: 'प्रेम',
        transliteration: 'Prema',
        pronunciation: '/preɪ.mʌ/',
        nuance: 'Divine, unconditional love that transcends attachment',
        etymology: 'From "pri" meaning to please or delight',
        example: { original: 'प्रेम परमं धनम्', translation: 'Love is the supreme wealth' }
      },
      {
        language: 'spanish',
        word: 'Amor',
        pronunciation: '/a.ˈmoɾ/',
        nuance: 'Passionate, warm love often associated with romance and family',
        etymology: 'From Latin "amor"',
        example: { original: 'El amor todo lo puede', translation: 'Love can do anything' }
      },
      {
        language: 'french',
        word: 'Amour',
        pronunciation: '/a.muʁ/',
        nuance: 'Romantic, refined love with poetic connotations',
        etymology: 'From Latin "amor" via Old French',
        example: { original: "L'amour est aveugle", translation: 'Love is blind' }
      },
      {
        language: 'hindi',
        word: 'प्यार',
        transliteration: 'Pyaar',
        pronunciation: '/pjɑːr/',
        nuance: 'Affectionate, everyday love between family and friends',
        example: { original: 'प्यार में सब कुछ माफ है', translation: 'Everything is forgiven in love' }
      }
    ],
    culturalInsight: 'While English has one word for love, Greek distinguishes between eros (romantic), philia (friendship), storge (family), and agape (unconditional). Sanskrit similarly has prema (divine), sneha (affection), and kama (desire).',
    prenatalConnection: 'Your baby is already experiencing love through your heartbeat, your voice, and the hormones of bonding. This is their first language.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-002',
    concept: 'Peace',
    category: 'emotion',
    description: 'A state of tranquility, harmony, and freedom from disturbance. Both an inner state and an outer condition.',
    translations: [
      {
        language: 'sanskrit',
        word: 'शांति',
        transliteration: 'Shānti',
        pronunciation: '/ʃɑːn.tiː/',
        nuance: 'Deep spiritual peace, often chanted three times for body, speech, and mind',
        etymology: 'From root "śam" meaning to be calm',
        example: { original: 'ॐ शांति शांति शांति', translation: 'Om Peace Peace Peace' }
      },
      {
        language: 'spanish',
        word: 'Paz',
        pronunciation: '/paθ/',
        nuance: 'Both inner calm and social harmony',
        etymology: 'From Latin "pax"',
        example: { original: 'La paz comienza con una sonrisa', translation: 'Peace begins with a smile' }
      },
      {
        language: 'french',
        word: 'Paix',
        pronunciation: '/pɛ/',
        nuance: 'Elegant tranquility, often associated with diplomatic harmony',
        etymology: 'From Latin "pax" via Old French',
        example: { original: 'La paix intérieure', translation: 'Inner peace' }
      },
      {
        language: 'hindi',
        word: 'शांति',
        transliteration: 'Shanti',
        pronunciation: '/ʃɑːn.ti/',
        nuance: 'Calm serenity, often used in spiritual contexts',
        example: { original: 'मन की शांति', translation: 'Peace of mind' }
      }
    ],
    culturalInsight: 'In Eastern traditions, peace is often seen as an active state of harmony rather than mere absence of conflict. The Hebrew "shalom" and Arabic "salaam" share roots meaning wholeness and completeness.',
    prenatalConnection: 'When you feel peaceful, your baby floats in calm waters. Your state of peace becomes their first experience of safety.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-003',
    concept: 'Wisdom',
    category: 'philosophy',
    description: 'Deep understanding and insight that goes beyond mere knowledge. The ability to apply learning to life with discernment.',
    translations: [
      {
        language: 'sanskrit',
        word: 'प्रज्ञा',
        transliteration: 'Prajñā',
        pronunciation: '/prʌdʒ.njɑː/',
        nuance: 'Transcendent wisdom that perceives ultimate reality',
        etymology: 'From "pra" (before) + "jñā" (to know) - foreknowledge',
        example: { original: 'प्रज्ञा परमं धनम्', translation: 'Wisdom is the supreme wealth' }
      },
      {
        language: 'spanish',
        word: 'Sabiduría',
        pronunciation: '/sa.βi.ðu.ˈɾi.a/',
        nuance: 'Practical wisdom gained through life experience',
        etymology: 'From Latin "sapere" meaning to taste, to know',
        example: { original: 'La sabiduría viene con la edad', translation: 'Wisdom comes with age' }
      },
      {
        language: 'french',
        word: 'Sagesse',
        pronunciation: '/sa.ʒɛs/',
        nuance: 'Philosophical wisdom with connotations of moderation',
        etymology: 'From Latin "sapiens" meaning wise',
        example: { original: 'La sagesse est fille de l\'expérience', translation: 'Wisdom is the daughter of experience' }
      },
      {
        language: 'english',
        word: 'Wisdom',
        pronunciation: '/ˈwɪz.dəm/',
        nuance: 'Sound judgment and accumulated knowledge',
        etymology: 'From Old English "wīsdōm" - wise + condition',
        example: { original: 'With age comes wisdom', translation: 'With age comes wisdom' }
      }
    ],
    culturalInsight: 'Greek philosophy distinguished sophia (theoretical wisdom) from phronesis (practical wisdom). Eastern traditions often emphasize wisdom as direct insight rather than accumulated knowledge.',
    prenatalConnection: 'You are already wise in ways you may not realize—your body knows exactly how to grow this baby. Trust that ancient wisdom.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-004',
    concept: 'Breath',
    category: 'body',
    description: 'The fundamental act of taking in air and life force. In many traditions, breath is seen as the bridge between body and spirit.',
    translations: [
      {
        language: 'sanskrit',
        word: 'प्राण',
        transliteration: 'Prāṇa',
        pronunciation: '/prɑː.nʌ/',
        nuance: 'Life force, vital energy that animates all living beings',
        etymology: 'From "pra" (forth) + "an" (to breathe)',
        example: { original: 'प्राणायाम', translation: 'Control of life force (breathing practice)' }
      },
      {
        language: 'spanish',
        word: 'Aliento',
        pronunciation: '/a.ˈljen.to/',
        nuance: 'Breath as encouragement and life spirit',
        etymology: 'From Latin "halitus" meaning breath, vapor',
        example: { original: 'El aliento de vida', translation: 'The breath of life' }
      },
      {
        language: 'french',
        word: 'Souffle',
        pronunciation: '/sufl/',
        nuance: 'Breath as inspiration and creative spirit',
        etymology: 'From Latin "sufflare" meaning to blow',
        example: { original: 'Le souffle de vie', translation: 'The breath of life' }
      },
      {
        language: 'hindi',
        word: 'सांस',
        transliteration: 'Saans',
        pronunciation: '/sɑːns/',
        nuance: 'Physical breath, the rhythm of life',
        example: { original: 'गहरी सांस लो', translation: 'Take a deep breath' }
      }
    ],
    culturalInsight: 'In Hebrew, "ruach" means both breath and spirit. In Chinese, "qi" represents vital breath energy. Many traditions see breath as the connection between physical and spiritual realms.',
    prenatalConnection: 'Your breath is your baby\'s first rhythm. When you breathe deeply, you send oxygen and calm to your little one. Practice breathing together.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-005',
    concept: 'Mother',
    category: 'family',
    description: 'The one who gives birth, nurtures, and protects. A universal archetype representing unconditional love and the source of life.',
    translations: [
      {
        language: 'sanskrit',
        word: 'माता',
        transliteration: 'Mātā',
        pronunciation: '/mɑː.tɑː/',
        nuance: 'Sacred mother, often used for divine mother figures',
        etymology: 'From Proto-Indo-European "méh₂tēr"',
        example: { original: 'मातृ देवो भव', translation: 'Let your mother be like a god to you' }
      },
      {
        language: 'spanish',
        word: 'Madre',
        pronunciation: '/ˈma.ðɾe/',
        nuance: 'Warm, nurturing mother with strong family bonds',
        etymology: 'From Latin "mater"',
        example: { original: 'Madre solo hay una', translation: 'There is only one mother' }
      },
      {
        language: 'french',
        word: 'Mère',
        pronunciation: '/mɛʁ/',
        nuance: 'Elegant, nurturing presence',
        etymology: 'From Latin "mater" via Old French',
        example: { original: 'Mère Nature', translation: 'Mother Nature' }
      },
      {
        language: 'hindi',
        word: 'माँ',
        transliteration: 'Maa',
        pronunciation: '/mɑː/',
        nuance: 'Intimate, affectionate term for mother',
        example: { original: 'माँ का प्यार', translation: 'A mother\'s love' }
      }
    ],
    culturalInsight: 'The word "mother" is remarkably similar across Indo-European languages (mater, madre, mère, mutter, mat) suggesting its ancient, primal origins. The "ma" sound is often a baby\'s first utterance.',
    prenatalConnection: 'You are becoming this word. You are already mother—the first home, the first heartbeat your baby knows.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-006',
    concept: 'Joy',
    category: 'emotion',
    description: 'A feeling of great pleasure and happiness. Unlike fleeting pleasure, joy often implies a deeper, more sustained state of well-being.',
    translations: [
      {
        language: 'sanskrit',
        word: 'आनन्द',
        transliteration: 'Ānanda',
        pronunciation: '/ɑː.nʌn.dʌ/',
        nuance: 'Spiritual bliss, the highest state of fulfillment',
        etymology: 'From "ā" (towards) + "nand" (to rejoice)',
        example: { original: 'सच्चिदानन्द', translation: 'Being-Consciousness-Bliss' }
      },
      {
        language: 'spanish',
        word: 'Alegría',
        pronunciation: '/a.le.ˈɣɾi.a/',
        nuance: 'Vibrant, expressive joy often shared with others',
        etymology: 'From Latin "alacer" meaning lively',
        example: { original: 'La alegría de vivir', translation: 'The joy of living' }
      },
      {
        language: 'french',
        word: 'Joie',
        pronunciation: '/ʒwa/',
        nuance: 'Refined happiness, joie de vivre',
        etymology: 'From Latin "gaudia" meaning joys',
        example: { original: 'Joie de vivre', translation: 'Joy of living' }
      },
      {
        language: 'hindi',
        word: 'खुशी',
        transliteration: 'Khushi',
        pronunciation: '/kʰu.ʃiː/',
        nuance: 'Everyday happiness and contentment',
        example: { original: 'खुशी का पल', translation: 'A moment of joy' }
      }
    ],
    culturalInsight: 'Danish "hygge" and Swedish "lagom" represent culturally specific forms of contentment. The Japanese "ikigai" combines joy with purpose. Each culture has unique pathways to happiness.',
    prenatalConnection: 'When you feel joy, your baby bathes in happiness hormones. Your moments of delight become their first experiences of pleasure.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-007',
    concept: 'Strength',
    category: 'quality',
    description: 'The quality of being strong—physically, mentally, or emotionally. The capacity to withstand pressure and overcome challenges.',
    translations: [
      {
        language: 'sanskrit',
        word: 'शक्ति',
        transliteration: 'Shakti',
        pronunciation: '/ʃʌk.ti/',
        nuance: 'Divine feminine power, creative energy of the universe',
        etymology: 'From root "śak" meaning to be able',
        example: { original: 'शक्ति है तो सब कुछ है', translation: 'If there is strength, there is everything' }
      },
      {
        language: 'spanish',
        word: 'Fuerza',
        pronunciation: '/ˈfweɾ.θa/',
        nuance: 'Physical and moral strength, willpower',
        etymology: 'From Latin "fortia" meaning strength',
        example: { original: 'La fuerza interior', translation: 'Inner strength' }
      },
      {
        language: 'french',
        word: 'Force',
        pronunciation: '/fɔʁs/',
        nuance: 'Power and resilience, often with elegance',
        etymology: 'From Latin "fortis" meaning strong',
        example: { original: 'Force tranquille', translation: 'Quiet strength' }
      },
      {
        language: 'hindi',
        word: 'ताकत',
        transliteration: 'Taakat',
        pronunciation: '/tɑː.kʌt/',
        nuance: 'Physical power and capability',
        example: { original: 'अंदर की ताकत', translation: 'Inner strength' }
      }
    ],
    culturalInsight: 'In Sanskrit, Shakti represents the primordial cosmic energy and is personified as the Divine Mother. This connects strength with creation and nurturing rather than domination.',
    prenatalConnection: 'Your body holds ancient strength—the power to create life. Trust in your shakti, your innate creative force.',
    dateAdded: '2025-01-01'
  },
  {
    id: 'concept-008',
    concept: 'Beginning',
    category: 'time',
    description: 'The point at which something starts. Every ending contains a beginning, and every beginning holds infinite possibility.',
    translations: [
      {
        language: 'sanskrit',
        word: 'आरम्भ',
        transliteration: 'Ārambha',
        pronunciation: '/ɑː.rʌm.bʰʌ/',
        nuance: 'Sacred commencement, the first step of a journey',
        etymology: 'From "ā" (towards) + "rambh" (to begin)',
        example: { original: 'शुभारम्भ', translation: 'Auspicious beginning' }
      },
      {
        language: 'spanish',
        word: 'Comienzo',
        pronunciation: '/ko.ˈmjen.θo/',
        nuance: 'Fresh start, the opening of something new',
        etymology: 'From Latin "cum" + "initiare"',
        example: { original: 'Un nuevo comienzo', translation: 'A new beginning' }
      },
      {
        language: 'french',
        word: 'Commencement',
        pronunciation: '/kɔ.mɑ̃s.mɑ̃/',
        nuance: 'Formal beginning, often ceremonial',
        etymology: 'From Latin "cum" + "initiare"',
        example: { original: 'Au commencement', translation: 'In the beginning' }
      },
      {
        language: 'hindi',
        word: 'शुरुआत',
        transliteration: 'Shuruaat',
        pronunciation: '/ʃu.ru.ɑːt/',
        nuance: 'The start of something, often with hope',
        example: { original: 'नई शुरुआत', translation: 'New beginning' }
      }
    ],
    culturalInsight: 'Many creation myths speak of beginnings emerging from void or chaos. The Big Bang, Genesis, and Hindu cosmology all describe the mystery of how something emerges from nothing.',
    prenatalConnection: 'You are living in a beginning right now. Every cell dividing, every heartbeat, every kick is a new beginning for your baby.',
    dateAdded: '2025-01-01'
  }
];

/**
 * Get concepts for a specific date
 */
export function getConceptsForDate(date: Date): MultiLanguageConcept[] {
  const dayOfYear = getDayOfYear(date);
  // Return 2 concepts per day, cycling through the collection
  const index1 = dayOfYear % multiLanguageConcepts.length;
  const index2 = (dayOfYear + Math.floor(multiLanguageConcepts.length / 2)) % multiLanguageConcepts.length;
  return [multiLanguageConcepts[index1], multiLanguageConcepts[index2]];
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Search concepts by term
 */
export function searchConcepts(term: string): MultiLanguageConcept[] {
  const lowerTerm = term.toLowerCase();
  return multiLanguageConcepts.filter(concept =>
    concept.concept.toLowerCase().includes(lowerTerm) ||
    concept.description.toLowerCase().includes(lowerTerm) ||
    concept.translations.some(t => 
      t.word.toLowerCase().includes(lowerTerm) ||
      t.transliteration?.toLowerCase().includes(lowerTerm)
    )
  );
}
