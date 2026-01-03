/**
 * LLM Story Exercises
 * 
 * Topic-specific exercises for "The Word Weavers: How Large Language Models Write"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const llmExercises: Exercise[] = [
  // Prediction Activity (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Next Word Game',
    description: 'Experience how LLMs work by practicing next-word prediction yourself.',
    duration: 12,
    prompts: [
      'Complete this sentence in your mind: "The baby kicked and I felt so..." What words came to mind? Happy? Excited? Amazed? Your brain just did what LLMs do—predicted likely next words.',
      'Now try: "Once upon a time, there was a..." Notice how certain words feel more natural? Princess, king, little girl? These are high-probability completions.',
      'Try a technical one: "The computer processed the..." Data? Information? Request? Your predictions depend on context you\'ve learned from experience.',
      'Now imagine doing this for every single word in a paragraph, thousands of times per response. That\'s what an LLM does, but with mathematical precision.',
      'Think about how your predictions would change with different contexts. "In the hospital, the baby..." vs "In the fairy tale, the baby..." Context shapes probability.',
      'Reflect: How does understanding this simple mechanism—predicting the next word—change how you think about AI-generated text?'
    ],
    guidance: 'This exercise helps you experience the core mechanism of LLMs firsthand. You\'re doing intuitively what they do mathematically.'
  },
  {
    type: 'thought-experiment',
    title: 'Temperature Exploration',
    description: 'Understand the creativity dial by imagining responses at different temperature settings.',
    duration: 10,
    prompts: [
      'Imagine asking "What color is the sky?" At low temperature (predictable), the answer would almost always be "blue." At high temperature (creative), you might get "azure," "cerulean," or even "the color of dreams."',
      'Think about when you\'d want low temperature: medical advice, factual questions, instructions. Predictability is valuable here.',
      'Think about when you\'d want high temperature: brainstorming, creative writing, exploring ideas. Surprise and novelty are valuable here.',
      'Consider your own communication. When do you speak "low temperature"—carefully, predictably? When do you speak "high temperature"—freely, creatively?',
      'Imagine describing your baby to someone. A "low temperature" description might be factual: weight, due date. A "high temperature" description might be poetic: hopes, dreams, feelings.',
      'Reflect: How might you use this understanding when interacting with AI tools in the future?'
    ],
    guidance: 'This exercise builds intuition for the temperature parameter—one of the most important controls for LLM output.'
  },

  // Understanding Limitations (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The Stochastic Parrot Question',
    description: 'Explore the debate about whether LLMs truly understand or merely mimic.',
    duration: 15,
    prompts: [
      'An LLM can write a beautiful poem about love. But does it feel love? What\'s the difference between generating words about an emotion and actually experiencing it?',
      'Consider: if you read a love letter and couldn\'t tell whether a human or AI wrote it, does it matter? What makes human-written words special?',
      'Think about understanding vs pattern matching. You understand that fire is hot because you\'ve felt heat. An LLM knows "fire" often appears near "hot" in text. Is that understanding?',
      'The term "stochastic parrot" suggests LLMs just repeat patterns. But parrots don\'t write novels or solve problems. Where does mimicry end and something more begin?',
      'Consider your baby learning language. At first, they\'ll mimic sounds. Then words. Then sentences. At what point does mimicry become understanding?',
      'Reflect: Does it matter whether LLMs "truly understand"? What questions does this raise about intelligence, consciousness, and meaning?'
    ],
    guidance: 'This exercise engages with one of the deepest questions in AI. There are no easy answers—the goal is thoughtful reflection.'
  },
  {
    type: 'thought-experiment',
    title: 'Finding the Limits',
    description: 'Explore what LLMs cannot do to better understand what they can do.',
    duration: 12,
    prompts: [
      'LLMs can\'t verify facts against reality—they only know patterns in text. Think of a question where this limitation matters. "Is this medicine safe?" requires real-world verification.',
      'LLMs can\'t truly reason about novel situations. They pattern-match to similar situations in training. What kinds of problems might this fail on?',
      'LLMs have no persistent memory between conversations (unless specially designed). Each conversation starts fresh. How does this differ from human relationships?',
      'LLMs can\'t learn from a single conversation the way humans can. You could explain something new, and they\'d engage with it, but they wouldn\'t "remember" it tomorrow.',
      'Consider: LLMs can\'t feel consequences. They can write about danger without fear, about loss without grief. How does this affect the advice they give?',
      'Reflect: Understanding limitations helps us use tools wisely. How might you approach LLM interactions differently knowing these constraints?'
    ],
    guidance: 'This exercise builds critical thinking about AI capabilities. Understanding limitations is as important as understanding abilities.'
  },

  // Reflection on Communication (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Words That Carry Meaning',
    description: 'Reflect on what makes human communication special compared to generated text.',
    duration: 15,
    prompts: [
      'Think of words someone said to you that changed your life. What made them powerful? Was it just the words, or the person, the moment, the relationship?',
      'When you speak to your baby, your words carry love, intention, presence. How is this different from text generated by probability?',
      'Consider the phrase "I love you." An LLM can generate it based on patterns. When you say it, what makes it meaningful?',
      'Think about a time you struggled to find the right words. That struggle—the search for meaning—is something LLMs don\'t experience. They just predict.',
      'Your baby will learn language from you. They\'ll learn not just words, but meaning, emotion, connection. What do you want your words to teach them?',
      'Write a short message to your baby that no LLM could truly write—something that requires your specific experience, your unique love, your conscious intention.'
    ],
    guidance: 'This reflection celebrates human communication while acknowledging AI capabilities. It\'s about finding what\'s irreplaceable in human connection.'
  },
  {
    type: 'reflection',
    title: 'Living with Language AI',
    description: 'Reflect on how LLMs might shape your child\'s relationship with language and communication.',
    duration: 12,
    prompts: [
      'Your child will grow up with AI that can write essays, answer questions, and have conversations. How do you feel about this?',
      'What skills become more important in a world with LLMs? Critical thinking? Creativity? Emotional intelligence? Verification of information?',
      'How will you teach your child to use AI tools wisely? To know when to rely on them and when to trust their own thinking?',
      'Consider: if AI can write a decent essay, what\'s the value of learning to write? What does writing teach beyond producing text?',
      'Think about authenticity. In a world of generated content, how will your child learn to value genuine human expression?',
      'Write down three principles you\'d want to guide your child\'s relationship with language AI.'
    ],
    guidance: 'This reflection helps you think intentionally about raising a child in a world with powerful language AI.'
  },

  // Visualization Exercise (Requirement 10.3)
  {
    type: 'visualization',
    title: 'Journey Through the Transformer',
    description: 'A guided visualization through how an LLM processes and generates text.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself shrinking down until you can enter the world of data.',
      'You\'re standing at the entrance to a transformer—a vast architecture of flowing information. A prompt arrives: "Tell me about love."',
      'Watch as the words break into tokens, each one becoming a glowing number. "Tell" "me" "about" "love" — four lights entering the system.',
      'Now you\'re inside the attention layers. See how each token reaches out to the others, forming connections. "Love" connects strongly to "about," understanding the question.',
      'Layer after layer, the understanding deepens. Patterns from billions of texts about love activate—poems, letters, stories, definitions.',
      'You reach the output layer. Thousands of possible next words shimmer with different brightnesses. "Love" glows brightest, then "is," then "a," then "feeling."',
      'Watch as temperature adjusts the glow. At low temperature, only the brightest words remain visible. At high temperature, dimmer words get their chance to shine.',
      'A word is chosen: "Love." It joins the sequence. The process repeats. "Love is..." "Love is a..." "Love is a feeling..."',
      'Now step back and see the whole response forming, word by word, probability by probability, until a complete answer emerges.',
      'Take a deep breath and return to normal size, carrying with you an understanding of how machines weave words.'
    ],
    guidance: 'This visualization makes the abstract process of LLM generation tangible and memorable.'
  },
  {
    type: 'visualization',
    title: 'Your Voice, Your Baby\'s First Language Model',
    description: 'Visualize how your baby is learning language from you right now.',
    duration: 12,
    prompts: [
      'Close your eyes and place your hands on your belly. Take slow, deep breaths.',
      'Imagine your voice traveling to your baby—not as words yet, but as patterns of sound, rhythm, melody.',
      'Your baby\'s brain is building its own language model—not from text, but from your voice. Every word you speak creates new connections.',
      'See the neurons in your baby\'s brain lighting up as they hear you. They\'re learning the music of language before they understand the words.',
      'Unlike an LLM trained on cold text, your baby is learning language wrapped in love, in warmth, in the feeling of safety.',
      'Imagine your baby\'s first word, months from now. It will emerge from all these moments of listening, learning, connecting.',
      'Your voice is teaching more than language—it\'s teaching that communication is connection, that words carry love, that being heard matters.',
      'Open your eyes, knowing that every word you speak is shaping your baby\'s understanding of language and love.'
    ],
    guidance: 'This visualization connects the technical content to the intimate experience of prenatal bonding through voice.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'The Future of Human-AI Communication',
    description: 'Questions to discuss with your partner, family, or friends about language AI.',
    duration: 15,
    prompts: [
      'If AI can write well, what\'s the value of humans learning to write? What does the process of writing teach us beyond producing text?',
      'Should AI-generated content be labeled? How do you feel about reading something without knowing if a human or AI wrote it?',
      'How might LLMs change education? Should students use them? How should we teach critical evaluation of AI-generated content?',
      'What jobs might change as LLMs improve? What human skills become more valuable, not less?',
      'Is there something sacred about human-to-human communication that AI can\'t replicate? What is it?',
      'How do you want your child to think about AI assistants—as tools, as companions, as something else?'
    ],
    guidance: 'These questions spark important conversations about living with language AI. There are no right answers—just thoughtful exploration.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'A Letter No AI Could Write',
    description: 'Write something that requires your unique human experience and consciousness.',
    duration: 15,
    prompts: [
      'Write a letter to your baby that only you could write—something that requires your specific memories, feelings, and hopes.',
      'Include a moment from your life that shaped who you are. Describe not just what happened, but how it felt, what it meant.',
      'Write about a hope for your baby that comes from your deepest values, your unique perspective on life.',
      'Include something about this specific moment—this pregnancy, this time in your life, this feeling of anticipation.',
      'End with words of love that carry your full presence, your conscious intention, your irreplaceable self.',
      'Read it aloud to your baby. Feel the difference between generated text and words that carry your soul.'
    ],
    guidance: 'This exercise celebrates what makes human communication irreplaceable—consciousness, experience, and love.'
  },
  {
    type: 'creative',
    title: 'The Probability Poem',
    description: 'Write a poem that plays with the concept of probability and prediction.',
    duration: 12,
    prompts: [
      'Write a poem where each line could end multiple ways, but you choose the unexpected word.',
      'Start with a common phrase and take it somewhere surprising. "Roses are red, violets are..." what? Not blue—something only you would choose.',
      'Play with the tension between expected and unexpected. What happens when you defy probability?',
      'Include something about your baby—a hope, a dream, a feeling—expressed in words an LLM wouldn\'t predict.',
      'End with a line that could only come from you, from this moment, from your unique consciousness.',
      'Consider: this poem exists because you chose words that surprised even yourself. That\'s human creativity.'
    ],
    guidance: 'This creative exercise plays with the concepts from the lesson while celebrating human creativity and choice.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Token by Token Breath',
    description: 'A breathing exercise that mirrors the sequential generation of LLMs.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine gathering context, preparing to generate.',
      'Hold for 2 counts—imagine calculating probabilities, considering possibilities.',
      'Breathe out slowly for 6 counts—imagine releasing one word, one token, one piece of meaning.',
      'Repeat this cycle: In (4)... Hold (2)... Out (6)...',
      'With each breath, imagine a word forming. Breathe in: gather. Hold: choose. Breathe out: speak.',
      'Now think of your baby, hearing the rhythm of your breath, learning the patterns of your body.',
      'Continue for 5 more cycles, feeling the rhythm of generation—context, choice, expression.',
      'End with three natural breaths, feeling grateful for the gift of language—yours and your baby\'s to come.'
    ],
    guidance: 'This breathing exercise connects the technical concept of sequential generation to the physical experience of breathing.'
  }
];

/**
 * Get exercises by type
 */
export function getLLMExercisesByType(type: Exercise['type']): Exercise[] {
  return llmExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getLLMTotalExerciseDuration(): number {
  return llmExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getLLMRecommendedSequence(): Exercise[] {
  return [
    llmExercises.find(e => e.title === 'Token by Token Breath')!,
    llmExercises.find(e => e.title === 'The Next Word Game')!,
    llmExercises.find(e => e.title === 'Words That Carry Meaning')!,
  ];
}

export default llmExercises;
