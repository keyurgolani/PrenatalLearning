/**
 * AudioNarrationBadge Component
 * 
 * Displays a badge indicating audio narration availability for a story.
 * Shows "Full Audio" for stories with all sections narrated,
 * "Partial Audio" for stories with some sections narrated.
 */

import React from 'react';
import { useStoryAudioStatus, type AudioStatus } from '../hooks/useStoryAudioStatus';
import { useTheme } from '../contexts/ThemeContext';

interface AudioNarrationBadgeProps {
  storyId: number;
  /** Compact mode shows just an icon with tooltip */
  compact?: boolean;
}

const badgeConfig: Record<Exclude<AudioStatus, 'none'>, {
  label: string;
  compactLabel: string;
  lightClass: string;
  darkStyle: React.CSSProperties;
  icon: React.ReactNode;
}> = {
  full: {
    label: 'Full Audio',
    compactLabel: '🎧',
    lightClass: 'bg-emerald-100 text-emerald-700',
    darkStyle: { backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399' },
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    ),
  },
  partial: {
    label: 'Partial Audio',
    compactLabel: '🎧',
    lightClass: 'bg-amber-100 text-amber-700',
    darkStyle: { backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24' },
    icon: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" opacity="0.6"/>
      </svg>
    ),
  },
};

export const AudioNarrationBadge: React.FC<AudioNarrationBadgeProps> = ({
  storyId,
  compact = false,
}) => {
  const { status, isLoading } = useStoryAudioStatus(storyId);
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark ?? false;

  // Don't render anything if no audio or still loading
  if (isLoading || status === 'none') {
    return null;
  }

  const config = badgeConfig[status];
  const title = status === 'full' 
    ? 'All sections have audio narration' 
    : 'Some sections have audio narration';

  if (compact) {
    return (
      <span
        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${isDark ? '' : config.lightClass}`}
        style={isDark ? config.darkStyle : {}}
        title={title}
        aria-label={config.label}
      >
        {config.icon}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? '' : config.lightClass}`}
      style={isDark ? config.darkStyle : {}}
      title={title}
      data-testid="audio-narration-badge"
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export default AudioNarrationBadge;
