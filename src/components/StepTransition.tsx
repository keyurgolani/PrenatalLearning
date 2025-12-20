import React, { useState, useEffect, useRef } from 'react';

/**
 * StepTransition component - Provides smooth animated transitions between step content
 * Features cute, polished animations that match the app's warm, friendly aesthetic
 */

interface StepTransitionProps {
  /** Unique key to identify when content changes (e.g., step name) */
  stepKey: string;
  /** Content to render */
  children: React.ReactNode;
  /** Optional custom duration in ms (default: 450) */
  duration?: number;
  /** Optional className for the wrapper */
  className?: string;
}

export const StepTransition: React.FC<StepTransitionProps> = ({
  stepKey,
  children,
  duration = 450,
  className = '',
}) => {
  const [displayedContent, setDisplayedContent] = useState(children);
  const [displayedKey, setDisplayedKey] = useState(stepKey);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');
  const timeoutRef1 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeoutRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingChildrenRef = useRef<React.ReactNode>(children);

  // Always keep track of latest children
  pendingChildrenRef.current = children;

  // Handle step key changes - trigger animation
  useEffect(() => {
    if (stepKey !== displayedKey) {
      // Clear any pending timeouts
      if (timeoutRef1.current) clearTimeout(timeoutRef1.current);
      if (timeoutRef2.current) clearTimeout(timeoutRef2.current);

      // Start exit animation
      setPhase('exit');

      const exitDuration = duration * 0.35;
      const enterDuration = duration * 0.65;

      // After exit, swap content and enter
      timeoutRef1.current = setTimeout(() => {
        setDisplayedContent(pendingChildrenRef.current);
        setDisplayedKey(stepKey);
        setPhase('enter');

        // After enter, go idle
        timeoutRef2.current = setTimeout(() => {
          setPhase('idle');
        }, enterDuration);
      }, exitDuration);
    }

    return () => {
      if (timeoutRef1.current) clearTimeout(timeoutRef1.current);
      if (timeoutRef2.current) clearTimeout(timeoutRef2.current);
    };
  }, [stepKey, displayedKey, duration]);

  // Update content without animation when key hasn't changed
  useEffect(() => {
    if (stepKey === displayedKey && phase === 'idle') {
      setDisplayedContent(children);
    }
  }, [children, stepKey, displayedKey, phase]);

  const exitDuration = Math.round(duration * 0.35);
  const enterDuration = Math.round(duration * 0.65);

  return (
    <>
      <style>{`
        .step-transition-wrapper {
          will-change: opacity, transform;
        }
        
        .step-idle {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        
        .step-exit {
          animation: step-fade-out ${exitDuration}ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }
        
        .step-enter {
          animation: step-fade-in ${enterDuration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        
        @keyframes step-fade-out {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-16px) scale(0.97);
          }
        }
        
        @keyframes step-fade-in {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          50% {
            opacity: 0.8;
          }
          75% {
            transform: translateY(-4px) scale(1.01);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .step-exit,
          .step-enter {
            animation: none;
          }
          .step-exit {
            opacity: 0;
            transition: opacity 150ms ease-out;
          }
          .step-enter {
            opacity: 1;
            transition: opacity 200ms ease-in;
          }
        }
      `}</style>
      <div
        className={`step-transition-wrapper step-${phase} ${className}`}
        aria-live={phase !== 'idle' ? 'polite' : 'off'}
        aria-busy={phase !== 'idle'}
      >
        {displayedContent}
      </div>
    </>
  );
};

export default StepTransition;
