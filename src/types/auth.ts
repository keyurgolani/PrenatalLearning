/**
 * User type for frontend authentication
 */
export interface User {
  id: string;
  email: string;
  name: string;
  dueDate?: string | null;
}

/**
 * Baby profile type for frontend
 */
export interface BabyProfile {
  id: string;
  name: string;
  expectedDate?: string | null;
  birthDate?: string | null;
  isArchived: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data for creating a new baby profile
 */
export interface CreateProfileData {
  name: string;
  expectedDate?: string;
  birthDate?: string;
}

/**
 * Data for updating a baby profile
 */
export interface UpdateProfileData {
  name?: string;
  expectedDate?: string | null;
  birthDate?: string | null;
}

/**
 * Profile context value interface
 * Requirements: 7.3, 7.4, 7.5 - Profile switching and management
 */
export interface ProfileContextValue {
  profiles: BabyProfile[];
  activeProfile: BabyProfile | null;
  isLoading: boolean;
  error: string | null;
  createProfile: (data: CreateProfileData) => Promise<BabyProfile>;
  switchProfile: (id: string) => Promise<void>;
  updateProfile: (id: string, data: UpdateProfileData) => Promise<BabyProfile>;
  archiveProfile: (id: string) => Promise<void>;
  refreshProfiles: () => Promise<void>;
  clearError: () => void;
}

/**
 * Authentication result from login/register
 */
export interface AuthResult {
  user: User;
  profile?: BabyProfile;
  token: string;
  message: string;
  warning?: {
    type: string;
    message: string;
    deletionDate?: string;
  };
}

/**
 * Authentication error response
 */
export interface AuthError {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Auth context value interface
 */
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

/**
 * Theme type for user preferences
 * Requirements: 9.1 - Persist theme preferences
 */
export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Font size type for user preferences
 * Requirements: 9.4 - Persist reading preferences
 */
export type FontSizePreference = 'small' | 'medium' | 'large';

/**
 * Reading mode type for user preferences
 * Requirements: 9.4 - Persist reading preferences
 */
export type ReadingModePreference = 'normal' | 'focus' | 'night';

/**
 * Notification preferences
 * Requirements: 9.3 - Persist notification preferences
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  kickReminders: boolean;
  journalReminders: boolean;
}

/**
 * Accessibility preferences
 * Requirements: 9.2 - Persist accessibility settings
 */
export interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
}

/**
 * User preferences interface
 * Requirements: 9.1, 9.2, 9.3, 9.4 - User preferences persistence
 */
export interface UserPreferences {
  theme: ThemePreference;
  fontSize: FontSizePreference;
  readingMode: ReadingModePreference;
  notifications: NotificationPreferences;
  accessibility: AccessibilityPreferences;
  updatedAt: string;
}

/**
 * Default user preferences
 */
export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, 'updatedAt'> = {
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

/**
 * Preferences context value interface
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5 - User preferences management
 */
export interface PreferencesContextValue {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  updatePreferences: (prefs: Partial<Omit<UserPreferences, 'updatedAt'>>) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  clearError: () => void;
}
