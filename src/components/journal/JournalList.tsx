import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { JournalEntry, JournalFilters, MoodType } from '../../types/journal';
import { truncateForPreview } from '../../services/journalService';
import { journalApi } from '../../services/journalApi';
import { stories } from '../../data/stories';
import { categories } from '../../data/categories';

/**
 * JournalList component for displaying journal entries
 * 
 * Requirements:
 * - 9.1: Provide dedicated Journal page listing all entries
 * - 9.2: Allow filtering journal entries by story, category, or date range
 * - 9.5: Display journal entries in reverse chronological order by default
 * - 9.6: Show preview of entry content in list view
 * 
 * Design Properties:
 * - Property 12: Journal chronological ordering
 * - Property 13: Journal preview truncation
 */

interface JournalListProps {
  /** Profile ID for the current user */
  profileId: string;
  /** Callback when an entry is selected for viewing/editing */
  onSelectEntry: (entry: JournalEntry) => void;
  /** Callback when an entry is deleted */
  onDeleteEntry: (entryId: string) => void;
  /** Custom class name */
  className?: string;
  /** Refresh trigger - increment to reload entries */
  refreshTrigger?: number;
}

const MOOD_EMOJI: Record<MoodType, string> = {
  happy: '😊',
  calm: '😌',
  reflective: '🤔',
  grateful: '🙏',
  hopeful: '✨',
  tired: '😴',
};

/**
 * Format date for display
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get story title by ID
 */
function getStoryTitle(storyId: number): string {
  const story = stories.find(s => s.id === storyId);
  return story?.title || 'Unknown Story';
}


export const JournalList: React.FC<JournalListProps> = ({
  profileId,
  onSelectEntry,
  onDeleteEntry,
  className = '',
  refreshTrigger = 0,
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // Filter state - Requirements: 9.2
  const [filters, setFilters] = useState<JournalFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Load entries
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const response = await journalApi.getEntries(profileId, filters);
        if (response.success && response.data) {
          // Property 12: Entries are already sorted by journalService
          setEntries(response.data);
        }
      } catch (error) {
        console.error('Failed to load journal entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEntries();
  }, [profileId, filters, refreshTrigger]);

  // Get unique stories from entries for filter dropdown
  const storyOptions = useMemo(() => {
    const storyIds = new Set(entries.map(e => e.storyId).filter(Boolean));
    return Array.from(storyIds).map(id => ({
      id: id!,
      title: getStoryTitle(id!),
    }));
  }, [entries]);

  // Filter handlers
  const handleStoryFilter = useCallback((storyId: string) => {
    setFilters(prev => ({
      ...prev,
      storyId: storyId ? parseInt(storyId, 10) : undefined,
    }));
  }, []);

  const handleCategoryFilter = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      category: category || undefined,
    }));
  }, []);

  const handleDateFromFilter = useCallback((date: string) => {
    setFilters(prev => ({
      ...prev,
      dateFrom: date || undefined,
    }));
  }, []);

  const handleDateToFilter = useCallback((date: string) => {
    setFilters(prev => ({
      ...prev,
      dateTo: date || undefined,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleDeleteClick = useCallback((entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmId(entryId);
  }, []);

  const handleConfirmDelete = useCallback(async (entryId: string) => {
    try {
      const response = await journalApi.deleteEntry(profileId, entryId);
      if (response.success) {
        setEntries(prev => prev.filter(e => e.id !== entryId));
        onDeleteEntry(entryId);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
    } finally {
      setDeleteConfirmId(null);
    }
  }, [profileId, onDeleteEntry]);

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filter toggle and controls - Requirements: 9.2 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              Active
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Story filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Story</label>
              <select
                value={filters.storyId?.toString() || ''}
                onChange={(e) => handleStoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All stories</option>
                {storyOptions.map(story => (
                  <option key={story.id} value={story.id}>
                    {story.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All categories</option>
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date from filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleDateFromFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Date to filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleDateToFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Entry count */}
      <p className="text-sm text-gray-500">
        {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        {hasActiveFilters && ' (filtered)'}
      </p>

      {/* Entries list - Requirements: 9.5, 9.6 */}
      {entries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-500">
            {hasActiveFilters ? 'No entries match your filters' : 'No journal entries yet'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="mt-2 text-purple-600 hover:text-purple-800 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(entry => (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-purple-200"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelectEntry(entry)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title and mood */}
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {entry.title}
                    </h3>
                    {entry.mood && (
                      <span title={entry.mood} className="text-lg">
                        {MOOD_EMOJI[entry.mood]}
                      </span>
                    )}
                  </div>

                  {/* Preview - Property 13: truncated to 150 chars */}
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncateForPreview(entry.content)}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>{formatDate(entry.createdAt)}</span>
                    <span>{formatTime(entry.createdAt)}</span>
                    {entry.storyId && (
                      <span className="flex items-center gap-1 text-purple-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        {getStoryTitle(entry.storyId).substring(0, 30)}...
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteClick(entry.id, e)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  aria-label="Delete entry"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Delete confirmation */}
              {deleteConfirmId === entry.id && (
                <div 
                  className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-sm text-gray-600 mr-2">Delete this entry?</span>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(entry.id)}
                    className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalList;
