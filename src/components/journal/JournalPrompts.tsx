import React, { useMemo } from 'react';
import type { JournalPrompt } from '../../types/journal';
import { getPromptsForStory, getGeneralPrompts } from '../../data/journalPrompts';

/**
 * JournalPrompts component for displaying reflection prompts
 * 
 * Requirements:
 * - 10.1: Display 2-3 reflection prompts relevant to the current story
 * - 10.2: Allow users to select a prompt to pre-fill the journal entry
 * - 10.3: Provide general prompts when not on a specific story page
 * - 10.4: Rotate prompts to provide variety over time
 * 
 * Design Properties:
 * - Property 14: Journal prompt count (2-3 per story)
 */

interface JournalPromptsProps {
  /** Story ID for story-specific prompts */
  storyId?: number;
  /** Callback when a prompt is selected */
  onSelectPrompt: (prompt: string) => void;
  /** Custom class name */
  className?: string;
}

export const JournalPrompts: React.FC<JournalPromptsProps> = ({
  storyId,
  onSelectPrompt,
  className = '',
}) => {
  // Get prompts based on story ID (Property 14: 2-3 prompts)
  const prompts = useMemo<JournalPrompt[]>(() => {
    if (storyId) {
      return getPromptsForStory(storyId);
    }
    return getGeneralPrompts();
  }, [storyId]);

  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <span>Need inspiration?</span>
      </div>
      
      <div className="space-y-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt.text)}
            className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-sm text-gray-700 transition-all group"
          >
            <div className="flex items-start gap-2">
              <span className="text-purple-400 group-hover:text-purple-600 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <span className="flex-1">{prompt.text}</span>
              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <p className="text-xs text-gray-400 text-center">
        Click a prompt to start writing
      </p>
    </div>
  );
};

export default JournalPrompts;
