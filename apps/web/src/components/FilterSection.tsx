import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Category, CategoryId, DifficultyLevel } from '../types';
import { LayoutToggle } from './LayoutToggle';
import type { LearningPath } from '../data/learningPaths';
import { useTheme } from '../contexts/ThemeContext';

interface FilterSectionProps {
  categories: Category[];
  selectedCategory: CategoryId;
  selectedDifficulty: DifficultyLevel | 'all';
  searchTerm: string;
  onCategoryChange: (category: CategoryId) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
  onSearchChange: (term: string) => void;
  autoFocusSearch?: boolean;
  selectedPath?: LearningPath;
  onPathChange?: (path: LearningPath) => void;
  isJourneyMode?: boolean;
}

/**
 * FilterSection component for filtering stories
 * Full-width search bar with view toggle on the right
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  selectedCategory,
  selectedDifficulty,
  searchTerm,
  onCategoryChange,
  onDifficultyChange,
  onSearchChange,
  autoFocusSearch = true,
  // selectedPath and onPathChange are kept for API compatibility but not used in Explore mode
  isJourneyMode = false,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local search term with prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Debounced search - 300ms delay (Requirement 1.4)
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearchChange(localSearchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localSearchTerm, onSearchChange]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  // Auto-focus search input (only in Explore mode when search bar is visible)
  useEffect(() => {
    if (autoFocusSearch && !isJourneyMode) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [autoFocusSearch, isJourneyMode]);

  const difficulties: { value: DifficultyLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'foundational', label: 'Foundational' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  // In Journey mode, don't render the filter section (view toggle is in header, paths in sidebar)
  if (isJourneyMode) {
    return null;
  }

  return (
    <section 
      className="backdrop-blur-sm py-3 px-4 lg:px-6 xl:px-8 2xl:px-12 shadow-sm sticky top-0 z-10 transition-theme"
      style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.8)' }}
      role="search"
      aria-label="Filter and search stories"
    >
      <div className="w-full space-y-4">
        {/* Top Row: Search Input and Layout Toggle */}
        <div className="flex items-center gap-3">
          {/* Search Input - Full width */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              ref={searchInputRef}
              type="text"
              id="story-search"
              name="story-search"
              placeholder="Search all topics..."
              value={localSearchTerm}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:border-transparent focus:shadow-lg focus:shadow-purple-100 transition-all duration-200 text-sm"
              style={{ 
                backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.9)',
                borderColor: isDark ? currentTheme.colors.border : '#e9d5ff',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: isDark ? currentTheme.colors.text : 'inherit'
              }}
              aria-label="Search stories"
            />
          </div>

          {/* Layout Toggle */}
          <LayoutToggle />
        </div>

        {/* Category Filters - Hide on XL screens (shown in sidebar) */}
        <div className="xl:hidden space-y-2">
          <span 
            id="category-filter-label"
            className="text-sm font-medium block"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
          >
            Categories
          </span>
          <div 
            className="flex flex-wrap gap-2" 
            role="group" 
            aria-labelledby="category-filter-label"
          >
            {categories.map((category) => {
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium button-interactive focus-ring
                    ${
                      isActive
                        ? `${category.color} text-white shadow-md scale-105`
                        : ''
                    }
                  `}
                  style={
                    !isActive
                      ? { 
                          backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
                          color: isDark ? currentTheme.colors.text : '#4b5563'
                        }
                      : undefined
                  }
                  aria-pressed={isActive}
                  aria-label={`Filter by ${category.name} category`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty Filters - Hide on XL screens (shown in sidebar) */}
        <div className="xl:hidden space-y-2">
          <span 
            id="difficulty-filter-label"
            className="text-sm font-medium block"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
          >
            Difficulty Level
          </span>
          <div 
            className="flex flex-wrap gap-2" 
            role="group" 
            aria-labelledby="difficulty-filter-label"
          >
            {difficulties.map(({ value, label }) => {
              const isActive = selectedDifficulty === value;
              const colorClass = {
                all: 'bg-gray-500',
                foundational: 'bg-green-500',
                intermediate: 'bg-yellow-500',
                advanced: 'bg-red-500',
              }[value];

              return (
                <button
                  key={value}
                  onClick={() => onDifficultyChange(value)}
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 animate-gentle-bounce animate-click focus-ring
                    ${
                      isActive
                        ? `${colorClass} text-white shadow-md scale-105`
                        : ''
                    }
                  `}
                  style={
                    !isActive
                      ? { 
                          backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
                          color: isDark ? currentTheme.colors.text : '#4b5563'
                        }
                      : undefined
                  }
                  aria-pressed={isActive}
                  aria-label={`Filter by ${label} difficulty`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
