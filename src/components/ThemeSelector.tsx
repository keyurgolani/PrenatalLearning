import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../types/theme';

interface ThemeSelectorProps {
  variant?: 'header' | 'dropdown';
}

/**
 * ThemeSelector component for choosing visual themes
 * Displays themes in a grid modal layout for better discoverability
 * Requirements: 2.1 - Display themes in a wider modal/popup layout
 * Requirements: 2.2 - Arrange theme options in a grid format
 * Requirements: 2.3 - Show minimum 6 themes visible without scrolling
 * Requirements: 2.4 - Apply theme within 200ms of click
 */
export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ variant = 'header' }) => {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Separate themes into light and dark groups
  const lightThemes = themes.filter((theme: Theme) => !theme.isDark);
  const darkThemes = themes.filter((theme: Theme) => theme.isDark);

  // Close modal with animation
  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150);
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    closeModal();
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  // Dropdown variant - inline theme grid for settings panel
  if (variant === 'dropdown') {
    return (
      <div className="space-y-3">
        {/* Light themes */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Light</p>
          <div className="grid grid-cols-4 gap-1.5">
            {lightThemes.slice(0, 4).map((theme: Theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`relative p-1 rounded-lg border-2 transition-all ${
                  theme.id === currentTheme.id
                    ? 'border-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={theme.name}
                title={theme.name}
              >
                <div
                  className="w-full aspect-square rounded"
                  style={{ background: theme.preview }}
                />
              </button>
            ))}
          </div>
        </div>
        {/* Dark themes */}
        <div>
          <p className="text-xs text-gray-500 mb-1.5">Dark</p>
          <div className="grid grid-cols-4 gap-1.5">
            {darkThemes.slice(0, 4).map((theme: Theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`relative p-1 rounded-lg border-2 transition-all ${
                  theme.id === currentTheme.id
                    ? 'border-purple-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={theme.name}
                title={theme.name}
              >
                <div
                  className="w-full aspect-square rounded"
                  style={{ background: theme.preview }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200 animate-gentle-bounce animate-click"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {/* Current Theme Preview Swatch */}
        <div
          className="w-6 h-6 rounded-full border-2 border-white/50"
          style={{ background: currentTheme.preview }}
          aria-hidden="true"
        />
        <span className="text-sm font-medium text-white hidden sm:inline">
          {currentTheme.name}
        </span>
        {/* Palette Icon */}
        <svg
          className="w-4 h-4 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-150 ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div
            className={`relative rounded-2xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden transform transition-all duration-150 ${
              isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
            }`}
            style={{ 
              backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff'
            }}
          >
            {/* Modal Header */}
            <div 
              className="flex items-center justify-between px-6 py-4"
              style={{ 
                borderBottom: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6'}`
              }}
            >
              <h2 
                id="theme-modal-title" 
                className="text-lg font-semibold"
                style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#111827' }}
              >
                Choose Your Theme
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg transition-colors duration-150 animate-gentle-bounce animate-click"
                style={{ 
                  color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280'
                }}
                aria-label="Close theme selector"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Light Themes Section */}
              <div className="mb-6">
                <h3 
                  className="text-sm font-medium uppercase tracking-wide mb-3"
                  style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                >
                  Light Themes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {lightThemes.map((theme: Theme) => (
                    <ThemeOption
                      key={theme.id}
                      theme={theme}
                      isSelected={theme.id === currentTheme.id}
                      onSelect={handleThemeSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Dark Themes Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Dark Themes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {darkThemes.map((theme: Theme) => (
                    <ThemeOption
                      key={theme.id}
                      theme={theme}
                      isSelected={theme.id === currentTheme.id}
                      onSelect={handleThemeSelect}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

/**
 * Individual theme option card for grid layout
 * Shows larger preview swatch, theme name, and selection checkmark
 */
const ThemeOption: React.FC<ThemeOptionProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-150 animate-gentle-bounce animate-click focus-ring ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      role="option"
      aria-selected={isSelected}
      aria-label={`${theme.name} theme${isSelected ? ', currently selected' : ''}`}
    >
      {/* Selection Checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-label="Selected"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Theme Preview Swatch */}
      <div
        className="w-14 h-14 rounded-lg shadow-sm mb-2"
        style={{ background: theme.preview }}
        aria-hidden="true"
      />

      {/* Theme Name */}
      <span className="text-xs font-medium text-gray-700 text-center leading-tight">
        {theme.name}
      </span>
    </button>
  );
};

export default ThemeSelector;
