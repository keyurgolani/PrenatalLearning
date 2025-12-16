import React, { useState, useEffect, useCallback } from 'react';
import type { ReflectionExercise as ReflectionExerciseType, ReflectionResponseData } from '../../types/exercises';

interface ReflectionExerciseProps {
  exercise: ReflectionExerciseType;
  previousResponses?: ReflectionResponseData;
  onAutoSave: (responses: ReflectionResponseData) => void;
  onComplete: () => void;
}

/**
 * ReflectionExercise Component
 * 
 * Renders prompts with text input areas for journaling.
 * 
 * Requirements:
 * - 2.2: Provide text input area for journaling responses to each prompt
 * - 3.2: Display previous responses if available
 */
export const ReflectionExercise: React.FC<ReflectionExerciseProps> = ({
  exercise,
  previousResponses,
  onAutoSave,
  onComplete,
}) => {
  // Initialize responses from previous data or empty
  const [responses, setResponses] = useState<Map<number, string>>(() => {
    const map = new Map<number, string>();
    if (previousResponses?.responses) {
      previousResponses.responses.forEach(r => {
        map.set(r.promptIndex, r.text);
      });
    }
    return map;
  });

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save debounce
  const saveResponses = useCallback(() => {
    const responseData: ReflectionResponseData = {
      responses: Array.from(responses.entries()).map(([promptIndex, text]) => ({
        promptIndex,
        text,
      })),
    };
    onAutoSave(responseData);
    setLastSaved(new Date());
  }, [responses, onAutoSave]);

  // Auto-save on changes with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (responses.size > 0) {
        saveResponses();
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [responses, saveResponses]);

  const handleInputChange = (promptIndex: number, value: string) => {
    setResponses(new Map(responses).set(promptIndex, value));
  };

  const hasAnyResponse = Array.from(responses.values()).some(r => r.trim().length > 0);

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🪞</span>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Reflection Time</h4>
            <p className="text-gray-600">
              Take a moment to reflect on these prompts. There are no right or wrong answers—this is your personal space for journaling and connecting with your thoughts.
            </p>
          </div>
        </div>
      </div>

      {/* Prompts with text areas */}
      <div className="space-y-6">
        {exercise.prompts.map((prompt, index) => (
          <div key={index} className="space-y-2">
            <label className="block">
              <div className="flex items-start gap-3 mb-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium text-sm flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700 font-medium">{prompt}</span>
              </div>
              <textarea
                value={responses.get(index) || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Write your thoughts here..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:outline-none resize-none transition-colors"
              />
            </label>
          </div>
        ))}
      </div>

      {/* Auto-save indicator */}
      {lastSaved && (
        <div className="text-sm text-gray-500 text-center">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved automatically
          </span>
        </div>
      )}

      {/* Guidance */}
      {exercise.guidance && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-2">
            <span className="text-amber-600">💡</span>
            <p className="text-amber-800 text-sm">{exercise.guidance}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={onComplete}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            hasAnyResponse
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          {hasAnyResponse ? 'Complete Reflection' : 'Skip for Now'}
        </button>
      </div>
    </div>
  );
};

export default ReflectionExercise;
