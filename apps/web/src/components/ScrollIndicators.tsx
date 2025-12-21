/**
 * ScrollIndicators Component
 * 
 * Displays floating circular buttons with chevrons at top/bottom of scrollable containers.
 * Automatically shows/hides based on scroll position.
 * 
 * Usage:
 * <div ref={scrollRef} className="overflow-y-auto">
 *   <ScrollIndicators containerRef={scrollRef} />
 *   <!-- scrollable content -->
 * </div>
 */

import React, { useState, useEffect, useCallback } from 'react';

interface ScrollIndicatorsProps {
  /** Ref to the scrollable container */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Optional additional className */
  className?: string;
  /** Offset from edges in pixels (default: 16) */
  offset?: number;
  /** Scroll amount in pixels when clicking indicator (default: 200) */
  scrollAmount?: number;
}

export const ScrollIndicators: React.FC<ScrollIndicatorsProps> = ({
  containerRef,
  className = '',
  offset = 16,
  scrollAmount = 200,
}) => {
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);

  // Check scroll position and update indicator visibility
  const checkScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // Show top indicator if scrolled down from top (with small threshold)
    setShowTopIndicator(scrollTop > 10);
    
    // Show bottom indicator if not at bottom (with small threshold)
    // Use a slighly larger threshold to avoid flickering on sub-pixel rendering
    setShowBottomIndicator(scrollTop + clientHeight < scrollHeight - 10);
  }, [containerRef]);

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check (delay slightly to allow layout to settle)
    const timeoutId = setTimeout(checkScrollPosition, 100);

    // Add scroll listener
    container.addEventListener('scroll', checkScrollPosition);
    
    // Also check on resize (content height might change)
    const resizeObserver = new ResizeObserver(checkScrollPosition);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [containerRef, checkScrollPosition]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      top: -scrollAmount,
      behavior: 'smooth',
    });
  }, [containerRef, scrollAmount]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      top: scrollAmount,
      behavior: 'smooth',
    });
  }, [containerRef, scrollAmount]);

  return (
    <>
      {/* Top Indicator */}
      <button
        onClick={scrollToTop}
        className={`
          absolute z-10 left-1/2 -translate-x-1/2
          w-10 h-10 rounded-full
          bg-white/90 backdrop-blur-sm
          shadow-lg hover:shadow-xl
          border border-gray-200
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:bg-purple-50
          ${showTopIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
          ${className}
        `}
        style={{ top: `${offset}px` }}
        aria-label="Scroll up"
      >
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Bottom Indicator */}
      <button
        onClick={scrollToBottom}
        className={`
          absolute z-10 left-1/2 -translate-x-1/2
          w-10 h-10 rounded-full
          bg-white/90 backdrop-blur-sm
          shadow-lg hover:shadow-xl
          border border-gray-200
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:bg-purple-50
          ${showBottomIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}
          ${className}
        `}
        style={{ bottom: `${offset}px` }}
        aria-label="Scroll down"
      >
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </>
  );
};

export default ScrollIndicators;
