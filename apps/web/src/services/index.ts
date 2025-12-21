export {
  createStorageService,
  storageService,
  STORAGE_KEYS,
} from './storageService';

export {
  exerciseStorageService,
  EXERCISE_STORAGE_KEY,
  type IExerciseStorageService,
} from './exerciseStorageService';

export {
  getOrderedStories,
  getCurrentPosition,
  getNextTopic,
  getCurrentTopic,
  buildLearningPathItems,
  getProgressStats,
  isStoryInPath,
  getStoryPosition,
} from './learningPathService';

export {
  searchService,
  search,
  getSuggestions,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  findHighlightRanges,
  type SearchResult,
  type SearchSuggestion,
  type MatchedField,
  type HighlightRange,
  type RecentSearchesData,
} from './searchService';

export {
  getUserPresets,
  getAllPresets,
  savePreset,
  deletePreset,
  getPresetById,
  filtersMatchPreset,
  findMatchingPreset,
  BUILT_IN_PRESETS,
  type FilterPreset,
} from './filterPresetService';

export {
  continueService,
  getLastViewed,
  setLastViewed,
  clearLastViewed,
  getNextSuggested,
  calculateProgressPercentage,
  updateLastViewed,
  formatLastViewedDate,
  type LastViewedData,
} from './continueService';

export {
  relatedService,
  getRelatedStories,
  getRelatedStoriesForStory,
  type RelatedStory,
} from './relatedService';

export {
  streakService,
  createStreakService,
  getLocalDateString,
  parseLocalDate,
  getDaysDifference,
  areConsecutiveDays,
  calculateCurrentStreak,
  detectMilestone,
  calculateLongestStreak,
  getUniqueLearningDays,
  calculateAverageActivities,
  getActivityCalendar,
  type IStreakService,
} from './streakService';

export {
  streakApi,
  getStreaks,
  recordActivity,
  getStreakHistory,
  getStreakCalendar,
  getStreakRecord,
} from './streakApi';

export {
  kickService,
  createKickService,
  generateKickId,
  generateSessionId,
  getDateFromTimestamp,
  validateKickEvent,
  filterKicksByDateRange,
  aggregateKicksByStory,
  aggregateKicksByCategory,
  getKickTimeline,
  calculateKickStats,
  countSessionKicks,
  // API-based kick service exports
  apiKickService,
  logKick as logKickApi,
  getKicks as getKicksApi,
  updateKick as updateKickApi,
  deleteKick as deleteKickApi,
  getDailyStats,
  getTimePatterns,
  getStats as getKickStatsApi,
  type IKickService,
  type IApiKickService,
  type KickEventApi,
  type DailyKickStats,
  type PeriodStats,
  type TimePatterns,
  type KickStatsApi,
} from './kickService';

export {
  kickApi,
  logKick,
  getKickStats,
  getKicksByStory,
  getKickTimeline as getKickTimelineApi,
  getSessionKicks,
  getSessionKickCount,
  getAllKicks,
  getKickRecord,
} from './kickApi';

export {
  journalService,
  createJournalService,
  generateJournalId,
  getDateFromTimestamp as getJournalDateFromTimestamp,
  validateContentLength,
  truncateForPreview,
  sortEntriesChronologically,
  filterEntriesByDateRange,
  filterEntriesByStory,
  filterEntriesByCategory,
  applyFilters,
  // API-based journal service exports
  apiJournalService,
  getEntries as getJournalEntriesApi,
  getCalendarData,
  createEntry as createJournalEntryApi,
  updateEntry as updateJournalEntryApi,
  deleteEntry as deleteJournalEntryApi,
  getMoodStats,
  type IJournalService,
  type IApiJournalService,
  type CalendarData,
  type MoodStats,
  type CreateJournalEntryData,
  type UpdateJournalEntryData,
} from './journalService';

export {
  journalApi,
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  saveJournalDraft,
  getJournalDraft,
  clearJournalDraft,
  getJournalRecord,
} from './journalApi';


export {
  dashboardService,
  createDashboardService,
  calculatePercentage,
  getCompletedStoryIds,
  calculateCategoryProgress,
  calculateTrimesterProgress,
  buildActivityTimeline,
  type IDashboardService,
} from './dashboardService';

export {
  dashboardApi,
  getDashboard,
  getCategoryProgress,
  getTrimesterProgress,
  getRecentActivity,
} from './dashboardApi';

export {
  manifestService,
  createManifestService,
  parseAudioManifest,
  parseImageManifest,
  serializeAudioManifestEntry,
  serializeImageManifestEntry,
  loadAudioManifest,
  loadImageManifest,
  validateAudioFile,
  validateImageFile,
  getAudioSegmentKey,
  type ManifestService,
} from './manifestService';


export {
  authService,
  register as authRegister,
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  AuthServiceError,
} from './authService';

export {
  apiClient,
  request,
  get,
  post,
  put,
  patch,
  del,
  upload,
  setAuthErrorHandler,
  clearAuthErrorHandler,
  addRequestInterceptor,
  addResponseInterceptor,
  addErrorInterceptor,
  ApiError,
  type RequestOptions,
} from './apiClient';

export {
  accountService,
  updateAccount,
  updateEmail,
  changePassword,
  deleteAccount,
  recoverAccount,
  type AccountUpdateResponse,
  type PasswordChangeResponse,
  type AccountDeletionResponse,
  type AccountRecoveryResponse,
} from './accountService';

export {
  profileService,
  getProfiles,
  createProfile,
  getProfile,
  updateProfile,
  archiveProfile,
  setActiveProfile,
  hasGuestData,
  getGuestDataSummary,
  migrateLocalData,
} from './profileService';

export {
  preferencesService,
  getPreferences,
  updatePreferences,
  loadGuestPreferences,
  saveGuestPreferences,
  clearGuestPreferences,
} from './preferencesService';

export {
  guestStorageService,
  GUEST_STORAGE_KEYS,
  GUEST_PROFILE_ID,
  getCompletedStories as getGuestCompletedStories,
  saveCompletedStories as saveGuestCompletedStories,
  markStoryCompleted as markGuestStoryCompleted,
  isStoryCompleted as isGuestStoryCompleted,
  getProgressState as getGuestProgressState,
  saveProgressState as saveGuestProgressState,
  getGuestPreferences as getGuestStoragePreferences,
  saveGuestPreferences as saveGuestStoragePreferences,
  getGuestStreakData,
  saveGuestStreakData,
  initializeGuestStreak,
  recordGuestActivity,
  getGuestKickData,
  saveGuestKickData,
  initializeGuestKickRecord,
  logGuestKick,
  getGuestJournalData,
  saveGuestJournalData,
  initializeGuestJournalRecord,
  addGuestJournalEntry,
  saveGuestJournalDraft,
  getGuestJournalDraft,
  clearGuestJournalDraft,
  hasGuestData as hasGuestStorageData,
  getGuestDataSummary as getGuestStorageDataSummary,
  collectGuestData,
  clearAllGuestData,
  type GuestDataSummary,
  type GuestData,
} from './guestStorageService';

export {
  voiceNoteService,
  uploadVoiceNote,
  getVoiceNoteUrl,
  deleteVoiceNote,
  getBestSupportedMimeType,
  isSupportedMimeType,
  validateVoiceNote,
  SUPPORTED_AUDIO_TYPES,
  MAX_VOICE_NOTE_DURATION_SECONDS,
  MAX_VOICE_NOTE_SIZE_BYTES,
  type VoiceNote,
  type AudioCompressionOptions,
  type IVoiceNoteService,
} from './voiceNoteService';
