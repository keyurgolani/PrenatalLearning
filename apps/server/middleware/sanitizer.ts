import { Request, Response, NextFunction } from 'express';

/**
 * Characters that need to be escaped for HTML safety
 */
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

/**
 * MongoDB operators that could be used for NoSQL injection
 */
const NOSQL_OPERATORS = [
  '$gt', '$gte', '$lt', '$lte', '$ne', '$eq',
  '$in', '$nin', '$and', '$or', '$not', '$nor',
  '$exists', '$type', '$regex', '$where', '$expr',
  '$elemMatch', '$size', '$all', '$mod', '$text',
  '$search', '$meta', '$slice', '$comment', '$rand',
];

/**
 * Fields that should NOT be sanitized (passwords are hashed, not used in queries)
 */
const EXCLUDED_FIELDS = ['password', 'newPassword', 'currentPassword', 'confirmPassword'];

/**
 * Escapes HTML entities in a string to prevent XSS attacks.
 * Converts < > " ' & to their HTML entity equivalents.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }
  return str.replace(/[&<>"']/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Checks if a string contains potential NoSQL injection patterns.
 * Returns true if the string contains MongoDB operators.
 */
export function containsNoSqlInjection(str: string): boolean {
  if (typeof str !== 'string') {
    return false;
  }
  const lowerStr = str.toLowerCase();
  return NOSQL_OPERATORS.some(op => lowerStr.includes(op.toLowerCase()));
}

/**
 * Removes or neutralizes NoSQL injection patterns from a string.
 * Escapes $ characters that could be used for MongoDB operators.
 */
export function sanitizeNoSqlString(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }
  // Escape $ characters to prevent MongoDB operator injection
  return str.replace(/\$/g, '\\$');
}

/**
 * Recursively sanitizes an object for NoSQL injection prevention.
 * Note: HTML escaping is NOT done here because React already escapes content
 * when rendering, and double-escaping causes issues like &#x27; appearing in text.
 * Handles nested objects and arrays.
 * 
 * @param value - The value to sanitize
 * @param fieldName - Optional field name to check against excluded fields
 */
export function sanitizeValue(value: unknown, fieldName?: string): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    // Skip sanitization for password fields - they're hashed, not used in queries
    if (fieldName && EXCLUDED_FIELDS.includes(fieldName)) {
      return value;
    }
    // Only sanitize NoSQL patterns - React handles HTML escaping on render
    return sanitizeNoSqlString(value);
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item));
  }

  if (typeof value === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      // Reject keys that start with $ (MongoDB operators)
      if (typeof key === 'string' && key.startsWith('$')) {
        // Skip this key entirely - it's likely an injection attempt
        continue;
      }
      // Also sanitize object keys to prevent operator injection via keys
      const sanitizedKey = typeof key === 'string' ? sanitizeNoSqlString(key) : key;
      // Pass the field name to check if it should be excluded from sanitization
      sanitizedObj[sanitizedKey] = sanitizeValue(val, key);
    }
    return sanitizedObj;
  }

  // For numbers, booleans, etc., return as-is
  return value;
}

/**
 * Express middleware that sanitizes all user inputs in request body, query, and params.
 * - Escapes $ characters to prevent NoSQL injection (except for password fields)
 * - Removes object keys starting with $ (MongoDB operators)
 */
export function sanitizeInput(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    // Sanitize request body
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeValue(req.body);
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeValue(req.query) as typeof req.query;
    }

    // Sanitize URL parameters
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeValue(req.params) as typeof req.params;
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Strict sanitization middleware that rejects requests containing potential injection patterns.
 * Use this for sensitive endpoints where you want to block rather than sanitize.
 */
export function rejectMaliciousInput(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const checkForInjection = (value: unknown, path: string, fieldName?: string): string | null => {
    if (typeof value === 'string') {
      // Skip injection check for password fields
      if (fieldName && EXCLUDED_FIELDS.includes(fieldName)) {
        return null;
      }
      if (containsNoSqlInjection(value)) {
        return `Potentially malicious input detected in ${path}`;
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const result = checkForInjection(value[i], `${path}[${i}]`);
        if (result) return result;
      }
    } else if (value && typeof value === 'object') {
      for (const [key, val] of Object.entries(value)) {
        // Check if key itself is a MongoDB operator
        if (key.startsWith('$')) {
          return `Invalid field name in ${path}: ${key}`;
        }
        const result = checkForInjection(val, `${path}.${key}`, key);
        if (result) return result;
      }
    }
    return null;
  };

  // Check body
  if (req.body) {
    const bodyError = checkForInjection(req.body, 'body');
    if (bodyError) {
      res.status(400).json({ error: 'Invalid input', message: bodyError });
      return;
    }
  }

  // Check query
  if (req.query) {
    const queryError = checkForInjection(req.query, 'query');
    if (queryError) {
      res.status(400).json({ error: 'Invalid input', message: queryError });
      return;
    }
  }

  // Check params
  if (req.params) {
    const paramsError = checkForInjection(req.params, 'params');
    if (paramsError) {
      res.status(400).json({ error: 'Invalid input', message: paramsError });
      return;
    }
  }

  next();
}
