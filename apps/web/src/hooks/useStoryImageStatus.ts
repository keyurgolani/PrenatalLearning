/**
 * Hook for checking image/illustration availability status for stories
 * 
 * Determines if a story has full, partial, or no illustrations available.
 */

import { useState, useEffect } from 'react';
import { loadImageManifest } from '../services/manifestService';
import type { SectionName } from '../types/media';

// All sections that can have images
const IMAGE_SECTIONS: SectionName[] = ['introduction', 'coreContent', 'interactiveSection', 'integration'];

export type ImageStatus = 'full' | 'partial' | 'none';

interface ImageStatusResult {
  status: ImageStatus;
  isLoading: boolean;
  sectionsWithImages: number;
  totalSections: number;
}

// Cache for image status to avoid redundant fetches
const imageStatusCache = new Map<number, ImageStatus>();

/**
 * Check image status for a single story (non-hook version for batch loading)
 */
export async function checkStoryImageStatus(storyId: number): Promise<ImageStatus> {
  // Check cache first
  const cached = imageStatusCache.get(storyId);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const entries = await loadImageManifest(storyId);
    
    if (entries.length === 0) {
      imageStatusCache.set(storyId, 'none');
      return 'none';
    }

    // Get unique sections that have images
    const sectionsWithImages = new Set(entries.map(e => e.sectionName));
    const imageSectionCount = IMAGE_SECTIONS.filter(s => sectionsWithImages.has(s)).length;

    let status: ImageStatus;
    if (imageSectionCount === IMAGE_SECTIONS.length) {
      status = 'full';
    } else if (imageSectionCount > 0) {
      status = 'partial';
    } else {
      status = 'none';
    }

    imageStatusCache.set(storyId, status);
    return status;
  } catch {
    imageStatusCache.set(storyId, 'none');
    return 'none';
  }
}

/**
 * Hook to get image/illustration status for a story
 */
export function useStoryImageStatus(storyId: number): ImageStatusResult {
  const [status, setStatus] = useState<ImageStatus>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsWithImages, setSectionsWithImages] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      // Check cache first
      const cached = imageStatusCache.get(storyId);
      if (cached !== undefined) {
        if (isMounted) {
          setStatus(cached);
          setSectionsWithImages(cached === 'full' ? IMAGE_SECTIONS.length : cached === 'partial' ? 1 : 0);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      try {
        const entries = await loadImageManifest(storyId);
        
        if (!isMounted) return;

        if (entries.length === 0) {
          setStatus('none');
          setSectionsWithImages(0);
          imageStatusCache.set(storyId, 'none');
        } else {
          // Get unique sections that have images
          const sectionsSet = new Set(entries.map(e => e.sectionName));
          const imageCount = IMAGE_SECTIONS.filter(s => sectionsSet.has(s)).length;
          setSectionsWithImages(imageCount);

          if (imageCount === IMAGE_SECTIONS.length) {
            setStatus('full');
            imageStatusCache.set(storyId, 'full');
          } else if (imageCount > 0) {
            setStatus('partial');
            imageStatusCache.set(storyId, 'partial');
          } else {
            setStatus('none');
            imageStatusCache.set(storyId, 'none');
          }
        }
      } catch {
        if (isMounted) {
          setStatus('none');
          setSectionsWithImages(0);
          imageStatusCache.set(storyId, 'none');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, [storyId]);

  return {
    status,
    isLoading,
    sectionsWithImages,
    totalSections: IMAGE_SECTIONS.length,
  };
}

/**
 * Clear the image status cache
 */
export function clearImageStatusCache(): void {
  imageStatusCache.clear();
}

export default useStoryImageStatus;
