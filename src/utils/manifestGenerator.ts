/**
 * Manifest Generator Utility
 *
 * Generates template manifest files for audio and visual content.
 * These templates include all paragraph text from story content,
 * making it easy for content administrators to know what audio/visual
 * content to create.
 *
 * Requirements:
 * - 7.1: THE System SHALL generate template manifest files for audio
 * - 7.2: THE System SHALL generate template manifest files for visuals
 * - 7.3: THE audio manifest template SHALL include all paragraph text from the story content
 * - 7.4: THE visual manifest template SHALL include suggested image descriptions based on story analogies
 * - 7.5: THE manifest files SHALL use a consistent, parseable format with clear field separators
 */

import type { SectionName, ImagePosition } from '../types/media';

/**
 * Narrative sections in a story
 */
interface StoryNarrative {
  introduction: string;
  coreContent: string;
  interactiveSection: string;
  integration: string;
}

/**
 * Analogy structure (can be string or object with concept/analogy)
 */
interface Analogy {
  concept: string;
  analogy: string;
}

/**
 * Story content structure for manifest generation
 */
interface StoryContentForManifest {
  id: number;
  title: string;
  narrative: StoryNarrative;
  analogies?: (string | Analogy)[];
  keyConcepts?: string[];
}

/**
 * Audio manifest template entry
 */
interface AudioTemplateEntry {
  sectionName: SectionName;
  paragraphIndex: number;
  suggestedFilename: string;
  transcriptText: string;
}

/**
 * Image manifest template entry
 */
interface ImageTemplateEntry {
  sectionName: SectionName;
  position: ImagePosition;
  suggestedFilename: string;
  altText: string;
  caption: string;
}

/**
 * Section name abbreviations for filename generation
 */
const SECTION_ABBREVIATIONS: Record<SectionName, string> = {
  introduction: 'intro',
  coreContent: 'core',
  interactiveSection: 'interactive',
  integration: 'integration',
};

/**
 * Split text into paragraphs
 * Paragraphs are separated by double newlines
 *
 * @param text - Text content to split
 * @returns Array of non-empty paragraphs
 */
export function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/**
 * Clean text for manifest entry
 * Removes newlines and excessive whitespace, trims to reasonable length
 *
 * @param text - Text to clean
 * @param maxLength - Maximum length (default 500)
 * @returns Cleaned text
 */
export function cleanTextForManifest(text: string, maxLength = 500): string {
  // Replace newlines with spaces and collapse multiple spaces
  const cleaned = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();

  // Truncate if too long, adding ellipsis
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength - 3) + '...';
  }

  return cleaned;
}

/**
 * Generate a suggested filename for an audio segment
 *
 * @param sectionName - Section name
 * @param paragraphIndex - Paragraph index (0-based)
 * @returns Suggested filename (e.g., 'intro-p0.mp3')
 */
export function generateAudioFilename(
  sectionName: SectionName,
  paragraphIndex: number
): string {
  const abbrev = SECTION_ABBREVIATIONS[sectionName];
  return `${abbrev}-p${paragraphIndex}.mp3`;
}

/**
 * Generate a suggested filename for an image
 *
 * @param sectionName - Section name
 * @param index - Image index within section (0-based)
 * @returns Suggested filename (e.g., 'intro-img0.png')
 */
export function generateImageFilename(
  sectionName: SectionName,
  index: number
): string {
  const abbrev = SECTION_ABBREVIATIONS[sectionName];
  return `${abbrev}-img${index}.png`;
}

/**
 * Extract audio template entries from a story section
 *
 * @param sectionName - Name of the section
 * @param content - Section content text
 * @returns Array of audio template entries
 */
function extractAudioEntriesFromSection(
  sectionName: SectionName,
  content: string
): AudioTemplateEntry[] {
  const paragraphs = splitIntoParagraphs(content);

  return paragraphs.map((paragraph, index) => ({
    sectionName,
    paragraphIndex: index,
    suggestedFilename: generateAudioFilename(sectionName, index),
    transcriptText: cleanTextForManifest(paragraph),
  }));
}

/**
 * Generate audio manifest template for a story
 *
 * Creates a template with all paragraphs from all narrative sections,
 * with suggested filenames and the full transcript text.
 *
 * Requirements:
 * - 7.1: Generate template manifest files for audio
 * - 7.3: Include all paragraph text from the story content
 * - 7.5: Use consistent, parseable format
 *
 * @param story - Story content to generate manifest for
 * @returns Formatted manifest template string
 */
