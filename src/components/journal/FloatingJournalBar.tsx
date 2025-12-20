import React, { useState, useCallback, useRef } from 'react';
import { useJournal } from '../../contexts/JournalContext';
import { useAuth } from '../../contexts/AuthContext';

/**
 * FloatingJournalBar component - Fixed position floating button for quick journal access
 * 
 * Requirements:
 * - 10.1: Provide a floating journal button accessible from any page in the application
 * - Voice recording, mood selection, and kick logging are inside the journal modal
 */

interface FloatingJournalBarProps {
  /** Position of the floating bar */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Custom class name */
  className?: string;
}

/**
 * FloatingJournalBar - A floating action button for quick journal access
 * Requirements: 10.1
 */
export const FloatingJournalBar: React.FC<FloatingJournalBarProps> = ({
  position = 'bottom-right',
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { openJournal, isOpen: isJournalOpen } = useJournal();
  
  // Hover state for tooltip
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Handle opening the journal with morph animation
   * Requirements: 10.1
   */
  const handleOpenJournal = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    openJournal({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  }, [openJournal]);

  // Position classes
  const positionClasses = {
    'bottom-right': 'right-4 bottom-4',
    'bottom-left': 'left-4 bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-4',
  };

  // Don't render for non-authenticated users
  // Requirements: 6.7, 10.1, 17.2 - Journal features only for logged-in users
  if (!isAuthenticated) {
    return null;
  }

  // Don't render if journal modal is open
  if (isJournalOpen) {
    return null;
  }

  return (
    <div
      className={`fixed ${positionClasses[position]} z-40 ${className}`}
      role="region"
      aria-label="Quick journal access"
    >
      {/* Tooltip - only show on hover */}
      {isHovered && (
        <div 
          className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fade-in"
        >
          Open Journal
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </div>
      )}

      {/* Main Journal Button - Requirements: 10.1 */}
      <button
        ref={buttonRef}
        onClick={handleOpenJournal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl button-interactive focus-ring"
        aria-label="Open journal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingJournalBar;
