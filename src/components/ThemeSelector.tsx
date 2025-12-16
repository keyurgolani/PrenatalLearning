import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../types/theme';

/**
 * ThemeSelector component for choosing visual themes
 * Requirements: 1.2 - Display at least 3 curated theme options with preview swatches
 * Requirements: 1.3 - Apply theme colors within 200ms
 */
export const ThemeSelector: React.FC = () => {
  const { currentTheme, themes, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
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
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
          role="listbox"
          aria-label="Theme options"
        >
          <div className="p-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide px-2 py-1 font-medium">
              Choose Theme
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {themes.map((theme: Theme) => (
              <ThemeOption
                key={theme.id}
                theme={theme}
                isSelected={theme.id === currentTheme.id}
                onSelect={handleThemeSelect}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ThemeOptionProps {
  theme: Theme;
  isSelected: boolean;
  onSelect: (themeId: string) => void;
}

/**
 * Individual theme option with preview swatch
 */
const ThemeOption: React.FC<ThemeOptionProps> = ({ theme, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(theme.id)}
      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 transition-colors duration-150 ${
        isSelected ? 'bg-gray-50' : ''
      }`}
      role="option"
      aria-selected={isSelected}
    >
      {/* Theme Preview Swatch */}
      <div
        className="w-10 h-10 rounded-lg shadow-sm flex-shrink-0"
        style={{ background: theme.preview }}
        aria-hidden="true"
      />
      
      {/* Theme Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{theme.name}</span>
          {isSelected && (
            <svg
              className="w-4 h-4 text-green-500"
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
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{theme.description}</p>
      </div>
    </button>
  );
};

export default ThemeSelector;
