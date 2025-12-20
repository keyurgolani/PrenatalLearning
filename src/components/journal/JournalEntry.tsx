import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useJournal } from '../../contexts/JournalContext';
import type { UpdateJournalEntry } from '../../contexts/JournalContext';
import type { JournalEntry as JournalEntryType, MoodType } from '../../types/journal';
import { stories } from '../../data/stories';
import { learningPaths } from '../../data/learningPaths';

/**
 * JournalEntry component - Displays and edits a single journal entry
 * 
 * Requirements:
 * - 10.5: THE System SHALL allow users to view and edit past journal entries by selecting a date
 * - 10.6: THE System SHALL auto-save journal entries as the user types
 * - 11.6: WHEN a topic or journey is mentioned, THE System SHALL create a clickable link to that content
 */

interface JournalEntryProps {
  /** The journal entry to display/edit */
  entry: JournalEntryType;
  /** Whether the entry is in edit mode */
  isEditing?: boolean;
  /** Callback when edit mode is toggled */
  onEditToggle?: (editing: boolean) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Mood display configuration
 * Requirements: 11.1, 11.2 - Pregnancy-appropriate mood options
 * Requirements: 11.9 - Mood is optional and can be null/undefined
 */
const MOOD_CONFIG: Record<MoodType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: 'bg-yellow-100 text-yellow-700' },
  calm: { emoji: '😌', label: 'Calm', color: 'bg-blue-100 text-blue-700' },
  anxious: { emoji: '😰', label: 'Anxious', color: 'bg-orange-100 text-orange-700' },
  tired: { emoji: '😴', label: 'Tired', color: 'bg-gray-100 text-gray-700' },
  excited: { emoji: '🤩', label: 'Excited', color: 'bg-amber-100 text-amber-700' },
  emotional: { emoji: '🥹', label: 'Emotional', color: 'bg-rose-100 text-rose-700' },
  grateful: { emoji: '🙏', label: 'Grateful', color: 'bg-green-100 text-green-700' },
  hopeful: { emoji: '✨', label: 'Hopeful', color: 'bg-pink-100 text-pink-700' },
  uncomfortable: { emoji: '😣', label: 'Uncomfortable', color: 'bg-red-100 text-red-700' },
  nesting: { emoji: '🏠', label: 'Nesting', color: 'bg-teal-100 text-teal-700' },
};

/**
 * Auto-save debounce delay in milliseconds
 * Requirements: 10.6 - Auto-save as user types
 */
const AUTO_SAVE_DELAY = 1500;

/**
 * Topic/Journey suggestion item for autocomplete
 */
interface SuggestionItem {
  type: 'topic' | 'journey';
  id: number | string;
  title: string;
}

/**
 * Get all available topics and journeys for autocomplete
 */
function getAllSuggestions(): SuggestionItem[] {
  const topicSuggestions: SuggestionItem[] = stories.map(story => ({
    type: 'topic',
    id: story.id,
    title: story.title,
  }));

  const journeySuggestions: SuggestionItem[] = learningPaths.map(path => ({
    type: 'journey',
    id: path.id,
    title: path.name,
  }));

  return [...topicSuggestions, ...journeySuggestions];
}


/**
 * Parse content for topic/journey mentions and create clickable links
 * Requirements: 11.6 - Create clickable links for mentioned topics/journeys
 */
