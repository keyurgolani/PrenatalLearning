import React, { useMemo } from 'react';
import type { Story } from '../../types';
import type { ImageManifestEntry } from '../../types/media';
import { useTheme } from '../../contexts/ThemeContext';
import { useReadingMode } from '../../contexts/ReadingModeContext';
import { getReadingTimeForText, formatReadingTime } from '../../utils/readingTime';
import { useMediaAssets, getAudioUrl, getImageUrl } from '../../hooks/useMediaAssets';
import { NarrateButton } from '../NarrateButton';
import { StoryImage } from '../StoryImage';
import { 
  determineInlineImagePlacements, 
  getPositionedImages,
  type InlineImagePlacement 
} from '../../utils/contentImageMatcher';

/**
 * CoreContentStep component - Main learning content step
 * Requirements: 7.3 - Display only the content for the current step
 */

interface CoreContentStepProps {
  story: Story;
}

export const CoreContentStep: React.FC<CoreContentStepProps> = ({ story }) => {
  const { currentTheme } = useTheme();
  const { settings: readingSettings } = useReadingMode();
  const isDark = currentTheme.isDark ?? false;

  // Load media assets for this story
  const { audioSegments, images } = useMediaAssets(story.id);

  // Get audio for the coreContent section (may have multiple parts)
  const coreAudio = audioSegments.get('coreContent');
  const audioAvailable = !!coreAudio && coreAudio.parts.length > 0;
  const audioSources = coreAudio 
    ? coreAudio.parts.map(part => getAudioUrl(story.id, part.filename))
    : [];

  // Get images for the coreContent section
  const sectionImages = images.get('coreContent') || [];
  
  // Determine intelligent inline placements for analogy/concept images
  const inlinePlacements = useMemo(() => {
    return determineInlineImagePlacements(
      story.content.narrative.coreContent,
      sectionImages,
      story.content.analogies,
      story.content.keyConcepts
    );
  }, [story.content.narrative.coreContent, sectionImages, story.content.analogies, story.content.keyConcepts]);
  
  // Get before/after images, excluding those that will be placed inline
  const beforeImages = useMemo(() => 
    getPositionedImages(sectionImages, 'before', inlinePlacements),
    [sectionImages, inlinePlacements]
  );
  const afterImages = useMemo(() => 
    getPositionedImages(sectionImages, 'after', inlinePlacements),
    [sectionImages, inlinePlacements]
  );

  // Calculate reading time for core content section
  const coreContentReadingTime = getReadingTimeForText(
    story.content.narrative.coreContent,
    readingSettings.readingPace
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

  // Parse markdown-like content for better display with inline images
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
                <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3" />
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
        // Group images in a flex row for better layout
        elements.push(
          <div
            key={`images-${index}`}
            className="flex flex-wrap justify-center gap-4 my-4 clear-both"
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
              ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }
              : { backgroundColor: '#f3e8ff', color: '#9333ea' }
          }
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
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
          Core Content
          <span 
            className={`ml-2 font-normal text-xs transition-all duration-300 ${
              isReadingMode 
                ? 'inline group-hover:hidden' 
                : 'hidden'
            }`}
            style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            · {formatReadingTime(coreContentReadingTime)}
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
          {formatReadingTime(coreContentReadingTime)} of deep learning
        </p>
      </div>

      {/* Main Content */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        {/* Narrate Button - plays entire section audio */}
        <NarrateButton 
          audioAvailable={audioAvailable} 
          audioSources={audioSources} 
          sectionName="Core Content"
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

        <div className="prose prose-purple max-w-none content-scaled">
          {formatContent(story.content.narrative.coreContent)}
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

      {/* Key Concepts Summary */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : undefined,
          background: isDark ? undefined : 'linear-gradient(to bottom right, #eef2ff, #faf5ff)',
        }}
      >
        <h4
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          <span className="mr-2">💡</span> Key Concepts
        </h4>
        <ul className="space-y-2">
          {story.content.keyConcepts.map((concept, index) => (
            <li
              key={index}
              className="flex items-start gap-2"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
            >
              <span style={{ color: isDark ? '#C084FC' : '#a855f7' }} className="mt-1">
                •
              </span>
              <span>{concept}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CoreContentStep;
