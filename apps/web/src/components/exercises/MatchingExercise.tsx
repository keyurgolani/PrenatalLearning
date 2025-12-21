import React, { useState } from 'react';
import type { MatchingExercise as MatchingExerciseType } from '../../types/exercises';
import { validateMatchingPairs } from '../../utils/exerciseValidation';
import type { UserMatch } from '../../utils/exerciseValidation';
import { PartyPopper, Lightbulb, ArrowRight } from 'lucide-react';

interface MatchingExerciseProps {
  exercise: MatchingExerciseType;
  onAnswer: (matches: UserMatch[], allCorrect: boolean) => void;
  onComplete: () => void;
}

/**
 * MatchingExercise Component
 * 
 * Renders left and right columns for tap-to-match pairing.
 * 
 * Requirements:
 * - 6.2: Allow tap-to-match pairing of related concepts with validation
 */
export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matches, setMatches] = useState<Map<string, string>>(new Map());
  const [showFeedback, setShowFeedback] = useState(false);
  const [validationResults, setValidationResults] = useState<Map<string, boolean>>(new Map());

  // Shuffle right items for display
  const [shuffledRight] = useState(() => {
    const items = exercise.pairs.map(p => ({ id: p.id, text: p.right }));
    return items.sort(() => Math.random() - 0.5);
  });

  const handleLeftClick = (pairId: string) => {
    if (showFeedback) return;
    if (matches.has(pairId)) {
      // Remove existing match
      const newMatches = new Map(matches);
      newMatches.delete(pairId);
      setMatches(newMatches);
    }
    setSelectedLeft(pairId === selectedLeft ? null : pairId);
  };

  const handleRightClick = (pairId: string) => {
    if (showFeedback || !selectedLeft) return;
    
    // Check if this right item is already matched
    const existingMatch = Array.from(matches.entries()).find(([, rightId]) => rightId === pairId);
    if (existingMatch) {
      // Remove the existing match
      const newMatches = new Map(matches);
      newMatches.delete(existingMatch[0]);
      newMatches.set(selectedLeft, pairId);
      setMatches(newMatches);
    } else {
      setMatches(new Map(matches).set(selectedLeft, pairId));
    }
    setSelectedLeft(null);
  };

  const handleSubmit = () => {
    const userMatches: UserMatch[] = Array.from(matches.entries()).map(([leftId, rightId]) => ({
      leftId,
      rightId,
    }));

    const result = validateMatchingPairs(exercise.pairs, userMatches);
    
    const resultsMap = new Map<string, boolean>();
    result.results.forEach(r => {
      resultsMap.set(r.leftId, r.correct);
    });
    setValidationResults(resultsMap);
    setShowFeedback(true);
    onAnswer(userMatches, result.allCorrect);
  };

  const getLeftItemStyle = (pairId: string) => {
    if (showFeedback) {
      const isCorrect = validationResults.get(pairId);
      if (isCorrect === true) return 'bg-green-100 border-green-400';
      if (isCorrect === false) return 'bg-red-100 border-red-400';
      return 'bg-gray-100 border-gray-300';
    }
    if (selectedLeft === pairId) return 'bg-purple-100 border-purple-400';
    if (matches.has(pairId)) return 'bg-blue-100 border-blue-400';
    return 'bg-white border-gray-200 hover:border-purple-300';
  };

  const getRightItemStyle = (pairId: string) => {
    const matchedLeftId = Array.from(matches.entries()).find(([, rightId]) => rightId === pairId)?.[0];
    
    if (showFeedback && matchedLeftId) {
      const isCorrect = validationResults.get(matchedLeftId);
      if (isCorrect === true) return 'bg-green-100 border-green-400';
      if (isCorrect === false) return 'bg-red-100 border-red-400';
    }
    if (matchedLeftId) return 'bg-blue-100 border-blue-400';
    return 'bg-white border-gray-200 hover:border-purple-300';
  };

  const allMatched = matches.size === exercise.pairs.length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-4">
        <p className="text-gray-700">{exercise.instructions}</p>
        <p className="text-sm text-gray-500 mt-2">
          Tap an item on the left, then tap its match on the right.
        </p>
      </div>

      {/* Matching columns */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 text-center">Items</h4>
          {exercise.pairs.map((pair) => (
            <button
              key={pair.id}
              onClick={() => handleLeftClick(pair.id)}
              disabled={showFeedback}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${getLeftItemStyle(pair.id)} ${
                showFeedback ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="text-gray-700">{pair.left}</span>
              {matches.has(pair.id) && (
                <ArrowRight className="ml-2 w-4 h-4 text-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-500 text-center">Matches</h4>
          {shuffledRight.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={showFeedback || !selectedLeft}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all ${getRightItemStyle(item.id)} ${
                showFeedback || !selectedLeft ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="text-gray-700">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`rounded-xl p-4 ${
          validationResults.size === exercise.pairs.length && 
          Array.from(validationResults.values()).every(v => v)
            ? 'bg-green-50 border border-green-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            {Array.from(validationResults.values()).every(v => v) ? (
              <PartyPopper className="w-8 h-8 text-green-500" />
            ) : (
              <Lightbulb className="w-8 h-8 text-amber-500" />
            )}
            <div>
              <p className="font-medium text-gray-800">
                {Array.from(validationResults.values()).filter(v => v).length} of {exercise.pairs.length} correct!
              </p>
              {!Array.from(validationResults.values()).every(v => v) && (
                <p className="text-gray-600 mt-1">
                  Review the highlighted items to see the correct matches.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showFeedback ? (
          <button
            onClick={handleSubmit}
            disabled={!allMatched}
            className={`px-6 py-2 rounded-lg font-medium button-interactive ${
              !allMatched
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            Check Matches
          </button>
        ) : (
          <button
            onClick={onComplete}
            className="px-6 py-2 rounded-lg font-medium bg-purple-500 text-white hover:bg-purple-600 button-interactive"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default MatchingExercise;
