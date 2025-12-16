import React from 'react';
import type { Story, Category } from '../../types';
import { getExternalResources } from '../../data/externalResources';
import { ExternalResourceSection } from './ExternalResourceSection';

/**
 * OverviewStep component - First step in the guided learning experience
 * Requirements: 7.3 - Display only the content for the current step
 * Requirements: 6.1 - Display "Resources" section when topic has external resources
 */

interface OverviewStepProps {
  story: Story;
  category: Category | undefined;
}

export const OverviewStep: React.FC<OverviewStepProps> = ({ story, category }) => {
  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="text-center">
        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white ${category?.color || 'bg-gray-400'} mb-4`}>
          {category?.name || 'Unknown Category'}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          {story.title}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {story.description}
        </p>
      </div>

      {/* Metadata Cards */}
      <div className="flex flex-wrap justify-center gap-3">
        <div className="flex items-center px-4 py-2 rounded-xl bg-purple-50 text-purple-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{story.duration} minutes</span>
        </div>
        <div className={`flex items-center px-4 py-2 rounded-xl ${
          story.difficulty === 'foundational' ? 'bg-green-50 text-green-700' :
          story.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
          'bg-red-50 text-red-700'
        }`}>
          <span className="font-medium capitalize">{story.difficulty}</span>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🌟</span> Introduction
        </h3>
        <div className="prose prose-purple max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {story.content.narrative.introduction}
          </p>
        </div>
      </div>

      {/* Key Concepts Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span> What You'll Learn
        </h3>
        <ul className="space-y-3">
          {story.content.keyConcepts.slice(0, 3).map((concept, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-gray-700">{concept}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* External Resources Section - Requirements 6.1, 6.2, 6.3, 6.4, 6.5 */}
      <ExternalResourceSection resources={getExternalResources(story.id)} />
    </div>
  );
};

export default OverviewStep;
