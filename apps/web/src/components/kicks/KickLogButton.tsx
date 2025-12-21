import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useKick } from '../../contexts/KickContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';
import { Heart } from 'lucide-react';

/**
 * KickLogButton component - Quick tap button to log baby kicks
 * 
 * Requirements:
 * - 13.2: Allow users to log kicks directly from the journal interface
 * - 13.4: Provide a quick-add kick button in the floating journal bar
 * - 13.6: Allow users to add notes to individual kick events
 */

export interface KickLogButtonProps {
  /** Size variant of the button */
  size?: 'small' | 'medium' | 'large';
  /** Whether to show the kick count badge */
  showCount?: boolean;
  /** Whether to show the note input option */
  showNoteInput?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when a kick is logged */
  onKickLogged?: () => void;
  /** Whether to show in compact mode */
  compact?: boolean;
}

/**
 * Baby kick icon SVG
 */
const BabyKickIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

/**
 * Trigger haptic feedback if available
 * Requirements: 13.4 - Provide feedback when kick is logged
 */
function triggerHapticFeedback(): void {
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}

/**
 * KickLogButton - A button component for quickly logging baby kicks
 * 
 * Requirements:
 * - 13.2: Allow users to log kicks directly
 * - 13.4: Quick-add kick button with feedback
 * - 13.6: Allow users to add notes to individual kick events
 */
