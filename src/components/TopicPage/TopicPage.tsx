import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { Story, Category } from '../../types';
import type { LearningStep } from '../../contexts/TopicProgressContext';
import { LEARNING_STEPS, STEP_LABELS, useTopicProgress } from '../../contexts/TopicProgressContext';
import { useTheme, useReadingMode } from '../../contexts';
import { updateLastViewed } from '../../services/continueService';
import { stories } from '../../data/stories';
import { categories } from '../../data/categories';
import { ProgressStepper } from './ProgressStepper';
import { OverviewStep } from './OverviewStep';
import { CoreContentStep } from './CoreContentStep';
import { PracticeStep } from './PracticeStep';
import { IntegrationStep } from './IntegrationStep';
import { ExercisesStep } from './ExercisesStep';
import { RelatedTopics } from '../RelatedTopics';
import { ReadingMode, ReadingModeToggle } from '../ReadingMode';
import { FixedReadingProgressBar } from '../ReadingProgressBar';
import { useReadingProgress } from '../../hooks/useReadingProgress';
import { KickCounter } from '../KickCounter';
import { useAudio } from '../../contexts/AudioContext';
import { StepTransition } from '../StepTransition';

/**
 * TopicPage component - Unified guided learning experience
 * Requirements: 7.1 - Display unified Topic Page with clear step-by-step progression
 * Requirements: 7.4 - Enable navigation to next step via Continue button
 * Requirements: 7.5 - Display Complete Topic button on final step
 * Requirements: 7.9 - Display completion summary when all steps done
 */

interface TopicPageProps {
  story: Story;
  category: Category | undefined;
  isCompleted: boolean;
  onClose: () => void;
  onComplete: (storyId: number) => void;
  /** Array of completed story IDs for related topics */
  completedStories?: number[];
  /** Callback when a related story is selected */
  onSelectRelatedStory?: (story: Story) => void;
  /** Initial section from URL */
  initialSection?: string;
  /** Callback when section changes (for URL updates) */
  onSectionChange?: (section: string) => void;
}

/**
 * Inner component that handles the topic page state
 * This is keyed by story.id in the parent to reset state on story change
 */
interface TopicPageInnerProps extends TopicPageProps {
  initialStep: LearningStep;
  initialCompletedSteps: LearningStep[];
  completedStories: number[];
  onSelectRelatedStory: (story: Story) => void;
  onSectionChange: (section: string) => void;
}

