import { useState, useEffect, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, useSearchParams, Navigate, useLocation } from 'react-router-dom';
import {
  Header,
  FilterSection,
  StoryGrid,
  Footer,
  LearningPathView,
  AdvancedFilters,
  RecommendedForYou,
  FloatingStatusBar,
  SecondaryHeader,
  OfflineBanner,
} from './components';
import { JournalModal } from './components/journal';
import { TopicPage } from './components/TopicPage';
import { JournalPage } from './pages';
import { stories, categories, getCategoryById } from './data';
import { learningPaths, type LearningPath } from './data/learningPaths';
import type { Story, CategoryId, DifficultyLevel, DurationFilter, CompletionStatus, AdvancedFilterState } from './types';
import { filterStoriesAdvanced, countActiveFilters } from './utils';
import { type FilterPreset, getAllPresets, findMatchingPreset, savePreset, deletePreset } from './services';
import {
  ThemeProvider,
  ViewModeProvider,
  LayoutProvider,
  TopicProgressProvider,
  AccessibilityProvider,
  ReadingModeProvider,
  TrimesterProvider,
  StreakProvider,
  AudioProvider,
  AuthProvider,
  ProfileProvider,
  JournalProvider,
  KickProvider,
  CompletedStoriesProvider,
  ModalProvider,
  useLayout,
  useTheme,
  useTopicProgress,
  useTrimester,
  useCompletedStories,
} from './contexts';
import './index.css';

/**
 * Topic Page Route Component
 * Wraps TopicPage with Header and Footer for consistent navigation
 * Requirements: 5.1, 5.2, 5.4 - Display Header/Footer on TopicPage with theme selector access
 */
