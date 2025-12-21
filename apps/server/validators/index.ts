// Auth validators
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateEmailSchema,
  type RegisterInput,
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ChangePasswordInput,
  type UpdateEmailInput,
} from './auth.js';

// Journal validators
export {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  getJournalEntriesQuerySchema,
  getCalendarDataQuerySchema,
  type CreateJournalEntryInput,
  type UpdateJournalEntryInput,
  type GetJournalEntriesQuery,
  type GetCalendarDataQuery,
} from './journal.js';

// Kick validators
export {
  logKickSchema,
  updateKickSchema,
  getKicksQuerySchema,
  getDailyStatsQuerySchema,
  type LogKickInput,
  type UpdateKickInput,
  type GetKicksQuery,
  type GetDailyStatsQuery,
} from './kick.js';

// Preferences validators
export {
  updatePreferencesSchema,
  type UpdatePreferencesInput,
} from './preferences.js';

// Voice note validators
export {
  createVoiceNoteSchema,
  type CreateVoiceNoteInput,
} from './voiceNote.js';
