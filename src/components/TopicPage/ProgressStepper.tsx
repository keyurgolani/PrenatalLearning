import React from 'react';
import type { LearningStep } from '../../contexts/TopicProgressContext';
import { LEARNING_STEPS, STEP_LABELS } from '../../contexts/TopicProgressContext';

/**
 * ProgressStepper component for displaying topic learning progress
 * Requirements: 7.2 - Show progress stepper indicating current step and remaining steps
 * Requirements: 7.6 - Allow clicking on any step to navigate directly
 * Requirements: 7.8 - Show step names: Overview, Core Content, Practice, Integration, Exercises
 */

interface ProgressStepperProps {
  currentStep: LearningStep;
  completedSteps: LearningStep[];
  onStepClick: (step: LearningStep) => void;
}

const STEP_ICONS: Record<LearningStep, string> = {
  'overview': '📋',
  'core-content': '📚',
  'practice': '🎯',
  'integration': '🔗',
  'exercises': '✏️',
};

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  const currentIndex = LEARNING_STEPS.indexOf(currentStep);

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
                    <span>{STEP_ICONS[step]}</span>
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
                    <span className="block text-xs text-purple-500 mt-0.5">Current step</span>
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