export function generateAudioManifestTemplate(
  story: StoryContentForManifest
): string {
  const lines: string[] = [];

  // Header comments
  lines.push(`# Audio Manifest for Story ${story.id}: ${story.title}`);
  lines.push('# Format: sectionName|paragraphIndex|filename|transcriptText');
  lines.push('#');
  lines.push('# Instructions:');
  lines.push('# 1. Record audio for each paragraph below');
  lines.push('# 2. Save audio files with the suggested filenames (or update the filename field)');
  lines.push('# 3. Place audio files in public/audio/stories/' + story.id + '/');
  lines.push('# 4. Remove the # from lines you have recorded');
  lines.push('#');
  lines.push('');

  // Process each section
  const sections: { name: SectionName; content: string }[] = [
    { name: 'introduction', content: story.narrative.introduction },
    { name: 'coreContent', content: story.narrative.coreContent },
    { name: 'interactiveSection', content: story.narrative.interactiveSection },
    { name: 'integration', content: story.narrative.integration },
  ];

  for (const section of sections) {
    lines.push(`# === ${section.name.toUpperCase()} ===`);

    const entries = extractAudioEntriesFromSection(section.name, section.content);

    for (const entry of entries) {
      // Comment out entries by default (content admin will uncomment when audio is ready)
      const line = `# ${entry.sectionName}|${entry.paragraphIndex}|${entry.suggestedFilename}|${entry.transcriptText}`;
      lines.push(line);
    }

    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Extract suggested image descriptions from story analogies
 *
 * @param analogies - Story analogies (can be strings or objects)
 * @returns Array of suggested image descriptions
 */
function extractImageSuggestionsFromAnalogies(
  analogies: (string | Analogy)[] | undefined
): { concept: string; description: string }[] {
  if (!analogies || analogies.length === 0) {
    return [];
  }

  return analogies.map((analogy) => {
    if (typeof analogy === 'string') {
      return {
        concept: 'Analogy',
        description: analogy,
      };
    }
    return {
      concept: analogy.concept,
      description: analogy.analogy,
    };
  });
}

/**
 * Generate image manifest template for a story
 *
 * Creates a template with suggested images based on story analogies
 * and key concepts, with suggested positions and descriptions.
 *
 * Requirements:
 * - 7.2: Generate template manifest files for visuals
 * - 7.4: Include suggested image descriptions based on story analogies
 * - 7.5: Use consistent, parseable format
 *
 * @param story - Story content to generate manifest for
 * @returns Formatted manifest template string
 */
export function generateImageManifestTemplate(
  story: StoryContentForManifest
): string {
  const lines: string[] = [];

  // Header comments
  lines.push(`# Image Manifest for Story ${story.id}: ${story.title}`);
  lines.push('# Format: sectionName|position|filename|altText|caption');
  lines.push('#');
  lines.push('# Instructions:');
  lines.push('# 1. Create images based on the suggested descriptions below');
  lines.push('# 2. Save image files with the suggested filenames (or update the filename field)');
  lines.push('# 3. Place image files in public/images/stories/' + story.id + '/');
  lines.push('# 4. Remove the # from lines you have created images for');
  lines.push('# 5. Position options: before, after, inline');
  lines.push('#');
  lines.push('');

  // Generate suggestions from analogies
  const analogySuggestions = extractImageSuggestionsFromAnalogies(story.analogies);

  if (analogySuggestions.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM ANALOGIES ===');
    lines.push('# These images would help visualize the key analogies in the story');
    lines.push('');

    analogySuggestions.forEach((suggestion, index) => {
      const entry: ImageTemplateEntry = {
        sectionName: 'coreContent',
        position: 'after',
        suggestedFilename: `analogy-${index}.png`,
        altText: `Illustration of ${suggestion.concept}`,
        caption: suggestion.description,
      };

      const line = `# ${entry.sectionName}|${entry.position}|${entry.suggestedFilename}|${entry.altText}|${entry.caption}`;
      lines.push(line);
    });

    lines.push('');
  }

  // Generate suggestions from key concepts
  if (story.keyConcepts && story.keyConcepts.length > 0) {
    lines.push('# === SUGGESTED IMAGES FROM KEY CONCEPTS ===');
    lines.push('# These images would help illustrate the main concepts');
    lines.push('');

    story.keyConcepts.forEach((concept, index) => {
      const entry: ImageTemplateEntry = {
        sectionName: 'coreContent',
        position: 'inline',
        suggestedFilename: `concept-${index}.png`,
        altText: `Illustration of: ${cleanTextForManifest(concept, 100)}`,
        caption: cleanTextForManifest(concept, 200),
      };

      const line = `# ${entry.sectionName}|${entry.position}|${entry.suggestedFilename}|${entry.altText}|${entry.caption}`;
      lines.push(line);
    });

    lines.push('');
  }

  // Add section-specific placeholder suggestions
  lines.push('# === SECTION-SPECIFIC IMAGES ===');
  lines.push('# Add images for specific sections as needed');
  lines.push('');

  const sections: SectionName[] = [
    'introduction',
    'coreContent',
    'interactiveSection',
    'integration',
  ];

  sections.forEach((sectionName) => {
    const entry: ImageTemplateEntry = {
      sectionName,
      position: 'before',
      suggestedFilename: generateImageFilename(sectionName, 0),
      altText: `[Add alt text for ${sectionName} image]`,
      caption: `[Optional caption for ${sectionName} image]`,
    };

    const line = `# ${entry.sectionName}|${entry.position}|${entry.suggestedFilename}|${entry.altText}|${entry.caption}`;
    lines.push(line);
  });

  lines.push('');

  return lines.join('\n');
}

/**
 * Get all section names
 *
 * @returns Array of all valid section names
 */
export function getAllSectionNames(): SectionName[] {
  return ['introduction', 'coreContent', 'interactiveSection', 'integration'];
}

/**
 * Count total paragraphs in a story
 *
 * @param story - Story content
 * @returns Total number of paragraphs across all sections
 */
export function countTotalParagraphs(story: StoryContentForManifest): number {
  const sections = [
    story.narrative.introduction,
    story.narrative.coreContent,
    story.narrative.interactiveSection,
    story.narrative.integration,
  ];

  return sections.reduce((total, content) => {
    return total + splitIntoParagraphs(content).length;
  }, 0);
}

/**
 * Get paragraph counts by section
 *
 * @param story - Story content
 * @returns Object with paragraph counts per section
 */
export function getParagraphCountsBySection(
  story: StoryContentForManifest
): Record<SectionName, number> {
  return {
    introduction: splitIntoParagraphs(story.narrative.introduction).length,
    coreContent: splitIntoParagraphs(story.narrative.coreContent).length,
    interactiveSection: splitIntoParagraphs(story.narrative.interactiveSection).length,
    integration: splitIntoParagraphs(story.narrative.integration).length,
  };
}
