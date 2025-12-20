/**
 * VoiceRecorder Component
 * 
 * Provides voice recording functionality for journal entries with microphone
 * permission handling, recording indicator, and duration limit enforcement.
 * 
 * Requirements:
 * - 12.1: THE System SHALL provide a voice recording button within the journal entry interface
 * - 12.2: WHEN the record button is pressed, THE System SHALL request microphone permission if not already granted
 * - 12.3: THE System SHALL display a recording indicator with elapsed time during recording
 * - 12.7: THE System SHALL limit voice note duration to 5 minutes maximum
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  getBestSupportedMimeType,
  MAX_VOICE_NOTE_DURATION_SECONDS,
} from '../../services/voiceNoteService';

/**
 * Recording state enum
 */
export type RecordingState = 'idle' | 'requesting' | 'recording' | 'preview' | 'stopped' | 'error';

/**
 * Props for VoiceRecorder component
 */
export interface VoiceRecorderProps {
  /** Callback when recording is complete with audio blob and duration */
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  /** Callback when recording is cancelled */
  onCancel?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Whether the recorder is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Maximum duration in seconds (default: 300 = 5 minutes) */
  maxDuration?: number;
  /** Auto-start recording when component mounts (default: true) */
  autoStart?: boolean;
}

/**
 * Format seconds to MM:SS display
 */
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * VoiceRecorder component for recording voice notes
 * Requirements: 12.1, 12.2, 12.3, 12.7
 */
