/**
 * ObjectId Validation Utility
 * 
 * Provides robust validation for MongoDB ObjectId strings.
 * 
 * Requirements:
 * - 18.4: THE System SHALL NOT show "invalid ID format" errors when updating entries
 * 
 * The standard MongoDB ObjectId.isValid() function is too permissive - it returns true
 * for any 12-character string or 24-character hex string, and even some other values.
 * This can lead to confusing errors when the ID is technically "valid" but not in the
 * expected format.
 * 
 * This utility provides stricter validation that only accepts:
 * - 24-character hexadecimal strings (the standard MongoDB ObjectId format)
 */

import { ObjectId } from 'mongodb';

/**
 * Regular expression for valid MongoDB ObjectId format
 * Must be exactly 24 hexadecimal characters (0-9, a-f, A-F)
 */
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

/**
 * Validates if a string is a valid MongoDB ObjectId format.
 * 
 * This is stricter than MongoDB's ObjectId.isValid() which accepts:
 * - 12-character strings (any characters)
 * - 24-character hex strings
 * - Numbers
 * - Existing ObjectId instances
 * 
 * This function only accepts 24-character hexadecimal strings.
 * 
 * @param id - The string to validate
 * @returns true if the string is a valid 24-character hex ObjectId, false otherwise
 * 
 * @example
 * isValidObjectId('507f1f77bcf86cd799439011') // true
 * isValidObjectId('507f1f77bcf86cd79943901')  // false (23 chars)
 * isValidObjectId('journal_123456789012')     // false (not hex)
 * isValidObjectId('')                          // false (empty)
 * isValidObjectId(null)                        // false (null)
 * isValidObjectId(undefined)                   // false (undefined)
 */
export function isValidObjectId(id: unknown): id is string {
  // Check if id is a non-empty string
  if (typeof id !== 'string' || !id) {
    return false;
  }

  // Check if it matches the 24-character hex pattern
  if (!OBJECT_ID_REGEX.test(id)) {
    return false;
  }

  // Double-check with MongoDB's ObjectId.isValid as a safety measure
  // This should always return true at this point, but it's a good sanity check
  return ObjectId.isValid(id);
}

/**
 * Converts a string to an ObjectId if valid, or returns null if invalid.
 * 
 * @param id - The string to convert
 * @returns ObjectId instance if valid, null otherwise
 * 
 * @example
 * toObjectId('507f1f77bcf86cd799439011') // ObjectId instance
 * toObjectId('invalid')                   // null
 */
export function toObjectId(id: unknown): ObjectId | null {
  if (!isValidObjectId(id)) {
    return null;
  }

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

/**
 * Validation result with detailed error information
 */
export interface ObjectIdValidationResult {
  isValid: boolean;
  objectId: ObjectId | null;
  error?: string;
}

/**
 * Validates an ObjectId string and returns detailed result.
 * 
 * @param id - The string to validate
 * @param fieldName - Optional field name for error messages (default: 'ID')
 * @returns Validation result with ObjectId if valid, or error message if invalid
 * 
 * @example
 * validateObjectId('507f1f77bcf86cd799439011')
 * // { isValid: true, objectId: ObjectId(...), error: undefined }
 * 
 * validateObjectId('invalid', 'journal entry ID')
 * // { isValid: false, objectId: null, error: 'Invalid journal entry ID format. Expected a 24-character hexadecimal string.' }
 */
export function validateObjectId(id: unknown, fieldName: string = 'ID'): ObjectIdValidationResult {
  // Check for null/undefined
  if (id === null || id === undefined) {
    return {
      isValid: false,
      objectId: null,
      error: `${fieldName} is required.`,
    };
  }

  // Check for non-string types
  if (typeof id !== 'string') {
    return {
      isValid: false,
      objectId: null,
      error: `${fieldName} must be a string.`,
    };
  }

  // Check for empty string
  if (!id.trim()) {
    return {
      isValid: false,
      objectId: null,
      error: `${fieldName} cannot be empty.`,
    };
  }

  // Check format
  if (!OBJECT_ID_REGEX.test(id)) {
    // Provide helpful error message based on the issue
    if (id.length !== 24) {
      return {
        isValid: false,
        objectId: null,
        error: `Invalid ${fieldName} format. Expected 24 characters, got ${id.length}.`,
      };
    }
    return {
      isValid: false,
      objectId: null,
      error: `Invalid ${fieldName} format. Expected a 24-character hexadecimal string.`,
    };
  }

  // Try to create ObjectId
  try {
    const objectId = new ObjectId(id);
    return {
      isValid: true,
      objectId,
      error: undefined,
    };
  } catch (err) {
    return {
      isValid: false,
      objectId: null,
      error: `Invalid ${fieldName} format.`,
    };
  }
}

export default {
  isValidObjectId,
  toObjectId,
  validateObjectId,
};
