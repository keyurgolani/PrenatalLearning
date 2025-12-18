/**
 * Manifest service for loading and parsing audio/visual content manifests
 *
 * Requirements:
 * - 1.3: WHEN a manifest file exists, THE System SHALL parse it to identify available audio segments
 * - 1.4: THE manifest file SHALL contain entries in the format: {sectionName}|{filename}
 * - 4.3: WHEN a manifest file exists, THE System SHALL parse it to identify available visual assets
 * - 4.4: THE manifest file SHALL contain entries in the format: {sectionName}|{position}|{filename}|{altText}|{caption}
 */

import type {
  AudioManifestEntry,
  ImageManifestEntry,
  SectionName,
  ImagePosition,
} from '../types/media';

/** Valid section names for validation */
const VALID_SECTION_NAMES: SectionName[] = [
  'introduction',
  'coreContent',
  'interactiveSection',
  'integration',
];

/** Valid image positions for validation */
const VALID_IMAGE_POSITIONS: ImagePosition[] = ['before', 'after', 'inline'];

/**
 * Check if a string is a valid section name
 */
function isValidSectionName(value: string): value is SectionName {
  return VALID_SECTION_NAMES.includes(value as SectionName);
}

/**
 * Check if a string is a valid image position
 */
function isValidImagePosition(value: string): value is ImagePosition {
  return VALID_IMAGE_POSITIONS.includes(value as ImagePosition);
}

/**
 * Parse audio manifest content into structured entries
 *
 * Format: sectionName|partNumber|filename|transcript
 * Lines starting with # are comments and are ignored
 * Empty lines are ignored
 * 
 * Due to Speechma's 2000 character limit, sections are split into multiple parts.
 * Parts are numbered starting from 1 and played sequentially.
 *
 * @param content - Raw manifest file content
 * @returns Array of parsed audio manifest entries
 */
export function parseAudioManifest(content: string): AudioManifestEntry[] {
  const entries: AudioManifestEntry[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const parts = trimmedLine.split('|');

    // Audio manifest requires at least 3 parts: sectionName|partNumber|filename
    // Fourth part (transcript) is optional
    if (parts.length < 3) {
      console.warn(`Invalid audio manifest line (expected at least 3 parts): ${trimmedLine}`);
      continue;
    }

    const [sectionName, partNumberStr, filename, transcript] = parts;

    // Validate section name
    if (!isValidSectionName(sectionName)) {
      console.warn(`Invalid section name in audio manifest: ${sectionName}`);
      continue;
    }

    // Validate and parse part number
    const partNumber = parseInt(partNumberStr.trim(), 10);
    if (isNaN(partNumber) || partNumber < 1) {
      console.warn(`Invalid part number in audio manifest: ${partNumberStr}`);
      continue;
    }

    // Validate filename is not empty
    if (!filename.trim()) {
      console.warn('Empty filename in audio manifest');
      continue;
    }

    const entry: AudioManifestEntry = {
      sectionName,
      partNumber,
      filename: filename.trim(),
    };

    // Add transcript if provided
    if (transcript && transcript.trim()) {
      entry.transcript = transcript.trim();
    }

    entries.push(entry);
  }

  return entries;
}

/**
 * Parse image manifest content into structured entries
 *
 * Format: sectionName|position|filename|altText|caption
 * Lines starting with # are comments and are ignored
 * Empty lines are ignored
 * Caption is optional (5th field)
 *
 * @param content - Raw manifest file content
 * @returns Array of parsed image manifest entries
 */
export function parseImageManifest(content: string): ImageManifestEntry[] {
  const entries: ImageManifestEntry[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const parts = trimmedLine.split('|');

    // Image manifest requires at least 4 parts, 5th (caption) is optional
    if (parts.length < 4) {
      console.warn(`Invalid image manifest line (expected at least 4 parts): ${trimmedLine}`);
      continue;
    }

    const [sectionName, position, filename, altText, caption] = parts;

    // Validate section name
    if (!isValidSectionName(sectionName)) {
      console.warn(`Invalid section name in image manifest: ${sectionName}`);
      continue;
    }

    // Validate position
    if (!isValidImagePosition(position)) {
      console.warn(`Invalid position in image manifest: ${position}`);
      continue;
    }

    // Validate filename is not empty
    if (!filename.trim()) {
      console.warn('Empty filename in image manifest');
      continue;
    }

    // Validate alt text is not empty
    if (!altText.trim()) {
      console.warn('Empty alt text in image manifest');
      continue;
    }

    const entry: ImageManifestEntry = {
      sectionName,
      position,
      filename: filename.trim(),
      altText: altText.trim(),
    };

    // Add caption if provided and not empty
    if (caption && caption.trim()) {
      entry.caption = caption.trim();
    }

    entries.push(entry);
  }

  return entries;
}

/**
 * Serialize an audio manifest entry to manifest format
 *
 * @param entry - Audio manifest entry to serialize
 * @returns Formatted manifest line
 */
