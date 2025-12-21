import React from 'react';
import type { LearningStep } from '../../contexts/TopicProgressContext';
import { LEARNING_STEPS, STEP_LABELS } from '../../contexts/TopicProgressContext';
import { useTheme } from '../../contexts/ThemeContext';
import { StepIcon } from './StepIcon';

/**
 * ProgressStepper component for displaying topic learning progress
 * Requirements: 7.2 - Show progress stepper indicating current step and remaining steps
 * Requirements: 7.6 - Allow clicking on any step to navigate directly
 * Requirements: 7.8 - Show step names: Overview, Core Content, Practice, Integration, Exercises
 * Requirements: 6.2 - Support sidebar layout for wide screens
 */

interface ProgressStepperProps {
  currentStep: LearningStep;
  completedSteps: LearningStep[];
  onStepClick: (step: LearningStep) => void;
  /** When true, renders in vertical sidebar mode for wide screens */
  sidebarMode?: boolean;
  /** When true, shows only icons (for focus mode collapsed state) */
  iconOnly?: boolean;
  /** Optional: Progress within current section (0-100) for enhanced highlighting */
  /** Requirements: 11.4 - Highlight the current section in the progress stepper */
  sectionProgress?: number;
}

// Instead of emoji icons, we'll use SVG icons directly in the component
// Icons: Overview (clipboard), Core Content (book), Practice (target), Integration (link), Exercises (pencil)

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
  sidebarMode = false,
  iconOnly = false,
  sectionProgress = 0,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const currentIndex = LEARNING_STEPS.indexOf(currentStep);

  // Icon-only mode for collapsed focus mode sidebar
  if (iconOnly) {
    return (
      <nav aria-label="Learning progress" className="w-full flex flex-col items-center py-2">
        <ol className="flex flex-col items-center gap-1">
          {LEARNING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            
            return (
              <li key={step} className="relative flex flex-col items-center">
                <button
                  onClick={() => onStepClick(step)}
                  className="relative flex items-center justify-center w-9 h-9 rounded-full focus:outline-none icon-interactive focus-ring"
                  style={{
                    backgroundColor: isCompleted 
                      ? '#22c55e'
                      : isCurrent 
                        ? '#a855f7'
                        : (isDark ? currentTheme.colors.surfaceHover : '#f3f4f6'),
                    color: isCompleted || isCurrent ? '#ffffff' : (isDark ? currentTheme.colors.textMuted : '#6b7280'),
                    boxShadow: isCurrent 
                      ? '0 0 0 3px rgba(168, 85, 247, 0.25), 0 2px 8px rgba(168, 85, 247, 0.3)' 
                      : isCompleted 
                        ? '0 2px 4px rgba(34, 197, 94, 0.2)'
                        : 'none'
                  }}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${STEP_LABELS[step]}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
                  title={STEP_LABELS[step]}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <StepIcon step={step} className="w-4 h-4" />
                  )}
                  {/* Current step pulse indicator */}
                  {isCurrent && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-purple-400" style={{ animationDuration: '2s' }} />
                  )}
                </button>
                
                {/* Vertical connector line */}
                {index < LEARNING_STEPS.length - 1 && (
                  <div 
                    className="w-0.5 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: isCompleted 
                        ? '#22c55e' 
                        : (isDark ? currentTheme.colors.border : '#e5e7eb'),
                      opacity: isCompleted ? 1 : 0.5
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>
        
        {/* Progress indicator at bottom */}
        <div 
          className="mt-3 pt-3 w-full flex flex-col items-center"
          style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}` }}
        >
          <span 
            className="text-xs font-medium"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            {completedSteps.length}/{LEARNING_STEPS.length}
          </span>
        </div>
      </nav>
    );
  }

  // Sidebar mode - vertical stepper for wide screen sidebar
  if (sidebarMode) {
    return (
      <nav aria-label="Learning progress" className="w-full">
        <ol className="space-y-3">
          {LEARNING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            
            return (
              <li key={step} className="relative">
                <button
                  onClick={() => onStepClick(step)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                  style={{
                    backgroundColor: isCurrent 
                      ? (isDark ? 'rgba(168, 85, 247, 0.15)' : '#faf5ff')
                      : isCompleted 
                        ? (isDark ? 'rgba(74, 222, 128, 0.1)' : '#f0fdf4')
                        : (isDark ? currentTheme.colors.surfaceHover : '#f9fafb'),
                    border: isCurrent 
                      ? `2px solid ${isDark ? 'rgba(168, 85, 247, 0.5)' : '#d8b4fe'}`
                      : isCompleted
                        ? `1px solid ${isDark ? 'rgba(74, 222, 128, 0.3)' : '#bbf7d0'}`
                        : `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
                  }}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {/* Step icon */}
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 text-base"
                    style={{
                      backgroundColor: isCompleted 
                        ? '#22c55e'
                        : isCurrent 
                          ? '#a855f7'
                          : (isDark ? currentTheme.colors.border : '#d1d5db'),
                      color: isCompleted || isCurrent ? '#ffffff' : (isDark ? currentTheme.colors.textMuted : '#4b5563')
                    }}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <StepIcon step={step} className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Step info */}
                  <div className="flex-1 text-left">
                    <span 
                      className="font-medium text-sm"
                      style={{
                        color: isCompleted 
                          ? (isDark ? '#4ADE80' : '#15803d')
                          : isCurrent 
                            ? (isDark ? '#C084FC' : '#7c3aed')
                            : (isDark ? currentTheme.colors.text : '#4b5563')
                      }}
                    >
                      {STEP_LABELS[step]}
                    </span>
                    {isCurrent && (
                      <>
                        <span 
                          className="block text-xs mt-0.5"
                          style={{ color: isDark ? '#C084FC' : '#a855f7' }}
                        >
                          Current step
                        </span>
                        {/* Section progress indicator - Requirements 11.4 */}
                        {sectionProgress > 0 && (
                          <div 
                            className="mt-1 h-1 w-full rounded-full overflow-hidden"
                            style={{ backgroundColor: isDark ? 'rgba(168, 85, 247, 0.2)' : '#ede9fe' }}
                          >
                            <div 
                              className="h-full rounded-full transition-all duration-150"
                              style={{ 
                                width: `${Math.min(100, sectionProgress)}%`,
                                background: 'linear-gradient(90deg, #a855f7, #ec4899)'
                              }}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </button>
                
                {/* Vertical connector line - connects bottom of icon to top of next icon */}
                {index < LEARNING_STEPS.length - 1 && (
                  <div 
                    className="absolute w-0.5 -translate-x-1/2"
                    style={{
                      left: '2rem', /* Center of the 10px (w-10) icon + 12px padding = 32px = 2rem */
                      top: 'calc(12px + 40px)', /* p-3 (12px) + icon height (40px) */
                      height: 'calc(12px + 12px)', /* gap between buttons (space-y-3 = 12px) + top padding of next button */
                    }}
                  >
                    <div 
                      className="w-full h-full transition-all duration-300"
                      style={{ backgroundColor: isCompleted ? '#22c55e' : (isDark ? currentTheme.colors.border : '#e5e7eb') }}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }

  return (
    <nav aria-label="Learning progress" className="w-full">
      {/* Desktop view - horizontal stepper */}
      <ol className="hidden md:flex items-center justify-between w-full">
        {LEARNING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isPast = index < currentIndex;
          
          return (
            <li key={step} className="flex-1 relative">
              <button
                onClick={() => onStepClick(step)}
                className={`
                  w-full flex flex-col items-center group
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-lg p-2
                  transition-all duration-200
                `}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`${STEP_LABELS[step]}${isCompleted ? ' (completed)' : isCurrent ? ' (current)' : ''}`}
              >
                {/* Step indicator */}
                <div className={`
                  relative z-10 flex items-center justify-center w-12 h-12 rounded-full
                  transition-all duration-200 text-lg
                  ${isCompleted 
                    ? 'bg-green-500 text-white shadow-md' 
                    : isCurrent 
                      ? 'bg-purple-500 text-white shadow-lg ring-4 ring-purple-200' 
                      : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <StepIcon step={step} className="w-6 h-6" />
                  )}
                </div>
                
                {/* Step label */}
                <span className={`
                  mt-2 text-sm font-medium text-center
                  ${isCompleted 
                    ? 'text-green-600' 
                    : isCurrent 
                      ? 'text-purple-600' 
                      : 'text-gray-500 group-hover:text-gray-700'
                  }
                `}>
                  {STEP_LABELS[step]}
                </span>
              </button>
              
              {/* Connector line */}
              {index < LEARNING_STEPS.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2">
                  <div className={`
                    h-full transition-all duration-300
                    ${isPast || isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile view - vertical stepper */}
      <ol className="md:hidden space-y-4">
        {LEARNING_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          
          return (
            <li key={step} className="relative">
              <button
                onClick={() => onStepClick(step)}
                className={`
                  w-full flex items-center gap-4 p-3 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition-all duration-200
                  ${isCurrent 
                    ? 'bg-purple-50 border-2 border-purple-300' 
                    : isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }
                `}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step number/icon */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                
                {/* Step info */}
                <div className="flex-1 text-left">
                  <span className={`
                    font-medium
                    ${isCompleted 
                      ? 'text-green-700' 
                      : isCurrent 
                        ? 'text-purple-700' 
                        : 'text-gray-600'
                    }
                  `}>
                    {STEP_LABELS[step]}
                  </span>
                  {isCurrent && (
                    <>
                      <span className="block text-xs text-purple-500 mt-0.5">Current step</span>
                      {/* Section progress indicator - Requirements 11.4 */}
                      {sectionProgress > 0 && (
                        <div className="mt-1 h-1 w-full rounded-full overflow-hidden bg-purple-100">
                          <div 
                            className="h-full rounded-full transition-all duration-150"
                            style={{ 
                              width: `${Math.min(100, sectionProgress)}%`,
                              background: 'linear-gradient(90deg, #a855f7, #ec4899)'
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Arrow indicator */}
                <svg className={`
                  w-5 h-5 flex-shrink-0
                  ${isCurrent ? 'text-purple-400' : 'text-gray-400'}
                `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default ProgressStepper;
