import React from "react";

/**
 * BabyKickIcon - Standard icon for baby kick related elements
 *
 * Used across the application for uniformity in "baby kick" representation.
 */
export const BabyKickIcon: React.FC<{ className?: string }> = ({
  className,
}) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Heart Swirl Outline */}
    <path
      d="M12 21.5C6 16.5 2 13 2 9.5C2 6 4.5 3.5 8 3.5C10.5 3.5 12 5 12 5C12 5 13.5 3.5 16 3.5C19.5 3.5 22 6 22 9.5C22 13 18 16.5 12 21.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Left Footprint (Maximized) */}
    <path
      d="M8.5 11C7.5 11 6.5 11.8 6.5 13.5C6.5 15.5 8.5 17.5 9.5 18.5C10.5 19.5 11.5 19 12.5 17C13.2 15.5 11.5 12 9.5 11.5"
      fill="currentColor"
      stroke="none"
    />
    <circle cx="7" cy="9.5" r="1.1" fill="currentColor" />
    <circle cx="8.8" cy="9.0" r="1.1" fill="currentColor" />
    <circle cx="10.5" cy="9.5" r="1.1" fill="currentColor" />

    {/* Right Footprint (Maximized) */}
    <path
      d="M15.5 11C16.5 11 17.5 11.8 17.5 13.5C17.5 15.5 15.5 17.5 14.5 18.5C13.5 19.5 12.5 19 11.5 17C10.8 15.5 12.5 12 14.5 11.5"
      fill="currentColor"
      stroke="none"
    />
    <circle cx="17" cy="9.5" r="1.1" fill="currentColor" />
    <circle cx="15.2" cy="9.0" r="1.1" fill="currentColor" />
    <circle cx="13.5" cy="9.5" r="1.1" fill="currentColor" />
  </svg>
);

export default BabyKickIcon;
