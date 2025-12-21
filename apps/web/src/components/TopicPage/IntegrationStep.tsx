import React, { useMemo } from 'react';
import type { Story } from '../../types';
import type { ImageManifestEntry } from '../../types/media';
import { useTheme } from '../../contexts/ThemeContext';
import { useReadingMode } from '../../contexts/ReadingModeContext';
import { getReadingTimeForText, formatReadingTime } from '../../utils/readingTime';
import { useMediaAssets, getImageUrl, getAudioUrl } from '../../hooks/useMediaAssets';
import { StoryImage } from '../StoryImage';
import { NarrateButton } from '../NarrateButton';
import { 
  determineInlineImagePlacements, 
  getPositionedImages,
  type InlineImagePlacement 
} from '../../utils/contentImageMatcher';

/**
 * IntegrationStep component - Integration and reflection content
 * Requirements: 7.3 - Display only the content for the current step
 */

interface IntegrationStepProps {
  story: Story;
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ story }) => {
  const { currentTheme } = useTheme();
  const { settings: readingSettings } = useReadingMode();
  const isDark = currentTheme.isDark ?? false;

  // Load media assets for this story
  const { audioSegments, images } = useMediaAssets(story.id);

  // Get audio for the integration section (may have multiple parts)
  const integrationAudio = audioSegments.get('integration');
  const audioAvailable = !!integrationAudio && integrationAudio.parts.length > 0;
  const audioSources = integrationAudio 
    ? integrationAudio.parts.map(part => getAudioUrl(story.id, part.filename))
    : [];

  // Get images for the integration section - memoized to prevent unnecessary re-renders
  const sectionImages = useMemo(() => images.get('integration') || [], [images]);
  
  // Determine intelligent inline placements for analogy/concept images
  const inlinePlacements = useMemo(() => {
    return determineInlineImagePlacements(
      story.content.narrative.integration,
      sectionImages,
      story.content.analogies,
      story.content.keyConcepts
    );
  }, [story.content.narrative.integration, sectionImages, story.content.analogies, story.content.keyConcepts]);
  
  // Get before/after images, excluding those that will be placed inline
  const beforeImages = useMemo(() => 
    getPositionedImages(sectionImages, 'before', inlinePlacements),
    [sectionImages, inlinePlacements]
  );
  const afterImages = useMemo(() => 
    getPositionedImages(sectionImages, 'after', inlinePlacements),
    [sectionImages, inlinePlacements]
  );
  
  // Create a map of paragraph index to images that should appear after it
  const imagesByParagraph = useMemo(() => {
    const map = new Map<number, InlineImagePlacement[]>();
    for (const placement of inlinePlacements) {
      const existing = map.get(placement.afterParagraphIndex) || [];
      existing.push(placement);
      map.set(placement.afterParagraphIndex, existing);
    }
    return map;
  }, [inlinePlacements]);

  // Calculate reading time for integration section
  const integrationReadingTime = getReadingTimeForText(
    story.content.narrative.integration,
    readingSettings.readingPace
  );

  // Parse the integration content with inline images
  const formatContent = (content: string) => {
    const sections = content.split(/\n\n+/);
    const elements: React.ReactNode[] = [];

    sections.forEach((section, index) => {
      // Check if it's a heading (starts with **)
      if (section.startsWith('**') && section.includes('**')) {
        const headingMatch = section.match(/^\*\*(.+?)\*\*/);
        if (headingMatch) {
          const heading = headingMatch[1];
          const rest = section.replace(/^\*\*.+?\*\*\s*/, '');
          elements.push(
            <div key={`section-${index}`} className="mb-6">
              <h4
                className="text-xl font-semibold mb-3 flex items-center"
                style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
              >
                <span className="w-1.5 h-6 bg-teal-500 rounded-full mr-3" />
                {heading}
              </h4>
              {rest && (
                <p
                  className="leading-relaxed"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
                >
                  {rest}
                </p>
              )}
            </div>
          );
        }
      } else {
        // Regular paragraph
        elements.push(
          <p
            key={`section-${index}`}
            className="leading-relaxed mb-4"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
          >
            {section}
          </p>
        );
      }

      // Add any inline images that should appear after this paragraph
      const imagesForParagraph = imagesByParagraph.get(index);
      if (imagesForParagraph && imagesForParagraph.length > 0) {
        elements.push(
          <div
            key={`images-${index}`}
            className="flex flex-wrap justify-center gap-4 my-4"
          >
            {imagesForParagraph.map((placement, imgIndex) => (
              <StoryImage
                key={`inline-${index}-${imgIndex}`}
                src={getImageUrl(story.id, placement.image.filename)}
                alt={placement.image.altText}
                caption={placement.image.caption}
              />
            ))}
          </div>
        );
      }
    });

    return elements;
  };

  const isReadingMode = readingSettings.readingModeEnabled;

  return (
    <div className="space-y-6">
      {/* Section Header - smaller in reading mode, expands on hover */}
      <div 
        className={`group text-center transition-all duration-300 ${
          isReadingMode 
            ? 'mb-4 opacity-60 hover:opacity-100 hover:mb-8' 
            : 'mb-8'
        }`}
      >
        <div
          className={`inline-flex items-center justify-center rounded-full mb-4 transition-all duration-300 ${
            isReadingMode 
              ? 'w-0 h-0 opacity-0 group-hover:w-16 group-hover:h-16 group-hover:opacity-100' 
              : 'w-16 h-16'
          }`}
          style={
            isDark
              ? { backgroundColor: 'rgba(20, 184, 166, 0.2)', color: '#2DD4BF' }
              : { backgroundColor: '#ccfbf1', color: '#0d9488' }
          }
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3
          className={`font-bold transition-all duration-300 ${
            isReadingMode 
              ? 'text-sm group-hover:text-2xl' 
              : 'text-2xl'
          }`}
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          Integration
          <span 
            className={`ml-2 font-normal text-xs transition-all duration-300 ${
              isReadingMode 
                ? 'inline group-hover:hidden' 
                : 'hidden'
            }`}
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            · {formatReadingTime(integrationReadingTime)}
          </span>
        </h3>
        <p
          className={`mt-2 inline-flex items-center transition-all duration-300 ${
            isReadingMode 
              ? 'h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100' 
              : ''
          }`}
          style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
        >
          <svg className="mr-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {formatReadingTime(integrationReadingTime)} of reflection and connection
        </p>
      </div>

      {/* Integration Content */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={
          isDark
            ? {
                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
              }
            : { background: 'linear-gradient(to bottom right, #f0fdfa, #ecfeff)' }
        }
      >
        {/* Narrate Button - plays entire section audio */}
        <NarrateButton 
          audioAvailable={audioAvailable} 
          audioSources={audioSources} 
          sectionName="Integration"
          storyId={story.id}
          storyTitle={story.title}
        />

        {/* Before images */}
        {beforeImages.map((img: ImageManifestEntry, index: number) => (
          <StoryImage
            key={`before-${index}`}
            src={getImageUrl(story.id, img.filename)}
            alt={img.altText}
            caption={img.caption}
            displayMode="full"
          />
        ))}

        <div className="prose prose-teal max-w-none">
          {formatContent(story.content.narrative.integration)}
        </div>

        {/* After images */}
        {afterImages.map((img: ImageManifestEntry, index: number) => (
          <StoryImage
            key={`after-${index}`}
            src={getImageUrl(story.id, img.filename)}
            alt={img.altText}
            caption={img.caption}
            displayMode="full"
          />
        ))}
      </div>

      {/* Mother Activities */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h4
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          <span className="mr-2">🤰</span> Recommended Activities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className="rounded-xl p-4"
            style={
              isDark
                ? {
                    backgroundColor: 'rgba(236, 72, 153, 0.15)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                  }
                : { backgroundColor: '#fdf2f8', border: '1px solid #fbcfe8' }
            }
          >
            <h5 style={{ color: isDark ? '#F472B6' : '#9d174d' }} className="font-medium mb-1">
              💕 Gentle Touch
            </h5>
            <p className="text-sm" style={{ color: isDark ? '#F9A8D4' : '#be185d' }}>
              Place hands on belly, sending loving thoughts to your baby
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={
              isDark
                ? {
                    backgroundColor: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }
                : { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }
            }
          >
            <h5 style={{ color: isDark ? '#60A5FA' : '#1e40af' }} className="font-medium mb-1">
              🌬️ Breathing Exercise
            </h5>
            <p className="text-sm" style={{ color: isDark ? '#93C5FD' : '#1d4ed8' }}>
              Deep, rhythmic breathing to relax and connect
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={
              isDark
                ? {
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }
                : { backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }
            }
          >
            <h5 style={{ color: isDark ? '#C084FC' : '#6b21a8' }} className="font-medium mb-1">
              ✨ Visualization
            </h5>
            <p className="text-sm" style={{ color: isDark ? '#D8B4FE' : '#7c3aed' }}>
              Imagine concepts as colors and feelings flowing to baby
            </p>
          </div>
          <div
            className="rounded-xl p-4"
            style={
              isDark
                ? {
                    backgroundColor: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                  }
                : { backgroundColor: '#fffbeb', border: '1px solid #fde68a' }
            }
          >
            <h5 style={{ color: isDark ? '#FBBF24' : '#92400e' }} className="font-medium mb-1">
              📝 Journaling
            </h5>
            <p className="text-sm" style={{ color: isDark ? '#FCD34D' : '#b45309' }}>
              Record your thoughts and feelings after each session
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationStep;
