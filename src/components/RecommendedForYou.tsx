import React from 'react';
import { useTrimester } from '../contexts/TrimesterContext';
import { useTheme } from '../contexts/ThemeContext';
import { filterStoriesByTrimester } from '../utils/trimesterUtils';
import type { Story, Category } from '../types';

interface RecommendedForYouProps {
  stories: Story[];
  categories: Category[];
  completedStories: number[];
  onSelectStory: (story: Story) => void;
  maxStories?: number;
}

/**
 * RecommendedForYou component displays stories recommended for the user's current trimester
 * Requirements: 3.3, 3.4, 3.5
 * - Highlight content recommended for the current trimester
 * - Provide a "Recommended for You" section based on current trimester
 * - Prompt user to add due date if not set
 */
export const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  stories,
  categories,
  completedStories,
  onSelectStory,
  maxStories = 6,
}) => {
  const { currentTrimester, hasDueDate, setDueDate } = useTrimester();
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [dateInput, setDateInput] = React.useState('');

  const trimesterLabels: Record<string, string> = {
    first: 'First Trimester',
    second: 'Second Trimester',
    third: 'Third Trimester',
  };

  const getCategoryById = (categoryId: string): Category | undefined => {
    return categories.find((cat) => cat.id === categoryId);
  };

  const handleSetDueDate = () => {
    if (dateInput) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        setDueDate(date);
        setShowDatePicker(false);
        setDateInput('');
      }
    }
  };

  // If no due date, show prompt to set one - subtle inline banner
  if (!hasDueDate) {
    return (
      <div 
        className="rounded-xl px-4 py-3 mb-6"
        style={{ 
          backgroundColor: isDark ? `${currentTheme.colors.primary}10` : '#faf5ff',
          border: `1px solid ${isDark ? `${currentTheme.colors.primary}20` : '#ede9fe'}`
        }}
      >
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p 
            className="text-sm flex-1"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            <span style={{ color: isDark ? currentTheme.colors.text : '#374151' }}>Set your due date</span> for personalized recommendations
          </p>
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="px-3 py-1.5 text-purple-600 text-xs font-medium rounded-lg hover:bg-purple-100 transition-colors"
              style={{ 
                backgroundColor: isDark ? `${currentTheme.colors.primary}15` : 'transparent',
                color: currentTheme.colors.primary 
              }}
            >
              Set Date
            </button>
            
            {showDatePicker && (
              <div 
                className="absolute top-full right-0 mt-2 p-4 rounded-xl shadow-xl z-50 min-w-[240px] animate-pop-in"
                style={{ 
                  backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
                  border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
                }}
              >
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: isDark ? currentTheme.colors.text : '#374151' }}
                >
                  Expected Due Date
                </label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border text-sm"
                  style={{ 
                    backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                    borderColor: isDark ? currentTheme.colors.border : '#d1d5db',
                    color: isDark ? currentTheme.colors.text : '#1f2937'
                  }}
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg"
                    style={{ 
                      backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                      color: isDark ? currentTheme.colors.textMuted : '#6b7280'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSetDueDate}
                    className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter stories by current trimester and exclude completed ones
  const recommendedStories = filterStoriesByTrimester(stories, currentTrimester!)
    .filter(story => !completedStories.includes(story.id))
    .slice(0, maxStories);

  if (recommendedStories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 
            className="text-xl font-semibold"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            Recommended for You
          </h2>
          <span 
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff',
              color: isDark ? '#C084FC' : '#7c3aed'
            }}
          >
            {trimesterLabels[currentTrimester!]}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendedStories.map((story) => {
          const category = getCategoryById(story.category);
          
          return (
            <article
              key={story.id}
              onClick={() => onSelectStory(story)}
              className="rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              style={{ 
                backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
                border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStory(story);
                }
              }}
              aria-label={`Read ${story.title}`}
            >
              {/* Category color bar */}
              <div className={`h-1 ${category?.color || 'bg-gray-400'}`} />
              
              <div className="p-4">
                <h3 
                  className="font-medium text-sm mb-2 line-clamp-2"
                  style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
                >
                  {story.title}
                </h3>
                
                <p 
                  className="text-xs mb-3 line-clamp-2"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                >
                  {story.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs">
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#f3e8ff',
                      color: isDark ? '#C084FC' : '#7c3aed'
                    }}
                  >
                    {story.duration} min
                  </span>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded"
                    style={{ 
                      backgroundColor: isDark ? 'rgba(148, 163, 184, 0.2)' : '#f3f4f6',
                      color: isDark ? currentTheme.colors.textMuted : '#6b7280'
                    }}
                  >
                    {category?.name}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedForYou;
