/**
 * ContentWithTopicLinks Component
 * 
 * Renders journal entry content with clickable topic mentions
 * Topics mentioned with @ or # are converted to clickable links
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ContentWithTopicLinksProps {
  content: string;
  topicReferences?: { topicId: number; title: string }[];
  journeyReferences?: { journeyId: string; title: string }[];
  className?: string;
  onLinkClick?: () => void;
}

import { stories } from '../../data/stories';
import { learningPaths } from '../../data/learningPaths';

export const ContentWithTopicLinks: React.FC<ContentWithTopicLinksProps> = ({
  content,
  topicReferences = [],
  journeyReferences = [],
  className = '',
  onLinkClick,
}) => {
  const navigate = useNavigate();

  // Create a map of topic/journey titles to their IDs for quick lookup
  // Create a map of topic/journey titles to their IDs for quick lookup
  // We populate this with both passed references AND all available stories/paths
  // to ensure links work even if metadata is missing
  const topicMap = new Map<string, number>();
  stories.forEach(story => topicMap.set(story.title.toLowerCase(), story.id));
  topicReferences.forEach(ref => topicMap.set(ref.title.toLowerCase(), ref.topicId));

  const journeyMap = new Map<string, string>();
  learningPaths.forEach(path => journeyMap.set(path.name.toLowerCase(), path.id));
  journeyReferences.forEach(ref => journeyMap.set(ref.title.toLowerCase(), ref.journeyId));

  /**
   * Parse content and convert @mentions to clickable links
   */
  const renderContentWithLinks = () => {
    // Collect all valid titles to create a dynamic regex
    const allTitles = [
      ...Array.from(topicMap.keys()),
      ...Array.from(journeyMap.keys())
    ].sort((a, b) => b.length - a.length); // Match longest titles first

    if (allTitles.length === 0) return content;

    // Escape special regex characters in titles
    const escapedTitles = allTitles.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    
    // Create master regex: match @ or # followed by one of our known titles
    // We use a lookahead to ensure we match whole words/phrases but allow punctuation after
    // \b is tricky with spaces, so we just match the title string directly
    const titlePattern = escapedTitles.join('|');
    const mentionRegex = new RegExp(`([@#])(${titlePattern})(?![\\w])`, 'gi');

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const matchStart = match.index;
      const matchEnd = match.index + match[0].length;
      const mentionText = match[2]; // The matched title text

      // Add text before the mention
      if (matchStart > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {content.substring(lastIndex, matchStart)}
          </span>
        );
      }

      // Look up IDs (lowercase for case-insensitive matching)
      const topicId = topicMap.get(mentionText.toLowerCase());
      const journeyId = journeyMap.get(mentionText.toLowerCase());

      if (topicId) {
        parts.push(
          <button
            key={`topic-${matchStart}`}
            onClick={() => {
              navigate(`/topic/${topicId}`);
              onLinkClick?.();
            }}
            className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-700 hover:underline font-medium cursor-pointer transition-colors -ml-0.5 px-0.5 rounded hover:bg-blue-50"
            title={`Go to topic: ${mentionText}`}
          >
            @{mentionText}
          </button>
        );
      } else if (journeyId) {
        parts.push(
          <button
            key={`journey-${matchStart}`}
            onClick={() => {
              navigate(`/journey/${journeyId}`);
              onLinkClick?.();
            }}
            className="inline-flex items-center gap-0.5 text-green-600 hover:text-green-700 hover:underline font-medium cursor-pointer transition-colors -ml-0.5 px-0.5 rounded hover:bg-green-50"
             title={`Go to journey: ${mentionText}`}
          >
            #{mentionText}
          </button>
        );
      } else {
        // Fallback (shouldn't happen with our regex logic, but safe to keep)
        parts.push(
          <span key={`mention-${matchStart}`} className="text-gray-600">
            {match[0]}
          </span>
        );
      }

      lastIndex = matchEnd;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.substring(lastIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div className={`whitespace-pre-wrap ${className}`}>
      {renderContentWithLinks()}
    </div>
  );
};

export default ContentWithTopicLinks;
