import React, { useEffect, useRef } from 'react';
import type { SearchSuggestion } from '../services/searchService';
import { useTheme } from '../contexts/ThemeContext';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  isVisible: boolean;
  selectedIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  onSelectRecent: (search: string) => void;
  onClearRecent: () => void;
  showRecent: boolean;
}

/**
 * SearchSuggestions component displays autocomplete suggestions and recent searches
 * 
 * Requirements:
 * - 2.1: Display up to 5 autocomplete suggestions
 * - 2.2: Suggest matching story titles, category names, and key concepts
 * - 2.3: Allow keyboard navigation through suggestions using arrow keys
 * - 2.4: Immediately filter to show matching content on selection
 * - 2.5: Display recent searches when search field is focused
 */
export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  recentSearches,
  isVisible,
  selectedIndex,
  onSelect,
  onSelectRecent,
  onClearRecent,
  showRecent,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const listRef = useRef<HTMLUListElement>(null);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isVisible) return null;

  const hasContent = suggestions.length > 0 || (showRecent && recentSearches.length > 0);
  if (!hasContent) return null;

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'story':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'category':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        );
      case 'concept':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case 'recent':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'story': return 'Story';
      case 'category': return 'Category';
      case 'concept': return 'Concept';
      case 'recent': return 'Recent';
    }
  };

  // Calculate total items for proper indexing
  let itemIndex = 0;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg border overflow-hidden z-50"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        borderColor: isDark ? currentTheme.colors.border : '#e5e7eb',
      }}
      role="listbox"
      aria-label="Search suggestions"
    >
      <ul ref={listRef} className="max-h-80 overflow-y-auto">
        {/* Recent Searches Section */}
        {showRecent && recentSearches.length > 0 && suggestions.length === 0 && (
          <>
            <li
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wide flex items-center justify-between"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              <span>Recent Searches</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearRecent();
                }}
                className="text-xs font-normal normal-case hover:underline focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-1"
                style={{ color: isDark ? currentTheme.colors.primary : '#8b5cf6' }}
                aria-label="Clear recent searches"
              >
                Clear all
              </button>
            </li>
            {recentSearches.map((search) => {
              const currentIndex = itemIndex++;
              const isSelected = selectedIndex === currentIndex;
              return (
                <li
                  key={`recent-${search}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-purple-50' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? isDark ? 'rgba(139, 92, 246, 0.1)' : undefined
                      : undefined,
                    color: isDark ? currentTheme.colors.text : 'inherit',
                  }}
                  onClick={() => onSelectRecent(search)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isDark
                        ? 'rgba(139, 92, 246, 0.05)'
                        : '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '';
                    }
                  }}
                >
                  <span style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}>
                    {getTypeIcon('recent')}
                  </span>
                  <span className="flex-1 truncate">{search}</span>
                </li>
              );
            })}
          </>
        )}

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <>
            {suggestions.map((suggestion) => {
              const currentIndex = itemIndex++;
              const isSelected = selectedIndex === currentIndex;
              return (
                <li
                  key={`${suggestion.type}-${suggestion.text}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-purple-50' : ''
                  }`}
                  style={{
                    backgroundColor: isSelected
                      ? isDark ? 'rgba(139, 92, 246, 0.1)' : undefined
                      : undefined,
                    color: isDark ? currentTheme.colors.text : 'inherit',
                  }}
                  onClick={() => onSelect(suggestion)}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = isDark
                        ? 'rgba(139, 92, 246, 0.05)'
                        : '#f9fafb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '';
                    }
                  }}
                >
                  <span style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}>
                    {getTypeIcon(suggestion.type)}
                  </span>
                  <span className="flex-1 truncate">{suggestion.text}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : '#f3e8ff',
                      color: isDark ? currentTheme.colors.primary : '#7c3aed',
                    }}
                  >
                    {getTypeLabel(suggestion.type)}
                  </span>
                </li>
              );
            })}
          </>
        )}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
