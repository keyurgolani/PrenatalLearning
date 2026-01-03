/**
 * Builder Exercise Component
 * Dynamic form-based content building with live preview
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { BuilderExercise as BuilderExerciseType } from '../../types/exercises';

interface Props {
  exercise: BuilderExerciseType;
  onComplete: () => void;
}

export const BuilderExercise: React.FC<Props> = ({ exercise, onComplete }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [showExamples, setShowExamples] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Generate preview from template
  const preview = useMemo(() => {
    let result = exercise.template;
    for (const [key, value] of Object.entries(inputs)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`);
    }
    return result;
  }, [exercise.template, inputs]);

  const handleInputChange = (componentId: string, value: string) => {
    setInputs({ ...inputs, [componentId]: value });
    
    // Clear validation error when user types
    if (validationErrors[componentId]) {
      const newErrors = { ...validationErrors };
      delete newErrors[componentId];
      setValidationErrors(newErrors);
    }
  };

  const validateInputs = (): boolean => {
    const errors: Record<string, string> = {};
    
    for (const component of exercise.components) {
      const value = inputs[component.id] || '';
      const validation = component.validation;
      
      if (validation?.required && !value.trim()) {
        errors[component.id] = 'This field is required';
        continue;
      }
      
      if (validation?.minLength && value.length < validation.minLength) {
        errors[component.id] = `Minimum ${validation.minLength} characters required`;
        continue;
      }
      
      if (validation?.maxLength && value.length > validation.maxLength) {
        errors[component.id] = `Maximum ${validation.maxLength} characters allowed`;
        continue;
      }
      
      if (validation?.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          errors[component.id] = 'Invalid format';
        }
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      onComplete();
    }
  };

  const renderComponent = (component: BuilderExerciseType['components'][0]) => {
    const value = inputs[component.id] || '';
    const error = validationErrors[component.id];
    
    const baseInputStyle = {
      backgroundColor: isDark ? currentTheme.colors.surfaceHover : 'white',
      color: currentTheme.colors.text,
      border: `1px solid ${error ? '#ef4444' : isDark ? currentTheme.colors.border : '#e5e7eb'}`,
    };

    switch (component.type) {
      case 'input':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            placeholder={component.placeholder}
            className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring"
            style={baseInputStyle}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            placeholder={component.placeholder}
            rows={4}
            className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring resize-none"
            style={baseInputStyle}
          />
        );
      
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(component.id, e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm transition-colors focus-ring"
            style={baseInputStyle}
          >
            <option value="">Select an option...</option>
            {component.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div 
        className="p-4 rounded-xl"
        style={{
          backgroundColor: isDark ? `${currentTheme.colors.primary}15` : '#faf5ff',
          border: `1px solid ${isDark ? `${currentTheme.colors.primary}30` : '#e9d5ff'}`,
        }}
      >
        <p 
          className="text-sm"
          style={{ color: currentTheme.colors.text }}
        >
          {exercise.instructions}
        </p>
      </div>

      {/* Examples toggle */}
      {exercise.examples.length > 0 && (
        <div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: currentTheme.colors.primary }}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${showExamples ? 'rotate-90' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showExamples ? 'Hide Examples' : 'Show Examples'}
          </button>
          
          {showExamples && (
            <div className="mt-3 space-y-3 animate-fade-in">
              {exercise.examples.map((example, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
                    border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
                  }}
                >
                  <p 
                    className="text-sm font-medium mb-2"
                    style={{ color: currentTheme.colors.text }}
                  >
                    Example {idx + 1}
                  </p>
                  <div 
                    className="text-sm mb-2 p-2 rounded"
                    style={{ 
                      backgroundColor: isDark ? currentTheme.colors.surface : 'white',
                      color: isDark ? currentTheme.colors.textMuted : '#6b7280',
                    }}
                  >
                    {example.output}
                  </div>
                  <p 
                    className="text-xs"
                    style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                  >
                    {example.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Form components */}
      <div 
        className="p-4 rounded-xl space-y-4"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h4 
          className="text-sm font-semibold"
          style={{ color: currentTheme.colors.text }}
        >
          Build Your Content
        </h4>
        
        {exercise.components.map((component) => (
          <div key={component.id} className="space-y-1">
            <label 
              className="text-sm font-medium block"
              style={{ color: currentTheme.colors.text }}
            >
              {component.label}
              {component.validation?.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>
            
            {renderComponent(component)}
            
            {component.helpText && !validationErrors[component.id] && (
              <p 
                className="text-xs"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
              >
                {component.helpText}
              </p>
            )}
            
            {validationErrors[component.id] && (
              <p className="text-xs text-red-500">
                {validationErrors[component.id]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Live preview */}
      {exercise.previewEnabled && (
        <div 
          className="p-4 rounded-xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
        >
          <h4 
            className="text-sm font-semibold mb-3"
            style={{ color: currentTheme.colors.text }}
          >
            Preview
          </h4>
          <div 
            className="p-3 rounded-lg whitespace-pre-wrap"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surface : 'white',
              color: currentTheme.colors.text,
              border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
            }}
          >
            {preview}
          </div>
        </div>
      )}

      {/* Success criteria */}
      <div 
        className="p-4 rounded-xl"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surface : 'white',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h4 
          className="text-sm font-semibold mb-2"
          style={{ color: currentTheme.colors.text }}
        >
          Success Criteria
        </h4>
        <ul className="space-y-1">
          {exercise.successCriteria.map((criteria, idx) => (
            <li 
              key={idx}
              className="flex items-start gap-2 text-sm"
            >
              <svg 
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
                {criteria}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl font-medium text-white transition-colors"
        style={{ backgroundColor: currentTheme.colors.primary }}
      >
        Complete Exercise
      </button>
    </div>
  );
};

export default BuilderExercise;