export function serializeAudioManifestEntry(entry: AudioManifestEntry): string {
  const parts = [entry.sectionName, entry.partNumber.toString(), entry.filename];
  if (entry.transcript) {
    parts.push(entry.transcript);
  }
  return parts.join('|');
}

/**
 * Serialize an image manifest entry to manifest format
 *
 * @param entry - Image manifest entry to serialize
 * @returns Formatted manifest line
 */
export function serializeImageManifestEntry(entry: ImageManifestEntry): string {
  const parts = [entry.sectionName, entry.position, entry.filename, entry.altText];

  if (entry.caption) {
    parts.push(entry.caption);
  }

  return parts.join('|');
}

/**
 * Load and parse audio manifest for a story
 *
 * @param storyId - ID of the story
 * @returns Promise resolving to array of audio manifest entries
 */
export async function loadAudioManifest(storyId: number): Promise<AudioManifestEntry[]> {
  try {
    const response = await fetch(`/audio/stories/${storyId}/manifest.txt`);

    if (!response.ok) {
      // Manifest not found is not an error - just means no audio available
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to load audio manifest: ${response.status}`);
    }

    const content = await response.text();
    return parseAudioManifest(content);
  } catch (error) {
    console.warn(`Could not load audio manifest for story ${storyId}:`, error);
    return [];
  }
}

/**
 * Load and parse image manifest for a story
 *
 * @param storyId - ID of the story
 * @returns Promise resolving to array of image manifest entries
 */
export async function loadImageManifest(storyId: number): Promise<ImageManifestEntry[]> {
  try {
    const response = await fetch(`/images/stories/${storyId}/manifest.txt`);

    if (!response.ok) {
      // Manifest not found is not an error - just means no images available
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to load image manifest: ${response.status}`);
    }

    const content = await response.text();
    return parseImageManifest(content);
  } catch (error) {
    console.warn(`Could not load image manifest for story ${storyId}:`, error);
    return [];
  }
}

/** Cache for audio file validation results */
const audioFileValidationCache = new Map<string, boolean>();

/** Cache for image file validation results */
const imageFileValidationCache = new Map<string, boolean>();

/**
 * Generate a cache key for file validation
 */
function getValidationCacheKey(storyId: number, filename: string): string {
  return `${storyId}/${filename}`;
}

/**
 * Validate that an audio file exists
 */
export async function validateAudioFile(storyId: number, filename: string): Promise<boolean> {
  const cacheKey = getValidationCacheKey(storyId, filename);

  if (audioFileValidationCache.has(cacheKey)) {
    return audioFileValidationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`/audio/stories/${storyId}/${filename}`, {
      method: 'HEAD',
    });
    const exists = response.ok;
    audioFileValidationCache.set(cacheKey, exists);
    return exists;
  } catch {
    audioFileValidationCache.set(cacheKey, false);
    return false;
  }
}

/**
 * Validate that an image file exists
 */
export async function validateImageFile(storyId: number, filename: string): Promise<boolean> {
  const cacheKey = getValidationCacheKey(storyId, filename);

  if (imageFileValidationCache.has(cacheKey)) {
    return imageFileValidationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch(`/images/stories/${storyId}/${filename}`, {
      method: 'HEAD',
    });
    const exists = response.ok;
    imageFileValidationCache.set(cacheKey, exists);
    return exists;
  } catch {
    imageFileValidationCache.set(cacheKey, false);
    return false;
  }
}

/**
 * Clear the audio file validation cache
 */
export function clearAudioValidationCache(): void {
  audioFileValidationCache.clear();
}

/**
 * Clear the image file validation cache
 */
export function clearImageValidationCache(): void {
  imageFileValidationCache.clear();
}

/**
 * Clear all file validation caches
 */
export function clearAllValidationCaches(): void {
  audioFileValidationCache.clear();
  imageFileValidationCache.clear();
}

/**
 * Get audio segment key for a section
 */
export function getAudioSegmentKey(sectionName: SectionName): string {
  return sectionName;
}

/**
 * Manifest service interface for dependency injection
 */
export interface ManifestService {
  loadAudioManifest(storyId: number): Promise<AudioManifestEntry[]>;
  loadImageManifest(storyId: number): Promise<ImageManifestEntry[]>;
  parseAudioManifest(content: string): AudioManifestEntry[];
  parseImageManifest(content: string): ImageManifestEntry[];
  validateAudioFile(storyId: number, filename: string): Promise<boolean>;
  validateImageFile(storyId: number, filename: string): Promise<boolean>;
  clearAudioValidationCache(): void;
  clearImageValidationCache(): void;
  clearAllValidationCaches(): void;
}

/**
 * Create a manifest service instance
 */
export function createManifestService(): ManifestService {
  return {
    loadAudioManifest,
    loadImageManifest,
    parseAudioManifest,
    parseImageManifest,
    validateAudioFile,
    validateImageFile,
    clearAudioValidationCache,
    clearImageValidationCache,
    clearAllValidationCaches,
  };
}

/** Default manifest service instance */
export const manifestService = createManifestService();

export default manifestService;
