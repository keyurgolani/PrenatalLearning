import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

type ViewMode = 'explore' | 'journey';

interface ViewModeToggleProps {
  variant?: 'default' | 'header';
}

/**
 * ViewModeToggle component for switching between Explore and Journey modes
 * Uses route-based navigation
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ variant = 'default' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const isHeader = variant === 'header';
  
  // Determine current mode from path
  // Returns null when on a topic page or other non-view pages
  const currentMode: ViewMode | null = location.pathname.startsWith('/explore') 
    ? 'explore' 
    : location.pathname.startsWith('/journey') || location.pathname === '/'
      ? 'journey'
      : null;

  const modes: { value: ViewMode; path: string; label: string; icon: React.ReactNode }[] = [
    {
      value: 'journey',
      path: '/journey',
      label: 'Learning Journeys',
      icon: (
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
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      ),
    },
    {
      value: 'explore',
      path: '/explore',
      label: 'Explore All Topics',
      icon: (
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
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
  ];

  // Header variant styles (white/transparent for gradient header)
  const headerContainerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const headerActiveStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#7c3aed',
  };

  const headerInactiveStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
  };

  // Default variant styles
  const defaultContainerStyle = {
    backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
  };

  const defaultActiveStyle = {
    backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
    color: isDark ? currentTheme.colors.primary : '#7c3aed',
  };

  const defaultInactiveStyle = {
    color: isDark ? currentTheme.colors.textMuted : '#4b5563',
  };

  // Show divider between buttons when no view is selected (e.g., on topic pages)
  const showDivider = currentMode === null;

  return (
    <div
      className="inline-flex items-center rounded-xl p-1 flex-shrink-0"
      style={isHeader ? headerContainerStyle : defaultContainerStyle}
      role="tablist"
      aria-label="View mode selection"
    >
      {modes.map(({ value, path, label, icon }, index) => {
        const isActive = currentMode === value;
        return (
          <React.Fragment key={value}>
            {/* Divider between buttons when no view is selected */}
            {showDivider && index > 0 && (
              <div 
                className="w-px h-6 mx-1"
                style={{ 
                  backgroundColor: isHeader 
                    ? 'rgba(255, 255, 255, 0.3)' 
                    : isDark 
                      ? currentTheme.colors.border 
                      : '#d1d5db' 
                }}
                aria-hidden="true"
              />
            )}
            <button
              onClick={() => navigate(path)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium button-interactive ${isHeader ? 'focus-ring-light' : 'focus-ring'}
                ${isActive ? 'shadow-sm' : ''}
              `}
              style={
                isActive
                  ? (isHeader ? headerActiveStyle : defaultActiveStyle)
                  : (isHeader ? headerInactiveStyle : defaultInactiveStyle)
              }
              role="tab"
              aria-selected={isActive}
              aria-controls={`${value}-panel`}
              aria-label={`Go to ${label}`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;
