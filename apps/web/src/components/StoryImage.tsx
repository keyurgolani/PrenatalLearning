/**
 * StoryImage Component
 *
 * Displays images for story content with lazy loading, accessibility support,
 * and responsive styling.
 *
 * Requirements:
 * - 5.1: WHEN a visual asset exists for a section, THE System SHALL display the image at the specified position
 * - 5.2: WHEN no visual asset exists for a section, THE System SHALL render the content without images
 * - 5.3: THE System SHALL display images with appropriate alt text for accessibility
 * - 5.4: THE System SHALL display an optional caption below images when provided in the manifest
 * - 5.5: THE System SHALL lazy-load images to optimize page performance
 * - 5.6: IF an image fails to load, THEN THE System SHALL hide the image container gracefully without breaking layout
 * - 6.1: THE System SHALL scale images responsively to fit the content container width
 * - 6.2: THE System SHALL maintain image aspect ratio when scaling
 * - 6.3: THE System SHALL apply a maximum width of 800px to images on large screens
 * - 6.4: THE System SHALL center images within the content area
 * - 6.5: THE System SHALL apply subtle rounded corners and shadow styling consistent with the app theme
 */

import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

export interface StoryImageProps {
  /** Source URL for the image */
  src: string;
  /** Alt text for accessibility (Requirements 5.3) */
  alt: string;
  /** Optional caption to display below the image (Requirements 5.4) */
  caption?: string;
  /** Callback when an error occurs loading the image */
  onError?: () => void;
  /** Optional className for additional styling */
  className?: string;
  /** Display mode: 'inline' shows smaller images floated to the side on wide screens */
  displayMode?: 'full' | 'inline';
}

/**
 * ImageLightbox component - Modal for viewing images larger
 */
interface ImageLightboxProps {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  src,
  alt,
  caption,
  onClose,
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
     
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged view of ${alt}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Content */}
      { }
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close image viewer"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image */}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
          }}
        />

        {/* Caption */}
        {caption && (
          <p
            className="mt-4 text-center text-sm max-w-2xl px-4"
            style={{ color: 'rgba(255, 255, 255, 0.9)' }}
          >
            {caption}
          </p>
        )}

        {/* Click hint */}
        <p className="mt-2 text-xs text-white/50">
          Click outside or press Escape to close
        </p>
      </div>
    </div>,
    document.body
  );
};

/**
 * StoryImage component
 *
 * Displays story images with lazy loading, responsive sizing, and graceful error handling.
 */
export const StoryImage: React.FC<StoryImageProps> = ({
  src,
  alt,
  caption,
  onError,
  className = '',
  displayMode = 'inline',
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  /**
   * Handle image load error
   * Requirements 5.6: Hide image container gracefully without breaking layout
   */
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  /**
   * Handle image load success
   */
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleOpenLightbox = useCallback(() => {
    setShowLightbox(true);
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  // Requirements 5.6: If there's an error, hide the image container gracefully
  if (hasError) {
    return null;
  }

  // Inline mode: compact images that fit in a flex row
  if (displayMode === 'inline') {
    return (
      <>
        <figure
          className={`
            flex flex-col items-center
            flex-shrink-0
            cursor-pointer
            group
            ${className}
          `}
          style={{ width: '140px', maxWidth: '140px' }}
          data-testid="story-image-container"
          onClick={handleOpenLightbox}
           
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenLightbox();
            }
          }}
          aria-label={`View larger: ${alt}`}
        >
          { }
          <div
            className={`
              relative
              w-full
              overflow-hidden
              rounded-lg
              transition-all duration-300
              group-hover:ring-2 group-hover:ring-purple-400 group-hover:shadow-lg
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            style={{
              boxShadow: isDark
                ? '0 2px 4px -1px rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)'
                : '0 2px 4px -1px rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
              backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
            }}
          >
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={handleError}
              onLoad={handleLoad}
              className="w-full h-auto object-contain hover-grow"
              style={{ display: 'block' }}
              data-testid="story-image"
            />
            {/* Zoom icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
              <svg
                className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </div>
          </div>

          {caption && (
            <figcaption
              className="mt-1.5 text-[10px] text-center px-1 leading-tight line-clamp-2"
              style={{ color: currentTheme.colors.textMuted }}
              data-testid="story-image-caption"
            >
              {caption}
            </figcaption>
          )}
        </figure>

        {showLightbox && (
          <ImageLightbox
            src={src}
            alt={alt}
            caption={caption}
            onClose={handleCloseLightbox}
          />
        )}
      </>
    );
  }

  // Full mode: larger centered images (for before/after positions)
  return (
    <>
      <figure
        className={`
          flex flex-col items-center
          w-full
          my-6
          cursor-pointer
          group
          ${className}
        `}
        data-testid="story-image-container"
        onClick={handleOpenLightbox}
         
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenLightbox();
          }
        }}
        aria-label={`View larger: ${alt}`}
      >
        {/* Image container with responsive styling */}
        { }
        <div
          className={`
            relative
            w-full
            max-w-[500px]
            overflow-hidden
            rounded-lg
            transition-all duration-300
            group-hover:ring-2 group-hover:ring-purple-400 group-hover:shadow-xl
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          style={{
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6',
          }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={handleError}
            onLoad={handleLoad}
            className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ display: 'block' }}
            data-testid="story-image"
          />
          {/* Zoom icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
            <svg
              className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>

        {caption && (
          <figcaption
            className="mt-3 text-sm text-center max-w-[500px] px-4"
            style={{ color: currentTheme.colors.textMuted }}
            data-testid="story-image-caption"
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {showLightbox && (
        <ImageLightbox
          src={src}
          alt={alt}
          caption={caption}
          onClose={handleCloseLightbox}
        />
      )}
    </>
  );
};

export default StoryImage;
