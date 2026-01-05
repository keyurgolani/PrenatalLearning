import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export interface DailySectionConfig {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  path?: string;
}

interface EnrichmentSidebarProps {
  sections: DailySectionConfig[];
  // Props below are deprecated but kept for compatibility if needed, though unused
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export const EnrichmentSidebar: React.FC<EnrichmentSidebarProps> = ({ 
  sections
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;

  return (
    <nav className="space-y-2">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.colors.text }}>
          Daily Enrichment
        </h3>
        <p className="text-sm" style={{ color: currentTheme.colors.textMuted }}>
          Activities to stimulate your mind and bond with baby.
        </p>
      </div>

      <div className="space-y-1">
        {sections.map((section) => {
          const IconComponent = section.icon;
          const path = section.path || 'mix';
          
          return (
            <NavLink
              key={section.id}
              to={path}
              className={({ isActive }) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive ? 'shadow-sm translate-x-1' : 'hover:translate-x-1'
              }`}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? currentTheme.colors.primary
                  : 'transparent',
                color: isActive
                  ? '#ffffff'
                  : currentTheme.colors.text
              })}
            >
              {({ isActive }) => (
                <>
                  <div 
                    className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-white/20' : isDark ? 'bg-gray-800 group-hover:bg-gray-700' : 'bg-gray-100 group-hover:bg-gray-200'}`}
                    style={!isActive && isDark ? { backgroundColor: `${currentTheme.colors.primary}10` } : {}}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-sm font-bold">
                      {section.label}
                    </span>
                    <span 
                      className="block text-xs opacity-90" 
                      style={{ color: isActive ? 'rgba(255,255,255,0.8)' : currentTheme.colors.textMuted }}
                    >
                      {section.description}
                    </span>
                  </div>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    </div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
