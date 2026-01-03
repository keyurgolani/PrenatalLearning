/**
 * MiniAudioPlayer Component
 *
 * A compact audio player that appears in the header when audio is playing
 * and the user navigates away from the story page.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';

interface MiniAudioPlayerProps {
  /**
   * Display variant
   * - floating: Fixed bottom-center with rich styling (default)
   * - embedded: Clean styling for integration into other bars like ReadingModeBar
   */
  variant?: 'floating' | 'embedded';
}

export const MiniAudioPlayer: React.FC<MiniAudioPlayerProps> = ({ variant = 'floating' }) => {
  const { audioState, togglePlayPause, seekTo, stopAudio } = useAudio();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Destructure audioState for precise dependencies
  const { 
    storyId, 
    sectionName, 
    isPlaying, 
    isLoading, 
    duration, 
    currentTime, 
    storyTitle 
  } = audioState || { 
    storyId: null, 
    sectionName: '', 
    isPlaying: false, 
    isLoading: false, 
    duration: 0, 
    currentTime: 0, 
    storyTitle: '' 
  };

  // Show mini player only when audio is actively playing or loading
  const shouldShow = storyId !== null && (isPlaying || isLoading);

  // Handle visibility based on shouldShow
  useEffect(() => {
    if (shouldShow) {
      // Audio is playing - show immediately, cancel any exit animation
      if (!isVisible || isExiting) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsExiting(false);
        setIsVisible(true);
      }
    } else if (isVisible && !isExiting) {
      // Audio stopped/paused - start exit animation
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, isVisible, isExiting]);

  const handleNavigateToStory = useCallback(() => {
    if (storyId) {
      // Navigate to the specific section where audio is playing
      const sectionPath = sectionName ? `/${sectionName}` : '';
      navigate(`/topic/${storyId}${sectionPath}`);
    }
  }, [storyId, sectionName, navigate]);

  // Handle play/pause - when pausing, navigate to the topic
  const handlePlayPause = useCallback(async () => {
    if (isPlaying && storyId) {
      // User is pausing - capture navigation info before pausing
      // Navigate involves state change, so we do it after toggling
      
      // Pause the audio
      await togglePlayPause();
      
      // Navigate to the topic
      const sectionPath = sectionName ? `/${sectionName}` : '';
      navigate(`/topic/${storyId}${sectionPath}`);
    } else {
      // User is playing - just toggle
      await togglePlayPause();
    }
  }, [isPlaying, storyId, sectionName, togglePlayPause, navigate]);

  // Accurate seeking using getBoundingClientRect
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0 || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    
    // Calculate percentage with bounds checking
    const percent = Math.max(0, Math.min(1, clickX / barWidth));
    const targetTime = percent * duration;
    
    seekTo(targetTime);
  }, [duration, seekTo]);

  // Keyboard handling for seeking
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (duration <= 0) return;

    let newTime = currentTime;
    const seekAmount = 5; // 5 seconds

    switch (e.key) {
      case 'ArrowLeft':
        newTime = Math.max(0, currentTime - seekAmount);
        break;
      case 'ArrowRight':
        newTime = Math.min(duration, currentTime + seekAmount);
        break;
      case 'Home':
        newTime = 0;
        break;
      case 'End':
        newTime = duration;
        break;
      default:
        return;
    }

    e.preventDefault();
    seekTo(newTime);
  }, [currentTime, duration, seekTo]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible && !shouldShow && !isExiting) {
    return null;
  }

  const progressPercent = duration > 0
    ? Math.min(100, Math.max(0, (currentTime / duration) * 100))
    : 0;

  // Variant-specific styles
  const isFloating = variant === 'floating';
  const containerClasses = isFloating
    ? `
      mini-audio-player
      flex items-center gap-2 h-14 px-6 rounded-full
      backdrop-blur-md border
      transition-all ease-out cursor-default
      ${isExiting ? 'mini-player-exit' : 'mini-player-enter'}
    `
    : `
      flex items-center gap-2 h-full cursor-default
      transition-opacity duration-300
      ${isExiting ? 'opacity-0' : 'opacity-100'}
    `;

  const playButtonClasses = isFloating
      ? "w-7 h-7 flex items-center justify-center rounded-full bg-purple-500/40 hover:bg-purple-500/60 transition-colors"
      : "w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors";

  const textColorMain = isFloating ? "text-white/90" : "text-gray-900 dark:text-white/90";
  const textColorSub = isFloating ? "text-white/60" : "text-gray-500 dark:text-white/60";
  const progressBarBg = isFloating ? "bg-white/20" : "bg-gray-200 dark:bg-gray-700";
  const iconColor = isFloating ? "text-white" : "currentColor";
  const closeIconColor = isFloating ? "text-white/70" : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300";

  return (
    <div className={containerClasses}>
      {/* Play/Pause Button - pausing navigates to topic */}
      <button
        onClick={handlePlayPause}
        className={playButtonClasses}
        aria-label={isPlaying ? 'Pause and go to topic' : 'Play'}
      >
        {isLoading ? (
          <svg className={`w-3.5 h-3.5 ${iconColor} animate-spin`} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : isPlaying ? (
          <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className={`w-3.5 h-3.5 ${iconColor}`} viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        )}
      </button>

      {/* Section Info */}
      <button
        onClick={handleNavigateToStory}
        className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
        title={`Go to ${storyTitle}`}
      >
        <div className="flex items-center gap-2">
          <span className={`${textColorMain} text-xs font-medium truncate max-w-[100px]`}>
            🎧 {sectionName}
          </span>
          <span className={`${textColorSub} text-[10px] tabular-nums whitespace-nowrap`}>
            {formatTime(currentTime)}
          </span>
        </div>
      </button>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className={`progress-bar w-24 h-2.5 ${progressBarBg} rounded-full cursor-pointer overflow-hidden relative`}
        onClick={handleSeek}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Audio Progress"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
        title={`${formatTime(currentTime)} / ${formatTime(duration)}`}
      >
        <div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Seek indicator dot */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm opacity-0 hover-show"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>

      {/* Close Button */}
      <button
        onClick={stopAudio}
        className="p-2 rounded-full hover:bg-white/10 icon-interactive"
        aria-label="Stop audio"
      >
        <svg className={`w-3 h-3 ${closeIconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {isFloating && (
        <style>{`
          .mini-audio-player {
            background: linear-gradient(135deg, rgba(88, 28, 135, 0.9) 0%, rgba(124, 58, 237, 0.85) 100%);
            border-color: rgba(192, 132, 252, 0.3);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }
          
          .mini-audio-player:hover {
            border-color: rgba(192, 132, 252, 0.6);
            box-shadow: 
              0 0 20px rgba(168, 85, 247, 0.4),
              0 0 40px rgba(168, 85, 247, 0.2),
              0 4px 12px rgba(0, 0, 0, 0.3);
            transform: scale(1.02);
          }
          
          .mini-player-enter {
            animation: slideInUp 0.3s ease-out forwards;
          }
          
          .mini-player-exit {
            animation: fadeOutDown 0.6s ease-out forwards;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes fadeOutDown {
            from {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
            to {
              opacity: 0;
              transform: translateY(20px) scale(0.95);
            }
          }
          
          .progress-bar:hover .hover-show {
            opacity: 1;
          }
          
          .progress-bar {
            transition: transform 0.15s ease;
          }
          
          .progress-bar:hover {
            transform: scaleY(1.2);
          }
        `}</style>
      )}
    </div>
  );
};

export default MiniAudioPlayer;
