import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface JournalAudioPlayerProps {
  /** Audio source URL */
  src: string;
  /** Optional class name */
  className?: string;
}

/**
 * JournalAudioPlayer - Styled audio player for journal voice notes
 * Matches the look and feel of global AudioPlayer but with ±10 second skip buttons
 */
export const JournalAudioPlayer: React.FC<JournalAudioPlayerProps> = ({
  src,
  className = '',
}) => {
  const { currentTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAnimationRef = useRef<number | undefined>(undefined);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load audio metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset state when src changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);
    if (playAnimationRef.current !== undefined) cancelAnimationFrame(playAnimationRef.current);

    const updateDuration = () => {
      if (audio.duration && isFinite(audio.duration) && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      updateDuration();
      setIsLoading(false);
    };

    const handleDurationChange = () => {
      updateDuration();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (playAnimationRef.current) cancelAnimationFrame(playAnimationRef.current);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      updateDuration();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      if (playAnimationRef.current) cancelAnimationFrame(playAnimationRef.current);
    };
  }, [src]);

  // Smooth progress animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (playAnimationRef.current !== undefined) {
        cancelAnimationFrame(playAnimationRef.current);
      }
      return;
    }

    const repeat = () => {
      const audio = audioRef.current;
      if (!audio) return;

      setCurrentTime(audio.currentTime);
      playAnimationRef.current = requestAnimationFrame(repeat);
    };

    playAnimationRef.current = requestAnimationFrame(repeat);

    return () => {
      if (playAnimationRef.current !== undefined) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying]);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Playback error:', err);
      setError('Playback failed');
    }
  }, [isPlaying]);

  const skipBySeconds = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration || !isFinite(duration)) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const targetTime = percent * duration;
    
    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  }, [duration]);

  const formatTime = (time: number): string => {
    if (!isFinite(time) || isNaN(time) || time < 0) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = (duration > 0 && isFinite(duration)) ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-red-50 rounded-lg text-red-600 text-sm ${className}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {error}
      </div>
    );
  }

  const isDark = currentTheme.isDark;

  return (
    <div
      className={`journal-audio-player flex items-center gap-2 p-2 rounded-xl transition-all duration-300 shadow-sm ${className}`}
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : `${currentTheme.colors.primary}10`, // 10% opacity primary
        border: `1px solid ${isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}20`}`,
        boxShadow: isPlaying ? `0 4px 12px ${currentTheme.colors.primary}30` : 'none',
      }}
    >
      { }
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Skip Back 10s */}
      <button
        onClick={() => skipBySeconds(-10)}
        disabled={isLoading}
        className="skip-btn flex flex-col items-center justify-center w-8 h-8 rounded-full icon-interactive focus-ring disabled:opacity-40"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : `${currentTheme.colors.primary}20`,
          color: currentTheme.colors.primary,
        }}
        aria-label="Skip back 10 seconds"
        title="-10s"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="text-[8px] font-bold -mt-0.5">10</span>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-full button-interactive focus-ring transition-transform active:scale-95"
        style={{
          backgroundColor: currentTheme.colors.primary,
          color: '#ffffff',
          boxShadow: isPlaying ? `0 0 12px ${currentTheme.colors.primary}60` : 'none',
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Skip Forward 10s */}
      <button
        onClick={() => skipBySeconds(10)}
        disabled={isLoading}
        className="skip-btn flex flex-col items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : `${currentTheme.colors.primary}20`,
          color: currentTheme.colors.primary,
        }}
        aria-label="Skip forward 10 seconds"
        title="+10s"
      >
        <RotateCw className="w-3.5 h-3.5" />
        <span className="text-[8px] font-bold -mt-0.5">10</span>
      </button>

      {/* Progress section */}
      <div className="flex-1 min-w-0">
        {/* Time display */}
        <div className="flex items-center justify-end mb-1">
          <span className="text-[10px] tabular-nums" style={{ color: currentTheme.colors.textMuted }}>
            {formatTime(currentTime)}{duration > 0 && isFinite(duration) ? ` / ${formatTime(duration)}` : ''}
          </span>
        </div>

        {/* Progress Bar */}
        {duration > 0 && isFinite(duration) && (
          <div
            className="relative h-2 rounded-full cursor-pointer group outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white rounded-full"
            style={{ 
              backgroundColor: isDark ? currentTheme.colors.border : `${currentTheme.colors.primary}20`,
              '--ring-color': currentTheme.colors.primary,
            } as React.CSSProperties}
            onClick={handleProgressClick}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') skipBySeconds(-5);
              if (e.key === 'ArrowRight') skipBySeconds(5);
              if (e.key === 'Home') { e.preventDefault(); setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0; }
              if (e.key === 'End') { e.preventDefault(); setCurrentTime(duration); if (audioRef.current) audioRef.current.currentTime = duration; }
            }}
            role="slider"
            tabIndex={0}
            aria-label="Audio Progress"
            aria-valuenow={currentTime}
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          >
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full pointer-events-none transition-[width] duration-75 ease-linear"
              style={{
                width: `${Math.min(100, progressPercent)}%`,
                backgroundColor: currentTheme.colors.primary,
                boxShadow: `0 0 ${isPlaying ? '12px' : '6px'} ${currentTheme.colors.primary}60`,
                zIndex: 1,
              }}
            />
            
            {/* Playhead */}
            <div
              className="journal-playhead-knob absolute w-3 h-3 rounded-full shadow-lg pointer-events-none"
              style={{
                left: `calc(${Math.min(100, progressPercent)}% - 6px)`,
                top: '50%',
                backgroundColor: '#ffffff',
                border: `2px solid ${currentTheme.colors.primary}`,
                boxShadow: `0 0 8px ${currentTheme.colors.primary}60`,
                zIndex: 4,
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        .journal-playhead-knob {
          transform: translateY(-50%) scale(0);
          transition: transform 0.15s ease-out, left 75ms linear;
        }
        .group:hover .journal-playhead-knob,
        .group:focus .journal-playhead-knob {
          transform: translateY(-50%) scale(1);
        }
        .journal-audio-player .skip-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background-color 0.2s ease,
                      box-shadow 0.2s ease;
        }
        .journal-audio-player .skip-btn:hover {
          box-shadow: 0 0 12px ${currentTheme.colors.primary}40;
        }
        .journal-audio-player .skip-btn:active {
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
};

export default JournalAudioPlayer;
