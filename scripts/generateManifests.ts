#!/usr/bin/env npx tsx
/**
 * Manifest Generator Script
 * 
 * Generates manifest.txt files for all stories (audio and image).
 * - Entries are commented out by default
 * - Entries are automatically uncommented if the corresponding file exists
 * 
 * Usage: npx tsx scripts/generateManifests.ts [--audio-only] [--image-only]
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const CHAR_LIMIT = 2000; // Speechma's character limit
const PROJECT_ROOT = path.resolve(__dirname, '..');
const AUDIO_BASE_DIR = path.join(PROJECT_ROOT, 'apps', 'web', 'public', 'audio', 'stories');
const IMAGE_BASE_DIR = path.join(PROJECT_ROOT, 'apps', 'web', 'public', 'images', 'stories');

// Types
interface Analogy {
  concept: string;
  analogy: string;
}

interface StoryContent {
  id: number;
  title: string;
  narrative: {
    introduction: string;
    coreContent: string;
    interactiveSection: string;
    integration: string;
  };
  keyConcepts?: string[];
  analogies?: (string | Analogy)[];
}

type SectionName = 'introduction' | 'coreContent' | 'interactiveSection' | 'integration';

const SECTION_LABELS: Record<SectionName, string> = {
  introduction: 'INTRODUCTION',
  coreContent: 'CORE CONTENT',
  interactiveSection: 'INTERACTIVE SECTION',
  integration: 'INTEGRATION',
};

const SECTION_ABBREVS: Record<SectionName, string> = {
  introduction: 'intro',
  coreContent: 'core',
  interactiveSection: 'interactive',
  integration: 'integration',
};


// Story imports mapping
const STORY_IMPORTS = [
  { key: 'bigBangStory', file: '../apps/web/src/data/stories/big-bang-story.ts' },
  { key: 'gravityStory', file: '../apps/web/src/data/stories/gravity-story.ts' },
  { key: 'quantumStory', file: '../apps/web/src/data/stories/quantum-story.ts' },
  { key: 'starsStory', file: '../apps/web/src/data/stories/stars-story.ts' },
  { key: 'computerStory', file: '../apps/web/src/data/stories/computer-story.ts' },
  { key: 'aiStory', file: '../apps/web/src/data/stories/ai-story.ts' },
  { key: 'blockchainStory', file: '../apps/web/src/data/stories/blockchain-story.ts' },
  { key: 'internetStory', file: '../apps/web/src/data/stories/internet-story.ts' },
  { key: 'dnaStory', file: '../apps/web/src/data/stories/dna-story.ts' },
  { key: 'bodySystemsStory', file: '../apps/web/src/data/stories/body-systems-story.ts' },
  { key: 'microbiomeStory', file: '../apps/web/src/data/stories/microbiome-story.ts' },
  { key: 'evolutionStory', file: '../apps/web/src/data/stories/evolution-story.ts' },
  { key: 'numbersStory', file: '../apps/web/src/data/stories/numbers-story.ts' },
  { key: 'infinityStory', file: '../apps/web/src/data/stories/infinity-story.ts' },
  { key: 'fibonacciStory', file: '../apps/web/src/data/stories/fibonacci-story.ts' },
  { key: 'probabilityStory', file: '../apps/web/src/data/stories/probability-story.ts' },
  { key: 'consciousnessStory', file: '../apps/web/src/data/stories/consciousness-story.ts' },
  { key: 'emotionsStory', file: '../apps/web/src/data/stories/emotions-story.ts' },
  { key: 'memoryStory', file: '../apps/web/src/data/stories/memory-story.ts' },
  { key: 'growthMindsetStory', file: '../apps/web/src/data/stories/growth-mindset-story.ts' },
  { key: 'languageStory', file: '../apps/web/src/data/stories/language-story.ts' },
  { key: 'sanskritStory', file: '../apps/web/src/data/stories/sanskrit-story.ts' },
  { key: 'musicStory', file: '../apps/web/src/data/stories/music-story.ts' },
  { key: 'bodyLanguageStory', file: '../apps/web/src/data/stories/body-language-story.ts' },
  { key: 'moneyStory', file: '../apps/web/src/data/stories/money-story.ts' },
  { key: 'marketsStory', file: '../apps/web/src/data/stories/markets-story.ts' },
  { key: 'cryptocurrencyStory', file: '../apps/web/src/data/stories/cryptocurrency-story.ts' },
  { key: 'wealthStory', file: '../apps/web/src/data/stories/wealth-story.ts' },
  { key: 'diversityStory', file: '../apps/web/src/data/stories/diversity-story.ts' },
  { key: 'ethicsStory', file: '../apps/web/src/data/stories/ethics-story.ts' },
  { key: 'democracyStory', file: '../apps/web/src/data/stories/democracy-story.ts' },
  { key: 'artStory', file: '../apps/web/src/data/stories/art-story.ts' },
];

/**
 * Format text for Speechma TTS
 */
