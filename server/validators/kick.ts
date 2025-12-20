import { z } from 'zod';
import { kickNoteSchema } from '../models/index.js';

// Log kick validation schema
export const logKickSchema = z.object({
  timestamp: z.string().datetime().optional(),
  note: kickNoteSchema,
});

// Update kick validation schema
export const updateKickSchema = z.object({
  note: kickNoteSchema,
});

// Get kicks query validation schema
export const getKicksQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(1000).optional().default(100),
  offset: z.coerce.number().int().nonnegative().optional().default(0),
});

// Get daily stats query validation schema
export const getDailyStatsQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).optional().default(7),
});

export type LogKickInput = z.infer<typeof logKickSchema>;
export type UpdateKickInput = z.infer<typeof updateKickSchema>;
export type GetKicksQuery = z.infer<typeof getKicksQuerySchema>;
export type GetDailyStatsQuery = z.infer<typeof getDailyStatsQuerySchema>;
