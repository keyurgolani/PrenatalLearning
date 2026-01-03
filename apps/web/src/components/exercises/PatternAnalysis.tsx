/**
 * Pattern Analysis Exercise Component
 * Step-by-step guided pattern discovery with data visualization
 */

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { PatternAnalysisExercise as PatternAnalysisType } from '../../types/exercises';

interface Props {
  exercise: PatternAnalysisType;
  onComplete: () => void;
}

export const PatternAnalysis: React.FC<Props> = ({ exercise, onComplete }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResponses, setStepResponses] = useState<Record<number, string>>({});
  const [stepResults, setStepResults] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState(false);
  const [patternRevealed, setPatternRevealed] = useState(false);

  const currentAnalysisStep = exercise.analysisSteps[currentStep];
  const isLastStep = currentStep === exercise.analysisSteps.length - 1;
  const allStepsCompleted = Object.keys(stepResults).length === exercise.analysisSteps.length;

  const handleResponseChange = (value: string) => {
    setStepResponses({ ...stepResponses, [currentStep]: value });
    setShowHint(false);
  };

  const checkStepAnswer = () => {
    const response = stepResponses[currentStep]?.toLowerCase().trim() || '';
    const expected = currentAnalysisStep.expectedInsight.toLowerCase().trim();
    
    // Simple matching - could be made more sophisticated
    const isCorrect = response.includes(expected) || 
                      expected.includes(response) ||
                      response.length > 10; // Accept longer thoughtful responses
    
    setStepResults({ ...stepResults, [currentStep]: isCorrect });
    
    if (isCorrect && !isLastStep) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setShowHint(false);
      }, 1500);
    }
  };

  const revealPattern = () => {
    setPatternRevealed(true);
  };

  const renderDataVisualization = () => {
    switch (exercise.dataType) {
      case 'numerical':
        return (
          <div className="flex flex-wrap gap-3 justify-center">
            {exercise.dataset.map((item, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                  color: currentTheme.colors.text,
                  border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                }}
              >
                {item.value}
              </div>
            ))}
          </div>
        );
      
      case 'visual':
        return (
          <div className="grid grid-cols-4 gap-3">
            {exercise.dataset.map((item, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                  border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                }}
              >
                {item.image ? (
                  <img src={item.image} alt={`Pattern item ${idx + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                    {item.value}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      
      case 'textual':
        return (
          <div className="space-y-2">
            {exercise.dataset.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                  border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                }}
              >
                <p 
                  className="text-sm"
                  style={{ color: currentTheme.colors.text }}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="flex flex-wrap gap-2">
            {exercise.dataset.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                  color: currentTheme.colors.text,
                }}
              >
                {item.value}
              </span>
            ))}
          </div>
        );
    }
  };

  const renderStepInput = () => {
    const response = stepResponses[currentStep] || '';
    
    switch (currentAnalysisStep.inputType) {
      case 'multiple-choice':
        return (
          <div className="space-y-2">
            {currentAnalysisStep.options?.map((option, idx) => {
              const isSelected = response === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleResponseChange(option)}
                  className="w-full text-left p-3 rounded-lg text-sm transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? (isDark ? `${currentTheme.colors.primary}30` : '#f3e8ff')
                      : isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                    color: currentTheme.colors.text,
                    border: `1px solid ${isSelected ? currentTheme.colors.primary : isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );
      
      case 'select':
        return (
          <select
            value={response}
            onChange={(e) => handleResponseChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : 'white',
              color: currentTheme.colors.text,
              border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          >
            <option value="">Select an answer...</option>
            {currentAnalysisStep.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <textarea
            value={response}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder="Type your observation..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring resize-none"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : 'white',
              color: currentTheme.colors.text,
              border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Data visualization */}
      <div 
        className="p-4 rounded-xl"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h4 
          className="text-sm font-semibold mb-4"
          style={{ color: currentTheme.colors.text }}
        >
          Observe the Data
        </h4>
        {renderDataVisualization()}
      </div>

      {/* Pattern types */}
      <div className="flex flex-wrap gap-2">
        {exercise.patternTypes.map((type) => (
          <span
            key={type}
            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
            style={{
              backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#f3e8ff',
              color: currentTheme.colors.primary,
            }}
          >
            {type}
          </span>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {exercise.analysisSteps.map((_, idx) => (
          <div
            key={idx}
            className="flex-1 h-2 rounded-full transition-colors"
            style={{
              backgroundColor: idx < currentStep
                ? currentTheme.colors.primary
                : idx === currentStep
                  ? `${currentTheme.colors.primary}50`
                  : isDark ? currentTheme.colors.border : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {/* Current analysis step */}
      {!allStepsCompleted && (
        <div 
          className="p-4 rounded-xl space-y-4"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span 
                className="text-xs font-medium"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                Step {currentStep + 1} of {exercise.analysisSteps.length}
              </span>
              <p 
                className="text-sm font-medium mt-1"
                style={{ color: currentTheme.colors.text }}
              >
                {currentAnalysisStep.prompt}
              </p>
            </div>
            
            {currentAnalysisStep.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs font-medium transition-colors"
                style={{ color: currentTheme.colors.primary }}
              >
                Hint
              </button>
            )}
          </div>

          {showHint && currentAnalysisStep.hint && (
            <div 
              className="p-3 rounded-lg animate-fade-in"
              style={{
                backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
                border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
              }}
            >
              <p 
                className="text-sm"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#7c3aed' }}
              >
                {currentAnalysisStep.hint}
              </p>
            </div>
          )}

          {renderStepInput()}

          {/* Step result feedback */}
          {stepResults[currentStep] !== undefined && (
            <div 
              className="p-3 rounded-lg animate-fade-in"
              style={{
                backgroundColor: stepResults[currentStep]
                  ? (isDark ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4')
                  : (isDark ? 'rgba(251, 191, 36, 0.1)' : '#fffbeb'),
                border: `1px solid ${stepResults[currentStep]
                  ? (isDark ? 'rgba(34, 197, 94, 0.2)' : '#bbf7d0')
                  : (isDark ? 'rgba(251, 191, 36, 0.2)' : '#fde68a')
                }`,
              }}
            >
              <p 
                className="text-sm"
                style={{ 
                  color: stepResults[currentStep] 
                    ? (isDark ? '#4ade80' : '#166534')
                    : (isDark ? '#fbbf24' : '#92400e')
                }}
              >
                {stepResults[currentStep] 
                  ? 'Good observation!' 
                  : `Consider: ${currentAnalysisStep.expectedInsight}`
                }
              </p>
            </div>
          )}

          {stepResults[currentStep] === undefined && (
            <button
              onClick={checkStepAnswer}
              disabled={!stepResponses[currentStep]?.trim()}
              className="w-full py-2.5 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: stepResponses[currentStep]?.trim()
                  ? currentTheme.colors.primary
                  : isDark ? currentTheme.colors.border : '#e5e7eb',
                color: stepResponses[currentStep]?.trim()
                  ? 'white'
                  : isDark ? currentTheme.colors.textMuted : '#9ca3af',
                cursor: stepResponses[currentStep]?.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Check
            </button>
          )}
        </div>
      )}

      {/* Pattern reveal */}
      {allStepsCompleted && !patternRevealed && (
        <button
          onClick={revealPattern}
          className="w-full py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: currentTheme.colors.primary }}
        >
          Reveal the Pattern
        </button>
      )}

      {patternRevealed && (
        <div 
          className={`p-4 rounded-xl space-y-4 ${exercise.revealAnimation ? 'animate-fade-in' : ''}`}
          style={{
            backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
            border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
          }}
        >
          <h4 
            className="text-sm font-semibold"
            style={{ color: currentTheme.colors.text }}
          >
            The Hidden Pattern
          </h4>
          <p 
            className="text-sm"
            style={{ color: currentTheme.colors.text }}
          >
            {exercise.hiddenPattern}
          </p>
          
          <div 
            className="pt-3"
            style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#e9d5ff'}` }}
          >
            <h5 
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              Reflection
            </h5>
            <p 
              className="text-sm"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {exercise.reflection}
            </p>
          </div>
        </div>
      )}

      {/* Complete button */}
      {patternRevealed && (
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-medium text-white transition-colors"
          style={{ backgroundColor: '#22c55e' }}
        >
          Complete Exercise
        </button>
      )}
    </div>
  );
};

export default PatternAnalysis;
