import React, { useState } from 'react';
import type { FillBlankExercise as FillBlankExerciseType } from '../../types/exercises';
import { validateAllFillBlanks } from '../../utils/exerciseValidation';
import type { FillBlankValidationResult } from '../../utils/exerciseValidation';

interface FillBlankExerciseProps {
  exercise: FillBlankExerciseType;
  onAnswer: (answers: Map<string, string>, results: FillBlankValidationResult[]) => void;
  onComplete: () => void;
}

/**
 * FillBlankExercise Component
 * 
 * Renders sentences with input fields for blanks.
 * 
 * Requirements:
 * - 6.4: Present sentences with missing words and validate user input
 * - 6.6: Display encouraging feedback with hints for incorrect answers
 */
export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  exercise,
  onAnswer,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [showFeedback, setShowFeedback] = useState(false);
  const [validationResults, setValidationResults] = useState<FillBlankValidationResult[]>([]);

  const handleInputChange = (sentenceId: string, value: string) => {
    if (showFeedback) return;
    setAnswers(new Map(answers).set(sentenceId, value));
  };

  const handleSubmit = () => {
    const results = validateAllFillBlanks(exercise.sentences, answers);
    setValidationResults(results);
    setShowFeedback(true);
    onAnswer(answers, results);
  };

  const getResultForSentence = (sentenceId: string): FillBlankValidationResult | undefined => {
    return validationResults.find(r => r.sentenceId === sentenceId);
  };

  const renderSentenceWithBlank = (template: string, sentenceId: string) => {
    const parts = template.split('___');
    const result = getResultForSentence(sentenceId);
    const sentence = exercise.sentences.find(s => s.id === sentenceId);
    
    return (
      <span className="text-gray-700 leading-relaxed">
        {parts[0]}
        <span className="inline-block mx-1">
          <input
            type="text"
            value={answers.get(sentenceId) || ''}
            onChange={(e) => handleInputChange(sentenceId, e.target.value)}
            disabled={showFeedback}
            className={`w-32 px-2 py-1 border-b-2 text-center focus:outline-none transition-all ${
              showFeedback
                ? result?.correct
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : 'border-purple-300 focus:border-purple-500'
            }`}
            placeholder="..."
          />
          {showFeedback && !result?.correct && (
            <span className="ml-2 text-green-600 text-sm">
              ({sentence?.answer})
            </span>
          )}
        </span>
        {parts[1]}
      </span>
    );
  };

  const allAnswered = exercise.sentences.every(s => {
    const answer = answers.get(s.id);
    return answer && answer.trim().length > 0;
  });

  const correctCount = validationResults.filter(r => r.correct).length;

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-purple-50 rounded-xl p-4">
        <p className="text-gray-700">Fill in the blanks with the correct words.</p>
      </div>

      {/* Sentences */}
      <div className="space-y-4">
        {exercise.sentences.map((sentence, index) => {
          const result = getResultForSentence(sentence.id);
          
          return (
            <div
              key={sentence.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                showFeedback
                  ? result?.correct
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium text-sm flex-shrink-0 mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  {renderSentenceWithBlank(sentence.template, sentence.id)}
                  
                  {/* Hint for incorrect answers */}
                  {showFeedback && !result?.correct && sentence.hint && (
                    <div className="mt-2 text-sm text-amber-700 bg-amber-50 rounded p-2">
                      💡 Hint: {sentence.hint}
                    </div>
                  )}
                </div>
                
                {/* Result indicator */}
                {showFeedback && (
                  <span className={`text-lg flex-shrink-0 ${result?.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {result?.correct ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className={`rounded-xl p-4 ${
          correctCount === exercise.sentences.length
            ? 'bg-green-50 border border-green-200'
            : 'bg-amber-50 border border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {correctCount === exercise.sentences.length ? '🎉' : '💡'}
            </span>
            <div>
              <p className={`font-medium ${
                correctCount === exercise.sentences.length ? 'text-green-800' : 'text-amber-800'
              }`}>
                {correctCount} of {exercise.sentences.length} correct!
              </p>
              {correctCount < exercise.sentences.length && (
                <p className="text-gray-600 mt-1">
                  The correct answers are shown in green next to your responses.
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
            disabled={!allAnswered}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              !allAnswered
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            Check Answers
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

export default FillBlankExercise;
