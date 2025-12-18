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
  type IKickService,
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
  type IJournalService,
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
