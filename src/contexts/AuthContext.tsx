/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, AuthContextValue } from '../types/auth';
import { authService, AuthServiceError } from '../services/authService';
import { setAuthErrorHandler, clearAuthErrorHandler } from '../services/apiClient';

/**
 * AuthContext for managing user authentication state
 * Requirements: 3.1, 3.5, 4.3 - Login, redirect after login, redirect to home on logout
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component that manages authentication state
 * Requirements: 3.1 - Authenticate user and create session
 * Requirements: 3.5 - Redirect user after login
 * Requirements: 4.3 - Redirect to home page in guest mode after logout
 */
export function AuthProvider({ children }: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount (token refresh)
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch (err) {
        // Silently fail - user is not authenticated
        console.warn('Auth check failed:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Set up API client auth error handler for 401 responses
  // Requirements: 16.1 - Handle 401 responses with redirect to login
  useEffect(() => {
    const handleAuthError = () => {
      // Clear user state on 401 - this effectively logs out the user
      setUser(null);
      setError('Your session has expired. Please log in again.');
    };

    setAuthErrorHandler(handleAuthError);

    return () => {
      clearAuthErrorHandler();
    };
  }, []);

  /**
   * Login with email and password
   * Requirements: 3.1 - Authenticate user and create session
   */
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password, rememberMe);
      setUser(result.user);
      
      // Handle deletion warning if present
      if (result.warning?.type === 'deletion_pending') {
        console.warn('Account deletion pending:', result.warning.message);
      }
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register a new user account
   * Requirements: 2.1 - Create new user account
   */
  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(email, password, name);
      setUser(result.user);
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout and clear session
   * Requirements: 4.3 - Redirect to home page in guest mode
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      // Even if logout fails on server, clear local state
      setUser(null);
      if (err instanceof AuthServiceError) {
        console.warn('Logout error:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear any authentication errors
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresh user data from the server
   * Used after profile operations to get updated activeProfileId
   */
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.warn('Failed to refresh user:', err);
    }
  }, []);

  const isAuthenticated = user !== null;

  const contextValue = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  }), [user, isAuthenticated, isLoading, error, login, register, logout, clearError, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * @throws Error if used outside of AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
