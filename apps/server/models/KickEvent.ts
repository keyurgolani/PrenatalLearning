import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// KickEvent interface
export interface KickEvent {
  _id: ObjectId;
  userId: ObjectId;
  timestamp: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

// KickEvent document type for insertion (without _id)
export type KickEventDocument = Omit<KickEvent, '_id'>;

// Zod validation schemas
export const kickNoteSchema = z
  .string()
  .max(500, 'Note must be 500 characters or less')
  .optional();

export const logKickSchema = z.object({
  timestamp: z.string().datetime().optional(),
  note: kickNoteSchema,
});

export const updateKickSchema = z.object({
  note: kickNoteSchema,
});

export type LogKickInput = z.infer<typeof logKickSchema>;
export type UpdateKickInput = z.infer<typeof updateKickSchema>;

// Get kick events collection
export function getKickEventsCollection(): Collection<KickEvent> {
  return getDatabase().collection<KickEvent>(COLLECTIONS.KICK_EVENTS);
}
