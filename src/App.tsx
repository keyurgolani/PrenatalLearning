import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Header,
  FilterSection,
  StoryGrid,
  Footer,
  LearningPathView,
} from './components';
import { TopicPage } from './components/TopicPage';
import { stories, categories, getCategoryById } from './data';
import { learningPaths, type LearningPath } from './data/learningPaths';
import type { Story, CategoryId, DifficultyLevel } from './types';
import {
  ThemeProvider,
  ViewModeProvider,
  LayoutProvider,
  TopicProgressProvider,
  useViewMode,
  useLayout,
  useTheme,
} from './contexts';
import './index.css';

const STORAGE_KEY = 'prenatal-learning-completed-stories';

/**
 * Inner App component that uses the context hooks
 * This is wrapped by the providers in the main App component
 */
function AppContent() {
  const { viewMode } = useViewMode();
  const { layout } = useLayout();
  const { currentTheme } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPath, setSelectedPath] = useState<LearningPath>(learningPaths[0]);
  const [completedStories, setCompletedStories] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  
  // Track previous view mode for filter state preservation
  const previousViewModeRef = useRef(viewMode);
  const savedFiltersRef = useRef({ selectedCategory, selectedDifficulty, searchTerm });

  // Save completed stories to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedStories));
  }, [completedStories]);

  // Preserve filter state when switching modes (Requirements: 2.6)
  useEffect(() => {
    if (previousViewModeRef.current !== viewMode) {
      if (previousViewModeRef.current === 'explore') {
        // Save current filter state when leaving Explore Mode
        savedFiltersRef.current = { selectedCategory, selectedDifficulty, searchTerm };
      } else if (viewMode === 'explore') {
        // Restore filter state when returning to Explore Mode
        setSelectedCategory(savedFiltersRef.current.selectedCategory);
        setSelectedDifficulty(savedFiltersRef.current.selectedDifficulty);
        setSearchTerm(savedFiltersRef.current.searchTerm);
      }
      previousViewModeRef.current = viewMode;
    }
  }, [viewMode, selectedCategory, selectedDifficulty, searchTerm]);

  const handleToggleComplete = useCallback((storyId: number) => {
    setCompletedStories((prev) =>
      prev.includes(storyId)
        ? prev.filter((id) => id !== storyId)
        : [...prev, storyId]
    );
  }, []);

  const handleStorySelect = useCallback((story: Story) => {
    setSelectedStory(story);
  }, []);

  const handleCloseTopicPage = useCallback(() => {
    setSelectedStory(null);
  }, []);

  const handleCompleteTopic = useCallback((storyId: number) => {
    if (!completedStories.includes(storyId)) {
      setCompletedStories((prev) => [...prev, storyId]);
    }
  }, [completedStories]);

  // Filter stories based on current filters
  const filteredStories = stories.filter((story) => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || story.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const progressPercentage = Math.round(
    (completedStories.length / stories.length) * 100
  );

  // Get the background gradient class from the current theme
  const backgroundClass = currentTheme.colors.background;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundClass}`}>
      <Header
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
        autoFocusSearch={viewMode === 'explore'}
        selectedPath={selectedPath}
        onPathChange={setSelectedPath}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Conditionally render based on view mode - Requirements: 2.2, 2.3 */}
        {viewMode === 'explore' ? (
          <>
            {/* Grid/List layout based on layout context - Requirements: 3.2, 3.3 */}
            <StoryGrid
              stories={filteredStories}
              categories={categories}
              completedStories={completedStories}
              onToggleComplete={handleToggleComplete}
              onViewStory={handleStorySelect}
              layout={layout}
            />

            {filteredStories.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  No stories found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedDifficulty('all');
                    setSearchTerm('');
                  }}
                  className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* Learning Path Mode - Requirements: 2.3, 2.4, 2.5 */
          <LearningPathView
            stories={stories}
            categories={categories}
            completedStories={completedStories}
            onSelectTopic={handleStorySelect}
            selectedPath={selectedPath}
          />
        )}
      </main>

      <Footer />

      {/* TopicPage replaces StoryDetailModal - Requirements: 7.1 */}
      {selectedStory && (
        <TopicPage
          story={selectedStory}
          category={getCategoryById(selectedStory.category)}
          isCompleted={completedStories.includes(selectedStory.id)}
          onClose={handleCloseTopicPage}
          onComplete={handleCompleteTopic}
        />
      )}
    </div>
  );
}

/**
 * Main App component wrapped with all context providers
 * Requirements: 1.1, 2.1, 3.1 - Theme, ViewMode, Layout, TopicProgress contexts
 */
function App() {
  return (
    <ThemeProvider>
      <ViewModeProvider>
        <LayoutProvider>
          <TopicProgressProvider>
            <AppContent />
          </TopicProgressProvider>
        </LayoutProvider>
      </ViewModeProvider>
    </ThemeProvider>
  );
}

export default App;
