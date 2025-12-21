import React, { useState, useCallback, useEffect, useRef } from 'react';
import { kickService, generateSessionId } from '../services/kickService';
import type { KickEvent } from '../types/kick';
import { BabyKickIcon } from './icons/BabyKickIcon';

/**
 * KickCounter component for logging baby kicks during learning sessions
 * 
 * Requirements:
 * - 6.1: Display "Log Kick" button for logged-in users
 * - 6.3: Provide haptic feedback (on supported devices) when a kick is logged
 * - 6.4: Display running count of kicks during current session
 * - 6.5: Animate the kick button briefly when tapped for visual feedback
 */

interface KickCounterProps {
  /** Story ID for associating kicks */
  storyId: number;
  /** Section name within the story */
  sectionName: string;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Profile ID for the current user */
  profileId?: string;
  /** Custom class name */
  className?: string;
  /** Compact mode for focus mode bottom bar */
  compact?: boolean;
}



/**
 * Trigger haptic feedback if available
 * Requirements: 6.3
 */
function triggerHapticFeedback(): void {
  // Check for Vibration API support
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Short 50ms vibration
  }
}

export const KickCounter: React.FC<KickCounterProps> = ({
  storyId,
  sectionName,
  isAuthenticated,
  profileId,
  className = '',
  compact = false,
}) => {
  // Session ID persists for the component's lifetime
  const sessionIdRef = useRef<string>(generateSessionId());
  
  // State for session kick count and animation
  const [sessionKicks, setSessionKicks] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [recentKick, setRecentKick] = useState<KickEvent | null>(null);

  // Load existing session kicks on mount
  useEffect(() => {
    if (isAuthenticated && profileId) {
      const count = kickService.getSessionKickCount(profileId, sessionIdRef.current);
      setSessionKicks(count);
    }
  }, [isAuthenticated, profileId]);

  /**
   * Handle kick button click
   * Requirements: 6.2, 6.3, 6.4, 6.5
   */
  const handleLogKick = useCallback(() => {
    if (!isAuthenticated || !profileId) {
      return;
    }

    try {
      // Log the kick event
      const kick = kickService.logKick(
        profileId,
        storyId,
        sectionName,
        sessionIdRef.current
      );

      // Update session count (Property 9: Session kick counter accuracy)
      setSessionKicks(prev => prev + 1);
      setRecentKick(kick);

      // Trigger haptic feedback (Requirements: 6.3)
      triggerHapticFeedback();

      // Trigger animation (Requirements: 6.5)
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);

    } catch (error) {
      console.error('Failed to log kick:', error);
    }
  }, [isAuthenticated, profileId, storyId, sectionName]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Compact mode for focus mode bottom bar
  if (compact) {
    return (
      <div 
        className={`flex items-center gap-1.5 ${className}`}
        role="region"
        aria-label="Kick counter"
      >
        <button
          onClick={handleLogKick}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
            bg-gradient-to-r from-pink-400 to-rose-400
            hover:from-pink-500 hover:to-rose-500
            text-white icon-interactive
            ${isAnimating ? 'scale-110' : 'scale-100'}
          `}
          aria-label={`Log baby kick. ${sessionKicks} kicks logged this session.`}
          disabled={!profileId}
          title="Log a baby kick"
        >
          <BabyKickIcon 
            className={`w-3.5 h-3.5 ${isAnimating ? 'animate-bounce' : ''}`} 
          />
          <span>Kick</span>
          {sessionKicks > 0 && (
            <span className="ml-0.5 px-1 py-0.5 rounded bg-white/20 text-[10px]">
              {sessionKicks}
            </span>
          )}
        </button>
        {/* Recent kick indicator (brief flash) */}
        {recentKick && isAnimating && (
          <span className="text-pink-400 text-xs" aria-hidden="true">💕</span>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center gap-3 ${className}`}
      role="region"
      aria-label="Kick counter"
    >
      {/* Log Kick Button - Requirements: 6.1, 6.5 */}
      <button
        onClick={handleLogKick}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium
          bg-gradient-to-r from-pink-400 to-rose-400
          hover:from-pink-500 hover:to-rose-500
          text-white shadow-md hover:shadow-lg
          transition-all duration-200
          ${isAnimating ? 'scale-110 ring-4 ring-pink-300/50' : 'scale-100'}
        `}
        aria-label={`Log baby kick. ${sessionKicks} kicks logged this session.`}
        disabled={!profileId}
      >
        <BabyKickIcon 
          className={`w-5 h-5 ${isAnimating ? 'animate-bounce' : ''}`} 
        />
        <span>Log Kick</span>
      </button>

      {/* Session Kick Count - Requirements: 6.4 */}
      {sessionKicks > 0 && (
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100 text-pink-700"
          aria-live="polite"
        >
          <span className="text-lg font-bold">{sessionKicks}</span>
          <span className="text-sm">
            {sessionKicks === 1 ? 'kick' : 'kicks'}
          </span>
        </div>
      )}

      {/* Recent kick indicator (brief flash) */}
      {recentKick && isAnimating && (
        <span 
          className="text-pink-500 text-sm animate-pulse"
          aria-hidden="true"
        >
          +1 💕
        </span>
      )}
    </div>
  );
};

export default KickCounter;
