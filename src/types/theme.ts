import type { CategoryId } from './index';

/**
 * Theme definition for visual customization
 * Requirements: 1.1, 1.2 - Curated visual themes with soft, calming colors
 */
export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;      // Main accent color (hex)
    secondary: string;    // Secondary accent (hex)
    background: string;   // Page background gradient (Tailwind classes)
    headerGradient: string; // Header gradient (CSS)
    surface: string;      // Card/modal backgrounds (hex)
    text: string;         // Primary text (hex)
    textMuted: string;    // Secondary text (hex)
    border: string;       // Border colors (hex)
    success: string;      // Completion indicators (hex)
    categoryColors: Record<CategoryId, string>;
  };
  preview: string;        // Preview swatch gradient (CSS)
}

/**
 * Theme context value for state management
 */
export interface ThemeContextValue {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
}

/**
 * Storage key for theme persistence
 */
export const THEME_STORAGE_KEY = 'prenatal-learning-theme';

/**
 * Default theme ID
 */
export const DEFAULT_THEME_ID = 'blossom';
