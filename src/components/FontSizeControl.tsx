import React from 'react';
import { useAccessibility, fontSizeOptions, fontSizeLabels, type FontSize } from '../contexts';

/**
 * FontSizeControl component
 * Provides 5 size options (XS, S, M, L, XL) for accessibility
 * Requirements: 7.1 - Provide font size controls accessible from the reading view
 * Requirements: 7.2 - Support at least 5 font size levels (XS, S, M, L, XL)
 * Requirements: 7.3 - Apply font size changes immediately without page reload
 */
export interface FontSizeControlProps {
  /** Optional className for styling */
  className?: string;
  /** Whether to show labels or just icons */
  showLabels?: boolean;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

/**
 * Short labels for compact display
 */
const shortLabels: Record<FontSize, string> = {
  xs: 'XS',
  sm: 'S',
  md: 'M',
  lg: 'L',
  xl: 'XL',
};

export function FontSizeControl({ 
  className = '', 
  showLabels = false,
  compact = false 
}: FontSizeControlProps): React.ReactElement {
  const { settings, setFontSize } = useAccessibility();
  const currentSize = settings.fontSize;

  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Font size controls"
    >
      {!compact && (
        <span className="text-sm text-gray-600 mr-2 flex items-center gap-1">
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
              d="M4 6h16M4 12h16m-7 6h7" 
            />
          </svg>
          <span className="sr-only">Font Size:</span>
        </span>
      )}
      
      <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
        {fontSizeOptions.map((size) => {
          const isActive = currentSize === size;
          const label = showLabels ? fontSizeLabels[size] : shortLabels[size];
          
          return (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`
                px-2 py-1.5 text-xs font-medium rounded-md transition-all
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1
                ${isActive 
                  ? 'bg-purple-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-200'
                }
              `}
              aria-label={`Set font size to ${fontSizeLabels[size]}`}
              aria-pressed={isActive}
              title={fontSizeLabels[size]}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Dropdown variant of FontSizeControl for space-constrained areas
 */
export function FontSizeDropdown({ className = '' }: { className?: string }): React.ReactElement {
  const { settings, setFontSize } = useAccessibility();
  const currentSize = settings.fontSize;

  return (
    <div className={`relative ${className}`}>
      <label htmlFor="font-size-select" className="sr-only">
        Font Size
      </label>
      <select
        id="font-size-select"
        value={currentSize}
        onChange={(e) => setFontSize(e.target.value as FontSize)}
        className="
          appearance-none bg-gray-100 border border-gray-200 rounded-lg
          px-3 py-2 pr-8 text-sm font-medium text-gray-700
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
          cursor-pointer min-h-[44px]
        "
        aria-label="Select font size"
      >
        {fontSizeOptions.map((size) => (
          <option key={size} value={size}>
            {fontSizeLabels[size]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg 
          className="w-4 h-4 text-gray-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default FontSizeControl;
