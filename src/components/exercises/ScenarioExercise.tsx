import React, { useState } from 'react';
import type { ScenarioExercise as ScenarioExerciseType, ScenarioChoice } from '../../types/exercises';

interface ScenarioExerciseProps {
  exercise: ScenarioExerciseType;
  onAnswer: (selectedChoiceId: string) => void;
  onComplete: () => void;
}

/**
 * ScenarioExercise Component
 * 
 * Renders a scenario with multiple choice options and feedback.
 * 
 * Requirements:
 * - 6.5: Present a situation and multiple response options with explanatory feedback
 */
export const ScenarioExercise: React.FC<ScenarioExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleChoiceSelect = (choiceId: string) => {
    if (showFeedback) return;
    setSelectedChoice(choiceId);
  };

  const handleSubmit = () => {
    if (!selectedChoice) return;
    setShowFeedback(true);
    onAnswer(selectedChoice);
  };

  const getSelectedChoiceData = (): ScenarioChoice | undefined => {
    return exercise.choices.find(c => c.id === selectedChoice);
  };

  const getChoiceStyle = (choice: ScenarioChoice) => {
    if (!showFeedback) {
      if (selectedChoice === choice.id) {
        return 'bg-purple-100 border-purple-400';
      }
      return 'bg-white border-gray-200 hover:border-purple-300';
    }

    // Show feedback styling
    if (choice.isOptimal) {
      return 'bg-green-100 border-green-400';
    }
    if (selectedChoice === choice.id && !choice.isOptimal) {
      return 'bg-amber-100 border-amber-400';
    }
    return 'bg-gray-50 border-gray-200';
  };

  const selectedChoiceData = getSelectedChoiceData();

  return (
    <div className="space-y-6">
      {/* Scenario description */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">📖</span>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Scenario</h4>
            <p className="text-gray-700 leading-relaxed">{exercise.scenario}</p>
          </div>
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-500">What would you do?</h4>
        {exercise.choices.map((choice) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceSelect(choice.id)}
            disabled={showFeedback}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getChoiceStyle(choice)} ${
              showFeedback ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                selectedChoice === choice.id
                  ? 'border-purple-500 bg-purple-500'
                  : 'border-gray-300'
              }`}>
                {selectedChoice === choice.id && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <span className="text-gray-700">{choice.text}</span>
              {showFeedback && choice.isOptimal && (
                <span className="ml-auto text-green-600 flex-shrink-0">✓ Best choice</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && selectedChoiceData && (
        <div className={`rounded-xl p-4 ${
          selectedChoiceData.isOptimal
            ? 'bg-green-50 border border-green-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {selectedChoiceData.isOptimal ? '🌟' : '💭'}
            </span>
            <div>
              <p className={`font-medium ${
                selectedChoiceData.isOptimal ? 'text-green-800' : 'text-amber-800'
              }`}>
                {selectedChoiceData.isOptimal ? 'Great thinking!' : 'Interesting perspective!'}
              </p>
              <p className="text-gray-700 mt-1">{selectedChoiceData.feedback}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedChoice}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              !selectedChoice
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            Submit Choice
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 transition-all"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default ScenarioExercise;
