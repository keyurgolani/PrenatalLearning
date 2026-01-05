/**
 * Daily Enrichment Page
 * Central hub for daily learning activities: words, puzzles, facts, brain teasers, mindfulness
 */

import React from 'react';
import { useLocation, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Header, Footer, SecondaryHeader } from '../components';
import { type DailySection } from '../components/enrichment/DailyMix';
import { EnrichmentSidebar, type DailySectionConfig } from '../components/enrichment/EnrichmentSidebar';
import { useCompletedStories } from '../contexts/CompletedStoriesContext';
import { stories } from '../data/stories';

// SVG Icons as components (no emojis)
const BookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const PuzzleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MixIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const sections: DailySectionConfig[] = [
  { id: 'daily', label: 'Daily Mix', icon: MixIcon, description: 'Your daily plan', path: 'mix' },
  { id: 'words', label: 'Words', icon: BookIcon, description: 'Expand your vocabulary', path: 'words' },
  { id: 'puzzles', label: 'Puzzles', icon: PuzzleIcon, description: 'Challenge your mind', path: 'puzzles' },
  { id: 'facts', label: 'Facts', icon: LightbulbIcon, description: 'Discover something new', path: 'facts' },
  { id: 'teasers', label: 'Brain Teasers', icon: BrainIcon, description: 'Sharpen your thinking', path: 'teasers' },
  { id: 'mindfulness', label: 'Mindfulness', icon: HeartIcon, description: 'Connect with your baby', path: 'mindfulness' },
];

export const DailyEnrichmentPage: React.FC = () => {
  const { currentTheme } = useTheme();
  const { completedStories } = useCompletedStories();
  const isDark = currentTheme.isDark;
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active section from URL
  const activeSection = React.useMemo(() => {
    const path = location.pathname.split('/').pop();
    // Map path 'mix' to id 'daily' for backward compatibility of ID usage
    const matched = sections.find(s => s.path === path);
    return (matched ? matched.id : 'daily') as DailySection; 
  }, [location.pathname]);

  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  const backgroundClass = isDark ? 'from-gray-900 via-purple-950 to-gray-900' : 'from-purple-50 via-white to-pink-50';

  const handleSectionChange = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
       navigate(section.path || 'mix');
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${backgroundClass} transition-theme overflow-hidden`}>
      <Header
        completedCount={completedStories.length}
        totalCount={stories.length}
        progressPercentage={progressPercentage}
      />
      <SecondaryHeader
        completedCount={completedStories.length}
        totalCount={stories.length}
        progressPercentage={progressPercentage}
      />

      <div className="flex-1 w-full px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 overflow-hidden">
        <div className="w-full mx-auto flex gap-6 xl:gap-8 h-full">
          {/* Sidebar - Visible on XL screens */}
          <aside className="hidden xl:block w-72 2xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-hidden">
            <EnrichmentSidebar 
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
              sections={sections}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
            {/* Mobile/Tablet Tab Navigation (Hidden on XL+) */}
            <div className="xl:hidden flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hidden flex-shrink-0">
              {sections.map((section) => {
                const IconComponent = section.icon;
                
                return (
                  <NavLink
                    key={section.id}
                    to={section.path || 'mix'}
                    className={({ isActive }) => `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                              transition-all whitespace-nowrap focus-ring ${
                                isActive ? 'shadow-md' : ''
                              }`}
                    style={({ isActive }) => ({
                      backgroundColor: isActive
                        ? currentTheme.colors.primary
                        : isDark
                        ? currentTheme.colors.surface
                        : 'white',
                      color: isActive
                        ? 'white'
                        : currentTheme.colors.text,
                      border: isActive 
                        ? 'none' 
                        : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                    })}
                    aria-label={`${section.label}: ${section.description}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{section.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden content-scalable relative">
              
              {/* Dynamic Page Header - Now inside scrollable area */}
              <div className="flex-shrink-0 mb-6 px-1 pt-4">
                {/* Unified Header Style for ALL sections */}
                {(() => {
                   const currentSection = sections.find(s => s.id === activeSection);
                   const Icon = currentSection?.icon;
                   
                   return currentSection ? (
                     <div>
                       <h1 
                         className="text-2xl font-bold mb-2 flex items-center gap-3"
                         style={{ color: currentTheme.colors.text }}
                       >
                         <span 
                          className="p-2 rounded-lg flex items-center justify-center shadow-sm"
                          style={{ 
                            backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3f4f6', // Consistent light background
                            color: currentTheme.colors.primary
                          }}
                         >
                           {Icon && <Icon className="w-6 h-6" />}
                         </span>
                         {currentSection.label}
                       </h1>
                       <p 
                         className="text-sm ml-1"
                         style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                       >
                         {currentSection.id === 'daily' 
                           ? "A curated selection of today's best activities to stimulate your mind and bond with your baby."
                           : currentSection.description}
                       </p>
                     </div>
                   ) : null;
                })()}
              </div>

              <div className="animate-fade-in pb-28">
                <Outlet />
              </div>
              
              <div className="xl:hidden mt-8">
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DailyEnrichmentPage;
