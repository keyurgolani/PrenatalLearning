import { z } from 'zod';
import {
  voiceNoteMimeTypeSchema,
  VOICE_NOTE_MAX_DURATION_SECONDS,
} from '../models/index.js';

// Create voice note validation schema
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
