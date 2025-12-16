import React from 'react';
import type { Story } from '../../types';

/**
 * PracticeStep component - Interactive practice activities
 * Requirements: 7.3 - Display only the content for the current step
 */

interface PracticeStepProps {
  story: Story;
}

export const PracticeStep: React.FC<PracticeStepProps> = ({ story }) => {
  // Parse the interactive section content
  const formatContent = (content: string) => {
    const sections = content.split(/\n\n+/);
    
    return sections.map((section, index) => {
      // Check if it's a heading (starts with **)
      if (section.startsWith('**') && section.includes('**')) {
        const headingMatch = section.match(/^\*\*(.+?)\*\*/);
        if (headingMatch) {
          const heading = headingMatch[1];
          const rest = section.replace(/^\*\*.+?\*\*\s*/, '');
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mr-3">
                  🎯
                </span>
                {heading}
              </h4>
              {rest && <p className="text-gray-700 leading-relaxed">{rest}</p>}
            </div>
          );
        }
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4 pl-4 border-l-2 border-amber-200">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Practice Activities</h3>
        <p className="text-gray-500 mt-2">~15 minutes of guided activities</p>
      </div>

      {/* Interactive Content */}
      <div className="space-y-4">
        {formatContent(story.content.narrative.interactiveSection)}
      </div>

      {/* Helpful Analogies */}
      {story.content.analogies.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🌈</span> Helpful Analogies
          </h4>
          <div className="space-y-3">
            {story.content.analogies.map((analogy, index) => (
              <div key={index} className="bg-white/60 rounded-xl p-4 border border-amber-100">
                <p className="text-gray-700 italic">"{analogy}"</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeStep;
