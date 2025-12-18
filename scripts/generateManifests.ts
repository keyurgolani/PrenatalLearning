#!/usr/bin/env npx tsx
/**
 * Manifest Generator Script
 * 
 * Generates template manifest.txt files for all 32 stories.
 * Audio manifests include all paragraph text with suggested filenames.
 * Image manifests include suggested descriptions based on analogies.
 * 
 * Requirements:
 * - 7.3: THE audio manifest template SHALL include all paragraph text from the story content
 * - 7.4: THE visual manifest template SHALL include suggested image descriptions based on story analogies
 * 
 * Usage: npx tsx scripts/generateManifests.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Types matching the story structure
interface Analogy {
  concept: string;
  analogy: string;
}

interface StoryContent {
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
}

type SectionName = 'introduction' | 'coreContent' | 'interactiveSection' | 'integration';

const SECTION_ABBREVIATIONS: Record<SectionName, string> = {
  introduction: 'intro',
  coreContent: 'core',
  interactiveSection: 'interactive',
  integration: 'integration',
};

/**
 * Split text into paragraphs
 */
function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Clean text for manifest entry
 */
function cleanTextForManifest(text: string, maxLength = 500): string {
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength - 3) + '...';
  }
  return cleaned;
}

/**
 * Generate audio manifest template for a story
 */
function generateAudioManifestTemplate(story: StoryContent): string {
  const lines: string[] = [];

  lines.push(`# Audio Manifest for Story ${story.id}: ${story.title}`);
  lines.push('# Format: sectionName|paragraphIndex|filename|transcriptText');
  lines.push('#');
  lines.push('# Instructions:');
  lines.push('# 1. Record audio for each paragraph below');
  lines.push('# 2. Save audio files with the suggested filenames (or update the filename field)');
  lines.push(`# 3. Place audio files in public/audio/stories/${story.id}/`);
  lines.push('# 4. Remove the # from lines you have recorded');
  lines.push('#');
  lines.push('');

  const sections: { name: SectionName; content: string }[] = [
    { name: 'introduction', content: story.narrative.introduction },
    { name: 'coreContent', content: story.narrative.coreContent },
    { name: 'interactiveSection', content: story.narrative.interactiveSection },
    { name: 'integration', content: story.narrative.integration },
  ];

  for (const section of sections) {
    lines.push(`# === ${section.name.toUpperCase()} ===`);
    const paragraphs = splitIntoParagraphs(section.content);
    
    paragraphs.forEach((paragraph, index) => {
      const abbrev = SECTION_ABBREVIATIONS[section.name];
      const filename = `${abbrev}-p${index}.mp3`;
      const transcript = cleanTextForManifest(paragraph);
      lines.push(`# ${section.name}|${index}|${filename}|${transcript}`);
    });
    
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generate image manifest template for a story
 */
function generateImageManifestTemplate(story: StoryContent): string {
  const lines: string[] = [];

  lines.push(`# Image Manifest for Story ${story.id}: ${story.title}`);
  lines.push('# Format: sectionName|position|filename|altText|caption');
  lines.push('#');
  lines.push('# Instructions:');
  lines.push('# 1. Create images based on the suggested descriptions below');
  lines.push('# 2. Save image files with the suggested filenames (or update the filename field)');
  lines.push(`# 3. Place image files in public/images/stories/${story.id}/`);
  lines.push('# 4. Remove the # from lines you have created images for');
  lines.push('# 5. Position options: before, after, inline');
  lines.push('#');
  lines.push('');

  // Generate suggestions from analogies
  if (story.analogies && story.analogies.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM ANALOGIES ===');
    lines.push('# These images would help visualize the key analogies in the story');
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
      
      const altText = `Illustration of ${concept}`;
      const caption = cleanTextForManifest(description, 200);
      lines.push(`# coreContent|after|analogy-${index}.png|${altText}|${caption}`);
    });
    
    lines.push('');
  }

  // Generate suggestions from key concepts
  if (story.keyConcepts && story.keyConcepts.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM KEY CONCEPTS ===');
    lines.push('# These images would help illustrate the main concepts');
    lines.push('');

    story.keyConcepts.forEach((concept, index) => {
      const altText = `Illustration of: ${cleanTextForManifest(concept, 100)}`;
      const caption = cleanTextForManifest(concept, 200);
      lines.push(`# coreContent|inline|concept-${index}.png|${altText}|${caption}`);
    });
    
    lines.push('');
  }

  // Add section-specific placeholder suggestions
  lines.push('# === SECTION-SPECIFIC IMAGES ===');
  lines.push('# Add images for specific sections as needed');
  lines.push('');

  const sections: SectionName[] = ['introduction', 'coreContent', 'interactiveSection', 'integration'];
  
  sections.forEach((sectionName) => {
    const abbrev = SECTION_ABBREVIATIONS[sectionName];
    lines.push(`# ${sectionName}|before|${abbrev}-img0.png|[Add alt text for ${sectionName} image]|[Optional caption for ${sectionName} image]`);
  });
  
  lines.push('');

  return lines.join('\n');
}

