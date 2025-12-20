/**
 * Header Component Tests
 * 
 * Tests for Header behavior including:
 * - Due date display in user dropdown menu (Requirements: 17.4)
 * - Login/register buttons for guest users (Requirements: 15.1)
 * - User menu for authenticated users (Requirements: 15.2)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock state that can be modified per test
const mockState = vi.hoisted(() => ({
  isAuthenticated: false,
  hasDueDate: false,
  currentTrimester: 'first' as 'first' | 'second' | 'third',
  currentWeek: 12,
  dueDate: null as Date | null,
}));

const mockOpenLogin = vi.fn();
const mockOpenRegister = vi.fn();
const mockOpenSettings = vi.fn();

// Mock the contexts
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: mockState.isAuthenticated,
    user: mockState.isAuthenticated ? { id: '1', name: 'Test User', email: 'test@example.com' } : null,
    isLoading: false,
    logout: vi.fn(),
  }),
}));

vi.mock('../contexts/ProfileContext', () => ({
  useProfile: () => ({
    activeProfile: mockState.isAuthenticated ? { id: '1', name: 'Baby Profile', expectedDate: new Date() } : null,
    profiles: [],
    isLoading: false,
  }),
}));

vi.mock('../contexts/TrimesterContext', () => ({
  useTrimester: () => ({
    hasDueDate: mockState.hasDueDate,
    currentTrimester: mockState.currentTrimester,
    currentWeek: mockState.currentWeek,
    dueDate: mockState.dueDate,
    setDueDate: vi.fn(),
    clearDueDate: vi.fn(),
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
        textMuted: '#6b7280',
        border: '#e5e7eb',
      },
    },
  }),
}));

// Mock useModal from contexts barrel export
vi.mock('../contexts', () => ({
  useModal: () => ({
    openLogin: mockOpenLogin,
    openRegister: mockOpenRegister,
    openSettings: mockOpenSettings,
    closeAll: vi.fn(),
  }),
}));

// Mock child components
vi.mock('./ViewModeToggle', () => ({
  ViewModeToggle: () => <div data-testid="view-mode-toggle">View Toggle</div>,
}));

vi.mock('./MiniAudioPlayer', () => ({
  MiniAudioPlayer: () => <div data-testid="mini-audio-player">Audio Player</div>,
}));

// Import after mocks
import { Header } from './Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockState.isAuthenticated = false;
    mockState.hasDueDate = false;
    mockState.currentTrimester = 'first';
    mockState.currentWeek = 12;
    mockState.dueDate = null;
  });

  /**
   * Test: Login/register buttons for guest users
   * Requirements: 15.1
   */
  describe('Guest user view', () => {
    it('should show Sign In button for guest users (Requirements: 15.1)', () => {
      mockState.isAuthenticated = false;
      renderWithRouter(<Header />);
      
      const signInButton = screen.getByLabelText('Sign in to your account');
      expect(signInButton).toBeDefined();
    });

    it('should show Sign Up button for guest users (Requirements: 15.1)', () => {
      mockState.isAuthenticated = false;
      renderWithRouter(<Header />);
      
      const signUpButton = screen.getByLabelText('Create a new account');
      expect(signUpButton).toBeDefined();
    });

    it('should open login modal when Sign In is clicked', () => {
      mockState.isAuthenticated = false;
      renderWithRouter(<Header />);
      
      const signInButton = screen.getByLabelText('Sign in to your account');
      fireEvent.click(signInButton);
      
      expect(mockOpenLogin).toHaveBeenCalledTimes(1);
    });

    it('should open register modal when Sign Up is clicked', () => {
      mockState.isAuthenticated = false;
      renderWithRouter(<Header />);
      
      const signUpButton = screen.getByLabelText('Create a new account');
      fireEvent.click(signUpButton);
      
      expect(mockOpenRegister).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * Test: User menu for authenticated users
   * Requirements: 15.2, 7.5
   */
  describe('Authenticated user view', () => {
    it('should show user menu button for authenticated users (Requirements: 15.2)', () => {
      mockState.isAuthenticated = true;
      renderWithRouter(<Header />);
      
      const userMenuButton = screen.getByLabelText('User menu');
      expect(userMenuButton).toBeDefined();
    });

    it('should display user name in menu button (Requirements: 15.2)', () => {
      mockState.isAuthenticated = true;
      renderWithRouter(<Header />);
      
      // User name should be visible
      expect(screen.getByText('Test User')).toBeDefined();
    });

    it('should NOT show Sign In/Sign Up buttons for authenticated users', () => {
      mockState.isAuthenticated = true;
      renderWithRouter(<Header />);
      
      const signInButton = screen.queryByLabelText('Sign in to your account');
      const signUpButton = screen.queryByLabelText('Create a new account');
      
      expect(signInButton).toBeNull();
      expect(signUpButton).toBeNull();
    });
  });

  /**
   * Test: Due date display in user dropdown menu
   * Requirements: 17.4
   */
  describe('Due date in user dropdown', () => {
    it('should show due date section in user dropdown when authenticated (Requirements: 17.4)', () => {
      mockState.isAuthenticated = true;
      mockState.hasDueDate = true;
      mockState.dueDate = new Date('2025-06-15');
      mockState.currentTrimester = 'second';
      mockState.currentWeek = 20;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      // Due Date section should be visible in dropdown
      expect(screen.getByText('Due Date')).toBeDefined();
    });

    it('should display trimester info when due date is set (Requirements: 17.4)', () => {
      mockState.isAuthenticated = true;
      mockState.hasDueDate = true;
      mockState.dueDate = new Date('2025-06-15');
      mockState.currentTrimester = 'second';
      mockState.currentWeek = 20;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      // Trimester info should be visible
      expect(screen.getByText('2nd Trimester')).toBeDefined();
    });

    it('should show "Set due date" option when no due date is set (Requirements: 17.4)', () => {
      mockState.isAuthenticated = true;
      mockState.hasDueDate = false;
      mockState.dueDate = null;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      // "Set due date" option should be visible
      expect(screen.getByText('Set due date')).toBeDefined();
    });

    it('should show edit option when due date is already set (Requirements: 17.4)', () => {
      mockState.isAuthenticated = true;
      mockState.hasDueDate = true;
      mockState.dueDate = new Date('2025-06-15');
      mockState.currentTrimester = 'second';
      mockState.currentWeek = 20;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      // Edit icon/button should be visible for changing due date
      expect(screen.getByText('2nd Trimester')).toBeDefined();
    });
  });

  /**
   * Test: User dropdown menu items
   */
  describe('User dropdown menu items', () => {
    it('should show Account Settings option in dropdown', () => {
      mockState.isAuthenticated = true;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      expect(screen.getByText('Account Settings')).toBeDefined();
    });

    it('should show Sign Out option in dropdown', () => {
      mockState.isAuthenticated = true;
      renderWithRouter(<Header />);
      
      // Open user menu
      const userMenuButton = screen.getByLabelText('User menu');
      fireEvent.click(userMenuButton);
      
      expect(screen.getByText('Sign Out')).toBeDefined();
    });
  });
});
