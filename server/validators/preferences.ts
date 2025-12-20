import { z } from 'zod';
import {
  themeSchema,
  fontSizeSchema,
  readingModeSchema,
  notificationPreferencesSchema,
  accessibilityPreferencesSchema,
  topicProgressMapSchema,
} from '../models/index.js';

// Update preferences validation schema
export const updatePreferencesSchema = z.object({
  theme: themeSchema.optional(),
  fontSize: fontSizeSchema.optional(),
  readingMode: readingModeSchema.optional(),
  notifications: notificationPreferencesSchema.partial().optional(),
  accessibility: accessibilityPreferencesSchema.partial().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  topicProgress: topicProgressMapSchema.nullable().optional(),
  completedStories: z.array(z.number()).nullable().optional(),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
