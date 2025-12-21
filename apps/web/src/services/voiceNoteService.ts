/**
 * Voice Note Service
 * Handles voice note upload, retrieval, and deletion for journal entries
 * 
 * Requirements:
 * - 12.4: Save audio as a blob in the database
 * - 12.8: Compress audio to reduce storage size while maintaining quality
 */

import { del, ApiError } from './apiClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Voice note metadata returned from the API
 */
export interface VoiceNote {
  id: string;
  journalEntryId: string;
  duration: number; // Duration in seconds
  mimeType: string;
  size: number; // File size in bytes
  createdAt: string; // ISO date string
}

/**
 * Response from voice note upload
 */
interface VoiceNoteUploadResponse {
  message: string;
  voiceNote: VoiceNote;
}

/**
 * Options for audio compression
 * Requirements: 12.8 - Compress audio to reduce storage size
 */
export interface AudioCompressionOptions {
  /** Target bitrate in bits per second (default: 32000 for voice) */
  bitrate?: number;
  /** Sample rate in Hz (default: 16000 for voice) */
  sampleRate?: number;
}

/**
 * Supported audio MIME types
 * WebM/Opus is preferred for compression, with fallbacks for Safari
 */
export const SUPPORTED_AUDIO_TYPES = [
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/mpeg',
  'audio/ogg',
] as const;

/**
 * Maximum voice note duration in seconds (5 minutes)
 * Requirements: 12.7 - Limit voice note duration to 5 minutes maximum
 */
export const MAX_VOICE_NOTE_DURATION_SECONDS = 300;

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_VOICE_NOTE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Get the best supported audio MIME type for recording
 * Prefers WebM/Opus for better compression
 * Requirements: 12.8 - Handle audio compression (WebM/Opus)
 * 
 * @returns The best supported MIME type or null if none supported
 */
export function getBestSupportedMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') {
    return null;
  }

  // Prefer WebM/Opus for better compression
  const preferredTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/mpeg',
  ];

  for (const type of preferredTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return null;
}

/**
 * Check if a MIME type is supported for voice notes
 * 
 * @param mimeType - The MIME type to check
 * @returns True if the MIME type is supported
 */
export function isSupportedMimeType(mimeType: string): boolean {
  // Normalize the MIME type (remove codec info for comparison)
  const normalizedType = mimeType.split(';')[0].toLowerCase();
  return SUPPORTED_AUDIO_TYPES.some(
    supported => supported.split(';')[0] === normalizedType
  );
}

/**
 * Convert a Blob to base64 string
 * 
 * @param blob - The blob to convert
 * @returns Promise resolving to base64 string
 */
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read audio blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Validate voice note before upload
 * 
 * @param audioBlob - The audio blob to validate
 * @param duration - Duration in seconds
 * @throws Error if validation fails
 */
export function validateVoiceNote(audioBlob: Blob, duration: number): void {
  // Check duration limit
  if (duration > MAX_VOICE_NOTE_DURATION_SECONDS) {
    throw new Error(
      `Voice note duration exceeds maximum of ${MAX_VOICE_NOTE_DURATION_SECONDS} seconds (5 minutes)`
    );
  }

  // Check file size
  if (audioBlob.size > MAX_VOICE_NOTE_SIZE_BYTES) {
    throw new Error(
      `Voice note size exceeds maximum of ${MAX_VOICE_NOTE_SIZE_BYTES / (1024 * 1024)}MB`
    );
  }

  // Check MIME type
  if (!isSupportedMimeType(audioBlob.type)) {
    throw new Error(
      `Unsupported audio format: ${audioBlob.type}. Supported formats: ${SUPPORTED_AUDIO_TYPES.join(', ')}`
    );
  }
}

/**
 * Upload a voice note to the server
 * Requirements: 12.4 - Save audio as a blob in the database
 * Requirements: 12.8 - Compress audio to reduce storage size
 * 
 * @param audioBlob - The audio blob to upload (WebM/Opus preferred)
 * @param journalEntryId - The ID of the journal entry to link to
 * @param duration - Duration of the recording in seconds
 * @returns Promise resolving to the created voice note metadata
 */
export async function uploadVoiceNote(
  audioBlob: Blob,
  journalEntryId: string,
  duration: number
): Promise<VoiceNote> {
  // Validate before upload
  validateVoiceNote(audioBlob, duration);

  // Convert blob to base64 for JSON transport
  const audioData = await blobToBase64(audioBlob);

  // Determine MIME type (normalize it)
  const mimeType = audioBlob.type.split(';')[0] || 'audio/webm';

  const url = `${API_BASE_URL}/voice-notes`;
  
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      journalEntryId,
      duration,
      mimeType,
      audioData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `Upload failed with status ${response.status}`,
      response.status,
      errorData.details
    );
  }

  const data: VoiceNoteUploadResponse = await response.json();
  return data.voiceNote;
}

/**
 * Get the URL for streaming a voice note
 * Requirements: 12.5 - Display recorded voice notes with a playback interface
 * 
 * @param id - The voice note ID
 * @returns The URL for streaming the voice note
 */
export function getVoiceNoteUrl(id: string): string {
  return `${API_BASE_URL}/voice-notes/${id}`;
}

/**
 * Delete a voice note from the server
 * Requirements: 12.6 - Allow users to delete voice notes from entries
 * 
 * @param id - The voice note ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function deleteVoiceNote(id: string): Promise<void> {
  await del(`/voice-notes/${id}`);
}

/**
 * Voice note service interface
 */
export interface IVoiceNoteService {
  uploadVoiceNote(
    audioBlob: Blob,
    journalEntryId: string,
    duration: number
  ): Promise<VoiceNote>;
  getVoiceNoteUrl(id: string): string;
  deleteVoiceNote(id: string): Promise<void>;
}

/**
 * Voice note service object
 * Requirements: 12.4, 12.8
 */
export const voiceNoteService: IVoiceNoteService = {
  uploadVoiceNote,
  getVoiceNoteUrl,
  deleteVoiceNote,
};

export default voiceNoteService;
