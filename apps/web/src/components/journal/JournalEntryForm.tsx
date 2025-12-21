import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { JournalEntryData, MoodType, JournalEntry } from '../../types/journal';
import { JOURNAL_CONSTANTS } from '../../types/journal';
import { journalApi } from '../../services/journalApi';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * JournalEntryForm component for creating and editing journal entries
 * 
 * Requirements:
 * - 8.1: Provide journal entry form accessible from each story page
 * - 8.2: Allow entries with title, content (rich text), and mood indicator
 * - 8.3: Automatically associate entries with current story and date
 * - 8.5: Auto-save drafts every 30 seconds to prevent data loss
 */

interface JournalEntryFormProps {
  /** Profile ID for the current user */
  profileId: string;
  /** Story ID to associate with the entry */
  storyId?: number;
  /** Story title for display */
  storyTitle?: string;
  /** Initial prompt to pre-fill content */
  initialPrompt?: string;
  /** Existing entry for editing */
  existingEntry?: JournalEntry;
  /** Callback when entry is saved */
  onSave: (entry: JournalEntry) => void;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Custom class name */
  className?: string;
}

/**
 * Mood options for pregnancy-appropriate mood selection
 * Requirements: 11.1, 11.2 - Pregnancy-appropriate mood options
 * Requirements: 11.9 - Mood is optional and can be null/undefined
 */
const MOOD_OPTIONS: { value: MoodType; label: string; emoji: string; color: string; gradient: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: '#fbbf24', gradient: 'linear-gradient(to right, #fbbf24, #eab308)' }, // Amber-400 to Yellow-500
  { value: 'calm', label: 'Calm', emoji: '😌', color: '#60a5fa', gradient: 'linear-gradient(to right, #60a5fa, #06b6d4)' }, // Blue-400 to Cyan-500
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: '#a78bfa', gradient: 'linear-gradient(to right, #a78bfa, #a855f7)' }, // Violet-400 to Purple-500
  { value: 'tired', label: 'Tired', emoji: '😴', color: '#94a3b8', gradient: 'linear-gradient(to right, #94a3b8, #71717a)' }, // Slate-400 to Zinc-500
  { value: 'excited', label: 'Excited', emoji: '🤩', color: '#f59e0b', gradient: 'linear-gradient(to right, #fb923c, #f59e0b)' }, // Orange-400 to Amber-500
  { value: 'emotional', label: 'Emotional', emoji: '🥹', color: '#f472b6', gradient: 'linear-gradient(to right, #f472b6, #f43f5e)' }, // Pink-400 to Rose-500
  { value: 'grateful', label: 'Grateful', emoji: '🙏', color: '#34d399', gradient: 'linear-gradient(to right, #34d399, #14b8a6)' }, // Emerald-400 to Teal-500
  { value: 'hopeful', label: 'Hopeful', emoji: '✨', color: '#fcd34d', gradient: 'linear-gradient(to right, #fde047, #fbbf24)' }, // Yellow-300 to Amber-400
  { value: 'uncomfortable', label: 'Uncomfortable', emoji: '😣', color: '#fb923c', gradient: 'linear-gradient(to right, #fb923c, #f87171)' }, // Orange-400 to Red-400
  { value: 'nesting', label: 'Nesting', emoji: '🏠', color: '#84cc16', gradient: 'linear-gradient(to right, #a3e635, #22c55e)' }, // Lime-400 to Green-500
];


