/**
 * Content Image Matcher Utility
 * 
 * Matches images to content sections based on analogy and concept references.
 * This enables inline display of illustrations at appropriate positions within the narrative.
 */

import type { ImageManifestEntry } from '../types/media';

/**
 * Represents an image that should be displayed after a specific subsection
 */
export interface InlineImagePlacement {
  /** The image to display */
  image: ImageManifestEntry;
  /** Index of the paragraph after which to display the image (end of subsection) */
  afterParagraphIndex: number;
  /** The matched text that triggered this placement */
  matchedText: string;
  /** The subsection heading this image belongs to */
  subsectionHeading?: string;
}

/**
 * Extract the analogy/concept index from an image filename
 * @param filename - Image filename (e.g., 'analogy-0.png', 'concept-3.png')
 * @returns Object with type and index, or null if not a recognized pattern
 */
export function parseImageFilename(filename: string): { type: 'analogy' | 'concept'; index: number } | null {
  const analogyMatch = filename.match(/^analogy-(\d+)\.(png|jpg|jpeg|webp)$/i);
  if (analogyMatch) {
    return { type: 'analogy', index: parseInt(analogyMatch[1], 10) };
  }
  
  const conceptMatch = filename.match(/^concept-(\d+)\.(png|jpg|jpeg|webp)$/i);
  if (conceptMatch) {
    return { type: 'concept', index: parseInt(conceptMatch[1], 10) };
  }
  
  return null;
}

/**
 * Normalize text for comparison by removing special characters and converting to lowercase
 */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Extract key phrases from an analogy or concept for matching
 * @param text - The analogy or concept text
 * @returns Array of key phrases to search for
 */
function extractKeyPhrases(text: string): string[] {
  const normalized = normalizeText(text);
  const phrases: string[] = [];
  
  // Add the full normalized text
  phrases.push(normalized);
  
  // Extract significant words (longer than 4 characters)
  const words = normalized.split(' ').filter(w => w.length > 4);
  
  // Add pairs of consecutive significant words
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`);
  }
  
  // Add individual significant words
  phrases.push(...words);
  
  return phrases;
}

/**
 * Find the best paragraph match for a given analogy or concept
 * @param paragraphs - Array of content paragraphs
 * @param searchText - The analogy or concept text to match
 * @returns Index of the best matching paragraph, or -1 if no good match
 */
function findBestParagraphMatch(paragraphs: string[], searchText: string): number {
  const keyPhrases = extractKeyPhrases(searchText);
  let bestMatchIndex = -1;
  let bestMatchScore = 0;
  
  paragraphs.forEach((paragraph, index) => {
    const normalizedParagraph = normalizeText(paragraph);
    let score = 0;
    
    for (const phrase of keyPhrases) {
      if (normalizedParagraph.includes(phrase)) {
        // Longer phrases get higher scores
        score += phrase.length;
      }
    }
    
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatchIndex = index;
    }
  });
  
  // Only return a match if we have a reasonable score
  return bestMatchScore >= 8 ? bestMatchIndex : -1;
}

/**
 * Parse content into subsections based on **heading** markers
 * Returns array of { heading, startIndex, endIndex } for each subsection
 */
function parseSubsections(paragraphs: string[]): Array<{
  heading: string | null;
  startIndex: number;
  endIndex: number;
}> {
  const subsections: Array<{ heading: string | null; startIndex: number; endIndex: number }> = [];
  let currentHeading: string | null = null;
  let currentStartIndex = 0;

  paragraphs.forEach((paragraph, index) => {
    // Check if this paragraph starts with a heading
    if (paragraph.startsWith('**') && paragraph.includes('**')) {
      // If we have a previous subsection, close it
      if (index > 0) {
        subsections.push({
          heading: currentHeading,
          startIndex: currentStartIndex,
          endIndex: index - 1,
        });
      }
      // Extract the heading text
      const headingMatch = paragraph.match(/^\*\*(.+?)\*\*/);
      currentHeading = headingMatch ? headingMatch[1] : null;
      currentStartIndex = index;
    }
  });

  // Add the last subsection
  if (paragraphs.length > 0) {
    subsections.push({
      heading: currentHeading,
      startIndex: currentStartIndex,
      endIndex: paragraphs.length - 1,
    });
  }

  return subsections;
}

/**
 * Find which subsection a paragraph belongs to
 */
function findSubsectionForParagraph(
  paragraphIndex: number,
  subsections: Array<{ heading: string | null; startIndex: number; endIndex: number }>
): { heading: string | null; endIndex: number } | null {
  for (const subsection of subsections) {
    if (paragraphIndex >= subsection.startIndex && paragraphIndex <= subsection.endIndex) {
      return { heading: subsection.heading, endIndex: subsection.endIndex };
    }
  }
  return null;
}

/**
 * Determine inline image placements for content based on analogies and concepts
 * Images are grouped by subsection and displayed at the end of each subsection
 * 
 * @param content - The narrative content text
 * @param images - Array of images for the section
 * @param analogies - Array of story analogies
 * @param keyConcepts - Array of story key concepts
 * @returns Array of inline image placements sorted by paragraph index
 */
export function determineInlineImagePlacements(
  content: string,
  images: ImageManifestEntry[],
  analogies: (string | { concept: string; analogy: string })[],
  keyConcepts: string[]
): InlineImagePlacement[] {
  const placements: InlineImagePlacement[] = [];
  const paragraphs = content.split(/\n\n+/);
  const subsections = parseSubsections(paragraphs);

  for (const image of images) {
    // Skip images that aren't analogy or concept images
    const parsed = parseImageFilename(image.filename);
    if (!parsed) continue;

    let searchText: string | null = null;

    if (parsed.type === 'analogy' && parsed.index < analogies.length) {
      const analogy = analogies[parsed.index];
      searchText = typeof analogy === 'string' ? analogy : analogy.analogy;
    } else if (parsed.type === 'concept' && parsed.index < keyConcepts.length) {
      searchText = keyConcepts[parsed.index];
    }

    if (!searchText) continue;

    // Find the best matching paragraph
    const matchIndex = findBestParagraphMatch(paragraphs, searchText);

    if (matchIndex !== -1) {
      // Find which subsection this paragraph belongs to
      const subsection = findSubsectionForParagraph(matchIndex, subsections);
      
      // Place the image at the end of the subsection
      const placementIndex = subsection ? subsection.endIndex : matchIndex;
      
      placements.push({
        image,
        afterParagraphIndex: placementIndex,
        matchedText: searchText,
        subsectionHeading: subsection?.heading ?? undefined,
      });
    }
  }

  // Sort by paragraph index for proper rendering order
  placements.sort((a, b) => a.afterParagraphIndex - b.afterParagraphIndex);

  return placements;
}

/**
 * Get images that should be displayed at a specific position (before/after)
 * excluding those that will be placed inline
 * 
 * @param images - All images for the section
 * @param position - The position to filter by
 * @param inlinePlacements - Images that will be placed inline
 * @returns Filtered array of images for the specified position
 */
export function getPositionedImages(
  images: ImageManifestEntry[],
  position: 'before' | 'after',
  inlinePlacements: InlineImagePlacement[]
): ImageManifestEntry[] {
  const inlineFilenames = new Set(inlinePlacements.map(p => p.image.filename));
  
  return images.filter(img => {
    // If it's being placed inline, don't include it in before/after
    if (inlineFilenames.has(img.filename)) {
      return false;
    }
    return img.position === position;
  });
}
