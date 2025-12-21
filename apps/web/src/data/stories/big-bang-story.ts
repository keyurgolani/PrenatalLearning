/**
 * The Story of Everything: From Big Bang to You
 * 
 * A one-hour educational narrative for prenatal learning
 * Category: Science & Universe
 * Difficulty: Foundational
 * Duration: 60 minutes
 */

export interface Analogy {
  concept: string;
  analogy: string;
}

export interface StoryContent {
  id: number;
  title: string;
  category: string;
  duration: number;
  difficulty: string;
  description: string;
  narrative: {
    introduction: string;
    coreContent: string;
    interactiveSection: string;
    integration: string;
  };
  keyConcepts: string[];
  analogies: (string | Analogy)[];
  exercises: TopicExercise[];
}

export interface TopicExercise {
  type: 'reflection' | 'thought-experiment' | 'discussion' | 'creative' | 'visualization' | 'breathing';
  title: string;
  description: string;
  prompts: string[];
  duration?: number;
  guidance?: string;
}

export const bigBangStory: StoryContent = {
  id: 1,
  title: 'The Story of Everything: From Big Bang to You',
  category: 'science',
  duration: 60,
  difficulty: 'foundational',
  description: 'Journey through 13.8 billion years of cosmic evolution, from the first spark of creation to the miracle of your existence.',
  
  narrative: {
    introduction: `Hello, little one. Today we're going on the most amazing journey together—a journey through time and space, through the story of how everything came to be.

Take a deep breath, dear mother. Place your hands gently on your belly. Feel the warmth, the connection, the love that flows between you and your baby.

Now, close your eyes and imagine... imagine a time before there were stars, before there were planets, before there was anything at all. A time when the entire universe—everything that would ever exist—was smaller than a grain of sand.

This is where our story begins. The story of everything. The story of how the universe was born, how stars came to shine, how planets formed, and how, after billions and billions of years, you came to be.

Are you ready, little one? Let's travel back to the very beginning...`,

    coreContent: `**The First Moment: A Tiny Spark of Everything**

Imagine, sweet baby, a tiny, tiny speck—smaller than a grain of sand, smaller than dust, smaller than anything you could ever see. This speck held everything that would ever exist: every star, every planet, every flower, every ocean, and yes, even you.

About 13.8 billion years ago—that's a number so big it's hard to imagine—this tiny speck suddenly went "FOOMP!" It puffed out faster than anything you can dream of, like a balloon being blown up in the blink of an eye. Scientists call this the Big Bang, but it wasn't really a bang at all. It was more like a great blooming, a cosmic flower opening its petals for the very first time.

**The Universe Grows and Cools**

In those first moments, the universe was incredibly hot—hotter than anything we can imagine. It was like a cup of cocoa that's too hot to drink, steaming and bubbling with energy. But as the universe grew bigger and bigger, it began to cool down, just like that cocoa cools when you wait patiently.

Picture a loaf of bread full of chocolate chips rising in the oven. As the dough rises, it stretches, and every chip drifts away from every other chip—not because the chips are moving, but because the dough itself is growing. Our universe is like that dough, little one. The chips are like galaxies, and the dough is space itself. As the universe stretches, everything slowly glides apart.

**The First Light**

For a long, long time—about 380,000 years—the universe was like a thick fog. Light couldn't travel very far because it kept bumping into things. But then something magical happened. The universe cooled enough for the fog to lift, and suddenly, light could travel freely across the cosmos.

This was the universe's first sunrise, little one. The first time light could shine across the great expanse of space. And that ancient light is still traveling today! Scientists can see it with special telescopes, a gentle glow that fills the entire sky—a whisper from the very beginning of time.

**The Dark Ages and the First Stars**

After the fog lifted, the universe entered a quiet time called the Dark Ages. There were no stars yet, no light sources—just darkness and silence. But gravity, that gentle force that keeps your feet on the ground, was quietly working. It was gathering clouds of gas together, pulling them closer and closer.

Then, about 200 million years after the Big Bang, something wonderful happened. The first stars ignited! Imagine a giant, glowing campfire in the sky, burning bright against the darkness. These first stars were enormous—much, much bigger than our Sun—and they burned with incredible brilliance.

**We Are Made of Star Stuff**

Here's the most magical part of our story, little one. Inside those ancient stars, something incredible was happening. The stars were like cosmic kitchens, cooking up new ingredients. They took the simplest building blocks—hydrogen and helium—and through their tremendous heat and pressure, they created new elements: carbon, oxygen, iron, gold.

When these giant stars finished their lives, they burst apart in spectacular explosions called supernovas, scattering their star-cooked ingredients across the universe like seeds in a garden. These seeds gathered together to form new stars, new planets, and eventually... you.

Your bones, your blood, your beautiful little heartbeat—they're all made from those star-sparks, cooked long ago in ancient suns. You are not just in the universe, little one. You are a piece of its stars, a small, shining part of its very first fire.

**Our Cosmic Home**

About 4.6 billion years ago, in a quiet corner of a spiral galaxy called the Milky Way, a new star was born—our Sun. Around it, dust and gas swirled together like a cosmic dance, forming planets. One of those planets was Earth, our beautiful blue home.

Earth was special. It was just the right distance from the Sun—not too hot, not too cold. It had water, and air, and all the ingredients needed for something amazing to happen: life.

Over billions of years, life grew and changed and evolved. From tiny single cells to fish in the oceans, from dinosaurs walking the land to birds flying in the sky. And then, just a blink of an eye ago in cosmic time, humans appeared—curious, creative, loving beings who could look up at the stars and wonder where they came from.

**The Universe Continues**

And the universe is still growing, little one. Right now, as you float safely in your mother's womb, the universe is stretching, galaxies are drifting apart, new stars are being born, and old stars are sharing their gifts with the cosmos.

You are part of this grand story. You are made of the same stuff as stars, connected to everything that has ever existed. The atoms in your tiny body have traveled across billions of years and billions of miles to come together and create you.

What a miracle you are, little one. What a beautiful, cosmic miracle.`,

    interactiveSection: `**Breathing with the Universe**

Dear mother, let's take a moment to breathe together with your baby. Imagine that with each breath, you're breathing in starlight—the same light that has traveled across the universe for billions of years.

Breathe in slowly... feel the warmth spreading through your body, reaching your baby.

Breathe out gently... imagine sending love and wonder to your little one.

Let's do this three more times, slowly and peacefully.

**Visualization: The Cosmic Journey**

Now, close your eyes and imagine you're floating in space, holding your baby close. Around you, stars twinkle like diamonds scattered across black velvet.

See the spiral arms of our galaxy, the Milky Way, stretching out like a great pinwheel of light. Feel how small we are in this vast universe, yet how connected we are to everything.

Now imagine traveling back in time... past the formation of Earth, past the birth of our Sun, past the first stars, all the way back to that tiny speck that held everything.

Feel the wonder of that moment. Feel the potential, the possibility, the love that would eventually become you and your baby.

**Gentle Touch Connection**

Place both hands on your belly now. Feel the warmth of your skin, the gentle movements of your baby.

As you hold your belly, whisper softly: "You are made of stars, little one. You are part of the universe's greatest story."

Feel the connection between you—mother and child, both made of the same cosmic ingredients, both part of this incredible journey through time and space.

**Counting Cosmic Breaths**

Let's count together, breathing slowly:

One... the universe begins, a tiny spark of everything.
Two... the cosmos expands, growing and cooling.
Three... the first light shines across space.
Four... stars ignite, cooking the elements of life.
Five... our solar system forms, Earth becomes our home.
Six... life begins and grows and changes.
Seven... you are here, a miracle of cosmic proportions.

Rest now in this peaceful moment, connected to your baby and to the universe itself.`,

    integration: `**Connecting to Your Baby's Future**

Little one, as you grow and learn and explore the world, remember this story. Remember that you are part of something vast and beautiful and ancient.

When you look up at the night sky and see the stars twinkling, know that you are looking at your cosmic family. Those stars are your distant cousins, made of the same stuff as you, part of the same great story.

When you feel the warmth of the Sun on your face, remember that our Sun is a star too—a star that has been shining for billions of years, giving light and warmth to our little planet.

When you hold a flower or a stone or a drop of water, know that the atoms in that flower, that stone, that water, have traveled across the universe to be here with you. Everything is connected, little one. Everything is part of the same cosmic dance.

**A Message of Wonder**

Dear mother, as you share this story with your baby, you're giving them a gift—the gift of wonder, the gift of connection, the gift of knowing their place in the universe.

Your baby may not understand the words yet, but they can feel your voice, your love, your sense of awe. These feelings will stay with them, planting seeds of curiosity that will bloom throughout their life.

**Closing Blessing**

And so, little one, we come to the end of our journey today. But remember, the story of the universe is still being written, and you are part of it.

You are a child of the cosmos, born from the hearts of ancient stars. You carry within you the light of the Big Bang, the warmth of a billion suns, the wonder of 13.8 billion years of cosmic evolution.

Sleep now, little star. Dream of galaxies and nebulae, of planets and moons. Dream of the vast, beautiful universe that is your home.

And know that you are loved—by your mother, by your family, and by the universe itself.

Goodnight, little one. Goodnight, child of the stars.`
  },

  keyConcepts: [
    'The universe began about 13.8 billion years ago from an incredibly small, hot, dense state',
    'The universe has been expanding and cooling ever since the Big Bang',
    'The first stars formed about 200 million years after the Big Bang',
    'Stars create heavier elements through nuclear fusion and spread them when they explode',
    'We are literally made of star stuff—the atoms in our bodies were forged in ancient stars',
    'Everything in the universe is connected, part of the same cosmic story'
  ],

  analogies: [
    {
      concept: 'Cosmic Inflation',
      analogy: 'A tiny soap bubble suddenly going "FOOMP" and puffing out into a huge, soft bubble in less than a blink'
    },
    {
      concept: 'Universe Expansion',
      analogy: 'A loaf of bread with chocolate chips rising in the oven—the chips (galaxies) drift apart as the dough (space) stretches'
    },
    {
      concept: 'Universe Cooling',
      analogy: 'A cup of hot cocoa cooling down from steaming and bubbling to warm and cozy'
    },
    {
      concept: 'Star Stuff',
      analogy: 'A giant campfire in the sky that bakes ingredients and then bursts, sprinkling glowing sparks that become dust, planets, and people'
    },
    {
      concept: 'Cosmic Microwave Background',
      analogy: 'The universe\'s first sunrise—ancient light still traveling today, a whisper from the beginning of time'
    },
    {
      concept: 'Gravity Gathering Gas',
      analogy: 'A gentle, patient force quietly gathering clouds together like a cosmic gardener'
    }
  ],

  exercises: [
    {
      type: 'reflection',
      title: 'Origins and Existence',
      description: 'Reflect on your place in the cosmic story',
      prompts: [
        'How does it feel to know that you and your baby are made of star stuff?',
        'What emotions arise when you think about the 13.8 billion year journey that led to this moment?',
        'Write a letter to your baby about their cosmic origins and what it means to you.'
      ]
    },
    {
      type: 'thought-experiment',
      title: 'Cosmic Expansion',
      description: 'Imagine the expanding universe',
      prompts: [
        'Close your eyes and imagine you are a point in space. Feel the universe expanding around you—not moving through space, but space itself growing.',
        'Think about the chocolate chip bread analogy. If you were one chip, what would it feel like as the bread rises?',
        'Imagine you could watch the entire history of the universe in fast-forward. What moments would stand out to you?'
      ]
    },
    {
      type: 'creative',
      title: 'Cosmic Timeline Visualization',
      description: 'Create a visual representation of cosmic history',
      prompts: [
        'Draw or sketch the journey from the Big Bang to your baby—what images come to mind?',
        'Create a "cosmic family tree" showing how stars gave birth to the elements that make up your baby.',
        'Write a short poem or song about the universe\'s journey from a tiny speck to the miracle of life.'
      ]
    },
    {
      type: 'discussion',
      title: 'Wonder and Connection',
      description: 'Discuss the meaning of our cosmic origins',
      prompts: [
        'What does it mean to you that everything in the universe is connected?',
        'How might knowing about cosmic origins change how your child sees the world?',
        'What questions about the universe would you like to explore with your child as they grow?'
      ]
    }
  ]
};

export default bigBangStory;
