import React from 'react';
import { highlightText, type TextSegment } from '../utils/searchHighlight';

/**
 * HighlightedText Component
 * 
 * Renders text with highlighted search matches
 * 
 * Requirements:
 * - 1.2: Display search results with highlighted matching terms
 */

export interface HighlightedTextProps {
  /** The text to display */
  text: string;
  /** The search query to highlight */
  query: string;
  /** Custom class for highlighted segments */
  highlightClassName?: string;
  /** Custom class for the container */
  className?: string;
}

/**
 * Component that renders text with highlighted search matches
 */
export function HighlightedText({
  text,
  query,
  highlightClassName = 'bg-yellow-200 dark:bg-yellow-700 rounded px-0.5',
  className = '',
}: HighlightedTextProps): React.ReactElement {
  const segments = highlightText(text, query);

  return (
    <span className={className}>
      {segments.map((segment: TextSegment, index: number) => (
        segment.isHighlighted ? (
          <mark
            key={index}
            className={highlightClassName}
          >
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      ))}
    </span>
  );
}

export default HighlightedText;
