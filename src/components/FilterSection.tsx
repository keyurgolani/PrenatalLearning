import React, { useRef, useEffect } from 'react';
import type { Category, CategoryId, DifficultyLevel } from '../types';
import { ViewModeToggle } from './ViewModeToggle';
import { LayoutToggle } from './LayoutToggle';
import { useViewMode } from '../contexts/ViewModeContext';
import { learningPaths, type LearningPath } from '../data/learningPaths';

interface FilterSectionProps {
  categories: Category[];
  selectedCategory: CategoryId;
  selectedDifficulty: DifficultyLevel | 'all';
  searchTerm: string;
  onCategoryChange: (category: CategoryId) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
  onSearchChange: (term: string) => void;
  /** Optional: Auto-focus search input when entering Explore Mode */
  autoFocusSearch?: boolean;
  /** Selected learning path for Learning Path mode */
  selectedPath?: LearningPath;
  /** Callback when learning path changes */
  onPathChange?: (path: LearningPath) => void;
}

/**
 * FilterSection component for filtering stories
 * 
 * Requirements:
 * - 1.2: Category filter buttons
 * - 1.3: Search input for keyword filtering
 * - 4.3: Distinct, harmonious colors for each category
 * - 5.1: Auto-focus search input on Explore Mode entry
 * - 5.2: Auto-focus search input when switching from Learning Path to Explore Mode
 * - 5.3: Visual focus indicator on search input
 * - 2.1: ViewModeToggle integration
 * - 3.1: LayoutToggle integration
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
  selectedPath = learningPaths[0],
  onPathChange,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { viewMode } = useViewMode();
  const previousViewModeRef = useRef(viewMode);

  // Auto-focus search input when entering Explore Mode
  // Requirements: 5.1, 5.2
  useEffect(() => {
    if (autoFocusSearch && viewMode === 'explore') {
      // Focus on initial load in Explore Mode or when switching from Learning Path to Explore
      if (previousViewModeRef.current === 'learning-path' || previousViewModeRef.current === viewMode) {
        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
    previousViewModeRef.current = viewMode;
  }, [viewMode, autoFocusSearch]);
  const difficulties: { value: DifficultyLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'foundational', label: 'Foundational' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <section className="bg-white/80 backdrop-blur-sm py-6 px-6 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Row: View Mode Toggle, Search Input, Layout Toggle */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle - Requirements: 2.1 */}
          <ViewModeToggle />

          {/* Search Input - Requirements: 5.1, 5.2, 5.3 */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
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
              placeholder="Search stories by title or description..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:border-transparent focus:shadow-lg focus:shadow-purple-100 transition-all duration-200 bg-white/90"
              aria-label="Search stories"
            />
          </div>

          {/* Layout Toggle - Only show in Explore Mode - Requirements: 3.1 */}
          {viewMode === 'explore' && <LayoutToggle />}
        </div>

        {/* Learning Path Selector - Only show in Learning Path mode */}
        {viewMode === 'learning-path' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Choose Your Learning Path
            </label>
            <div className="flex flex-wrap gap-2">
              {learningPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => onPathChange?.(path)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      selectedPath.id === path.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {path.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Filters - Only show in Explore mode */}
        {viewMode === 'explore' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? `${category.color} text-white shadow-md scale-105`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Difficulty Filters - Only show in Explore mode */}
        {viewMode === 'explore' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">
              Difficulty Level
            </label>
            <div className="flex flex-wrap gap-2">
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
                      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? `${colorClass} text-white shadow-md scale-105`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
