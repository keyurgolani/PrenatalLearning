import React, { useState, useRef, useEffect, useCallback } from 'react';

interface JournalAudioPlayerProps {
  /** Audio source URL */
  src: string;
  /** Optional class name */
  className?: string;
}

/**
 * JournalAudioPlayer - Styled audio player for journal voice notes
 * Matches the look and feel of NarrateButton but with ±10 second skip buttons
 */
export const JournalAudioPlayer: React.FC<JournalAudioPlayerProps> = ({
  src,
  className = '',
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
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
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoading(true);
    setError(null);

    const updateDuration = () => {
      // Only set duration if it's a valid finite number
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

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Sometimes duration becomes available during playback
      updateDuration();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      updateDuration();
    };

    const handleLoadedData = () => {
      updateDuration();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [src]);

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

  return (
    <div
      className={`journal-audio-player flex items-center gap-2 p-2 rounded-xl transition-all duration-300 ${className}`}
      style={{
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        border: '1px solid rgba(147, 51, 234, 0.2)',
        boxShadow: isPlaying ? '0 0 20px rgba(147, 51, 234, 0.2)' : 'none',
      }}
    >
      {/* Hidden audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Skip Back 10s */}
      <button
        onClick={() => skipBySeconds(-10)}
        disabled={isLoading}
        className="skip-btn flex flex-col items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: 'rgba(147, 51, 234, 0.15)',
          color: '#7c3aed',
        }}
        aria-label="Skip back 10 seconds"
        title="-10s"
      >
        <span className="text-sm leading-none">↺</span>
        <span className="text-[8px] font-bold -mt-0.5">10</span>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        disabled={isLoading}
        className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
        style={{
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          boxShadow: isPlaying ? '0 0 12px rgba(147, 51, 234, 0.4)' : 'none',
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isLoading ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : isPlaying ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        )}
      </button>

      {/* Skip Forward 10s */}
      <button
        onClick={() => skipBySeconds(10)}
        disabled={isLoading}
        className="skip-btn flex flex-col items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none disabled:opacity-40"
        style={{
          backgroundColor: 'rgba(147, 51, 234, 0.15)',
          color: '#7c3aed',
        }}
        aria-label="Skip forward 10 seconds"
        title="+10s"
      >
        <span className="text-sm leading-none">↻</span>
        <span className="text-[8px] font-bold -mt-0.5">10</span>
      </button>

      {/* Progress section */}
      <div className="flex-1 min-w-0">
        {/* Time display */}
        <div className="flex items-center justify-end mb-1">
          <span className="text-[10px] tabular-nums text-gray-500">
            {formatTime(currentTime)}{duration > 0 && isFinite(duration) ? ` / ${formatTime(duration)}` : ''}
          </span>
        </div>

        {/* Progress Bar */}
        {duration > 0 && isFinite(duration) && (
          <div
            className="relative h-2 rounded-full cursor-pointer group"
            style={{ backgroundColor: 'rgba(147, 51, 234, 0.15)' }}
            onClick={handleProgressClick}
          >
            {/* Progress fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
              style={{
                width: `${Math.min(100, progressPercent)}%`,
                background: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
                boxShadow: `0 0 ${isPlaying ? '12px' : '6px'} rgba(147, 51, 234, 0.6)`,
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
                    animation: 'journal-shimmer-slide 2s ease-in-out infinite',
                  }}
                />
              </div>
            )}
            {/* Pulse ring when playing */}
            {isPlaying && (
              <div
                className="absolute w-3 h-3 rounded-full pointer-events-none"
                style={{
                  left: `calc(${Math.min(100, progressPercent)}% - 6px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#a855f7',
                  animation: 'journal-pulse-ring 1.5s ease-out infinite',
                  zIndex: 3,
                }}
              />
            )}
            {/* Playhead */}
            <div
              className="journal-playhead-knob absolute w-3 h-3 rounded-full shadow-lg pointer-events-none"
              style={{
                left: `calc(${Math.min(100, progressPercent)}% - 6px)`,
                top: '50%',
                backgroundColor: '#ffffff',
                border: '2px solid #7c3aed',
                boxShadow: '0 0 8px rgba(147, 51, 234, 0.6)',
                zIndex: 4,
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes journal-pulse-ring {
          0% { transform: translateY(-50%) scale(1); opacity: 0.8; }
          50% { transform: translateY(-50%) scale(2); opacity: 0; }
          100% { transform: translateY(-50%) scale(1); opacity: 0; }
        }
        @keyframes journal-shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .journal-playhead-knob {
          transform: translateY(-50%) scale(1);
          transition: transform 0.15s ease-out;
        }
        .group:hover .journal-playhead-knob {
          transform: translateY(-50%) scale(1.25);
        }
        .journal-audio-player .skip-btn {
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                      background-color 0.2s ease,
                      box-shadow 0.2s ease;
        }
        .journal-audio-player .skip-btn:hover {
          box-shadow: 0 0 12px rgba(147, 51, 234, 0.4);
        }
        .journal-audio-player .skip-btn:active {
          transition: transform 0.1s ease;
        }
      `}</style>
    </div>
  );
};

export default JournalAudioPlayer;
