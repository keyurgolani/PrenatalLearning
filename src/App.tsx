import { useState, useEffect, useCallback } from 'react';
import {
  Header,
  FilterSection,
  StoryGrid,
  StoryDetailModal,
  Footer,
} from './components';
import { stories, categories, getCategoryById } from './data';
import type { Story, CategoryId, DifficultyLevel } from './types';
import './index.css';

const STORAGE_KEY = 'prenatal-learning-completed-stories';

function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Save completed stories to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedStories));
  }, [completedStories]);

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

  const handleCloseModal = useCallback(() => {
    setSelectedStory(null);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
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
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <StoryGrid
          stories={filteredStories}
          categories={categories}
          completedStories={completedStories}
          onToggleComplete={handleToggleComplete}
          onViewStory={handleStorySelect}
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
      </main>

      <Footer />

      {selectedStory && (
        <StoryDetailModal
          story={selectedStory}
          category={getCategoryById(selectedStory.category)}
          isCompleted={completedStories.includes(selectedStory.id)}
          onClose={handleCloseModal}
          onToggleComplete={handleToggleComplete}
        />
      )}
    </div>
  );
}

export default App;
