/**
 * AudioPlayer Component
 *
 * HTML5 audio element wrapper with play/pause controls and state management.
 *
 * Requirements:
 * - 2.3: WHEN a user clicks the play button, THE System SHALL begin audio playback and change the button to a pause icon
 * - 2.4: WHEN a user clicks the pause button, THE System SHALL pause audio playback and change the button to a play icon
 * - 2.5: WHEN audio playback completes, THE System SHALL reset the button to the play state
 * - 2.6: THE System SHALL display a loading indicator while the audio file is being fetched
 * - 2.7: IF an audio file fails to load, THEN THE System SHALL display a subtle error state and hide the play button
 * - 3.1: WHEN audio is playing, THE System SHALL display a progress bar showing current position relative to total duration
 * - 3.2: THE System SHALL allow users to click on the progress bar to seek to a specific position
 * - 3.3: THE System SHALL display the current time and total duration in MM:SS format
 * - 3.4: WHEN the user hovers over the progress bar, THE System SHALL show a tooltip with the time at that position
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { formatTime, calculateProgress } from '../utils/audioUtils';

export interface AudioPlayerProps {
  /** Source URL for the audio file */
  src: string;
  /** Callback when play state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
  /** Callback for progress updates */
  onProgress?: (currentTime: number, duration: number) => void;
  /** Callback when audio playback completes */
  onComplete?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Optional className for additional styling */
  className?: string;
  /** Whether to show the progress bar (default: true) */
  showProgress?: boolean;
  /** Size of the player - 'sm' | 'md' | 'lg' */
  size?: 'sm' | 'md' | 'lg';
}

export interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  currentTime: number;
  duration: number;
}

