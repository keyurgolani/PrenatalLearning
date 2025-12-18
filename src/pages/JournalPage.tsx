import React, { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header, Footer } from '../components';
import { JournalEntryForm, JournalList, JournalPrompts } from '../components/journal';
import type { JournalEntry } from '../types/journal';
import { stories } from '../data/stories';
import { useTheme } from '../contexts';

/**
 * JournalPage component - dedicated page for journal management
 * 
 * Requirements:
 * - 9.1: Provide dedicated Journal page listing all entries
 * - 9.3: Allow editing existing journal entries
 * - 9.4: Allow deleting journal entries with confirmation
 */

interface JournalPageProps {
  /** Completed stories count for header */
  completedCount: number;
  /** Total stories count for header */
  totalCount: number;
}

type ViewMode = 'list' | 'create' | 'edit' | 'view';

// Temporary profile ID - in production this would come from auth context
const TEMP_PROFILE_ID = 'default-profile';

export const JournalPage: React.FC<JournalPageProps> = ({
  completedCount,
  totalCount,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentTheme } = useTheme();
  
  // View state
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const mode = searchParams.get('mode');
    return (mode as ViewMode) || 'list';
  });
  
  // Selected entry for editing/viewing
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  
  // Story ID from URL (for creating entry from story page)
  const storyIdParam = searchParams.get('storyId');
  const storyId = storyIdParam ? parseInt(storyIdParam, 10) : undefined;
  
  // Prompt from URL
  const promptParam = searchParams.get('prompt');
  
  // Refresh trigger for list
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get story title if storyId is provided
  const storyTitle = useMemo(() => {
    if (!storyId) return undefined;
    const story = stories.find(s => s.id === storyId);
    return story?.title;
  }, [storyId]);

  const progressPercentage = Math.round((completedCount / totalCount) * 100);
  const backgroundClass = currentTheme.colors.background;

  // Handle creating new entry
  const handleCreateNew = useCallback(() => {
    setSelectedEntry(null);
    setViewMode('create');
    setSearchParams({ mode: 'create' });
  }, [setSearchParams]);

  // Handle selecting entry for editing
  const handleSelectEntry = useCallback((entry: JournalEntry) => {
    setSelectedEntry(entry);
    setViewMode('edit');
    setSearchParams({ mode: 'edit', entryId: entry.id });
  }, [setSearchParams]);

  // Handle entry saved
  const handleEntrySaved = useCallback(() => {
    setViewMode('list');
    setSelectedEntry(null);
    setRefreshTrigger(prev => prev + 1);
    // Clear URL params
    setSearchParams({});
  }, [setSearchParams]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    setViewMode('list');
    setSelectedEntry(null);
    setSearchParams({});
  }, [setSearchParams]);

  // Handle delete
  const handleDeleteEntry = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Handle prompt selection
  const handleSelectPrompt = useCallback((prompt: string) => {
    setSelectedEntry(null);
    setViewMode('create');
    setSearchParams({ mode: 'create', prompt: encodeURIComponent(prompt) });
  }, [setSearchParams]);

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${backgroundClass} transition-theme`}>
      <Header
        completedCount={completedCount}
        totalCount={totalCount}
        progressPercentage={progressPercentage}
      />

      <main className="flex-1 w-full px-4 lg:px-6 xl:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Journal</h1>
              <p className="text-gray-500 text-sm mt-1">
                Reflect on your learning journey
              </p>
            </div>
            
            {viewMode === 'list' && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Entry
              </button>
            )}
            
            {viewMode !== 'list' && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </button>
            )}
          </div>

          {/* Content based on view mode */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Journal list */}
              <div className="lg:col-span-2">
                <JournalList
                  profileId={TEMP_PROFILE_ID}
                  onSelectEntry={handleSelectEntry}
                  onDeleteEntry={handleDeleteEntry}
                  refreshTrigger={refreshTrigger}
                />
              </div>
              
              {/* Prompts sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-4 shadow-sm sticky top-4">
                  <JournalPrompts
                    storyId={storyId}
                    onSelectPrompt={handleSelectPrompt}
                  />
                </div>
              </div>
            </div>
          )}

          {(viewMode === 'create' || viewMode === 'edit') && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Entry form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {viewMode === 'edit' ? 'Edit Entry' : 'New Entry'}
                  </h2>
                  <JournalEntryForm
                    profileId={TEMP_PROFILE_ID}
                    storyId={storyId}
                    storyTitle={storyTitle}
                    initialPrompt={promptParam ? decodeURIComponent(promptParam) : undefined}
                    existingEntry={selectedEntry || undefined}
                    onSave={handleEntrySaved}
                    onCancel={handleCancel}
                  />
                </div>
              </div>
              
              {/* Prompts sidebar (only for new entries) */}
              {viewMode === 'create' && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-4 shadow-sm sticky top-4">
                    <JournalPrompts
                      storyId={storyId}
                      onSelectPrompt={handleSelectPrompt}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JournalPage;
