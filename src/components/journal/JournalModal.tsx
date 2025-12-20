import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useJournal } from '../../contexts/JournalContext';
import type { UpdateJournalEntry } from '../../contexts/JournalContext';
import { useAuth } from '../../contexts/AuthContext';
import type { MoodType, JournalEntry as JournalEntryType } from '../../types/journal';
import { stories } from '../../data/stories';
import { learningPaths } from '../../data/learningPaths';
import { VoiceRecorder } from './VoiceRecorder';
import { JournalAudioPlayer } from './JournalAudioPlayer';
import { uploadVoiceNote, getVoiceNoteUrl, deleteVoiceNote } from '../../services/voiceNoteService';
import { KickGraph } from '../kicks/KickGraph';

/**
 * JournalModal component - Main journal interface with calendar and entry editor
 * Redesigned for a more polished, professional look with better space utilization
 */

interface JournalModalProps {
  className?: string;
}

const MOOD_OPTIONS: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'emotional', emoji: '🥹', label: 'Emotional' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'hopeful', emoji: '✨', label: 'Hopeful' },
  { value: 'uncomfortable', emoji: '😣', label: 'Uncomfortable' },
  { value: 'nesting', emoji: '🏠', label: 'Nesting' },
];

interface SuggestionItem {
  type: 'topic' | 'journey';
  id: number | string;
  title: string;
}

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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return formatDateKey(date1) === formatDateKey(date2);
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const JournalModal: React.FC<JournalModalProps> = ({ className = '' }) => {
  const {
    isOpen,
    closeJournal,
    entries,
    selectedDate,
    selectDate,
    selectedDateEntries,
    updateEntry,
    deleteEntry,
    isLoading,
    error,
    clearError,
    refreshEntries,
    morphOrigin,
  } = useJournal();
  
  const { isAuthenticated } = useAuth();

  // Calendar state
  const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());

  // Editor state
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Entry list state
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editMood, setEditMood] = useState<MoodType | undefined>(undefined);
  const [editKickCount, setEditKickCount] = useState(0);
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [editPendingVoiceNote, setEditPendingVoiceNote] = useState<{ blob: Blob; duration: number } | null>(null);
  const [showEditVoiceRecorder, setShowEditVoiceRecorder] = useState(false);

  // Voice recording state
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isUploadingVoiceNote, setIsUploadingVoiceNote] = useState(false);
  const [voiceRecordingError, setVoiceRecordingError] = useState<string | null>(null);
  const [pendingVoiceNote, setPendingVoiceNote] = useState<{ blob: Blob; duration: number } | null>(null);
  const [entryKickCount, setEntryKickCount] = useState(0);

  // Autocomplete state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState('');
  const [suggestionTriggerIndex, setSuggestionTriggerIndex] = useState(-1);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [topicReferences, setTopicReferences] = useState<Array<{ topicId: number; title: string }>>([]);
  const [journeyReferences, setJourneyReferences] = useState<Array<{ journeyId: string; title: string }>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const allSuggestions = useMemo(() => getAllSuggestions(), []);

  const filteredSuggestions = useMemo(() => {
    if (!suggestionFilter) return allSuggestions.slice(0, 10);
    const lowerFilter = suggestionFilter.toLowerCase();
    return allSuggestions
      .filter(s => s.title.toLowerCase().includes(lowerFilter))
      .slice(0, 10);
  }, [allSuggestions, suggestionFilter]);

  const datesWithEntries = useMemo(() => {
    const dates = new Set<string>();
    entries.forEach(entry => {
      let dateKey: string;
      if (entry.journalDate) {
        dateKey = entry.journalDate.split('T')[0];
      } else {
        dateKey = formatDateKey(new Date(entry.createdAt));
      }
      const [year, month] = dateKey.split('-').map(Number);
      if (month - 1 === viewMonth && year === viewYear) {
        dates.add(dateKey);
      }
    });
    return dates;
  }, [entries, viewMonth, viewYear]);

  useEffect(() => {
    setContent('');
    setMood(undefined);
    setTopicReferences([]);
    setJourneyReferences([]);
    setHasUnsavedChanges(false);
    setPendingVoiceNote(null);
    setEntryKickCount(0);
    setShowVoiceRecorder(false);
    setEditingEntryId(null);
    setEditContent('');
    setEditMood(undefined);
    setShowNewEntryForm(selectedDateEntries.length === 0);
  }, [selectedDate, selectedDateEntries.length]);

  useEffect(() => {
    if (isOpen) {
      setShowNewEntryForm(true);
      setEditingEntryId(null);
      setShowVoiceRecorder(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setViewMonth(selectedDate.getMonth());
    setViewYear(selectedDate.getFullYear());
  }, [selectedDate]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showSuggestions) {
          setShowSuggestions(false);
        } else {
          handleClose();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, showSuggestions]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close?');
      if (!confirmClose) return;
    }
    closeJournal();
    clearError();
  }, [closeJournal, clearError, hasUnsavedChanges]);

  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  }, [viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  }, [viewMonth]);

  const handleDateSelect = useCallback((day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    selectDate(newDate);
  }, [viewYear, viewMonth, selectDate]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setContent(newContent);
    setHasUnsavedChanges(true);
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
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showSuggestions) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1);
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

  const handleSelectSuggestion = useCallback((suggestion: SuggestionItem) => {
    if (suggestionTriggerIndex === -1) return;
    const beforeTrigger = content.substring(0, suggestionTriggerIndex);
    const afterCursor = content.substring(suggestionTriggerIndex + suggestionFilter.length + 1);
    const newContent = `${beforeTrigger}@${suggestion.title} ${afterCursor}`;
    setContent(newContent);
    setShowSuggestions(false);
    setSuggestionFilter('');
    setSuggestionTriggerIndex(-1);
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
    textareaRef.current?.focus();
  }, [content, suggestionTriggerIndex, suggestionFilter]);

  const [animatingMood, setAnimatingMood] = useState<MoodType | null>(null);
  
  const handleMoodSelect = useCallback((selectedMood: MoodType) => {
    setAnimatingMood(selectedMood);
    setTimeout(() => setAnimatingMood(null), 300);
    setMood(prev => prev === selectedMood ? undefined : selectedMood);
    setHasUnsavedChanges(true);
  }, []);

  const handleSaveNewEntry = useCallback(async () => {
    if (!content.trim() && !mood && !pendingVoiceNote && entryKickCount === 0) return;
    setIsSaving(true);
    try {
      const dateString = formatDateKey(selectedDate);
      const journalDateISO = `${dateString}T00:00:00.000Z`;
      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/journal`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journalDate: journalDateISO,
          content: content.trim() || undefined,
          mood,
          kickCount: entryKickCount > 0 ? entryKickCount : undefined,
          topicReferences: topicReferences.length > 0 ? topicReferences : undefined,
          journeyReferences: journeyReferences.length > 0 ? journeyReferences : undefined,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create journal entry');
      }
      const { entry } = await response.json();
      if (pendingVoiceNote) {
        setIsUploadingVoiceNote(true);
        try {
          await uploadVoiceNote(pendingVoiceNote.blob, entry.id, pendingVoiceNote.duration);
        } catch (voiceErr) {
          console.error('Failed to upload voice note:', voiceErr);
          setVoiceRecordingError('Entry saved but voice note upload failed');
        } finally {
          setIsUploadingVoiceNote(false);
        }
      }
      await refreshEntries();
      setContent('');
      setMood(undefined);
      setTopicReferences([]);
      setJourneyReferences([]);
      setPendingVoiceNote(null);
      setEntryKickCount(0);
      setHasUnsavedChanges(false);
      setShowNewEntryForm(false);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSaving(false);
    }
  }, [content, mood, pendingVoiceNote, entryKickCount, topicReferences, journeyReferences, selectedDate, refreshEntries]);

  const handleStartEdit = useCallback((entry: JournalEntryType) => {
    setEditingEntryId(entry.id);
    setEditContent(entry.content || '');
    setEditMood(entry.mood ?? undefined);
    setEditKickCount(entry.kickCount || 0);
    setShowNewEntryForm(false);
    setShowVoiceRecorder(false);
    setEditPendingVoiceNote(null);
    setShowEditVoiceRecorder(false);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingEntryId(null);
    setEditContent('');
    setEditMood(undefined);
    setEditKickCount(0);
    setEditPendingVoiceNote(null);
    setShowEditVoiceRecorder(false);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingEntryId) return;
    const editingEntry = selectedDateEntries.find(e => e.id === editingEntryId);
    const hasExistingVoiceNote = editingEntry?.voiceNoteIds && editingEntry.voiceNoteIds.length > 0;
    const hasVoiceNote = hasExistingVoiceNote || editPendingVoiceNote;
    if (!editContent.trim() && !editMood && !hasVoiceNote && editKickCount === 0) return;
    setIsSaving(true);
    try {
      const updateData: UpdateJournalEntry = {
        content: editContent.trim() || undefined,
        mood: editMood,
        kickCount: editKickCount > 0 ? editKickCount : undefined,
      };
      await updateEntry(editingEntryId, updateData);
      if (editPendingVoiceNote) {
        setIsUploadingVoiceNote(true);
        try {
          // Delete existing voice notes first before uploading new one
          if (editingEntry?.voiceNoteIds && editingEntry.voiceNoteIds.length > 0) {
            for (const voiceNoteId of editingEntry.voiceNoteIds) {
              try {
                await deleteVoiceNote(voiceNoteId);
              } catch (deleteErr) {
                console.error('Failed to delete old voice note:', deleteErr);
                // Continue even if delete fails
              }
            }
          }
          // Upload the new voice note
          await uploadVoiceNote(editPendingVoiceNote.blob, editingEntryId, editPendingVoiceNote.duration);
          await refreshEntries();
        } catch (voiceErr) {
          console.error('Failed to upload voice note:', voiceErr);
          setVoiceRecordingError('Entry saved but voice note upload failed');
        } finally {
          setIsUploadingVoiceNote(false);
        }
      }
      setEditingEntryId(null);
      setEditContent('');
      setEditMood(undefined);
      setEditKickCount(0);
      setEditPendingVoiceNote(null);
      setShowEditVoiceRecorder(false);
    } catch (err) {
      console.error('Failed to update entry:', err);
    } finally {
      setIsSaving(false);
    }
  }, [editingEntryId, editContent, editMood, editKickCount, editPendingVoiceNote, updateEntry, selectedDateEntries, refreshEntries]);

  const handleDeleteEntry = useCallback(async (entryId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry? This cannot be undone.');
    if (!confirmDelete) return;
    setDeletingEntryId(entryId);
    try {
      await deleteEntry(entryId);
      if (editingEntryId === entryId) handleCancelEdit();
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setDeletingEntryId(null);
    }
  }, [deleteEntry, editingEntryId, handleCancelEdit]);

  const handleShowNewEntryForm = useCallback(() => {
    setShowNewEntryForm(true);
    setShowVoiceRecorder(false);
    setEditingEntryId(null);
    setContent('');
    setMood(undefined);
    setTopicReferences([]);
    setJourneyReferences([]);
    setPendingVoiceNote(null);
    setEntryKickCount(0);
  }, []);

  const handleShowVoiceRecorder = useCallback(() => {
    setShowVoiceRecorder(true);
    setShowNewEntryForm(true);
    setEditingEntryId(null);
    setVoiceRecordingError(null);
  }, []);

  const handleVoiceRecordingComplete = useCallback((audioBlob: Blob, duration: number) => {
    if (!isAuthenticated) {
      setVoiceRecordingError('Please sign in to save voice notes');
      return;
    }
    setPendingVoiceNote({ blob: audioBlob, duration });
    setShowVoiceRecorder(false);
    setHasUnsavedChanges(true);
    setVoiceRecordingError(null);
  }, [isAuthenticated]);

  const handleVoiceRecordingError = useCallback((error: Error) => {
    console.error('Voice recording error:', error);
    setVoiceRecordingError(error.message);
  }, []);

  const handleVoiceRecordingCancel = useCallback(() => {
    setShowVoiceRecorder(false);
    setVoiceRecordingError(null);
  }, []);

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const today = new Date();
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewYear, viewMonth, day);
      const dateKey = formatDateKey(date);
      const hasEntry = datesWithEntries.has(dateKey);
      const isSelected = isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);
      const isFuture = date > today;

      days.push(
        <button
          key={day}
          onClick={() => !isFuture && handleDateSelect(day)}
          disabled={isFuture}
          className={`
            relative h-9 w-9 rounded-full text-sm font-medium transition-all duration-200
            ${isSelected 
              ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 scale-110' 
              : isToday 
                ? 'bg-purple-50 text-purple-700 ring-2 ring-purple-200' 
                : isFuture 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }
          `}
          aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}${hasEntry ? ' - has entry' : ''}`}
          aria-selected={isSelected}
        >
          {day}
          {hasEntry && (
            <span 
              className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors ${
                isSelected ? 'bg-white' : 'bg-purple-400'
              }`}
              aria-hidden="true"
            />
          )}
        </button>
      );
    }
    return days;
  };

  if (!isOpen) return null;

  const morphStyles = morphOrigin ? {
    '--morph-x': `${morphOrigin.x}px`,
    '--morph-y': `${morphOrigin.y}px`,
  } as React.CSSProperties : {};

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="journal-modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-gradient-to-br from-white to-purple-50/30 rounded-3xl shadow-2xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col md:flex-row ${morphOrigin ? 'animate-modal-morph' : 'animate-bounce-in'}`}
        style={morphStyles}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-lg backdrop-blur-sm"
          aria-label="Close journal"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left Panel - Calendar */}
        <div className="w-full md:w-64 lg:w-72 bg-white/60 backdrop-blur-sm p-5 border-b md:border-b-0 md:border-r border-purple-100/50 flex flex-col flex-shrink-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-200">
              <span className="text-lg">📔</span>
            </div>
            <div>
              <h2 id="journal-modal-title" className="text-lg font-bold text-gray-800">My Journal</h2>
              <p className="text-xs text-gray-500">Track your journey</p>
            </div>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4 px-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl hover:bg-purple-100 transition-colors group"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="font-semibold text-gray-700">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl hover:bg-purple-100 transition-colors group"
              aria-label="Next month"
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {DAY_NAMES.map(day => (
              <div key={day} className="h-9 flex items-center justify-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {day.charAt(0)}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Kick Activity Graph - Beautiful visualization for logged-in users */}
          {isAuthenticated && (
            <div className="mt-4 mb-4">
              <KickGraph 
                days={7} 
                height={180} 
                showMilestones={true}
                chartType="bar"
                className="shadow-sm"
              />
            </div>
          )}

          {/* Selected date card */}
          <div className="mt-auto">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
              <p className="text-purple-200 text-xs font-medium uppercase tracking-wide mb-1">Selected</p>
              <p className="font-bold text-lg">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              {selectedDateEntries.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-purple-200 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {selectedDateEntries.length} {selectedDateEntries.length === 1 ? 'entry' : 'entries'}
                </div>
              )}
            </div>

            {!isAuthenticated && (
              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <p className="text-xs text-amber-700 flex items-center gap-2">
                  <span>💡</span>
                  Sign in to sync across devices
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Entries */}
        <div className="flex-1 flex flex-col min-h-[500px] md:min-h-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-purple-100/50 bg-white/40 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedDateEntries.length === 0 ? 'No entries yet' : `${selectedDateEntries.length} ${selectedDateEntries.length === 1 ? 'entry' : 'entries'}`}
                </p>
              </div>
              {!showNewEntryForm && !editingEntryId && (
                <div className="flex-1 flex justify-center">
                  <button
                    onClick={handleShowNewEntryForm}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-105 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Entry
                  </button>
                </div>
              )}
              {/* Spacer to balance the layout */}
              <div className="flex-1" />
            </div>
          </div>

          {/* Error display */}
          {(error || voiceRecordingError) && (
            <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center justify-between">
              <span>{error || voiceRecordingError}</span>
              <button onClick={() => { clearError(); setVoiceRecordingError(null); }} className="p-1 hover:bg-red-100 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* New Entry Form */}
            {showNewEntryForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
                {/* Form header */}
                <div className="px-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                    New Entry
                  </h4>
                </div>

                <div className="p-5 space-y-5">
                  {/* Mood selector - horizontal scrollable */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                      How are you feeling?
                    </label>
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                      {MOOD_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleMoodSelect(option.value)}
                          className={`
                            flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${mood === option.value
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 scale-105'
                              : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-100'
                            }
                            ${animatingMood === option.value ? 'animate-mood-select' : ''}
                          `}
                          aria-pressed={mood === option.value}
                        >
                          <span className="text-base">{option.emoji}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note textarea */}
                  <div className="relative">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                      Your thoughts
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={content}
                      onChange={handleContentChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Write about your day, feelings, or what you learned... Use @ to mention topics"
                      className="w-full min-h-[120px] px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-300 focus:bg-white resize-none text-gray-700 placeholder-gray-400 transition-all"
                      disabled={isLoading}
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-40 overflow-y-auto z-10">
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={`${suggestion.type}-${suggestion.id}`}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${
                              index === selectedSuggestionIndex ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              suggestion.type === 'topic' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {suggestion.type === 'topic' ? 'Topic' : 'Journey'}
                            </span>
                            <span className="truncate">{suggestion.title}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voice & Kicks row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Voice Note */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Voice Note
                      </label>
                      {pendingVoiceNote ? (
                        <div className="flex items-center gap-2 p-3 bg-purple-100 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-purple-700 flex-1">{Math.round(pendingVoiceNote.duration)}s</span>
                          <button onClick={() => setPendingVoiceNote(null)} className="p-1.5 hover:bg-purple-200 rounded-lg transition-colors">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : showVoiceRecorder ? (
                        <VoiceRecorder
                          onRecordingComplete={handleVoiceRecordingComplete}
                          onCancel={handleVoiceRecordingCancel}
                          onError={handleVoiceRecordingError}
                          disabled={isLoading || isUploadingVoiceNote}
                        />
                      ) : (
                        <button
                          onClick={handleShowVoiceRecorder}
                          disabled={!isAuthenticated}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all disabled:opacity-50"
                        >
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                          </svg>
                          <span className="font-medium">Record</span>
                        </button>
                      )}
                    </div>

                    {/* Baby Kicks */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                        Baby Kicks
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEntryKickCount(prev => Math.max(0, prev - 1))}
                          disabled={entryKickCount === 0}
                          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-white border border-gray-200 rounded-xl">
                          <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          <span className="text-xl font-bold text-gray-800">{entryKickCount}</span>
                        </div>
                        <button
                          onClick={() => setEntryKickCount(prev => prev + 1)}
                          className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg shadow-pink-200 hover:scale-105 active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  {(topicReferences.length > 0 || journeyReferences.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {topicReferences.map(ref => (
                        <span key={`topic-${ref.topicId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          📚 {ref.title}
                          <button onClick={() => setTopicReferences(prev => prev.filter(r => r.topicId !== ref.topicId))} className="hover:text-blue-900 ml-1">×</button>
                        </span>
                      ))}
                      {journeyReferences.map(ref => (
                        <span key={`journey-${ref.journeyId}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                          🗺️ {ref.title}
                          <button onClick={() => setJourneyReferences(prev => prev.filter(r => r.journeyId !== ref.journeyId))} className="hover:text-green-900 ml-1">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                  {selectedDateEntries.length > 0 && (
                    <button
                      onClick={() => setShowNewEntryForm(false)}
                      className="px-4 py-2.5 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-all"
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveNewEntry}
                    disabled={isSaving || isUploadingVoiceNote || (!content.trim() && !mood && !pendingVoiceNote && entryKickCount === 0) || isLoading}
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 shadow-lg shadow-purple-200 flex items-center gap-2"
                  >
                    {isSaving || isUploadingVoiceNote ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {isUploadingVoiceNote ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Entry
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Existing entries */}
            {selectedDateEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden animate-entry-appear ${
                  editingEntryId === entry.id ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-100 hover:border-purple-200'
                } transition-all`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {editingEntryId === entry.id ? (
                  /* Edit mode */
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800">Edit Entry</h4>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Mood */}
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {MOOD_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setEditMood(prev => prev === option.value ? undefined : option.value)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                              editMood === option.value
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-600 hover:bg-purple-50 border border-gray-100'
                            }`}
                          >
                            <span>{option.emoji}</span>
                            <span>{option.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Content */}
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Write about your day..."
                        className="w-full min-h-[100px] px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-300 focus:bg-white resize-none"
                        disabled={isLoading}
                      />

                      {/* Voice & Kicks */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Voice</label>
                          {showEditVoiceRecorder ? (
                            <VoiceRecorder
                              onRecordingComplete={(blob, duration) => { setEditPendingVoiceNote({ blob, duration }); setShowEditVoiceRecorder(false); }}
                              onCancel={() => setShowEditVoiceRecorder(false)}
                              onError={handleVoiceRecordingError}
                              maxDuration={300}
                            />
                          ) : editPendingVoiceNote ? (
                            <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm text-green-700 flex-1">New recording</span>
                              <button onClick={() => setEditPendingVoiceNote(null)} className="p-1 hover:bg-green-100 rounded">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : entry.voiceNoteIds?.length ? (
                            <div>
                              <JournalAudioPlayer src={getVoiceNoteUrl(entry.voiceNoteIds[0])} />
                              <button onClick={() => setShowEditVoiceRecorder(true)} className="mt-2 w-full text-xs text-purple-600 hover:text-purple-700">
                                Replace recording
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setShowEditVoiceRecorder(true)} className="w-full py-2 text-sm text-gray-500 hover:text-purple-600 border border-dashed border-gray-200 rounded-lg hover:border-purple-300">
                              + Add voice
                            </button>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3">
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Kicks</label>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditKickCount(prev => Math.max(0, prev - 1))} disabled={editKickCount === 0} className="w-8 h-8 flex items-center justify-center bg-white border rounded-lg disabled:opacity-30">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <div className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border rounded-lg">
                              <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                              <span className="font-bold text-gray-800">{editKickCount}</span>
                            </div>
                            <button onClick={() => setEditKickCount(prev => prev + 1)} className="w-8 h-8 flex items-center justify-center bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <button onClick={handleCancelEdit} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-all" disabled={isSaving}>Cancel</button>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isSaving || isUploadingVoiceNote || (!editContent.trim() && !editMood && !(entry.voiceNoteIds?.length) && !editPendingVoiceNote && editKickCount === 0)}
                        className="px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSaving ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</> : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (

                  /* View mode */
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {Math.abs(entry.updatedAt - entry.createdAt) > 1000 && ' • edited'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(entry)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={deletingEntryId === entry.id}
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500 disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingEntryId === entry.id ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content grid */}
                    <div className="space-y-4">
                      {/* Mood */}
                      {entry.mood && MOOD_OPTIONS.find(m => m.value === entry.mood) && (
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                          <span className="text-xl">{MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji}</span>
                          <span className="font-medium text-purple-700">{MOOD_OPTIONS.find(m => m.value === entry.mood)?.label}</span>
                        </div>
                      )}

                      {/* Text */}
                      {entry.content && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                      )}

                      {/* Voice & Kicks row */}
                      {(entry.voiceNoteIds?.length || (entry.kickCount && entry.kickCount > 0)) && (
                        <div className="flex flex-wrap gap-3">
                          {entry.voiceNoteIds && entry.voiceNoteIds.length > 0 && (
                            <div className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                                  </svg>
                                </div>
                                <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Voice Note</span>
                              </div>
                              <JournalAudioPlayer src={getVoiceNoteUrl(entry.voiceNoteIds[0])} />
                            </div>
                          )}

                          {entry.kickCount && entry.kickCount > 0 && (
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-200">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-2xl font-bold text-pink-600">{entry.kickCount}</span>
                                <span className="text-sm text-pink-500 ml-1">{entry.kickCount === 1 ? 'kick' : 'kicks'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Empty state */}
                      {!entry.content && !entry.voiceNoteIds?.length && !entry.kickCount && !entry.mood && (
                        <p className="text-gray-400 italic">No content</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Empty state */}
            {selectedDateEntries.length === 0 && !showNewEntryForm && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-4">Start capturing your journey</p>
                <button
                  onClick={handleShowNewEntryForm}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-200 hover:shadow-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write your first entry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
