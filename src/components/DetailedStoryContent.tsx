import React, { useState } from 'react';
import { getStoryContent } from '../data';
import type { TopicExercise, Analogy } from '../data/stories/big-bang-story';

interface DetailedStoryContentProps {
  storyId: number;
}

type TabType = 'narrative' | 'exercises' | 'concepts';

/**
 * DetailedStoryContent component for displaying rich story content
 * from the stories directory with full narratives and exercises
 */
export const DetailedStoryContent: React.FC<DetailedStoryContentProps> = ({ storyId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('narrative');
  const [expandedSection, setExpandedSection] = useState<string | null>('introduction');

  const storyContent = getStoryContent(storyId);

  if (!storyContent) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Detailed content not available for this story yet.</p>
      </div>
    );
  }

  const narrativeSections = [
    { key: 'introduction', label: 'Introduction', duration: '~5 min', icon: '🌅' },
    { key: 'coreContent', label: 'Core Content', duration: '~30 min', icon: '📚' },
    { key: 'interactiveSection', label: 'Interactive Section', duration: '~15 min', icon: '✨' },
    { key: 'integration', label: 'Integration & Closing', duration: '~10 min', icon: '🌙' },
  ] as const;

  const exerciseTypeConfig: Record<string, { icon: string; color: string; bgColor: string }> = {
    reflection: { icon: '🪞', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
    'thought-experiment': { icon: '💭', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    visualization: { icon: '🎨', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
    discussion: { icon: '💬', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    creative: { icon: '🎭', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
    breathing: { icon: '🌬️', color: 'text-teal-700', bgColor: 'bg-teal-50 border-teal-200' },
  };

  const tabs = [
    { key: 'narrative' as TabType, label: 'Full Narrative', icon: '📖' },
    { key: 'exercises' as TabType, label: 'Deep Exercises', icon: '🎯' },
    { key: 'concepts' as TabType, label: 'Key Concepts', icon: '💡' },
  ];

  const renderNarrativeContent = (content: string) => {
    // Split by markdown-style headers and render with formatting
    const paragraphs = content.split('\n\n');
    return paragraphs.map((para, idx) => {
      if (para.startsWith('**') && para.endsWith('**')) {
        // Bold header
        return (
          <h4 key={idx} className="text-lg font-semibold text-gray-800 mt-6 mb-3">
            {para.replace(/\*\*/g, '')}
          </h4>
        );
      }
      if (para.startsWith('**')) {
        // Bold header with content after
        const match = para.match(/^\*\*(.+?)\*\*(.*)$/s);
        if (match) {
          return (
            <div key={idx}>
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
                {match[1]}
              </h4>
              {match[2] && <p className="text-gray-700 leading-relaxed">{match[2].trim()}</p>}
            </div>
          );
        }
      }
      return (
        <p key={idx} className="text-gray-700 leading-relaxed mb-4">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Narrative Tab */}
      {activeTab === 'narrative' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 italic">
            Click on each section to expand the full narrative content for reading aloud.
          </p>
          {narrativeSections.map((section) => (
            <div
              key={section.key}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(
                  expandedSection === section.key ? null : section.key
                )}
                className="w-full bg-gradient-to-r from-gray-50 to-white px-5 py-4 flex items-center justify-between hover:from-purple-50 hover:to-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">{section.label}</h4>
                    <span className="text-sm text-gray-500">{section.duration}</span>
                  </div>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedSection === section.key ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedSection === section.key && (
                <div className="px-5 py-4 bg-white border-t border-gray-100 max-h-96 overflow-y-auto animate-expand">
                  {renderNarrativeContent(storyContent.narrative[section.key])}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-500 italic mb-4">
            These exercises help you engage more deeply with the material before sharing it with your baby.
          </p>
          {storyContent.exercises.map((exercise: TopicExercise, index: number) => {
            const config = exerciseTypeConfig[exercise.type] || exerciseTypeConfig.reflection;
            return (
              <div
                key={index}
                className={`rounded-xl p-5 border ${config.bgColor}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{config.icon}</span>
                  <span className={`text-sm font-medium ${config.color} capitalize`}>
                    {exercise.type.replace('-', ' ')}
                  </span>
                  {exercise.duration && (
                    <span className="text-xs text-gray-500 ml-auto">
                      ~{exercise.duration} min
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">{exercise.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
                {exercise.guidance && (
                  <div className="bg-white/50 rounded-lg p-3 mb-4 text-sm text-gray-600 italic">
                    💡 {exercise.guidance}
                  </div>
                )}
                <div className="space-y-3">
                  {exercise.prompts.map((prompt: string, promptIndex: number) => (
                    <div key={promptIndex} className="flex items-start gap-3">
                      <span className={`${config.color} font-bold mt-0.5`}>→</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Concepts Tab */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          {/* Key Concepts */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>💡</span> Key Concepts to Remember
            </h4>
            <ul className="space-y-2">
              {storyContent.keyConcepts.map((concept: string, index: number) => (
                <li key={index} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3">
                  <span className="text-yellow-600 font-bold">{index + 1}.</span>
                  <span className="text-gray-700">{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Analogies */}
          {storyContent.analogies && storyContent.analogies.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🌈</span> Helpful Analogies
              </h4>
              <div className="grid gap-3">
                {storyContent.analogies.map((analogy: string | Analogy, index: number) => (
                  <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                    {typeof analogy === 'string' ? (
                      <p className="text-gray-700 italic">"{analogy}"</p>
                    ) : (
                      <>
                        <p className="font-medium text-purple-800 mb-1">{analogy.concept}</p>
                        <p className="text-gray-700 italic">"{analogy.analogy}"</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailedStoryContent;
