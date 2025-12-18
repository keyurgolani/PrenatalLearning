/**
 * Audio Manifest Generator Script
 *
 * Generates manifest.txt files for all stories with Speechma-compatible formatting.
 * 
 * Pauses controlled by punctuation (Speechma TTS):
 * - Comma (,) = short pause (~0.5s)
 * - Semicolon (;) = medium pause (~1s)
 * - Exclamation mark (!) = longer pause (~1.5s)
 *
 * Run with: npx ts-node scripts/generateAudioManifests.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import all story content
import { bigBangStory } from '../src/data/stories/big-bang-story';
import { gravityStory } from '../src/data/stories/gravity-story';
import { quantumStory } from '../src/data/stories/quantum-story';
import { starsStory } from '../src/data/stories/stars-story';
import { computerStory } from '../src/data/stories/computer-story';
import { aiStory } from '../src/data/stories/ai-story';
import { blockchainStory } from '../src/data/stories/blockchain-story';
import { internetStory } from '../src/data/stories/internet-story';
import { dnaStory } from '../src/data/stories/dna-story';
import { bodySystemsStory } from '../src/data/stories/body-systems-story';
import { microbiomeStory } from '../src/data/stories/microbiome-story';
import { evolutionStory } from '../src/data/stories/evolution-story';
import { numbersStory } from '../src/data/stories/numbers-story';
import { infinityStory } from '../src/data/stories/infinity-story';
import { fibonacciStory } from '../src/data/stories/fibonacci-story';
import { probabilityStory } from '../src/data/stories/probability-story';
import { consciousnessStory } from '../src/data/stories/consciousness-story';
import { emotionsStory } from '../src/data/stories/emotions-story';
import { memoryStory } from '../src/data/stories/memory-story';
import { growthMindsetStory } from '../src/data/stories/growth-mindset-story';
import { languageStory } from '../src/data/stories/language-story';
import { sanskritStory } from '../src/data/stories/sanskrit-story';
import { musicStory } from '../src/data/stories/music-story';
import { bodyLanguageStory } from '../src/data/stories/body-language-story';
import { moneyStory } from '../src/data/stories/money-story';
import { marketsStory } from '../src/data/stories/markets-story';
import { cryptocurrencyStory } from '../src/data/stories/cryptocurrency-story';
import { wealthStory } from '../src/data/stories/wealth-story';
import { diversityStory } from '../src/data/stories/diversity-story';
import { ethicsStory } from '../src/data/stories/ethics-story';
import { democracyStory } from '../src/data/stories/democracy-story';
import { artStory } from '../src/data/stories/art-story';

interface StoryData {
  id: number;
  title: string;
  narrative: {
    introduction: string;
    coreContent: string;
    interactiveSection: string;
    integration: string;
  };
}

const stories: StoryData[] = [
  bigBangStory,
  gravityStory,
  quantumStory,
  starsStory,
  computerStory,
  aiStory,
  blockchainStory,
  internetStory,
  dnaStory,
  bodySystemsStory,
  microbiomeStory,
  evolutionStory,
  numbersStory,
  infinityStory,
  fibonacciStory,
  probabilityStory,
  consciousnessStory,
  emotionsStory,
  memoryStory,
  growthMindsetStory,
  languageStory,
  sanskritStory,
  musicStory,
  bodyLanguageStory,
  moneyStory,
  marketsStory,
  cryptocurrencyStory,
  wealthStory,
  diversityStory,
  ethicsStory,
  democracyStory,
  artStory,
];

/**
 * Convert narrative text to Speechma-compatible format
 * - Replace paragraph breaks with ! for longer pauses
 * - Replace em-dashes with semicolons for medium pauses
 * - Remove markdown formatting like **bold**
 * - Clean up for natural speech
 */
function formatForSpeechma(text: string): string {
  let formatted = text
    // Remove markdown bold markers, keep the text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    // Replace em-dashes with semicolons for medium pauses
    .replace(/—/g, ';')
    // Replace double newlines (paragraph breaks) with ! for longer pauses
    .replace(/\n\n+/g, '! ')
    // Replace single newlines with spaces
    .replace(/\n/g, ' ')
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    // Clean up punctuation spacing
    .replace(/\s+([.,;!?])/g, '$1')
    // Ensure space after punctuation
    .replace(/([.,;!?])([A-Za-z])/g, '$1 $2')
    // Remove any remaining special characters that might cause issues
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();

  return formatted;
}

/**
 * Generate manifest content for a story
 */
function generateManifest(story: StoryData): string {
  const introTranscript = formatForSpeechma(story.narrative.introduction);
  const coreTranscript = formatForSpeechma(story.narrative.coreContent);
  const interactiveTranscript = formatForSpeechma(story.narrative.interactiveSection);
  const integrationTranscript = formatForSpeechma(story.narrative.integration);

  return `# Audio Manifest for Story ${story.id}: ${story.title}
# Format: sectionName|filename|transcript
#
# Pauses controlled by punctuation (Speechma):
# - Comma (,) = short pause (~0.5s)
# - Semicolon (;) = medium pause (~1s)
# - Exclamation mark (!) = longer pause (~1.5s)
#

# === INTRODUCTION ===
# introduction|introduction.mp3|${introTranscript}

# === CORE CONTENT ===
# coreContent|coreContent.mp3|${coreTranscript}

# === INTERACTIVE SECTION ===
# interactiveSection|interactiveSection.mp3|${interactiveTranscript}

# === INTEGRATION ===
# integration|integration.mp3|${integrationTranscript}
`;
}

/**
 * Main function to generate all manifests
 */
function main() {
  const audioBaseDir = path.join(__dirname, '..', 'public', 'audio', 'stories');

  console.log('Generating audio manifests for all stories...\n');

  for (const story of stories) {
    const storyDir = path.join(audioBaseDir, String(story.id));
    const manifestPath = path.join(storyDir, 'manifest.txt');

    // Ensure directory exists
    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    // Generate and write manifest
    const manifestContent = generateManifest(story);
    fs.writeFileSync(manifestPath, manifestContent, 'utf-8');

    console.log(`✓ Generated manifest for Story ${story.id}: ${story.title}`);
  }

  console.log(`\n✅ Successfully generated ${stories.length} audio manifests.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated manifest.txt files');
  console.log('2. Use Speechma to generate audio from the transcripts');
  console.log('3. Uncomment entries in manifest.txt as audio files are created');
}

main();
