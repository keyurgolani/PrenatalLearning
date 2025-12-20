/**
 * Authentication service for API communication
 * Requirements: 2.1, 3.1, 4.1, 15.6
 */

import type { AuthResult, AuthError, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Custom error class for authentication errors
 */
export class AuthServiceError extends Error {
  public readonly statusCode: number;
  public readonly details?: Array<{ field: string; message: string }>;

  constructor(message: string, statusCode: number, details?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'AuthServiceError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Helper function to handle API responses
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  if (!response.ok) {
    const errorData = data as AuthError;
    throw new AuthServiceError(
      errorData.error || 'An error occurred',
      response.status,
      errorData.details
    );
  }
  
  return data as T;
}

/**
 * Register a new user account
 * Requirements: 2.1 - Create new user account
 */
export async function register(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for HTTP-only token
    body: JSON.stringify({ email, password, name }),
  });

  return handleResponse<AuthResult>(response);
}

/**
 * Login with email and password
 * Requirements: 3.1 - Authenticate user and create session
 */
export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<AuthResult> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for HTTP-only token
    body: JSON.stringify({ email, password, rememberMe }),
  });

  return handleResponse<AuthResult>(response);
}

/**
 * Logout and invalidate session
 * Requirements: 4.1 - Invalidate current session
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // Include cookies to clear HTTP-only token
  });

  if (!response.ok) {
    const data = await response.json();
    throw new AuthServiceError(
      data.error || 'Logout failed',
      response.status
    );
  }
}

/**
 * Get current authenticated user
 * Used for token refresh/validation on app load
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies for HTTP-only token
    });

    if (response.status === 401) {
      // Not authenticated, return null
      return null;
    }

    if (!response.ok) {
      // Other error, return null but log it
      console.warn('Failed to get current user:', response.status);
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    // Network error or other issue, return null
    console.warn('Error getting current user:', error);
    return null;
  }
}

/**
 * Request password reset email
 * Requirements: 15.6 - Forgot password functionality
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse<{ message: string }>(response);
}

/**
 * Reset password with token
 * Requirements: 15.6 - Reset password with email link
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, newPassword }),
  });

  return handleResponse<{ message: string }>(response);
}

export const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};

export default authService;
