/**
 * Script to update audio manifest files to the new multi-part format
 * 
 * Old format: sectionName|filename|transcript
 * New format: sectionName|partNumber|filename|transcript
 * 
 * Splits transcripts into ~2000 character parts for Speechma's limit
 */

import * as fs from 'fs';
import * as path from 'path';

const CHAR_LIMIT = 2000;
const AUDIO_DIR = path.join(process.cwd(), 'public/audio/stories');

interface ManifestEntry {
  sectionName: string;
  transcript: string;
}

interface OutputEntry {
  sectionName: string;
  partNumber: number;
  filename: string;
  transcript: string;
}

/**
 * Split text into chunks of approximately maxChars, breaking at sentence boundaries
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

    // Find a good break point (sentence ending with ! or . or ;)
    let breakPoint = maxChars;
    
    // Look for sentence endings within the limit
    const searchArea = remaining.substring(0, maxChars);
    
    // Prefer breaking at ! (longer pause), then . then ;
    const lastExclamation = searchArea.lastIndexOf('!');
    const lastPeriod = searchArea.lastIndexOf('.');
    const lastSemicolon = searchArea.lastIndexOf(';');
    
    // Find the best break point (closest to limit but not over)
    const candidates = [lastExclamation, lastPeriod, lastSemicolon].filter(i => i > maxChars * 0.5);
    
    if (candidates.length > 0) {
      breakPoint = Math.max(...candidates) + 1;
    } else {
      // If no good sentence break, look for any punctuation
      const anyBreak = Math.max(lastExclamation, lastPeriod, lastSemicolon);
      if (anyBreak > maxChars * 0.3) {
        breakPoint = anyBreak + 1;
      }
      // Otherwise just break at the limit (shouldn't happen with well-formatted text)
    }

    chunks.push(remaining.substring(0, breakPoint).trim());
    remaining = remaining.substring(breakPoint).trim();
  }

  return chunks;
}

/**
 * Parse old format manifest and extract entries
 */
function parseOldManifest(content: string): ManifestEntry[] {
  const entries: ManifestEntry[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and pure comments
    if (!trimmed || trimmed.startsWith('# ===') || trimmed === '#') continue;
    
    // Handle commented-out entries (# sectionName|filename|transcript)
    let dataLine = trimmed;
    if (trimmed.startsWith('# ') && trimmed.includes('|')) {
      dataLine = trimmed.substring(2);
    } else if (!trimmed.includes('|')) {
      continue;
    }

    const parts = dataLine.split('|');
    if (parts.length >= 3) {
      const sectionName = parts[0].trim();
      // Skip if section name starts with # (it's a comment about format)
      if (sectionName.startsWith('#')) continue;
      
      const transcript = parts.slice(2).join('|').trim(); // Join in case transcript has |
      
      if (['introduction', 'coreContent', 'interactiveSection', 'integration'].includes(sectionName)) {
        entries.push({ sectionName, transcript });
      }
    }
  }

  return entries;
}

/**
 * Generate new format manifest content
 */
function generateNewManifest(storyId: string, storyTitle: string, entries: ManifestEntry[]): string {
  const output: string[] = [];
  
  output.push(`# Audio Manifest for Story ${storyId}: ${storyTitle}`);
  output.push(`# Format: sectionName|partNumber|filename|transcript`);
  output.push(`#`);
  output.push(`# Due to Speechma's 2000 character limit, long sections are split into multiple parts.`);
  output.push(`# Parts are numbered starting from 1 and played sequentially.`);
  output.push(`#`);
  output.push(`# Pauses controlled by punctuation (Speechma):`);
  output.push(`# - Comma (,) = short pause (~0.5s)`);
  output.push(`# - Semicolon (;) = medium pause (~1s)`);
  output.push(`# - Exclamation mark (!) = longer pause (~1.5s)`);
  output.push(`#`);

  const sectionLabels: Record<string, string> = {
    introduction: 'INTRODUCTION',
    coreContent: 'CORE CONTENT',
    interactiveSection: 'INTERACTIVE SECTION',
    integration: 'INTEGRATION'
  };

  for (const entry of entries) {
    const chunks = splitIntoChunks(entry.transcript, CHAR_LIMIT);
    const label = sectionLabels[entry.sectionName] || entry.sectionName.toUpperCase();
    
    output.push('');
    output.push(`# === ${label} ===`);
    
    if (chunks.length === 1) {
      // Single part - use simple filename
      const filename = `${entry.sectionName}.mp3`;
      output.push(`${entry.sectionName}|1|${filename}|${chunks[0]}`);
    } else {
      // Multiple parts
      chunks.forEach((chunk, index) => {
        const partNum = index + 1;
        const filename = `${entry.sectionName}-part${partNum}.mp3`;
        output.push(`# Part ${partNum} (~${chunk.length} chars)`);
        output.push(`${entry.sectionName}|${partNum}|${filename}|${chunk}`);
      });
    }
  }

  return output.join('\n');
}

/**
 * Extract story title from manifest content
 */
function extractStoryTitle(content: string): string {
  const match = content.match(/# Audio Manifest for Story \d+: (.+)/);
  return match ? match[1] : 'Unknown Story';
}

/**
 * Process a single manifest file
 */
function processManifest(storyDir: string): void {
  const manifestPath = path.join(storyDir, 'manifest.txt');
  
  if (!fs.existsSync(manifestPath)) {
    console.log(`Skipping ${storyDir} - no manifest.txt`);
    return;
  }

  const storyId = path.basename(storyDir);
  const content = fs.readFileSync(manifestPath, 'utf-8');
  
  // Check if already in new format (has partNumber)
  if (content.includes('|1|') && content.includes('partNumber')) {
    console.log(`Skipping story ${storyId} - already in new format`);
    return;
  }

  const storyTitle = extractStoryTitle(content);
  const entries = parseOldManifest(content);
  
  if (entries.length === 0) {
    console.log(`Skipping story ${storyId} - no valid entries found`);
    return;
  }

  const newContent = generateNewManifest(storyId, storyTitle, entries);
  fs.writeFileSync(manifestPath, newContent);
  
  console.log(`Updated story ${storyId}: ${entries.length} sections processed`);
  
  // Log part counts
  for (const entry of entries) {
    const chunks = splitIntoChunks(entry.transcript, CHAR_LIMIT);
    if (chunks.length > 1) {
      console.log(`  - ${entry.sectionName}: ${chunks.length} parts`);
    }
  }
}

/**
 * Main function
 */
function main(): void {
  console.log('Updating audio manifests to new multi-part format...\n');
  
  const storyDirs = fs.readdirSync(AUDIO_DIR)
    .filter(name => /^\d+$/.test(name))
    .map(name => path.join(AUDIO_DIR, name))
    .sort((a, b) => parseInt(path.basename(a)) - parseInt(path.basename(b)));

  for (const storyDir of storyDirs) {
    processManifest(storyDir);
  }

  console.log('\nDone!');
}

main();
