import type { Story, CategoryId, DifficultyLevel, StoryContent, TopicExercise } from '../types';

/**
 * Story data for the Prenatal Learning Hub
 * 
 * Requirements:
 * - 5.1: Stories across at least 8 distinct categories
 * - 5.2: At least 3 stories per category (we have 4 per category = 32 total)
 * - 5.3: Stories at foundational, intermediate, and advanced difficulty levels
 * - 5.4: Duration between 50-70 minutes per story
 * - 9.1: Full narrative scripts for one-hour reading sessions
 * - 9.2: Scientifically accurate explanations with accessible analogies
 * - 9.3: Key concepts and core truths for each topic
 */

// Helper function to create story content structure
function createStoryContent(
  narrative: StoryContent['narrative'],
  keyConcepts: string[],
  analogies: string[],
  exercises: TopicExercise[]
): StoryContent {
  return { narrative, keyConcepts, analogies, exercises };
}

/**
 * All stories in the Prenatal Learning Hub
 * 32 stories total: 4 per category across 8 categories
 */
export const stories: Story[] = [
  // ============================================
  // SCIENCE & UNIVERSE (4 stories)
  // ============================================
  {
    id: 1,
    title: 'The Story of Everything: From Big Bang to You',
    category: 'science',
    duration: 60,
    difficulty: 'foundational',
    description: 'Journey through 13.8 billion years of cosmic evolution, from the first spark of creation to the miracle of your existence.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going on the most amazing journey together—a journey through time and space, through the story of how everything came to be.

Take a deep breath, dear mother. Place your hands gently on your belly. Feel the warmth, the connection, the love that flows between you and your baby.

Now, close your eyes and imagine... imagine a time before there were stars, before there were planets, before there was anything at all. A time when the entire universe—everything that would ever exist—was smaller than a grain of sand.

This is where our story begins. The story of everything. The story of how the universe was born, how stars came to shine, how planets formed, and how, after billions and billions of years, you came to be.`,
        coreContent: `About 13.8 billion years ago, the entire universe was contained in a point smaller than an atom. Then came the Big Bang—not an explosion in space, but an expansion of space itself. The universe bloomed like a cosmic flower, growing and cooling as it expanded.

In those first moments, the universe was a hot soup of energy and particles. As it cooled, the first atoms formed—hydrogen and helium, the simplest building blocks. Gravity slowly gathered these atoms into vast clouds, and within those clouds, the first stars ignited.

These ancient stars were cosmic forges, fusing hydrogen into heavier elements—carbon, oxygen, iron, gold. When massive stars died in spectacular explosions called supernovas, they scattered these elements across the cosmos. New stars formed from this enriched material, and around them, planets coalesced from dust and gas.

Our Sun was born about 4.6 billion years ago, and Earth formed shortly after. Over billions of years, life emerged and evolved on our planet, eventually leading to you—a being made of atoms forged in the hearts of ancient stars.

You are literally made of star stuff, little one. The calcium in your bones, the iron in your blood, the oxygen you breathe—all were created inside stars that lived and died long before our Sun was born.`,
        interactiveSection: `Let's take a moment to breathe together. Imagine that with each breath, you're breathing in starlight—the same light that has traveled across the universe for billions of years.

Breathe in slowly... feel the warmth spreading through your body, reaching your baby.
Breathe out gently... imagine sending love and wonder to your little one.

Now, place both hands on your belly. Feel the warmth of your skin, the gentle movements of your baby. As you hold your belly, whisper softly: "You are made of stars, little one. You are part of the universe's greatest story."`,
        integration: `Little one, as you grow and learn and explore the world, remember this story. Remember that you are part of something vast and beautiful and ancient.

When you look up at the night sky and see the stars twinkling, know that you are looking at your cosmic family. Those stars are your distant cousins, made of the same stuff as you, part of the same great story.

You are a child of the cosmos, born from the hearts of ancient stars. You carry within you the light of the Big Bang, the warmth of a billion suns, the wonder of 13.8 billion years of cosmic evolution.`
      },
      [
        'The universe began 13.8 billion years ago from an incredibly small, hot, dense state',
        'The universe has been expanding and cooling ever since the Big Bang',
        'Stars create heavier elements through nuclear fusion',
        'We are literally made of star stuff—atoms forged in ancient stars',
        'Everything in the universe is connected, part of the same cosmic story'
      ],
      [
        'The Big Bang was like a cosmic flower blooming, not an explosion',
        'The expanding universe is like bread dough rising with chocolate chips drifting apart',
        'Stars are cosmic forges, cooking up the elements of life'
      ],
      [
        {
          type: 'reflection',
          title: 'Your Place in the Cosmic Story',
          description: 'Reflect on your connection to the universe',
          prompts: [
            'How does it feel to know you and your baby are made of star stuff?',
            'What emotions arise when you think about the 13.8 billion year journey that led to this moment?'
          ]
        },
        {
          type: 'thought-experiment',
          title: 'Cosmic Expansion',
          description: 'Imagine the expanding universe',
          prompts: [
            'Close your eyes and imagine space itself stretching around you',
            'Think about the chocolate chip bread analogy—what would it feel like as the bread rises?'
          ]
        }
      ]
    )
  },
  {
    id: 2,
    title: 'Dancing with Gravity: The Force That Holds Us',
    category: 'science',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover the invisible embrace that holds the universe together—from falling apples to black holes, explore how gravity shapes everything.',
    content: createStoryContent(
      {
        introduction: `Hello again, little one. Today we're going to explore something magical—something you're already feeling right now, even before you're born.

Take a deep breath, dear mother. Place your hands gently on your belly. Feel how your baby rests there, cradled and held. That gentle pull, that invisible embrace that keeps everything in its place—that's what we're going to explore today.

It's called gravity, and it's one of the most wonderful mysteries in all of nature.`,
        coreContent: `Long ago, Isaac Newton watched an apple fall and wondered: why do things fall down? He realized the same force that pulls apples to the ground also keeps the Moon circling Earth and Earth circling the Sun.

Newton called this force gravity. Everything in the universe pulls on everything else—the bigger something is, the stronger its pull. That's why Earth, being very large, pulls you toward it so strongly.

But Albert Einstein discovered something even more amazing. Gravity isn't really a force pulling things together—it's the bending of space and time itself! Imagine a trampoline with a bowling ball in the middle. The ball creates a dip, and anything rolling nearby curves toward it. That's what massive objects do to space.

Near heavy objects, time actually moves more slowly. This isn't science fiction—scientists have measured it with precise clocks. The fabric of space and time, woven together as "spacetime," bends and curves around stars and planets.

Black holes are places where gravity becomes so strong that spacetime bends into a bottomless pit. Nothing, not even light, can escape once it crosses the event horizon.`,
        interactiveSection: `Let's feel gravity together. Stand up slowly if you can, dear mother. Feel how your feet press against the floor—that's Earth's gravity holding you close.

Now, gently sway from side to side. Feel how gravity keeps you grounded, stable, connected to our planet.

Place your hands on your belly. Your baby floats in a warm ocean inside you, experiencing something like weightlessness. But gravity is still there, gently cradling both of you.`,
        integration: `Little one, gravity is the gentle giant of the universe. It holds galaxies together, keeps planets in their orbits, and makes sure your feet stay on the ground.

When you take your first steps, gravity will be there, teaching you balance. When you throw a ball, gravity will bring it back to you. When you look at the Moon, remember it's dancing with Earth in gravity's eternal embrace.`
      },
      [
        'Gravity is the attraction between all objects with mass',
        'Einstein showed gravity is actually the bending of spacetime',
        'Massive objects create dips in the fabric of spacetime',
        'Time moves slower near heavy objects',
        'Black holes are regions where gravity is so strong nothing can escape'
      ],
      [
        'Spacetime is like a trampoline that bends when you place a heavy ball on it',
        'Orbiting is like falling around something without ever landing',
        'Black holes are like bottomless pits in the fabric of space'
      ],
      [
        {
          type: 'reflection',
          title: 'Feeling Gravity',
          description: 'Notice gravity in your daily life',
          prompts: [
            'How many ways do you feel gravity affecting you right now?',
            'What would life be like without gravity?'
          ]
        }
      ]
    )
  },
  {
    id: 3,
    title: 'The Quantum Garden: Where Reality Gets Magical',
    category: 'science',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Journey into the magical world of the very small, where particles can be in two places at once and observation changes reality.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going on a very special adventure—a journey into a world so tiny and so strange that it seems like pure magic.

Imagine you could shrink down, smaller and smaller, until you were tinier than a grain of sand, tinier than a speck of dust. What would you find there?

You would find a world where the rules are completely different. A world where things can be in two places at once. A world where looking at something changes what it is.`,
        coreContent: `Everything around you is made of tiny building blocks called atoms, and atoms are made of even tinier things: electrons, protons, and neutrons. At this tiny scale, the rules of reality change completely.

In the quantum world, particles can be two things at once—both a wave and a particle. Scientists call this wave-particle duality. When they shot particles at a wall with two openings, the particles created a wave pattern, as if each particle went through both openings at the same time!

This is called superposition—particles exist in all possible states at once until someone observes them. It's like a magical coin that's both heads and tails while spinning, only choosing one when you catch it.

The famous thought experiment of Schrödinger's cat illustrates this strangeness: a cat in a box could be both alive and asleep-forever at the same time, until you open the box and look.

Even stranger is quantum entanglement. Two particles can become connected so that measuring one instantly affects the other, no matter how far apart they are. Einstein called this "spooky action at a distance."`,
        interactiveSection: `Let's explore the quantum world through imagination. Close your eyes and picture yourself shrinking down, smaller and smaller, until you're the size of an atom.

Look around you. Everything is fuzzy, uncertain, full of possibility. You see an electron—but it's not in one place. It's a cloud of probability, existing everywhere at once until you focus on it.

Now imagine you're connected to another particle far, far away. Whatever happens to you instantly affects your partner. You're entangled, connected across space in a way that seems impossible.`,
        integration: `Little one, the quantum world shows us that reality is far stranger and more wonderful than it appears. At the smallest scales, the universe is full of mystery and magic.

As you grow, remember that there's always more to discover. The world is not as solid and certain as it seems—it's dancing with possibility, waiting to be explored.`
      },
      [
        'Particles can behave as both waves and particles',
        'Superposition means particles exist in multiple states until observed',
        'Observation affects quantum systems—the act of looking changes things',
        'Entangled particles are connected across any distance',
        'The quantum world underlies all of reality'
      ],
      [
        'Superposition is like a coin that is both heads and tails while spinning',
        'Wave-particle duality is like being both a fish and a bird at the same time',
        'Entanglement is like having a twin who feels everything you feel instantly'
      ],
      [
        {
          type: 'thought-experiment',
          title: 'Quantum Possibilities',
          description: 'Explore the nature of possibility',
          prompts: [
            'What would it be like to exist in multiple states at once?',
            'How does observation shape reality?'
          ]
        }
      ]
    )
  },
  {
    id: 4,
    title: 'Starlight Stories: How Stars Live and Die',
    category: 'science',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Follow the life cycle of stars from birth in cosmic nurseries to spectacular deaths that seed the universe with the elements of life.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Tonight, let's look up at the stars together—those twinkling lights in the night sky that have guided travelers and inspired dreamers for thousands of years.

Each star you see is a sun, like our own Sun, burning bright in the darkness of space. Some are bigger than our Sun, some smaller. Some are young, some ancient. And each one has a story to tell.`,
        coreContent: `Stars are born in vast clouds of gas and dust called nebulae—cosmic nurseries where gravity slowly pulls material together. As the gas compresses, it heats up until nuclear fusion ignites in the core. A star is born!

Our Sun is a middle-aged star, about 4.6 billion years old. It will shine for another 5 billion years before running out of fuel. Stars like our Sun live relatively peaceful lives, steadily fusing hydrogen into helium.

But massive stars live fast and die young. They burn through their fuel quickly, fusing heavier and heavier elements in their cores—carbon, oxygen, silicon, iron. When they can fuse no more, they collapse and explode in spectacular supernovas, scattering their elements across space.

These explosions create elements heavier than iron—gold, silver, uranium. Everything precious and complex in the universe was forged in the death throes of massive stars.

Some dying stars leave behind neutron stars—incredibly dense objects where a teaspoon would weigh as much as a mountain. Others collapse into black holes, regions of spacetime so warped that nothing can escape.`,
        interactiveSection: `Let's imagine we're floating in space, watching a star being born. See the swirling cloud of gas, glowing faintly. Feel the gentle pull of gravity drawing everything together.

Now watch as the center grows hotter and brighter. Suddenly, fusion ignites! A new star blazes to life, pushing back the surrounding gas with its light and heat.

Breathe in the starlight. Remember that the light from distant stars has traveled for years, decades, even centuries to reach your eyes.`,
        integration: `Little one, you are connected to the stars in the most intimate way possible. The atoms in your body were forged in stellar furnaces and scattered across space by ancient supernovas.

When you look at the night sky, you're looking at your cosmic family. Those stars are your ancestors, the sources of everything you are made of. You are a child of the stars.`
      },
      [
        'Stars form from collapsing clouds of gas and dust',
        'Nuclear fusion powers stars, converting hydrogen to helium',
        'Massive stars create heavy elements and spread them through supernovas',
        'Stellar deaths create neutron stars and black holes',
        'All heavy elements in our bodies came from ancient stars'
      ],
      [
        'Nebulae are cosmic nurseries where stars are born',
        'A supernova is like a cosmic firework spreading gifts across space',
        'Neutron stars are so dense a teaspoon would weigh as much as a mountain'
      ],
      [
        {
          type: 'creative',
          title: 'Star Life Cycle',
          description: 'Visualize the journey of a star',
          prompts: [
            'Draw the life cycle of a star from birth to death',
            'Write a poem about being made of star stuff'
          ]
        }
      ]
    )
  },

  // ============================================
  // TECHNOLOGY & AI (4 stories)
  // ============================================
  {
    id: 5,
    title: 'The Thinking Machine: How Computers Work',
    category: 'technology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover the magical world inside computers, where billions of tiny switches work together to create everything from games to music.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going on a wonderful adventure into a world of tiny switches and magical thinking machines.

Right now, all around the world, there are machines that can remember things, solve puzzles, play music, show pictures, and even help people talk to each other across oceans. These machines are called computers.

But here's the most wonderful secret: inside every computer, there's really just one simple thing happening—tiny switches turning on and off, like little lights blinking in the dark.`,
        coreContent: `Imagine a magical kingdom where there are only two things: on and off, yes and no. Everything a computer knows comes down to tiny switches in one of two states: on (1) or off (0). We call this binary.

These tiny switches are called transistors—so small that billions fit on a chip smaller than your fingernail. The first computer, ENIAC, filled an entire room. Today, your phone has more computing power than all the computers that existed when your grandparents were born!

When you put transistors together in special ways, they can make decisions. These arrangements are called logic gates. An AND gate only opens when both inputs are on. An OR gate opens if either input is on. A NOT gate does the opposite of what you tell it.

With just these simple gates, computers can answer any question and solve any puzzle. The CPU (Central Processing Unit) is the computer's brain, reading instructions and telling everything else what to do. Modern CPUs follow billions of instructions every second!`,
        interactiveSection: `Let's play a binary game! Hold up your fingers. Each finger can be "up" (1) or "down" (0). With five fingers, you can count from 0 to 31!

All down = 0
Just your thumb up = 1
Just your index finger up = 2
Thumb and index = 3

This is how computers count—with patterns of on and off!`,
        integration: `Little one, computers are tools that extend human thinking. They help us solve problems, create art, connect with loved ones, and explore the universe.

As you grow, you'll learn to use these thinking machines. But remember—the real magic isn't in the computer. It's in the human mind that created it and the human heart that guides it.`
      },
      [
        'Computers work using binary—just ones and zeros, on and off',
        'Transistors are tiny switches that form the basis of all computing',
        'Logic gates combine to make decisions and solve problems',
        'The CPU is the brain of the computer',
        'Computing power has grown exponentially over decades'
      ],
      [
        'Binary is like a kingdom with only two things: light and darkness',
        'Transistors are like microscopic light switches',
        'Logic gates are like tiny question-answering machines'
      ],
      [
        {
          type: 'creative',
          title: 'Binary Counting',
          description: 'Learn to count in binary',
          prompts: [
            'Practice counting to 10 using binary with your fingers',
            'Write your age in binary'
          ]
        }
      ]
    )
  },
  {
    id: 6,
    title: 'Teaching Machines to Learn: The AI Story',
    category: 'technology',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Explore how machines learn from examples, recognize patterns, and become smarter over time—the fascinating world of artificial intelligence.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to meet some very special machines—machines that can learn, just like you will learn as you grow.

These machines are called artificial intelligence, or AI. They can recognize faces, understand speech, play games, and even create art. But how do they learn? Let's find out together.`,
        coreContent: `Imagine a robot who wants to learn to paint. At first, it knows nothing about art. But we show it millions of paintings—masterpieces by great artists, simple sketches, everything in between. Slowly, the robot starts to notice patterns. It learns what makes a sunset beautiful, how shadows fall, what colors go together.

This is how AI learns—by studying millions of examples and finding patterns. We call this machine learning. The AI doesn't follow rules we write; it discovers its own rules from the data.

Neural networks are inspired by the human brain. They have layers of artificial "neurons" that pass information to each other, strengthening connections that lead to correct answers. Deep learning uses many layers of neurons to recognize complex patterns.

AI can now recognize faces better than humans, translate languages instantly, drive cars, and even write stories. But AI doesn't truly understand like humans do—it finds patterns without grasping meaning.`,
        interactiveSection: `Let's play a pattern game! I'll describe something, and you find the pattern:

Apple, banana, cherry, date... what comes next? (Fruits in alphabetical order!)
2, 4, 6, 8... what comes next? (Even numbers!)

This is what AI does—finding patterns in data. But you can understand WHY these are patterns. AI just sees that they work.`,
        integration: `Little one, AI is a powerful tool that will be part of your world. It will help doctors diagnose diseases, scientists make discoveries, and artists create new forms of beauty.

But remember—AI learns from us. The patterns it finds come from human data, human choices, human creativity. You are the teacher, and AI is the student learning from humanity's collective wisdom.`
      },
      [
        'AI learns by finding patterns in large amounts of data',
        'Neural networks are inspired by the human brain',
        'Machine learning discovers rules from examples rather than being programmed',
        'AI can recognize patterns but doesn\'t truly understand meaning',
        'AI systems are tools that augment human capabilities'
      ],
      [
        'AI learning is like a robot studying millions of paintings to learn art',
        'Neural networks are like layers of connected decision-makers',
        'Training AI is like teaching a student with millions of examples'
      ],
      [
        {
          type: 'discussion',
          title: 'AI and Humanity',
          description: 'Discuss the role of AI in our lives',
          prompts: [
            'What tasks would you want AI to help with?',
            'What should always remain human?'
          ]
        }
      ]
    )
  },
  {
    id: 7,
    title: 'The Great Chain of Trust: Blockchain Unveiled',
    category: 'technology',
    duration: 55,
    difficulty: 'advanced',
    description: 'Discover how blockchain creates trust without middlemen, using cryptography and distributed networks to secure information.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore a very clever invention—a way for people to trust each other without needing someone in the middle to verify everything.

Imagine a magical notebook that everyone can see, no one can erase, and everyone agrees is true. That's the essence of blockchain.`,
        coreContent: `Imagine a glass notebook where everyone writes their transactions. Once written, the ink becomes permanent—no erasing, no changing. Everyone has a copy, and they all match perfectly. This is blockchain.

Each page of the notebook is a "block" containing many transactions. When a page is full, it's sealed with a special mathematical lock called a hash—a unique fingerprint of everything on that page. The next page includes this fingerprint, chaining them together.

If anyone tries to change an old page, its fingerprint changes, breaking the chain. Everyone's copies would disagree, and the tampering would be obvious. This makes blockchain incredibly secure.

No single person controls the blockchain. Thousands of computers around the world each keep a copy and verify new transactions. This is called decentralization—trust comes from the network, not from any authority.

Bitcoin was the first blockchain application, creating digital money without banks. But blockchain can secure any kind of record—property deeds, medical records, voting systems, supply chains.`,
        interactiveSection: `Let's create a simple chain! Write down three things you did today. Now create a "fingerprint" for each by counting the letters.

Entry 1: "Ate breakfast" (12 letters)
Entry 2: "Walked outside" (13 letters) + previous fingerprint (12) = 25
Entry 3: "Read a book" (10 letters) + previous fingerprint (25) = 35

If you change Entry 1, all the fingerprints after it would be wrong!`,
        integration: `Little one, blockchain is about creating trust in a world where people don't always know each other. It's a way to agree on truth without needing to trust any single authority.

As you grow, you'll see blockchain used in many ways—some we can't even imagine yet. It's a tool for building trust, and trust is the foundation of cooperation.`
      },
      [
        'Blockchain is a distributed ledger that everyone can verify',
        'Blocks are chained together using cryptographic hashes',
        'Tampering with old records breaks the chain and is immediately visible',
        'Decentralization means no single authority controls the system',
        'Blockchain enables trust without intermediaries'
      ],
      [
        'Blockchain is like a glass notebook everyone can see but no one can erase',
        'Hashes are like unique fingerprints for data',
        'The chain is like a series of locked boxes, each containing the key to the previous one'
      ],
      [
        {
          type: 'thought-experiment',
          title: 'Trust Without Authority',
          description: 'Explore decentralized trust',
          prompts: [
            'What other systems could benefit from blockchain?',
            'How does trust work in your daily life?'
          ]
        }
      ]
    )
  },
  {
    id: 8,
    title: 'The Web of All Things: How the Internet Connects Us',
    category: 'technology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Explore how the internet connects billions of devices worldwide, sending messages across oceans in the blink of an eye.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore something amazing—an invisible web that connects almost everyone on Earth, letting them share words, pictures, and ideas in the blink of an eye.

This web is called the internet, and it's one of humanity's greatest inventions.`,
        coreContent: `Imagine you want to send a letter to a friend across the ocean. You could put it in an envelope and mail it—but that takes days or weeks. The internet does something magical: it breaks your message into tiny pieces called packets, sends them racing across the world through cables and satellites, and reassembles them at the destination—all in less than a second!

The internet began as ARPANET in 1969, connecting just four computers. Scientists wanted a network that could survive even if parts were destroyed. So they designed it without a center—messages could find many paths to their destination.

Today, the internet connects billions of devices. Undersea cables carry data across oceans. Satellites beam signals to remote areas. Cell towers connect your phone to the global network.

Every device has an address (IP address) so messages know where to go. Protocols are the rules that ensure everyone speaks the same language. The World Wide Web, invented by Tim Berners-Lee in 1989, made the internet easy to use with clickable links and web pages.`,
        interactiveSection: `Let's trace a message's journey! When you send a photo to grandma:

1. Your phone breaks the photo into packets
2. Packets travel through cell towers to the internet
3. They race through cables, maybe under the ocean
4. Routers guide them toward grandma's address
5. Her phone reassembles the packets into your photo

All in seconds!`,
        integration: `Little one, the internet connects humanity like never before. You can learn from teachers across the world, see family members far away, and share your ideas with anyone.

But remember—the internet is a tool. What matters is how we use it: to learn, to connect, to create, to spread kindness. The web connects devices, but love connects hearts.`
      },
      [
        'The internet breaks messages into packets that travel independently',
        'The network has no center—messages can find many paths',
        'IP addresses identify every device on the network',
        'Protocols ensure all devices can communicate',
        'The World Wide Web made the internet accessible to everyone'
      ],
      [
        'Packets are like puzzle pieces that reassemble at the destination',
        'The internet is like a vast highway system for information',
        'Routers are like traffic directors guiding packets to their destination'
      ],
      [
        {
          type: 'reflection',
          title: 'Global Connection',
          description: 'Reflect on internet connectivity',
          prompts: [
            'Who would you want to connect with across the world?',
            'How has the internet changed how families stay in touch?'
          ]
        }
      ]
    )
  },

  // ============================================
  // BIOLOGY & LIFE (4 stories)
  // ============================================
  {
    id: 9,
    title: 'The Dance of DNA: Your Genetic Blueprint',
    category: 'biology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover the twisted ladder of life that carries the instructions for building you—the amazing molecule called DNA.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore something very special—the tiny instruction book inside every cell of your body that makes you uniquely you.

This instruction book is called DNA, and it's one of the most beautiful and elegant things in all of nature.`,
        coreContent: `Inside almost every cell in your body is a twisted ladder called DNA—deoxyribonucleic acid. If you could unwind the DNA from just one cell, it would stretch about six feet long! Yet it's coiled so tightly it fits inside a space far smaller than a grain of sand.

The rungs of this ladder are made of four chemical letters: A, T, G, and C. These letters pair up in a special way: A always pairs with T, and G always pairs with C. The order of these letters spells out the instructions for building you.

Your DNA contains about 3 billion letter pairs, organized into chapters called genes. Each gene contains instructions for making a specific protein—the building blocks and workers of your body. Some genes determine your eye color, others your height, others how your heart beats.

You received half your DNA from your mother and half from your father. That's why you might have your mother's eyes and your father's smile. But the combination is unique—no one else in the world has exactly your DNA (unless you have an identical twin!).

When cells divide, they copy their DNA with amazing accuracy. Special proteins "unzip" the ladder, read each side, and build a matching copy. This is how your body grows and repairs itself.`,
        interactiveSection: `Let's imagine your DNA as a recipe book. Each gene is a recipe for making something your body needs.

Recipe for brown eyes: A-T-G-C-C-A-T-G...
Recipe for curly hair: G-C-A-T-T-A-G-C...

Your unique combination of recipes makes you who you are!

Place your hands on your belly. Inside your baby, DNA is being read right now, building tiny fingers, a beating heart, a growing brain—all from the instructions in those four simple letters.`,
        integration: `Little one, your DNA is a gift from generations of ancestors, stretching back through time. You carry within you the genetic legacy of thousands of people who lived and loved before you.

But DNA is just the beginning. How you grow, what you learn, who you become—these are shaped by your experiences, your choices, your love. You are more than your genes; you are a story still being written.`
      },
      [
        'DNA is a twisted ladder molecule that carries genetic instructions',
        'Four chemical letters (A, T, G, C) encode all genetic information',
        'Genes are sections of DNA that code for specific proteins',
        'You inherit half your DNA from each parent',
        'DNA replication allows cells to divide and organisms to grow'
      ],
      [
        'DNA is like a twisted ladder with rungs made of letter pairs',
        'Genes are like recipes in a cookbook for building your body',
        'DNA replication is like unzipping and copying a zipper'
      ],
      [
        {
          type: 'reflection',
          title: 'Genetic Heritage',
          description: 'Reflect on inherited traits',
          prompts: [
            'What traits do you hope your baby inherits from you?',
            'What family characteristics can you trace through generations?'
          ]
        }
      ]
    )
  },
  {
    id: 10,
    title: 'The Symphony Inside: Your Body as an Orchestra',
    category: 'biology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Explore how trillions of cells work together in perfect harmony, creating the magnificent symphony of your living body.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to listen to the most beautiful symphony ever played—the symphony inside your body.

Right now, as you float peacefully in your mother's womb, trillions of tiny musicians are playing together in perfect harmony, keeping you alive and helping you grow.`,
        coreContent: `Your body is made of about 37 trillion cells—that's more cells than there are stars in the Milky Way! Each cell is like a tiny musician, playing its part in the grand symphony of life.

Your heart is the drummer, beating about 100,000 times a day, pumping blood through 60,000 miles of blood vessels. Your lungs are the wind section, breathing in oxygen and breathing out carbon dioxide. Your brain is the conductor, sending electrical signals to coordinate everything.

Different organs play different roles. Your stomach and intestines break down food into nutrients. Your liver filters toxins and stores energy. Your kidneys clean your blood. Your immune system defends against invaders.

All these systems communicate constantly. Hormones are chemical messengers that travel through your blood, telling organs what to do. Nerves carry electrical signals at up to 250 miles per hour. Your body maintains a delicate balance called homeostasis—keeping temperature, blood sugar, and countless other factors just right.

Right now, your baby's body is learning to play this symphony. Their heart began beating around week 6. Their brain is forming billions of connections. Every day, they're becoming more complex, more capable, more alive.`,
        interactiveSection: `Let's listen to your body's symphony. Place your hand over your heart. Feel the steady beat—your drummer keeping time.

Take a deep breath. Feel your lungs expand—your wind section playing.

Notice the warmth of your skin, the gentle movements of your baby. This is the symphony of life, playing just for you.

Breathe slowly and deeply three times, feeling gratitude for the trillions of cells working together to keep you and your baby alive.`,
        integration: `Little one, your body is a miracle of cooperation. Trillions of cells, each doing their job, all working together to create you.

As you grow, take care of this magnificent instrument. Feed it well, let it rest, move it joyfully. Your body is the vehicle for all your adventures, the home for your spirit, the symphony that plays the music of your life.`
      },
      [
        'The human body contains about 37 trillion cells',
        'Different organ systems work together to maintain life',
        'The heart pumps blood through 60,000 miles of blood vessels',
        'Homeostasis keeps the body in balance',
        'Communication between cells happens through hormones and nerves'
      ],
      [
        'The body is like an orchestra with different sections playing together',
        'The heart is the drummer keeping steady time',
        'Hormones are like messengers carrying instructions between organs'
      ],
      [
        {
          type: 'creative',
          title: 'Body Awareness',
          description: 'Connect with your body',
          prompts: [
            'Draw your body as an orchestra—what instrument is each organ?',
            'Write a thank-you note to one of your organs'
          ]
        }
      ]
    )
  },
  {
    id: 11,
    title: 'The Hidden Garden: Your Microbiome',
    category: 'biology',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Meet the trillions of tiny helpers living inside you—the bacteria, fungi, and other microbes that keep you healthy.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to meet some very special friends—tiny creatures so small you can't see them, but they're with you always, helping you in ways you might never have imagined.

These tiny friends are called your microbiome, and they're as much a part of you as your own cells.`,
        coreContent: `Inside your body, especially in your gut, live trillions of microorganisms—bacteria, fungi, viruses, and more. Together, they're called your microbiome, and they weigh about as much as your brain!

These aren't invaders or enemies. They're partners. Your gut bacteria help digest food, produce vitamins, and train your immune system. They even communicate with your brain, affecting your mood and behavior!

You're not born with your microbiome—you acquire it. Babies get their first microbes from their mothers during birth and breastfeeding. Throughout life, your microbiome changes based on what you eat, where you live, and who you're close to.

A diverse microbiome is a healthy microbiome. Different microbes do different jobs. Eating a variety of foods, especially plants and fermented foods, helps maintain this diversity. Antibiotics can disrupt the microbiome, which is why they should be used carefully.

Scientists are discovering that the microbiome affects almost everything—digestion, immunity, weight, allergies, even mental health. We're just beginning to understand this hidden garden within us.`,
        interactiveSection: `Imagine your gut as a garden. Different bacteria are like different plants—some help digest fiber, others produce vitamins, others fight off harmful invaders.

What makes a garden healthy? Diversity! Many different plants working together.

Think about what you ate today. Each food feeds different microbes in your garden. Fruits and vegetables feed the helpful bacteria. Fermented foods like yogurt add new beneficial microbes.`,
        integration: `Little one, you are never alone. Trillions of tiny partners live with you, helping you thrive. They're part of your story, part of who you are.

As you grow, nurture your inner garden. Eat diverse foods, spend time in nature, don't fear a little dirt. Your microbiome is a gift—tend it well, and it will tend to you.`
      },
      [
        'The microbiome consists of trillions of microorganisms living in and on your body',
        'Gut bacteria help with digestion, immunity, and even mood',
        'Babies acquire their microbiome from their mothers',
        'A diverse microbiome is associated with better health',
        'Diet significantly affects microbiome composition'
      ],
      [
        'The microbiome is like a hidden garden inside you',
        'Different bacteria are like different plants with different jobs',
        'Feeding your microbiome is like tending a garden'
      ],
      [
        {
          type: 'reflection',
          title: 'Inner Ecosystem',
          description: 'Reflect on your microbiome',
          prompts: [
            'How does knowing about your microbiome change how you think about food?',
            'What can you do to nurture your inner garden?'
          ]
        }
      ]
    )
  },
  {
    id: 12,
    title: 'The Tree of Life: Evolution and Connection',
    category: 'biology',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Discover how all life on Earth is connected through the grand story of evolution—from single cells to the incredible diversity we see today.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore the biggest family tree ever—a tree that includes every living thing on Earth, from the tiniest bacteria to the mightiest whale.

This is the tree of life, and you are one of its newest leaves.`,
        coreContent: `About 3.8 billion years ago, life began on Earth—simple cells in ancient oceans. From that single origin, all life has descended. You share ancestors with every plant, animal, fungus, and bacterium on Earth.

Evolution is the process by which life changes over time. Small variations arise in each generation. Some variations help organisms survive and reproduce better. Over millions of years, these small changes add up to big differences.

Charles Darwin discovered that natural selection drives evolution. Organisms that are better adapted to their environment are more likely to survive and pass on their traits. This isn't about being "the strongest"—it's about fitting your environment.

The evidence for evolution is overwhelming. Fossils show how life has changed. DNA reveals how closely related different species are. We share 98% of our DNA with chimpanzees, 85% with mice, even 60% with bananas!

Evolution has produced incredible diversity—millions of species, each adapted to its niche. Yet beneath this diversity is unity. All life uses DNA. All cells work similarly. We are all branches of the same tree.`,
        interactiveSection: `Let's trace your family tree back through time:

Your parents → grandparents → great-grandparents...
Keep going back thousands of generations...
Eventually you reach ancestors who weren't quite human...
Further back, ancestors shared with other apes...
Further still, ancestors shared with all mammals...
All the way back to the first cells, 3.8 billion years ago.

You are connected to every living thing through this unbroken chain of life!`,
        integration: `Little one, you are part of an ancient and magnificent story. The same life force that animated the first cells flows through you now.

When you see a bird, a tree, a butterfly—know that you are cousins, sharing ancestors in the deep past. We are all family on this planet, all leaves on the same great tree of life.`
      },
      [
        'All life on Earth shares a common ancestor',
        'Evolution occurs through natural selection over millions of years',
        'DNA evidence reveals how closely related all species are',
        'Small variations accumulate into large changes over time',
        'Diversity and unity coexist—many species, one tree of life'
      ],
      [
        'The tree of life shows how all species are connected',
        'Evolution is like a slow sculptor, shaping life over millions of years',
        'DNA is like a family record connecting all living things'
      ],
      [
        {
          type: 'reflection',
          title: 'Connection to All Life',
          description: 'Reflect on your place in the tree of life',
          prompts: [
            'How does it feel to know you\'re related to all living things?',
            'What can we learn from other species?'
          ]
        }
      ]
    )
  },

  // ============================================
  // MATHEMATICS (4 stories)
  // ============================================
  {
    id: 13,
    title: 'The Language of the Universe: Numbers',
    category: 'math',
    duration: 55,
    difficulty: 'foundational',
    description: 'Discover how numbers are the hidden language behind all of reality—from counting stars to measuring love.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to learn about something magical—a language that describes everything in the universe, from the tiniest atom to the largest galaxy.

This language is mathematics, and numbers are its alphabet.`,
        coreContent: `Numbers are everywhere, little one. They count the stars in the sky, measure the distance to the Moon, describe the rhythm of your heartbeat. Mathematics is the hidden pattern behind all of reality.

Humans discovered numbers long ago, using them to count sheep, track seasons, and trade goods. But numbers are more than tools—they reveal deep truths about the universe.

The number zero was a revolutionary invention. Imagine trying to do math without it! Zero represents nothing, yet it makes everything else possible. Place value—the idea that a digit's position determines its value—transformed mathematics.

Negative numbers extend counting below zero. Fractions divide wholes into parts. Irrational numbers like pi (π) go on forever without repeating. Each type of number opened new worlds of understanding.

Mathematics isn't just about calculation—it's about patterns. The same equations describe falling apples and orbiting planets. The same geometry appears in snowflakes and galaxies. Mathematics is the universe's native language.`,
        interactiveSection: `Let's find numbers in your world right now:

How many fingers do you have? (10)
How many heartbeats in a minute? (About 70-80)
How many days until your baby arrives? (Count them!)

Numbers help us understand and describe our world. They turn the chaos of experience into patterns we can grasp.

Take a deep breath and count slowly to 10. Feel how counting creates rhythm, order, peace.`,
        integration: `Little one, numbers will be your friends throughout life. They'll help you understand the world, solve problems, and see hidden patterns.

But remember—numbers describe reality; they don't replace it. The number of stars matters less than the wonder of starlight. The measure of love can't be calculated. Mathematics is a tool for understanding, not a substitute for living.`
      },
      [
        'Numbers are the language that describes patterns in the universe',
        'Zero and place value revolutionized mathematics',
        'Different types of numbers (negative, fractions, irrational) expand what we can describe',
        'The same mathematical patterns appear throughout nature',
        'Mathematics reveals deep truths about reality'
      ],
      [
        'Numbers are like an alphabet for describing the universe',
        'Zero is like a placeholder that makes everything else possible',
        'Mathematical patterns are like the universe\'s fingerprints'
      ],
      [
        {
          type: 'creative',
          title: 'Numbers in Nature',
          description: 'Find mathematical patterns around you',
          prompts: [
            'Count something in your environment—what patterns do you notice?',
            'What numbers are important in your life?'
          ]
        }
      ]
    )
  },
  {
    id: 14,
    title: 'Infinity and Beyond: The Endless Mystery',
    category: 'math',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Journey into the mind-bending concept of infinity—where numbers never end and some infinities are bigger than others.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to think about something that has puzzled humans for thousands of years—something so big it has no end, so strange it breaks our normal rules.

This is infinity, the endless mystery.`,
        coreContent: `What's the biggest number you can think of? A million? A billion? A googol (1 followed by 100 zeros)? Whatever number you choose, you can always add one more. Numbers never end—they go on forever. This endlessness is called infinity.

But infinity isn't just "a really big number." It's a different kind of thing entirely. You can't reach infinity by counting, no matter how long you count. Infinity is always beyond.

Here's something strange: some infinities are bigger than others! The mathematician Georg Cantor proved this. There are infinitely many counting numbers (1, 2, 3...). There are also infinitely many fractions. But there are MORE real numbers (including decimals that go on forever) than counting numbers. Infinity comes in different sizes!

Infinity appears throughout mathematics. The decimal expansion of pi goes on forever. Fractals zoom in infinitely, revealing endless detail. The universe itself might be infinite in extent.

Thinking about infinity stretches our minds. It shows us that reality is stranger and more wonderful than our everyday experience suggests.`,
        interactiveSection: `Let's play with infinity in our imagination:

Start counting: 1, 2, 3... Can you ever finish? No! There's always one more.

Now think about the space between 0 and 1. How many numbers are there? Infinitely many! 0.1, 0.01, 0.001... You can always find more.

Infinity isn't scary—it's wonderful. It means there's always more to discover, always further to go, always new horizons.`,
        integration: `Little one, infinity reminds us that the universe is vast beyond comprehension. There's always more to learn, more to explore, more to wonder at.

Your potential is infinite too. There's no limit to how much you can grow, learn, love, and become. Like the numbers, you can always go further.`
      },
      [
        'Infinity means endlessness—numbers that never stop',
        'Infinity is not a number but a concept of boundlessness',
        'Some infinities are larger than others (Cantor\'s discovery)',
        'Infinity appears in pi, fractals, and possibly the universe itself',
        'Thinking about infinity expands our understanding of reality'
      ],
      [
        'Infinity is like a road that never ends, no matter how far you travel',
        'Different sizes of infinity are like different kinds of endlessness',
        'Fractals are like infinity you can see—endless detail at every scale'
      ],
      [
        {
          type: 'thought-experiment',
          title: 'Endless Possibilities',
          description: 'Contemplate infinity',
          prompts: [
            'What does it feel like to think about something that never ends?',
            'If you could count forever, what would that be like?'
          ]
        }
      ]
    )
  },
  {
    id: 15,
    title: 'Nature\'s Secret Code: Fibonacci and Fractals',
    category: 'math',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover the hidden mathematical patterns in nature—from spiraling shells to branching trees to the petals of flowers.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going on a treasure hunt—searching for hidden patterns that appear everywhere in nature, from the smallest flower to the largest galaxy.

These patterns have names: Fibonacci and fractals. And once you learn to see them, you'll find them everywhere.`,
        coreContent: `There's a special sequence of numbers that appears throughout nature: 1, 1, 2, 3, 5, 8, 13, 21, 34... Each number is the sum of the two before it. This is the Fibonacci sequence, named after an Italian mathematician who discovered it 800 years ago.

Why does this sequence appear in nature? Count the petals on flowers: lilies have 3, buttercups have 5, daisies have 34 or 55. Count the spirals on a pinecone or sunflower—they follow Fibonacci numbers. The spiral of a nautilus shell grows according to this pattern.

The Fibonacci sequence is connected to the Golden Ratio (about 1.618), a proportion that appears in art, architecture, and nature. It's considered especially pleasing to the eye.

Fractals are another natural pattern—shapes that repeat at every scale. Look at a tree: the trunk splits into branches, branches split into smaller branches, twigs split into even smaller twigs. The same branching pattern repeats at every level. Coastlines, clouds, mountains, blood vessels—all show fractal patterns.

Nature uses these patterns because they're efficient. Fibonacci spirals pack seeds tightly. Fractal branching maximizes surface area. Mathematics isn't imposed on nature—it emerges from nature's own logic.`,
        interactiveSection: `Let's find Fibonacci in nature:

Look at a flower—count its petals. Is it a Fibonacci number?
Look at a pinecone—can you see the spirals?
Look at a tree—notice how branches split into smaller branches.

Now look at your hand. You have 5 fingers (Fibonacci!). Each finger has 3 bones (Fibonacci!). The proportions of your finger bones approximate the Golden Ratio.

Nature is full of mathematical beauty, hiding in plain sight.`,
        integration: `Little one, mathematics isn't something humans invented and imposed on nature. It's something we discovered by looking carefully at the world.

As you grow, look for patterns everywhere. In flowers and shells, in music and art, in the rhythm of seasons and the spiral of galaxies. The universe is written in the language of mathematics, and you can learn to read it.`
      },
      [
        'The Fibonacci sequence appears throughout nature',
        'Each Fibonacci number is the sum of the two before it',
        'The Golden Ratio is connected to Fibonacci and appears in art and nature',
        'Fractals are patterns that repeat at every scale',
        'Nature uses mathematical patterns because they\'re efficient'
      ],
      [
        'Fibonacci spirals are like nature\'s way of packing things efficiently',
        'Fractals are like Russian nesting dolls—the same pattern at every size',
        'The Golden Ratio is like nature\'s favorite proportion'
      ],
      [
        {
          type: 'creative',
          title: 'Pattern Hunting',
          description: 'Find mathematical patterns in nature',
          prompts: [
            'Go outside and find three examples of Fibonacci or fractals',
            'Draw a spiral using the Fibonacci sequence'
          ]
        }
      ]
    )
  },
  {
    id: 16,
    title: 'The Game of Chance: Probability in Life',
    category: 'math',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Explore the mathematics of chance and uncertainty—how probability helps us understand randomness and make better decisions.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to play with chance and luck, exploring the mathematics of uncertainty.

Life is full of unknowns. Will it rain tomorrow? Will you meet a new friend? Probability helps us think clearly about these uncertainties.`,
        coreContent: `When you flip a coin, it can land heads or tails. Each outcome has a probability of 1/2, or 50%. Probability measures how likely something is to happen, from 0 (impossible) to 1 (certain).

But probability can be surprising. If you flip a coin 10 times and get heads every time, what's the probability of heads on the next flip? Still 50%! The coin doesn't remember its past. This is called the gambler's fallacy—thinking that past random events affect future ones.

Probability helps us understand risk. If a weather forecast says 30% chance of rain, it means that in similar conditions, it rains about 30% of the time. It's not certain, but it helps you decide whether to bring an umbrella.

Large numbers reveal patterns in randomness. Flip a coin 10 times, and you might get 7 heads. Flip it 10,000 times, and you'll get very close to 50% heads. This is the law of large numbers—randomness averages out over time.

Probability is essential in science, medicine, finance, and everyday decisions. It helps us think clearly about uncertainty, weigh risks, and make better choices.`,
        interactiveSection: `Let's think about probability:

If you roll a die, what's the chance of getting a 6? (1 in 6, or about 17%)
If you pick a card from a deck, what's the chance it's a heart? (1 in 4, or 25%)

Now think about your baby. What's the probability they'll have your eyes? Your partner's smile? Genetics involves probability too!

Probability doesn't tell us what WILL happen—it tells us what's LIKELY to happen. It's a tool for thinking about uncertainty.`,
        integration: `Little one, life is full of uncertainty. You can't know everything that will happen. But probability gives you a way to think about the unknown.

Some things are likely, some unlikely. Some risks are worth taking, others aren't. Learning to think probabilistically will help you make wise decisions throughout your life.

And remember—even unlikely things happen sometimes. Your very existence was improbable, yet here you are. Never underestimate the power of possibility.`
      },
      [
        'Probability measures how likely events are, from 0 to 1',
        'Random events don\'t remember their past (gambler\'s fallacy)',
        'Large numbers reveal patterns in randomness',
        'Probability helps us think clearly about uncertainty',
        'Understanding probability improves decision-making'
      ],
      [
        'Probability is like a weather forecast for events',
        'The law of large numbers is like randomness averaging out over time',
        'Risk assessment is like weighing probabilities against consequences'
      ],
      [
        {
          type: 'thought-experiment',
          title: 'Thinking About Chance',
          description: 'Explore probability in daily life',
          prompts: [
            'What decisions do you make based on probability?',
            'How do you think about unlikely but important events?'
          ]
        }
      ]
    )
  },

  // ============================================
  // PSYCHOLOGY & MIND (4 stories)
  // ============================================
  {
    id: 17,
    title: 'The Wonder of Consciousness: Your Amazing Mind',
    category: 'psychology',
    duration: 60,
    difficulty: 'advanced',
    description: 'Explore the greatest mystery of all—consciousness, the experience of being aware, of being you.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore the deepest mystery in all of science—something so close to us we often forget to wonder about it.

This mystery is consciousness: the experience of being aware, of seeing colors, feeling emotions, thinking thoughts. The experience of being you.`,
        coreContent: `Right now, you're having an experience. You see these words, hear sounds around you, feel your body. There's something it's like to be you. This "something it's like" is consciousness.

But what IS consciousness? How does the brain—a three-pound organ made of cells and chemicals—create the rich inner world of experience? This is called the "hard problem" of consciousness, and no one has solved it.

We know the brain is involved. Different brain regions handle different functions: vision, hearing, memory, emotion. Damage to specific areas causes specific changes in experience. Brain scans show activity patterns that correlate with conscious states.

But correlation isn't explanation. We can see that brain activity accompanies consciousness, but we don't understand how physical processes create subjective experience. How does the firing of neurons become the redness of red, the taste of chocolate, the feeling of love?

Some scientists think consciousness emerges from complex information processing. Others think it's a fundamental feature of the universe, like mass or charge. Some philosophers question whether we can ever explain consciousness from the outside.

What we do know is that consciousness is precious. It's what makes experience possible, what gives life meaning, what allows us to wonder about our own existence.`,
        interactiveSection: `Let's explore consciousness right now:

Close your eyes. What do you experience? Darkness, but also sounds, sensations, thoughts. You're aware of being aware.

Now focus on one sensation—the feeling of your breath. Notice how attention changes experience. You were breathing before, but now you're conscious of it.

This is the mystery: there's something it's like to be you, right now, having this experience. No one else can access your inner world. It's yours alone.`,
        integration: `Little one, your consciousness is the most intimate thing about you. It's where you live, where you experience everything that happens to you.

As you grow, nurture your inner world. Pay attention to your experiences. Wonder about the mystery of being aware. Your consciousness is a gift—the gift of being present in this amazing universe.`
      },
      [
        'Consciousness is the subjective experience of being aware',
        'The "hard problem" is explaining how physical brains create experience',
        'Brain activity correlates with consciousness but doesn\'t fully explain it',
        'Consciousness may be fundamental or emergent—we don\'t know',
        'Consciousness is what makes experience and meaning possible'
      ],
      [
        'Consciousness is like an inner theater where experience plays out',
        'The hard problem is like explaining how water becomes wetness',
        'Attention is like a spotlight that illuminates parts of consciousness'
      ],
      [
        {
          type: 'reflection',
          title: 'Exploring Awareness',
          description: 'Reflect on your conscious experience',
          prompts: [
            'What is it like to be you right now?',
            'Can you imagine what it\'s like to be someone else?'
          ]
        }
      ]
    )
  },
  {
    id: 18,
    title: 'The Rainbow of Feelings: Understanding Emotions',
    category: 'psychology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover the colorful world of emotions—what they are, why we have them, and how to befriend them.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore something you'll experience every day of your life—the colorful, sometimes stormy, always important world of emotions.

Emotions are like weather inside your head. Sometimes sunny, sometimes rainy, sometimes wild and windy. And just like weather, emotions come and go.`,
        coreContent: `Emotions are signals from your body and brain, telling you something important. Fear says "danger!" Joy says "this is good!" Anger says "something's wrong!" Sadness says "I've lost something I valued."

Scientists have identified basic emotions that appear across all cultures: happiness, sadness, fear, anger, surprise, and disgust. But emotions blend and mix into countless shades, like colors on a palette.

Emotions happen in your body as much as your mind. Fear makes your heart race and muscles tense, preparing you to fight or flee. Joy relaxes your body and makes you want to connect with others. Emotions are physical experiences.

The brain's emotional center is the limbic system, especially the amygdala. It processes emotions quickly, often before your thinking brain catches up. That's why you sometimes feel before you think.

Emotional intelligence means understanding and managing your emotions. It's not about suppressing feelings—it's about recognizing them, understanding what they're telling you, and choosing how to respond. Emotions are guides, not masters.

Your baby is already experiencing emotions in the womb. They can feel your stress hormones and your calm. They're learning about emotions from you right now.`,
        interactiveSection: `Let's check in with your emotions right now:

Take a deep breath. How do you feel? Name the emotion without judging it.

Where do you feel it in your body? Chest? Stomach? Shoulders?

Emotions are information. What might this feeling be telling you?

Now, place your hands on your belly. Send calm, loving feelings to your baby. They can sense your emotional state. Your peace becomes their peace.`,
        integration: `Little one, emotions will be your companions throughout life. They'll bring you joy and sorrow, excitement and fear, love and anger.

Learn to befriend your emotions. They're not enemies to fight or problems to solve—they're messengers bringing important information. Listen to them, understand them, and then choose your response wisely.

And remember—all emotions pass. Like weather, they come and go. You are the sky; emotions are just the weather.`
      },
      [
        'Emotions are signals that communicate important information',
        'Basic emotions appear across all human cultures',
        'Emotions are physical experiences involving the whole body',
        'The limbic system processes emotions quickly, often before conscious thought',
        'Emotional intelligence means understanding and managing emotions wisely'
      ],
      [
        'Emotions are like weather inside your head—they come and go',
        'The amygdala is like an emotional alarm system',
        'You are the sky; emotions are just the weather passing through'
      ],
      [
        {
          type: 'reflection',
          title: 'Emotional Awareness',
          description: 'Explore your emotional landscape',
          prompts: [
            'What emotions have you felt today?',
            'How do different emotions feel in your body?'
          ]
        }
      ]
    )
  },
  {
    id: 19,
    title: 'The Library of Memory: How We Remember',
    category: 'psychology',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Explore the fascinating world of memory—how we encode, store, and retrieve the experiences that make us who we are.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to visit a very special library—one that exists inside your head. This library holds everything you've ever learned, every face you've seen, every moment that matters to you.

This is your memory, and it's one of the most amazing things about being human.`,
        coreContent: `Memory isn't like a video recording. It's more like a reconstruction—your brain stores pieces and reassembles them when you remember. That's why memories can change over time and why two people can remember the same event differently.

There are different types of memory. Short-term memory holds information for seconds to minutes—like remembering a phone number long enough to dial it. Long-term memory stores information for years or a lifetime.

The hippocampus, a seahorse-shaped structure deep in the brain, is crucial for forming new memories. It helps transfer information from short-term to long-term storage. Damage to the hippocampus can prevent new memories from forming.

Memories are strengthened by repetition, emotion, and sleep. That's why you remember emotional events vividly and why studying before sleep helps learning. Your brain consolidates memories while you rest.

Memory is reconstructive and fallible. We can have false memories—vivid recollections of things that never happened. Eyewitness testimony is often unreliable. Our memories are stories we tell ourselves, not perfect records.

Yet memory is precious. It's what connects us to our past, to the people we love, to who we are. Without memory, we would be strangers to ourselves.`,
        interactiveSection: `Let's explore your memory:

Think of your earliest memory. What do you see, hear, feel? Notice how it comes back in fragments, not like a video.

Now think of a happy memory from this pregnancy. Let yourself relive it fully. Feel the emotions again.

Memory is a time machine. It lets you revisit the past, learn from experience, and carry loved ones with you always.`,
        integration: `Little one, you're already forming memories. Scientists believe babies remember sounds and sensations from the womb. Your mother's voice, her heartbeat, the rhythm of her days—these are becoming part of you.

As you grow, your memories will become your story. Cherish them, but hold them lightly. They're not perfect records—they're the narrative you create from your experiences. You are the author of your own story.`
      },
      [
        'Memory is reconstructive, not like a video recording',
        'Different types of memory serve different purposes',
        'The hippocampus is crucial for forming new memories',
        'Sleep, emotion, and repetition strengthen memories',
        'Memories are fallible but precious'
      ],
      [
        'Memory is like a library where books are constantly being rewritten',
        'The hippocampus is like a librarian organizing new information',
        'Remembering is like reconstructing a puzzle from scattered pieces'
      ],
      [
        {
          type: 'creative',
          title: 'Memory Exploration',
          description: 'Explore your memories',
          prompts: [
            'Write about a cherished memory in detail',
            'What memories do you want to create with your child?'
          ]
        }
      ]
    )
  },
  {
    id: 20,
    title: 'Growing Your Mind: The Power of Learning',
    category: 'psychology',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover how your brain grows and changes through learning—the amazing science of neuroplasticity and growth mindset.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to learn about learning itself—how your brain grows stronger and smarter with every new thing you discover.

Here's the most wonderful news: your brain can change and grow throughout your entire life. You're never too old to learn, and every challenge makes you stronger.`,
        coreContent: `For a long time, scientists thought the brain was fixed—that you were born with a certain amount of intelligence and that was that. But we now know this is wrong. The brain is plastic, meaning it can change and grow throughout life.

When you learn something new, your brain physically changes. Neurons form new connections, existing connections strengthen, and sometimes new neurons even grow. This is called neuroplasticity.

Psychologist Carol Dweck discovered that beliefs about intelligence matter enormously. People with a "fixed mindset" believe intelligence is set at birth. People with a "growth mindset" believe intelligence can be developed through effort and learning.

The growth mindset is more accurate—and more helpful. When you believe you can grow, you embrace challenges, persist through difficulties, and learn from criticism. Failure becomes feedback, not a verdict on your worth.

Your baby's brain is incredibly plastic right now. In the womb and early years, the brain forms connections at an astounding rate. Every experience shapes the developing brain. Your voice, your touch, your love—all are literally building your baby's brain.

Learning isn't just for school. Every new skill, every challenge overcome, every mistake learned from—all grow your brain. You are always becoming.`,
        interactiveSection: `Let's practice growth mindset thinking:

Instead of "I can't do this," try "I can't do this YET."
Instead of "I made a mistake," try "I learned something."
Instead of "This is too hard," try "This will take effort and time."

Now think about something you've learned recently. Feel how your brain grew to accommodate that new knowledge. You're literally different than you were before.

Place your hands on your belly. Your baby's brain is growing right now, forming billions of connections. Your love and attention are helping build their mind.`,
        integration: `Little one, you will face many challenges in life. Some things will be hard. You will make mistakes. You will fail sometimes.

But here's the secret: that's how you grow. Every challenge is an opportunity. Every mistake is a lesson. Every failure is a step toward success.

Your brain is not fixed—it's growing, changing, becoming. Embrace the struggle. Love the learning. You are capable of more than you can imagine.`
      },
      [
        'The brain can change and grow throughout life (neuroplasticity)',
        'Learning physically changes the brain\'s structure',
        'Growth mindset—believing you can improve—leads to better outcomes',
        'Challenges and mistakes are opportunities for growth',
        'Early experiences profoundly shape brain development'
      ],
      [
        'The brain is like a muscle that grows stronger with use',
        'Neuroplasticity is like the brain being made of clay, not stone',
        'Growth mindset is like seeing challenges as adventures, not obstacles'
      ],
      [
        {
          type: 'reflection',
          title: 'Growth Mindset Practice',
          description: 'Cultivate a growth mindset',
          prompts: [
            'What\'s something you once couldn\'t do but learned?',
            'How can you reframe a current challenge as an opportunity?'
          ]
        }
      ]
    )
  },

  // ============================================
  // LANGUAGE & COMMUNICATION (4 stories)
  // ============================================
  {
    id: 21,
    title: 'The Magic of Words: How Language Began',
    category: 'language',
    duration: 60,
    difficulty: 'foundational',
    description: 'Journey through the evolution of language—from the first sounds our ancestors made to the rich tapestry of human communication.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore one of humanity's greatest inventions—something so natural we forget how magical it is.

I'm talking about language: the ability to take thoughts from one mind and plant them in another, using nothing but sounds or symbols.`,
        coreContent: `Language is uniquely human. Other animals communicate—birds sing, bees dance, whales call—but no other species has anything like human language, with its infinite creativity and complex grammar.

How did language begin? We don't know for certain, but scientists believe it evolved gradually over hundreds of thousands of years. Our ancestors needed to cooperate—to hunt together, share knowledge, warn of dangers. Language made this possible.

The first languages were probably simple—sounds for "danger," "food," "come here." But over time, they grew more complex. Grammar emerged, allowing us to combine words in endless ways. We could talk about the past and future, about things that don't exist, about abstract ideas.

Today there are about 7,000 languages spoken on Earth. Each one is a unique way of carving up reality, of expressing thought. Some languages have words for concepts that others lack. Language shapes how we think.

Your baby is already learning language. In the womb, they can hear your voice and are learning its rhythms and patterns. Newborns prefer their mother's language to others. Language learning begins before birth.

Writing extended language across time and space. The first writing appeared about 5,000 years ago. Now we can read the thoughts of people who lived millennia ago, and our words can reach people we'll never meet.`,
        interactiveSection: `Let's appreciate the magic of language:

Say a word—any word. Notice how sounds become meaning. How does that work? It's a kind of magic we take for granted.

Now think of a word in another language, if you know one. The same concept, different sounds. Language is arbitrary yet meaningful.

Speak to your baby. They're listening, learning the music of your language. Your voice is their first teacher.`,
        integration: `Little one, language will be your superpower. With words, you can share your thoughts, learn from others, connect across time and space.

Learn to use language well. Choose words carefully—they have power. Listen as much as you speak. And remember that language is a gift from countless generations who came before, each adding to this magnificent tool for sharing minds.`
      },
      [
        'Language is uniquely human in its complexity and creativity',
        'Language evolved gradually to enable cooperation',
        'There are about 7,000 languages, each shaping thought differently',
        'Babies begin learning language before birth',
        'Writing extended language across time and space'
      ],
      [
        'Language is like telepathy—transferring thoughts between minds',
        'Grammar is like a recipe for combining words infinitely',
        'Each language is like a different lens for viewing reality'
      ],
      [
        {
          type: 'creative',
          title: 'Word Wonder',
          description: 'Explore the magic of language',
          prompts: [
            'What\'s your favorite word and why?',
            'Make up a new word for something that doesn\'t have a name'
          ]
        }
      ]
    )
  },
  {
    id: 22,
    title: 'The Ancient Tongue: Sanskrit and the Roots of Language',
    category: 'language',
    duration: 55,
    difficulty: 'advanced',
    description: 'Explore Sanskrit, one of the world\'s oldest languages, and discover how ancient languages connect to modern speech.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to travel back in time to meet one of the oldest and most beautiful languages ever spoken—Sanskrit, the ancient tongue of India.

Sanskrit is special not just because it's old, but because of what it teaches us about language itself.`,
        coreContent: `Sanskrit is one of the oldest languages with written records, dating back over 3,500 years. It's the language of ancient Indian scriptures, philosophy, and science. The word "Sanskrit" means "refined" or "perfected."

What makes Sanskrit remarkable is its precision. Ancient Indian grammarians, especially Panini around 500 BCE, analyzed Sanskrit with incredible rigor. Panini's grammar contains about 4,000 rules that describe the language completely. It's considered one of the greatest intellectual achievements of the ancient world.

Sanskrit is part of the Indo-European language family, which includes most European languages, Persian, and many Indian languages. Words in Sanskrit often have cousins in English, Latin, Greek, and other languages. "Mother" in Sanskrit is "matar"—hear the similarity?

The precision of Sanskrit grammar influenced modern linguistics and even computer science. Some researchers note that Sanskrit's logical structure resembles programming languages. It's a bridge between ancient wisdom and modern technology.

Sanskrit also carries profound philosophical concepts. Words like "yoga" (union), "karma" (action), "dharma" (duty/truth), and "nirvana" (liberation) come from Sanskrit and have entered languages worldwide.

Though few speak Sanskrit as a native language today, it lives on in religious ceremonies, classical texts, and the many languages it influenced.`,
        interactiveSection: `Let's explore some Sanskrit words you might already know:

"Yoga" - union, connection
"Karma" - action and its consequences
"Mantra" - a sacred sound or phrase
"Avatar" - descent, incarnation
"Guru" - teacher (literally "heavy" with knowledge)

These ancient words carry deep meanings that have traveled across millennia to reach you.

Try saying "Om" (or "Aum")—considered the primordial sound in Sanskrit tradition. Feel the vibration. Ancient and modern meet in this simple sound.`,
        integration: `Little one, languages are living things. They're born, they grow, they change, and sometimes they fade. But their influence lives on in the languages that follow.

Sanskrit reminds us that wisdom is ancient. People thousands of years ago thought deeply about language, mind, and reality. Their insights still illuminate our understanding today.

As you learn to speak, you're joining a conversation that spans millennia. Every word you say connects you to countless speakers who came before.`
      },
      [
        'Sanskrit is one of the oldest languages with written records',
        'Panini\'s grammar is one of the greatest intellectual achievements of antiquity',
        'Sanskrit is part of the Indo-European language family',
        'Sanskrit\'s precision influenced linguistics and computer science',
        'Many Sanskrit words have entered languages worldwide'
      ],
      [
        'Sanskrit grammar is like a precise blueprint for language',
        'The Indo-European family is like a tree with many branches',
        'Sanskrit words are like seeds that sprouted in many languages'
      ],
      [
        {
          type: 'reflection',
          title: 'Ancient Connections',
          description: 'Reflect on language heritage',
          prompts: [
            'What Sanskrit-origin words do you use?',
            'How does knowing about ancient languages change your view of modern speech?'
          ]
        }
      ]
    )
  },
  {
    id: 23,
    title: 'The Universal Language: Music and the Soul',
    category: 'language',
    duration: 60,
    difficulty: 'foundational',
    description: 'Discover how music communicates across all cultures and languages—the universal language that speaks directly to the heart.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore a language that needs no translation, a language that speaks directly to the heart.

This is music—the universal language that every human culture has created, from the first drums to the latest symphony.`,
        coreContent: `Music is universal. Every human culture ever studied has music. We sing, we drum, we dance. Music seems to be as natural to humans as language itself.

Why do we make music? Scientists believe music evolved for social bonding. Singing and dancing together creates connection, synchronizes groups, and builds trust. Music is social glue.

Music affects us physically. It can speed up or slow down our heartbeat, release dopamine (the pleasure chemical), reduce stress hormones, and even help with pain. Babies in the womb respond to music—they can hear it and remember it after birth.

Music and language share brain regions, but music can reach places language can't. People with severe language impairments can sometimes still sing. Music therapy helps with conditions from autism to Alzheimer's.

Different cultures create different music, but some elements are universal. All music has rhythm. Most music uses a limited set of pitches (scales). Lullabies around the world share similar features—slow, simple, soothing.

Your baby is listening to music right now—the rhythm of your heartbeat, the melody of your voice. These are their first songs, and they're learning to love music through you.`,
        interactiveSection: `Let's make music together:

Hum a simple tune. Feel the vibration in your chest. Your baby feels it too.

Tap a rhythm on your belly. Your baby can hear and feel the beat.

Sing a lullaby—any song you love. It doesn't matter if you think you can't sing. Your voice is the most beautiful sound to your baby.

Music is connection. Right now, you and your baby are sharing a musical moment that they'll remember, even if they can't put it into words.`,
        integration: `Little one, music will be part of your life from the very beginning. You're already hearing it, feeling it, learning to love it.

As you grow, let music move you. Sing, even if you think you can't. Dance, even if no one's watching. Play instruments, listen deeply, let music speak to your soul.

Music is a gift that connects us to each other and to something greater than ourselves. It's the language of the heart.`
      },
      [
        'Music is universal—every human culture has it',
        'Music evolved for social bonding and group coordination',
        'Music affects us physically, emotionally, and neurologically',
        'Babies hear and respond to music in the womb',
        'Some musical elements are universal across cultures'
      ],
      [
        'Music is like a language that needs no translation',
        'Rhythm is like the heartbeat of music',
        'Lullabies are like universal songs of love and comfort'
      ],
      [
        {
          type: 'creative',
          title: 'Musical Connection',
          description: 'Connect with your baby through music',
          prompts: [
            'What songs do you want to share with your baby?',
            'Create a simple lullaby for your child'
          ]
        }
      ]
    )
  },
  {
    id: 24,
    title: 'Speaking Without Words: Body Language',
    category: 'language',
    duration: 55,
    difficulty: 'intermediate',
    description: 'Explore the silent language of gestures, expressions, and postures—how we communicate without saying a word.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to learn about a language you'll speak fluently without ever being taught—the language of the body.

Before you say your first word, you'll communicate through cries, smiles, gestures, and expressions. This is body language, and it's as important as words.`,
        coreContent: `Experts estimate that 60-90% of communication is nonverbal. We're constantly sending and receiving signals through facial expressions, gestures, posture, eye contact, and tone of voice.

Facial expressions for basic emotions are universal. A smile means happiness everywhere. A frown means displeasure. These expressions are innate—even babies born blind smile when happy.

But much body language is cultural. In some cultures, direct eye contact shows respect; in others, it's rude. Gestures that are friendly in one place can be offensive in another. We learn these rules without being taught.

Body language often reveals what words hide. Someone might say "I'm fine" while their crossed arms and tense shoulders say otherwise. Learning to read body language helps you understand what people really feel.

Your baby will be an expert at body language before they speak. They'll read your face, respond to your tone, feel your tension or relaxation. They're learning to communicate with you right now, through kicks and movements.

As you hold your baby, your body will speak to them constantly. Your gentle touch says "you're safe." Your relaxed breathing says "all is well." Your loving gaze says "you are precious."`,
        interactiveSection: `Let's explore body language:

Notice your posture right now. What is it saying? Relax your shoulders, unclench your jaw, soften your face.

Think of someone you love. Notice how your face changes, how your body softens. That's body language expressing emotion.

Place your hands on your belly. What are you communicating to your baby through touch? Gentle pressure, warmth, presence. They understand.`,
        integration: `Little one, you'll speak body language before you speak words. Your first conversations will be through cries and coos, smiles and frowns, reaching and turning away.

As you grow, pay attention to the silent language. Notice what people's bodies say, not just their words. And be aware of what your own body communicates.

The most important body language is love—the gentle touch, the warm embrace, the soft gaze. These speak louder than any words.`
      },
      [
        'Most communication is nonverbal',
        'Basic facial expressions are universal',
        'Much body language is culturally learned',
        'Body language often reveals hidden feelings',
        'Babies communicate through body language before speech'
      ],
      [
        'Body language is like a silent conversation happening alongside words',
        'Facial expressions are like a universal emotional alphabet',
        'Touch is like a direct line to the heart'
      ],
      [
        {
          type: 'reflection',
          title: 'Silent Communication',
          description: 'Explore nonverbal communication',
          prompts: [
            'What does your body language say right now?',
            'How do you communicate love without words?'
          ]
        }
      ]
    )
  },

  // ============================================
  // FINANCE & ECONOMICS (4 stories)
  // ============================================
  {
    id: 25,
    title: 'The Story of Money: From Shells to Digital',
    category: 'finance',
    duration: 55,
    difficulty: 'foundational',
    description: 'Journey through the history of money—from ancient barter to modern digital currencies—and understand what gives money its value.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore something that touches almost every part of human life—something we use every day but rarely think about.

This is money, and its story is the story of human cooperation and trust.`,
        coreContent: `Long ago, before money existed, people traded directly. If you had apples and wanted fish, you had to find someone with fish who wanted apples. This is called barter, and it's very inconvenient.

Money solved this problem. Instead of trading goods directly, people agreed to use something as a medium of exchange. Early money included shells, beads, salt, and cattle. Anything could be money if people agreed it had value.

Eventually, precious metals became popular money. Gold and silver are durable, divisible, portable, and rare. Coins made of these metals were used for thousands of years.

Paper money was a revolutionary idea. Instead of carrying heavy coins, you could carry a note promising to pay. At first, paper money was backed by gold—you could exchange it for metal. Today, most money is "fiat" currency, backed only by government authority and public trust.

Now we're entering the age of digital money. Most money exists only as numbers in computers. Credit cards, bank transfers, and cryptocurrencies are all forms of digital money.

What gives money value? Ultimately, it's trust. Money works because we all agree it works. It's a shared story we tell ourselves, a collective agreement that makes cooperation possible.`,
        interactiveSection: `Let's think about money:

What is a dollar bill, really? Just paper with ink. But we all agree it has value, so it does.

Think about something you bought recently. You gave paper (or digital numbers) and received something real. That exchange worked because of trust.

Money is a tool for cooperation. It lets strangers trade, lets us save for the future, lets us measure and compare value. It's one of humanity's most important inventions.`,
        integration: `Little one, money will be part of your life. You'll earn it, spend it, save it, maybe worry about it.

But remember—money is a tool, not a goal. It's useful for what it can do, not valuable in itself. The best things in life—love, friendship, meaning—can't be bought.

Use money wisely. Save some, share some, spend some on experiences rather than just things. And never forget that your worth as a person has nothing to do with your bank account.`
      },
      [
        'Money evolved to solve the problems of barter',
        'Anything can be money if people agree it has value',
        'Modern money is fiat currency, backed by trust and government',
        'Most money today is digital, existing as numbers in computers',
        'Money\'s value comes from collective agreement and trust'
      ],
      [
        'Money is like a shared story we all agree to believe',
        'Barter is like trying to find a perfect match for every trade',
        'Digital money is like money that exists only as information'
      ],
      [
        {
          type: 'reflection',
          title: 'Understanding Value',
          description: 'Reflect on money and value',
          prompts: [
            'What gives money its value?',
            'What valuable things can\'t be bought with money?'
          ]
        }
      ]
    )
  },
  {
    id: 26,
    title: 'The Dance of Supply and Demand: How Markets Work',
    category: 'finance',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Discover how millions of individual decisions create the complex dance of markets—where prices emerge from the interaction of buyers and sellers.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to watch a beautiful dance—a dance performed by millions of people every day, creating something no single person could design.

This is the dance of markets, where supply meets demand and prices emerge like magic.`,
        coreContent: `Imagine you're selling lemonade. If you charge too much, no one buys. If you charge too little, you run out and could have earned more. Somewhere in between is the "right" price—where the amount people want to buy equals the amount you want to sell.

This is supply and demand. Demand is how much people want to buy at different prices. Supply is how much sellers want to sell. Where they meet is the market price.

When something becomes scarce, its price rises. When it becomes abundant, its price falls. Prices are signals, carrying information about what's valuable and what's not.

Markets coordinate millions of decisions without anyone being in charge. A farmer in Iowa, a baker in Paris, a coffee grower in Colombia—all respond to prices, and somehow bread and coffee appear on your table. It's like a dance where no one leads, yet everyone moves in harmony.

But markets aren't perfect. They can fail when there are monopolies, when information is hidden, when costs are imposed on others (like pollution). That's why we have regulations and governments—to help markets work better.

Understanding markets helps you make better decisions. When you see a price, you're seeing information about supply and demand. When you buy or sell, you're participating in this global dance.`,
        interactiveSection: `Let's think about supply and demand:

Why do umbrellas cost more when it's raining? Demand increases!
Why do strawberries cost less in summer? Supply increases!

Think about something you bought recently. What determined its price? How many people wanted it? How hard was it to make? How many alternatives existed?

Prices are like a language, communicating information about scarcity and desire across the entire economy.`,
        integration: `Little one, you'll participate in markets your whole life—as a buyer, a seller, a worker, an investor.

Understanding how markets work helps you make better decisions. But remember—markets are tools for human flourishing, not ends in themselves. Some things shouldn't be bought and sold. Some values can't be priced.

Use markets wisely, but never let them define what matters most.`
      },
      [
        'Supply and demand determine market prices',
        'Prices are signals carrying information about scarcity and value',
        'Markets coordinate millions of decisions without central control',
        'Markets can fail and sometimes need regulation',
        'Understanding markets helps with better decision-making'
      ],
      [
        'Markets are like a dance where no one leads but everyone moves together',
        'Prices are like a language communicating value',
        'Supply and demand are like two forces finding balance'
      ],
      [
        {
          type: 'thought-experiment',
          title: 'Market Thinking',
          description: 'Apply market concepts',
          prompts: [
            'Why do some things cost more than others?',
            'What would happen if there were no prices?'
          ]
        }
      ]
    )
  },
  {
    id: 27,
    title: 'Digital Gold: Understanding Cryptocurrency',
    category: 'finance',
    duration: 55,
    difficulty: 'advanced',
    description: 'Explore the world of cryptocurrency—digital money that operates without banks or governments, powered by blockchain technology.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore a new kind of money—money that exists only in computers, controlled by no government, secured by mathematics.

This is cryptocurrency, and it's changing how we think about money and trust.`,
        coreContent: `In 2008, someone using the name Satoshi Nakamoto published a paper describing Bitcoin—a way to send money directly between people without banks or governments. It was the first cryptocurrency.

Cryptocurrency uses blockchain technology. Remember our glass notebook that everyone can see but no one can erase? That's how cryptocurrency works. Every transaction is recorded on a public ledger that thousands of computers maintain.

Instead of trusting a bank to keep track of your money, you trust mathematics and the network. Cryptography—the science of codes—secures transactions. No one can fake a transaction or spend money they don't have.

Bitcoin was designed to be like digital gold—scarce (only 21 million will ever exist), durable, divisible, and portable. Other cryptocurrencies have different features. Ethereum allows "smart contracts"—programs that execute automatically when conditions are met.

Cryptocurrency is controversial. Supporters see it as freedom from government control and bank fees. Critics worry about energy use, price volatility, and use in illegal activities. The technology is still young and evolving.

Whether cryptocurrency becomes mainstream money or remains a niche, the underlying ideas—decentralization, cryptographic security, programmable money—are likely to influence finance for decades.`,
        interactiveSection: `Let's understand cryptocurrency:

Imagine you want to send money to a friend across the world. With traditional banking, it might take days and cost fees. With cryptocurrency, it can happen in minutes, directly between you.

But there's no bank to call if something goes wrong. No government guarantees the value. You're trusting math and the network instead of institutions.

Is that better or worse? It depends on your situation and values. Cryptocurrency offers new possibilities and new risks.`,
        integration: `Little one, by the time you're grown, money might look very different than it does today. Digital currencies, whether from governments or decentralized networks, will likely be common.

The important thing isn't which technology wins—it's understanding the principles. Money is about trust. Technology can create new forms of trust. But ultimately, money serves human needs, not the other way around.

Stay curious about new technologies, but always ask: who benefits? What are the risks? What values does this serve?`
      },
      [
        'Cryptocurrency is digital money secured by cryptography',
        'Blockchain provides a decentralized, tamper-proof ledger',
        'Bitcoin was designed to be scarce like digital gold',
        'Smart contracts enable programmable money',
        'Cryptocurrency offers new possibilities and new risks'
      ],
      [
        'Cryptocurrency is like digital gold secured by mathematics',
        'Blockchain is like a glass notebook everyone can see but no one can erase',
        'Decentralization is like replacing one trusted authority with many verifiers'
      ],
      [
        {
          type: 'discussion',
          title: 'Future of Money',
          description: 'Discuss cryptocurrency and digital money',
          prompts: [
            'What are the benefits and risks of decentralized money?',
            'How might money change in your child\'s lifetime?'
          ]
        }
      ]
    )
  },
  {
    id: 28,
    title: 'Building Wealth: The Power of Compound Growth',
    category: 'finance',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Discover the eighth wonder of the world—compound interest—and learn how small, consistent actions create extraordinary results over time.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to learn about a kind of magic—a force so powerful that Albert Einstein supposedly called it the eighth wonder of the world.

This is compound growth, and understanding it can change your life.`,
        coreContent: `Imagine you plant a tree. The first year, it grows a little. The second year, it grows from its new, larger size—so it adds more. Each year, it grows from everything it's already become. This is compound growth.

With money, compound interest works the same way. If you save $100 and earn 7% interest, after one year you have $107. The next year, you earn 7% on $107, giving you $114.49. The interest earns interest!

Over short periods, compound growth seems slow. But over decades, it becomes extraordinary. $100 invested at 7% becomes $200 in 10 years, $400 in 20 years, $800 in 30 years, $1,600 in 40 years. The longer you wait, the faster it grows.

This is why starting early matters so much. Someone who saves from age 25 to 35 and then stops can end up with more than someone who saves from 35 to 65. The early years have more time to compound.

But compound growth isn't just about money. Knowledge compounds—each thing you learn helps you learn more. Relationships compound—small kindnesses build deep bonds over time. Health compounds—daily habits create long-term vitality.

The key is consistency. Small, regular actions, sustained over time, create extraordinary results. It's not about getting rich quick—it's about getting rich slowly and surely.`,
        interactiveSection: `Let's see compound growth in action:

If you saved $1 a day from birth, at 7% interest, by age 65 you'd have over $200,000!

The rule of 72: divide 72 by your interest rate to see how long it takes to double. At 7%, money doubles every ~10 years.

Think about compound growth in your own life. What small daily habits could compound into something extraordinary? Reading, exercising, practicing a skill, nurturing relationships?`,
        integration: `Little one, time is your greatest asset. You have decades ahead of you for compound growth to work its magic.

Start early. Be consistent. Be patient. Whether it's money, knowledge, skills, or relationships—small actions, repeated over time, create extraordinary results.

And remember—the most important things in life compound too. Love grows. Wisdom deepens. Character strengthens. Invest in what truly matters.`
      },
      [
        'Compound growth means growth on top of previous growth',
        'Starting early dramatically increases long-term results',
        'Consistency matters more than intensity',
        'Compound growth applies to knowledge, relationships, and skills, not just money',
        'Time is the key ingredient in compound growth'
      ],
      [
        'Compound growth is like a snowball rolling downhill, getting bigger and faster',
        'The rule of 72 is like a shortcut for understanding doubling time',
        'Early investment is like planting a tree that grows for decades'
      ],
      [
        {
          type: 'reflection',
          title: 'Compound Thinking',
          description: 'Apply compound growth to your life',
          prompts: [
            'What habits could compound into something extraordinary?',
            'How can you help your child benefit from compound growth?'
          ]
        }
      ]
    )
  },

  // ============================================
  // SOCIETY & CULTURE (4 stories)
  // ============================================
  {
    id: 29,
    title: 'The Beautiful Tapestry: Celebrating Diversity',
    category: 'society',
    duration: 55,
    difficulty: 'foundational',
    description: 'Explore the rich diversity of human cultures, appearances, and perspectives—and discover why our differences make us stronger.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to celebrate something beautiful—the incredible variety of human beings on our planet.

People come in all colors, speak thousands of languages, practice different customs, and see the world in different ways. This diversity is one of humanity's greatest treasures.`,
        coreContent: `Look around the world and you'll find amazing variety. People with skin ranging from deep brown to pale pink. Eyes of brown, blue, green, and every shade between. Hair that's straight, curly, coiled, or wavy. Bodies of all shapes and sizes.

This physical diversity evolved as humans spread across the globe, adapting to different climates and environments. But beneath our surface differences, we're remarkably similar. All humans share 99.9% of their DNA. We're one family with many faces.

Cultural diversity is equally rich. There are about 7,000 languages spoken today, each one a unique way of expressing thought. Different cultures have different values, customs, foods, music, and art. What's polite in one culture might be rude in another.

Why does diversity matter? Because different perspectives solve problems better. A group of diverse thinkers outperforms a group of similar experts. Our differences are our strength.

But diversity also requires effort. It's easy to fear what's different, to prefer people who look and think like us. Building a world that celebrates diversity means actively choosing inclusion, seeking to understand, and recognizing our common humanity beneath our differences.

Your baby will grow up in a diverse world. The friends they make, the ideas they encounter, the cultures they experience—all will be richer because of human variety.`,
        interactiveSection: `Let's celebrate diversity:

Think about the people in your life. How are they different from you? How are they similar?

Consider a custom from another culture that's different from yours. Can you understand why it makes sense in its context?

Diversity isn't just about tolerating differences—it's about appreciating them, learning from them, being enriched by them.

What aspects of diversity do you want your child to experience and appreciate?`,
        integration: `Little one, you'll meet people who look different, think different, believe different things. This is a gift, not a problem.

Learn from everyone you meet. Seek out perspectives different from your own. Remember that your way isn't the only way—it's just one beautiful thread in humanity's tapestry.

And always remember: beneath all our differences, we share the same hopes, fears, and dreams. We all want to be loved, to belong, to matter. We are one human family.`
      },
      [
        'Human physical diversity evolved through adaptation to different environments',
        'All humans share 99.9% of their DNA',
        'Cultural diversity includes languages, customs, values, and worldviews',
        'Diverse groups solve problems better than homogeneous ones',
        'Appreciating diversity requires active effort and openness'
      ],
      [
        'Humanity is like a tapestry woven from many different threads',
        'Languages are like different windows onto the same world',
        'Diversity is like a garden with many different flowers'
      ],
      [
        {
          type: 'reflection',
          title: 'Embracing Difference',
          description: 'Reflect on diversity in your life',
          prompts: [
            'What have you learned from someone very different from you?',
            'How can you expose your child to diverse perspectives?'
          ]
        }
      ]
    )
  },
  {
    id: 30,
    title: 'Right and Wrong: The Journey of Ethics',
    category: 'society',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Explore the big questions of right and wrong—how humans have thought about ethics across cultures and centuries.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to think about some of the biggest questions humans have ever asked: What is right? What is wrong? How should we live?

These questions have no easy answers, but thinking about them carefully is one of the most important things we can do.`,
        coreContent: `Every culture has ideas about right and wrong. Some principles appear almost everywhere: don't murder, don't steal, don't lie, help those in need. These seem to be part of our shared human nature.

But ethics is also complex. Different traditions emphasize different values. Some focus on consequences—an action is right if it produces good outcomes. Others focus on duties—some actions are right or wrong regardless of outcomes. Still others focus on character—being a good person matters more than following rules.

The Golden Rule appears in almost every culture: treat others as you want to be treated. It's a simple principle with profound implications. If everyone followed it, most ethical problems would disappear.

But applying ethics to real situations is hard. What do you do when values conflict? When helping one person hurts another? When the right thing is also the hard thing?

Moral development is a journey. Children start by following rules to avoid punishment. They grow to understand fairness and social expectations. Eventually, some develop principled reasoning based on universal values.

Your baby will develop their own moral sense. They'll learn from watching you, from the stories you tell, from how you treat others. You are their first ethics teacher.`,
        interactiveSection: `Let's think about ethics:

Think of a time you faced a moral dilemma. How did you decide what to do?

Consider the Golden Rule. If everyone followed it, how would the world change?

Ethics isn't about being perfect—it's about trying to do better, thinking carefully about our choices, and taking responsibility for our actions.

What values do you most want to pass on to your child?`,
        integration: `Little one, you'll face countless choices between right and wrong. Some will be easy; many will be hard.

Develop your moral compass. Think about your values. Consider how your actions affect others. Be willing to do the hard right thing instead of the easy wrong thing.

And be gentle with yourself. Everyone makes mistakes. What matters is learning from them, making amends, and trying to do better. Ethics is a journey, not a destination.`
      },
      [
        'Some ethical principles appear across all cultures',
        'Different ethical traditions emphasize consequences, duties, or character',
        'The Golden Rule is nearly universal',
        'Applying ethics to real situations is complex',
        'Moral development is a lifelong journey'
      ],
      [
        'Ethics is like a compass helping us navigate life\'s choices',
        'The Golden Rule is like a universal ethical algorithm',
        'Moral development is like climbing a mountain with ever-wider views'
      ],
      [
        {
          type: 'reflection',
          title: 'Ethical Reflection',
          description: 'Explore your moral values',
          prompts: [
            'What are your core ethical principles?',
            'How do you decide what\'s right when values conflict?'
          ]
        }
      ]
    )
  },
  {
    id: 31,
    title: 'The Voice of the People: Understanding Democracy',
    category: 'society',
    duration: 60,
    difficulty: 'intermediate',
    description: 'Explore the idea of democracy—government by the people—its history, principles, and ongoing challenges.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to explore a powerful idea—the idea that ordinary people should have a say in how they're governed.

This is democracy, and it's one of humanity's most important experiments in living together.`,
        coreContent: `For most of human history, power belonged to kings, emperors, and warlords. Ordinary people had no voice in the decisions that affected their lives. Then, about 2,500 years ago in ancient Athens, something revolutionary happened: citizens began governing themselves.

Democracy means "rule by the people." In its purest form, citizens vote directly on laws and policies. In representative democracy, citizens elect leaders to make decisions on their behalf.

Democracy rests on several key principles: that all people have equal worth and deserve equal voice; that power should be limited and accountable; that minorities have rights even when majorities rule; that peaceful transfer of power is possible.

Democracy isn't perfect. Majorities can be wrong. Voters can be manipulated. Special interests can capture the process. Democracy requires informed, engaged citizens to work well.

But democracy has proven remarkably successful. Democratic countries tend to be more peaceful, more prosperous, and more protective of human rights. When people have voice, they're more invested in their society.

Democracy is also fragile. It requires constant maintenance—civic education, free press, rule of law, respect for opponents. Every generation must choose to sustain it.`,
        interactiveSection: `Let's think about democracy:

What decisions affect your daily life? Who makes those decisions? Do you have a voice?

Democracy isn't just about voting. It's about participating—staying informed, speaking up, respecting others' views, accepting outcomes even when you disagree.

Think about the community your child will grow up in. How can you help them become engaged citizens?`,
        integration: `Little one, you'll grow up in a world shaped by political decisions. You'll have the power to influence those decisions—through voting, speaking, organizing, and participating.

Use that power wisely. Stay informed. Listen to different perspectives. Respect those who disagree. Remember that democracy depends on citizens like you.

And never take democracy for granted. It's a precious inheritance, won through struggle, maintained through vigilance. Each generation must choose to keep it alive.`
      },
      [
        'Democracy means government by the people',
        'Key principles include equal voice, limited power, and minority rights',
        'Democracy requires informed, engaged citizens',
        'Democratic countries tend to be more peaceful and prosperous',
        'Democracy is fragile and requires constant maintenance'
      ],
      [
        'Democracy is like a garden that needs constant tending',
        'Voting is like adding your voice to a collective conversation',
        'Civic engagement is like being a co-author of your society'
      ],
      [
        {
          type: 'discussion',
          title: 'Civic Engagement',
          description: 'Discuss democracy and participation',
          prompts: [
            'How do you participate in democracy beyond voting?',
            'What civic values do you want to teach your child?'
          ]
        }
      ]
    )
  },
  {
    id: 32,
    title: 'The Human Spirit: Art and Creativity',
    category: 'society',
    duration: 60,
    difficulty: 'foundational',
    description: 'Celebrate the human drive to create—from cave paintings to digital art—and discover why creativity matters.',
    content: createStoryContent(
      {
        introduction: `Hello, little one. Today we're going to celebrate something that makes humans special—our drive to create beauty, to express ourselves, to make art.

From the first cave paintings to the latest digital creations, humans have always been artists.`,
        coreContent: `About 40,000 years ago, our ancestors began painting on cave walls—animals, hands, mysterious symbols. They weren't just surviving; they were creating. This urge to make art seems to be part of what makes us human.

Art takes countless forms: painting, sculpture, music, dance, poetry, theater, film, architecture, fashion, cooking. Every culture creates art. Every child draws and sings and makes up stories. Creativity is universal.

Why do we make art? To express what words can't say. To process emotions. To connect with others. To make sense of existence. To leave something behind. To experience beauty. Art serves many purposes, and sometimes no purpose at all—it just is.

Art also reflects and shapes society. It preserves culture, challenges assumptions, imagines alternatives, and brings people together. Revolutionary art can change how we see the world.

Creativity isn't just for "artists." It's a way of approaching life—seeing possibilities, making connections, solving problems in new ways. Everyone is creative; it's just a matter of nurturing that creativity.

Your baby is already creative. They're building a brain, growing a body, becoming a person. Soon they'll draw, sing, dance, and imagine. Nurture that creativity—it's one of their greatest gifts.`,
        interactiveSection: `Let's celebrate creativity:

Think of a piece of art that moved you—a song, a painting, a story. What did it make you feel? Why did it matter?

Now think about your own creativity. When do you feel most creative? What do you make or do that expresses who you are?

Creativity isn't about being "good" at art. It's about expressing yourself, exploring possibilities, making something that didn't exist before.

What creative activities do you want to share with your child?`,
        integration: `Little one, you are born creative. You'll draw before you write, sing before you speak in sentences, imagine before you reason.

Nurture your creativity throughout life. Make things. Express yourself. Don't worry about being "good"—just create. The world needs your unique perspective, your particular way of seeing and making.

And remember—creativity isn't separate from the rest of life. It's a way of being: curious, playful, open to possibility. Live creatively, and your whole life becomes a work of art.`
      },
      [
        'Humans have created art for at least 40,000 years',
        'Art is universal across all cultures',
        'Art serves many purposes: expression, connection, meaning-making',
        'Creativity is a way of approaching life, not just making art',
        'Everyone is creative; it can be nurtured'
      ],
      [
        'Art is like a window into the human soul',
        'Creativity is like a muscle that grows stronger with use',
        'Every child is an artist; the challenge is remaining one'
      ],
      [
        {
          type: 'creative',
          title: 'Celebrating Creativity',
          description: 'Explore your creative side',
          prompts: [
            'Create something today—anything at all',
            'What creative traditions do you want to share with your child?'
          ]
        }
      ]
    )
  },
];

/**
 * Get all stories
 */
export function getAllStories(): Story[] {
  return stories;
}

/**
 * Get story by ID
 */
export function getStoryById(id: number): Story | undefined {
  return stories.find((story) => story.id === id);
}

/**
 * Get stories by category
 */
export function getStoriesByCategory(category: CategoryId): Story[] {
  if (category === 'all') return stories;
  return stories.filter((story) => story.category === category);
}

/**
 * Get stories by difficulty
 */
export function getStoriesByDifficulty(difficulty: DifficultyLevel): Story[] {
  return stories.filter((story) => story.difficulty === difficulty);
}

/**
 * Search stories by keyword
 */
export function searchStories(searchTerm: string): Story[] {
  const term = searchTerm.toLowerCase();
  return stories.filter(
    (story) =>
      story.title.toLowerCase().includes(term) ||
      story.description.toLowerCase().includes(term)
  );
}

export default stories;
