/**
 * Internet Story Exercises
 * 
 * Topic-specific exercises for "The Web of All Things: How the Internet Connects Us"
 * These exercises help mothers engage more deeply with the material before sharing it.
 * 
 * Requirements: 10.1, 10.2, 10.3, 10.4
 */

import type { Exercise } from './big-bang-exercises';

export const internetExercises: Exercise[] = [
  // Thought Experiment about Global Communication (Requirement 10.2)
  {
    type: 'thought-experiment',
    title: 'The World Without Internet',
    description: 'Imagine life before instant global communication and reflect on how connection has changed.',
    duration: 15,
    prompts: [
      'Imagine it\'s 1950. You want to tell your grandmother on another continent that you\'re having a baby. How would you do it? How long would it take for her to receive the news?',
      'Think about a letter traveling by ship across the ocean—weeks of waiting, weeks of wondering if it arrived. How would that change the nature of your communication?',
      'Now think about today: you could video call your grandmother and see her reaction in real time. How does instant communication change relationships?',
      'Consider the phrase "absence makes the heart grow fonder." Does instant communication make us value connection more or less? Why?',
      'Think about your baby: they will never know a world without instant global communication. What might they take for granted that previous generations found miraculous?',
      'Reflect: What have we gained from instant communication? What, if anything, might we have lost?'
    ],
    guidance: 'This exercise helps you appreciate the profound change the internet has brought to human connection. Understanding the "before" makes the "after" more meaningful.'
  },
  {
    type: 'thought-experiment',
    title: 'The Packet\'s Journey',
    description: 'Follow a message as it travels around the world, understanding the complexity behind simple actions.',
    duration: 12,
    prompts: [
      'You send a text message to a friend in another country. The moment you press send, what happens? Imagine your message being broken into tiny packets.',
      'Each packet is labeled with your address and your friend\'s address. Now imagine thousands of routers, each one reading the label and deciding where to send the packet next.',
      'Some packets might travel through undersea cables, lying on the ocean floor. Others might bounce off satellites in space. All are racing toward the same destination.',
      'What if one packet gets lost? TCP notices it\'s missing and asks for it to be sent again. The system is self-correcting, always ensuring completeness.',
      'Your friend\'s phone receives all the packets, puts them in order, and displays your message. The whole journey took less than a second.',
      'Reflect: Every text, every email, every video call involves this incredible journey. How does knowing this change how you think about digital communication?'
    ],
    guidance: 'This thought experiment makes the invisible visible. Understanding the journey of a packet helps appreciate the engineering marvel behind everyday communication.'
  },

  // Visualization of Data Journey (Requirement 10.3)
  {
    type: 'visualization',
    title: 'The River of Light',
    description: 'A guided visualization of data flowing through the global internet infrastructure.',
    duration: 15,
    prompts: [
      'Close your eyes and take three deep breaths. Imagine yourself shrinking down, smaller and smaller, until you\'re the size of a photon—a particle of light.',
      'You\'re inside a fiber optic cable, a thin strand of glass. Around you, millions of other photons are racing alongside you, each carrying a tiny piece of someone\'s message.',
      'The cable dives underground, following the path of an old railroad. You race beneath cities, under rivers, through mountains. The world above is unaware of the river of light flowing beneath.',
      'Now the cable plunges into the ocean. You\'re diving deep, deeper than any submarine, to the ocean floor. Above you, whales sing and fish swim. Below you, the cable stretches across the Atlantic.',
      'You emerge on another continent, race through more cables, through buildings full of servers humming with activity. Each server is a waypoint, reading your address and sending you onward.',
      'Finally, you arrive at your destination—a phone in someone\'s hand. You join with millions of other photons, and together you become a message: "I love you."',
      'Take a deep breath and return to your normal size, carrying with you an understanding of the invisible rivers of light that connect our world.'
    ],
    guidance: 'This visualization makes the physical internet tangible. The cables, the servers, the photons—all are real, all are working right now to connect billions of people.'
  },
  {
    type: 'visualization',
    title: 'The Global Web',
    description: 'Visualize the internet as a living, breathing network spanning the entire planet.',
    duration: 12,
    prompts: [
      'Close your eyes and imagine you\'re floating high above the Earth, looking down at our beautiful blue planet.',
      'Now imagine you can see the internet—not the wires themselves, but the flow of data. Watch as glowing threads of light appear, connecting cities across continents.',
      'See the undersea cables lighting up as data flows between America and Europe, between Asia and Australia. The ocean floors glow with rivers of information.',
      'Watch the satellites orbiting above, receiving signals from one part of the world and beaming them to another. They\'re like lighthouses in space.',
      'Zoom in on a single city. See the web of connections—homes, offices, phones, all linked together. Each glowing point is a person reaching out to connect.',
      'Now zoom out again. See the whole planet wrapped in this web of light. Billions of conversations happening every second. Billions of connections being made.',
      'Take a deep breath and return, understanding that you are part of this global web—connected to everyone, everywhere.'
    ],
    guidance: 'This visualization helps you see the internet as a whole—a planet-spanning network of human connection, not just wires and signals.'
  },

  // Reflection on Connectivity (Requirement 10.1)
  {
    type: 'reflection',
    title: 'Connection in Your Baby\'s Life',
    description: 'Reflect on how internet connectivity will shape your child\'s experience of the world.',
    duration: 15,
    prompts: [
      'Your baby will grow up in a world where they can connect with anyone, anywhere, instantly. What opportunities does this create for them?',
      'Think about learning: your child will have access to more knowledge than all previous generations combined. How might this change education?',
      'Think about relationships: your child might have friends on every continent, people they\'ve never met in person but know deeply. How is this different from your childhood?',
      'Think about identity: your child will grow up with a digital presence from birth. What does it mean to have an online identity alongside a physical one?',
      'What concerns do you have about raising a child in such a connected world? What boundaries or guidance might be important?',
      'Write a short reflection: What do you hope your child will understand about connection—both digital and human?'
    ],
    guidance: 'This reflection helps you think intentionally about raising a child in the most connected era in human history. The internet is a tool; wisdom guides its use.'
  },
  {
    type: 'reflection',
    title: 'The Meaning of Distance',
    description: 'Explore how the internet has changed our relationship with distance and presence.',
    duration: 12,
    prompts: [
      'Think about someone you love who lives far away. How do you stay connected with them? How would your relationship be different without the internet?',
      'Consider the phrase "long-distance relationship." The internet has made distance less of a barrier. But has it eliminated the importance of physical presence?',
      'Think about a time when you were physically present with someone you love. What did that presence give you that a video call couldn\'t?',
      'Now think about a meaningful connection you\'ve had through the internet—maybe a message that arrived at just the right moment, or a video call that bridged a painful distance.',
      'The internet shrinks distance but can\'t eliminate it. How do you balance digital connection with physical presence in your life?',
      'Reflect: What does "being present" mean in a world where we can be digitally present anywhere?'
    ],
    guidance: 'This reflection explores the nuanced relationship between digital and physical presence. Both matter; understanding their differences helps us use each wisely.'
  },

  // Discussion Questions (Requirement 10.4)
  {
    type: 'discussion',
    title: 'The Connected Society',
    description: 'Questions to discuss with your partner, family, or friends about how the internet shapes society.',
    duration: 15,
    prompts: [
      'The internet gives everyone a voice. Is this entirely good? How do we handle misinformation, hate speech, or harmful content while preserving free expression?',
      'Some say the internet creates "filter bubbles"—we only see information that confirms what we already believe. Have you experienced this? How can we burst our bubbles?',
      'The internet has created new forms of community—online groups, social media, virtual worlds. Are these communities as meaningful as physical ones? Why or why not?',
      'Privacy on the internet is a growing concern. How much of your life is online? How do you feel about companies and governments having access to your data?',
      'The internet has changed how we work, learn, shop, and socialize. What changes have been positive? What changes concern you?',
      'If you could change one thing about how the internet works or is used, what would it be?'
    ],
    guidance: 'These questions don\'t have easy answers—they\'re meant to spark thoughtful conversation about living in a connected world and what values should guide us.'
  },

  // Creative Activities (Requirement 10.4)
  {
    type: 'creative',
    title: 'Mapping Your Digital Connections',
    description: 'Create a visual map of how the internet connects you to people and places around the world.',
    duration: 20,
    prompts: [
      'Get a piece of paper and draw a simple world map (or print one). Mark where you are with a star.',
      'Now think about everyone you\'ve communicated with online in the past month. Mark their locations on the map.',
      'Draw lines connecting you to each person. Use different colors for different types of connection—family, friends, work, online communities.',
      'Think about websites and services you use regularly. Where are their servers located? (Many are in the US, Ireland, or Singapore.) Add these to your map.',
      'Look at your map. How far does your digital reach extend? How many countries are you connected to?',
      'Now add your baby to the map. They\'re connected to all of this too, through you. Someday they\'ll have their own web of connections.',
      'Reflect: What does this map tell you about your place in the global network?'
    ],
    guidance: 'This creative exercise makes your digital connections visible. Seeing them on a map helps appreciate how the internet has expanded your reach across the globe.'
  },
  {
    type: 'creative',
    title: 'A Letter Across Time',
    description: 'Write a letter to your child about connection, to be read when they\'re older.',
    duration: 15,
    prompts: [
      'Begin your letter: "Dear [baby\'s name], I\'m writing this before you were born, thinking about how we stay connected..."',
      'Tell them about a meaningful connection you\'ve had through the internet—a message that mattered, a call that bridged distance, a community that supported you.',
      'Share what you hope they\'ll understand about digital connection: its power, its limits, its responsibilities.',
      'Tell them about the connection you\'re building with them right now, before they\'re born. No internet required—just love, presence, and your voice.',
      'Share your hopes for how they\'ll use technology to connect with others. What values do you want to guide them?',
      'End with a reminder: the most important connections aren\'t digital. They\'re the ones built through presence, through touch, through being there.'
    ],
    guidance: 'This letter becomes a precious record of your thoughts about connection. Someday, your child can read it and understand what you hoped for them.'
  },

  // Breathing Exercise (Supporting activity)
  {
    type: 'breathing',
    title: 'Connected Breath',
    description: 'A breathing exercise that connects you to the rhythm of global communication.',
    duration: 8,
    prompts: [
      'Sit comfortably with your hands on your belly. Close your eyes.',
      'Breathe in slowly for 4 counts—imagine your breath as a message of love, preparing to travel.',
      'Hold for 2 counts—imagine the message being packaged, addressed, ready to send.',
      'Breathe out slowly for 6 counts—imagine your love traveling out into the world, reaching everyone who matters to you.',
      'Repeat this cycle: In (4)... Hold (2)... Out (6)...',
      'With each breath, imagine your love reaching farther—across the room, across the city, across the ocean, around the world.',
      'Think of your baby feeling this rhythm—your heartbeat, your breath, the most direct connection possible.',
      'Continue for 5 more cycles, feeling connected to everyone you love, near and far.',
      'End with three natural breaths, knowing that the most important connection needs no technology—just love.'
    ],
    guidance: 'This breathing exercise connects the internet concept to the physical experience of connection. Your breath is the original message, carrying love without any technology.'
  },

  // Additional thought experiment
  {
    type: 'thought-experiment',
    title: 'The Gift of Open Standards',
    description: 'Explore the importance of Tim Berners-Lee\'s decision to give the web away for free.',
    duration: 10,
    prompts: [
      'Tim Berners-Lee invented the World Wide Web and gave it away for free. He could have become one of the richest people in history. Why do you think he chose to give it away?',
      'Imagine if the web had been patented and owned by one company. How might the internet be different today? Would it have grown as fast? Would it be as open?',
      'Think about other things that are freely shared: languages, mathematics, scientific knowledge. What do these have in common with the web?',
      'The internet was built on open standards—rules that anyone can use and build upon. How does openness enable innovation?',
      'Consider your own life: what have you received freely that has been valuable? What have you given freely to others?',
      'Reflect: What does Tim\'s choice teach us about generosity, about building things that benefit everyone?'
    ],
    guidance: 'This thought experiment explores the values behind the internet\'s creation. Generosity and openness made the web possible; these values can guide how we use it.'
  },

  // Additional reflection
  {
    type: 'reflection',
    title: 'Presence in a Connected World',
    description: 'Reflect on the meaning of presence when we can be digitally anywhere.',
    duration: 12,
    prompts: [
      'Think about a time when you were physically present with someone but mentally elsewhere—maybe checking your phone, thinking about work, distracted.',
      'Now think about a time when you were fully present—completely focused on the person in front of you, aware of nothing else.',
      'What\'s the difference between these two experiences? What does "being present" really mean?',
      'The internet lets us be digitally present in many places at once. But can we be truly present in more than one place? What are the costs of divided attention?',
      'Think about your baby: they will know you first through your presence—your voice, your heartbeat, your touch. This is presence in its purest form.',
      'Reflect: How do you want to balance digital connection with physical presence in your life? What boundaries might help you be more fully present?'
    ],
    guidance: 'This reflection explores the tension between connectivity and presence. The internet expands our reach but can fragment our attention; wisdom helps us navigate this.'
  }
];

/**
 * Get exercises by type
 */
export function getInternetExercisesByType(type: Exercise['type']): Exercise[] {
  return internetExercises.filter(exercise => exercise.type === type);
}

/**
 * Get total duration of all exercises
 */
export function getInternetTotalExerciseDuration(): number {
  return internetExercises.reduce((total, exercise) => total + exercise.duration, 0);
}

/**
 * Get a recommended exercise sequence for a session
 */
export function getInternetRecommendedSequence(): Exercise[] {
  return [
    internetExercises.find(e => e.title === 'Connected Breath')!,
    internetExercises.find(e => e.title === 'The Packet\'s Journey')!,
    internetExercises.find(e => e.title === 'Connection in Your Baby\'s Life')!,
  ];
}

export default internetExercises;
