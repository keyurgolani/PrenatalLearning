/**
 * ParagraphAudioButton Component
 *
 * A button component that provides audio playback controls for individual paragraphs.
 * Positioned in the top-right corner of paragraph sections.
 *
 * Requirements:
 * - 2.1: WHEN an audio file exists for a paragraph section, THE System SHALL display a play button in the top-right corner
 * - 2.2: WHEN no audio file exists for a paragraph section, THE System SHALL hide the play button
 * - 2.3: WHEN a user clicks the play button, THE System SHALL begin audio playback and change the button to a pause icon
 * - 2.4: WHEN a user clicks the pause button, THE System SHALL pause audio playback and change the button to a play icon
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface ParagraphAudioButtonProps {
  /** Story ID for constructing audio URL (reserved for future use) */
  storyId?: number;
  /** Section name (introduction, coreContent, etc.) */
  sectionName: string;
  /** Paragraph index within the section */
  paragraphIndex: number;
  /** Whether audio is available for this paragraph */
  audioAvailable: boolean;
  /** Source URL for the audio file (if available) */
  audioSrc?: string;
  /** Optional callback when play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Optional callback when playback completes */
  onComplete?: () => void;
  /** Optional callback when an error occurs */
  onError?: (error: Error) => void;
  /** Optional className for additional styling */
  className?: string;
}

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
}

/**
 * ParagraphAudioButton component
 *
 * Displays a play/pause button for paragraph-level audio narration.
 * The button is hidden when no audio is available (Requirements 2.2).
 */
export const ParagraphAudioButton: React.FC<ParagraphAudioButtonProps> = ({
  sectionName,
  paragraphIndex,
  audioAvailable,
  audioSrc,
  onPlayStateChange,
  onComplete,
  onError,
  className = '',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    hasError: false,
  });

  /**
   * Handle play button click
   * Requirements 2.3: Begin playback and change to pause icon
   */
  const handlePlay = useCallback(async () => {
    if (!audioSrc) return;
    
    if (!audioRef.current) {
      // Create audio element on first play
      audioRef.current = new Audio(audioSrc);
      
      // Set up event listeners
      audioRef.current.addEventListener('ended', () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        onPlayStateChange?.(false);
        onComplete?.();
      });

      audioRef.current.addEventListener('error', () => {
        setState(prev => ({ ...prev, isLoading: false, hasError: true, isPlaying: false }));
        onError?.(new Error('Failed to load audio file'));
      });

      audioRef.current.addEventListener('canplay', () => {
        setState(prev => ({ ...prev, isLoading: false }));
      });
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
      onPlayStateChange?.(true);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Playback failed');
      setState(prev => ({ ...prev, isLoading: false, hasError: true }));
      onError?.(err);
    }
  }, [audioSrc, onPlayStateChange, onComplete, onError]);

  /**
   * Handle pause button click
   * Requirements 2.4: Pause playback and change to play icon
   */
  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState(prev => ({ ...prev, isPlaying: false }));
      onPlayStateChange?.(false);
    }
  }, [onPlayStateChange]);

  /**
   * Toggle play/pause state
   */
  const togglePlayPause = useCallback(() => {
    if (state.isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [state.isPlaying, handlePlay, handlePause]);

  // Cleanup audio element on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Reset audio when source changes
  useEffect(() => {
    const currentAudio = audioRef.current;
    if (currentAudio) {
      currentAudio.pause();
      audioRef.current = null;
    }
    // Return cleanup that resets state
    return () => {
      setState((prev) => 
        prev.isPlaying || prev.isLoading || prev.hasError
          ? { isPlaying: false, isLoading: false, hasError: false }
          : prev
      );
    };
  }, [audioSrc]);

  // Requirements 2.2: Hide button when no audio is available
  // Also hide if there was an error loading audio
  if (!audioAvailable || !audioSrc || state.hasError) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={togglePlayPause}
      disabled={state.isLoading}
      className={`
        absolute top-2 right-2
        w-8 h-8
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm
        ${className}
      `}
      style={{
        backgroundColor: isDark
          ? 'rgba(168, 85, 247, 0.2)'
          : 'rgba(147, 51, 234, 0.1)',
        color: isDark ? '#C084FC' : '#9333ea',
      }}
      aria-label={
        state.isLoading
          ? 'Loading audio'
          : state.isPlaying
          ? `Pause audio for ${sectionName} paragraph ${paragraphIndex + 1}`
          : `Play audio for ${sectionName} paragraph ${paragraphIndex + 1}`
      }
      data-testid={`audio-button-${sectionName}-${paragraphIndex}`}
    >
      {state.isLoading ? (
        /* Loading spinner */
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : state.isPlaying ? (
        /* Pause icon - Requirements 2.3 */
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        /* Play icon - Requirements 2.4 */
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
};

export default ParagraphAudioButton;
