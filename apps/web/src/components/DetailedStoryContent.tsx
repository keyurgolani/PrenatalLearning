import React, { useState } from 'react';
import { 
  Sunrise, Book, Sparkles, Moon, User, MessageCircle, 
  Palette, MessageSquare, Wind, Target, BookOpen, Lightbulb, ArrowRight
} from 'lucide-react';
import { getStoryContent } from '../data';
import type { TopicExercise } from '../types';

interface DetailedStoryContentProps {
  storyId: number;
}

type TabType = 'narrative' | 'exercises' | 'concepts';

export const DetailedStoryContent: React.FC<DetailedStoryContentProps> = ({ storyId }) => {
  const [activeTab, setActiveTab] = useState<TabType>('narrative');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const storyContent = getStoryContent(storyId);

  if (!storyContent) {
    return (
      <div className="p-8 text-center text-gray-500">
        Content not available for this story yet.
      </div>
    );
  }

  const narrativeSections = [
    { key: 'introduction', label: 'Introduction', duration: '~5 min', icon: <Sunrise className="w-5 h-5" /> },
    { key: 'coreContent', label: 'Core Content', duration: '~30 min', icon: <Book className="w-5 h-5" /> },
    { key: 'interactiveSection', label: 'Interactive Section', duration: '~15 min', icon: <Sparkles className="w-5 h-5" /> },
    { key: 'integration', label: 'Integration & Closing', duration: '~10 min', icon: <Moon className="w-5 h-5" /> },
  ] as const;

  const exerciseTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
    reflection: { icon: <User className="w-5 h-5" />, color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
    'thought-experiment': { icon: <MessageCircle className="w-5 h-5" />, color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
    visualization: { icon: <Palette className="w-5 h-5" />, color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
    discussion: { icon: <MessageSquare className="w-5 h-5" />, color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
    creative: { icon: <Palette className="w-5 h-5" />, color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
    breathing: { icon: <Wind className="w-5 h-5" />, color: 'text-teal-700', bgColor: 'bg-teal-50 border-teal-200' },
  };

  const tabs = [
    { key: 'narrative' as TabType, label: 'Full Narrative', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'exercises' as TabType, label: 'Deep Exercises', icon: <Target className="w-4 h-4" /> },
    { key: 'concepts' as TabType, label: 'Key Concepts', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  const renderNarrativeContent = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className="mb-4 text-gray-700 leading-relaxed last:mb-0">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-medium button-interactive flex items-center whitespace-nowrap ${
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
                  <span className="text-gray-600">{section.icon}</span>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">{section.label}</h4>
                    <span className="text-sm text-gray-500">{section.duration}</span>
                  </div>
                </div>
                {/* Arrow icon */}
                 <svg 
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedSection === section.key ? 'rotate-180' : ''}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
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
          {!storyContent.exercises || storyContent.exercises.length === 0 ? (
             <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-100">
                <Target className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p>No additional deep exercises for this topic.</p>
             </div>
          ) : (
            storyContent.exercises.map((exercise: TopicExercise, index: number) => {
              const config = exerciseTypeConfig[exercise.type] || exerciseTypeConfig.reflection;
              return (
                <div
                  key={index}
                  className={`rounded-xl p-5 border ${config.bgColor}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${config.color}`}>{config.icon}</span>
                    <span className={`text-sm font-medium ${config.color} capitalize`}>
                      {exercise.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto bg-white/50 px-2 py-0.5 rounded-full">
                      ~{exercise.duration} mins
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{exercise.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{exercise.description}</p>
                  
                  {exercise.guidance && (
                    <div className="bg-white/50 rounded-lg p-3 mb-4 text-sm text-gray-600 italic flex items-start gap-2 border border-white/50">
                      <Lightbulb className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                      <span>{exercise.guidance}</span>
                    </div>
                  )}

                  <div className="space-y-2 bg-white/40 rounded-lg p-3">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Prompts</h5>
                    {exercise.prompts.map((prompt: string, promptIndex: number) => (
                      <div key={promptIndex} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{prompt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Concepts Tab */}
      {activeTab === 'concepts' && (
        <div className="space-y-6">
          {/* Key Concepts */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" /> Key Concepts to Remember
            </h4>
            <ul className="space-y-2">
              {storyContent.keyConcepts.map((concept: string, index: number) => (
                <li key={index} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3 border border-yellow-100">
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
                <Sparkles className="w-5 h-5 text-purple-500" /> Helpful Analogies
              </h4>
              <div className="grid gap-3">
                {storyContent.analogies.map((analogy: string | { analogy: string }, index: number) => (
                  <div key={index} className="bg-purple-50 rounded-lg p-4 border border-purple-100 italic text-purple-900">
                    "{typeof analogy === 'string' ? analogy : analogy.analogy}"
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