function TopicPageRoute({ 
  completedStories, 
  onComplete 
}: { 
  completedStories: number[]; 
  onComplete: (storyId: number) => void;
}) {
  const { storyId, section } = useParams<{ storyId: string; section?: string }>();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  
  const story = useMemo(() => {
    const id = parseInt(storyId || '', 10);
    return stories.find(s => s.id === id);
  }, [storyId]);

  // Validate section parameter
  const validSections = ['overview', 'core-content', 'practice', 'integration', 'exercises'];
  const initialSection = section && validSections.includes(section) ? section : undefined;

  const handleClose = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Handle selecting a related story - navigate to that story's topic page
  const handleSelectRelatedStory = useCallback((relatedStory: { id: number }) => {
    navigate(`/topic/${relatedStory.id}`);
  }, [navigate]);

  // Handle section change - update URL
  const handleSectionChange = useCallback((newSection: string) => {
    navigate(`/topic/${storyId}/${newSection}`, { replace: true });
  }, [navigate, storyId]);

  // Calculate progress for Header
  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  const backgroundClass = currentTheme.colors.background;

  if (!story) {
    return (
      <div className={`min-h-screen flex flex-col bg-gradient-to-br ${backgroundClass} transition-theme`}>
        <Header
          completedCount={completedStories.length}
          totalCount={stories.length}
          progressPercentage={progressPercentage}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Topic Not Found</h1>
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 font-medium animate-gentle-bounce animate-click"
            >
              Go back home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
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
      <div className="flex-1 overflow-hidden">
        <TopicPage
          story={story}
          category={getCategoryById(story.category)}
          isCompleted={completedStories.includes(story.id)}
          onClose={handleClose}
          onComplete={onComplete}
          completedStories={completedStories}
          onSelectRelatedStory={handleSelectRelatedStory}
          initialSection={initialSection}
          onSectionChange={handleSectionChange}
        />
      </div>
    </div>
  );
}

/**
 * Sidebar component for filters on larger screens
 */
function FilterSidebar({
  categories: categoryList,
  selectedCategory,
  selectedDifficulty,
  onCategoryChange,
  onDifficultyChange,
  isJourneyMode,
  selectedPath,
  onPathChange,
  // Advanced filter props
  selectedDuration,
  selectedCompletionStatus,
  selectedTrimester,
  onDurationChange,
  onCompletionStatusChange,
  onTrimesterChange,
  matchCount,
  totalCount,
  activeFilterCount,
  onClearAllFilters,
  // Preset props
  currentFilters,
  onPresetSelect,
}: {
  categories: typeof categories;
  selectedCategory: CategoryId;
  selectedDifficulty: DifficultyLevel | 'all';
  onCategoryChange: (category: CategoryId) => void;
  onDifficultyChange: (difficulty: DifficultyLevel | 'all') => void;
  isJourneyMode: boolean;
  selectedPath?: LearningPath;
  onPathChange?: (path: LearningPath) => void;
  // Advanced filter props
  selectedDuration?: DurationFilter;
  selectedCompletionStatus?: CompletionStatus;
  selectedTrimester?: 'all' | 'first' | 'second' | 'third' | 'any';
  onDurationChange?: (duration: DurationFilter) => void;
  onCompletionStatusChange?: (status: CompletionStatus) => void;
  onTrimesterChange?: (trimester: 'all' | 'first' | 'second' | 'third' | 'any') => void;
  matchCount?: number;
  totalCount?: number;
  activeFilterCount?: number;
  onClearAllFilters?: () => void;
  // Preset props
  currentFilters?: AdvancedFilterState;
  onPresetSelect?: (preset: FilterPreset) => void;
}) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  const difficulties: { value: DifficultyLevel | 'all'; label: string; color: string }[] = [
    { value: 'all', label: 'All Levels', color: 'bg-gray-500' },
    { value: 'foundational', label: 'Foundational', color: 'bg-green-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-500' },
  ];

  const containerStyle = {
    backgroundColor: isDark ? currentTheme.colors.surface : 'rgba(255, 255, 255, 0.9)',
  };

  const labelStyle = {
    color: isDark ? currentTheme.colors.text : '#374151',
  };

  const inactiveButtonStyle = {
    color: isDark ? currentTheme.colors.text : '#4b5563',
  };

  // In Journey mode, always show sidebar with learning paths
  // Requirements: 2.4, 2.5 - Highlight current trimester path
  const { currentTrimester, hasDueDate } = useTrimester();
  
  // Map trimester to path ID for highlighting
  const trimesterPathMap: Record<string, string> = {
    first: 'first-trimester',
    second: 'second-trimester',
    third: 'third-trimester',
  };
  
  const currentTrimesterPathId = currentTrimester ? trimesterPathMap[currentTrimester] : null;

  // Get presets for quick filters
  const [presets, setPresets] = useState<FilterPreset[]>(() => getAllPresets());
  const builtInPresets = presets.filter(p => p.isBuiltIn);
  const userPresets = presets.filter(p => !p.isBuiltIn);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  // Find if current filters match any preset
  const activePreset = useMemo(() => {
    if (!currentFilters) return undefined;
    return findMatchingPreset(currentFilters);
  }, [currentFilters]);

  const handleSavePreset = () => {
    if (!presetName.trim() || !currentFilters) return;
    savePreset(presetName.trim(), currentFilters);
    setPresets(getAllPresets());
    setPresetName('');
    setShowSavePreset(false);
  };

  const handleDeletePreset = (presetId: string) => {
    deletePreset(presetId);
    setPresets(getAllPresets());
  };
  
  if (isJourneyMode) {
    return (
      <nav className="space-y-6" aria-label="Learning path navigation">
        <div 
          className="backdrop-blur-sm rounded-2xl p-5 shadow-sm"
          style={containerStyle}
        >
          <h3 
            id="learning-paths-heading"
            className="text-sm font-semibold mb-3 flex items-center gap-2"
            style={labelStyle}
          >
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Learning Paths
          </h3>
          <div className="space-y-2" role="group" aria-labelledby="learning-paths-heading">
            {learningPaths.map((path) => {
              const isSelected = selectedPath?.id === path.id;
              const isCurrentTrimesterPath = hasDueDate && path.id === currentTrimesterPathId;
              
              return (
                <button
                  key={path.id}
                  onClick={() => onPathChange?.(path)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all animate-gentle-bounce animate-click focus-ring ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isCurrentTrimesterPath
                        ? 'ring-2 ring-purple-400 ring-offset-1'
                        : ''
                  }`}
                  style={!isSelected ? inactiveButtonStyle : undefined}
                  aria-pressed={isSelected}
                  aria-label={`Select ${path.name} learning path${isCurrentTrimesterPath ? ' (Recommended for your current trimester)' : ''}`}
                >
                  <span className="flex items-center gap-2">
                    {path.name}
                    {isCurrentTrimesterPath && (
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs ${
                        isSelected 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        For You
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }



  return (
    <nav 
      className="backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden" 
      style={containerStyle}
      aria-label="Story filters"
    >
        {/* Results Summary - at the very top */}
        {!isJourneyMode && matchCount !== undefined && totalCount !== undefined && (
          <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <div className="flex items-center gap-1.5">
                <span 
                  className="text-xs font-medium"
                  style={labelStyle}
                  aria-live="polite"
                >
                  {matchCount} of {totalCount} stories
                </span>
                {activeFilterCount !== undefined && activeFilterCount > 0 && (
                  <span 
                    className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-purple-100 text-purple-700 whitespace-nowrap"
                    aria-label={`${activeFilterCount} filters active`}
                  >
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {activeFilterCount !== undefined && activeFilterCount > 0 && onClearAllFilters && (
                <button
                  onClick={onClearAllFilters}
                  className="text-[10px] font-medium text-purple-600 hover:text-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 rounded px-1.5 py-0.5"
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Filters - right after results summary */}
        {!isJourneyMode && onPresetSelect && builtInPresets.length > 0 && (
          <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
            <h3 
              className="text-xs font-semibold mb-2 flex items-center gap-1.5"
              style={labelStyle}
            >
              <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Quick Filters
            </h3>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick filter presets">
              {builtInPresets.map((preset) => {
                const isActive = activePreset?.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onPresetSelect(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all focus-ring ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={!isActive && isDark ? { backgroundColor: currentTheme.colors.surface, color: currentTheme.colors.text } : undefined}
                    aria-pressed={isActive}
                    aria-label={`Apply ${preset.name} filter preset`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* User Saved Presets - right after quick filters */}
        {!isJourneyMode && onPresetSelect && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${userPresets.length > 0 ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
              <h3 
                className="text-xs font-semibold mb-2 flex items-center gap-1.5"
                style={labelStyle}
              >
                <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Saved Presets
              </h3>
              <div className="space-y-1" role="group" aria-label="Saved filter presets">
                {userPresets.map((preset) => {
                  const isActive = activePreset?.id === preset.id;
                  return (
                    <div key={preset.id} className="flex items-center gap-1.5 animate-fade-in">
                      <button
                        onClick={() => onPresetSelect(preset)}
                        className={`flex-1 text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'hover:bg-gray-100'
                        }`}
                        style={!isActive ? inactiveButtonStyle : undefined}
                        aria-pressed={isActive}
                      >
                        {preset.name}
                      </button>
                      <button
                        onClick={() => handleDeletePreset(preset.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Delete preset ${preset.name}`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Save Preset - right after saved presets */}
        {!isJourneyMode && onPresetSelect && currentFilters && (
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFilterCount !== undefined && activeFilterCount > 0 && !activePreset ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
              {!showSavePreset ? (
                <button
                  onClick={() => setShowSavePreset(true)}
                  className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors rounded-lg border-2 border-dashed border-purple-200 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  aria-label="Save current filters as preset"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Save as Preset
                </button>
              ) : (
                <div className="space-y-2 animate-fade-in">
                  <input
                    type="text"
                    id="preset-name"
                    name="preset-name"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="Preset name..."
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    style={isDark ? { backgroundColor: currentTheme.colors.surface, color: currentTheme.colors.text, borderColor: currentTheme.colors.border } : undefined}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSavePreset();
                      if (e.key === 'Escape') {
                        setShowSavePreset(false);
                        setPresetName('');
                      }
                    }}
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={handleSavePreset}
                      disabled={!presetName.trim()}
                      className="flex-1 px-2.5 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowSavePreset(false);
                        setPresetName('');
                      }}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        {!isJourneyMode && (
          <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
            <h3 
              className="text-xs font-semibold mb-2 flex items-center gap-1.5"
              style={labelStyle}
            >
              <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </h3>
            <div className="space-y-1">
              {categoryList.map((category) => {
                const isActive = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 animate-gentle-bounce animate-click ${
                      isActive
                        ? `${category.color} text-white shadow-sm`
                        : ''
                    }`}
                    style={!isActive ? inactiveButtonStyle : undefined}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : category.color}`} />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Difficulty Filters */}
        {!isJourneyMode && (
          <div className="px-3 py-2.5 border-b" style={{ borderColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}>
            <h3 
              className="text-xs font-semibold mb-2 flex items-center gap-1.5"
              style={labelStyle}
            >
              <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Difficulty
            </h3>
            <div className="space-y-1">
              {difficulties.map(({ value, label, color }) => {
                const isActive = selectedDifficulty === value;
                return (
                  <button
                    key={value}
                    onClick={() => onDifficultyChange(value)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 animate-gentle-bounce animate-click ${
                      isActive
                        ? `${color} text-white shadow-sm`
                        : ''
                    }`}
                    style={!isActive ? inactiveButtonStyle : undefined}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : color}`} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Advanced Filters (Trimester, Duration and Completion Status) */}
        {!isJourneyMode && selectedDuration !== undefined && onDurationChange && onCompletionStatusChange && (
          <div className="px-3 py-2.5">
            <AdvancedFilters
              selectedDuration={selectedDuration}
              selectedCompletionStatus={selectedCompletionStatus || 'all'}
              selectedTrimester={selectedTrimester}
              onDurationChange={onDurationChange}
              onCompletionStatusChange={onCompletionStatusChange}
              onTrimesterChange={onTrimesterChange}
            />
          </div>
        )}
      </nav>
  );
}

/**
 * Explore page component
 */
function ExplorePage({
  completedStories,
  onToggleComplete,
}: {
  completedStories: number[];
  onToggleComplete: (storyId: number) => void;
}) {
  const { layout } = useLayout();
  const { currentTheme } = useTheme();
  const { getAllProgress } = useTopicProgress();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(() => {
    const category = searchParams.get('category');
    return (category as CategoryId) || 'all';
  });
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>(() => {
    const difficulty = searchParams.get('difficulty');
    return (difficulty as DifficultyLevel | 'all') || 'all';
  });
  
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });

  // Advanced filter state
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>(() => {
    const duration = searchParams.get('duration');
    return (duration as DurationFilter) || 'all';
  });

  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<CompletionStatus>(() => {
    const status = searchParams.get('status');
    return (status as CompletionStatus) || 'all';
  });

  const [selectedTrimester, setSelectedTrimester] = useState<'all' | 'first' | 'second' | 'third' | 'any'>(() => {
    const trimester = searchParams.get('trimester');
    return (trimester as 'all' | 'first' | 'second' | 'third' | 'any') || 'all';
  });

  // Get in-progress stories from topic progress
  const inProgressStories = useMemo(() => {
    const progress = getAllProgress();
    return Object.keys(progress)
      .map(Number)
      .filter(id => !completedStories.includes(id));
  }, [getAllProgress, completedStories]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    if (searchTerm) params.set('search', searchTerm);
    if (selectedDuration !== 'all') params.set('duration', selectedDuration);
    if (selectedCompletionStatus !== 'all') params.set('status', selectedCompletionStatus);
    if (selectedTrimester !== 'all') params.set('trimester', selectedTrimester);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, selectedDifficulty, searchTerm, selectedDuration, selectedCompletionStatus, selectedTrimester, setSearchParams]);

  const handleStorySelect = useCallback((story: Story) => {
    navigate(`/topic/${story.id}`);
  }, [navigate]);

  // Use advanced filtering with all filter options
  const advancedFilterState = useMemo(() => ({
    selectedCategory,
    selectedDifficulty,
    searchTerm,
    selectedDuration,
    selectedCompletionStatus,
    selectedTrimester,
  }), [selectedCategory, selectedDifficulty, searchTerm, selectedDuration, selectedCompletionStatus, selectedTrimester]);

  const filteredStories = useMemo(() => 
    filterStoriesAdvanced(stories, advancedFilterState, completedStories, inProgressStories),
    [advancedFilterState, completedStories, inProgressStories]
  );

  const activeFilterCount = useMemo(() => 
    countActiveFilters(advancedFilterState),
    [advancedFilterState]
  );

  const handleClearAllFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
    setSelectedDuration('all');
    setSelectedCompletionStatus('all');
    setSelectedTrimester('all');
  }, []);

  // Handle preset selection
  const handlePresetSelect = useCallback((preset: FilterPreset) => {
    setSelectedCategory(preset.filters.selectedCategory);
    setSelectedDifficulty(preset.filters.selectedDifficulty);
    setSearchTerm(preset.filters.searchTerm);
    setSelectedDuration(preset.filters.selectedDuration);
    setSelectedCompletionStatus(preset.filters.selectedCompletionStatus);
    setSelectedTrimester(preset.filters.selectedTrimester);
  }, []);

  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  const backgroundClass = currentTheme.colors.background;

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

      <FilterSection
        categories={categories}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        searchTerm={searchTerm}
        onCategoryChange={setSelectedCategory}
        onDifficultyChange={setSelectedDifficulty}
        onSearchChange={setSearchTerm}
        autoFocusSearch={true}
        isJourneyMode={false}
      />

      <div className="flex-1 w-full px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 overflow-hidden">
        <div className="w-full mx-auto flex gap-6 xl:gap-8 h-full">
          <aside className="hidden xl:block w-72 2xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-hidden">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              onCategoryChange={setSelectedCategory}
              onDifficultyChange={setSelectedDifficulty}
              isJourneyMode={false}
              selectedDuration={selectedDuration}
              selectedCompletionStatus={selectedCompletionStatus}
              selectedTrimester={selectedTrimester}
              onDurationChange={setSelectedDuration}
              onCompletionStatusChange={setSelectedCompletionStatus}
              onTrimesterChange={setSelectedTrimester}
              matchCount={filteredStories.length}
              totalCount={stories.length}
              activeFilterCount={activeFilterCount}
              onClearAllFilters={handleClearAllFilters}
              currentFilters={advancedFilterState}
              onPresetSelect={handlePresetSelect}
            />
          </aside>

          <main id="main-content" className="flex-1 min-w-0 overflow-y-auto scrollbar-hidden content-scalable" role="main" aria-label="Story content">
            <StoryGrid
              stories={filteredStories}
              categories={categories}
              completedStories={completedStories}
              onToggleComplete={onToggleComplete}
              onViewStory={handleStorySelect}
              layout={layout}
            />

            {filteredStories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  No stories found matching your filters.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium animate-gentle-bounce animate-click"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Journey (Learning Path) page component
 */
function JourneyPage({
  completedStories,
}: {
  completedStories: number[];
}) {
  const { currentTheme } = useTheme();
  const { currentTrimester, hasDueDate } = useTrimester();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(() => {
    return searchParams.get('search') || '';
  });
  
  // Map trimester to path ID for default selection
  const trimesterPathMap: Record<string, string> = {
    first: 'first-trimester',
    second: 'second-trimester',
    third: 'third-trimester',
  };

  // Track if user has manually selected a path in this session
  const [hasUserSelectedPath, setHasUserSelectedPath] = useState(() => {
    // If there's a path in URL, user has explicitly selected it
    return !!searchParams.get('path');
  });
  
  const [selectedPath, setSelectedPath] = useState<LearningPath>(() => {
    // First check URL params
    const pathId = searchParams.get('path');
    if (pathId) {
      const pathFromUrl = learningPaths.find(p => p.id === pathId);
      if (pathFromUrl) return pathFromUrl;
    }
    // If user has due date set, default to their trimester path
    if (hasDueDate && currentTrimester) {
      const trimesterPathId = trimesterPathMap[currentTrimester];
      const trimesterPath = learningPaths.find(p => p.id === trimesterPathId);
      if (trimesterPath) return trimesterPath;
    }
    // Fall back to first path
    return learningPaths[0];
  });

  // Wrapper to track manual path selection
  const handlePathChange = useCallback((path: LearningPath) => {
    setHasUserSelectedPath(true);
    setSelectedPath(path);
  }, []);

  // Update URL when path changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedPath.id !== learningPaths[0].id) {
      params.set('path', selectedPath.id);
    }
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedPath, setSearchParams]);

  // Auto-select trimester path only on initial load when user hasn't manually selected
  useEffect(() => {
    // Only auto-select if user hasn't manually selected a path
    if (!hasUserSelectedPath && hasDueDate && currentTrimester) {
      const trimesterPathId = trimesterPathMap[currentTrimester];
      const trimesterPath = learningPaths.find(p => p.id === trimesterPathId);
      if (trimesterPath && selectedPath.id !== trimesterPathId) {
        setSelectedPath(trimesterPath);
      }
    }
    // Only run once on mount or when due date changes (not on every render)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDueDate, currentTrimester]);

  const handleStorySelect = useCallback((story: Story) => {
    navigate(`/topic/${story.id}`);
  }, [navigate]);

  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  const backgroundClass = currentTheme.colors.background;

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

      <FilterSection
        categories={categories}
        selectedCategory="all"
        selectedDifficulty="all"
        searchTerm={searchTerm}
        onCategoryChange={() => { /* Journey mode doesn't use category filter */ }}
        onDifficultyChange={() => { /* Journey mode doesn't use difficulty filter */ }}
        onSearchChange={setSearchTerm}
        autoFocusSearch={false}
        selectedPath={selectedPath}
        onPathChange={handlePathChange}
        isJourneyMode={true}
      />

      <div className="flex-1 w-full px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 overflow-hidden">
        <div className="w-full mx-auto flex gap-6 xl:gap-8 h-full">
          <aside className="w-72 2xl:w-80 flex-shrink-0 overflow-y-auto scrollbar-hidden">
            <FilterSidebar
              categories={categories}
              selectedCategory="all"
              selectedDifficulty="all"
              onCategoryChange={() => { /* Journey mode doesn't use category filter */ }}
              onDifficultyChange={() => { /* Journey mode doesn't use difficulty filter */ }}
              isJourneyMode={true}
              selectedPath={selectedPath}
              onPathChange={handlePathChange}
            />
          </aside>

          <main id="main-content" className="flex-1 min-w-0 overflow-y-auto scrollbar-hidden content-scalable" role="main" aria-label="Learning path content">
            {/* Recommended for You section - Requirements: 3.3, 3.4, 3.5 */}
            <RecommendedForYou
              stories={stories}
              categories={categories}
              completedStories={completedStories}
              onSelectStory={handleStorySelect}
            />
            
            <LearningPathView
              stories={stories}
              categories={categories}
              completedStories={completedStories}
              onSelectTopic={handleStorySelect}
              selectedPath={selectedPath}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

/**
 * Inner App component that uses the context hooks
 */
function AppContent() {
  const { completedStories, handleToggleComplete, handleCompleteTopic } = useCompletedStories();
  const location = useLocation();
  
  // Determine if we're on a topic page (compact mode)
  const isTopicPage = location.pathname.startsWith('/topic/');
  
  // Calculate progress
  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  return (
    <>
      <Routes>
      <Route path="/" element={<Navigate to="/journey" replace />} />
      <Route 
        path="/journey" 
        element={<JourneyPage completedStories={completedStories} />} 
      />
      <Route 
        path="/explore" 
        element={
          <ExplorePage 
            completedStories={completedStories}
            onToggleComplete={handleToggleComplete}
          />
        } 
      />
      <Route 
        path="/topic/:storyId" 
        element={
          <TopicPageRoute 
            completedStories={completedStories}
            onComplete={handleCompleteTopic}
          />
        } 
      />
      <Route 
        path="/topic/:storyId/:section" 
        element={
          <TopicPageRoute 
            completedStories={completedStories}
            onComplete={handleCompleteTopic}
          />
        } 
      />
      <Route 
        path="/journal" 
        element={
          <JournalPage 
            completedCount={completedStories.length}
            totalCount={stories.length}
          />
        } 
      />
    </Routes>
      
      {/* Single persistent FloatingStatusBar that morphs based on route
          For logged-in users, this bar includes journal and kick buttons
          Requirements: 17.1 - Journal and kick buttons integrated into floating status bar
          Requirements: 17.2 - Journal/kick buttons only shown to authenticated users */}
      <FloatingStatusBar
        completedCount={completedStories.length}
        totalCount={stories.length}
        progressPercentage={progressPercentage}
        compact={isTopicPage}
      />
      
      <OfflineBanner />
      
      {/* Journal Modal - opens when journal button is clicked
          Requirements: 10.2 - Open journal popup/modal
          Requirements: 10.3 - Calendar view organized by date
          Requirements: 10.7 - Visual indicator for days with entries
          Requirements: 11.1, 11.3, 11.4, 11.5 - Mood, content, topic/journey mentions */}
      <JournalModal />
    </>
  );
}

/**
 * Main App component wrapped with all context providers
 * AuthProvider and ProfileProvider added for user authentication and baby profile management
 * JournalProvider added for journal state management
 * Requirements: 15.1, 15.2, 7.5 - Auth state in header and profile display
 * Requirements: 10.1 - Floating journal button accessible from any page
 */
function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <ReadingModeProvider>
          <ViewModeProvider>
            <LayoutProvider>
              <AuthProvider>
                <ProfileProvider>
                  <JournalProvider>
                    <KickProvider>
                      <CompletedStoriesProvider>
                        <TopicProgressProvider>
                          <TrimesterProvider>
                            <StreakProvider>
                              <AudioProvider>
                                <ModalProvider>
                                  <AppContent />
                                </ModalProvider>
                              </AudioProvider>
                            </StreakProvider>
                          </TrimesterProvider>
                        </TopicProgressProvider>
                      </CompletedStoriesProvider>
                    </KickProvider>
                  </JournalProvider>
                </ProfileProvider>
              </AuthProvider>
            </LayoutProvider>
          </ViewModeProvider>
        </ReadingModeProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;