function formatForSpeechma(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove markdown bold
    .replace(/—/g, ';')               // Em-dashes to semicolons
    .replace(/\n\n+/g, '! ')          // Paragraph breaks to longer pauses
    .replace(/\n/g, ' ')              // Single newlines to spaces
    .replace(/\s+/g, ' ')             // Multiple spaces to single
    .replace(/\s+([.,;!?])/g, '$1')   // Clean punctuation spacing
    .replace(/([.,;!?])([A-Za-z])/g, '$1 $2')  // Space after punctuation
    .replace(/[""]/g, '"')            // Normalize quotes
    .replace(/['']/g, "'")
    .trim();
}

/**
 * Split text into chunks respecting Speechma's character limit
 */
function splitIntoChunks(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      chunks.push(remaining.trim());
      break;
    }

    // Find best break point at sentence endings
    const searchArea = remaining.substring(0, maxChars);
    const lastExclamation = searchArea.lastIndexOf('!');
    const lastPeriod = searchArea.lastIndexOf('.');
    const lastSemicolon = searchArea.lastIndexOf(';');
    
    const candidates = [lastExclamation, lastPeriod, lastSemicolon].filter(i => i > maxChars * 0.5);
    let breakPoint = maxChars;
    
    if (candidates.length > 0) {
      breakPoint = Math.max(...candidates) + 1;
    } else {
      const anyBreak = Math.max(lastExclamation, lastPeriod, lastSemicolon);
      if (anyBreak > maxChars * 0.3) {
        breakPoint = anyBreak + 1;
      }
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks;
}


/**
 * Check if an audio file exists, trying multiple naming conventions
 */
function findAudioFile(storyDir: string, sectionName: string, partNum: number, totalParts: number): { exists: boolean; filename: string } {
  if (totalParts === 1) {
    // Try simple name first, then part1 name
    const simpleFilename = `${sectionName}.mp3`;
    const partFilename = `${sectionName}-part1.mp3`;
    
    if (fs.existsSync(path.join(storyDir, simpleFilename))) {
      return { exists: true, filename: simpleFilename };
    }
    if (fs.existsSync(path.join(storyDir, partFilename))) {
      return { exists: true, filename: partFilename };
    }
    return { exists: false, filename: simpleFilename };
  }
  
  const filename = `${sectionName}-part${partNum}.mp3`;
  const exists = fs.existsSync(path.join(storyDir, filename));
  return { exists, filename };
}

/**
 * Check if an image file exists
 */
function imageFileExists(storyDir: string, filename: string): boolean {
  return fs.existsSync(path.join(storyDir, filename));
}

/**
 * Generate audio manifest for a story
 */
function generateAudioManifest(story: StoryContent, storyDir: string): string {
  const lines: string[] = [];
  
  lines.push(`# Audio Manifest for Story ${story.id}: ${story.title}`);
  lines.push(`# Format: sectionName|partNumber|filename|transcript`);
  lines.push(`#`);
  lines.push(`# Due to Speechma's 2000 character limit, long sections are split into multiple parts.`);
  lines.push(`# Parts are numbered starting from 1 and played sequentially.`);
  lines.push(`#`);
  lines.push(`# Pauses controlled by punctuation (Speechma):`);
  lines.push(`# - Comma (,) = short pause (~0.5s)`);
  lines.push(`# - Semicolon (;) = medium pause (~1s)`);
  lines.push(`# - Exclamation mark (!) = longer pause (~1.5s)`);
  lines.push(`#`);
  lines.push(`# IMPORTANT: Entries are commented out by default.`);
  lines.push(`# Uncomment an entry (remove the leading #) ONLY when the audio file exists.`);
  lines.push(`#`);

  const sections: { name: SectionName; content: string }[] = [
    { name: 'introduction', content: story.narrative.introduction },
    { name: 'coreContent', content: story.narrative.coreContent },
    { name: 'interactiveSection', content: story.narrative.interactiveSection },
    { name: 'integration', content: story.narrative.integration },
  ];

  for (const section of sections) {
    const transcript = formatForSpeechma(section.content);
    const chunks = splitIntoChunks(transcript, CHAR_LIMIT);
    const label = SECTION_LABELS[section.name];
    
    lines.push('');
    lines.push(`# === ${label} ===`);
    
    if (chunks.length === 1) {
      const { exists, filename } = findAudioFile(storyDir, section.name, 1, 1);
      const prefix = exists ? '' : '# ';
      lines.push(`${prefix}${section.name}|1|${filename}|${chunks[0]}`);
    } else {
      chunks.forEach((chunk, index) => {
        const partNum = index + 1;
        const { exists, filename } = findAudioFile(storyDir, section.name, partNum, chunks.length);
        const prefix = exists ? '' : '# ';
        lines.push(`# Part ${partNum} (~${chunk.length} chars)`);
        lines.push(`${prefix}${section.name}|${partNum}|${filename}|${chunk}`);
      });
    }
  }

  return lines.join('\n');
}


/**
 * Clean text for image manifest (truncate if needed)
 */
function cleanTextForManifest(text: string, maxLength = 200): string {
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength - 3) + '...';
  }
  return cleaned;
}

/**
 * Generate image manifest for a story
 */