export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  onError,
  disabled = false,
  className = '',
  maxDuration = MAX_VOICE_NOTE_DURATION_SECONDS,
  autoStart = true,
}) => {
  // Recording state
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  
  // Preview state
  const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimerRef = useRef<number | null>(null);
  const wasCancelledRef = useRef<boolean>(false);

  /**
   * Clean up resources
   */
  const cleanup = useCallback(() => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop playback timer
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    
    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // Ignore errors during cleanup
      }
    }
    mediaRecorderRef.current = null;

    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear audio chunks
    audioChunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Auto-start recording when component mounts
  useEffect(() => {
    if (autoStart && !disabled && recordingState === 'idle') {
      startRecording();
    }
  }, []); // Only run on mount

  /**
   * Start the elapsed time timer
   */
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    setElapsedTime(0);

    timerRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);

      // Auto-stop at max duration (Requirements: 12.7)
      if (elapsed >= maxDuration) {
        stopRecording();
      }
    }, 100); // Update more frequently for smoother display
  }, [maxDuration]);

  /**
   * Stop recording and process the audio
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  /**
   * Request microphone permission and start recording
   * Requirements: 12.2
   */
  const startRecording = useCallback(async () => {
    // Check if MediaRecorder is supported
    if (typeof MediaRecorder === 'undefined') {
      const error = new Error('Voice recording is not supported in this browser');
      setErrorMessage(error.message);
      setRecordingState('error');
      onError?.(error);
      return;
    }

    // Get the best supported MIME type
    const mimeType = getBestSupportedMimeType();
    if (!mimeType) {
      const error = new Error('No supported audio format found in this browser');
      setErrorMessage(error.message);
      setRecordingState('error');
      onError?.(error);
      return;
    }

    setRecordingState('requesting');
    setErrorMessage(null);
    setPermissionDenied(false);
    wasCancelledRef.current = false;

    try {
      // Request microphone permission with timeout (Requirements: 12.2)
      // Add a 10 second timeout to prevent getting stuck on permission request
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Microphone permission request timed out. Please check your browser settings.')), 10000);
      });

      const stream = await Promise.race([
        navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 16000, // Lower sample rate for voice
          },
        }),
        timeoutPromise,
      ]);

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder with the best supported format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 32000, // 32kbps for voice
      });

      mediaRecorderRef.current = mediaRecorder;

      // Handle data available event
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // If cancelled, don't process the recording
        if (wasCancelledRef.current) {
          wasCancelledRef.current = false;
          return;
        }

        // Calculate final duration
        const finalDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);

        // Create blob from chunks
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Go to preview state instead of immediately completing
        if (audioBlob.size > 0 && finalDuration > 0) {
          setPreviewBlob(audioBlob);
          setPreviewDuration(finalDuration);
          setRecordingState('preview');
          setPlaybackTime(0);
        } else {
          setRecordingState('idle');
          setElapsedTime(0);
        }
      };

      // Handle errors
      mediaRecorder.onerror = () => {
        const error = new Error('Recording error occurred');
        setErrorMessage(error.message);
        setRecordingState('error');
        cleanup();
        onError?.(error);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      setRecordingState('recording');
      startTimer();

    } catch (err) {
      cleanup();

      // Handle permission denied
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setErrorMessage('Microphone permission denied. Please allow microphone access to record voice notes.');
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setErrorMessage('No microphone found. Please connect a microphone to record voice notes.');
      } else {
        setErrorMessage(err instanceof Error ? err.message : 'Failed to start recording');
      }

      setRecordingState('error');
      onError?.(err instanceof Error ? err : new Error('Failed to start recording'));
    }
  }, [cleanup, onError, onRecordingComplete, startTimer]);

  /**
   * Handle cancel recording
   */
  const handleCancel = useCallback(() => {
    // Mark as cancelled so onstop doesn't go to preview
    wasCancelledRef.current = true;
    cleanup();
    setRecordingState('idle');
    setElapsedTime(0);
    setErrorMessage(null);
    setPreviewBlob(null);
    setPreviewDuration(0);
    setIsPlaying(false);
    setPlaybackTime(0);
    onCancel?.();
  }, [cleanup, onCancel]);

  /**
   * Handle retry after error
   */
  const handleRetry = useCallback(() => {
    setRecordingState('idle');
    setErrorMessage(null);
    setPermissionDenied(false);
  }, []);

  /**
   * Play/pause preview audio
   */
  const togglePlayback = useCallback(() => {
    if (!previewBlob) return;

    if (isPlaying) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // Play
      if (!audioRef.current) {
        audioRef.current = new Audio(URL.createObjectURL(previewBlob));
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setPlaybackTime(0);
          if (playbackTimerRef.current) {
            clearInterval(playbackTimerRef.current);
            playbackTimerRef.current = null;
          }
        };
      }
      audioRef.current.currentTime = playbackTime;
      audioRef.current.play();
      setIsPlaying(true);
      
      // Update playback time
      playbackTimerRef.current = window.setInterval(() => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      }, 100);
    }
  }, [previewBlob, isPlaying, playbackTime]);

  /**
   * Confirm and use the recording
   */
  const handleConfirmRecording = useCallback(() => {
    if (previewBlob && previewDuration > 0) {
      // Stop any playback
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
        playbackTimerRef.current = null;
      }
      
      onRecordingComplete(previewBlob, previewDuration);
      
      // Show success briefly then reset
      setRecordingState('stopped');
      setTimeout(() => {
        setRecordingState('idle');
        setPreviewBlob(null);
        setPreviewDuration(0);
        setElapsedTime(0);
        setPlaybackTime(0);
        setIsPlaying(false);
      }, 500);
    }
  }, [previewBlob, previewDuration, onRecordingComplete]);

  /**
   * Discard recording and re-record
   */
  const handleDiscardRecording = useCallback(() => {
    // Stop any playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    
    setPreviewBlob(null);
    setPreviewDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
    setElapsedTime(0);
    setRecordingState('idle');
    
    // Auto-start new recording if autoStart is enabled
    if (autoStart) {
      setTimeout(() => startRecording(), 100);
    }
  }, [autoStart, startRecording]);

  // Calculate remaining time
  const remainingTime = maxDuration - elapsedTime;
  const isNearLimit = remainingTime <= 30; // Warning when 30 seconds left

  return (
    <div className={`voice-recorder ${className}`}>
      {/* Idle state - Show record button or loading if autoStart (Requirements: 12.1) */}
      {recordingState === 'idle' && (
        autoStart ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-gray-600">Starting recorder...</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Start recording voice note"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
            </svg>
            Record Voice Note
          </button>
        )
      )}

      {/* Requesting permission state */}
      {recordingState === 'requesting' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg">
          <svg className="w-5 h-5 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600">Requesting microphone access...</span>
        </div>
      )}

      {/* Recording state - Show indicator with elapsed time (Requirements: 12.3) */}
      {recordingState === 'recording' && (
        <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Recording indicator */}
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
              <span className="font-medium text-red-700">Recording</span>
            </div>

            {/* Elapsed time display (Requirements: 12.3) */}
            <div className="flex items-center gap-2">
              <span className={`font-mono text-lg ${isNearLimit ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                {formatDuration(elapsedTime)}
              </span>
              <span className="text-gray-400">/</span>
              <span className="font-mono text-sm text-gray-500">
                {formatDuration(maxDuration)}
              </span>
            </div>
          </div>

          {/* Progress bar showing time remaining */}
          <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ${isNearLimit ? 'bg-red-600' : 'bg-red-500'}`}
              style={{ width: `${(elapsedTime / maxDuration) * 100}%` }}
            />
          </div>

          {/* Warning when near limit (Requirements: 12.7) */}
          {isNearLimit && (
            <p className="text-sm text-red-600">
              ⚠️ {remainingTime} seconds remaining
            </p>
          )}

          {/* Control buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={stopRecording}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
              aria-label="Stop recording"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
              Stop & Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
              aria-label="Cancel recording"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Preview state - Listen before saving */}
      {recordingState === 'preview' && previewBlob && (
        <div className="flex flex-col gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                </svg>
              </div>
              <span className="font-medium text-purple-700">Recording ready</span>
            </div>
            <span className="font-mono text-sm text-purple-600">{formatDuration(previewDuration)}</span>
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-3 bg-white rounded-lg p-3">
            <button
              type="button"
              onClick={togglePlayback}
              className="w-10 h-10 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            {/* Progress bar */}
            <div className="flex-1">
              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all duration-100"
                  style={{ width: `${previewDuration > 0 ? (playbackTime / previewDuration) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500 font-mono">{formatDuration(Math.floor(playbackTime))}</span>
                <span className="text-xs text-gray-500 font-mono">{formatDuration(previewDuration)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscardRecording}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
              aria-label="Discard and re-record"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Re-record
            </button>
            <button
              type="button"
              onClick={handleConfirmRecording}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-all"
              aria-label="Use this recording"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Use Recording
            </button>
          </div>
          
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Stopped state - Processing */}
      {recordingState === 'stopped' && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-700">Recording saved!</span>
        </div>
      )}

      {/* Error state */}
      {recordingState === 'error' && (
        <div className="flex flex-col gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-red-700">Recording Error</p>
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            </div>
          </div>

          {/* Permission denied help */}
          {permissionDenied && (
            <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
              <p className="font-medium mb-1">How to enable microphone:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click the lock/info icon in your browser's address bar</li>
                <li>Find "Microphone" in the permissions list</li>
                <li>Change it to "Allow"</li>
                <li>Refresh the page and try again</li>
              </ol>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
            >
              Try Again
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
