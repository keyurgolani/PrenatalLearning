import React, { useState, useCallback, useRef, useEffect, useMemo, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../../contexts/JournalContext';
import type { UpdateJournalEntry } from '../../contexts/JournalContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { MoodType, JournalEntry as JournalEntryType } from '../../types/journal';
import { stories } from '../../data/stories';
import { learningPaths } from '../../data/learningPaths';
import { VoiceRecorder } from './VoiceRecorder';
import { JournalAudioPlayer } from './JournalAudioPlayer';
import ContentWithTopicLinks from './ContentWithTopicLinks';
import { ScrollIndicators } from '../ScrollIndicators';
import { ConfirmationModal } from '../ConfirmationModal';
import { uploadVoiceNote, getVoiceNoteUrl, deleteVoiceNote } from '../../services/voiceNoteService';
import { KickGraph } from '../kicks/KickGraph';
import { 
  Book, 
  PenLine, 
  Mic, 
  Activity, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Edit2, 
  Plus,
  Minus,
  Footprints
} from 'lucide-react';

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

function extractReferencesFromContent(content: string, allSuggestions: SuggestionItem[]) {
  const topicReferences: { topicId: number; title: string }[] = [];
  const journeyReferences: { journeyId: string; title: string }[] = [];
  
  // Updated regex to include colons and other common title characters
  const mentionRegex = /[@#]([A-Za-z0-9\s\-:&']+?)(?=\s|$|[.,!?;])/g;
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
      const mentionText = match[1].trim();
      // Handle trailing colon if it was captured but not part of a valid title
      // We check exact match first, if fail, try removing trailing colon
      
      let suggestion = allSuggestions.find(s => s.title.toLowerCase() === mentionText.toLowerCase());
      
      if (!suggestion && mentionText.endsWith(':')) {
         const withoutColon = mentionText.slice(0, -1);
         suggestion = allSuggestions.find(s => s.title.toLowerCase() === withoutColon.toLowerCase());
      }

      if (suggestion) {
          if (suggestion.type === 'topic') {
              if (!topicReferences.some(r => r.topicId === suggestion.id)) {
                  topicReferences.push({ topicId: suggestion.id as number, title: suggestion.title });
              }
          } else {
              if (!journeyReferences.some(r => r.journeyId === suggestion.id)) {
                  journeyReferences.push({ journeyId: suggestion.id as string, title: suggestion.title });
              }
          }
      }
  }
  return { topicReferences, journeyReferences };
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
  const navigate = useNavigate();
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
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Calendar state
  const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());
  const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());

  // Editor state
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodType | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  
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
  const [topicReferences, setTopicReferences] = useState<{ topicId: number; title: string }[]>([]);
  const [journeyReferences, setJourneyReferences] = useState<{ journeyId: string; title: string }[]>([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'new' | 'edit' | null>(null);

  // Derived unsaved changes state
  const hasUnsavedChanges = useMemo(() => {
    // Check new entry form
    if (showNewEntryForm) {
      if (content.trim()) return true;
      if (mood !== undefined) return true;
      if (pendingVoiceNote !== null) return true;
      if (entryKickCount > 0) return true;
    }

    // Check edit form
    if (editingEntryId) {
      const originalEntry = selectedDateEntries.find(e => e.id === editingEntryId);
      if (originalEntry) {
        if (editContent.trim() !== (originalEntry.content || '').trim()) return true;
        if (editMood !== (originalEntry.mood ?? undefined)) return true;
        if (editKickCount !== (originalEntry.kickCount || 0)) return true;
        if (editPendingVoiceNote !== null) return true;
      }
    }

    return false;
  }, [
    showNewEntryForm, 
    content, 
    mood, 
    pendingVoiceNote, 
    entryKickCount, 
    editingEntryId, 
    editContent, 
    editMood, 
    editKickCount, 
    editPendingVoiceNote,
    selectedDateEntries
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const entriesScrollRef = useRef<HTMLDivElement>(null);

  // Form IDs for accessibility
  const newContentId = useId();
  const editContentId = useId();
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

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowCloseConfirmation(true);
      return;
    }
    closeJournal();
    clearError();
  }, [closeJournal, clearError, hasUnsavedChanges]);

  const confirmClose = useCallback(() => {
    setShowCloseConfirmation(false);
    closeJournal();
    clearError();
  }, [closeJournal, clearError]);

  useEffect(() => {
    setContent('');
    setMood(undefined);
    setTopicReferences([]);
    setJourneyReferences([]);

    setPendingVoiceNote(null);
    setEntryKickCount(0);
    setShowVoiceRecorder(false);
    setEditingEntryId(null);
    setEditContent('');
    setEditMood(undefined);
    setShowNewEntryForm(selectedDateEntries.length === 0);
    setActiveSuggestionField(null);
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
  }, [isOpen, showSuggestions, handleClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [isOpen]);



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
    setActiveSuggestionField('new');
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

  const handleEditContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const cursorPosition = e.target.selectionStart;
    setEditContent(newContent);
    setActiveSuggestionField('edit');
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

  const handleSelectSuggestion = useCallback((suggestion: SuggestionItem) => {
    if (suggestionTriggerIndex === -1 || !activeSuggestionField) return;
    
    const targetContent = activeSuggestionField === 'new' ? content : editContent;
    const beforeTrigger = targetContent.substring(0, suggestionTriggerIndex);
    const afterCursor = targetContent.substring(suggestionTriggerIndex + suggestionFilter.length + 1);
    const newContent = `${beforeTrigger}@${suggestion.title} ${afterCursor}`;
    
    if (activeSuggestionField === 'new') {
      setContent(newContent);
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
    } else {
      setEditContent(newContent);
      editTextareaRef.current?.focus();
    }

    setShowSuggestions(false);
    setSuggestionFilter('');
    setSuggestionTriggerIndex(-1);
    setActiveSuggestionField(null);
  }, [content, editContent, suggestionTriggerIndex, suggestionFilter, activeSuggestionField]);

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
  }, [showSuggestions, filteredSuggestions, selectedSuggestionIndex, handleSelectSuggestion]);



  const handleMoodSelect = useCallback((selectedMood: MoodType) => {
    setMood(selectedMood);
  }, []);

  const handleSaveNewEntry = useCallback(async () => {
    if (!content.trim() && !mood && !pendingVoiceNote && entryKickCount === 0) return;
    setIsSaving(true);
    try {
      // Extract references from content to ensure all mentions are linked
      const { topicReferences: extractedTopics, journeyReferences: extractedJourneys } = 
        extractReferencesFromContent(content, allSuggestions);

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
          topicReferences: extractedTopics.length > 0 ? extractedTopics : undefined,
          journeyReferences: extractedJourneys.length > 0 ? extractedJourneys : undefined,
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
      setEditPendingVoiceNote(null);
      setEntryKickCount(0);
      setShowNewEntryForm(false);
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setIsSaving(false);
    }
  }, [content, mood, pendingVoiceNote, entryKickCount, selectedDate, refreshEntries, allSuggestions]);

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
      // Extract references from edit content
      const { topicReferences: extractedTopics, journeyReferences: extractedJourneys } = 
        extractReferencesFromContent(editContent, allSuggestions);

      const updateData: UpdateJournalEntry = {
        content: editContent.trim() || undefined,
        mood: editMood,
        kickCount: editKickCount > 0 ? editKickCount : undefined,
        topicReferences: extractedTopics.length > 0 ? extractedTopics : undefined,
        journeyReferences: extractedJourneys.length > 0 ? extractedJourneys : undefined,
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
  }, [editingEntryId, editContent, editMood, editKickCount, editPendingVoiceNote, updateEntry, selectedDateEntries, refreshEntries, allSuggestions]);

  const handleDeleteEntry = useCallback((entryId: string) => {
    if (editingEntryId === entryId) return;
    setDeleteTargetId(entryId);
    setShowDeleteConfirmation(true);
  }, [editingEntryId]);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    setShowDeleteConfirmation(false);
    setDeletingEntryId(deleteTargetId);
    try {
      await deleteEntry(deleteTargetId);
      if (editingEntryId === deleteTargetId) handleCancelEdit();
    } catch (err) {
      console.error('Failed to delete entry:', err);
    } finally {
      setDeletingEntryId(null);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, deleteEntry, editingEntryId, handleCancelEdit]);

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
              ? 'text-white shadow-lg scale-110' 
              : isToday 
                ? isDark ? 'ring-2' : 'bg-purple-50 text-purple-700 ring-2 ring-purple-200' 
                : isFuture 
                  ? isDark ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 cursor-not-allowed' 
                  : isDark ? 'hover:bg-opacity-20' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }
          `}
          style={{
            ...(isSelected ? { 
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.tertiary || currentTheme.colors.primary})`,
              boxShadow: `0 4px 14px ${currentTheme.colors.primary}40`
            } : {}),
            ...(isToday && !isSelected && isDark ? { 
              backgroundColor: `${currentTheme.colors.primary}20`,
              color: currentTheme.colors.primary,
              borderColor: currentTheme.colors.primary
            } : {}),
            ...(!isSelected && !isToday && !isFuture && isDark ? { 
              color: currentTheme.colors.text,
              backgroundColor: 'transparent'
            } : {}),
            ...(!isSelected && !isToday && !isFuture && isDark ? {
              '--hover-bg': `${currentTheme.colors.primary}20`
            } as React.CSSProperties : {})
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isToday && !isFuture && isDark) {
              e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`;
              e.currentTarget.style.color = currentTheme.colors.primary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isToday && !isFuture && isDark) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = currentTheme.colors.text;
            }
          }}
          aria-label={`${MONTH_NAMES[viewMonth]} ${day}, ${viewYear}${hasEntry ? ' - has entry' : ''}`}
          aria-pressed={isSelected}
        >
          {day}
          {hasEntry && (
            <span 
              className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors`}
              style={{ backgroundColor: isSelected ? '#ffffff' : currentTheme.colors.primary }}
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
        className="absolute inset-0 backdrop-blur-sm transition-opacity duration-300"
        style={{ backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(17, 24, 39, 0.6)' }}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative rounded-[2rem] shadow-2xl w-full max-w-[90rem] h-[90vh] overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 ${morphOrigin ? 'animate-modal-morph' : 'animate-spring-in'}`}
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          ...morphStyles
        }}
      >
        {/* Close button (Moved to top-right) */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 p-2.5 rounded-full transition-all shadow-sm hover:shadow-md"
          style={{
            backgroundColor: currentTheme.colors.surface,
            color: currentTheme.colors.textMuted,
            borderWidth: '1px',
            borderColor: currentTheme.colors.border
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb';
            e.currentTarget.style.color = currentTheme.colors.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
            e.currentTarget.style.color = currentTheme.colors.textMuted;
          }}
          aria-label="Close journal"
        >
          <X className="w-5 h-5" />
        </button>
        {/* Left Panel - Calendar */}
        <div 
          className="md:w-96 lg:w-96 p-6 flex flex-col flex-shrink-0 relative overflow-hidden"
          style={{ 
            backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(249, 250, 251, 0.8)',
            borderRightWidth: '1px',
            borderRightColor: currentTheme.colors.border
          }}
        >
          {/* Close button (Moved to top-left) */}

          {/* Decorative background gradients */}
          <div 
            className="absolute top-0 left-0 w-full h-64 pointer-events-none" 
            style={{ background: `linear-gradient(to bottom, ${currentTheme.colors.primary}10, transparent)` }}
          />
          <div 
            className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"
            style={{ background: `${currentTheme.colors.secondary}20` }}
          />

          {/* Header */}
          {/* Header */}
          <div className="relative z-10 flex items-center gap-4 mb-8 mt-4">
            <div 
              className="w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center animate-bounce-subtle"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                boxShadow: `0 4px 14px ${currentTheme.colors.primary}20`,
                color: currentTheme.colors.primary
              }}
            >
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h2 id="journal-modal-title" className="text-xl font-bold tracking-tight" style={{ color: currentTheme.colors.text }}>My Journal</h2>
              <p className="text-sm font-medium" style={{ color: currentTheme.colors.textMuted }}>Your pregnancy journey</p>
            </div>
          </div>

          {/* Calendar Navigation */}
          <div className="relative z-10 flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl transition-all"
              style={{ color: currentTheme.colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                e.currentTarget.style.color = currentTheme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = currentTheme.colors.textMuted;
              }}
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
              {MONTH_NAMES[viewMonth]} <span style={{ color: currentTheme.colors.textMuted }} className="font-normal">{viewYear}</span>
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl transition-all"
              style={{ color: currentTheme.colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                e.currentTarget.style.color = currentTheme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = currentTheme.colors.textMuted;
              }}
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="relative z-10 mb-8">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAY_NAMES.map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.colors.textMuted }}>
                  {day.charAt(0)}
                </div>
              ))}
            </div>
            
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>

          {/* Kick Activity Graph - Compact version */}
          {isAuthenticated && (
            <div 
              className="relative z-10 mb-6 rounded-2xl p-4 shadow-sm"
              style={{ 
                backgroundColor: currentTheme.colors.surface,
                borderWidth: '1px',
                borderColor: currentTheme.colors.border
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.colors.textMuted }}>Activity</h3>
              </div>
              <KickGraph 
                days={7} 
                height={150} 
                showMilestones={false}
                chartType="bar"
                className=""
              />
            </div>
          )}

          {/* Selected Date Card */}
          <div className="mt-auto relative z-10">
            <div 
              className="group relative overflow-hidden rounded-2xl text-white shadow-xl transition-all hover:shadow-2xl"
              style={{ 
                backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                boxShadow: `0 10px 25px ${currentTheme.colors.primary}30`
              }}
            >
              <div 
                className="absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity" 
                style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.tertiary || currentTheme.colors.secondary})` }}
              />
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Selected Date</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">
                        {selectedDate.getDate()}
                      </span>
                      <span className="text-xl" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        {selectedDate.toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="ml-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {selectedDate.toLocaleDateString('en-US', { weekday: 'short' })}
                      </span>
                    </div>
                  </div>
                  {selectedDateEntries.length > 0 ? (
                    <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-2 flex flex-col items-center">
                      <span className="text-xl font-bold">{selectedDateEntries.length}</span>
                      <span className="text-[10px] uppercase tracking-wide opacity-80">Entries</span>
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-full p-2">
                       <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                       </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!isAuthenticated && (
              <button 
                onClick={() => {
                  handleClose();
                  navigate('/signin');
                }}
                className="w-full mt-4 p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
                style={{
                  backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#fffbeb',
                  borderWidth: '1px',
                  borderColor: isDark ? currentTheme.colors.primary : '#fef3c7'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? `${currentTheme.colors.primary}30` : '#fef3c7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isDark ? `${currentTheme.colors.primary}20` : '#fffbeb';
                }}
              >
                <span 
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg"
                  style={{ 
                    backgroundColor: isDark ? `${currentTheme.colors.primary}30` : '#fef3c7',
                    color: isDark ? currentTheme.colors.primary : '#d97706'
                  }}
                >
                  💡
                </span>
                <p className="text-xs font-medium" style={{ color: isDark ? currentTheme.colors.text : '#92400e' }}>
                  Sign in to sync your journal across all your devices
                </p>
              </button>
            )}
          </div>
        </div>


        {/* Right Panel - Entries */}
        <div 
          className="flex-1 flex flex-col min-h-[500px] md:min-h-0 overflow-hidden relative"
          style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(249, 250, 251, 0.3)' }}
        >
          {/* Header */}
          <div 
            className="px-6 py-4 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between"
            style={{ 
              backgroundColor: isDark ? `${currentTheme.colors.surface}ee` : 'rgba(255, 255, 255, 0.8)',
              borderBottomWidth: '1px',
              borderBottomColor: currentTheme.colors.border
            }}
          >
            <div>
              <h3 className="text-xl font-serif font-bold mb-0.5" style={{ color: currentTheme.colors.text }}>
                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h3>
              <p className="text-sm font-medium flex items-center gap-2" style={{ color: currentTheme.colors.textMuted }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTheme.colors.primary }}></span>
                {selectedDateEntries.length === 0 ? 'No entries yet' : `${selectedDateEntries.length} ${selectedDateEntries.length === 1 ? 'entry' : 'entries'}`}
              </p>
            </div>
            
            {!showNewEntryForm && !editingEntryId && (
              <div className="w-8" /> /* Spacer to balance header if needed, or just remove button */
            )}
          </div>

          {/* Error display */}
          {(error || voiceRecordingError) && (
            <div 
              className="mx-8 mt-6 p-4 rounded-2xl text-sm flex items-center justify-between shadow-sm"
              style={{
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
                borderWidth: '1px',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#fee2e2',
                color: isDark ? '#fca5a5' : '#dc2626'
              }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error || voiceRecordingError}
              </span>
              <button 
                onClick={() => { clearError(); setVoiceRecordingError(null); }} 
                className="p-1 rounded-lg transition-colors"
                style={{ color: isDark ? '#fca5a5' : '#dc2626' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.2)' : '#fee2e2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Scrollable content */}
          <div className="flex-1 relative min-h-0">
             <ScrollIndicators containerRef={entriesScrollRef} />
             <div className="absolute inset-0 overflow-y-auto p-5 space-y-4 custom-scrollbar" ref={entriesScrollRef}>
            
            {/* New Entry Form */}
            {showNewEntryForm && (
              <div 
                className="rounded-2xl shadow-xl overflow-visible animate-slide-up-fade"
                style={{
                  backgroundColor: currentTheme.colors.surface,
                  borderWidth: '1px',
                  borderColor: currentTheme.colors.border,
                  boxShadow: `0 10px 25px ${currentTheme.colors.primary}15`
                }}
              >
                {/* Form header */}
                <div 
                  className="px-5 py-3 flex items-center justify-between"
                  style={{
                    background: isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : 'linear-gradient(to right, #f9fafb, #ffffff)',
                    borderBottomWidth: '1px',
                    borderBottomColor: currentTheme.colors.border
                  }}
                >
                  <h4 className="font-bold flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.colors.primary }}></span>
                    New Entry
                  </h4>
                  <button 
                    onClick={() => setShowNewEntryForm(false)}
                    className="transition-colors"
                    style={{ color: currentTheme.colors.textMuted }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = currentTheme.colors.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = currentTheme.colors.textMuted; }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {/* Mood Grid */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: currentTheme.colors.textMuted }}>
                      Current Mood
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {MOOD_OPTIONS.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleMoodSelect(option.value)}
                          className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
                          style={{
                            backgroundColor: mood === option.value 
                              ? (isDark ? currentTheme.colors.primary : '#111827')
                              : (isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}15` : '#f9fafb'),
                            color: mood === option.value 
                              ? '#ffffff' 
                              : currentTheme.colors.text,
                            transform: mood === option.value ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: mood === option.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                          }}
                        >
                          <span className={`text-base transition-transform duration-300 ${mood === option.value ? 'scale-125' : 'group-hover:scale-110'}`}>{option.emoji}</span>
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note textarea */}
                  <div className="relative group">
                     {/* Suggestion Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div 
                        className="absolute left-0 right-0 top-full mt-2 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-[200] transform origin-top animate-scale-in"
                        style={{
                          backgroundColor: currentTheme.colors.surface,
                          borderWidth: '1px',
                          borderColor: currentTheme.colors.border
                        }}
                      >
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={`${suggestion.type}-${suggestion.id}`}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors"
                            style={{
                              backgroundColor: index === selectedSuggestionIndex ? `${currentTheme.colors.primary}15` : 'transparent',
                              color: index === selectedSuggestionIndex ? currentTheme.colors.primary : currentTheme.colors.text
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = index === selectedSuggestionIndex ? `${currentTheme.colors.primary}15` : 'transparent';
                            }}
                          >
                            <span 
                              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                              style={{
                                backgroundColor: suggestion.type === 'topic' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                color: suggestion.type === 'topic' ? '#6366f1' : '#10b981'
                              }}
                            >
                              {suggestion.type === 'topic' ? 'T' : 'J'}
                            </span>
                            <span className="font-medium truncate">{suggestion.title}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <label htmlFor={newContentId} className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: currentTheme.colors.textMuted }}>
                      Your Thoughts
                    </label>
                    <div className="relative">
                      <textarea
                        id={newContentId}
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        onKeyDown={handleKeyDown}
                        placeholder="What's on your mind? Type @ to mention topics..."
                        className="w-full min-h-[120px] p-3 rounded-xl resize-vertical transition-all font-sans leading-relaxed text-sm"
                        style={{
                          backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                          color: currentTheme.colors.text,
                          borderWidth: '1px',
                          borderColor: 'transparent'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                          e.currentTarget.style.borderColor = currentTheme.colors.primary;
                          e.currentTarget.style.boxShadow = `0 0 0 4px ${currentTheme.colors.primary}15`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        disabled={isLoading}
                      />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        {/* Quick Actions overlay if needed, or keeping it clean */}
                      </div>
                    </div>
                  </div>

                  {/* Voice & Kicks row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Voice Note */}
                    <div 
                      className="rounded-xl p-3 transition-colors"
                      style={{
                        backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                        borderWidth: '1px',
                        borderColor: currentTheme.colors.border
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block flex items-center gap-2" style={{ color: currentTheme.colors.textMuted }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        Voice Note
                      </span>
                      {pendingVoiceNote ? (
                        <div 
                          className="flex flex-col gap-2 p-2 rounded-lg"
                          style={{
                            backgroundColor: `${currentTheme.colors.primary}15`,
                            borderWidth: '1px',
                            borderColor: `${currentTheme.colors.primary}30`
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5" style={{ color: currentTheme.colors.primary }}>
                              <Mic className="w-3 h-3" /> Recorded
                            </span>
                            <button 
                              onClick={() => setPendingVoiceNote(null)} 
                              className="p-1 rounded transition-colors"
                              style={{ color: currentTheme.colors.primary }}
                              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`; }}
                              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          <JournalAudioPlayer src={URL.createObjectURL(pendingVoiceNote.blob)} className="w-full" />
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
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all disabled:opacity-50 group"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            borderWidth: '1px',
                            borderStyle: 'dashed',
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textMuted
                          }}
                          onMouseEnter={(e) => {
                            if (isAuthenticated) {
                              e.currentTarget.style.borderColor = currentTheme.colors.primary;
                              e.currentTarget.style.color = currentTheme.colors.primary;
                              e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = currentTheme.colors.border;
                            e.currentTarget.style.color = currentTheme.colors.textMuted;
                            e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                          }}
                        >
                          <span 
                            className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                            style={{ backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3f4f6' }}
                          >
                            <svg className="w-3 h-3" style={{ color: currentTheme.colors.textMuted }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /></svg>
                          </span>
                          <span className="text-xs font-semibold">Record Audio</span>
                        </button>
                      )}
                    </div>

                    {/* Baby Kicks - Playful Redesign */}
                    <div 
                      className="rounded-xl p-3 transition-colors group h-fit"
                      style={{
                        backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                        borderWidth: '1px',
                        borderColor: currentTheme.colors.border
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block flex items-center gap-2" style={{ color: currentTheme.colors.textMuted }}>
                        <Footprints className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                        Baby Kicks
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEntryKickCount(prev => Math.max(0, prev - 1))}
                          disabled={entryKickCount === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-lg transition-all disabled:opacity-30"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            borderWidth: '1px',
                            borderColor: currentTheme.colors.border,
                            color: currentTheme.colors.textMuted
                          }}
                          onMouseEnter={(e) => {
                            if (entryKickCount > 0) {
                              e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}15`;
                              e.currentTarget.style.color = currentTheme.colors.primary;
                              e.currentTarget.style.borderColor = currentTheme.colors.primary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                            e.currentTarget.style.color = currentTheme.colors.textMuted;
                            e.currentTarget.style.borderColor = currentTheme.colors.border;
                          }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div 
                          className="flex-1 flex items-center justify-center gap-1 h-8 rounded-lg overflow-hidden relative"
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            borderWidth: '1px',
                            borderColor: currentTheme.colors.border
                          }}
                        >
                          <span key={entryKickCount} className="text-lg font-bold animate-spring-in inline-block" style={{ color: currentTheme.colors.text }}>
                             {entryKickCount}
                          </span>
                          {entryKickCount > 0 && (
                            <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `${currentTheme.colors.primary}10` }} />
                          )}
                        </div>
                        <button
                          onClick={() => setEntryKickCount(prev => prev + 1)}
                          className="w-8 h-8 flex items-center justify-center text-white rounded-lg transition-all active:scale-95 shadow-md"
                          style={{
                            backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                            boxShadow: `0 4px 12px ${currentTheme.colors.primary}30`
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827';
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* References Tags */}
                  {(topicReferences.length > 0 || journeyReferences.length > 0) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {topicReferences.map(ref => (
                        <span 
                          key={`topic-${ref.topicId}`} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.15)',
                            color: '#6366f1',
                            borderWidth: '1px',
                            borderColor: 'rgba(99, 102, 241, 0.25)'
                          }}
                        >
                          📚 {ref.title}
                          <button 
                            onClick={() => setTopicReferences(prev => prev.filter(r => r.topicId !== ref.topicId))} 
                            className="ml-1 rounded-full p-0.5 transition-colors"
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                      {journeyReferences.map(ref => (
                        <span 
                          key={`journey-${ref.journeyId}`} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide"
                          style={{
                            backgroundColor: 'rgba(16, 185, 129, 0.15)',
                            color: '#10b981',
                            borderWidth: '1px',
                            borderColor: 'rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          🗺️ {ref.title}
                          <button 
                            onClick={() => setJourneyReferences(prev => prev.filter(r => r.journeyId !== ref.journeyId))} 
                            className="ml-1 rounded-full p-0.5 transition-colors"
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.2)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form actions */}
                <div 
                  className="px-5 py-3 flex justify-end gap-2"
                  style={{
                    backgroundColor: isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb',
                    borderTopWidth: '1px',
                    borderTopColor: currentTheme.colors.border
                  }}
                >
                  {selectedDateEntries.length > 0 && (
                    <button
                      onClick={() => setShowNewEntryForm(false)}
                      className="px-4 py-2 text-sm rounded-lg font-medium transition-all"
                      style={{
                        backgroundColor: currentTheme.colors.surface,
                        color: currentTheme.colors.textMuted,
                        borderWidth: '1px',
                        borderColor: currentTheme.colors.border
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb';
                        e.currentTarget.style.borderColor = currentTheme.colors.textMuted;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                        e.currentTarget.style.borderColor = currentTheme.colors.border;
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={handleSaveNewEntry}
                    disabled={isSaving || isUploadingVoiceNote || (!content.trim() && !mood && !pendingVoiceNote && entryKickCount === 0) || isLoading}
                    className="px-6 py-2 text-sm text-white rounded-lg font-medium transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                    style={{
                      backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                      boxShadow: `0 4px 12px ${currentTheme.colors.primary}30`
                    }}
                    onMouseEnter={(e) => {
                      if (!e.currentTarget.disabled) {
                        e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827';
                    }}
                  >
                    {isSaving || isUploadingVoiceNote ? (
                      <>
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {isUploadingVoiceNote ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        Save Entry
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Existing entries */}
            <div className="space-y-6">
              {selectedDateEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative group rounded-[1.5rem] shadow-sm animate-slide-up-fade transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    backgroundColor: currentTheme.colors.surface,
                    borderWidth: '1px',
                    borderColor: editingEntryId === entry.id ? currentTheme.colors.primary : currentTheme.colors.border,
                    boxShadow: editingEntryId === entry.id ? `0 0 0 4px ${currentTheme.colors.primary}15, 0 10px 25px ${currentTheme.colors.primary}15` : undefined,
                    overflow: editingEntryId === entry.id ? 'visible' : 'hidden'
                  }}
                >
                  {editingEntryId === entry.id ? (
                    /* Edit mode - Matches New Entry Form styling */
                    <div className="p-5 space-y-4">
                      <div className="flex items-center justify-between pb-3" style={{ borderBottomWidth: '1px', borderBottomColor: currentTheme.colors.border }}>
                        <h4 className="font-bold flex items-center gap-2 text-sm" style={{ color: currentTheme.colors.text }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentTheme.colors.primary }}></span>
                          Edit Entry
                        </h4>
                        <span className="text-[10px] font-mono" style={{ color: currentTheme.colors.textMuted }}>
                          {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Mood */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: currentTheme.colors.textMuted }}>
                            Current Mood
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {MOOD_OPTIONS.map(option => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => setEditMood(prev => prev === option.value ? undefined : option.value)}
                                className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-300"
                                style={{
                                  backgroundColor: editMood === option.value 
                                    ? (isDark ? currentTheme.colors.primary : '#111827')
                                    : (isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}15` : '#f9fafb'),
                                  color: editMood === option.value 
                                    ? '#ffffff' 
                                    : currentTheme.colors.text,
                                  transform: editMood === option.value ? 'scale(1.05)' : 'scale(1)',
                                  boxShadow: editMood === option.value ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                                }}
                              >
                                <span className={`text-base transition-transform duration-300 ${editMood === option.value ? 'scale-125' : 'group-hover:scale-110'}`}>{option.emoji}</span>
                                <span>{option.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <label htmlFor={editContentId} className="text-[10px] font-bold uppercase tracking-widest mb-2 block" style={{ color: currentTheme.colors.textMuted }}>
                            Your Thoughts
                          </label>
                          <div className="relative">
                            <textarea
                              id={editContentId}
                              ref={editTextareaRef}
                              value={editContent}
                              onChange={handleEditContentChange}
                              onKeyDown={handleKeyDown}
                              placeholder="Write about your day..."
                              className="w-full min-h-[120px] p-3 rounded-xl resize-vertical transition-all font-sans leading-relaxed text-sm"
                              style={{
                                backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                                color: currentTheme.colors.text,
                                borderWidth: '1px',
                                borderColor: 'transparent'
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                                e.currentTarget.style.borderColor = currentTheme.colors.primary;
                                e.currentTarget.style.boxShadow = `0 0 0 4px ${currentTheme.colors.primary}15`;
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb';
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                              disabled={isLoading}
                            />
                            {showSuggestions && activeSuggestionField === 'edit' && (
                              <div 
                                className="absolute left-0 right-0 z-[100] mt-1 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto animate-scale-in origin-top"
                                style={{
                                  backgroundColor: currentTheme.colors.surface,
                                  borderWidth: '1px',
                                  borderColor: currentTheme.colors.border
                                }}
                              >
                                {filteredSuggestions.map((suggestion, idx) => (
                                  <button
                                    key={`${suggestion.type}-${suggestion.id}`}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className="w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors"
                                    style={{
                                      backgroundColor: idx === selectedSuggestionIndex ? `${currentTheme.colors.primary}15` : 'transparent',
                                      color: idx === selectedSuggestionIndex ? currentTheme.colors.primary : currentTheme.colors.text
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span style={{ color: currentTheme.colors.primary }} className="font-bold">@</span>
                                      {suggestion.title}
                                    </div>
                                    <span 
                                      className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full"
                                      style={{
                                        backgroundColor: isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb',
                                        color: currentTheme.colors.textMuted,
                                        borderWidth: '1px',
                                        borderColor: currentTheme.colors.border
                                      }}
                                    >
                                      {suggestion.type}
                                    </span>
                                  </button>
                                ))}
                                {filteredSuggestions.length === 0 && (
                                  <div className="px-4 py-3 text-sm italic" style={{ color: currentTheme.colors.textMuted }}>
                                    No suggestions found
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Voice & Kicks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div 
                            className="rounded-xl p-3 transition-colors"
                            style={{
                              backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                              borderWidth: '1px',
                              borderColor: currentTheme.colors.border
                            }}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block flex items-center gap-2" style={{ color: currentTheme.colors.textMuted }}>
                              <Activity className="w-3 h-3" />
                              Voice Note
                            </span>
                            {showEditVoiceRecorder ? (
                              <VoiceRecorder
                                onRecordingComplete={(blob, duration) => { setEditPendingVoiceNote({ blob, duration }); setShowEditVoiceRecorder(false); }}
                                onCancel={() => setShowEditVoiceRecorder(false)}
                                onError={handleVoiceRecordingError}
                                maxDuration={300}
                                disabled={isSaving || isUploadingVoiceNote}
                              />
                            ) : editPendingVoiceNote ? (
                              <div 
                                className="flex flex-col gap-2 p-3 rounded-xl"
                                style={{
                                  backgroundColor: `${currentTheme.colors.primary}15`,
                                  borderWidth: '1px',
                                  borderColor: `${currentTheme.colors.primary}30`
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5" style={{ color: currentTheme.colors.primary }}>
                                    <Mic className="w-3.5 h-3.5" /> Recorded
                                  </span>
                                  <button 
                                    onClick={() => setEditPendingVoiceNote(null)} 
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: currentTheme.colors.primary }}
                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}20`; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <JournalAudioPlayer src={URL.createObjectURL(editPendingVoiceNote.blob)} className="w-full" />
                              </div>
                            ) : entry.voiceNoteIds?.length ? (
                              <div className="space-y-3">
                                <JournalAudioPlayer src={getVoiceNoteUrl(entry.voiceNoteIds[0])} />
                                <button 
                                  onClick={() => setShowEditVoiceRecorder(true)} 
                                  className="w-full py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                  style={{
                                    color: currentTheme.colors.primary,
                                    borderWidth: '1px',
                                    borderStyle: 'dashed',
                                    borderColor: currentTheme.colors.primary
                                  }}
                                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`; }}
                                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                  Replace recording
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowEditVoiceRecorder(true)}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl transition-all group"
                                style={{
                                  backgroundColor: currentTheme.colors.surface,
                                  borderWidth: '2px',
                                  borderStyle: 'dashed',
                                  borderColor: currentTheme.colors.border,
                                  color: currentTheme.colors.textMuted
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = currentTheme.colors.primary;
                                  e.currentTarget.style.color = currentTheme.colors.primary;
                                  e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}10`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = currentTheme.colors.border;
                                  e.currentTarget.style.color = currentTheme.colors.textMuted;
                                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                                }}
                              >
                                <span 
                                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                                  style={{ backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3f4f6' }}
                                >
                                  <svg className="w-4 h-4" style={{ color: currentTheme.colors.textMuted }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" /></svg>
                                </span>
                                <span className="font-semibold">Record Audio</span>
                              </button>
                            )}
                          </div>

                          <div 
                            className="rounded-xl p-3 transition-colors h-fit"
                            style={{
                              backgroundColor: isDark ? currentTheme.colors.surfaceHover || `${currentTheme.colors.primary}10` : '#f9fafb',
                              borderWidth: '1px',
                              borderColor: currentTheme.colors.border
                            }}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 block flex items-center gap-2" style={{ color: currentTheme.colors.textMuted }}>
                              <Footprints className="w-3 h-3" style={{ color: currentTheme.colors.primary }} />
                              Baby Kicks
                            </span>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => setEditKickCount(prev => Math.max(0, prev - 1))} 
                                disabled={editKickCount === 0} 
                                className="w-11 h-11 flex items-center justify-center rounded-xl transition-all disabled:opacity-30"
                                style={{
                                  backgroundColor: currentTheme.colors.surface,
                                  borderWidth: '1px',
                                  borderColor: currentTheme.colors.border,
                                  color: currentTheme.colors.textMuted
                                }}
                                onMouseEnter={(e) => {
                                  if (editKickCount > 0) {
                                    e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}15`;
                                    e.currentTarget.style.color = currentTheme.colors.primary;
                                    e.currentTarget.style.borderColor = currentTheme.colors.primary;
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                                  e.currentTarget.style.color = currentTheme.colors.textMuted;
                                  e.currentTarget.style.borderColor = currentTheme.colors.border;
                                }}
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <div 
                                className="flex-1 flex items-center justify-center gap-1 h-11 rounded-xl relative overflow-hidden"
                                style={{
                                  backgroundColor: currentTheme.colors.surface,
                                  borderWidth: '1px',
                                  borderColor: currentTheme.colors.border
                                }}
                              >
                                <span key={editKickCount} className="text-2xl font-bold animate-spring-in inline-block" style={{ color: currentTheme.colors.text }}>{editKickCount}</span>
                                {editKickCount > 0 && <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: `${currentTheme.colors.primary}10` }} />}
                              </div>
                              <button 
                                onClick={() => setEditKickCount(prev => prev + 1)} 
                                className="w-11 h-11 flex items-center justify-center text-white rounded-xl transition-all active:scale-95 shadow-lg"
                                style={{
                                  backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                                  boxShadow: `0 4px 12px ${currentTheme.colors.primary}30`
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.colors.primary; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827'; }}
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-2" style={{ borderTopWidth: '1px', borderTopColor: currentTheme.colors.border }}>
                        <button 
                          onClick={handleCancelEdit} 
                          className="px-4 py-2 text-sm rounded-lg font-medium transition-all" 
                          style={{
                            backgroundColor: currentTheme.colors.surface,
                            color: currentTheme.colors.textMuted,
                            borderWidth: '1px',
                            borderColor: currentTheme.colors.border
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb';
                            e.currentTarget.style.borderColor = currentTheme.colors.textMuted;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = currentTheme.colors.surface;
                            e.currentTarget.style.borderColor = currentTheme.colors.border;
                          }}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          disabled={isSaving || isUploadingVoiceNote || (!editContent.trim() && !editMood && !(entry.voiceNoteIds?.length) && !editPendingVoiceNote && editKickCount === 0)}
                          className="px-6 py-2 text-sm text-white rounded-lg font-medium transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                          style={{
                            backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                            boxShadow: `0 4px 12px ${currentTheme.colors.primary}30`
                          }}
                          onMouseEnter={(e) => {
                            if (!e.currentTarget.disabled) {
                              e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827';
                          }}
                        >
                          {isSaving ? <><svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</> : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  ) : (

                    /* View mode */
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Kick Counter */}
                          {(entry.kickCount || 0) > 0 && (
                            <div 
                              className="flex items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm"
                              style={{
                                backgroundColor: `${currentTheme.colors.primary}15`,
                                color: currentTheme.colors.primary,
                                borderWidth: '1px',
                                borderColor: `${currentTheme.colors.primary}25`
                              }}
                            >
                              <Footprints className="w-4 h-4" />
                              <span className="text-sm font-bold">{entry.kickCount}</span>
                            </div>
                          )}
                          {/* Mood Indicator */}
                          {entry.mood && MOOD_OPTIONS.find(m => m.value === entry.mood) && (
                            <div 
                              className="flex items-center gap-2 px-3 py-1.5 text-white rounded-lg shadow-md"
                              style={{ backgroundColor: isDark ? currentTheme.colors.primary : '#111827' }}
                            >
                              <span className="text-lg">{MOOD_OPTIONS.find(m => m.value === entry.mood)?.emoji}</span>
                              <span className="text-sm font-bold">{MOOD_OPTIONS.find(m => m.value === entry.mood)?.label}</span>
                            </div>
                          )}
                          <span className="text-sm font-medium" style={{ color: currentTheme.colors.textMuted }}>
                            {new Date(entry.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {Math.abs(entry.updatedAt - entry.createdAt) > 1000 && (
                              <>
                                <span className="mx-1.5">•</span>
                                <span className="opacity-80">
                                  Last Updated {new Date(entry.updatedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: currentTheme.colors.textMuted }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f3f4f6';
                              e.currentTarget.style.color = currentTheme.colors.text;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = currentTheme.colors.textMuted;
                            }}
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            disabled={deletingEntryId === entry.id}
                            className="p-2 rounded-lg transition-colors"
                            style={{ color: currentTheme.colors.textMuted }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.color = '#ef4444';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = currentTheme.colors.textMuted;
                            }}
                            title="Delete"
                          >
                            {deletingEntryId === entry.id ? (
                              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content grid */}
                      <div className="space-y-6">
                        {/* Entry content with clickable topic links */}
                        {entry.content ? (
                          <div className="prose max-w-none" style={{ color: isDark ? currentTheme.colors.text : '#374151' }}>
                            <ContentWithTopicLinks
                              content={entry.content}
                              topicReferences={entry.topicReferences}
                              journeyReferences={entry.journeyReferences}
                              className="leading-7 text-lg"
                              onLinkClick={handleClose}
                            />
                          </div>
                        ) : (
                          !entry.voiceNoteIds?.length && !entry.kickCount && (
                             <p className="italic text-sm" style={{ color: currentTheme.colors.textMuted }}>No written content</p>
                          )
                        )}

                        {/* Voice & Kicks compact row */}
                        {/* Voice compact row */}
                        {Boolean(entry.voiceNoteIds?.length) && (
                          <div 
                            className="flex flex-wrap items-center gap-3 mt-3 pt-3"
                            style={{ borderTopWidth: '1px', borderTopColor: currentTheme.colors.border }}
                          >
                            {entry.voiceNoteIds && entry.voiceNoteIds.length > 0 && (
                              <div className="flex-1 min-w-[250px]">
                                <JournalAudioPlayer 
                                  src={getVoiceNoteUrl(entry.voiceNoteIds[0])} 
                                  className="w-full" 
                                />
                              </div>
                            )}
                          </div>
                        )}


                        
                        {/* Footer info (edited label) */}

                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Empty state */}
            {selectedDateEntries.length === 0 && !showNewEntryForm && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-inner"
                  style={{ 
                    backgroundColor: isDark ? currentTheme.colors.surfaceHover || currentTheme.colors.surface : '#f9fafb',
                    color: currentTheme.colors.textMuted
                  }}
                >
                  <PenLine className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>No entries yet</h3>
                <p className="mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: currentTheme.colors.textMuted }}>
                  Capture your thoughts, feelings, and special moments for this day.
                </p>
                <button
                  onClick={handleShowNewEntryForm}
                  className="flex items-center gap-2 px-8 py-3 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  style={{
                    backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                    boxShadow: `0 10px 25px ${currentTheme.colors.primary}30`
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.colors.primary; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827'; }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write First Entry
                </button>
              </div>

            )}
            </div>
          </div>

          {/* New Entry FAB */}
          {!showNewEntryForm && !editingEntryId && (
             <button
                onClick={handleShowNewEntryForm}
                className="absolute bottom-8 right-8 z-40 flex items-center gap-2 pl-4 pr-6 py-4 text-white rounded-full font-bold shadow-2xl hover:-translate-y-1 transition-all group animate-scale-in"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.primary : '#111827',
                  boxShadow: `0 10px 30px ${currentTheme.colors.primary}40`
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = currentTheme.colors.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.primary : '#111827'; }}
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <span>New Entry</span>
              </button>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showCloseConfirmation}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close without saving?"
        confirmText="Close Anyway"
        cancelText="Keep Editing"
        variant="warning"
        onConfirm={confirmClose}
        onCancel={() => setShowCloseConfirmation(false)}
        zIndex={100} 
      />

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setDeleteTargetId(null);
        }}
        zIndex={100}
      />
      <style>{`
        /* Spring / Elastic Scale In */
        @keyframes spring-scale-in {
          0% { transform: scale(0.9) translateY(10px); opacity: 0; }
          60% { transform: scale(1.02) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-spring-in {
          animation: spring-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        /* Subtle Bounce */
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default JournalModal;
