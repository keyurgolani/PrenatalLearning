import React, { useState, useCallback, useMemo } from 'react';
import type { Story, Category } from '../../types';
import type { LearningStep } from '../../contexts/TopicProgressContext';
import { LEARNING_STEPS, STEP_LABELS, useTopicProgress } from '../../contexts/TopicProgressContext';
import { ProgressStepper } from './ProgressStepper';
import { OverviewStep } from './OverviewStep';
import { CoreContentStep } from './CoreContentStep';
import { PracticeStep } from './PracticeStep';
import { IntegrationStep } from './IntegrationStep';
import { ExercisesStep } from './ExercisesStep';

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
}

/**
 * Inner component that handles the topic page state
 * This is keyed by story.id in the parent to reset state on story change
 */
interface TopicPageInnerProps extends TopicPageProps {
  initialStep: LearningStep;
  initialCompletedSteps: LearningStep[];
}

const TopicPageInner: React.FC<TopicPageInnerProps> = ({
  story,
  category,
  isCompleted,
  onClose,
  onComplete,
  initialStep,
  initialCompletedSteps,
}) => {
  const { setCurrentStep, completeStep } = useTopicProgress();
  
  const [currentStep, setCurrentStepLocal] = useState<LearningStep>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<LearningStep[]>(initialCompletedSteps);
  const [showCompletionSummary, setShowCompletionSummary] = useState(false);

  const currentStepIndex = LEARNING_STEPS.indexOf(currentStep);
  const isLastStep = currentStepIndex === LEARNING_STEPS.length - 1;

  // Handle step navigation via stepper
  const handleStepClick = useCallback((step: LearningStep) => {
    setCurrentStepLocal(step);
    setCurrentStep(story.id, step);
  }, [story.id, setCurrentStep]);

  // Handle Continue button - complete current step and move to next
  const handleContinue = useCallback(() => {
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
    }
  }, [currentStep, currentStepIndex, isLastStep, completedSteps, story.id, completeStep, setCurrentStep]);

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
    setShowCompletionSummary(false);
    setCurrentStepLocal(step);
    setCurrentStep(story.id, step);
  }, [story.id, setCurrentStep]);

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

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-page-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-start justify-center p-4 pt-8 pb-20">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden">
          {/* Category Color Header */}
          <div className={`h-2 ${category?.color || 'bg-gray-400'}`} />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all z-10"
            aria-label="Close topic"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Completion Badge */}
          {isCompleted && (
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </span>
            </div>
          )}

          {showCompletionSummary ? (
            /* Completion Summary - Requirements 7.9 */
            <div className="p-8">
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
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

                {/* Review sections */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Want to review any section?
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {LEARNING_STEPS.map((step) => (
                      <button
                        key={step}
                        onClick={() => handleReviewSection(step)}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                      >
                        {STEP_LABELS[step]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Progress Stepper - Requirements 7.2, 7.6, 7.8 */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <ProgressStepper
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                  onStepClick={handleStepClick}
                />
              </div>

              {/* Step Content - Requirements 7.3 */}
              <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
                <h2 id="topic-page-title" className="sr-only">{story.title}</h2>
                {renderStepContent()}
              </div>

              {/* Footer Actions - Requirements 7.4, 7.5 */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 md:p-6 flex justify-between items-center">
                {/* Previous button */}
                <button
                  onClick={() => {
                    if (currentStepIndex > 0) {
                      const prevStep = LEARNING_STEPS[currentStepIndex - 1];
                      handleStepClick(prevStep);
                    }
                  }}
                  disabled={currentStepIndex === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    currentStepIndex === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {/* Continue / Complete button */}
                {isLastStep ? (
                  <button
                    onClick={handleCompleteTopic}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Complete Topic
                  </button>
                ) : (
                  <button
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all"
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
    return {
      initialStep: savedProgress?.currentStep || 'overview' as LearningStep,
      initialCompletedSteps: savedProgress?.completedSteps || [],
    };
  }, [props.story.id, getTopicProgress]);
  
  // Key by story.id to reset state when story changes
  return (
    <TopicPageInner
      key={props.story.id}
      {...props}
      initialStep={initialValues.initialStep}
      initialCompletedSteps={initialValues.initialCompletedSteps}
    />
  );
};

export default TopicPage;
