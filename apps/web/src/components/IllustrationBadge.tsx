/**
 * IllustrationBadge Component
 * 
 * Displays a badge indicating illustration availability for a story.
 * Shows an icon when all illustrations are available.
 */

import React from 'react';
import { useStoryImageStatus, type ImageStatus } from '../hooks/useStoryImageStatus';
import { useTheme } from '../contexts/ThemeContext';
import { ImageIcon } from 'lucide-react';

interface IllustrationBadgeProps {
  storyId: number;
  /** Show only for full illustrations (default: true) */
  fullOnly?: boolean;
}

const badgeConfig: Record<Exclude<ImageStatus, 'none'>, {
  title: string;
  lightBg: string;
  lightColor: string;
  darkBg: string;
  darkColor: string;
}> = {
  full: {
    title: 'All illustrations available',
    lightBg: 'rgba(99, 102, 241, 0.15)',
    lightColor: '#4F46E5',
    darkBg: 'rgba(99, 102, 241, 0.25)',
    darkColor: '#A5B4FC',
  },
  partial: {
    title: 'Some illustrations available',
    lightBg: 'rgba(156, 163, 175, 0.15)',
    lightColor: '#6B7280',
    darkBg: 'rgba(156, 163, 175, 0.25)',
    darkColor: '#9CA3AF',
  },
};

export const IllustrationBadge: React.FC<IllustrationBadgeProps> = ({
  storyId,
  fullOnly = true,
}) => {
  const { status, isLoading } = useStoryImageStatus(storyId);
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Don't render anything if no images, still loading, or fullOnly and not full
  if (isLoading || status === 'none' || (fullOnly && status !== 'full')) {
    return null;
  }

  const config = badgeConfig[status];

  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-transform hover:scale-110"
      style={{
        backgroundColor: isDark ? config.darkBg : config.lightBg,
        color: isDark ? config.darkColor : config.lightColor,
      }}
      title={config.title}
      aria-label={config.title}
      data-testid="illustration-badge"
    >
      <ImageIcon className="w-4 h-4" />
    </span>
  );
};

export default IllustrationBadge;
