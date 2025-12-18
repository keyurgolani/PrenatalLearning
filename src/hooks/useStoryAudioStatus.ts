/**
 * Hook for checking audio narration availability status for stories
 * 
 * Determines if a story has full, partial, or no audio narration available.
 */

import { useState, useEffect } from 'react';
import { loadAudioManifest } from '../services/manifestService';
import type { SectionName } from '../types/media';

// All sections that can have audio narration
const AUDIO_SECTIONS: SectionName[] = ['introduction', 'coreContent', 'interactiveSection', 'integration'];

export type AudioStatus = 'full' | 'partial' | 'none';

interface AudioStatusResult {
  status: AudioStatus;
  isLoading: boolean;
  sectionsWithAudio: number;
  totalSections: number;
}

// Cache for audio status to avoid redundant fetches
const audioStatusCache = new Map<number, AudioStatus>();

/**
 * Check audio status for a single story (non-hook version for batch loading)
 */
export async function checkStoryAudioStatus(storyId: number): Promise<AudioStatus> {
  // Check cache first
  const cached = audioStatusCache.get(storyId);
  if (cached !== undefined) {
    return cached;
  }

  try {
    const entries = await loadAudioManifest(storyId);
    
    if (entries.length === 0) {
      audioStatusCache.set(storyId, 'none');
      return 'none';
    }

    // Get unique sections that have audio
    const sectionsWithAudio = new Set(entries.map(e => e.sectionName));
    const audioSectionCount = AUDIO_SECTIONS.filter(s => sectionsWithAudio.has(s)).length;

    let status: AudioStatus;
    if (audioSectionCount === AUDIO_SECTIONS.length) {
      status = 'full';
    } else if (audioSectionCount > 0) {
      status = 'partial';
    } else {
      status = 'none';
    }

    audioStatusCache.set(storyId, status);
    return status;
  } catch {
    audioStatusCache.set(storyId, 'none');
    return 'none';
  }
}

/**
 * Hook to get audio narration status for a story
 */
export function useStoryAudioStatus(storyId: number): AudioStatusResult {
  const [status, setStatus] = useState<AudioStatus>('none');
  const [isLoading, setIsLoading] = useState(true);
  const [sectionsWithAudio, setSectionsWithAudio] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      // Check cache first
      const cached = audioStatusCache.get(storyId);
      if (cached !== undefined) {
        if (isMounted) {
          setStatus(cached);
          setSectionsWithAudio(cached === 'full' ? AUDIO_SECTIONS.length : cached === 'partial' ? 1 : 0);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);

      try {
        const entries = await loadAudioManifest(storyId);
        
        if (!isMounted) return;

        if (entries.length === 0) {
          setStatus('none');
          setSectionsWithAudio(0);
          audioStatusCache.set(storyId, 'none');
        } else {
          // Get unique sections that have audio
          const sectionsSet = new Set(entries.map(e => e.sectionName));
          const audioCount = AUDIO_SECTIONS.filter(s => sectionsSet.has(s)).length;
          setSectionsWithAudio(audioCount);

          if (audioCount === AUDIO_SECTIONS.length) {
            setStatus('full');
            audioStatusCache.set(storyId, 'full');
          } else if (audioCount > 0) {
            setStatus('partial');
            audioStatusCache.set(storyId, 'partial');
          } else {
            setStatus('none');
            audioStatusCache.set(storyId, 'none');
          }
        }
      } catch {
        if (isMounted) {
          setStatus('none');
          setSectionsWithAudio(0);
          audioStatusCache.set(storyId, 'none');
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
    sectionsWithAudio,
    totalSections: AUDIO_SECTIONS.length,
  };
}

/**
 * Clear the audio status cache
 */
export function clearAudioStatusCache(): void {
  audioStatusCache.clear();
}

export default useStoryAudioStatus;
