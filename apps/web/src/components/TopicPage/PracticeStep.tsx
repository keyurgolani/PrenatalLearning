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
 * PracticeStep component - Interactive practice activities
 * Requirements: 7.3 - Display only the content for the current step
 */

interface PracticeStepProps {
  story: Story;
}

export const PracticeStep: React.FC<PracticeStepProps> = ({ story }) => {
  const { currentTheme } = useTheme();
  const { settings: readingSettings } = useReadingMode();
  const isDark = currentTheme.isDark ?? false;

  // Load media assets for this story
  const { audioSegments, images } = useMediaAssets(story.id);

  // Get audio for the interactiveSection (may have multiple parts)
  const practiceAudio = audioSegments.get('interactiveSection');
  const audioAvailable = !!practiceAudio && practiceAudio.parts.length > 0;
  const audioSources = practiceAudio 
    ? practiceAudio.parts.map(part => getAudioUrl(story.id, part.filename))
    : [];

  // Get images for the interactiveSection - memoized to prevent unnecessary re-renders
  const sectionImages = useMemo(() => images.get('interactiveSection') || [], [images]);
  
  // Determine intelligent inline placements for analogy/concept images
  const inlinePlacements = useMemo(() => {
    return determineInlineImagePlacements(
      story.content.narrative.interactiveSection,
      sectionImages,
      story.content.analogies,
      story.content.keyConcepts
    );
  }, [story.content.narrative.interactiveSection, sectionImages, story.content.analogies, story.content.keyConcepts]);
  
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

  // Calculate reading time for interactive section
  const practiceReadingTime = getReadingTimeForText(
    story.content.narrative.interactiveSection,
    readingSettings.readingPace
  );

  // Parse the interactive section content with inline images
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
            <div
              key={`section-${index}`}
              className="rounded-xl p-5 mb-4"
              style={{
                backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
                border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
              }}
            >
              <h4
                className="text-lg font-semibold mb-3 flex items-center"
                style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                  style={
                    isDark
                      ? { backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' }
                      : { backgroundColor: '#fef3c7', color: '#d97706' }
                  }
                >
                  🎯
                </span>
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
            className="leading-relaxed pl-4 mb-4"
            style={{
              color: isDark ? currentTheme.colors.textMuted : '#374151',
              borderLeft: `2px solid ${isDark ? 'rgba(251, 191, 36, 0.4)' : '#fde68a'}`,
            }}
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
              ? { backgroundColor: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' }
              : { backgroundColor: '#fef3c7', color: '#d97706' }
          }
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
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
          Practice Activities
          <span 
            className={`ml-2 font-normal text-xs transition-all duration-300 ${
              isReadingMode 
                ? 'inline group-hover:hidden' 
                : 'hidden'
            }`}
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            · {formatReadingTime(practiceReadingTime)}
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
          {formatReadingTime(practiceReadingTime)} of guided activities
        </p>
      </div>

      {/* Narrate Button - plays entire section audio */}
      <NarrateButton 
        audioAvailable={audioAvailable} 
        audioSources={audioSources} 
        sectionName="Practice"
        storyId={story.id}
        storyTitle={story.title}
      />

      {/* Interactive Content */}
      <div className="space-y-4">
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

        {formatContent(story.content.narrative.interactiveSection)}

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

      {/* Helpful Analogies */}
      {story.content.analogies.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={
            isDark
              ? {
                  backgroundColor: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                }
              : { background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)' }
          }
        >
          <h4
            className="text-lg font-semibold mb-4 flex items-center"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            <span className="mr-2">🌈</span> Helpful Analogies
          </h4>
          <div className="space-y-3">
            {story.content.analogies.map((analogy, index) => (
              <div
                key={index}
                className="rounded-xl p-4"
                style={
                  isDark
                    ? {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                      }
                    : { backgroundColor: 'rgba(255, 255, 255, 0.6)', border: '1px solid #fde68a' }
                }
              >
                <p
                  className="italic"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
                >
                  "{analogy}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeStep;
