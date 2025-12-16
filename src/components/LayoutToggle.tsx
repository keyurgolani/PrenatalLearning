import React from 'react';
import { useLayout, type LayoutMode } from '../contexts/LayoutContext';

/**
 * LayoutToggle component for switching between grid and list layouts
 * Requirements: 3.2 - Display topics in single-column list format when list selected
 * Requirements: 3.3 - Display topics in multi-column grid format when grid selected
 */
export const LayoutToggle: React.FC = () => {
  const { layout, setLayout } = useLayout();

  const layouts: { value: LayoutMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'grid',
      label: 'Grid view',
      icon: (
        <svg
          className="w-5 h-5"
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
    {
      value: 'list',
      label: 'List view',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="inline-flex rounded-lg bg-gray-100 p-1"
      role="group"
      aria-label="Layout selection"
    >
      {layouts.map(({ value, label, icon }) => {
        const isActive = layout === value;
        return (
          <button
            key={value}
            onClick={() => setLayout(value)}
            className={`
              p-2 rounded-md transition-all duration-200
              ${isActive
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            aria-label={label}
            aria-pressed={isActive}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
};

export default LayoutToggle;