export const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  profileId,
  storyId,
  storyTitle,
  initialPrompt,
  existingEntry,
  onSave,
  onCancel,
  className = '',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const isEditing = !!existingEntry;
  
  // Form state
  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(
    existingEntry?.content || initialPrompt || ''
  );
  const [mood, setMood] = useState<MoodType | undefined>(existingEntry?.mood ?? undefined);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(content.length);
  
  // Refs for auto-save
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSavedDataRef = useRef<string>('');

  // Update character count when content changes
  useEffect(() => {
    setCharCount(content.length);
  }, [content]);

  // Load draft on mount (only for new entries)
  useEffect(() => {
    if (!isEditing && !initialPrompt) {
      const loadDraft = async () => {
        const response = await journalApi.getDraft(profileId);
        if (response.success && response.data) {
          const draft = response.data;
          // Only load draft if it's for the same story or no story
          if (!storyId || draft.data.storyId === storyId) {
            setTitle(draft.data.title || '');
            setContent(draft.data.content || '');
            setMood(draft.data.mood ?? undefined);
            setLastSaved(new Date(draft.lastSaved));
          }
        }
      };
      loadDraft();
    }
  }, [profileId, isEditing, initialPrompt, storyId]);

  // Auto-save draft every 30 seconds (Requirements: 8.5)
  const saveDraft = useCallback(async () => {
    if (isEditing) return; // Don't auto-save drafts when editing
    
    const currentData = JSON.stringify({ title, content, mood, storyId });
    if (currentData === lastSavedDataRef.current) return; // No changes
    
    try {
      const data: JournalEntryData = {
        title,
        content,
        mood,
        storyId,
      };
      await journalApi.saveDraft(profileId, data);
      lastSavedDataRef.current = currentData;
      setLastSaved(new Date());
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  }, [profileId, title, content, mood, storyId, isEditing]);

  // Set up auto-save timer
  useEffect(() => {
    if (isEditing) return;
    
    autoSaveTimerRef.current = setInterval(() => {
      saveDraft();
    }, JOURNAL_CONSTANTS.AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [saveDraft, isEditing]);

  // Save draft on unmount
  useEffect(() => {
    return () => {
      if (!isEditing && (title || content)) {
        saveDraft();
      }
    };
  }, [saveDraft, isEditing, title, content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate content length (Property 11)
    if (content.length > JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH) {
      setError(`Content exceeds maximum length of ${JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH} characters`);
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    setIsSaving(true);

    try {
      const data: JournalEntryData = {
        title: title.trim(),
        content: content.trim(),
        mood,
        storyId,
        promptUsed: initialPrompt,
      };

      let response;
      if (isEditing && existingEntry) {
        response = await journalApi.updateEntry(profileId, existingEntry.id, data);
      } else {
        response = await journalApi.createEntry(profileId, data);
        // Clear draft after successful save
        await journalApi.clearDraft(profileId);
      }

      if (response.success && response.data) {
        onSave(response.data);
      } else {
        setError(response.error || 'Failed to save entry');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Failed to save journal entry:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Save draft before cancelling (for new entries)
    if (!isEditing && (title || content)) {
      saveDraft();
    }
    onCancel();
  };

  const isOverLimit = charCount > JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Story association indicator - Requirements: 8.3 */}
      {storyTitle && (
        <div 
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
          style={{
            backgroundColor: isDark ? 'rgba(167, 139, 250, 0.1)' : '#f5f3ff',
            color: isDark ? '#c084fc' : '#7c3aed'
          }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isDark ? '#c084fc' : '#8b5cf6' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Linked to: <strong>{storyTitle}</strong></span>
        </div>
      )}

      {/* Title input */}
      <div>
        <label htmlFor="journal-title" className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          id="journal-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          maxLength={100}
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
            color: isDark ? '#ffffff' : '#111827'
          }}
        />
      </div>

      {/* Content textarea - Requirements: 8.2 */}
      <div>
        <label htmlFor="journal-content" className="block text-sm font-medium text-gray-700 mb-1">
          Your Thoughts
        </label>
        <textarea
          id="journal-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reflections here..."
          rows={8}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-y ${
            isOverLimit ? 'border-red-500' : ''
          }`}
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
            borderColor: isOverLimit ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'),
            color: isDark ? '#e5e7eb' : '#111827'
          }}
        />
        <div className="flex justify-between mt-1">
          <span className={`text-xs ${isOverLimit ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {charCount.toLocaleString()} / {JOURNAL_CONSTANTS.MAX_CONTENT_LENGTH.toLocaleString()} characters
          </span>
          {lastSaved && !isEditing && (
            <span className="text-xs text-gray-400">
              Draft saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Mood selector - Requirements: 8.2 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How are you feeling?
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMood(mood === option.value ? undefined : option.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mood === option.value
                  ? 'text-white shadow-md'
                  : ''
              }`}
              style={mood !== option.value ? {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
                color: isDark ? '#d1d5db' : '#374151',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e5e7eb',
              } : {
                background: option.gradient
              }}
            >
              <span className="mr-1">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg font-medium transition-all"
          style={{
             backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
             color: isDark ? '#d1d5db' : '#374151',
          }}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving || isOverLimit}
          className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : (
            isEditing ? 'Update Entry' : 'Save Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default JournalEntryForm;
