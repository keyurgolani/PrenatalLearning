/**
 * AudioContext - Global audio state management
 * 
 * Provides a centralized way to track audio playback across the app.
 * The audio element lives here, not in individual components.
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { AudioInfo, AudioState } from '../types/audio.js';



interface AudioContextValue {
  audioState: AudioState | null;
  currentPageStoryId: number | null;
  currentSection: string | null;
  
  // Actions
  startAudio: (info: AudioInfo) => Promise<void>;
  stopAudio: () => void;
  togglePlayPause: () => Promise<void>;
  seekTo: (time: number) => void;
  setCurrentPageStoryId: (storyId: number | null) => void;
  setCurrentSection: (section: string | null) => void;
  
  // Helpers
  isOnAudioSection: () => boolean;
  shouldShowMiniPlayer: () => boolean;
}

const AudioContext = createContext<AudioContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioState | null>(null);
  const [currentPageStoryId, setCurrentPageStoryId] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentPartIndexRef = useRef(0);
  const audioSourcesRef = useRef<string[]>([]);
  const partDurationsRef = useRef<number[]>([]);
  const isPlayingRef = useRef(false);

  // Calculate cumulative time
  const getCumulativeTime = useCallback((partIndex: number, timeInPart: number): number => {
    let cumulative = 0;
    for (let i = 0; i < partIndex; i++) {
      cumulative += partDurationsRef.current[i] || 0;
    }
    return cumulative + timeInPart;
  }, []);

  // Get total duration
  const getTotalDuration = useCallback((): number => {
    return partDurationsRef.current.reduce((sum, d) => sum + d, 0);
  }, []);

  // Update progress via animation frame
  const startProgressUpdates = useCallback(() => {
    const update = () => {
      if (audioRef.current && isPlayingRef.current) {
        const currentTime = getCumulativeTime(currentPartIndexRef.current, audioRef.current.currentTime);
        setAudioState(prev => prev ? { ...prev, currentTime, currentPartIndex: currentPartIndexRef.current } : null);
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };
    animationFrameRef.current = requestAnimationFrame(update);
  }, [getCumulativeTime]);

  const stopProgressUpdates = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // Track event handlers for cleanup
  const handlersRef = useRef<{
    canplay?: () => void;
    error?: () => void;
    ended?: () => void;
  }>({});

  // Clean up audio element properly
  const cleanupAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    try {
      // Remove all event listeners first
      const handlers = handlersRef.current;
      if (handlers.canplay) {
        audio.removeEventListener('canplaythrough', handlers.canplay);
      }
      if (handlers.error) {
        audio.removeEventListener('error', handlers.error);
      }
      if (handlers.ended) {
        audio.removeEventListener('ended', handlers.ended);
      }
      handlersRef.current = {};
    } catch {
      // Ignore listener removal errors
    }
    
    try {
      audio.pause();
    } catch {
      // Ignore pause errors - audio may already be paused or in invalid state
    }
    
    try {
      audio.src = '';
      audio.load();
    } catch {
      // Ignore src/load errors - audio element may be in invalid state
    }
  }, []);

  // Ref to hold the loadPart function to avoid recursion issues
  const loadPartRef = useRef<((partIndex: number, startTime?: number, autoPlay?: boolean) => Promise<void>) | null>(null);

  // Load and play a specific part
  const loadPart = useCallback((partIndex: number, startTime = 0, autoPlay = true): Promise<void> => {
    return new Promise((resolve, reject) => {
      const src = audioSourcesRef.current[partIndex];
      if (!src) {
        reject(new Error('Invalid part index'));
        return;
      }

      // Clean up existing audio
      cleanupAudio();

      const audio = new Audio();
      audioRef.current = audio;
      currentPartIndexRef.current = partIndex;

      setAudioState(prev => prev ? { ...prev, isLoading: true, currentPartIndex: partIndex } : null);

      const handleCanPlay = async () => {
        if (startTime > 0) {
          audio.currentTime = startTime;
        }
        
        setAudioState(prev => prev ? { ...prev, isLoading: false } : null);
        
        if (autoPlay) {
          try {
            await audio.play();
            isPlayingRef.current = true;
            setAudioState(prev => prev ? { ...prev, isPlaying: true } : null);
            startProgressUpdates();
          } catch (err) {
            console.warn('Auto-play failed:', err);
            isPlayingRef.current = false;
            setAudioState(prev => prev ? { ...prev, isPlaying: false } : null);
          }
        }
        resolve();
      };

      const handleError = () => {
        setAudioState(prev => prev ? { ...prev, isLoading: false } : null);
        reject(new Error('Failed to load audio'));
      };

      const handleEnded = () => {
        const nextPart = currentPartIndexRef.current + 1;
        if (nextPart < audioSourcesRef.current.length) {
          // Use ref to call ourselves
          if (loadPartRef.current) {
            loadPartRef.current(nextPart, 0, true).catch(console.warn);
          }
        } else {
          // All parts finished
          isPlayingRef.current = false;
          stopProgressUpdates();
          setAudioState(prev => prev ? { 
            ...prev, 
            isPlaying: false, 
            currentTime: getTotalDuration(),
            currentPartIndex: 0 
          } : null);
        }
      };

      // Store handlers for cleanup
      handlersRef.current = { canplay: handleCanPlay, error: handleError, ended: handleEnded };

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('error', handleError, { once: true });
      audio.addEventListener('ended', handleEnded);
      audio.src = src;
      audio.load();
    });
  }, [cleanupAudio, startProgressUpdates, stopProgressUpdates, getTotalDuration]);

  // Update ref
  useEffect(() => {
    loadPartRef.current = loadPart;
  }, [loadPart]);

  // Start playing audio
  const startAudio = useCallback(async (info: AudioInfo) => {
    // Stop any existing audio
    stopProgressUpdates();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioSourcesRef.current = info.audioSources;
    partDurationsRef.current = info.partDurations;
    currentPartIndexRef.current = 0;

    const totalDuration = info.partDurations.reduce((sum, d) => sum + d, 0);

    setAudioState({
      ...info,
      isPlaying: false,
      isLoading: true,
      currentTime: 0,
      duration: totalDuration,
      currentPartIndex: 0,
    });

    try {
      await loadPart(0, 0, true);
    } catch (err) {
      console.warn('Failed to start audio:', err);
    }
  }, [loadPart, stopProgressUpdates]);

  // Stop audio completely
  const stopAudio = useCallback(() => {
    stopProgressUpdates();
    cleanupAudio();
    audioRef.current = null;
    isPlayingRef.current = false;
    audioSourcesRef.current = [];
    partDurationsRef.current = [];
    currentPartIndexRef.current = 0;
    setAudioState(null);
  }, [stopProgressUpdates, cleanupAudio]);

  // Toggle play/pause
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        isPlayingRef.current = true;
        setAudioState(prev => prev ? { ...prev, isPlaying: true } : null);
        startProgressUpdates();
      } else {
        audioRef.current.pause();
        isPlayingRef.current = false;
        stopProgressUpdates();
        setAudioState(prev => prev ? { ...prev, isPlaying: false } : null);
      }
    } catch (error) {
      console.warn('Toggle play/pause failed:', error);
    }
  }, [startProgressUpdates, stopProgressUpdates]);

  // Seek to a specific time
  const seekTo = useCallback((targetTime: number) => {
    const totalDuration = getTotalDuration();
    const clampedTime = Math.max(0, Math.min(totalDuration, targetTime));

    // Find which part this time falls into
    let cumulative = 0;
    for (let i = 0; i < partDurationsRef.current.length; i++) {
      const partEnd = cumulative + partDurationsRef.current[i];
      if (clampedTime < partEnd || i === partDurationsRef.current.length - 1) {
        const timeInPart = Math.max(0, clampedTime - cumulative);
        
        if (i !== currentPartIndexRef.current) {
          // Need to load a different part
          loadPart(i, timeInPart, isPlayingRef.current).catch(console.warn);
        } else if (audioRef.current) {
          audioRef.current.currentTime = timeInPart;
        }
        
        setAudioState(prev => prev ? { ...prev, currentTime: clampedTime } : null);
        break;
      }
      cumulative = partEnd;
    }
  }, [getTotalDuration, loadPart]);

  // Check if user is on the same section where audio is playing
  const isOnAudioSection = useCallback(() => {
    if (!audioState || audioState.storyId === null) return false;
    // Must be on the same story AND same section
    return audioState.storyId === currentPageStoryId && 
           audioState.sectionName === currentSection;
  }, [audioState, currentPageStoryId, currentSection]);

  // Show mini player when audio is playing and user is NOT on the audio's section
  const shouldShowMiniPlayer = useCallback(() => {
    if (!audioState || audioState.storyId === null) return false;
    // Show if on different story OR different section within same story
    const onDifferentStory = audioState.storyId !== currentPageStoryId;
    const onDifferentSection = audioState.storyId === currentPageStoryId && 
                               audioState.sectionName !== currentSection;
    return onDifferentStory || onDifferentSection;
  }, [audioState, currentPageStoryId, currentSection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopProgressUpdates();
      cleanupAudio();
    };
  }, [stopProgressUpdates, cleanupAudio]);

  const value: AudioContextValue = useMemo(() => ({
    audioState,
    currentPageStoryId,
    currentSection,
    startAudio,
    stopAudio,
    togglePlayPause,
    seekTo,
    setCurrentPageStoryId,
    setCurrentSection,
    isOnAudioSection,
    shouldShowMiniPlayer,
  }), [
    audioState,
    currentPageStoryId,
    currentSection,
    startAudio,
    stopAudio,
    togglePlayPause,
    seekTo,
    setCurrentPageStoryId,
    setCurrentSection,
    isOnAudioSection,
    shouldShowMiniPlayer,
  ]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextValue => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export default AudioContext;
