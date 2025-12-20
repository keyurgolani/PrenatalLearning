/**
 * FloatingStatusBar Component Tests
 * 
 * Tests for FAB bar behavior including:
 * - Shows Journal button for Authenticated users
 * - Shows Sign In button for Guest users
 * - Triggers correct actions (openJournal vs openLogin)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingStatusBar } from './FloatingStatusBar';

// Mock the contexts
const mockOpenJournal = vi.fn();
const mockOpenLogin = vi.fn();

// Default mock values
const mockState = vi.hoisted(() => ({
  isAuthenticated: false,
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: mockState.isAuthenticated,
    user: mockState.isAuthenticated ? { id: '1', name: 'Test User' } : null,
    isLoading: false,
  }),
}));

vi.mock('../contexts/JournalContext', () => ({
  useJournal: () => ({
    openJournal: mockOpenJournal,
    isOpen: false,
  }),
}));

vi.mock('../contexts', () => ({
  useModal: () => ({
    openLogin: mockOpenLogin,
  }),
}));

vi.mock('../contexts/ThemeContext', () => ({
  useTheme: () => ({
    currentTheme: {
      isDark: false,
      colors: {
        primary: '#7c3aed',
        secondary: '#a855f7',
        surface: '#ffffff',
        text: '#1f2937',
        border: '#e5e7eb',
      },
    },
  }),
}));

vi.mock('../contexts/ReadingModeContext', () => ({
  useReadingMode: () => ({
    settings: {
      readingModeEnabled: false,
    },
  }),
}));

describe('FloatingStatusBar', () => {
  const defaultProps = {
    completedCount: 5,
    totalCount: 10,
    progressPercentage: 50,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isAuthenticated = false;
  });

  describe('Guest User', () => {
    it('should show "Sign in to Journal" button', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const button = screen.getByLabelText('Sign in to Journal');
      expect(button).toBeDefined();
    });

    it('should call openLogin when clicked', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const button = screen.getByLabelText('Sign in to Journal');
      fireEvent.click(button);
      
      expect(mockOpenLogin).toHaveBeenCalledTimes(1);
    });

    it('should show lock icon/status', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // We can inspect the SVG or just trust the label test implies presence
      // For more specific DOM check:
      const button = screen.getByTestId('floating-status-bar-button');
      expect(button.innerHTML).toContain('bg-yellow-400'); // Lock indicator
    });
  });

  describe('Authenticated User', () => {
    it('should show "Open Journal" button', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const button = screen.getByLabelText('Open Journal');
      expect(button).toBeDefined();
    });

    it('should call openJournal when clicked', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const button = screen.getByLabelText('Open Journal');
      fireEvent.click(button);
      
      expect(mockOpenJournal).toHaveBeenCalledTimes(1);
    });
  });
});
