/**
 * VoiceNotePlayer Component
 * 
 * Provides playback controls for voice notes with play, pause, seek,
 * duration display, and delete functionality.
 * 
 * Requirements:
 * - 12.5: THE System SHALL display recorded voice notes with a playback interface in the journal entry
 * - 12.6: THE System SHALL allow users to delete voice notes from entries
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { getVoiceNoteUrl, deleteVoiceNote } from '../../services/voiceNoteService';
import type { VoiceNote } from '../../services/voiceNoteService';

/**
 * Playback state enum
 */
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

/**
 * Props for VoiceNotePlayer component
 */
export interface VoiceNotePlayerProps {
  /** The voice note to play */
  voiceNote: VoiceNote;
  /** Callback when voice note is deleted */
  onDelete?: (id: string) => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
  /** Whether delete is disabled */
  deleteDisabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Whether to show compact view */
  compact?: boolean;
}

/**
 * Format seconds to MM:SS display
 */
function formatDuration(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * VoiceNotePlayer component for playing voice notes
 * Requirements: 12.5, 12.6
 */
export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({
  voiceNote,
  onDelete,
  onError,
  deleteDisabled = false,
  className = '',
  compact = false,
}) => {
  // Playback state
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(voiceNote.duration || 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Audio element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  /**
   * Initialize audio element
   */
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      if (audio.duration && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      setPlaybackState('idle');
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setPlaybackState('idle');
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = () => {
      const error = new Error('Failed to load audio');
      setErrorMessage('Failed to load audio. The file may be unavailable.');
      setPlaybackState('error');
      onError?.(error);
    };

    const handleCanPlay = () => {
      if (playbackState === 'loading') {
        setPlaybackState('idle');
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Load the audio source
    audio.src = getVoiceNoteUrl(voiceNote.id);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
      audio.src = '';
    };
  }, [voiceNote.id, onError]);

  /**
   * Toggle play/pause
   * Requirements: 12.5 - Playback controls
   */
  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playbackState === 'error') {
      // Try to reload on error
      setErrorMessage(null);
      setPlaybackState('loading');
      audio.load();
      return;
    }

    if (playbackState === 'playing') {
      audio.pause();
      setPlaybackState('paused');
    } else {
      try {
        setPlaybackState('loading');
        await audio.play();
        setPlaybackState('playing');
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Playback failed');
        setErrorMessage('Failed to play audio');
        setPlaybackState('error');
        onError?.(error);
      }
    }
  }, [playbackState, onError]);

  /**
   * Handle seek via progress bar click
   * Requirements: 12.5 - Seek functionality
   */
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar || !duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  /**
   * Handle delete voice note
   * Requirements: 12.6 - Allow users to delete voice notes
   */
  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      // Stop playback first
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }

      await deleteVoiceNote(voiceNote.id);
      onDelete?.(voiceNote.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete voice note');
      setErrorMessage('Failed to delete voice note');
      onError?.(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [voiceNote.id, isDeleting, onDelete, onError]);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Format creation date
  const createdDate = new Date(voiceNote.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  // Compact view for inline display
  if (compact) {
    return (
      <div className={`voice-note-player inline-flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg ${className}`}>
        {/* Play/Pause button */}
        <button
          type="button"
          onClick={togglePlayPause}
          disabled={playbackState === 'loading'}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors disabled:opacity-50"
          aria-label={playbackState === 'playing' ? 'Pause' : 'Play'}
        >
          {playbackState === 'loading' ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : playbackState === 'playing' ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Duration */}
        <span className="text-sm text-purple-700 font-mono">
          {formatDuration(currentTime)} / {formatDuration(duration)}
        </span>

        {/* Delete button */}
        {onDelete && !deleteDisabled && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="flex-shrink-0 p-1 text-purple-400 hover:text-red-500 transition-colors disabled:opacity-50"
            aria-label="Delete voice note"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
            <div className="bg-white rounded-lg p-4 max-w-sm mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <p className="text-gray-700 mb-4">Delete this voice note?</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className={`voice-note-player bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-purple-100">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
          <span className="text-sm font-medium text-purple-700">Voice Note</span>
        </div>
        <span className="text-xs text-gray-500">{createdDate}</span>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="mx-4 mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Player controls */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* Play/Pause button - Requirements: 12.5 */}
          <button
            type="button"
            onClick={togglePlayPause}
            disabled={playbackState === 'loading'}
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={playbackState === 'playing' ? 'Pause voice note' : 'Play voice note'}
          >
            {playbackState === 'loading' ? (
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : playbackState === 'playing' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : playbackState === 'error' ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Progress and time */}
          <div className="flex-1">
            {/* Progress bar - Requirements: 12.5 (seek) */}
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="h-2 bg-purple-200 rounded-full cursor-pointer overflow-hidden group"
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-100 group-hover:bg-purple-600"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Time display - Requirements: 12.5 (duration display) */}
            <div className="flex justify-between mt-1.5">
              <span className="text-xs font-mono text-gray-600">
                {formatDuration(currentTime)}
              </span>
              <span className="text-xs font-mono text-gray-600">
                {formatDuration(duration)}
              </span>
            </div>
          </div>

          {/* Delete button - Requirements: 12.6 */}
          {onDelete && !deleteDisabled && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
              aria-label="Delete voice note"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Voice Note</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this voice note? The recording will be permanently removed.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceNotePlayer;
