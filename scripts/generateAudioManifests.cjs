/**
 * Audio Manifest Generator Script
 *
 * Generates manifest.txt files for all stories with Speechma-compatible formatting.
 * 
 * Run with: node scripts/generateAudioManifests.js
 */

const fs = require('fs');
const path = require('path');

/**
 * Convert narrative text to Speechma-compatible format
 */
function formatForSpeechma(text) {
  return text
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
    // Remove curly quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .trim();
}

/**
 * Extract narrative sections from a story file
 */
function extractNarrativeFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the narrative object using regex
  const narrativeMatch = content.match(/narrative:\s*\{([\s\S]*?)\n\s*\},\s*\n\s*keyConcepts/);
  if (!narrativeMatch) {
    console.error(`Could not extract narrative from ${filePath}`);
    return null;
  }

  const narrativeBlock = narrativeMatch[1];

  // Extract each section
  const extractSection = (sectionName) => {
    const regex = new RegExp(`${sectionName}:\\s*\`([\\s\\S]*?)\``, 'm');
    const match = narrativeBlock.match(regex);
    return match ? match[1] : '';
  };

  return {
    introduction: extractSection('introduction'),
    coreContent: extractSection('coreContent'),
    interactiveSection: extractSection('interactiveSection'),
    integration: extractSection('integration'),
  };
}

/**
 * Get story title from file
 */
function extractTitleFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const titleMatch = content.match(/title:\s*['"](.+?)['"]/);
  return titleMatch ? titleMatch[1] : 'Unknown Story';
}

/**
 * Generate manifest content for a story
 */
function generateManifest(storyId, title, narrative) {
  const introTranscript = formatForSpeechma(narrative.introduction);
  const coreTranscript = formatForSpeechma(narrative.coreContent);
  const interactiveTranscript = formatForSpeechma(narrative.interactiveSection);
  const integrationTranscript = formatForSpeechma(narrative.integration);

  return `# Audio Manifest for Story ${storyId}: ${title}
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

// Story file mappings
const storyFiles = [
  { id: 1, file: 'big-bang-story.ts' },
  { id: 2, file: 'gravity-story.ts' },
  { id: 3, file: 'quantum-story.ts' },
  { id: 4, file: 'stars-story.ts' },
  { id: 5, file: 'computer-story.ts' },
  { id: 6, file: 'ai-story.ts' },
  { id: 7, file: 'blockchain-story.ts' },
  { id: 8, file: 'internet-story.ts' },
  { id: 9, file: 'dna-story.ts' },
  { id: 10, file: 'body-systems-story.ts' },
  { id: 11, file: 'microbiome-story.ts' },
  { id: 12, file: 'evolution-story.ts' },
  { id: 13, file: 'numbers-story.ts' },
  { id: 14, file: 'infinity-story.ts' },
  { id: 15, file: 'fibonacci-story.ts' },
  { id: 16, file: 'probability-story.ts' },
  { id: 17, file: 'consciousness-story.ts' },
  { id: 18, file: 'emotions-story.ts' },
  { id: 19, file: 'memory-story.ts' },
  { id: 20, file: 'growth-mindset-story.ts' },
  { id: 21, file: 'language-story.ts' },
  { id: 22, file: 'sanskrit-story.ts' },
  { id: 23, file: 'music-story.ts' },
  { id: 24, file: 'body-language-story.ts' },
  { id: 25, file: 'money-story.ts' },
  { id: 26, file: 'markets-story.ts' },
  { id: 27, file: 'cryptocurrency-story.ts' },
  { id: 28, file: 'wealth-story.ts' },
  { id: 29, file: 'diversity-story.ts' },
  { id: 30, file: 'ethics-story.ts' },
  { id: 31, file: 'democracy-story.ts' },
  { id: 32, file: 'art-story.ts' },
];

function main() {
  const storiesDir = path.join(__dirname, '..', 'src', 'data', 'stories');
  const audioBaseDir = path.join(__dirname, '..', 'public', 'audio', 'stories');

  console.log('Generating audio manifests for all stories...\n');

  let successCount = 0;

  for (const { id, file } of storyFiles) {
    const storyPath = path.join(storiesDir, file);
    
    if (!fs.existsSync(storyPath)) {
      console.log(`⚠ Story file not found: ${file}`);
      continue;
    }

    const title = extractTitleFromFile(storyPath);
    const narrative = extractNarrativeFromFile(storyPath);

    if (!narrative) {
      console.log(`⚠ Could not extract narrative from: ${file}`);
      continue;
    }

    const storyDir = path.join(audioBaseDir, String(id));
    const manifestPath = path.join(storyDir, 'manifest.txt');

    // Ensure directory exists
    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    // Generate and write manifest
    const manifestContent = generateManifest(id, title, narrative);
    fs.writeFileSync(manifestPath, manifestContent, 'utf-8');

    console.log(`✓ Story ${id}: ${title}`);
    successCount++;
  }

  console.log(`\n✅ Successfully generated ${successCount} audio manifests.`);
  console.log('\nNext steps:');
  console.log('1. Review the generated manifest.txt files');
  console.log('2. Use Speechma to generate audio from the transcripts');
  console.log('3. Uncomment entries in manifest.txt as audio files are created');
}

main();
