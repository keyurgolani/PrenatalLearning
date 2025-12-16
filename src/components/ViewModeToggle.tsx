import React from 'react';
import { useViewMode, type ViewMode } from '../contexts/ViewModeContext';

/**
 * ViewModeToggle component for switching between Explore and Learning Path modes
 * Requirements: 2.1 - Display Explore Mode as default
 * Requirements: 2.2 - Display searchable and filterable topic grid in Explore Mode
 * Requirements: 2.3 - Display topics in sequential order in Learning Path Mode
 */
export const ViewModeToggle: React.FC = () => {
  const { viewMode, setViewMode } = useViewMode();

  const modes: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'learning-path',
      label: 'Learning Path',
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      value: 'explore',
      label: 'Explore',
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="inline-flex rounded-lg bg-gray-100 p-1"
      role="tablist"
      aria-label="View mode selection"
    >
      {modes.map(({ value, label, icon }) => {
        const isActive = viewMode === value;
        return (
          <button
            key={value}
            onClick={() => setViewMode(value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            role="tab"
            aria-selected={isActive}
            aria-controls={`${value}-panel`}
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;