/**
 * Main function to generate all manifest files
 */
async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const audioBaseDir = path.join(projectRoot, 'public', 'audio', 'stories');
  const imageBaseDir = path.join(projectRoot, 'public', 'images', 'stories');

  console.log('Generating manifest templates for all 32 stories...\n');

  // Dynamically import all story content
  const storyImports = await Promise.all([
    import('../src/data/stories/big-bang-story.js'),
    import('../src/data/stories/gravity-story.js'),
    import('../src/data/stories/quantum-story.js'),
    import('../src/data/stories/stars-story.js'),
    import('../src/data/stories/computer-story.js'),
    import('../src/data/stories/ai-story.js'),
    import('../src/data/stories/blockchain-story.js'),
    import('../src/data/stories/internet-story.js'),
    import('../src/data/stories/dna-story.js'),
    import('../src/data/stories/body-systems-story.js'),
    import('../src/data/stories/microbiome-story.js'),
    import('../src/data/stories/evolution-story.js'),
    import('../src/data/stories/numbers-story.js'),
    import('../src/data/stories/infinity-story.js'),
    import('../src/data/stories/fibonacci-story.js'),
    import('../src/data/stories/probability-story.js'),
    import('../src/data/stories/consciousness-story.js'),
    import('../src/data/stories/emotions-story.js'),
    import('../src/data/stories/memory-story.js'),
    import('../src/data/stories/growth-mindset-story.js'),
    import('../src/data/stories/language-story.js'),
    import('../src/data/stories/sanskrit-story.js'),
    import('../src/data/stories/music-story.js'),
    import('../src/data/stories/body-language-story.js'),
    import('../src/data/stories/money-story.js'),
    import('../src/data/stories/markets-story.js'),
    import('../src/data/stories/cryptocurrency-story.js'),
    import('../src/data/stories/wealth-story.js'),
    import('../src/data/stories/diversity-story.js'),
    import('../src/data/stories/ethics-story.js'),
    import('../src/data/stories/democracy-story.js'),
    import('../src/data/stories/art-story.js'),
  ]);

  const storyKeys = [
    'bigBangStory', 'gravityStory', 'quantumStory', 'starsStory',
    'computerStory', 'aiStory', 'blockchainStory', 'internetStory',
    'dnaStory', 'bodySystemsStory', 'microbiomeStory', 'evolutionStory',
    'numbersStory', 'infinityStory', 'fibonacciStory', 'probabilityStory',
    'consciousnessStory', 'emotionsStory', 'memoryStory', 'growthMindsetStory',
    'languageStory', 'sanskritStory', 'musicStory', 'bodyLanguageStory',
    'moneyStory', 'marketsStory', 'cryptocurrencyStory', 'wealthStory',
    'diversityStory', 'ethicsStory', 'democracyStory', 'artStory',
  ];

  let audioCount = 0;
  let imageCount = 0;

  for (let i = 0; i < storyImports.length; i++) {
    const storyModule = storyImports[i];
    const storyKey = storyKeys[i];
    const story = storyModule[storyKey] as StoryContent;

    if (!story) {
      console.warn(`Warning: Could not find story export '${storyKey}' in module ${i + 1}`);
      continue;
    }

    const storyId = story.id;
    
    // Generate audio manifest
    const audioDir = path.join(audioBaseDir, String(storyId));
    const audioManifestPath = path.join(audioDir, 'manifest.txt');
    
    // Ensure directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    const audioManifest = generateAudioManifestTemplate(story);
    fs.writeFileSync(audioManifestPath, audioManifest, 'utf-8');
    audioCount++;
    console.log(`✓ Generated audio manifest: public/audio/stories/${storyId}/manifest.txt`);

    // Generate image manifest
    const imageDir = path.join(imageBaseDir, String(storyId));
    const imageManifestPath = path.join(imageDir, 'manifest.txt');
    
    // Ensure directory exists
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    const imageManifest = generateImageManifestTemplate(story);
    fs.writeFileSync(imageManifestPath, imageManifest, 'utf-8');
    imageCount++;
    console.log(`✓ Generated image manifest: public/images/stories/${storyId}/manifest.txt`);
  }

  console.log(`\n✅ Successfully generated ${audioCount} audio manifests and ${imageCount} image manifests.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated manifest.txt files');
  console.log('2. Create audio/image files for each entry');
  console.log('3. Uncomment entries in manifest.txt as files are created');
}

main().catch(console.error);