function generateImageManifest(story: StoryContent, storyDir: string): string {
  const lines: string[] = [];

  lines.push(`# Image Manifest for Story ${story.id}: ${story.title}`);
  lines.push('# Format: sectionName|position|filename|altText|caption');
  lines.push('#');
  lines.push('# Instructions:');
  lines.push('# 1. Create images based on the suggested descriptions below');
  lines.push('# 2. Save image files with the suggested filenames (or update the filename field)');
  lines.push(`# 3. Place image files in public/images/stories/${story.id}/`);
  lines.push('# 4. Remove the # prefix from lines you have created images for to activate them');
  lines.push('# 5. Position options: before, after, inline');
  lines.push('#');
  lines.push('# IMPORTANT: Entries are commented out by default.');
  lines.push('# Uncomment an entry (remove the leading #) ONLY when the image file exists.');
  lines.push('#');
  lines.push('');

  // Generate suggestions from analogies
  if (story.analogies && story.analogies.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM ANALOGIES ===');
    lines.push('');

    story.analogies.forEach((analogy, index) => {
      let concept: string;
      let description: string;
      
      if (typeof analogy === 'string') {
        concept = 'Analogy';
        description = analogy;
      } else {
        concept = analogy.concept;
        description = analogy.analogy;
      }
      
      const filename = `analogy-${index}.png`;
      const altText = `Illustration of ${concept}`;
      const caption = cleanTextForManifest(description);
      const exists = imageFileExists(storyDir, filename);
      const prefix = exists ? '' : '# ';
      lines.push(`${prefix}coreContent|after|${filename}|${altText}|${caption}`);
    });
    
    lines.push('');
  }

  // Generate suggestions from key concepts
  if (story.keyConcepts && story.keyConcepts.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM KEY CONCEPTS ===');
    lines.push('');

    story.keyConcepts.forEach((concept, index) => {
      const filename = `concept-${index}.png`;
      const altText = `Illustration of: ${cleanTextForManifest(concept, 100)}`;
      const caption = cleanTextForManifest(concept);
      const exists = imageFileExists(storyDir, filename);
      const prefix = exists ? '' : '# ';
      lines.push(`${prefix}coreContent|inline|${filename}|${altText}|${caption}`);
    });
    
    lines.push('');
  }

  // Section-specific placeholder suggestions
  lines.push('# === SECTION-SPECIFIC IMAGES ===');
  lines.push('');

  const sections: SectionName[] = ['introduction', 'coreContent', 'interactiveSection', 'integration'];
  
  sections.forEach((sectionName) => {
    const abbrev = SECTION_ABBREVS[sectionName];
    const filename = `${abbrev}-img0.png`;
    const exists = imageFileExists(storyDir, filename);
    const prefix = exists ? '' : '# ';
    lines.push(`${prefix}${sectionName}|before|${filename}|[Add alt text for ${sectionName} image]|[Optional caption]`);
  });
  
  lines.push('');

  return lines.join('\n');
}


/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const audioOnly = args.includes('--audio-only');
  const imageOnly = args.includes('--image-only');
  const generateAudio = !imageOnly;
  const generateImages = !audioOnly;

  console.log('Generating manifest files for all stories...');
  if (audioOnly) console.log('(Audio manifests only)');
  if (imageOnly) console.log('(Image manifests only)');
  console.log('');

  // Load all stories
  const storyModules = await Promise.all(
    STORY_IMPORTS.map(({ file }) => import(file))
  );

  let audioCount = 0;
  let imageCount = 0;

  for (let i = 0; i < storyModules.length; i++) {
    const storyModule = storyModules[i];
    const storyKey = STORY_IMPORTS[i].key;
    const story = storyModule[storyKey] as StoryContent;

    if (!story) {
      console.warn(`Warning: Could not find story export '${storyKey}'`);
      continue;
    }

    const storyId = String(story.id);

    // Generate audio manifest
    if (generateAudio) {
      const audioDir = path.join(AUDIO_BASE_DIR, storyId);
      
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const audioManifest = generateAudioManifest(story, audioDir);
      fs.writeFileSync(path.join(audioDir, 'manifest.txt'), audioManifest, 'utf-8');
      audioCount++;
      console.log(`✓ Audio manifest: Story ${storyId} - ${story.title}`);
    }

    // Generate image manifest
    if (generateImages) {
      const imageDir = path.join(IMAGE_BASE_DIR, storyId);
      
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
      }
      
      const imageManifest = generateImageManifest(story, imageDir);
      fs.writeFileSync(path.join(imageDir, 'manifest.txt'), imageManifest, 'utf-8');
      imageCount++;
      console.log(`✓ Image manifest: Story ${storyId} - ${story.title}`);
    }
  }

  console.log('');
  if (generateAudio) console.log(`✅ Generated ${audioCount} audio manifests`);
  if (generateImages) console.log(`✅ Generated ${imageCount} image manifests`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Add audio/image files to the appropriate directories');
  console.log('2. Re-run this script to automatically uncomment entries for existing files');
}

main().catch(console.error);
