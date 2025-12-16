/**
 * External Resources Data
 * 
 * Curated third-party educational content mapped to story IDs.
 * Each story can have multiple external resources including videos, articles, tutorials, and interactive content.
 */

import type { ExternalResource } from '../types';

/**
 * External resources mapped by story ID
 */
export const externalResourcesMap: Record<number, ExternalResource[]> = {
  // Story 1: Big Bang
  1: [
    {
      id: 'res-1-1',
      title: 'The Beginning of Everything - The Big Bang',
      source: 'Kurzgesagt',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=wNDGgL73ihY',
      embedUrl: 'https://www.youtube.com/embed/wNDGgL73ihY',
      description: 'A beautifully animated explanation of the Big Bang theory and the origin of our universe.',
    },
    {
      id: 'res-1-2',
      title: 'Big Bang Theory Explained',
      source: 'NASA',
      type: 'article',
      url: 'https://science.nasa.gov/universe/overview/',
      description: 'NASA\'s comprehensive overview of the Big Bang and the expanding universe.',
    },
  ],

  // Story 2: Gravity
  2: [
    {
      id: 'res-2-1',
      title: 'Gravity Explained Simply',
      source: 'SciShow',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=Xc4xYacTu-E',
      embedUrl: 'https://www.youtube.com/embed/Xc4xYacTu-E',
      description: 'An accessible explanation of how gravity works and why it shapes our universe.',
    },
  ],

  // Story 3: Quantum Mechanics
  3: [
    {
      id: 'res-3-1',
      title: 'Quantum Mechanics for Beginners',
      source: 'Veritasium',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=p7bzE1E5PMY',
      embedUrl: 'https://www.youtube.com/embed/p7bzE1E5PMY',
      description: 'A mind-bending introduction to the strange world of quantum physics.',
    },
  ],


  // Story 4: Stars
  4: [
    {
      id: 'res-4-1',
      title: 'The Life Cycle of Stars',
      source: 'Khan Academy',
      type: 'video',
      url: 'https://www.khanacademy.org/science/cosmology-and-astronomy/stellar-life-topic',
      embedUrl: 'https://www.youtube.com/embed/PM9CQDlQI0A',
      description: 'Learn how stars are born, live, and die in spectacular fashion.',
    },
  ],

  // Story 5: Computers
  5: [
    {
      id: 'res-5-1',
      title: 'How Computers Work',
      source: 'Crash Course',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=tpIctyqH29Q',
      embedUrl: 'https://www.youtube.com/embed/tpIctyqH29Q',
      description: 'A fun introduction to the basics of how computers process information.',
    },
  ],

  // Story 6: Artificial Intelligence
  6: [
    {
      id: 'res-6-1',
      title: 'But what is a neural network?',
      source: '3Blue1Brown',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=aircAruvnKk',
      embedUrl: 'https://www.youtube.com/embed/aircAruvnKk',
      description: 'A visual and intuitive explanation of neural networks and deep learning.',
    },
    {
      id: 'res-6-2',
      title: 'AI Fundamentals',
      source: 'Google AI',
      type: 'tutorial',
      url: 'https://ai.google/education/',
      description: 'Google\'s educational resources for understanding artificial intelligence.',
    },
  ],

  // Story 9: DNA
  9: [
    {
      id: 'res-9-1',
      title: 'What is DNA and How Does it Work?',
      source: 'Stated Clearly',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=zwibgNGe4aY',
      embedUrl: 'https://www.youtube.com/embed/zwibgNGe4aY',
      description: 'A clear and beautiful explanation of DNA structure and function.',
    },
    {
      id: 'res-9-2',
      title: 'DNA Interactive',
      source: 'Cold Spring Harbor Laboratory',
      type: 'interactive',
      url: 'https://www.dnai.org/',
      description: 'Interactive exploration of DNA, genes, and heredity.',
    },
  ],

  // Story 12: Evolution
  12: [
    {
      id: 'res-12-1',
      title: 'What is Evolution?',
      source: 'Stated Clearly',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=GhHOjC4oxh8',
      embedUrl: 'https://www.youtube.com/embed/GhHOjC4oxh8',
      description: 'A gentle introduction to the theory of evolution by natural selection.',
    },
  ],

  // Story 13: Numbers
  13: [
    {
      id: 'res-13-1',
      title: 'The History of Zero',
      source: 'TED-Ed',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=9Y7gAzTMdMA',
      embedUrl: 'https://www.youtube.com/embed/9Y7gAzTMdMA',
      description: 'The fascinating story of how zero changed mathematics forever.',
    },
  ],

  // Story 15: Fibonacci
  15: [
    {
      id: 'res-15-1',
      title: 'The Magic of Fibonacci Numbers',
      source: 'TED',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=SjSHVDfXHQ4',
      embedUrl: 'https://www.youtube.com/embed/SjSHVDfXHQ4',
      description: 'Arthur Benjamin reveals the magic hidden in the Fibonacci sequence.',
    },
  ],

  // Story 17: Consciousness
  17: [
    {
      id: 'res-17-1',
      title: 'What is Consciousness?',
      source: 'Kurzgesagt',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=H6u0VBqNBQ8',
      embedUrl: 'https://www.youtube.com/embed/H6u0VBqNBQ8',
      description: 'An exploration of one of the biggest mysteries in science.',
    },
  ],

  // Story 18: Emotions
  18: [
    {
      id: 'res-18-1',
      title: 'The Science of Emotions',
      source: 'AsapSCIENCE',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=xNY0AAUtH3g',
      embedUrl: 'https://www.youtube.com/embed/xNY0AAUtH3g',
      description: 'Understanding how emotions work in your brain and body.',
    },
  ],

  // Story 19: Memory
  19: [
    {
      id: 'res-19-1',
      title: 'How Does Memory Work?',
      source: 'TED-Ed',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=TUoJc0NPajQ',
      embedUrl: 'https://www.youtube.com/embed/TUoJc0NPajQ',
      description: 'Discover the fascinating science behind how we form and recall memories.',
    },
  ],

  // Story 20: Growth Mindset
  20: [
    {
      id: 'res-20-1',
      title: 'The Power of Believing You Can Improve',
      source: 'TED',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=_X0mgOOSpLU',
      embedUrl: 'https://www.youtube.com/embed/_X0mgOOSpLU',
      description: 'Carol Dweck explains the growth mindset and its transformative power.',
    },
  ],

  // Story 25: Money
  25: [
    {
      id: 'res-25-1',
      title: 'The History of Money',
      source: 'Extra History',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=-nZkP2b-4vo',
      embedUrl: 'https://www.youtube.com/embed/-nZkP2b-4vo',
      description: 'How money evolved from barter to digital currencies.',
    },
  ],
};

/**
 * Get external resources for a specific story
 * @param storyId - The ID of the story
 * @returns Array of external resources or empty array if none exist
 */
export function getExternalResources(storyId: number): ExternalResource[] {
  return externalResourcesMap[storyId] || [];
}

/**
 * Check if a story has external resources
 * @param storyId - The ID of the story
 * @returns True if the story has external resources
 */
export function hasExternalResources(storyId: number): boolean {
  return (externalResourcesMap[storyId]?.length ?? 0) > 0;
}

/**
 * Get all external resources grouped by type
 * @param storyId - The ID of the story
 * @returns Object with resources grouped by type
 */
export function getExternalResourcesByType(storyId: number): Record<string, ExternalResource[]> {
  const resources = getExternalResources(storyId);
  return resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, ExternalResource[]>);
}
