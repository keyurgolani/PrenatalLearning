import React, { useMemo } from 'react';
import type { Story, Category } from '../../types';
import type { ImageManifestEntry } from '../../types/media';
import { getExternalResources } from '../../data/externalResources';
import { ExternalResourceSection } from './ExternalResourceSection';
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
 * OverviewStep component - First step in the guided learning experience
 * Requirements: 7.3 - Display only the content for the current step
 * Requirements: 6.1 - Display "Resources" section when topic has external resources
 */

interface OverviewStepProps {
  story: Story;
  category: Category | undefined;
}

export const OverviewStep: React.FC<OverviewStepProps> = ({ story, category }) => {
  const { currentTheme } = useTheme();
  const { settings: readingSettings } = useReadingMode();
  const isDark = currentTheme.isDark ?? false;

  // Load media assets for this story
  const { audioSegments, images } = useMediaAssets(story.id);

  // Get audio for the introduction section (may have multiple parts)
  const introAudio = audioSegments.get('introduction');
  const audioAvailable = !!introAudio && introAudio.parts.length > 0;
  const audioSources = introAudio 
    ? introAudio.parts.map(part => getAudioUrl(story.id, part.filename))
    : [];

  // Get images for the introduction section
  const sectionImages = images.get('introduction') || [];
  
  // Determine intelligent inline placements for analogy/concept images
  const inlinePlacements = useMemo(() => {
    return determineInlineImagePlacements(
      story.content.narrative.introduction,
      sectionImages,
      story.content.analogies,
      story.content.keyConcepts
    );
  }, [story.content.narrative.introduction, sectionImages, story.content.analogies, story.content.keyConcepts]);
  
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

  // Calculate reading time for introduction section
  const introReadingTime = getReadingTimeForText(
    story.content.narrative.introduction,
    readingSettings.readingPace
  );

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="text-center">
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium text-white ${category?.color || 'bg-gray-400'} mb-4`}
        >
          {category?.name || 'Unknown Category'}
        </span>
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          {story.title}
        </h2>
        <p
          className="text-lg max-w-2xl mx-auto"
          style={{ color: isDark ? currentTheme.colors.textMuted : '#4b5563' }}
        >
          {story.description}
        </p>
      </div>

      {/* Metadata Cards */}
      <div className="flex flex-wrap justify-center gap-3">
        <div
          className="flex items-center px-4 py-2 rounded-xl"
          style={
            isDark
              ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }
              : { backgroundColor: '#faf5ff', color: '#7c3aed' }
          }
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">{story.duration} minutes</span>
        </div>
        <div
          className="flex items-center px-4 py-2 rounded-xl"
          style={
            isDark
              ? {
                  backgroundColor:
                    story.difficulty === 'foundational'
                      ? 'rgba(74, 222, 128, 0.2)'
                      : story.difficulty === 'intermediate'
                        ? 'rgba(251, 191, 36, 0.2)'
                        : 'rgba(248, 113, 113, 0.2)',
                  color:
                    story.difficulty === 'foundational'
                      ? '#4ADE80'
                      : story.difficulty === 'intermediate'
                        ? '#FBBF24'
                        : '#F87171',
                }
              : {
                  backgroundColor:
                    story.difficulty === 'foundational'
                      ? '#f0fdf4'
                      : story.difficulty === 'intermediate'
                        ? '#fefce8'
                        : '#fef2f2',
                  color:
                    story.difficulty === 'foundational'
                      ? '#15803d'
                      : story.difficulty === 'intermediate'
                        ? '#a16207'
                        : '#b91c1c',
                }
          }
        >
          <span className="font-medium capitalize">{story.difficulty}</span>
        </div>
      </div>

      {/* Introduction Section */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : undefined,
          background: isDark ? undefined : 'linear-gradient(to bottom right, #faf5ff, #fdf2f8)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="text-lg font-semibold flex items-center"
            style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
          >
            <span className="mr-2">🌟</span> Introduction
          </h3>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
            style={
              isDark
                ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }
                : { backgroundColor: '#f3e8ff', color: '#7c3aed' }
            }
          >
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatReadingTime(introReadingTime)}
          </span>
        </div>

        {/* Narrate Button - plays entire section audio */}
        <NarrateButton 
          audioAvailable={audioAvailable} 
          audioSources={audioSources} 
          sectionName="Introduction"
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
          {/* Introduction paragraphs with inline images */}
          {story.content.narrative.introduction.split(/\n\n+/).map((paragraph, index) => {
            const imagesForParagraph = imagesByParagraph.get(index);
            return (
              <React.Fragment key={index}>
                <p
                  className="leading-relaxed mb-4"
                  style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}
                >
                  {paragraph}
                </p>
                {/* Add any inline images that should appear after this paragraph */}
                {imagesForParagraph && imagesForParagraph.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-4 my-4">
                    {imagesForParagraph.map((placement, imgIndex) => (
                      <StoryImage
                        key={`inline-${index}-${imgIndex}`}
                        src={getImageUrl(story.id, placement.image.filename)}
                        alt={placement.image.altText}
                        caption={placement.image.caption}
                      />
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })}
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

      {/* Key Concepts Preview */}
      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#ffffff',
          border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: isDark ? currentTheme.colors.text : '#1f2937' }}
        >
          <span className="mr-2">💡</span> What You'll Learn
        </h3>
        <ul className="space-y-3">
          {story.content.keyConcepts.slice(0, 3).map((concept, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                style={
                  isDark
                    ? { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#C084FC' }
                    : { backgroundColor: '#f3e8ff', color: '#9333ea' }
                }
              >
                {index + 1}
              </span>
              <span style={{ color: isDark ? currentTheme.colors.textMuted : '#374151' }}>
                {concept}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* External Resources Section */}
      <ExternalResourceSection resources={getExternalResources(story.id)} />
    </div>
  );
};

export default OverviewStep;
