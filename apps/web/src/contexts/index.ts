export { ThemeProvider, useTheme } from './ThemeContext';
export { ViewModeProvider, useViewMode } from './ViewModeContext';
export type { ViewMode, ViewModeContextValue } from './ViewModeContext';
export { LayoutProvider, useLayout } from './LayoutContext';
export type { LayoutMode, LayoutContextValue } from './LayoutContext';
export { TopicProgressProvider, useTopicProgress, LEARNING_STEPS, STEP_LABELS } from './TopicProgressContext';
export type { LearningStep, TopicProgress, TopicProgressContextValue } from './TopicProgressContext';
export { AccessibilityProvider, useAccessibility, fontSizeScale, fontSizeLabels, fontSizeOptions } from './AccessibilityContext';
export type { FontSize, AccessibilitySettings, AccessibilityContextValue } from './AccessibilityContext';
export { ReadingModeProvider, useReadingMode, scrollSpeedPx, scrollSpeedLabels } from './ReadingModeContext';
export type { ScrollSpeed, ReadingModeSettings, ReadingModeContextValue } from './ReadingModeContext';
export { TrimesterProvider, useTrimester } from './TrimesterContext';
export type { TrimesterContextValue } from './TrimesterContext';
export { StreakProvider, useStreak } from './StreakContext';
export type { StreakContextValue } from './StreakContext';
export { AudioProvider, useAudio } from './AudioContext';
export type { AudioState } from '../types/audio';
export { AuthProvider, useAuth } from './AuthContext';
export type { AuthContextValue } from '../types/auth';
export { ProfileProvider, useProfile } from './ProfileContext';
export type { ProfileContextValue, BabyProfile, CreateProfileData, UpdateProfileData } from '../types/auth';
export { PreferencesProvider, usePreferences } from './PreferencesContext';
export type { 
  PreferencesContextValue, 
  UserPreferences, 
  ThemePreference, 
  FontSizePreference, 
  ReadingModePreference,
  NotificationPreferences,
  AccessibilityPreferences,
} from '../types/auth';
export { JournalProvider, useJournal } from './JournalContext';
export type { JournalContextValue, CreateJournalEntry, UpdateJournalEntry } from './JournalContext';
export { KickProvider, useKick } from './KickContext';
export type { 
  KickContextValue, 
  KickEventApi, 
  DailyKickStats, 
  TimePatterns, 
  PeriodStats,
  KickStats,
} from './KickContext';
export { CompletedStoriesProvider, useCompletedStories } from './CompletedStoriesContext';
export type { CompletedStoriesContextValue } from './CompletedStoriesContext';
export { ModalProvider, useModal } from './ModalContext';

