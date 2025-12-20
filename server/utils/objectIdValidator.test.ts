/**
 * Tests for ObjectId Validation Utility
 * 
 * Requirements:
 * - 18.4: THE System SHALL NOT show "invalid ID format" errors when updating entries
 */

import { describe, it, expect } from 'vitest';
import { isValidObjectId, toObjectId, validateObjectId } from './objectIdValidator.js';
import { ObjectId } from 'mongodb';

describe('ObjectId Validation Utility', () => {
  describe('isValidObjectId', () => {
    it('should return true for valid 24-character hex strings', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('000000000000000000000000')).toBe(true);
      expect(isValidObjectId('ffffffffffffffffffffffff')).toBe(true);
      expect(isValidObjectId('FFFFFFFFFFFFFFFFFFFFFFFF')).toBe(true);
      expect(isValidObjectId('aAbBcCdDeEfF112233445566')).toBe(true);
    });

    it('should return false for strings that are not 24 characters', () => {
      expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // 23 chars
      expect(isValidObjectId('507f1f77bcf86cd7994390111')).toBe(false); // 25 chars
      expect(isValidObjectId('')).toBe(false);
      expect(isValidObjectId('abc')).toBe(false);
    });

    it('should return false for strings with non-hex characters', () => {
      expect(isValidObjectId('507f1f77bcf86cd79943901g')).toBe(false); // 'g' is not hex
      expect(isValidObjectId('journal_123456789012')).toBe(false);
      expect(isValidObjectId('507f1f77bcf86cd79943901!')).toBe(false);
      expect(isValidObjectId('507f1f77bcf86cd79943901 ')).toBe(false); // space
    });

    it('should return false for null, undefined, and non-string types', () => {
      expect(isValidObjectId(null)).toBe(false);
      expect(isValidObjectId(undefined)).toBe(false);
      expect(isValidObjectId(123456789012345678901234)).toBe(false);
      expect(isValidObjectId({})).toBe(false);
      expect(isValidObjectId([])).toBe(false);
    });

    it('should return false for local journal IDs', () => {
      // These are the format used by guest storage
      expect(isValidObjectId('journal_1702900000000_abc123xyz')).toBe(false);
      expect(isValidObjectId('journal_123')).toBe(false);
    });
  });

  describe('toObjectId', () => {
    it('should return ObjectId for valid strings', () => {
      const result = toObjectId('507f1f77bcf86cd799439011');
      expect(result).toBeInstanceOf(ObjectId);
      expect(result?.toString()).toBe('507f1f77bcf86cd799439011');
    });

    it('should return null for invalid strings', () => {
      expect(toObjectId('invalid')).toBeNull();
      expect(toObjectId('')).toBeNull();
      expect(toObjectId(null)).toBeNull();
      expect(toObjectId(undefined)).toBeNull();
    });
  });

  describe('validateObjectId', () => {
    it('should return valid result for valid ObjectId strings', () => {
      const result = validateObjectId('507f1f77bcf86cd799439011');
      expect(result.isValid).toBe(true);
      expect(result.objectId).toBeInstanceOf(ObjectId);
      expect(result.error).toBeUndefined();
    });

    it('should return error for null/undefined', () => {
      const nullResult = validateObjectId(null, 'test ID');
      expect(nullResult.isValid).toBe(false);
      expect(nullResult.objectId).toBeNull();
      expect(nullResult.error).toBe('test ID is required.');

      const undefinedResult = validateObjectId(undefined, 'test ID');
      expect(undefinedResult.isValid).toBe(false);
      expect(undefinedResult.error).toBe('test ID is required.');
    });

    it('should return error for non-string types', () => {
      const result = validateObjectId(12345, 'test ID');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('test ID must be a string.');
    });

    it('should return error for empty string', () => {
      const result = validateObjectId('', 'test ID');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('test ID cannot be empty.');

      const whitespaceResult = validateObjectId('   ', 'test ID');
      expect(whitespaceResult.isValid).toBe(false);
      expect(whitespaceResult.error).toBe('test ID cannot be empty.');
    });

    it('should return error with character count for wrong length', () => {
      const result = validateObjectId('507f1f77bcf86cd79943901', 'journal entry ID');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid journal entry ID format. Expected 24 characters, got 23.');
    });

    it('should return error for non-hex characters', () => {
      const result = validateObjectId('507f1f77bcf86cd79943901g', 'journal entry ID');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid journal entry ID format. Expected a 24-character hexadecimal string.');
    });

    it('should use default field name when not provided', () => {
      const result = validateObjectId(null);
      expect(result.error).toBe('ID is required.');
    });
  });
});
