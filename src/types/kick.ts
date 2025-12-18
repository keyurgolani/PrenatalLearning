/**
 * Kick counter types for baby movement tracking during learning sessions
 * 
 * Requirements:
 * - 6.1: Display "Log Kick" button for logged-in users
 * - 6.2: Record timestamp, story ID, and section when kick is logged
 * - 6.4: Display running count of kicks during current session
 * - 7.1: Aggregate kick counts by story and category
 * - 7.3: Show kick activity over time
 * - 7.5: Allow filtering kick history by date range
 * 
 * Design Properties:
 * - Property 8: Kick event data completeness
 * - Property 9: Session kick counter accuracy
 * - Property 10: Kick aggregation by story
 */

/**
 * Single kick event record
 * Property 8: Must contain valid profileId, storyId, sectionName, and timestamp
 * Requirements: 6.2
 */
export interface KickEvent {
  id: string;
  profileId: string;
  storyId: number;
  sectionName: string;
  timestamp: number; // Unix timestamp
  sessionId: string; // To group kicks by session
}

/**
 * Kick count grouped by story
 * Requirements: 7.1
 */
export interface StoryKickCount {
  storyId: number;
  storyTitle: string;
  count: number;
  lastKickTimestamp: number;
}

/**
 * Kick count grouped by category
 * Requirements: 7.1
 */
export interface CategoryKickCount {
  category: string;
  count: number;
}

/**
 * Kick timeline entry for activity chart
 * Requirements: 7.3
 */
export interface KickTimelineEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  count: number;
}

/**
 * Date range filter for kick history
 * Requirements: 7.5
 */
export interface DateRange {
  from: string; // ISO date string
  to: string; // ISO date string
}

/**
 * Comprehensive kick statistics
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export interface KickStats {
  totalKicks: number;
  mostActiveStory: { storyId: number; storyTitle: string; count: number } | null;
  mostActiveCategory: { category: string; count: number } | null;
  kicksByDay: KickTimelineEntry[];
}

/**
 * Complete kick record for a profile
 */
export interface KickRecord {
  profileId: string;
  kicks: KickEvent[];
  totalKicks: number;
}

/**
 * Session kick state for tracking current session
 * Property 9: Session kick counter accuracy
 * Requirements: 6.4
 */
export interface SessionKickState {
  sessionId: string;
  kickCount: number;
  kicks: KickEvent[];
}
