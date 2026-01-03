/**
 * Network Journey Story - Interactive Exercises
 * "What Happens When You Type a URL" - Deep dive exercises
 */

import type { Exercise } from './big-bang-exercises';

export const networkJourneyExercises: Exercise[] = [
  // Reflection Exercises
  {
    type: 'reflection',
    title: 'Handshakes in Life',
    description: 'Explore connection rituals in human experience',
    duration: 10,
    prompts: [
      'The TCP handshake (SYN, SYN-ACK, ACK) establishes trust through mutual acknowledgment before any real communication begins.',
      'What "handshakes" exist in your relationships? Think of rituals that establish trust before deeper communication.',
      'How do you and your baby "handshake"? What signals do you exchange?',
      'Why do you think establishing connection before communication is important?'
    ],
    guidance: 'Consider greetings, eye contact, the way conversations begin, and the subtle signals that say "I\'m ready to connect."'
  },
  {
    type: 'reflection',
    title: 'Invisible Networks',
    description: 'Contemplate the cooperation that makes the internet work',
    duration: 10,
    prompts: [
      'Your web request traveled through dozens of computers operated by people you\'ll never meet, across cables laid by workers you\'ll never thank, processed by systems built by engineers you\'ll never know.',
      'What does this invisible cooperation tell us about human society?',
      'What other "invisible networks" support your daily life?',
      'How does your baby benefit from networks of care they\'ll never see?'
    ],
    guidance: 'Think about infrastructure, supply chains, healthcare systems, and the countless people whose work touches your life without your awareness.'
  },
  {
    type: 'reflection',
    title: 'The DNS Detective',
    description: 'Diagnose why a website cannot be reached',
    duration: 8,
    prompts: [
      'Imagine you\'re troubleshooting: A user can\'t reach google.com. Root Server: OK. TLD Server: OK. Authoritative Server: TIMEOUT.',
      'Where is the break in the chain? (The problem is at Google\'s authoritative nameservers)',
      'This hierarchical troubleshooting mirrors how we solve problems in life—checking each step in sequence.',
      'What hierarchies exist in your life? How do they help organize complex systems?'
    ],
    guidance: 'Follow the hierarchy step by step. DNS resolution goes: Root → TLD → Authoritative.'
  },

  // Thought Experiments
  {
    type: 'thought-experiment',
    title: 'The TCP Construction',
    description: 'Build a valid three-way handshake from available packets',
    duration: 8,
    prompts: [
      'You have these packets: SYN, ACK, FIN, RST, SYN-ACK. The server is listening. Your goal: Initiate a reliable connection.',
      'What should you send first? (SYN - "Hello, I want to connect")',
      'What will the server respond with? (SYN-ACK - "I hear you, I want to connect too")',
      'What completes the handshake? (ACK - "Great, let\'s begin")',
      'What happens if you send ACK first? (Connection Refused - the server doesn\'t know who you are yet!)'
    ],
    guidance: 'Remember: connection requires mutual acknowledgment before data can flow. This mirrors how trust is built in relationships.'
  },
  {
    type: 'thought-experiment',
    title: 'The Broken Router',
    description: 'Understand packet switching resilience',
    duration: 8,
    prompts: [
      'Imagine you\'re sending a large photo (split into 100 packets) to a friend. Midway through, Router #7 in the network path fails completely.',
      'What happens to your image transfer? Do all packets get lost?',
      'The answer: Packets automatically find alternative routes around the failed router!',
      'This is the beauty of packet switching—the internet was literally designed to survive failures, even nuclear attacks.',
      'What systems in your life have this kind of resilience? What can you learn from the internet\'s design?'
    ],
    guidance: 'The internet doesn\'t wait for broken routers—it routes around them. Each packet can find its own path.'
  },
  {
    type: 'thought-experiment',
    title: 'The Complete Journey',
    description: 'Trace the steps of a web request',
    duration: 10,
    prompts: [
      'Arrange these steps in order: TLS handshake, DNS lookup, HTTP request, TCP handshake, Browser renders page, Server processes request, User types URL',
      'Correct order: 1) User types URL → 2) DNS lookup → 3) TCP handshake → 4) TLS handshake → 5) HTTP request → 6) Server processes → 7) Browser renders',
      'All of this happens in less than a second. What does this tell us about the complexity hidden in simple actions?',
      'What other "simple" actions in your life hide incredible complexity?'
    ],
    guidance: 'First we need to find the address (DNS), then establish connection (TCP), then secure it (TLS), then communicate (HTTP), then render.'
  },

  // Visualization Exercises
  {
    type: 'visualization',
    title: 'The Signal\'s Journey',
    description: 'Visualize your request traveling across the world',
    duration: 12,
    prompts: [
      'Close your eyes and take three deep breaths. We\'re going to follow a signal on its journey.',
      'Imagine your request as a tiny point of light leaving your computer.',
      'Watch it travel through the cable to your router, then out into the wider network.',
      'See it dive into an undersea cable, traveling through the dark ocean depths.',
      'Watch it emerge on another continent, bouncing between massive data centers.',
      'See it arrive at a server farm—thousands of computers humming with activity.',
      'Watch the response light up and begin its journey back to you.',
      'Feel it arrive, carrying exactly what you asked for.',
      'Marvel at this journey that happened in less than a second.'
    ],
    guidance: 'Let the visualization be vivid. See the cables, the servers, the light traveling. Feel the wonder of this invisible infrastructure.'
  },
  {
    type: 'visualization',
    title: 'The Hierarchy of Names',
    description: 'Visualize DNS as a family tree of knowledge',
    duration: 10,
    prompts: [
      'Close your eyes. Imagine DNS as a family asking for directions.',
      'You want to find "google.com". First, you ask yourself (your computer\'s cache). Do you remember?',
      'If not, you ask your mother (the router). Does she know?',
      'If not, you ask your grandmother (the ISP). Does she know?',
      'If not, you go to the ancient records—the Root servers, the elders of the internet.',
      'They point you to the .com family (TLD servers), who point you to Google\'s own keepers (authoritative servers).',
      'Finally, you have the address. The journey can begin.',
      'Feel how knowledge flows through hierarchies, each level knowing a piece of the puzzle.'
    ],
    guidance: 'This visualization helps you understand DNS as a human system of knowledge sharing.'
  },

  // Breathing Exercise
  {
    type: 'breathing',
    title: 'The Handshake Breath',
    description: 'A breathing exercise inspired by the TCP handshake',
    duration: 6,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Inhale for 4 counts (SYN - sending your intention out into the world).',
      'Hold for 4 counts (SYN-ACK - receiving acknowledgment, feeling the connection).',
      'Exhale for 4 counts (ACK - completing the connection, establishing trust).',
      'Repeat this cycle 6 times—each breath is a handshake with the world.',
      'Feel how connection requires this rhythm: reach out, receive, confirm.'
    ],
    guidance: 'Each breath is a handshake with the world. Inhale (SYN), Hold (SYN-ACK), Exhale (ACK).'
  },

  // Discussion
  {
    type: 'discussion',
    title: 'Network Conversations',
    description: 'Questions to discuss about how the internet mirrors human connection',
    duration: 15,
    prompts: [
      'The internet was designed to be resilient—to route around failures. What can we learn from this for our own lives?',
      'Every website you visit is a small miracle of cooperation between thousands of computers and millions of people. How does this change how you see technology?',
      'The TCP handshake ensures both sides are ready before communication begins. How might we apply this principle to our human conversations?',
      'Your baby will grow up in a world where instant global communication is normal. What values do you want to teach them about connection?',
      'The internet connects billions of people, yet we often feel isolated. What does true connection mean to you?'
    ],
    guidance: 'These questions are meant to spark meaningful conversations about technology, connection, and what we want to pass on to our children.'
  },

  // Creative
  {
    type: 'creative',
    title: 'Draw the Journey',
    description: 'Creative activities to express your understanding of network communication',
    duration: 15,
    prompts: [
      'Draw a map of a web request\'s journey—from your computer, through routers and cables, across oceans, to a server, and back.',
      'Create a comic strip showing the TCP handshake as a conversation between two characters.',
      'Write a short story from the perspective of a data packet traveling across the internet.',
      'Design a "network of care" for your baby—who are all the people and systems that support their wellbeing?',
      'Create a visual representation of the DNS hierarchy as a family tree.'
    ],
    guidance: 'Don\'t worry about artistic skill—these activities are about understanding and expression, not perfection.'
  }
];

// Helper functions
export function getNetworkJourneyExercisesByType(type: Exercise['type']): Exercise[] {
  return networkJourneyExercises.filter(ex => ex.type === type);
}

export function getNetworkJourneyTotalExerciseDuration(): number {
  return networkJourneyExercises.reduce((total, ex) => total + ex.duration, 0);
}

export function getNetworkJourneyRecommendedSequence(): Exercise[] {
  return [
    networkJourneyExercises.find(e => e.title === 'The Handshake Breath')!,
    networkJourneyExercises.find(e => e.title === 'The Signal\'s Journey')!,
    networkJourneyExercises.find(e => e.title === 'Handshakes in Life')!,
  ];
}
