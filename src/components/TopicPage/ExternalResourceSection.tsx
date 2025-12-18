import React, { useState, useCallback } from 'react';
import type { ExternalResource } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * ExternalResourceSection component - Displays curated external educational resources
 * Requirements: 6.1 - Display "Resources" section when topic has external resources
 * Requirements: 6.2 - Show resource title, source name, and resource type
 * Requirements: 6.3 - Open external resource links in new browser tab
 * Requirements: 6.4 - Embed resource content directly for embeddable resources
 * Requirements: 6.5 - Provide fallback link if embedding fails
 */

interface ExternalResourceSectionProps {
  resources: ExternalResource[];
}

/**
 * Get icon for resource type
 */
const getResourceTypeIcon = (type: ExternalResource['type']): React.ReactNode => {
  switch (type) {
    case 'video':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      );
    case 'article':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    case 'tutorial':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      );
    case 'interactive':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
        </svg>
      );
  }
};

/**
 * Get label for resource type
 */
const getResourceTypeLabel = (type: ExternalResource['type']): string => {
  switch (type) {
    case 'video':
      return 'Video';
    case 'article':
      return 'Article';
    case 'tutorial':
      return 'Tutorial';
    case 'interactive':
      return 'Interactive';
    default:
      return 'Resource';
  }
};

/**
 * Get color styles for resource type badge
 */
const getResourceTypeColor = (type: ExternalResource['type'], isDark: boolean): { backgroundColor: string; color: string } => {
  const colors: Record<string, { light: { bg: string; text: string }; dark: { bg: string; text: string } }> = {
    video: { light: { bg: '#fee2e2', text: '#b91c1c' }, dark: { bg: 'rgba(239, 68, 68, 0.2)', text: '#F87171' } },
    article: { light: { bg: '#dbeafe', text: '#1d4ed8' }, dark: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60A5FA' } },
    tutorial: { light: { bg: '#dcfce7', text: '#15803d' }, dark: { bg: 'rgba(34, 197, 94, 0.2)', text: '#4ADE80' } },
    interactive: { light: { bg: '#f3e8ff', text: '#7c3aed' }, dark: { bg: 'rgba(168, 85, 247, 0.2)', text: '#C084FC' } },
  };
  const colorSet = colors[type] || colors.interactive;
  return isDark 
    ? { backgroundColor: colorSet.dark.bg, color: colorSet.dark.text }
    : { backgroundColor: colorSet.light.bg, color: colorSet.light.text };
};

/**
 * Individual resource card component
 */
interface ResourceCardProps {
  resource: ExternalResource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;
  const [embedError, setEmbedError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEmbedError = useCallback(() => {
    setEmbedError(true);
  }, []);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const hasEmbed = resource.embedUrl && !embedError;
  const canEmbed = resource.type === 'video' && hasEmbed;
  const typeColors = getResourceTypeColor(resource.type, isDark);

  return (
    <div 
      className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ 
        backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`
      }}
    >
      {/* Resource Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Title and Source */}
            <h4 
              className="font-semibold mb-1 line-clamp-2"
              style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
            >
              {resource.title}
            </h4>
            <p 
              className="text-sm mb-2"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {resource.source}
            </p>
            
            {/* Description */}
            {resource.description && (
              <p 
                className="text-sm line-clamp-2"
                style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
              >
                {resource.description}
              </p>
            )}
          </div>

          {/* Type Badge */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={typeColors}
          >
            {getResourceTypeIcon(resource.type)}
            <span>{getResourceTypeLabel(resource.type)}</span>
          </div>
        </div>
      </div>

      {/* Embedded Content (for videos) - Requirements 6.4 */}
      {canEmbed && (
        <div style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}>
          {isExpanded ? (
            <div className="relative">
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={resource.embedUrl}
                  title={resource.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onError={handleEmbedError}
                />
              </div>
              <button
                onClick={toggleExpand}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Collapse video"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={toggleExpand}
              className="w-full p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
              style={{ 
                color: isDark ? '#C084FC' : '#9333ea',
              }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Watch Video
            </button>
          )}
        </div>
      )}

      {/* Fallback Link - Requirements 6.3, 6.5 */}
      <div className="px-4 pb-4 pt-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: isDark ? '#C084FC' : '#9333ea' }}
        >
          {embedError ? 'Video unavailable - ' : ''}
          Open in new tab
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
};

/**
 * ExternalResourceSection component
 * Displays a section of curated external resources for a topic
 */
export const ExternalResourceSection: React.FC<ExternalResourceSectionProps> = ({ resources }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Don't render if no resources - Requirements 6.1
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <section className="mt-8" aria-labelledby="external-resources-heading">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2 rounded-lg"
          style={isDark 
            ? { backgroundColor: 'rgba(168, 85, 247, 0.2)' }
            : { background: 'linear-gradient(to right, #f3e8ff, #fce7f3)' }
          }
        >
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            style={{ color: isDark ? '#C084FC' : '#9333ea' }}
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </div>
        <div>
          <h3 
            id="external-resources-heading" 
            className="text-lg font-semibold"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            External Resources
          </h3>
          <p 
            className="text-sm"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            Curated content to deepen your understanding
          </p>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </section>
  );
};

export default ExternalResourceSection;
