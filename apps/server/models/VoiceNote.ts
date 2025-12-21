import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Voice note constraints
export const VOICE_NOTE_MAX_DURATION_SECONDS = 300; // 5 minutes
export const VOICE_NOTE_ALLOWED_MIME_TYPES = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg'] as const;

export type VoiceNoteMimeType = typeof VOICE_NOTE_ALLOWED_MIME_TYPES[number];

// VoiceNote interface
export interface VoiceNote {
  _id: ObjectId;
  userId: ObjectId;
  journalEntryId: ObjectId;
  duration: number; // Duration in seconds
  fileId: ObjectId; // GridFS file reference
  mimeType: string;
  size: number; // File size in bytes
  createdAt: Date;
}

// VoiceNote document type for insertion (without _id)
export type VoiceNoteDocument = Omit<VoiceNote, '_id'>;

// Zod validation schemas
export const voiceNoteMimeTypeSchema = z.enum(VOICE_NOTE_ALLOWED_MIME_TYPES);

export const createVoiceNoteSchema = z.object({
  journalEntryId: z.string().min(1, 'Journal entry ID is required'),
  duration: z
    .number()
    .positive('Duration must be positive')
    .max(VOICE_NOTE_MAX_DURATION_SECONDS, `Duration must be ${VOICE_NOTE_MAX_DURATION_SECONDS} seconds or less`),
  mimeType: voiceNoteMimeTypeSchema,
  size: z.number().positive('Size must be positive'),
});

export type CreateVoiceNoteInput = z.infer<typeof createVoiceNoteSchema>;

/**
 * Validate voice note duration
 */
export function isValidVoiceNoteDuration(durationSeconds: number): boolean {
  return durationSeconds > 0 && durationSeconds <= VOICE_NOTE_MAX_DURATION_SECONDS;
}

// Get voice notes collection
export function getVoiceNotesCollection(): Collection<VoiceNote> {
  return getDatabase().collection<VoiceNote>(COLLECTIONS.VOICE_NOTES);
}
