import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
export interface DailySectionConfig {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
}

interface EnrichmentSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: DailySectionConfig[];
}

export const EnrichmentSidebar: React.FC<EnrichmentSidebarProps> = ({ 
  activeSection, 
  onSectionChange,
  sections
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  const containerStyle = {
    backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.9)',
  };

  const labelStyle = {
    color: isDark ? currentTheme.colors.text : '#374151',
  };

  const inactiveButtonStyle = {
    color: isDark ? currentTheme.colors.text : '#4b5563',
  };

  return (
    <nav 
      className="backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden" 
      style={containerStyle}
      aria-label="Enrichment activities"
    >
      <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
        <h3 
          className="text-xs font-semibold mb-2 flex items-center gap-1.5"
          style={labelStyle}
        >
          <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Activities
        </h3>
        <div className="space-y-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const IconComponent = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-start gap-3 animate-gentle-bounce animate-click group ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'hover:bg-gray-100' // Placeholder for hover, theme handled below
                }`}
                style={!isActive ? { 
                   ...inactiveButtonStyle,
                   backgroundColor: 'transparent' // Hover handled by CSS classes or could add explicit hover logic if needed, but class usually sufficient for light mode
                } : undefined}
                aria-pressed={isActive}
              >
                 <div 
                  className={`p-1 rounded-lg mt-0.5 transition-colors ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500' 
                  }`}
                  style={!isActive ? {
                      backgroundColor: isDark ? `${currentTheme.colors.text}10` : '#f3f4f6',
                      color: isDark ? currentTheme.colors.textMuted : '#6b7280'
                  } : undefined}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div>
                  <span className={`block text-sm font-medium ${isActive ? 'text-white' : ''} ${!isActive && isDark ? 'text-gray-200' : ''}`}>
                      {section.label}
                  </span>
                  <span 
                    className={`text-xs block mt-0.5 ${
                        isActive ? 'text-purple-100' : 'text-gray-500'
                    }`}
                    style={!isActive ? {
                        color: isDark ? currentTheme.colors.textMuted : '#6b7280'
                    } : undefined}
                  >
                    {section.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
