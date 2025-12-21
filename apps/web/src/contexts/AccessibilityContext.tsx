/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Font size options for accessibility
 * Requirements: 7.2 - Support at least 5 font size levels (XS, S, M, L, XL)
 */
export type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Font family options - industry-praised fonts for optimal reading
 */
export type FontFamily = 'system' | 'georgia' | 'merriweather' | 'lora' | 'source-serif' | 'literata' | 'atkinson';

/**
 * Font family configurations with CSS values and labels
 */
export const fontFamilyConfig: Record<FontFamily, { label: string; value: string; description: string }> = {
  system: {
    label: 'System',
    value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    description: 'Default system font',
  },
  georgia: {
    label: 'Georgia',
    value: 'Georgia, "Times New Roman", serif',
    description: 'Classic serif, excellent readability',
  },
  merriweather: {
    label: 'Merriweather',
    value: '"Merriweather", Georgia, serif',
    description: 'Designed for screens, highly legible',
  },
  lora: {
    label: 'Lora',
    value: '"Lora", Georgia, serif',
    description: 'Elegant, well-balanced serif',
  },
  'source-serif': {
    label: 'Source Serif',
    value: '"Source Serif Pro", Georgia, serif',
    description: 'Adobe\'s open-source reading font',
  },
  literata: {
    label: 'Literata',
    value: '"Literata", Georgia, serif',
    description: 'Google\'s font for long-form reading',
  },
  atkinson: {
    label: 'Atkinson',
    value: '"Atkinson Hyperlegible", sans-serif',
    description: 'Designed for low vision readers',
  },
};

/**
 * All available font family options
 */
export const fontFamilyOptions: FontFamily[] = ['system', 'georgia', 'merriweather', 'lora', 'source-serif', 'literata', 'atkinson'];

/**
 * Font size scale multipliers
 * Applied to base font sizes for proportional scaling
 */
export const fontSizeScale: Record<FontSize, number> = {
  xs: 0.7,
  sm: 0.775,
  md: 0.85,
  lg: 0.95,
  xl: 1.05,
};

/**
 * Font size labels for display
 */
export const fontSizeLabels: Record<FontSize, string> = {
  xs: 'Extra Small',
  sm: 'Small',
  md: 'Medium',
  lg: 'Large',
  xl: 'Extra Large',
};

/**
 * All available font size options
 */
export const fontSizeOptions: FontSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/**
 * Accessibility settings interface
 * Requirements: 7.4 - Persist font size preference
 */
export interface AccessibilitySettings {
  fontSize: FontSize;
  fontFamily: FontFamily;
  reducedMotion: boolean;
  highContrast: boolean;
}

/**
 * Context value interface
 */
export interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
  toggleReducedMotion: () => void;
  toggleHighContrast: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'prenatal-accessibility-settings';

const defaultSettings: AccessibilitySettings = {
  fontSize: 'md',
  fontFamily: 'system',
  reducedMotion: false,
  highContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);


/**
 * Load accessibility settings from localStorage
 */
function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        fontSize: parsed.fontSize || defaultSettings.fontSize,
        fontFamily: parsed.fontFamily || defaultSettings.fontFamily,
        reducedMotion: parsed.reducedMotion ?? defaultSettings.reducedMotion,
        highContrast: parsed.highContrast ?? defaultSettings.highContrast,
      };
    }
  } catch {
    // Storage unavailable or invalid data
  }
  return defaultSettings;
}

/**
 * Save accessibility settings to localStorage
 * Requirements: 7.4 - Persist font size preference in user settings or localStorage
 */
function saveSettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    console.warn('Unable to save accessibility settings to localStorage');
  }
}

/**
 * Apply font size to document root as CSS custom property
 * Requirements: 7.3 - Apply font size changes immediately without page reload
 * Requirements: 7.5 - Scale all content text proportionally
 */
function applyFontSizeToDocument(fontSize: FontSize): void {
  const scale = fontSizeScale[fontSize];
  document.documentElement.style.setProperty('--font-scale', scale.toString());
  document.documentElement.setAttribute('data-font-size', fontSize);
}

/**
 * Apply font family to document root
 */
function applyFontFamilyToDocument(fontFamily: FontFamily): void {
  const config = fontFamilyConfig[fontFamily];
  document.documentElement.style.setProperty('--font-family-reading', config.value);
  document.documentElement.setAttribute('data-font-family', fontFamily);
}

/**
 * Apply reduced motion preference to document
 */
function applyReducedMotionToDocument(reducedMotion: boolean): void {
  document.documentElement.setAttribute('data-reduced-motion', reducedMotion.toString());
}

/**
 * Apply high contrast preference to document
 */
function applyHighContrastToDocument(highContrast: boolean): void {
  document.documentElement.setAttribute('data-high-contrast', highContrast.toString());
}

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * AccessibilityProvider component
 * Manages font size, reduced motion, and high contrast settings
 * Requirements: 7.4 - Persist to localStorage
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps): React.ReactElement {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Check system preference for reduced motion on initial load
    const loaded = loadSettings();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return {
      ...loaded,
      reducedMotion: loaded.reducedMotion || prefersReducedMotion,
    };
  });

  // Apply settings to document on mount and when they change
  useEffect(() => {
    applyFontSizeToDocument(settings.fontSize);
    applyFontFamilyToDocument(settings.fontFamily);
    applyReducedMotionToDocument(settings.reducedMotion);
    applyHighContrastToDocument(settings.highContrast);
  }, [settings]);

  // Listen for system reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setFontSize = useCallback((size: FontSize) => {
    setSettings(prev => {
      const newSettings = { ...prev, fontSize: size };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const setFontFamily = useCallback((family: FontFamily) => {
    setSettings(prev => {
      const newSettings = { ...prev, fontFamily: family };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setSettings(prev => {
      const newSettings = { ...prev, reducedMotion: !prev.reducedMotion };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => {
      const newSettings = { ...prev, highContrast: !prev.highContrast };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  }, []);

  const contextValue = useMemo<AccessibilityContextValue>(() => ({
    settings,
    setFontSize,
    setFontFamily,
    toggleReducedMotion,
    toggleHighContrast,
    resetToDefaults,
  }), [settings, setFontSize, setFontFamily, toggleReducedMotion, toggleHighContrast, resetToDefaults]);

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to access accessibility context
 * @throws Error if used outside of AccessibilityProvider
 */
export function useAccessibility(): AccessibilityContextValue {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export default AccessibilityProvider;
