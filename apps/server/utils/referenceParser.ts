/**
 * Reference Parser Utility
 * 
 * Parses @ and # mentions in journal content and validates them against
 * existing topics (stories) and journeys (learning paths).
 * 
 * Requirements: 11.4, 11.5, 11.6
 * - Parse @ mentions for topics
 * - Parse # mentions for journeys
 * - Validate references against existing topics/journeys
 * - Store references with topicId/journeyId and title
 */

import type { TopicReference, JourneyReference } from '../models/JournalEntry.js';

// Topic data structure (mirrors frontend Story)
export interface TopicData {
  id: number;
  title: string;
}

// Journey data structure (mirrors frontend LearningPath)
export interface JourneyData {
  id: string;
  name: string;
}

/**
 * Parse result containing extracted references
 */
export interface ParsedReferences {
  topicReferences: TopicReference[];
  journeyReferences: JourneyReference[];
}

/**
 * Regular expression patterns for parsing mentions
 * 
 * Topic mentions: @[title] or @id (e.g., @[The Story of Everything] or @1)
 * Journey mentions: #[name] or #id (e.g., #[Science & Technology] or #science-tech)
 */
const TOPIC_MENTION_PATTERN = /@\[([^\]]+)\]|@(\d+)/g;
const JOURNEY_MENTION_PATTERN = /#\[([^\]]+)\]|#([a-zA-Z0-9-]+)/g;

/**
 * Parse topic mentions from content
 * 
 * Supports two formats:
 * - @[Topic Title] - reference by title (case-insensitive match)
 * - @123 - reference by numeric ID
 * 
 * @param content - The journal entry content to parse
 * @param availableTopics - List of available topics to validate against
 * @returns Array of valid topic references
 */
export function parseTopicMentions(
  content: string,
  availableTopics: TopicData[]
): TopicReference[] {
  const references: TopicReference[] = [];
  const seenIds = new Set<number>();
  
  // Reset regex lastIndex
  TOPIC_MENTION_PATTERN.lastIndex = 0;
  
  let match;
  while ((match = TOPIC_MENTION_PATTERN.exec(content)) !== null) {
    const titleMatch = match[1]; // @[title] format
    const idMatch = match[2];    // @id format
    
    let topic: TopicData | undefined;
    
    if (titleMatch) {
      // Find topic by title (case-insensitive)
      topic = availableTopics.find(
        t => t.title.toLowerCase() === titleMatch.toLowerCase()
      );
    } else if (idMatch) {
      // Find topic by ID
      const id = parseInt(idMatch, 10);
      topic = availableTopics.find(t => t.id === id);
    }
    
    // Add to references if found and not already added
    if (topic && !seenIds.has(topic.id)) {
      seenIds.add(topic.id);
      references.push({
        topicId: topic.id,
        title: topic.title,
      });
    }
  }
  
  return references;
}

/**
 * Parse journey mentions from content
 * 
 * Supports two formats:
 * - #[Journey Name] - reference by name (case-insensitive match)
 * - #journey-id - reference by ID
 * 
 * @param content - The journal entry content to parse
 * @param availableJourneys - List of available journeys to validate against
 * @returns Array of valid journey references
 */
export function parseJourneyMentions(
  content: string,
  availableJourneys: JourneyData[]
): JourneyReference[] {
  const references: JourneyReference[] = [];
  const seenIds = new Set<string>();
  
  // Reset regex lastIndex
  JOURNEY_MENTION_PATTERN.lastIndex = 0;
  
  let match;
  while ((match = JOURNEY_MENTION_PATTERN.exec(content)) !== null) {
    const nameMatch = match[1]; // #[name] format
    const idMatch = match[2];   // #id format
    
    let journey: JourneyData | undefined;
    
    if (nameMatch) {
      // Find journey by name (case-insensitive)
      journey = availableJourneys.find(
        j => j.name.toLowerCase() === nameMatch.toLowerCase()
      );
    } else if (idMatch) {
      // Find journey by ID (case-insensitive for ID matching)
      journey = availableJourneys.find(
        j => j.id.toLowerCase() === idMatch.toLowerCase()
      );
    }
    
    // Add to references if found and not already added
    if (journey && !seenIds.has(journey.id)) {
      seenIds.add(journey.id);
      references.push({
        journeyId: journey.id,
        title: journey.name,
      });
    }
  }
  
  return references;
}

/**
 * Parse all references from journal content
 * 
 * @param content - The journal entry content to parse
 * @param availableTopics - List of available topics to validate against
 * @param availableJourneys - List of available journeys to validate against
 * @returns Object containing both topic and journey references
 */
export function parseReferences(
  content: string,
  availableTopics: TopicData[],
  availableJourneys: JourneyData[]
): ParsedReferences {
  return {
    topicReferences: parseTopicMentions(content, availableTopics),
    journeyReferences: parseJourneyMentions(content, availableJourneys),
  };
}

/**
 * Validate topic references against available topics
 * 
 * @param references - Array of topic references to validate
 * @param availableTopics - List of available topics
 * @returns Array of valid topic references
 */
export function validateTopicReferences(
  references: TopicReference[],
  availableTopics: TopicData[]
): TopicReference[] {
  return references.filter(ref => 
    availableTopics.some(t => t.id === ref.topicId)
  );
}

/**
 * Validate journey references against available journeys
 * 
 * @param references - Array of journey references to validate
 * @param availableJourneys - List of available journeys
 * @returns Array of valid journey references
 */
export function validateJourneyReferences(
  references: JourneyReference[],
  availableJourneys: JourneyData[]
): JourneyReference[] {
  return references.filter(ref => 
    availableJourneys.some(j => j.id === ref.journeyId)
  );
}
