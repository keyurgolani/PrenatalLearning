/**
 * Hook for loading and managing media assets (audio and images) for stories
 *
 * Requirements:
 * - 1.3: WHEN a manifest file exists, THE System SHALL parse it to identify available audio segments
 * - 4.3: WHEN a manifest file exists, THE System SHALL parse it to identify available visual assets
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { AudioManifestEntry, ImageManifestEntry, MediaAssets, SectionName, SectionAudioGroup } from '../types/media';
import { loadAudioManifest, loadImageManifest, getAudioSegmentKey } from '../services/manifestService';

/** Cache for loaded media assets to avoid redundant fetches */
const mediaAssetsCache = new Map<
  number,
  {
    audioSegments: Map<string, SectionAudioGroup>;
    images: Map<string, ImageManifestEntry[]>;
  }
>();

/**
 * Convert audio manifest entries to a Map of SectionAudioGroups keyed by section name
 * Groups all parts for each section and sorts them by part number
 */
function buildAudioSegmentsMap(entries: AudioManifestEntry[]): Map<string, SectionAudioGroup> {
  const map = new Map<string, SectionAudioGroup>();
  
  for (const entry of entries) {
    const key = getAudioSegmentKey(entry.sectionName);
    const existing = map.get(key);
    
    if (existing) {
      existing.parts.push(entry);
      existing.totalParts = existing.parts.length;
    } else {
      map.set(key, {
        sectionName: entry.sectionName,
        parts: [entry],
        totalParts: 1,
      });
    }
  }
  
  // Sort parts by part number for each section
  for (const group of map.values()) {
    group.parts.sort((a, b) => a.partNumber - b.partNumber);
  }
  
  return map;
}

/**
 * Convert image manifest entries to a Map keyed by section name
 */
function buildImagesMap(entries: ImageManifestEntry[]): Map<string, ImageManifestEntry[]> {
  const map = new Map<string, ImageManifestEntry[]>();
  for (const entry of entries) {
    const existing = map.get(entry.sectionName) || [];
    existing.push(entry);
    map.set(entry.sectionName, existing);
  }
  return map;
}

/**
 * Hook to load and manage media assets for a story
 *
 * @param storyId - ID of the story to load assets for
 * @returns MediaAssets object with audio segments, images, loading state, and error
 */
export function useMediaAssets(storyId: number): MediaAssets {
  const [audioSegments, setAudioSegments] = useState<Map<string, SectionAudioGroup>>(new Map());
  const [images, setImages] = useState<Map<string, ImageManifestEntry[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track the current storyId to handle race conditions
  const currentStoryIdRef = useRef<number>(storyId);

  const loadAssets = useCallback(async (id: number) => {
    // Check cache first
    const cached = mediaAssetsCache.get(id);
    if (cached) {
      setAudioSegments(cached.audioSegments);
      setImages(cached.images);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load both manifests in parallel
      const [audioEntries, imageEntries] = await Promise.all([
        loadAudioManifest(id),
        loadImageManifest(id),
      ]);

      // Check if storyId changed during loading (race condition)
      if (currentStoryIdRef.current !== id) {
        return;
      }

      const audioMap = buildAudioSegmentsMap(audioEntries);
      const imagesMap = buildImagesMap(imageEntries);

      // Cache the results
      mediaAssetsCache.set(id, {
        audioSegments: audioMap,
        images: imagesMap,
      });

      setAudioSegments(audioMap);
      setImages(imagesMap);
      setError(null);
    } catch (err) {
      // Check if storyId changed during loading (race condition)
      if (currentStoryIdRef.current !== id) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Failed to load media assets');
      setError(error);
      // Set empty maps on error so components can still render
      setAudioSegments(new Map());
      setImages(new Map());
    } finally {
      // Check if storyId changed during loading (race condition)
      if (currentStoryIdRef.current === id) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    currentStoryIdRef.current = storyId;
    loadAssets(storyId);
  }, [storyId, loadAssets]);

  return {
    audioSegments,
    images,
    isLoading,
    error,
  };
}

/**
 * Clear the media assets cache
 */
export function clearMediaAssetsCache(): void {
  mediaAssetsCache.clear();
}

/**
 * Get audio group for a specific section (contains all parts)
 *
 * @param assets - MediaAssets object from useMediaAssets hook
 * @param sectionName - Section name
 * @returns SectionAudioGroup if found, undefined otherwise
 */
export function getAudioForSection(
  assets: MediaAssets,
  sectionName: SectionName
): SectionAudioGroup | undefined {
  return assets.audioSegments.get(sectionName);
}

/**
 * Get images for a specific section
 *
 * @param assets - MediaAssets object from useMediaAssets hook
 * @param sectionName - Section name
 * @returns Array of ImageManifestEntry for the section, empty array if none
 */
export function getImagesForSection(assets: MediaAssets, sectionName: string): ImageManifestEntry[] {
  return assets.images.get(sectionName) || [];
}

/**
 * Check if audio is available for a specific section
 *
 * @param assets - MediaAssets object from useMediaAssets hook
 * @param sectionName - Section name
 * @returns true if audio is available
 */
export function hasAudioForSection(assets: MediaAssets, sectionName: SectionName): boolean {
  const group = assets.audioSegments.get(sectionName);
  return group !== undefined && group.parts.length > 0;
}

/**
 * Check if images are available for a specific section
 *
 * @param assets - MediaAssets object from useMediaAssets hook
 * @param sectionName - Section name
 * @returns true if images are available
 */
export function hasImagesForSection(assets: MediaAssets, sectionName: string): boolean {
  const images = assets.images.get(sectionName);
  return images !== undefined && images.length > 0;
}

/**
 * Get the audio file URL for a story and filename
 *
 * @param storyId - Story ID
 * @param filename - Audio filename
 * @returns Full URL path to the audio file
 */
export function getAudioUrl(storyId: number, filename: string): string {
  return `/audio/stories/${storyId}/${filename}`;
}

/**
 * Get the image file URL for a story and filename
 *
 * @param storyId - Story ID
 * @param filename - Image filename
 * @returns Full URL path to the image file
 */
export function getImageUrl(storyId: number, filename: string): string {
  return `/images/stories/${storyId}/${filename}`;
}

export default useMediaAssets;
