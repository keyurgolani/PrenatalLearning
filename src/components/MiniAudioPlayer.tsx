/**
 * MiniAudioPlayer Component
 *
 * A compact audio player that appears in the header when audio is playing
 * and the user navigates away from the story page.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../contexts/AudioContext';

export const MiniAudioPlayer: React.FC = () => {
  const { audioState, togglePlayPause, seekTo, stopAudio } = useAudio();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Show mini player only when audio is actively playing or loading
  const shouldShow = audioState !== null && 
                     audioState.storyId !== null && 
                     (audioState.isPlaying || audioState.isLoading);

  // Handle visibility based on shouldShow
  useEffect(() => {
    if (shouldShow) {
      // Audio is playing - show immediately, cancel any exit animation
      setIsExiting(false);
      setIsVisible(true);
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
    if (audioState?.storyId) {
      // Navigate to the specific section where audio is playing
      const sectionPath = audioState.sectionName ? `/${audioState.sectionName}` : '';
      navigate(`/topic/${audioState.storyId}${sectionPath}`);
    }
  }, [audioState?.storyId, audioState?.sectionName, navigate]);

  // Handle play/pause - when pausing, navigate to the topic
  const handlePlayPause = useCallback(async () => {
    if (audioState?.isPlaying && audioState?.storyId) {
      // User is pausing - capture navigation info before pausing
      const storyId = audioState.storyId;
      const sectionName = audioState.sectionName;
      
      // Pause the audio
      await togglePlayPause();
      
      // Navigate to the topic
      const sectionPath = sectionName ? `/${sectionName}` : '';
      navigate(`/topic/${storyId}${sectionPath}`);
    } else {
      // User is playing - just toggle
      await togglePlayPause();
    }
  }, [audioState?.isPlaying, audioState?.storyId, audioState?.sectionName, togglePlayPause, navigate]);

  // Accurate seeking using getBoundingClientRect
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioState || audioState.duration <= 0 || !progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    
    // Calculate percentage with bounds checking
    const percent = Math.max(0, Math.min(1, clickX / barWidth));
    const targetTime = percent * audioState.duration;
    
    seekTo(targetTime);
  }, [audioState, seekTo]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isVisible || !audioState) {
    return null;
  }

  const progressPercent = audioState.duration > 0
    ? Math.min(100, Math.max(0, (audioState.currentTime / audioState.duration) * 100))
    : 0;

  return (
    <div
      className={`
        mini-audio-player
        flex items-center gap-2 h-11 px-3 rounded-xl
        backdrop-blur-md border
        transition-all ease-out cursor-default
        ${isExiting ? 'mini-player-exit' : 'mini-player-enter'}
      `}
    >
      {/* Play/Pause Button - pausing navigates to topic */}
      <button
        onClick={handlePlayPause}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-500/40 hover:bg-purple-500/60 transition-colors"
        aria-label={audioState.isPlaying ? 'Pause and go to topic' : 'Play'}
      >
        {audioState.isLoading ? (
          <svg className="w-3.5 h-3.5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ) : audioState.isPlaying ? (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l15 8-15 8V4z" />
          </svg>
        )}
      </button>

      {/* Section Info */}
      <button
        onClick={handleNavigateToStory}
        className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
        title={`Go to ${audioState.storyTitle}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-xs font-medium truncate max-w-[100px]">
            🎧 {audioState.sectionName}
          </span>
          <span className="text-white/60 text-[10px] tabular-nums whitespace-nowrap">
            {formatTime(audioState.currentTime)}
          </span>
        </div>
      </button>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        className="progress-bar w-24 h-2.5 bg-white/20 rounded-full cursor-pointer overflow-hidden relative"
        onClick={handleSeek}
        title={`${formatTime(audioState.currentTime)} / ${formatTime(audioState.duration)}`}
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
        className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
        aria-label="Stop audio"
      >
        <svg className="w-3 h-3 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

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
          animation: slideInRight 0.3s ease-out forwards;
        }
        
        .mini-player-exit {
          animation: fadeOutRight 0.6s ease-out forwards;
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes fadeOutRight {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(10px) scale(0.95);
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
    </div>
  );
};

export default MiniAudioPlayer;
