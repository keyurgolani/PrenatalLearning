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
const DEFAULT_STYLE = "Calm, soothing, educational narration";
const DEFAULT_TEMP = 1;
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
  { key: 'networkJourneyStory', file: '../apps/web/src/data/stories/network-journey-story.ts' },
  { key: 'subconsciousMindStory', file: '../apps/web/src/data/stories/subconscious-mind-story.ts' },
  { key: 'llmStory', file: '../apps/web/src/data/stories/llm-story.ts' },
];

/**
 * Format text for Google TTS (single line)
 */
function formatForTTS(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove markdown bold
    .replace(/—/g, ';')               // Em-dashes to semicolons
    .replace(/\n+/g, ' ')             // Newlines to spaces
    .replace(/\s+/g, ' ')             // Multiple spaces to single
    .trim();
}

/**
 * Check if a file exists
 */
function fileExists(dir: string, filename: string): boolean {
  return fs.existsSync(path.join(dir, filename));
}

// Keep imageFileExists for backward compatibility with generateImageManifest
const imageFileExists = fileExists;

/**
 * Generate audio manifest for a story
 */
function generateAudioManifest(story: StoryContent, storyDir: string): string {
  const lines: string[] = [];
  
  lines.push(`# Audio Manifest for Story ${story.id}: ${story.title}`);
  lines.push(`# Format: sectionName|partNumber|filename|styleInstructions|temperature|transcript`);
  lines.push(`#`);
  lines.push(`# Google TTS Manifest`);
  lines.push(`# All audio parts for a section are merged into a single file/entry.`);
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
    const transcript = formatForTTS(section.content);
    const filename = `${section.name}.mp3`;
    const label = SECTION_LABELS[section.name];
    
    // Check if file exists
    const exists = fileExists(storyDir, filename);
    const prefix = exists ? '' : '# ';

    lines.push('');
    lines.push(`# === ${label} ===`);
    lines.push(`${prefix}${section.name}|1|${filename}|${DEFAULT_STYLE}|${DEFAULT_TEMP}|${transcript}`);
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
