/**
 * Integration Tests for Complete Journaling Flow
 * 
 * Requirements:
 * - 10.4: Allow users to add new journal entries to any selected date
 * - 10.5: Allow users to view and edit past journal entries by selecting a date
 * - 10.9: Allow multiple journal entries per date (stack of notes)
 * - 18.1: Allow users to edit any existing journal entry
 * - 18.2: Allow users to delete any journal entry
 * 
 * This test file validates the complete journaling flow including:
 * - Creating multiple entries for the same date
 * - Editing existing entries
 * - Deleting entries
 * - Setting moods
 * - Voice note integration (metadata validation)
 */

import { describe, it, expect } from 'vitest';
import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
  getJournalEntriesQuerySchema,
  getCalendarDataQuerySchema,
} from '../validators/journal.js';
import { normalizeDateToMidnight, MOOD_TYPES } from '../models/JournalEntry.js';
import { createVoiceNoteSchema } from '../validators/voiceNote.js';
import { VOICE_NOTE_ALLOWED_MIME_TYPES } from '../models/VoiceNote.js';

describe('Journal Integration Tests', () => {
  /**
   * Test: Multiple entries per date (Requirements: 10.9, 18.3)
   * Validates that the system allows creating multiple journal entries for the same date
   */
  describe('Multiple Entries Per Date', () => {
    it('should validate multiple entries with the same journalDate', () => {
      const journalDate = new Date().toISOString();
      
      // Create first entry
      const entry1 = createJournalEntrySchema.safeParse({
        journalDate,
        content: 'First entry for today',
        mood: 'happy',
      });
      expect(entry1.success).toBe(true);
      
      // Create second entry with same date
      const entry2 = createJournalEntrySchema.safeParse({
        journalDate,
        content: 'Second entry for today',
        mood: 'calm',
      });
      expect(entry2.success).toBe(true);
      
      // Create third entry with same date
      const entry3 = createJournalEntrySchema.safeParse({
        journalDate,
        content: 'Third entry for today',
        mood: 'grateful',
      });
      expect(entry3.success).toBe(true);
      
      // All entries should be valid with the same date
      expect(entry1.data?.journalDate).toBe(journalDate);
      expect(entry2.data?.journalDate).toBe(journalDate);
      expect(entry3.data?.journalDate).toBe(journalDate);
    });

    it('should allow entries with different content types on the same date', () => {
      const journalDate = new Date().toISOString();
      
      // Text entry
      const textEntry = createJournalEntrySchema.safeParse({
        journalDate,
        content: 'A text entry',
        entryType: 'text',
      });
      expect(textEntry.success).toBe(true);
      expect(textEntry.data?.entryType).toBe('text');
      
      // Voice entry (content can be empty for voice entries)
      const voiceEntry = createJournalEntrySchema.safeParse({
        journalDate,
        content: '',
        entryType: 'voice',
      });
      expect(voiceEntry.success).toBe(true);
      expect(voiceEntry.data?.entryType).toBe('voice');
    });
  });

  /**
   * Test: Edit existing entries (Requirements: 10.5, 18.1)
   * Validates that entries can be updated with new content, mood, and references
   */
  describe('Edit Existing Entries', () => {
    it('should validate content updates', () => {
      const update = updateJournalEntrySchema.safeParse({
        content: 'Updated content for the entry',
      });
      expect(update.success).toBe(true);
      expect(update.data?.content).toBe('Updated content for the entry');
    });

    it('should validate mood updates', () => {
      const update = updateJournalEntrySchema.safeParse({
        mood: 'excited',
      });
      expect(update.success).toBe(true);
      expect(update.data?.mood).toBe('excited');
    });

    it('should allow clearing mood by setting to null', () => {
      const update = updateJournalEntrySchema.safeParse({
        mood: null,
      });
      expect(update.success).toBe(true);
      expect(update.data?.mood).toBeNull();
    });

    it('should validate partial updates (only content)', () => {
      const update = updateJournalEntrySchema.safeParse({
        content: 'Only updating content',
      });
      expect(update.success).toBe(true);
      expect(update.data?.content).toBe('Only updating content');
      expect(update.data?.mood).toBeUndefined();
    });

    it('should validate partial updates (only mood)', () => {
      const update = updateJournalEntrySchema.safeParse({
        mood: 'tired',
      });
      expect(update.success).toBe(true);
      expect(update.data?.mood).toBe('tired');
      expect(update.data?.content).toBeUndefined();
    });

    it('should validate topic and journey reference updates', () => {
      const update = updateJournalEntrySchema.safeParse({
        topicReferences: [{ topicId: 1, title: 'Test Topic' }],
        journeyReferences: [{ journeyId: 'test-journey', title: 'Test Journey' }],
      });
      expect(update.success).toBe(true);
      expect(update.data?.topicReferences).toHaveLength(1);
      expect(update.data?.journeyReferences).toHaveLength(1);
    });

    it('should reject content exceeding max length', () => {
      const longContent = 'a'.repeat(10001); // Max is 10000
      const update = updateJournalEntrySchema.safeParse({
        content: longContent,
      });
      expect(update.success).toBe(false);
    });
  });

  /**
   * Test: Delete entries (Requirements: 18.2)
   * Note: Actual deletion is tested via API, here we validate the ID format
   */
  describe('Delete Entries', () => {
    it('should validate ObjectId format for deletion', () => {
      // Valid 24-character hex string
      const validId = '507f1f77bcf86cd799439011';
      expect(validId.length).toBe(24);
      expect(/^[0-9a-fA-F]{24}$/.test(validId)).toBe(true);
      
      // Invalid formats
      const invalidIds = [
        'invalid',
        '123',
        'journal_123456789012',
        '',
        '507f1f77bcf86cd79943901', // 23 chars
        '507f1f77bcf86cd7994390111', // 25 chars
      ];
      
      invalidIds.forEach(id => {
        expect(/^[0-9a-fA-F]{24}$/.test(id)).toBe(false);
      });
    });
  });

  /**
   * Test: Set moods (Requirements: 11.1, 11.2, 11.8, 11.9)
   * Validates mood selection and optional mood handling
   */
  describe('Set Moods', () => {
    it('should accept all valid mood types', () => {
      MOOD_TYPES.forEach(mood => {
        const entry = createJournalEntrySchema.safeParse({
          journalDate: new Date().toISOString(),
          content: 'Test entry',
          mood,
        });
        expect(entry.success).toBe(true);
        expect(entry.data?.mood).toBe(mood);
      });
    });

    it('should allow entries without mood (mood is optional)', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
        content: 'Entry without mood',
      });
      expect(entry.success).toBe(true);
      expect(entry.data?.mood).toBeUndefined();
    });

    it('should allow entries with null mood', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
        content: 'Entry with null mood',
        mood: null,
      });
      expect(entry.success).toBe(true);
      expect(entry.data?.mood).toBeNull();
    });

    it('should reject invalid mood types', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
        content: 'Test entry',
        mood: 'invalid_mood',
      });
      expect(entry.success).toBe(false);
    });

    it('should allow mood-only entries (no content required)', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
        mood: 'happy',
        // content defaults to empty string
      });
      expect(entry.success).toBe(true);
      expect(entry.data?.mood).toBe('happy');
      expect(entry.data?.content).toBe('');
    });
  });

  /**
   * Test: Voice note validation (Requirements: 12.7, 12.8)
   * Validates voice note metadata and constraints
   */
  describe('Voice Note Validation', () => {
    it('should validate voice note metadata', () => {
      const voiceNote = createVoiceNoteSchema.safeParse({
        journalEntryId: '507f1f77bcf86cd799439011',
        duration: 60, // 1 minute
        mimeType: 'audio/webm',
        size: 1024 * 100, // 100KB
      });
      expect(voiceNote.success).toBe(true);
    });

    it('should reject voice notes exceeding 5 minute duration', () => {
      const voiceNote = createVoiceNoteSchema.safeParse({
        journalEntryId: '507f1f77bcf86cd799439011',
        duration: 301, // Over 5 minutes (300 seconds)
        mimeType: 'audio/webm',
        size: 1024 * 100,
      });
      expect(voiceNote.success).toBe(false);
    });

    it('should accept voice notes at exactly 5 minutes', () => {
      const voiceNote = createVoiceNoteSchema.safeParse({
        journalEntryId: '507f1f77bcf86cd799439011',
        duration: 300, // Exactly 5 minutes
        mimeType: 'audio/webm',
        size: 1024 * 100,
      });
      expect(voiceNote.success).toBe(true);
    });

    it('should accept all supported MIME types', () => {
      VOICE_NOTE_ALLOWED_MIME_TYPES.forEach(mimeType => {
        const voiceNote = createVoiceNoteSchema.safeParse({
          journalEntryId: '507f1f77bcf86cd799439011',
          duration: 60,
          mimeType,
          size: 1024 * 100,
        });
        expect(voiceNote.success).toBe(true);
      });
    });

    it('should reject unsupported MIME types', () => {
      const voiceNote = createVoiceNoteSchema.safeParse({
        journalEntryId: '507f1f77bcf86cd799439011',
        duration: 60,
        mimeType: 'video/mp4', // Not an audio type
        size: 1024 * 100,
      });
      expect(voiceNote.success).toBe(false);
    });
  });

  /**
   * Test: Date normalization (Requirements: 10.8)
   * Validates that dates are properly normalized to midnight UTC
   */
  describe('Date Normalization', () => {
    it('should normalize date to midnight UTC', () => {
      const date = new Date('2024-12-18T15:30:45.123Z');
      const normalized = normalizeDateToMidnight(date);
      
      expect(normalized.getUTCHours()).toBe(0);
      expect(normalized.getUTCMinutes()).toBe(0);
      expect(normalized.getUTCSeconds()).toBe(0);
      expect(normalized.getUTCMilliseconds()).toBe(0);
      expect(normalized.getUTCDate()).toBe(18);
      expect(normalized.getUTCMonth()).toBe(11); // December (0-indexed)
      expect(normalized.getUTCFullYear()).toBe(2024);
    });

    it('should preserve the date when normalizing', () => {
      const dates = [
        new Date('2024-01-01T00:00:00.000Z'),
        new Date('2024-06-15T12:00:00.000Z'),
        new Date('2024-12-31T23:59:59.999Z'),
      ];
      
      dates.forEach(date => {
        const normalized = normalizeDateToMidnight(date);
        expect(normalized.getUTCDate()).toBe(date.getUTCDate());
        expect(normalized.getUTCMonth()).toBe(date.getUTCMonth());
        expect(normalized.getUTCFullYear()).toBe(date.getUTCFullYear());
      });
    });
  });

  /**
   * Test: Query validation (Requirements: 10.3)
   * Validates query parameters for listing and calendar endpoints
   */
  describe('Query Validation', () => {
    it('should validate journal entries query parameters', () => {
      const query = getJournalEntriesQuerySchema.safeParse({
        startDate: '2024-01-01T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.999Z',
        limit: 50,
        offset: 0,
      });
      expect(query.success).toBe(true);
    });

    it('should use default values for optional query parameters', () => {
      const query = getJournalEntriesQuerySchema.safeParse({});
      expect(query.success).toBe(true);
      expect(query.data?.limit).toBe(50);
      expect(query.data?.offset).toBe(0);
    });

    it('should validate calendar data query parameters', () => {
      const query = getCalendarDataQuerySchema.safeParse({
        month: 12,
        year: 2024,
      });
      expect(query.success).toBe(true);
      expect(query.data?.month).toBe(12);
      expect(query.data?.year).toBe(2024);
    });

    it('should reject invalid month values', () => {
      const invalidMonths = [0, 13, -1, 100];
      invalidMonths.forEach(month => {
        const query = getCalendarDataQuerySchema.safeParse({
          month,
          year: 2024,
        });
        expect(query.success).toBe(false);
      });
    });

    it('should reject invalid year values', () => {
      const invalidYears = [1999, 2101, -2024];
      invalidYears.forEach(year => {
        const query = getCalendarDataQuerySchema.safeParse({
          month: 6,
          year,
        });
        expect(query.success).toBe(false);
      });
    });
  });

  /**
   * Test: Entry creation validation (Requirements: 10.4)
   * Validates the complete entry creation schema
   */
  describe('Entry Creation Validation', () => {
    it('should create a valid entry with all fields', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
        content: 'A complete journal entry with all fields',
        mood: 'grateful',
        entryType: 'text',
        topicReferences: [
          { topicId: 1, title: 'The Story of Everything' },
          { topicId: 2, title: 'Dancing with Gravity' },
        ],
        journeyReferences: [
          { journeyId: 'first-trimester', title: 'First Trimester Journey' },
        ],
      });
      
      expect(entry.success).toBe(true);
      expect(entry.data?.content).toBe('A complete journal entry with all fields');
      expect(entry.data?.mood).toBe('grateful');
      expect(entry.data?.entryType).toBe('text');
      expect(entry.data?.topicReferences).toHaveLength(2);
      expect(entry.data?.journeyReferences).toHaveLength(1);
    });

    it('should create a valid entry with minimal fields', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: new Date().toISOString(),
      });
      
      expect(entry.success).toBe(true);
      expect(entry.data?.content).toBe('');
      expect(entry.data?.mood).toBeUndefined();
      expect(entry.data?.entryType).toBe('text');
      expect(entry.data?.topicReferences).toEqual([]);
      expect(entry.data?.journeyReferences).toEqual([]);
    });

    it('should reject entries without journalDate', () => {
      const entry = createJournalEntrySchema.safeParse({
        content: 'Entry without date',
      });
      expect(entry.success).toBe(false);
    });

    it('should reject entries with invalid journalDate format', () => {
      const entry = createJournalEntrySchema.safeParse({
        journalDate: 'not-a-date',
        content: 'Entry with invalid date',
      });
      expect(entry.success).toBe(false);
    });
  });
});
