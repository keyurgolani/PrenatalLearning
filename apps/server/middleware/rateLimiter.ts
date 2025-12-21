import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

// Check if we're in development mode
const isDevelopment = config.server.nodeEnv === 'development';

// General rate limiter for all routes (100 requests per minute)
export const generalRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 1 minute window
  max: config.rateLimit.maxRequests,
  skip: () => isDevelopment, // Skip rate limiting entirely in development
  statusCode: 429,
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiter for authentication endpoints (10 attempts per minute in prod)
// Completely disabled in development mode
export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 1 minute window
  max: config.rateLimit.authMaxRequests, // 10 in prod
  skip: () => isDevelopment, // Skip rate limiting entirely in development
  statusCode: 429,
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
});