const TopicPageInner: React.FC<TopicPageInnerProps> = ({
  story,
  category,
  isCompleted,
  onClose,
  onComplete,
  initialStep,
  initialCompletedSteps,
  completedStories,
  onSelectRelatedStory,
  onSectionChange,
}) => {
  const { setCurrentStep, completeStep } = useTopicProgress();
  const { currentTheme } = useTheme();
  const { settings: readingSettings, exitReadingMode, pauseAutoScroll } = useReadingMode();
  const { setCurrentPageStoryId, setCurrentSection } = useAudio();
  
  const [currentStep, setCurrentStepLocal] = useState<LearningStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<LearningStep[]>(initialCompletedSteps);
  const [showCompletionSummary, setShowCompletionSummary] = useState(false);
  
  // Ref for the scrollable content container (for auto-scroll feature)
  // Requirements: 10.1 - Provide an auto-scroll toggle in the reading view
  const contentContainerRef = React.useRef<HTMLDivElement>(null);

  // Reading progress tracking
  // Requirements: 11.1, 11.2, 11.3, 11.5 - Display and update reading progress
  const { sectionProgress, overallProgress } = useReadingProgress({
    containerRef: contentContainerRef,
    currentStep,
    completedSteps,
  });

  const currentStepIndex = LEARNING_STEPS.indexOf(currentStep);
  const isLastStep = currentStepIndex === LEARNING_STEPS.length - 1;

  // Track last viewed story and section for "Continue Learning" feature
  // Requirements: 5.1 - THE System SHALL track the last viewed story and section for each user
  useEffect(() => {
    updateLastViewed(story.id, currentStep, completedSteps);
  }, [story.id, currentStep, completedSteps]);

  // Set current page story ID and section for mini audio player visibility
  useEffect(() => {
    setCurrentPageStoryId(story.id);
    return () => setCurrentPageStoryId(null);
  }, [story.id, setCurrentPageStoryId]);

  // Track current section for mini player visibility
  useEffect(() => {
    setCurrentSection(currentStep);
    return () => setCurrentSection(null);
  }, [currentStep, setCurrentSection]);

  // Handle step navigation via stepper
  const handleStepClick = useCallback((step: LearningStep) => {
    // Audio continues playing in mini player when changing sections
    // Pause auto-scroll when changing steps
    // Requirements: 10.6 - Stop auto-scroll when reaching the end of a section
    pauseAutoScroll();
    setCurrentStepLocal(step);
    setCurrentStep(story.id, step);
    // Update URL for section-level routing
    onSectionChange(step);
    // Scroll content container to top for smooth transition
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [story.id, setCurrentStep, pauseAutoScroll, onSectionChange]);

  // Handle Continue button - complete current step and move to next
  const handleContinue = useCallback(() => {
    // Audio continues playing in mini player when changing sections
    // Pause auto-scroll when moving to next step
    // Requirements: 10.6 - Stop auto-scroll when reaching the end of a section
    pauseAutoScroll();
    
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      const newCompletedSteps = [...completedSteps, currentStep];
      setCompletedSteps(newCompletedSteps);
      completeStep(story.id, currentStep);
    }

    // Move to next step if not on last step
    if (!isLastStep) {
      const nextStep = LEARNING_STEPS[currentStepIndex + 1];
      setCurrentStepLocal(nextStep);
      setCurrentStep(story.id, nextStep);
      // Update URL for section-level routing
      onSectionChange(nextStep);
      // Scroll content container to top for smooth transition
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [currentStep, currentStepIndex, isLastStep, completedSteps, story.id, completeStep, setCurrentStep, pauseAutoScroll, onSectionChange]);

  // Handle Complete Topic button
  const handleCompleteTopic = useCallback(() => {
    // Mark final step as completed
    if (!completedSteps.includes(currentStep)) {
      const newCompletedSteps = [...completedSteps, currentStep];
      setCompletedSteps(newCompletedSteps);
      completeStep(story.id, currentStep);
    }
    
    // Show completion summary
    setShowCompletionSummary(true);
    
    // Mark story as complete
    onComplete(story.id);
  }, [currentStep, completedSteps, story.id, completeStep, onComplete]);

  // Handle review section from completion summary
  const handleReviewSection = useCallback((step: LearningStep) => {
    // Audio continues playing in mini player when changing sections
    setShowCompletionSummary(false);
    setCurrentStepLocal(step);
    setCurrentStep(story.id, step);
    // Update URL for section-level routing
    onSectionChange(step);
  }, [story.id, setCurrentStep, onSectionChange]);

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'overview':
        return <OverviewStep story={story} category={category} />;
      case 'core-content':
        return <CoreContentStep story={story} />;
      case 'practice':
        return <PracticeStep story={story} />;
      case 'integration':
        return <IntegrationStep story={story} />;
      case 'exercises':
        return <ExercisesStep story={story} />;
      default:
        return <OverviewStep story={story} category={category} />;
    }
  };

  const backgroundClass = currentTheme.colors.background;

  return (
    <div
      className={`h-full flex flex-col bg-gradient-to-br ${backgroundClass} transition-theme overflow-hidden`}
      role="main"
      aria-labelledby="topic-page-title"
    >
      {/* Reading Progress Bar - Requirements 11.1, 11.5 */}
      {!showCompletionSummary && (
        <FixedReadingProgressBar 
          sectionProgress={sectionProgress} 
          overallProgress={overallProgress}
        />
      )}
      
      {/* Main content container with responsive max-width */}
      {/* Requirements 6.1: max-width 1400px for viewports > 1280px */}
      {/* Requirements 6.3: single-column for viewports < 1024px */}
      <div className="flex-1 px-4 lg:px-6 xl:px-8 py-4 w-full flex flex-col min-h-0 transition-all duration-300">
        {/* Back button, focus mode toggle, and completion badge in content area */}
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all backdrop-blur-sm animate-gentle-bounce"
            style={{ 
              backgroundColor: currentTheme.isDark ? `${currentTheme.colors.surface}cc` : 'rgba(255,255,255,0.8)',
              color: currentTheme.isDark ? currentTheme.colors.text : '#4b5563'
            }}
            aria-label="Go back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Reading Mode Toggle - Requirements 8.1 */}
            <ReadingModeToggle />

            {/* Completion Badge */}
            {isCompleted && (
              <span 
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium animate-badge-pop"
                style={currentTheme.isDark 
                  ? { backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' }
                  : { backgroundColor: '#dcfce7', color: '#15803d' }
                }
              >
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            )}
          </div>
        </div>
        
        {/* Two-column layout for wide screens (Requirements 6.2) */}
        <div className="flex-1 flex flex-col xl:flex-row xl:gap-6 transition-all duration-300 min-h-0">
          {/* Main content area */}
          <div className="flex-1 min-w-0 order-2 xl:order-1 flex flex-col min-h-0">
            <div 
              className="flex-1 rounded-3xl shadow-xl flex flex-col min-h-0 overflow-hidden animate-slide-up"
              style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff' }}
            >
              {/* Category Color Header */}
              <div className={`h-2 ${category?.color || 'bg-gray-400'} rounded-t-3xl`} />

              {showCompletionSummary ? (
                /* Completion Summary - Requirements 7.9 */
                <div className="p-8 animate-fade-in">
                  <div className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center animate-bounce-in">
                      <span className="text-5xl">🎉</span>
                    </div>
                    <h2 id="topic-page-title" className="text-2xl font-bold text-gray-800 mb-2">
                      Congratulations!
                    </h2>
                    <p className="text-gray-600 mb-2">
                      You've completed all sections of
                    </p>
                    <p className="text-xl font-semibold text-purple-600 mb-6">
                      {story.title}
                    </p>
                    
                    {/* Encouragement message */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
                      <p className="text-gray-700">
                        🌟 Great job on completing this learning journey! Your dedication to learning is inspiring. Take a moment to reflect on what you've learned.
                      </p>
                    </div>

                    {/* Related Topics - Requirements 6.1, 6.4 */}
                    <div className="mb-8 max-w-3xl mx-auto">
                      <RelatedTopics
                        storyId={story.id}
                        stories={stories}
                        completedStories={completedStories}
                        categories={categories}
                        onSelectStory={onSelectRelatedStory}
                        displayMode="card"
                      />
                    </div>

                    {/* Review sections */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Want to review any section?
                      </h3>
                      <div className="flex flex-wrap justify-center gap-2">
                        {LEARNING_STEPS.map((step, index) => (
                          <button
                            key={step}
                            onClick={() => handleReviewSection(step)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all animate-scale-in stagger-${index + 1} animate-gentle-bounce`}
                          >
                            {STEP_LABELS[step]}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Close button */}
                    <button
                      onClick={onClose}
                      className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all animate-scale-hover animate-glow"
                      style={{ '--glow-color': 'rgba(168, 85, 247, 0.5)' } as React.CSSProperties}
                    >
                      Back to Topics
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress Stepper - shown inline on smaller screens, hidden on xl */}
                  <div 
                    className="xl:hidden px-6 py-4"
                    style={{ 
                      backgroundColor: currentTheme.isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                      borderBottom: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#e5e7eb'}`
                    }}
                  >
                    <ProgressStepper
                      currentStep={currentStep}
                      completedSteps={completedSteps}
                      onStepClick={handleStepClick}
                      sectionProgress={sectionProgress}
                    />
                  </div>

                  {/* Step Content - Requirements 7.3 */}
                  {/* Reading Mode wrapper - Requirements 8.2, 8.3, 8.4, 8.5, 8.7 */}
                  <ReadingMode
                    isEnabled={readingSettings.readingModeEnabled}
                    onExit={exitReadingMode}
                    bottomBarSlot={
                      <KickCounter
                        storyId={story.id}
                        sectionName={currentStep}
                        isAuthenticated={true}
                        profileId="default-profile"
                        compact={true}
                      />
                    }
                  >
                    <div 
                      ref={contentContainerRef}
                      className={`${readingSettings.readingModeEnabled ? '' : 'p-6 md:p-8'} flex-1 overflow-y-auto scrollbar-hidden content-scalable`}
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      <h2 id="topic-page-title" className="sr-only">{story.title}</h2>
                      <StepTransition stepKey={currentStep} duration={400}>
                        {renderStepContent()}
                      </StepTransition>
                    </div>
                  </ReadingMode>

                  {/* Footer Actions - Requirements 7.4, 7.5 */}
                  <div 
                    className="sticky bottom-0 p-4 md:p-6 flex justify-between items-center animate-fade-in"
                    style={{ 
                      backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff',
                      borderTop: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6'}`
                    }}
                  >
                    {/* Previous button */}
                    <button
                      onClick={() => {
                        if (currentStepIndex > 0) {
                          const prevStep = LEARNING_STEPS[currentStepIndex - 1];
                          handleStepClick(prevStep);
                        }
                      }}
                      disabled={currentStepIndex === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all animate-gentle-bounce"
                      style={{ 
                        color: currentStepIndex === 0 
                          ? (currentTheme.isDark ? currentTheme.colors.border : '#9ca3af')
                          : (currentTheme.isDark ? currentTheme.colors.text : '#4b5563'),
                        cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>

                    {/* Kick Counter - Requirements 6.1: Display "Log Kick" button for logged-in users */}
                    <KickCounter
                      storyId={story.id}
                      sectionName={currentStep}
                      isAuthenticated={true}
                      profileId="default-profile"
                    />

                    {/* Continue / Complete button */}
                    {isLastStep ? (
                      <button
                        onClick={handleCompleteTopic}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all animate-scale-hover animate-glow"
                        style={{ '--glow-color': 'rgba(16, 185, 129, 0.5)' } as React.CSSProperties}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Complete Topic
                      </button>
                    ) : (
                      <button
                        onClick={handleContinue}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all animate-scale-hover animate-glow"
                        style={{ '--glow-color': 'rgba(168, 85, 247, 0.5)' } as React.CSSProperties}
                      >
                        Continue
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar - Progress Stepper and Related Topics for wide screens (Requirements 6.2) */}
          {/* In focus mode: collapsed to icon-only view, expands on hover */}
          {!showCompletionSummary && (
            <aside 
              className={`hidden xl:flex xl:flex-col xl:flex-shrink-0 order-1 xl:order-2 mb-6 xl:mb-0 transition-all duration-300 ease-in-out group ${
                readingSettings.readingModeEnabled 
                  ? 'xl:w-14 hover:xl:w-72 opacity-60 hover:opacity-100' 
                  : 'xl:w-72'
              }`}
            >
              <div 
                className={`flex-1 rounded-2xl transition-all duration-300 overflow-y-auto overflow-x-hidden scrollbar-hidden flex flex-col animate-slide-in-right ${
                  readingSettings.readingModeEnabled 
                    ? 'py-2 px-1.5 group-hover:p-5 shadow-md group-hover:shadow-lg' 
                    : 'p-5 shadow-lg'
                }`}
                style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.surface : '#ffffff' }}
              >
                {/* Collapsed view - icon only stepper (visible when not hovered in reading mode) */}
                {readingSettings.readingModeEnabled && (
                  <div className="group-hover:hidden flex flex-col items-center justify-center h-full">
                    <ProgressStepper
                      currentStep={currentStep}
                      completedSteps={completedSteps}
                      onStepClick={handleStepClick}
                      iconOnly={true}
                      sectionProgress={sectionProgress}
                    />
                  </div>
                )}
                
                {/* Expanded view (always visible in normal mode, visible on hover in reading mode) */}
                <div className={readingSettings.readingModeEnabled ? 'hidden group-hover:block' : ''}>
                  {/* Section 1: Your Progress */}
                  <h3 
                    className="text-sm font-semibold uppercase tracking-wider mb-4"
                    style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                  >
                    Your Progress
                  </h3>
                  <ProgressStepper
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={handleStepClick}
                    sidebarMode={true}
                    sectionProgress={sectionProgress}
                  />
                  
                  {/* Progress summary */}
                  <div 
                    className="mt-4 pt-4"
                    style={{ borderTop: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Completed</span>
                      <span 
                        className="font-medium"
                        style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#374151' }}
                      >
                        {completedSteps.length} / {LEARNING_STEPS.length}
                      </span>
                    </div>
                    <div 
                      className="mt-2 h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6' }}
                    >
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{ width: `${(completedSteps.length / LEARNING_STEPS.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Section 2: Related Topics - Requirements 6.5 */}
                  <div 
                    className="mt-6 pt-6"
                    style={{ borderTop: `1px solid ${currentTheme.isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
                  >
                    <RelatedTopics
                      storyId={story.id}
                      stories={stories}
                      completedStories={completedStories}
                      categories={categories}
                      onSelectStory={onSelectRelatedStory}
                      displayMode="sidebar"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * TopicPage wrapper that handles story changes by using key-based reset
 */
export const TopicPage: React.FC<TopicPageProps> = (props) => {
  const { getTopicProgress } = useTopicProgress();
  
  // Compute initial values for the inner component
  const initialValues = useMemo(() => {
    const savedProgress = getTopicProgress(props.story.id);
    // Use URL section if provided, otherwise use saved progress or default to overview
    const urlSection = props.initialSection as LearningStep | undefined;
    const savedStep = savedProgress?.currentStep;
    const initialStep = urlSection || savedStep || 'overview' as LearningStep;
    
    return {
      initialStep,
      initialCompletedSteps: savedProgress?.completedSteps || [],
    };
  }, [props.story.id, props.initialSection, getTopicProgress]);

  // Default handler for selecting related story (can be overridden via props)
  const handleSelectRelatedStory = props.onSelectRelatedStory || (() => {});
  
  // Default handler for section change (can be overridden via props)
  const handleSectionChange = props.onSectionChange || (() => {});
  
  // Key by story.id and initialSection to reset state when either changes
  return (
    <TopicPageInner
      key={`${props.story.id}-${props.initialSection || 'default'}`}
      {...props}
      initialStep={initialValues.initialStep}
      initialCompletedSteps={initialValues.initialCompletedSteps}
      completedStories={props.completedStories || []}
      onSelectRelatedStory={handleSelectRelatedStory}
      onSectionChange={handleSectionChange}
    />
  );
};

export default TopicPage;
