// User model
export {
  type User,
  type UserDocument,
  emailSchema,
  passwordSchema,
  userNameSchema,
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
  getUsersCollection,
} from './User.js';

// UserPreferences model
export {
  type UserPreferences,
  type UserPreferencesDocument,
  type ThemeType,
  type FontSizeType,
  type ReadingModeType,
  type NotificationPreferences,
  type AccessibilityPreferences,
  type TopicProgressEntry,
  type TopicProgressMap,
  themeSchema,
  fontSizeSchema,
  readingModeSchema,
  notificationPreferencesSchema,
  accessibilityPreferencesSchema,
  topicProgressEntrySchema,
  topicProgressMapSchema,
  updatePreferencesSchema,
  type UpdatePreferencesInput,
  DEFAULT_PREFERENCES,
  getUserPreferencesCollection,
} from './UserPreferences.js';

// JournalEntry model
export {
  type JournalEntry,
  type JournalEntryDocument,
  type MoodType,
  type TopicReference,
  type JourneyReference,
  MOOD_TYPES,
  moodTypeSchema,
  topicReferenceSchema,
  journeyReferenceSchema,
  createJournalEntrySchema,
  updateJournalEntrySchema,
  type CreateJournalEntryInput,
  type UpdateJournalEntryInput,
  normalizeDateToMidnight,
  getJournalEntriesCollection,
} from './JournalEntry.js';

// VoiceNote model
export {
  type VoiceNote,
  type VoiceNoteDocument,
  type VoiceNoteMimeType,
  VOICE_NOTE_MAX_DURATION_SECONDS,
  VOICE_NOTE_ALLOWED_MIME_TYPES,
  voiceNoteMimeTypeSchema,
  createVoiceNoteSchema,
  type CreateVoiceNoteInput,
  isValidVoiceNoteDuration,
  getVoiceNotesCollection,
} from './VoiceNote.js';

// KickEvent model
export {
  type KickEvent,
  type KickEventDocument,
  kickNoteSchema,
  logKickSchema,
  updateKickSchema,
  type LogKickInput,
  type UpdateKickInput,
  getKickEventsCollection,
} from './KickEvent.js';

// Progress model
export {
  type ProgressRecord,
  type ProgressDocument,
  createProgressSchema,
  updateProgressSchema,
  type CreateProgressInput,
  type UpdateProgressInput,
  getProgressCollection,
} from './Progress.js';

// Streak model
export {
  type StreakRecord,
  type StreakDocument,
  type StreakHistoryEntry,
  streakHistoryEntrySchema,
  updateStreakSchema,
  type UpdateStreakInput,
  DEFAULT_STREAK,
  getStreaksCollection,
} from './Streak.js';
