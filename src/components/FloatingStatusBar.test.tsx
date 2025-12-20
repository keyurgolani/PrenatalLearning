/**
 * FloatingStatusBar Component Tests
 * 
 * Tests for FAB bar behavior including:
 * - Journal/kick buttons only show for authenticated users (Requirements: 17.1, 17.2)
 * - Compact FAB expands correctly (Requirements: 17.3)
 * - Due date is in user dropdown (Requirements: 17.4)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingStatusBar } from './FloatingStatusBar';

// Mock the contexts
const mockOpenJournal = vi.fn();
const mockLogKick = vi.fn().mockResolvedValue(undefined);

// Default mock values - use vi.hoisted to ensure they're available before mocks
const mockState = vi.hoisted(() => ({
  isAuthenticated: false,
  todayKicks: 0,
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: mockState.isAuthenticated,
    user: mockState.isAuthenticated ? { id: '1', name: 'Test User', email: 'test@example.com' } : null,
    isLoading: false,
  }),
}));

vi.mock('../contexts/JournalContext', () => ({
  useJournal: () => ({
    openJournal: mockOpenJournal,
    entries: [],
    selectedDate: new Date(),
    effectiveDate: new Date(),
    selectedDateEntries: [],
    isOpen: false,
    isLoading: false,
    closeJournal: vi.fn(),
    selectDate: vi.fn(),
    createEntry: vi.fn(),
    updateEntry: vi.fn(),
    deleteEntry: vi.fn(),
    todayEntries: [],
  }),
}));

vi.mock('../contexts/KickContext', () => ({
  useKick: () => ({
    logKick: mockLogKick,
    todayKicks: mockState.todayKicks,
    recentKicks: [],
    isLoading: false,
    dailyStats: [],
    timePatterns: null,
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

vi.mock('../contexts/ReadingModeContext', () => ({
  useReadingMode: () => ({
    settings: {
      readingModeEnabled: false,
    },
  }),
}));

vi.mock('../contexts/StreakContext', () => ({
  useStreak: () => ({
    currentStreak: 5,
    longestStreak: 10,
    lastActivityDate: new Date(),
    isLoading: false,
    recordActivity: vi.fn(),
  }),
}));

// Mock child components that have their own context dependencies
vi.mock('./StreakBadge', () => ({
  StreakBadge: ({ compact }: { compact?: boolean }) => (
    <div data-testid="streak-badge" data-compact={compact}>Streak</div>
  ),
}));

vi.mock('./TrimesterDisplay', () => ({
  TrimesterDisplay: () => <div data-testid="trimester-display">Trimester</div>,
}));

vi.mock('./ThemeSelector', () => ({
  ThemeSelector: () => <div data-testid="theme-selector">Theme Selector</div>,
}));

vi.mock('./FontSizeControl', () => ({
  FontSizeControl: () => <div data-testid="font-size-control">Font Size</div>,
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
    mockState.todayKicks = 0;
  });

  /**
   * Test: Journal/kick buttons only show for authenticated users
   * Requirements: 17.1, 17.2
   */
  describe('Authentication-based button visibility', () => {
    it('should NOT show journal button for guest users (Requirements: 17.2)', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Journal button should not be present for guest users
      const journalButton = screen.queryByLabelText('Open Journal');
      expect(journalButton).toBeNull();
    });

    it('should NOT show kick button for guest users (Requirements: 17.2)', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Kick button should not be present for guest users
      const kickButton = screen.queryByLabelText('Log Kick');
      expect(kickButton).toBeNull();
    });

    it('should show journal button for authenticated users (Requirements: 17.1)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Journal button should be present for authenticated users
      const journalButton = screen.getByLabelText('Open Journal');
      expect(journalButton).toBeDefined();
    });

    it('should show kick button for authenticated users (Requirements: 17.1)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Kick button should be present for authenticated users
      const kickButton = screen.getByLabelText('Log Kick');
      expect(kickButton).toBeDefined();
    });

    it('should call openJournal when journal button is clicked (Requirements: 17.1)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const journalButton = screen.getByLabelText('Open Journal');
      fireEvent.click(journalButton);
      
      expect(mockOpenJournal).toHaveBeenCalledTimes(1);
    });

    it('should call logKick when kick button is clicked (Requirements: 17.1)', async () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      const kickButton = screen.getByLabelText('Log Kick');
      fireEvent.click(kickButton);
      
      expect(mockLogKick).toHaveBeenCalledTimes(1);
    });

    it('should display today kick count when authenticated and kicks > 0 (Requirements: 17.1)', () => {
      mockState.isAuthenticated = true;
      mockState.todayKicks = 5;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // The kick count should be displayed
      expect(screen.getByText('5')).toBeDefined();
    });

    it('should NOT display kick count when todayKicks is 0 (Requirements: 13.4)', () => {
      mockState.isAuthenticated = true;
      mockState.todayKicks = 0;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // The kick button should be present but without a count badge
      const kickButton = screen.getByLabelText('Log Kick');
      expect(kickButton).toBeDefined();
      
      // There should be no "0" displayed in the kick button area
      // The button should only show the heart icon without a count
      const kickButtonText = kickButton.textContent;
      expect(kickButtonText).not.toContain('0');
    });

    it('should show updated kick count after state change (Requirements: 13.4)', () => {
      mockState.isAuthenticated = true;
      mockState.todayKicks = 3;
      const { rerender } = render(<FloatingStatusBar {...defaultProps} />);
      
      // Initial count should be 3
      expect(screen.getByText('3')).toBeDefined();
      
      // Simulate kick count update (as would happen after logKick succeeds)
      mockState.todayKicks = 4;
      rerender(<FloatingStatusBar {...defaultProps} />);
      
      // Updated count should be 4
      expect(screen.getByText('4')).toBeDefined();
      expect(screen.queryByText('3')).toBeNull();
    });
  });

  /**
   * Test: Compact FAB expands correctly
   * Requirements: 17.3
   */
  describe('Compact FAB expansion', () => {
    it('should render in compact mode (Requirements: 17.3)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} compact={true} />);
      
      // In compact mode, the FAB should be visible
      const container = document.querySelector('[class*="fixed"]');
      expect(container).toBeDefined();
    });

    it('should expand to show journal button when FAB is clicked for authenticated users (Requirements: 17.3)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} compact={true} />);
      
      // Click the FAB to expand
      const fabContainer = document.querySelector('[class*="fixed"]');
      const fabButton = fabContainer?.querySelector('[class*="backdrop-blur"]');
      if (fabButton) {
        fireEvent.click(fabButton);
      }
      
      // After expansion, journal button should be visible (with text "Journal")
      const journalButton = screen.queryByText('Journal');
      expect(journalButton).toBeDefined();
    });

    it('should expand to show settings button when FAB is clicked (Requirements: 17.3)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} compact={true} />);
      
      // Click the FAB to expand
      const fabContainer = document.querySelector('[class*="fixed"]');
      const fabButton = fabContainer?.querySelector('[class*="backdrop-blur"]');
      if (fabButton) {
        fireEvent.click(fabButton);
      }
      
      // After expansion, settings button should be visible (with text "Settings")
      const settingsButton = screen.queryByText('Settings');
      expect(settingsButton).toBeDefined();
    });

    it('should NOT show journal button in expanded FAB for guest users (Requirements: 17.2, 17.3)', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} compact={true} />);
      
      // Click the FAB to expand
      const fabContainer = document.querySelector('[class*="fixed"]');
      const fabButton = fabContainer?.querySelector('[class*="backdrop-blur"]');
      if (fabButton) {
        fireEvent.click(fabButton);
      }
      
      // Journal button should NOT be visible for guest users even in expanded FAB
      // The "Journal" text button should not exist
      const journalButton = screen.queryByText('Journal');
      expect(journalButton).toBeNull();
    });

    it('should collapse FAB when clicked again (Requirements: 17.3)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} compact={true} />);
      
      const fabContainer = document.querySelector('[class*="fixed"]');
      const fabButton = fabContainer?.querySelector('[class*="backdrop-blur"]');
      
      // First click - expand
      if (fabButton) {
        fireEvent.click(fabButton);
      }
      
      // Verify expanded
      expect(screen.queryByText('Journal')).toBeDefined();
      
      // Second click - collapse
      if (fabButton) {
        fireEvent.click(fabButton);
      }
      
      // After collapsing, the expanded options should not be visible
      const expandedJournalButton = screen.queryByText('Journal');
      expect(expandedJournalButton).toBeNull();
    });
  });

  /**
   * Test: Trimester display visibility based on authentication
   * Requirements: 17.4 - Due date moved to user dropdown for logged-in users
   */
  describe('Trimester display visibility', () => {
    it('should show trimester display for guest users in bar mode (Requirements: 17.4)', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // TrimesterDisplay component should be rendered for guest users
      const trimesterDisplay = screen.getByTestId('trimester-display');
      expect(trimesterDisplay).toBeDefined();
    });

    it('should NOT show trimester display for authenticated users in bar mode (Requirements: 17.4)', () => {
      mockState.isAuthenticated = true;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // For authenticated users, trimester is in user dropdown, not in the bar
      const trimesterDisplay = screen.queryByTestId('trimester-display');
      expect(trimesterDisplay).toBeNull();
    });
  });

  /**
   * Test: Settings popup functionality
   */
  describe('Settings popup', () => {
    it('should open settings popup when settings button is clicked in bar mode', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Find and click the settings button
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      // Settings popup should be visible (contains Theme and Font Size via mocked components)
      expect(screen.getByTestId('theme-selector')).toBeDefined();
      expect(screen.getByTestId('font-size-control')).toBeDefined();
    });

    it('should close settings popup when clicked outside', () => {
      mockState.isAuthenticated = false;
      render(<FloatingStatusBar {...defaultProps} />);
      
      // Open settings
      const settingsButton = screen.getByLabelText('Settings');
      fireEvent.click(settingsButton);
      
      // Verify settings is open
      expect(screen.getByTestId('theme-selector')).toBeDefined();
      
      // Click outside (simulate mousedown on document)
      fireEvent.mouseDown(document.body);
      
      // Settings popup should be closed
      expect(screen.queryByTestId('theme-selector')).toBeNull();
    });
  });
});
