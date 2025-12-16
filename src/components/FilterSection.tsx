import React from 'react';
import type { Category, CategoryId, DifficultyLevel } from '../types';

interface FilterSectionProps {
  categories: Category[];
  selectedCategory: CategoryId;
  selectedDifficulty: DifficultyLevel | 'all';
  searchTerm: string;
  onCategoryChange: (category: CategoryId) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
  onSearchChange: (term: string) => void;
}

/**
 * FilterSection component for filtering stories
 * 
 * Requirements:
 * - 1.2: Category filter buttons
 * - 1.3: Search input for keyword filtering
 * - 4.3: Distinct, harmonious colors for each category
 */
export const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  selectedCategory,
  selectedDifficulty,
  searchTerm,
  onCategoryChange,
  onDifficultyChange,
  onSearchChange,
}) => {
  const difficulties: { value: DifficultyLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'All Levels' },
    { value: 'foundational', label: 'Foundational' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  return (
    <section className="bg-white/80 backdrop-blur-sm py-6 px-6 shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative">
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
            type="text"
            placeholder="Search stories by title or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all bg-white/90"
            aria-label="Search stories"
          />
        </div>

        {/* Category Filters */}
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
                    ${isActive
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

        {/* Difficulty Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-600">Difficulty Level</label>
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
                    ${isActive
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
      </div>
    </section>
  );
};

export default FilterSection;
