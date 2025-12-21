import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Theme type
export type ThemeType = 'light' | 'dark' | 'system';

// Font size type
export type FontSizeType = 'small' | 'medium' | 'large';

// Reading mode type
export type ReadingModeType = 'normal' | 'focus' | 'night';

// Notification preferences interface
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  kickReminders: boolean;
  journalReminders: boolean;
}

// Accessibility preferences interface
export interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
}

// Topic progress interface
export interface TopicProgressEntry {
  storyId: number;
  currentStep: string;
  completedSteps: string[];
  lastAccessedAt: string;
}

export type TopicProgressMap = Record<number, TopicProgressEntry>;

// UserPreferences interface
export interface UserPreferences {
  _id: ObjectId;
  userId: ObjectId;
  theme: ThemeType;
  fontSize: FontSizeType;
  readingMode: ReadingModeType;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
  /** User's pregnancy due date for trimester calculation */
  dueDate?: Date | null;
  /** User's topic learning progress */
  topicProgress?: TopicProgressMap | null;
  /** Array of completed story/topic IDs */
  completedStories?: number[] | null;
  updatedAt: Date;
}

// UserPreferences document type for insertion (without _id)
export type UserPreferencesDocument = Omit<UserPreferences, '_id'>;

// Default preferences
export const DEFAULT_PREFERENCES: Omit<UserPreferencesDocument, 'userId' | 'updatedAt'> = {
  theme: 'system',
  fontSize: 'medium',
  readingMode: 'normal',
  notifications: {
    email: true,
    push: true,
    kickReminders: true,
    journalReminders: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    screenReader: false,
  },
};

// Zod validation schemas
export const themeSchema = z.enum(['light', 'dark', 'system']);
export const fontSizeSchema = z.enum(['small', 'medium', 'large']);
export const readingModeSchema = z.enum(['normal', 'focus', 'night']);

export const notificationPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  kickReminders: z.boolean(),
  journalReminders: z.boolean(),
});

export const accessibilityPreferencesSchema = z.object({
  reduceMotion: z.boolean(),
  highContrast: z.boolean(),
  screenReader: z.boolean(),
});

export const topicProgressEntrySchema = z.object({
  storyId: z.number(),
  currentStep: z.string(),
  completedSteps: z.array(z.string()),
  lastAccessedAt: z.string(),
});

export const topicProgressMapSchema = z.record(z.string(), topicProgressEntrySchema);

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

// Get user preferences collection
export function getUserPreferencesCollection(): Collection<UserPreferences> {
  return getDatabase().collection<UserPreferences>(COLLECTIONS.USER_PREFERENCES);
}
