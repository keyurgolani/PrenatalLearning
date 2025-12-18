import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useReadingMode, type ScrollSpeed, scrollSpeedPx, scrollSpeedLabels } from '../contexts/ReadingModeContext';
import { useTheme } from '../contexts';

/**
 * AutoScroll component - Provides automatic scrolling at configurable speeds
 * Requirements: 10.1 - Provide an auto-scroll toggle in the reading view
 * Requirements: 10.2 - Allow users to select scroll speed (slow, medium, fast)
 * Requirements: 10.3 - Smoothly scroll content at the selected pace
 * Requirements: 10.4 - Pause auto-scroll when user interacts with the page
 * Requirements: 10.5 - Provide play/pause controls for auto-scroll
 * Requirements: 10.6 - Stop auto-scroll when reaching the end of a section
 */

export interface AutoScrollProps {
  /** Reference to the scrollable container element */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Callback when auto-scroll is paused due to user interaction */
  onPause?: () => void;
  /** Callback when auto-scroll reaches the end */
  onEnd?: () => void;
  /** Optional className for the controls container */
  className?: string;
}

/**
 * AutoScroll component that provides smooth automatic scrolling
 * with configurable speed and play/pause controls
 */
export const AutoScroll: React.FC<AutoScrollProps> = ({
  containerRef,
  onPause,
  onEnd,
  className = '',
}) => {
  const { settings, toggleAutoScroll, setAutoScrollSpeed, pauseAutoScroll } = useReadingMode();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const speedMenuRef = useRef<HTMLDivElement>(null);

  const { autoScrollEnabled, autoScrollSpeed } = settings;

  // Use refs to store the latest values for use in the animation loop
  const autoScrollEnabledRef = useRef(autoScrollEnabled);
  const autoScrollSpeedRef = useRef(autoScrollSpeed);
  const pauseAutoScrollRef = useRef(pauseAutoScroll);
  const onEndRef = useRef(onEnd);

  // Keep refs in sync with props/state
  useEffect(() => {
    autoScrollEnabledRef.current = autoScrollEnabled;
  }, [autoScrollEnabled]);

  useEffect(() => {
    autoScrollSpeedRef.current = autoScrollSpeed;
  }, [autoScrollSpeed]);

  useEffect(() => {
    pauseAutoScrollRef.current = pauseAutoScroll;
  }, [pauseAutoScroll]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  /**
   * Check if scroll has reached the end of the container
   */
  const checkIfAtEnd = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    
    const { scrollTop, scrollHeight, clientHeight } = container;
    // Consider "at end" when within 5 pixels of the bottom
    return scrollTop + clientHeight >= scrollHeight - 5;
  }, [containerRef]);

  /**
   * Start/stop scrolling based on autoScrollEnabled state
   * Requirements: 10.3 - Smoothly scroll content at the selected pace
   */
  useEffect(() => {
    /**
     * Perform smooth scrolling animation
     */
    const scroll = (timestamp: number) => {
      if (!autoScrollEnabledRef.current) return;
      
      const container = containerRef.current;
      if (!container) return;

      // Calculate time delta
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Convert to seconds
      lastTimeRef.current = timestamp;

      // Calculate scroll amount based on speed (pixels per second)
      const pixelsPerSecond = scrollSpeedPx[autoScrollSpeedRef.current];
      const scrollAmount = pixelsPerSecond * deltaTime;

      // Check if we've reached the end
      // Requirements: 10.6 - Stop auto-scroll when reaching the end of a section
      if (checkIfAtEnd()) {
        setIsAtEnd(true);
        pauseAutoScrollRef.current();
        onEndRef.current?.();
        return;
      }

      // Perform the scroll
      container.scrollTop += scrollAmount;

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(scroll);
    };

    if (autoScrollEnabled) {
      // Use setTimeout to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => {
        setIsAtEnd(false);
      }, 0);
      lastTimeRef.current = 0;
      animationFrameRef.current = requestAnimationFrame(scroll);
      
      return () => {
        clearTimeout(timeoutId);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
  }, [autoScrollEnabled, containerRef, checkIfAtEnd]);

  /**
   * Handle user interaction to pause auto-scroll
   * Requirements: 10.4 - Pause auto-scroll when user interacts with the page
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !autoScrollEnabled) return;

    const handleUserInteraction = (event: Event) => {
      // Don't pause if clicking on the auto-scroll controls
      const target = event.target as HTMLElement;
      if (target.closest('[data-autoscroll-controls]')) {
        return;
      }
      
      pauseAutoScroll();
      onPause?.();
    };

    // Listen for user interactions that should pause auto-scroll
    container.addEventListener('wheel', handleUserInteraction, { passive: true });
    container.addEventListener('touchstart', handleUserInteraction, { passive: true });
    container.addEventListener('mousedown', handleUserInteraction);
    container.addEventListener('keydown', handleUserInteraction);

    return () => {
      container.removeEventListener('wheel', handleUserInteraction);
      container.removeEventListener('touchstart', handleUserInteraction);
      container.removeEventListener('mousedown', handleUserInteraction);
      container.removeEventListener('keydown', handleUserInteraction);
    };
  }, [containerRef, autoScrollEnabled, pauseAutoScroll, onPause]);

  /**
   * Reset isAtEnd when user scrolls away from the end
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isAtEnd) return;

    const handleScroll = () => {
      if (!checkIfAtEnd()) {
        setIsAtEnd(false);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [containerRef, isAtEnd, checkIfAtEnd]);

  /**
   * Close speed menu when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (speedMenuRef.current && !speedMenuRef.current.contains(event.target as Node)) {
        setShowSpeedMenu(false);
      }
    };

    if (showSpeedMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSpeedMenu]);

  /**
   * Handle speed selection
   */
  const handleSpeedSelect = (speed: ScrollSpeed) => {
    setAutoScrollSpeed(speed);
    setShowSpeedMenu(false);
  };


  const speedOptions: ScrollSpeed[] = ['slow', 'medium', 'fast'];

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      data-autoscroll-controls
    >
      {/* Play/Pause Toggle - Requirements: 10.5 */}
      <button
        onClick={toggleAutoScroll}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all focus-ring"
        style={{
          backgroundColor: autoScrollEnabled
            ? (isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)')
            : (isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.8)'),
          color: autoScrollEnabled
            ? '#22c55e'
            : (isDark ? currentTheme.colors.text : '#4b5563'),
          border: autoScrollEnabled
            ? '1px solid rgba(34, 197, 94, 0.3)'
            : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
        aria-label={autoScrollEnabled ? 'Pause auto-scroll' : 'Start auto-scroll'}
        aria-pressed={autoScrollEnabled}
        disabled={isAtEnd && !autoScrollEnabled}
      >
        {autoScrollEnabled ? (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        <span className="text-sm font-medium">
          {autoScrollEnabled ? 'Pause' : isAtEnd ? 'Ended' : 'Auto-scroll'}
        </span>
      </button>

      {/* Speed Selector - Requirements: 10.2 */}
      <div className="relative" ref={speedMenuRef}>
        <button
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="flex items-center gap-1 px-2 py-2 rounded-lg transition-all text-sm focus-ring"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.8)',
            color: isDark ? currentTheme.colors.text : '#4b5563',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
          aria-label={`Scroll speed: ${scrollSpeedLabels[autoScrollSpeed]}`}
          aria-haspopup="listbox"
          aria-expanded={showSpeedMenu}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>{scrollSpeedLabels[autoScrollSpeed]}</span>
          <svg
            className={`w-3 h-3 transition-transform ${showSpeedMenu ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Speed dropdown menu */}
        {showSpeedMenu && (
          <div
            className="absolute top-full left-0 mt-1 py-1 rounded-lg shadow-lg min-w-[100px]"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
              border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              zIndex: 9999,
            }}
            role="listbox"
            aria-label="Select scroll speed"
          >
            {speedOptions.map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedSelect(speed)}
                className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                style={{
                  color: autoScrollSpeed === speed
                    ? '#22c55e'
                    : (isDark ? currentTheme.colors.text : '#4b5563'),
                  backgroundColor: autoScrollSpeed === speed
                    ? (isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)')
                    : 'transparent',
                }}
                role="option"
                aria-selected={autoScrollSpeed === speed}
              >
                {scrollSpeedLabels[speed]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoScroll;
