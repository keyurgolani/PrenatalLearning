import React from 'react';
import type { Trimester } from '../types';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Trimester badge configuration with colors and labels
 * Requirements: 1.4 - Display trimester badge with trimester-specific colors
 */
const trimesterConfig: Record<Trimester, { 
  label: string; 
  fullLabel: string;
  lightClass: string; 
  darkStyle: React.CSSProperties 
}> = {
  first: {
    label: '1st Tri',
    fullLabel: 'First Trimester',
    lightClass: 'bg-pink-100 text-pink-700',
    darkStyle: { backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#F472B6' },
  },
  second: {
    label: '2nd Tri',
    fullLabel: 'Second Trimester',
    lightClass: 'bg-purple-100 text-purple-700',
    darkStyle: { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' },
  },
  third: {
    label: '3rd Tri',
    fullLabel: 'Third Trimester',
    lightClass: 'bg-indigo-100 text-indigo-700',
    darkStyle: { backgroundColor: 'rgba(99, 102, 241, 0.2)', color: '#A5B4FC' },
  },
  any: {
    label: 'All Tri',
    fullLabel: 'All Trimesters',
    lightClass: 'bg-teal-100 text-teal-700',
    darkStyle: { backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#5EEAD4' },
  },
};

interface TrimesterBadgeProps {
  trimester: Trimester;
  showIcon?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * TrimesterBadge component for displaying recommended trimester
 * 
 * Requirements:
 * - 1.4: THE System SHALL display a trimester badge on story cards indicating the recommended trimester
 */
export const TrimesterBadge: React.FC<TrimesterBadgeProps> = ({ 
  trimester, 
  showIcon = true,
  size = 'sm',
  className = '',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const config = trimesterConfig[trimester];
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };
  
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${isDark ? '' : config.lightClass} ${className}`}
      style={isDark ? config.darkStyle : {}}
      title={`Recommended for ${config.fullLabel.toLowerCase()}`}
      data-testid="trimester-badge"
    >
      {showIcon && (
        <svg
          className={`${iconSizes[size]} mr-1`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )}
      {config.label}
    </span>
  );
};

export default TrimesterBadge;
