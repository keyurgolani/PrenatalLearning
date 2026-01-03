/**
 * Media types for audio and visual content system
 *
 * Requirements:
 * - 1.3: WHEN a manifest file exists, THE System SHALL parse it to identify available audio segments
 * - 1.4: THE manifest file SHALL contain entries in the format: {sectionName}|{filename}
 * - 4.3: WHEN a manifest file exists, THE System SHALL parse it to identify available visual assets
 * - 4.4: THE manifest file SHALL contain entries in the format: {sectionName}|{position}|{filename}|{altText}|{caption}
 */

/**
 * Valid section names for story content
 */
export type SectionName =
  | 'introduction'
  | 'coreContent'
  | 'interactiveSection'
  | 'integration';

/**
 * Valid positions for image placement within content
 */
export type ImagePosition = 'before' | 'after' | 'inline';

/**
 * Audio manifest entry representing a section's audio narration part
 *
 * Format in manifest.txt: sectionName|partNumber|filename|transcript
 * 
 * Due to Speechma's 2000 character limit, sections are split into multiple parts.
 * Each part should be ~2000 characters or less.
 * 
 * Pauses are controlled by punctuation (Speechma TTS guidelines):
 * - Comma (,) = short pause (~0.5 seconds)
 * - Semicolon (;) = medium pause (~1 second)
 * - Exclamation mark (!) = longer pause (~1.5 seconds)
 */
export interface AudioManifestEntry {
  /** Section of the story (introduction, coreContent, interactiveSection, integration) */
  sectionName: SectionName;
  /** Part number within the section (1-based, for ordering multiple audio files) */
  partNumber: number;
  /** Filename of the audio file (e.g., 'introduction-part1.mp3') */
  filename: string;
  /** Full transcript with formatting hints for audio generation */
  transcript?: string;
  /** Style instructions for Google TTS (e.g., "Calm, soothing") */
  styleInstructions?: string;
  /** Temperature setting for Google TTS generation (0.0 to 1.0) */
  temperature?: number;
}

/**
 * Grouped audio entries for a section (all parts combined)
 */
export interface SectionAudioGroup {
  /** Section name */
  sectionName: SectionName;
  /** All audio parts for this section, sorted by part number */
  parts: AudioManifestEntry[];
  /** Total number of parts */
  totalParts: number;
}

/**
 * Image manifest entry representing a single visual asset
 *
 * Format in manifest.txt: sectionName|position|filename|altText|caption
 */
export interface ImageManifestEntry {
  /** Section of the story (introduction, coreContent, interactiveSection, integration) */
  sectionName: SectionName;
  /** Position of the image relative to content (before, after, inline) */
  position: ImagePosition;
  /** Filename of the image file (e.g., 'cosmic-seed.png') */
  filename: string;
  /** Alt text for accessibility */
  altText: string;
  /** Optional caption to display below the image */
  caption?: string;
}

/**
 * Result of loading media assets for a story
 */
export interface MediaAssets {
  /** Map of audio groups keyed by sectionName (contains all parts for each section) */
  audioSegments: Map<string, SectionAudioGroup>;
  /** Map of image entries keyed by sectionName */
  images: Map<string, ImageManifestEntry[]>;
  /** Whether assets are currently loading */
  isLoading: boolean;
  /** Error that occurred during loading, if any */
  error: Error | null;
}
