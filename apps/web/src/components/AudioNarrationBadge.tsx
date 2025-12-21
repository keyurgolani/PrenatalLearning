/**
 * AudioNarrationBadge Component
 * 
 * Displays a badge indicating audio narration availability for a story.
 * Shows an icon for stories with audio narration available.
 */

import React from 'react';
import { useStoryAudioStatus, type AudioStatus } from '../hooks/useStoryAudioStatus';
import { useTheme } from '../contexts/ThemeContext';
import { Headphones } from 'lucide-react';

interface AudioNarrationBadgeProps {
  storyId: number;
  /** Show only for full audio (default: false - shows for any audio) */
  fullOnly?: boolean;
}

const badgeConfig: Record<Exclude<AudioStatus, 'none'>, {
  title: string;
  lightBg: string;
  lightColor: string;
  darkBg: string;
  darkColor: string;
}> = {
  full: {
    title: 'Full audio narration available',
    lightBg: 'rgba(16, 185, 129, 0.15)',
    lightColor: '#059669',
    darkBg: 'rgba(16, 185, 129, 0.25)',
    darkColor: '#34D399',
  },
  partial: {
    title: 'Partial audio narration available',
    lightBg: 'rgba(245, 158, 11, 0.15)',
    lightColor: '#D97706',
    darkBg: 'rgba(245, 158, 11, 0.25)',
    darkColor: '#FBBF24',
  },
};

export const AudioNarrationBadge: React.FC<AudioNarrationBadgeProps> = ({
  storyId,
  fullOnly = false,
}) => {
  const { status, isLoading } = useStoryAudioStatus(storyId);
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Don't render anything if no audio, still loading, or fullOnly and not full
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
      data-testid="audio-narration-badge"
    >
      <Headphones className="w-4 h-4" />
    </span>
  );
};

export default AudioNarrationBadge;