function parseContentWithLinks(content: string): React.ReactNode[] {
  // Match @mentions in the content
  const mentionRegex = /@([^@\n]+?)(?=\s|$|@)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  const allSuggestions = getAllSuggestions();

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const mentionText = match[1].trim();
    const suggestion = allSuggestions.find(
      s => s.title.toLowerCase() === mentionText.toLowerCase()
    );

    if (suggestion) {
      // Create clickable link for valid topic/journey
      const href = suggestion.type === 'topic' 
        ? `/story/${suggestion.id}` 
        : `/journey/${suggestion.id}`;
      
      parts.push(
        <a
          key={`${suggestion.type}-${suggestion.id}-${match.index}`}
          href={href}
          className={`
            inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium
            ${suggestion.type === 'topic' 
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
              : 'bg-green-50 text-green-600 hover:bg-green-100'
            }
            transition-colors
          `}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {suggestion.type === 'topic' ? '📚' : '🗺️'} {mentionText}
        </a>
      );
    } else {
      // Keep as plain text if not a valid reference
      parts.push(`@${mentionText}`);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [content];
}

export const JournalEntry: React.FC<JournalEntryProps> = ({
  entry,
  isEditing = false,
  onEditToggle,
  className = '',
}) => {
  const { updateEntry, isLoading } = useJournal();
  
  // Edit state
  const [editContent, setEditContent] = useState(entry.content);
  const [editMood, setEditMood] = useState<MoodType | undefined>(entry.mood ?? undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState('');
  const [suggestionTriggerIndex, setSuggestionTriggerIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [topicReferences, setTopicReferences] = useState<Array<{ topicId: number; title: string }>>([]);
  const [journeyReferences, setJourneyReferences] = useState<Array<{ journeyId: string; title: string }>>([]);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allSuggestions = useMemo(() => getAllSuggestions(), []);

  // Filter suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!suggestionFilter) return allSuggestions.slice(0, 10);
    const lowerFilter = suggestionFilter.toLowerCase();
    return allSuggestions
      .filter(s => s.title.toLowerCase().includes(lowerFilter))
      .slice(0, 10);
  }, [allSuggestions, suggestionFilter]);

  // Reset edit state when entry changes
  useEffect(() => {
    setEditContent(entry.content);
    setEditMood(entry.mood ?? undefined);
    setSaveStatus(null);
    setError(null);
    setTopicReferences([]);
    setJourneyReferences([]);
  }, [entry.id, entry.content, entry.mood]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);


  /**
   * Auto-save entry when content or mood changes
   * Requirements: 10.6 - Auto-save journal entries as the user types
   */
  const autoSave = useCallback(async (content: string, mood: MoodType | undefined) => {
    if (!isEditing) return;
    
    // Don't save if content is empty
    if (!content.trim()) return;
    
    // Don't save if nothing changed
    if (content === entry.content && mood === entry.mood) {
      setSaveStatus('saved');
      return;
    }

    setSaveStatus('saving');
    setIsSaving(true);
    setError(null);

    try {
      const updateData: UpdateJournalEntry = {
        content: content.trim(),
        mood,
        topicReferences: topicReferences.length > 0 ? topicReferences : undefined,
        journeyReferences: journeyReferences.length > 0 ? journeyReferences : undefined,
      };
      
      await updateEntry(entry.id, updateData);
      setSaveStatus('saved');
    } catch (err) {
      setError('Failed to save changes');
      setSaveStatus('unsaved');
      console.error('Auto-save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [entry.id, entry.content, entry.mood, isEditing, updateEntry, topicReferences, journeyReferences]);

  /**
   * Handle content change with debounced auto-save
   * Requirements: 10.6 - Auto-save as user types
   */
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setEditContent(newContent);
    setSaveStatus('unsaved');

    // Check for @ or # trigger for autocomplete
    const textBeforeCursor = newContent.substring(0, cursorPosition);
    const triggerMatch = textBeforeCursor.match(/[@#]([^\s@#]*)$/);

    if (triggerMatch) {
      const triggerIndex = textBeforeCursor.lastIndexOf(triggerMatch[0]);
      setSuggestionTriggerIndex(triggerIndex);
      setSuggestionFilter(triggerMatch[1]);
      setShowSuggestions(true);
      setSelectedSuggestionIndex(0);
    } else {
      setShowSuggestions(false);
      setSuggestionFilter('');
      setSuggestionTriggerIndex(-1);
    }

    // Debounced auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave(newContent, editMood);
    }, AUTO_SAVE_DELAY);
  }, [editMood, autoSave]);

  /**
   * Handle mood change with auto-save
   */
  const handleMoodChange = useCallback((newMood: MoodType) => {
    const selectedMood = editMood === newMood ? undefined : newMood;
    setEditMood(selectedMood);
    setSaveStatus('unsaved');

    // Debounced auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave(editContent, selectedMood);
    }, AUTO_SAVE_DELAY);
  }, [editMood, editContent, autoSave]);

  /**
   * Handle keyboard navigation in autocomplete
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        if (filteredSuggestions.length > 0) {
          e.preventDefault();
          handleSelectSuggestion(filteredSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, filteredSuggestions, selectedSuggestionIndex]);

  /**
   * Handle suggestion selection
   * Requirements: 11.6 - Create clickable links for topics/journeys
   */
  const handleSelectSuggestion = useCallback((suggestion: SuggestionItem) => {
    if (suggestionTriggerIndex === -1) return;

    // Replace the trigger text with the selected suggestion
    const beforeTrigger = editContent.substring(0, suggestionTriggerIndex);
    const afterCursor = editContent.substring(
      suggestionTriggerIndex + suggestionFilter.length + 1
    );
    const newContent = `${beforeTrigger}@${suggestion.title} ${afterCursor}`;
    
    setEditContent(newContent);
    setShowSuggestions(false);
    setSuggestionFilter('');
    setSuggestionTriggerIndex(-1);
    setSaveStatus('unsaved');

    // Add to references
    if (suggestion.type === 'topic') {
      setTopicReferences(prev => {
        if (prev.some(r => r.topicId === suggestion.id)) return prev;
        return [...prev, { topicId: suggestion.id as number, title: suggestion.title }];
      });
    } else {
      setJourneyReferences(prev => {
        if (prev.some(r => r.journeyId === suggestion.id)) return prev;
        return [...prev, { journeyId: suggestion.id as string, title: suggestion.title }];
      });
    }

    // Trigger auto-save
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      autoSave(newContent, editMood);
    }, AUTO_SAVE_DELAY);

    // Focus back on textarea
    textareaRef.current?.focus();
  }, [editContent, suggestionTriggerIndex, suggestionFilter, editMood, autoSave]);

  /**
   * Toggle edit mode
   */
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // Save any pending changes before exiting edit mode
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (saveStatus === 'unsaved') {
        autoSave(editContent, editMood);
      }
    }
    onEditToggle?.(!isEditing);
  }, [isEditing, onEditToggle, saveStatus, editContent, editMood, autoSave]);


  /**
   * Format date for display - uses journalDate if available, otherwise createdAt
   * Requirements: 10.10 - Track creation timestamp and last update timestamp separately from journal date
   */
  const formattedDate = useMemo(() => {
    // Use journalDate for the logical date display if available
    const dateToUse = entry.journalDate 
      ? new Date(entry.journalDate) 
      : new Date(entry.createdAt);
    return dateToUse.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [entry.journalDate, entry.createdAt]);

  /**
   * Format creation time for display
   * Requirements: 10.10 - createdAt reflects actual creation time
   */
  const formattedCreationTime = useMemo(() => {
    const date = new Date(entry.createdAt);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [entry.createdAt]);

  /**
   * Format update time for display
   * Requirements: 10.10 - updatedAt reflects last modification time
   */
  const formattedUpdateTime = useMemo(() => {
    const date = new Date(entry.updatedAt);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }, [entry.updatedAt]);

  /**
   * Check if entry has been edited (updatedAt differs from createdAt by more than 1 second)
   * Requirements: 10.10 - Show "edited" indicator with update timestamp if different
   */
  const wasEdited = useMemo(() => {
    // Consider edited if updatedAt is more than 1 second after createdAt
    return Math.abs(entry.updatedAt - entry.createdAt) > 1000;
  }, [entry.createdAt, entry.updatedAt]);

  // Render view mode
  if (!isEditing) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
        {/* Header with date and mood */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">{formattedDate}</h3>
            {/* Requirements: 10.10 - Display timestamps: creation time and edited indicator */}
            <p className="text-xs text-gray-400 mt-0.5">
              Created at {formattedCreationTime}
              {wasEdited && (
                <span className="ml-2 text-gray-500">
                  • Edited at {formattedUpdateTime}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mood badge */}
            {entry.mood && MOOD_CONFIG[entry.mood] && (
              <span className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                ${MOOD_CONFIG[entry.mood].color}
              `}>
                <span>{MOOD_CONFIG[entry.mood].emoji}</span>
                {MOOD_CONFIG[entry.mood].label}
              </span>
            )}
            {/* Edit button */}
            {onEditToggle && (
              <button
                onClick={handleEditToggle}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Edit entry"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content with parsed links - Requirements: 11.6 */}
        <div className="px-5 py-4">
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
            {parseContentWithLinks(entry.content)}
          </div>
        </div>
      </div>
    );
  }

  // Render edit mode
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {/* Header with date and save status */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">{formattedDate}</h3>
          {/* Requirements: 10.10 - Display timestamps: creation time and edited indicator */}
          <p className="text-xs text-gray-400 mt-0.5">
            Created at {formattedCreationTime}
            {wasEdited && (
              <span className="ml-2 text-gray-500">
                • Edited at {formattedUpdateTime}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {/* Save status indicator - Requirements: 10.6 */}
            {saveStatus === 'saving' && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-xs text-gray-400">Unsaved changes</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Done editing button */}
          <button
            onClick={handleEditToggle}
            disabled={isSaving || isLoading}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            Done
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Mood selector */}
      <div className="px-5 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling?
        </label>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(MOOD_CONFIG) as MoodType[]).map(moodKey => {
            const config = MOOD_CONFIG[moodKey];
            return (
              <button
                key={moodKey}
                type="button"
                onClick={() => handleMoodChange(moodKey)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${editMood === moodKey
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                aria-pressed={editMood === moodKey}
              >
                <span className="mr-1">{config.emoji}</span>
                {config.label}
              </button>
            );
          })}
        </div>
      </div>


      {/* Content editor with autocomplete */}
      <div className="px-5 py-4">
        <label htmlFor={`journal-content-${entry.id}`} className="block text-sm font-medium text-gray-700 mb-2">
          Your thoughts
          <span className="text-gray-400 font-normal ml-2">
            (Use @ or # to mention topics/journeys)
          </span>
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id={`journal-content-${entry.id}`}
            value={editContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Write about your day, your feelings, what you learned..."
            className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-y transition-all"
            disabled={isLoading}
          />

          {/* Autocomplete suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div 
              className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto z-10"
              role="listbox"
              aria-label="Topic and journey suggestions"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${suggestion.id}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`
                    w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors
                    ${index === selectedSuggestionIndex 
                      ? 'bg-purple-50 text-purple-700' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                  role="option"
                  aria-selected={index === selectedSuggestionIndex}
                >
                  <span className={`
                    px-1.5 py-0.5 rounded text-xs font-medium
                    ${suggestion.type === 'topic' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-green-100 text-green-700'
                    }
                  `}>
                    {suggestion.type === 'topic' ? 'Topic' : 'Journey'}
                  </span>
                  <span className="truncate">{suggestion.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Character count */}
        <div className="mt-2 text-xs text-gray-400 text-right">
          {editContent.length} characters
        </div>
      </div>

      {/* References display */}
      {(topicReferences.length > 0 || journeyReferences.length > 0) && (
        <div className="px-5 pb-4 flex flex-wrap gap-2">
          {topicReferences.map(ref => (
            <span
              key={`topic-${ref.topicId}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {ref.title}
              <button
                onClick={() => setTopicReferences(prev => prev.filter(r => r.topicId !== ref.topicId))}
                className="ml-1 hover:text-blue-900"
                aria-label={`Remove ${ref.title}`}
              >
                ×
              </button>
            </span>
          ))}
          {journeyReferences.map(ref => (
            <span
              key={`journey-${ref.journeyId}`}
              className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {ref.title}
              <button
                onClick={() => setJourneyReferences(prev => prev.filter(r => r.journeyId !== ref.journeyId))}
                className="ml-1 hover:text-green-900"
                aria-label={`Remove ${ref.title}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
