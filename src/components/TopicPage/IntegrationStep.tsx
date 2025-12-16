import React from 'react';
import type { Story } from '../../types';

/**
 * IntegrationStep component - Integration and reflection content
 * Requirements: 7.3 - Display only the content for the current step
 */

interface IntegrationStepProps {
  story: Story;
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ story }) => {
  // Parse the integration content
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
            <div key={index} className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3" />
                {heading}
              </h4>
              {rest && <p className="text-gray-700 leading-relaxed">{rest}</p>}
            </div>
          );
        }
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-4">
          {section}
        </p>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 text-teal-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Integration</h3>
        <p className="text-gray-500 mt-2">~10 minutes of reflection and connection</p>
      </div>

      {/* Integration Content */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 md:p-8">
        <div className="prose prose-teal max-w-none">
          {formatContent(story.content.narrative.integration)}
        </div>
      </div>

      {/* Mother Activities */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🤰</span> Recommended Activities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
            <h5 className="font-medium text-pink-800 mb-1">💕 Gentle Touch</h5>
            <p className="text-sm text-pink-700">Place hands on belly, sending loving thoughts to your baby</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h5 className="font-medium text-blue-800 mb-1">🌬️ Breathing Exercise</h5>
            <p className="text-sm text-blue-700">Deep, rhythmic breathing to relax and connect</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h5 className="font-medium text-purple-800 mb-1">✨ Visualization</h5>
            <p className="text-sm text-purple-700">Imagine concepts as colors and feelings flowing to baby</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h5 className="font-medium text-amber-800 mb-1">📝 Journaling</h5>
            <p className="text-sm text-amber-700">Record your thoughts and feelings after each session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStep;
