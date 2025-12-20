/**
 * Tests for Journal Service - Late-Night Journaling Logic
 * 
 * Requirements:
 * - 10.8: THE System SHALL treat entries created between midnight and 4AM as belonging to the previous day's journal date
 * - 10.10: THE System SHALL track creation timestamp and last update timestamp for each entry separately from journal date
 * 
 * Property 13: Journal entry date assignment
 * For any journal entry created between midnight and 4AM, the journalDate field 
 * should be set to the previous day's date (normalized to midnight).
 */

import { describe, it, expect } from 'vitest';
import { getEffectiveJournalDate } from './journalService';

describe('Late-Night Journaling Logic', () => {
  describe('getEffectiveJournalDate', () => {
    /**
     * Test: Entries before 4AM should go to previous day
     * Requirements: 10.8 - Entries created between midnight and 4AM belong to previous day
     */
    describe('entries before 4AM go to previous day', () => {
      it('should return previous day for midnight (00:00)', () => {
        // Create a date at midnight on January 15, 2024
        const midnight = new Date(2024, 0, 15, 0, 0, 0, 0);
        const result = getEffectiveJournalDate(midnight);
        
        // Should return January 14, 2024 at midnight
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(14);
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
      });

      it('should return previous day for 1:00 AM', () => {
        const oneAM = new Date(2024, 0, 15, 1, 0, 0, 0);
        const result = getEffectiveJournalDate(oneAM);
        
        expect(result.getDate()).toBe(14);
        expect(result.getHours()).toBe(0);
      });

      it('should return previous day for 2:30 AM', () => {
        const twoThirtyAM = new Date(2024, 0, 15, 2, 30, 0, 0);
        const result = getEffectiveJournalDate(twoThirtyAM);
        
        expect(result.getDate()).toBe(14);
        expect(result.getHours()).toBe(0);
      });

      it('should return previous day for 3:59 AM', () => {
        const threeAM = new Date(2024, 0, 15, 3, 59, 59, 999);
        const result = getEffectiveJournalDate(threeAM);
        
        expect(result.getDate()).toBe(14);
        expect(result.getHours()).toBe(0);
      });
    });

    /**
     * Test: Entries at 4AM and after should stay on current day
     * Requirements: 10.8 - Only entries between midnight and 4AM go to previous day
     */
    describe('entries at 4AM and after stay on current day', () => {
      it('should return same day for exactly 4:00 AM', () => {
        const fourAM = new Date(2024, 0, 15, 4, 0, 0, 0);
        const result = getEffectiveJournalDate(fourAM);
        
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(0);
      });

      it('should return same day for 4:01 AM', () => {
        const fourOneAM = new Date(2024, 0, 15, 4, 1, 0, 0);
        const result = getEffectiveJournalDate(fourOneAM);
        
        expect(result.getDate()).toBe(15);
      });

      it('should return same day for noon', () => {
        const noon = new Date(2024, 0, 15, 12, 0, 0, 0);
        const result = getEffectiveJournalDate(noon);
        
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(0);
      });

      it('should return same day for 11:59 PM', () => {
        const lateNight = new Date(2024, 0, 15, 23, 59, 59, 999);
        const result = getEffectiveJournalDate(lateNight);
        
        expect(result.getDate()).toBe(15);
        expect(result.getHours()).toBe(0);
      });
    });

    /**
     * Test: Date normalization to midnight
     * Requirements: 10.10 - journalDate stores the logical date for organization
     */
    describe('timestamps are normalized to midnight', () => {
      it('should normalize time to midnight for daytime entries', () => {
        const afternoon = new Date(2024, 0, 15, 14, 30, 45, 123);
        const result = getEffectiveJournalDate(afternoon);
        
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
      });

      it('should normalize time to midnight for late-night entries', () => {
        const lateNight = new Date(2024, 0, 15, 2, 45, 30, 500);
        const result = getEffectiveJournalDate(lateNight);
        
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
      });
    });

    /**
     * Test: Month boundary handling
     * Requirements: 10.8 - Late-night entries should correctly handle month boundaries
     */
    describe('month boundary handling', () => {
      it('should handle late-night entry on first day of month', () => {
        // 2:00 AM on February 1, 2024 should go to January 31, 2024
        const firstOfMonth = new Date(2024, 1, 1, 2, 0, 0, 0);
        const result = getEffectiveJournalDate(firstOfMonth);
        
        expect(result.getMonth()).toBe(0); // January
        expect(result.getDate()).toBe(31);
        expect(result.getFullYear()).toBe(2024);
      });

      it('should handle late-night entry on first day of year', () => {
        // 1:00 AM on January 1, 2024 should go to December 31, 2023
        const newYearsDay = new Date(2024, 0, 1, 1, 0, 0, 0);
        const result = getEffectiveJournalDate(newYearsDay);
        
        expect(result.getMonth()).toBe(11); // December
        expect(result.getDate()).toBe(31);
        expect(result.getFullYear()).toBe(2023);
      });

      it('should handle late-night entry on March 1 (leap year)', () => {
        // 3:00 AM on March 1, 2024 (leap year) should go to February 29, 2024
        const marchFirst = new Date(2024, 2, 1, 3, 0, 0, 0);
        const result = getEffectiveJournalDate(marchFirst);
        
        expect(result.getMonth()).toBe(1); // February
        expect(result.getDate()).toBe(29); // Leap year
        expect(result.getFullYear()).toBe(2024);
      });

      it('should handle late-night entry on March 1 (non-leap year)', () => {
        // 3:00 AM on March 1, 2023 (non-leap year) should go to February 28, 2023
        const marchFirst = new Date(2023, 2, 1, 3, 0, 0, 0);
        const result = getEffectiveJournalDate(marchFirst);
        
        expect(result.getMonth()).toBe(1); // February
        expect(result.getDate()).toBe(28); // Non-leap year
        expect(result.getFullYear()).toBe(2023);
      });
    });

    /**
     * Test: Input date is not mutated
     * Requirements: 10.10 - createdAt should reflect actual creation time
     */
    describe('input date immutability', () => {
      it('should not mutate the input date', () => {
        const originalDate = new Date(2024, 0, 15, 2, 30, 0, 0);
        const originalTime = originalDate.getTime();
        
        getEffectiveJournalDate(originalDate);
        
        // Original date should be unchanged
        expect(originalDate.getTime()).toBe(originalTime);
        expect(originalDate.getHours()).toBe(2);
        expect(originalDate.getMinutes()).toBe(30);
      });
    });

    /**
     * Test: Default to current time when no date provided
     */
    describe('default behavior', () => {
      it('should use current time when no date is provided', () => {
        const before = new Date();
        const result = getEffectiveJournalDate();
        const after = new Date();
        
        // Result should be normalized to midnight
        expect(result.getHours()).toBe(0);
        expect(result.getMinutes()).toBe(0);
        expect(result.getSeconds()).toBe(0);
        expect(result.getMilliseconds()).toBe(0);
        
        // Result date should be reasonable (within the test execution window)
        const resultDate = result.getDate();
        const beforeDate = before.getDate();
        
        // Account for late-night adjustment
        const beforeHour = before.getHours();
        const expectedDate = beforeHour < 4 ? beforeDate - 1 : beforeDate;
        
        // Handle month boundary edge case
        if (expectedDate < 1) {
          // If we crossed a month boundary, just verify it's a valid date
          expect(result.getTime()).toBeLessThanOrEqual(after.getTime());
        } else {
          expect(resultDate).toBe(expectedDate);
        }
      });
    });
  });
});