export const KickLogButton: React.FC<KickLogButtonProps> = ({
  size = 'medium',
  showCount = true,
  showNoteInput = false,
  className = '',
  onKickLogged,
  compact = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  const { todayKicks, logKick, error, clearError } = useKick();

  // Local state
  const [isAnimating, setIsAnimating] = useState(false);
  const [showNotePopup, setShowNotePopup] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Refs
  const noteInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Focus note input when popup opens
  useEffect(() => {
    if (showNotePopup && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNotePopup]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowNotePopup(false);
        setNoteText('');
      }
    };

    if (showNotePopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showNotePopup]);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNotePopup(false);
        setNoteText('');
      }
    };

    if (showNotePopup) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showNotePopup]);

  /**
   * Handle logging a kick
   * Requirements: 13.2, 13.4, 13.6
   */
  const handleLogKick = useCallback(async (note?: string) => {
    if (!isAuthenticated || !activeProfile || isLogging) return;

    setIsLogging(true);
    clearError();

    try {
      await logKick(note || undefined);

      // Trigger haptic feedback
      triggerHapticFeedback();

      // Trigger visual animation
      setIsAnimating(true);
      setShowSuccess(true);
      setTimeout(() => {
        setIsAnimating(false);
        setShowSuccess(false);
      }, 500);

      // Clear note and close popup
      setNoteText('');
      setShowNotePopup(false);

      // Call callback if provided
      onKickLogged?.();
    } catch (err) {
      console.error('Failed to log kick:', err);
    } finally {
      setIsLogging(false);
    }
  }, [isAuthenticated, activeProfile, isLogging, logKick, clearError, onKickLogged]);

  /**
   * Handle quick kick (no note)
   */
  const handleQuickKick = useCallback(() => {
    if (showNoteInput) {
      setShowNotePopup(true);
    } else {
      handleLogKick();
    }
  }, [showNoteInput, handleLogKick]);

  /**
   * Handle submitting kick with note
   */
  const handleSubmitWithNote = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleLogKick(noteText.trim() || undefined);
  }, [handleLogKick, noteText]);

  /**
   * Handle quick submit without note from popup
   */
  const handleQuickSubmit = useCallback(() => {
    handleLogKick();
  }, [handleLogKick]);

  // Don't render if not authenticated or no active profile
  if (!isAuthenticated || !activeProfile) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    small: {
      button: 'px-2 py-1 text-xs gap-1',
      icon: 'w-3.5 h-3.5',
      badge: 'text-[10px] px-1 py-0.5',
    },
    medium: {
      button: 'px-3 py-2 text-sm gap-1.5',
      icon: 'w-4 h-4',
      badge: 'text-xs px-1.5 py-0.5',
    },
    large: {
      button: 'px-4 py-2.5 text-base gap-2',
      icon: 'w-5 h-5',
      badge: 'text-sm px-2 py-1',
    },
  };

  const currentSize = sizeClasses[size];

  // Compact mode rendering
  if (compact) {
    return (
      <div className={`relative inline-flex ${className}`}>
        <button
          onClick={handleQuickKick}
          disabled={isLogging}
          className={`
            flex items-center ${currentSize.button} rounded-lg font-medium
            bg-gradient-to-r from-pink-400 to-rose-400
            hover:from-pink-500 hover:to-rose-500
            disabled:opacity-50 disabled:cursor-not-allowed
            text-white icon-interactive
            ${isAnimating ? 'scale-110' : 'scale-100'}
            focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
          `}
          aria-label={`Log baby kick. ${todayKicks} kicks today.`}
          title="Log a baby kick"
        >
          <BabyKickIcon 
            className={`${currentSize.icon} ${isAnimating ? 'animate-bounce' : ''}`} 
          />
          <span>Kick</span>
          {showCount && todayKicks > 0 && (
            <span className={`${currentSize.badge} rounded-full bg-white/20`}>
              {todayKicks}
            </span>
          )}
        </button>

        {/* Success indicator */}
        {showSuccess && (
          <span 
            className="absolute -top-1 -right-1 text-pink-400 animate-ping"
            aria-hidden="true"
          >
            💕
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex ${className}`} ref={popupRef}>
      {/* Note Input Popup */}
      {showNotePopup && (
        <div 
          className="absolute bottom-full mb-2 left-0 right-0 min-w-[250px] bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-pop-in z-50"
          role="dialog"
          aria-label="Add note to kick"
        >
          <form onSubmit={handleSubmitWithNote}>
            <p className="text-xs font-medium text-gray-500 mb-2">
              Add a note (optional)
            </p>
            <input
              ref={noteInputRef}
              type="text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g., Strong kick during story time"
              maxLength={500}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              aria-label="Kick note"
            />
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={handleQuickSubmit}
                disabled={isLogging}
                className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                Skip Note
              </button>
              <button
                type="submit"
                disabled={isLogging}
                className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLogging ? 'Logging...' : 'Log Kick'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Kick Button */}
      <button
        onClick={handleQuickKick}
        disabled={isLogging}
        className={`
          flex items-center ${currentSize.button} rounded-xl font-medium
          bg-gradient-to-r from-pink-400 to-rose-400
          hover:from-pink-500 hover:to-rose-500
          disabled:opacity-50 disabled:cursor-not-allowed
          text-white shadow-md hover:shadow-lg
          transition-all duration-200
          ${isAnimating ? 'scale-110 ring-4 ring-pink-300/50' : 'scale-100'}
          focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
        `}
        aria-label={`Log baby kick. ${todayKicks} kicks today.`}
        aria-expanded={showNotePopup}
      >
        <BabyKickIcon 
          className={`${currentSize.icon} ${isAnimating ? 'animate-bounce' : ''}`} 
        />
        <span>{showNoteInput ? 'Log Kick' : 'Kick'}</span>
        {showCount && todayKicks > 0 && (
          <span className={`${currentSize.badge} rounded-full bg-white/20`}>
            {todayKicks}
          </span>
        )}
      </button>

      {/* Success indicator */}
      {showSuccess && (
        <span 
          className="absolute -top-2 -right-2 text-pink-500 animate-pulse flex items-center gap-0.5 text-xs font-bold"
          aria-hidden="true"
        >
          +1 <Heart className="w-3 h-3 fill-current" />
        </span>
      )}

      {/* Error display */}
      {error && (
        <div 
          className="absolute top-full mt-2 left-0 right-0 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default KickLogButton;