/**
 * AudioPlayer component
 * Requirements: 2.3, 2.4, 2.5, 2.6, 2.7
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  onPlayStateChange,
  onProgress,
  onComplete,
  onError,
  className = '',
  showProgress = true,
  size = 'md',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const audioRef = useRef<HTMLAudioElement>(null);

  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    hasError: false,
    currentTime: 0,
    duration: 0,
  });

  // Hover tooltip state for progress bar
  const [hoverState, setHoverState] = useState<{
    isHovering: boolean;
    position: number;
    time: number;
  }>({
    isHovering: false,
    position: 0,
    time: 0,
  });

  const progressBarRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeConfig = {
    sm: { button: 'w-8 h-8', icon: 'w-4 h-4', progress: 'h-1' },
    md: { button: 'w-10 h-10', icon: 'w-5 h-5', progress: 'h-1.5' },
    lg: { button: 'w-12 h-12', icon: 'w-6 h-6', progress: 'h-2' },
  };

  const config = sizeConfig[size];

  /**
   * Handle play button click
   * Requirements: 2.3
   */
  const handlePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      await audio.play();
      setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }));
      onPlayStateChange?.(true);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Playback failed');
      setState((prev) => ({ ...prev, isLoading: false, hasError: true }));
      onError?.(err);
    }
  }, [onPlayStateChange, onError]);

  /**
   * Handle pause button click
   * Requirements: 2.4
   */
  const handlePause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
    onPlayStateChange?.(false);
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

  /**
   * Handle audio ended event
   * Requirements: 2.5
   */
  const handleEnded = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
    onPlayStateChange?.(false);
    onComplete?.();
  }, [onPlayStateChange, onComplete]);

  /**
   * Handle time update event
   */
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration || 0;

    setState((prev) => ({ ...prev, currentTime, duration }));
    onProgress?.(currentTime, duration);
  }, [onProgress]);

  /**
   * Handle loaded metadata event
   */
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setState((prev) => ({
      ...prev,
      duration: audio.duration || 0,
      isLoading: false,
    }));
  }, []);

  /**
   * Handle loading start event
   * Requirements: 2.6
   */
  const handleLoadStart = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, hasError: false }));
  }, []);

  /**
   * Handle can play event
   */
  const handleCanPlay = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  /**
   * Handle error event
   * Requirements: 2.7
   */
  const handleError = useCallback(() => {
    const error = new Error('Failed to load audio file');
    setState((prev) => ({
      ...prev,
      isLoading: false,
      hasError: true,
      isPlaying: false,
    }));
    onError?.(error);
  }, [onError]);

  /**
   * Handle click on progress bar to seek
   * Requirements: 3.2
   */
  const handleProgressClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      const progressBar = progressBarRef.current;
      if (!audio || !progressBar || state.duration <= 0) return;

      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (event.clientX - rect.left) / rect.width;
      const seekTime = Math.max(0, Math.min(state.duration, clickPosition * state.duration));

      audio.currentTime = seekTime;
      setState((prev) => ({ ...prev, currentTime: seekTime }));
    },
    [state.duration]
  );

  /**
   * Handle mouse move over progress bar for tooltip
   * Requirements: 3.4
   */
  const handleProgressMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const progressBar = progressBarRef.current;
      if (!progressBar || state.duration <= 0) return;

      const rect = progressBar.getBoundingClientRect();
      const hoverPosition = (event.clientX - rect.left) / rect.width;
      const hoverTime = Math.max(0, Math.min(state.duration, hoverPosition * state.duration));

      setHoverState({
        isHovering: true,
        position: event.clientX - rect.left,
        time: hoverTime,
      });
    },
    [state.duration]
  );

  /**
   * Handle mouse leave from progress bar
   */
  const handleProgressMouseLeave = useCallback(() => {
    setHoverState((prev) => ({ ...prev, isHovering: false }));
  }, []);

  // Reset audio element and state when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    // Return cleanup function that resets state
    return () => {
      setState((prev) => 
        prev.isPlaying || prev.currentTime !== 0 || prev.hasError
          ? { isPlaying: false, isLoading: false, hasError: false, currentTime: 0, duration: 0 }
          : prev
      );
    };
  }, [src]);

  // Calculate progress percentage using utility function
  const progressPercent = calculateProgress(state.currentTime, state.duration);

  // If there's an error, hide the player (Requirements: 2.7)
  if (state.hasError) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onError={handleError}
      />

      {/* Play/Pause Button */}
      <button
        type="button"
        onClick={togglePlayPause}
        disabled={state.isLoading}
        className={`
          ${config.button}
          flex items-center justify-center
          rounded-full
          icon-interactive
          focus:outline-none focus:ring-2 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        style={{
          backgroundColor: isDark
            ? currentTheme.colors.surface
            : currentTheme.colors.primary,
          color: isDark ? currentTheme.colors.text : '#ffffff',
        }}
        aria-label={state.isPlaying ? 'Pause audio' : 'Play audio'}
      >
        {state.isLoading ? (
          /* Loading spinner - Requirements: 2.6 */
          <svg
            className={`${config.icon} animate-spin`}
            fill="none"
            viewBox="0 0 24 24"
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
          /* Pause icon - Requirements: 2.3 */
          <svg className={config.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          /* Play icon - Requirements: 2.4, 2.5 */
          <svg className={config.icon} fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Progress Bar with Time Display */}
      {showProgress && state.duration > 0 && (
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {/* Current Time - Requirements: 3.3 */}
          <span
            className="text-xs font-mono whitespace-nowrap"
            style={{ color: currentTheme.colors.textMuted }}
          >
            {formatTime(state.currentTime)}
          </span>

          {/* Progress Bar Container - Requirements: 3.1, 3.2, 3.4 */}
          <div className="flex-1 relative">
            <div
              ref={progressBarRef}
              className={`${config.progress} w-full rounded-full overflow-hidden cursor-pointer`}
              style={{
                backgroundColor: isDark
                  ? currentTheme.colors.border
                  : '#e5e7eb',
              }}
              onClick={handleProgressClick}
              onMouseMove={handleProgressMouseMove}
              onMouseLeave={handleProgressMouseLeave}
              role="slider"
              aria-label="Audio progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPercent)}
              tabIndex={0}
            >
              <div
                className="h-full transition-all duration-150 ease-out rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: currentTheme.colors.primary,
                }}
              />
            </div>

            {/* Hover Tooltip - Requirements: 3.4 */}
            {hoverState.isHovering && (
              <div
                className="absolute bottom-full mb-2 px-2 py-1 text-xs font-mono rounded shadow-lg pointer-events-none transform -translate-x-1/2 whitespace-nowrap z-10"
                style={{
                  left: `${hoverState.position}px`,
                  backgroundColor: isDark
                    ? currentTheme.colors.surface
                    : currentTheme.colors.primary,
                  color: isDark ? currentTheme.colors.text : '#ffffff',
                }}
              >
                {formatTime(hoverState.time)}
              </div>
            )}
          </div>

          {/* Duration - Requirements: 3.3 */}
          <span
            className="text-xs font-mono whitespace-nowrap"
            style={{ color: currentTheme.colors.textMuted }}
          >
            {formatTime(state.duration)}
          </span>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
