import React from 'react';
import type { Story } from '../../types';

/**
 * CoreContentStep component - Main learning content step
 * Requirements: 7.3 - Display only the content for the current step
 */

interface CoreContentStepProps {
  story: Story;
}

export const CoreContentStep: React.FC<CoreContentStepProps> = ({ story }) => {
  // Parse markdown-like content for better display
  const formatContent = (content: string) => {
    // Split by double newlines to get paragraphs
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
                <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3" />
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Core Content</h3>
        <p className="text-gray-500 mt-2">~30 minutes of deep learning</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="prose prose-purple max-w-none">
          {formatContent(story.content.narrative.coreContent)}
        </div>
      </div>

      {/* Key Concepts Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span> Key Concepts
        </h4>
        <ul className="space-y-2">
          {story.content.keyConcepts.map((concept, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-purple-500 mt-1">•</span>
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoreContentStep;
