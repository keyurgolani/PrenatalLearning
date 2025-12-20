/**
 * NarrateButton Component
 *
 * A button component that provides audio narration for an entire section.
 * Uses the global AudioContext for audio management.
 */

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAudio } from '../contexts/AudioContext';

export interface NarrateButtonProps {
  /** Whether audio is available for this section */
  audioAvailable: boolean;
  /** Array of audio source URLs (multiple parts for long sections) */
  audioSources?: string[];
  /** Section name for display */
  sectionName?: string;
  /** Story ID for mini player navigation */
  storyId?: number;
  /** Story title for mini player display */
  storyTitle?: string;
}

/**
 * Stop all playing audio - delegates to AudioContext
 */
export function stopAllAudio(): void {
  // This is now handled by the AudioContext
  // Components should use useAudio().stopAudio() instead
}

export const NarrateButton: React.FC<NarrateButtonProps> = ({
  audioAvailable,
  audioSources = [],
  sectionName,
  storyId,
  storyTitle = '',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const { audioState, startAudio, togglePlayPause, seekTo } = useAudio();

  const [partDurations, setPartDurations] = useState<number[]>([]);
  const [totalDuration, setTotalDuration] = useState(0);
  const [audioFilesExist, setAudioFilesExist] = useState<boolean | null>(null);

  // Check if this button's audio is currently playing
  const isThisAudioPlaying = useMemo(() => {
    if (!audioState) return false;
    return audioState.storyId === storyId && audioState.sectionName === sectionName;
  }, [audioState, storyId, sectionName]);

  const isPlaying = isThisAudioPlaying && audioState?.isPlaying;
  const isLoading = isThisAudioPlaying && audioState?.isLoading;
  const currentTime = isThisAudioPlaying ? (audioState?.currentTime ?? 0) : 0;

  // Stable key for audio sources to prevent unnecessary re-runs
  const audioSourcesKey = useMemo(() => audioSources.join('|'), [audioSources]);

  // Validate audio files exist and load durations on mount
  useEffect(() => {
    if (!audioAvailable || audioSources.length === 0) {
      setAudioFilesExist(false);
      return;
    }

    let cancelled = false;
    const audioElements: HTMLAudioElement[] = [];

    const loadDurations = async () => {
      const durations: number[] = [];
      let anyFileExists = false;

      for (const src of audioSources) {
        if (cancelled) break;
        
        try {
          const audio = new Audio();
          audioElements.push(audio); // Track for cleanup
          
          const result = await new Promise<{ duration: number; exists: boolean }>((resolve) => {
            let resolved = false;
            
            const cleanup = () => {
              if (!resolved) {
                resolved = true;
                try {
                  audio.removeEventListener('loadedmetadata', handleMeta);
                  audio.removeEventListener('error', handleError);
                } catch {
                  // Ignore cleanup errors
                }
              }
            };
            
            const handleMeta = () => {
              cleanup();
              resolve({ duration: audio.duration, exists: true });
            };
            
            const handleError = () => {
              cleanup();
              resolve({ duration: 0, exists: false });
            };
            
            audio.addEventListener('loadedmetadata', handleMeta);
            audio.addEventListener('error', handleError);
            audio.src = src;
            
            // Timeout after 3 seconds
            setTimeout(() => {
              cleanup();
              resolve({ duration: 0, exists: false });
            }, 3000);
          });
          
          // Immediately release the audio element
          try {
            audio.src = '';
            audio.load();
          } catch {
            // Ignore cleanup errors
          }
          
          durations.push(result.duration);
          if (result.exists) {
            anyFileExists = true;
          }
        } catch {
          durations.push(0);
        }
      }

      if (!cancelled) {
        setPartDurations(durations);
        setTotalDuration(durations.reduce((sum, d) => sum + d, 0));
        setAudioFilesExist(anyFileExists);
      }
    };

    loadDurations();

    return () => {
      cancelled = true;
      // Clean up all audio elements safely
      audioElements.forEach(audio => {
        try {
          audio.pause();
          audio.src = '';
          audio.load();
        } catch {
          // Ignore cleanup errors
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioAvailable, audioSourcesKey]); // Use stable key instead of array reference

  // Don't render if no audio available or files don't exist
  if (!audioAvailable || audioSources.length === 0 || audioFilesExist === false) {
    return null;
  }

  // Don't render while still validating audio files
  if (audioFilesExist === null) {
    return null;
  }

  const handleTogglePlayPause = async () => {
    if (isThisAudioPlaying) {
      // This audio is already loaded, just toggle
      await togglePlayPause();
    } else {
      // Start new audio
      await startAudio({
        sectionName: sectionName || 'Audio',
        storyId: storyId ?? null,
        storyTitle,
        audioSources,
        partDurations,
      });
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (targetTime: number) => {
    if (isThisAudioPlaying) {
      seekTo(targetTime);
    }
  };

  const skipBySeconds = (seconds: number) => {
    handleSeek(currentTime + seconds);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const targetTime = percent * totalDuration;
    handleSeek(targetTime);
  };

  const displayDuration = isThisAudioPlaying ? (audioState?.duration ?? totalDuration) : totalDuration;
  const progressPercent = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0;

  return (
    <div
      className="narrate-button-container flex items-center gap-3 p-3 rounded-xl mb-4 transition-all duration-300"
      style={{
        backgroundColor: isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(147, 51, 234, 0.1)',
        border: `1px solid ${isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.2)'}`,
        boxShadow: isPlaying ? `0 0 20px ${isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.2)'}` : 'none',
      }}
    >
      {/* Skip Back 20s */}
      <button
        onClick={() => skipBySeconds(-20)}
        disabled={!isThisAudioPlaying || isLoading}
        className="skip-btn flex flex-col items-center justify-center w-11 h-11 rounded-full icon-interactive focus-ring disabled:opacity-40"
        style={{
          backgroundColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.15)',
          color: isDark ? '#C084FC' : '#7c3aed',
        }}
        aria-label="Skip back 20 seconds"
        title="-20s"
      >
        <span className="text-lg leading-none">↺</span>
        <span className="text-[10px] font-bold -mt-1">20</span>
      </button>

      {/* Skip Back 5s */}
      <button
        onClick={() => skipBySeconds(-5)}
        disabled={!isThisAudioPlaying || isLoading}
        className="skip-btn flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.15)',
          color: isDark ? '#C084FC' : '#7c3aed',
        }}
        aria-label="Skip back 5 seconds"
        title="-5s"
      >
        <span className="text-lg leading-none">↺</span>
        <span className="text-[10px] font-bold -mt-1">5</span>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={handleTogglePlayPause}
        disabled={isLoading}
        className="flex items-center justify-center w-12 h-12 rounded-full button-interactive focus-ring"
        style={{
          backgroundColor: isDark ? '#9333ea' : '#7c3aed',
          color: '#ffffff',
          boxShadow: isPlaying ? `0 0 12px ${isDark ? 'rgba(168, 85, 247, 0.6)' : 'rgba(147, 51, 234, 0.4)'}` : 'none',
        }}
        aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
      >
        {isLoading ? (
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        )}
      </button>

      {/* Skip Forward 5s */}
      <button
        onClick={() => skipBySeconds(5)}
        disabled={!isThisAudioPlaying || isLoading}
        className="skip-btn flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.15)',
          color: isDark ? '#C084FC' : '#7c3aed',
        }}
        aria-label="Skip forward 5 seconds"
        title="+5s"
      >
        <span className="text-lg leading-none">↻</span>
        <span className="text-[10px] font-bold -mt-1">5</span>
      </button>

      {/* Skip Forward 20s */}
      <button
        onClick={() => skipBySeconds(20)}
        disabled={!isThisAudioPlaying || isLoading}
        className="skip-btn flex flex-col items-center justify-center w-11 h-11 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: isDark ? 'rgba(168, 85, 247, 0.3)' : 'rgba(147, 51, 234, 0.15)',
          color: isDark ? '#C084FC' : '#7c3aed',
        }}
        aria-label="Skip forward 20 seconds"
        title="+20s"
      >
        <span className="text-lg leading-none">↻</span>
        <span className="text-[10px] font-bold -mt-1">20</span>
      </button>

      {/* Label and Progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm font-medium flex items-center gap-1.5"
            style={{ color: isDark ? '#C084FC' : '#7c3aed' }}
          >
            <span className={isPlaying ? 'animate-pulse' : ''}>🎧</span>
            Narrate{sectionName ? ` - ${sectionName}` : ''}
          </span>
          {displayDuration > 0 && (
            <span
              className="text-xs tabular-nums"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {formatTime(currentTime)} / {formatTime(displayDuration)}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {displayDuration > 0 && (
          <div
            className="relative h-3 rounded-full cursor-pointer group"
            style={{
              backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(147, 51, 234, 0.15)',
            }}
            onClick={handleProgressClick}
          >
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
              style={{
                width: `${Math.min(100, progressPercent)}%`,
                background: isDark
                  ? 'linear-gradient(90deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)'
                  : 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
                boxShadow: `0 0 ${isPlaying ? '12px' : '6px'} ${isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(147, 51, 234, 0.6)'}`,
                zIndex: 1,
              }}
            />
            {/* Shimmer effect when playing */}
            {isPlaying && (
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none overflow-hidden"
                style={{ zIndex: 2 }}
              >
                <div
                  className="absolute top-0 left-0 h-full w-1/3 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    animation: 'shimmer-slide 2s ease-in-out infinite',
                  }}
                />
              </div>
            )}
            {/* Pulse ring when playing */}
            {isPlaying && (
              <div
                className="absolute top-1/2 w-4 h-4 rounded-full pointer-events-none"
                style={{
                  left: `calc(${Math.min(100, progressPercent)}% - 8px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: isDark ? '#a855f7' : '#7c3aed',
                  animation: 'pulse-ring 1.5s ease-out infinite',
                  zIndex: 3,
                }}
              />
            )}
            {/* Playhead */}
            <div
              className="playhead-knob absolute w-4 h-4 rounded-full shadow-lg pointer-events-none"
              style={{
                left: `calc(${Math.min(100, progressPercent)}% - 8px)`,
                top: '50%',
                backgroundColor: '#ffffff',
                border: `2px solid ${isDark ? '#a855f7' : '#7c3aed'}`,
                boxShadow: `0 0 8px ${isDark ? 'rgba(168, 85, 247, 0.8)' : 'rgba(147, 51, 234, 0.6)'}`,
                zIndex: 4,
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: translateY(-50%) scale(1); opacity: 0.8; }
          50% { transform: translateY(-50%) scale(2); opacity: 0; }
          100% { transform: translateY(-50%) scale(1); opacity: 0; }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .playhead-knob {
          transform: translateY(-50%) scale(1);
          transition: transform 0.15s ease-out;
        }
        .group:hover .playhead-knob {
          transform: translateY(-50%) scale(1.25);
        }
        .skip-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background-color 0.2s ease,
                      box-shadow 0.2s ease;
        }
        .skip-btn:hover {
          box-shadow: 0 0 12px rgba(147, 51, 234, 0.4);
        }
        .skip-btn:active {
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
};

export default NarrateButton;
