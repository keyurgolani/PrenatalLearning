import { useState } from 'react';
import type { TouchEvent } from 'react';

interface SwipeInput {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOutput {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
}

const minSwipeDistance = 50; 

export const useSwipe = (input: SwipeInput): SwipeOutput => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchYStart, setTouchYStart] = useState<number | null>(null);
  const [touchYEnd, setTouchYEnd] = useState<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setTouchYStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchYEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distanceX = touchStart - touchEnd;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;
    
    // Check vertical distance to ensure it's not a scroll
    if (touchYStart && touchYEnd) {
        const distanceY = Math.abs(touchYStart - touchYEnd);
        // Relaxed check: allow vertical movement up to 1.5x the horizontal distance to support natural diagonal swipes
        if (distanceY > Math.abs(distanceX) * 1.5) return; 
    }

    if (isLeftSwipe && input.onSwipeLeft) {
      console.log('[useSwipe] Swiped Left');
      input.onSwipeLeft();
    }
    
    if (isRightSwipe && input.onSwipeRight) {
      console.log('[useSwipe] Swiped Right');
      input.onSwipeRight();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
