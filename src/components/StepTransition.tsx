import React, { useState, useEffect, useRef } from 'react';

/**
 * StepTransition component - Provides smooth animated transitions between step content
 * Uses opacity-only animation to avoid breaking fixed/sticky positioning of child elements
 * (transform creates a new stacking context which breaks position:fixed)
 */

interface StepTransitionProps {
  /** Unique key to identify when content changes (e.g., step name) */
  stepKey: string;
  /** Content to render */
  children: React.ReactNode;
  /** Optional custom duration in ms (default: 300) */
  duration?: number;
  /** Optional className for the wrapper */
  className?: string;
}

export const StepTransition: React.FC<StepTransitionProps> = ({
  stepKey,
  children,
  duration = 300,
  className = '',
}) => {
  const [displayedContent, setDisplayedContent] = useState(children);
  const [displayedKey, setDisplayedKey] = useState(stepKey);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // If the key changed, start the transition
    if (stepKey !== displayedKey) {
      // Clear any pending timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsTransitioning(true);
      setPhase('exit');

      // After exit animation, swap content and start enter animation
      timeoutRef.current = setTimeout(() => {
        setDisplayedContent(children);
        setDisplayedKey(stepKey);
        setPhase('enter');

        // After enter animation, return to idle
        timeoutRef.current = setTimeout(() => {
          setPhase('idle');
          setIsTransitioning(false);
        }, duration);
      }, duration / 2); // Exit is faster than enter for snappier feel
    } else {
      // Key is the same, just update content without animation
      setDisplayedContent(children);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [stepKey, children, displayedKey, duration]);

  const getOpacity = (): number => {
    switch (phase) {
      case 'exit':
        return 0;
      case 'enter':
        return 1;
      default:
        return 1;
    }
  };

  const baseDuration = duration / 2;

  return (
    <div
      className={`step-transition-wrapper ${className}`}
      style={{
        opacity: getOpacity(),
        transition: `opacity ${baseDuration}ms ease-out`,
      }}
      aria-live={isTransitioning ? 'polite' : 'off'}
    >
      {displayedContent}
    </div>
  );
};

export default StepTransition;
