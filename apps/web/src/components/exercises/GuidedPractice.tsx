/**
 * Guided Practice Exercise Component
 * Step-by-step guided exercises with timers and checkpoints
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { GuidedPracticeExercise as GuidedPracticeType } from '../../types/exercises';

interface Props {
  exercise: GuidedPracticeType;
  onComplete: () => void;
}

export const GuidedPractice: React.FC<Props> = ({ exercise, onComplete }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [checkpointResponse, setCheckpointResponse] = useState<string | null>(null);
  const [checkpointFeedback, setCheckpointFeedback] = useState<string | null>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStep = exercise.steps[currentStepIndex];
  const isLastStep = currentStepIndex === exercise.steps.length - 1;
  const allStepsCompleted = completedSteps.size === exercise.steps.length;

  // Initialize step timer
  useEffect(() => {
    setStepTimeRemaining(currentStep.duration);
    setCheckpointResponse(null);
    setCheckpointFeedback(null);
  }, [currentStep]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && stepTimeRemaining > 0) {
      interval = setInterval(() => {
        setStepTimeRemaining((prev) => prev - 1);
        setTotalTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (stepTimeRemaining === 0 && isPlaying) {
      // Step completed
      setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));
      setIsPlaying(false);
      
      // Auto-advance if no checkpoint
      if (!currentStep.checkpoint && !isLastStep) {
        setTimeout(() => {
          setCurrentStepIndex(currentStepIndex + 1);
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying, stepTimeRemaining, currentStep, currentStepIndex, isLastStep]);

  // Breathing animation effect
  useEffect(() => {
    if (!isPlaying || currentStep.visualGuide !== 'breathing-circle') return;

    const breathCycle = () => {
      setBreathPhase('inhale');
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 6000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 12000);
    return () => clearInterval(interval);
  }, [isPlaying, currentStep.visualGuide]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckpointResponse = (response: string) => {
    setCheckpointResponse(response);
    if (currentStep.checkpoint?.feedback[response]) {
      setCheckpointFeedback(currentStep.checkpoint.feedback[response]);
    }
  };

  const handleNextStep = useCallback(() => {
    if (!isLastStep) {
      setCurrentStepIndex(currentStepIndex + 1);
      setIsPlaying(false);
    }
  }, [currentStepIndex, isLastStep]);

  const handleSkip = () => {
    if (exercise.canSkip) {
      setCompletedSteps((prev) => new Set([...prev, currentStepIndex]));
      handleNextStep();
    }
  };

  const renderVisualGuide = () => {
    switch (currentStep.visualGuide) {
      case 'breathing-circle':
        return (
          <div className="flex justify-center my-6">
            <div 
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-[4000ms] ${
                breathPhase === 'inhale' ? 'scale-100' : breathPhase === 'hold' ? 'scale-100' : 'scale-75'
              }`}
              style={{
                backgroundColor: `${currentTheme.colors.primary}20`,
                border: `3px solid ${currentTheme.colors.primary}`,
              }}
            >
              <span 
                className="text-sm font-medium capitalize"
                style={{ color: currentTheme.colors.primary }}
              >
                {breathPhase}
              </span>
            </div>
          </div>
        );
      
      case 'progress-bar':
        const progress = ((currentStep.duration - stepTimeRemaining) / currentStep.duration) * 100;
        return (
          <div className="my-6">
            <div 
              className="h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: isDark ? currentTheme.colors.border : '#e5e7eb' }}
            >
              <div 
                className="h-full transition-all duration-1000"
                style={{ 
                  width: `${progress}%`,
                  backgroundColor: currentTheme.colors.primary,
                }}
              />
            </div>
          </div>
        );
      
      case 'timer':
        return (
          <div className="flex justify-center my-6">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                border: `3px solid ${currentTheme.colors.primary}`,
              }}
            >
              <span 
                className="text-2xl font-bold font-mono"
                style={{ color: currentTheme.colors.text }}
              >
                {formatTime(stepTimeRemaining)}
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="flex items-center justify-between">
        <span 
          className="text-sm"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          Step {currentStepIndex + 1} of {exercise.steps.length}
        </span>
        <span 
          className="text-sm font-mono"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          {formatTime(totalTimeElapsed)} / {formatTime(exercise.totalDuration)}
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex gap-1">
        {exercise.steps.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: completedSteps.has(idx)
                ? currentTheme.colors.primary
                : idx === currentStepIndex
                  ? `${currentTheme.colors.primary}50`
                  : isDark ? currentTheme.colors.border : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {/* Current step content */}
      <div 
        className="p-6 rounded-xl"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        {/* Instruction */}
        <p 
          className="text-center text-lg leading-relaxed"
          style={{ color: currentTheme.colors.text }}
        >
          {currentStep.instruction}
        </p>

        {/* Visual guide */}
        {renderVisualGuide()}

        {/* Timer display (if no visual guide) */}
        {!currentStep.visualGuide && (
          <div className="text-center my-6">
            <span 
              className="text-4xl font-bold font-mono"
              style={{ color: currentTheme.colors.text }}
            >
              {formatTime(stepTimeRemaining)}
            </span>
          </div>
        )}

        {/* Checkpoint */}
        {currentStep.checkpoint && stepTimeRemaining === 0 && (
          <div 
            className="mt-6 p-4 rounded-xl animate-fade-in"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
              border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          >
            <p 
              className="text-sm font-medium mb-3"
              style={{ color: currentTheme.colors.text }}
            >
              {currentStep.checkpoint.question}
            </p>
            
            <div className="space-y-2">
              {currentStep.checkpoint.options.map((option, idx) => {
                const isSelected = checkpointResponse === option;
                return (
                  <button
                    key={idx}
                    onClick={() => handleCheckpointResponse(option)}
                    className="w-full text-left p-3 rounded-lg text-sm transition-all"
                    style={{
                      backgroundColor: isSelected
                        ? (isDark ? `${currentTheme.colors.primary}30` : '#f3e8ff')
                        : isDark ? currentTheme.colors.surface : 'white',
                      color: currentTheme.colors.text,
                      border: `1px solid ${isSelected ? currentTheme.colors.primary : isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {checkpointFeedback && (
              <p 
                className="mt-3 text-sm animate-fade-in"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {checkpointFeedback}
              </p>
            )}
          </div>
        )}

        {/* Transition text */}
        {currentStep.transitionText && stepTimeRemaining === 0 && !currentStep.checkpoint && (
          <p 
            className="text-center text-sm mt-4 animate-fade-in"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            {currentStep.transitionText}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {/* Play/Pause button */}
        {stepTimeRemaining > 0 && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            style={{
              backgroundColor: currentTheme.colors.primary,
              color: 'white',
            }}
          >
            {isPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
                {exercise.canPause ? 'Pause' : 'Playing...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                {completedSteps.has(currentStepIndex) ? 'Replay' : 'Start'}
              </>
            )}
          </button>
        )}

        {/* Skip button */}
        {exercise.canSkip && stepTimeRemaining > 0 && (
          <button
            onClick={handleSkip}
            className="px-4 py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
              color: currentTheme.colors.text,
            }}
          >
            Skip
          </button>
        )}

        {/* Next button (after step completion) */}
        {stepTimeRemaining === 0 && !isLastStep && (
          <button
            onClick={handleNextStep}
            disabled={currentStep.checkpoint && !checkpointResponse}
            className="flex-1 py-3 rounded-xl font-medium transition-colors"
            style={{
              backgroundColor: (currentStep.checkpoint && !checkpointResponse)
                ? (isDark ? currentTheme.colors.border : '#e5e7eb')
                : currentTheme.colors.primary,
              color: (currentStep.checkpoint && !checkpointResponse)
                ? (isDark ? currentTheme.colors.textMuted : '#9ca3af')
                : 'white',
              cursor: (currentStep.checkpoint && !checkpointResponse) ? 'not-allowed' : 'pointer',
            }}
          >
            Next Step
          </button>
        )}
      </div>

      {/* Completion */}
      {(allStepsCompleted || (isLastStep && stepTimeRemaining === 0)) && (
        <div 
          className="p-4 rounded-xl animate-fade-in"
          style={{
            backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4',
            border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.2)' : '#bbf7d0'}`,
          }}
        >
          <h4 
            className="font-semibold mb-2"
            style={{ color: isDark ? '#4ade80' : '#166534' }}
          >
            Practice Complete!
          </h4>
          
          {exercise.completionReflection.length > 0 && (
            <div className="space-y-2 mb-4">
              {exercise.completionReflection.map((reflection, idx) => (
                <p 
                  key={idx}
                  className="text-sm"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                >
                  {reflection}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={onComplete}
            className="w-full py-3 rounded-xl font-medium text-white transition-colors"
            style={{ backgroundColor: '#22c55e' }}
          >
            Complete Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidedPractice;
