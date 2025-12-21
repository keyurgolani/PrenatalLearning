/**
 * Kick counter service for baby movement tracking during learning sessions
 * 
 * Requirements:
 * - 6.2: Record timestamp, story ID, and section when kick is logged
 * - 6.4: Display running count of kicks during current session
 * - 7.1: Aggregate kick counts by story and category
 * - 7.3: Show kick activity over time in a simple chart
 * - 7.4: Display total kicks logged across all sessions
 * - 7.5: Allow filtering kick history by date range
 * - 13.2: Allow users to log kicks directly from the journal interface
 * - 13.5: Timestamp each kick event with the exact time
 * - 13.6: Allow users to add notes to individual kick events
 * - 14.1: Display a daily kick count graph showing kicks over the past 7 days
 * - 14.6: Display kick patterns by time of day
 * 
 * Design Properties:
 * - Property 8: Kick event data completeness
 * - Property 9: Session kick counter accuracy
 * - Property 10: Kick aggregation by story
 * - Property 16: Kick timestamp accuracy
 */

import type {
  KickEvent,
  KickRecord,
  KickStats,
  StoryKickCount,
  CategoryKickCount,
  KickTimelineEntry,
  DateRange,
} from '../types/kick';
import { storageService } from './storageService';
import { stories } from '../data/stories';
import { get, post, put, del } from './apiClient';

const KICK_STORAGE_KEY = 'prenatal-learning-hub:kick-data';

/**
 * Generate a unique ID for kick events
 */
export function generateKickId(): string {
  return `kick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a session ID for grouping kicks
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get date string from timestamp (YYYY-MM-DD)
 */
export function getDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


/**
 * Validate kick event data completeness
 * Property 8: Kick event data completeness
 * For any logged kick event, the record should contain valid profileId, storyId, sectionName, and timestamp
 * Requirements: 6.2, 13.4 (quick kick from journal bar)
 * 
 * Note: storyId >= 0 allows for quick kicks (storyId: 0) that aren't associated with a specific story
 */
export function validateKickEvent(kick: KickEvent): boolean {
  return (
    typeof kick.profileId === 'string' &&
    kick.profileId.length > 0 &&
    typeof kick.storyId === 'number' &&
    kick.storyId >= 0 && // Allow 0 for quick kicks not associated with a story
    typeof kick.sectionName === 'string' &&
    kick.sectionName.length > 0 &&
    typeof kick.timestamp === 'number' &&
    kick.timestamp > 0
  );
}

/**
 * Get story title by ID
 */
function getStoryTitle(storyId: number): string {
  const story = stories.find(s => s.id === storyId);
  return story?.title || `Story ${storyId}`;
}

/**
 * Get story category by ID
 */
function getStoryCategory(storyId: number): string {
  const story = stories.find(s => s.id === storyId);
  return story?.category || 'Unknown';
}

/**
 * Create empty kick record for a profile
 */
function createEmptyKickRecord(profileId: string): KickRecord {
  return {
    profileId,
    kicks: [],
    totalKicks: 0,
  };
}

/**
 * Load kick record from storage
 */
function loadKickRecord(profileId: string): KickRecord {
  const data = storageService.get(KICK_STORAGE_KEY);
  if (!data) {
    return createEmptyKickRecord(profileId);
  }
  
  try {
    const records: Record<string, KickRecord> = JSON.parse(data);
    return records[profileId] || createEmptyKickRecord(profileId);
  } catch {
    return createEmptyKickRecord(profileId);
  }
}

/**
 * Save kick record to storage
 */
function saveKickRecord(record: KickRecord): void {
  const data = storageService.get(KICK_STORAGE_KEY);
  let records: Record<string, KickRecord> = {};
  
  if (data) {
    try {
      records = JSON.parse(data);
    } catch {
      records = {};
    }
  }
  
  records[record.profileId] = record;
  storageService.set(KICK_STORAGE_KEY, JSON.stringify(records));
}

/**
 * Filter kicks by date range
 * Requirements: 7.5
 */
export function filterKicksByDateRange(
  kicks: KickEvent[],
  dateRange: DateRange
): KickEvent[] {
  const fromDate = new Date(dateRange.from).getTime();
  const toDate = new Date(dateRange.to).getTime() + (24 * 60 * 60 * 1000 - 1); // End of day
  
  return kicks.filter(kick => 
    kick.timestamp >= fromDate && kick.timestamp <= toDate
  );
}

/**
 * Aggregate kicks by story
 * Property 10: Kick aggregation by story
 * For any profile, the kick count for each story equals the count of kick events with that storyId
 * Requirements: 7.1
 */
export function aggregateKicksByStory(kicks: KickEvent[]): StoryKickCount[] {
  const storyMap = new Map<number, { count: number; lastTimestamp: number }>();
  
  for (const kick of kicks) {
    const existing = storyMap.get(kick.storyId);
    if (existing) {
      existing.count++;
      existing.lastTimestamp = Math.max(existing.lastTimestamp, kick.timestamp);
    } else {
      storyMap.set(kick.storyId, { count: 1, lastTimestamp: kick.timestamp });
    }
  }
  
  const result: StoryKickCount[] = [];
  for (const [storyId, data] of storyMap) {
    result.push({
      storyId,
      storyTitle: getStoryTitle(storyId),
      count: data.count,
      lastKickTimestamp: data.lastTimestamp,
    });
  }
  
  // Sort by count descending
  return result.sort((a, b) => b.count - a.count);
}

/**
 * Aggregate kicks by category
 * Requirements: 7.1
 */
export function aggregateKicksByCategory(kicks: KickEvent[]): CategoryKickCount[] {
  const categoryMap = new Map<string, number>();
  
  for (const kick of kicks) {
    const category = getStoryCategory(kick.storyId);
    categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
  }
  
  const result: CategoryKickCount[] = [];
  for (const [category, count] of categoryMap) {
    result.push({ category, count });
  }
  
  // Sort by count descending
  return result.sort((a, b) => b.count - a.count);
}

/**
 * Get kick timeline (kicks per day)
 * Requirements: 7.3
 */
export function getKickTimeline(kicks: KickEvent[]): KickTimelineEntry[] {
  const dateMap = new Map<string, number>();
  
  for (const kick of kicks) {
    const date = getDateFromTimestamp(kick.timestamp);
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  }
  
  const result: KickTimelineEntry[] = [];
  for (const [date, count] of dateMap) {
    result.push({ date, count });
  }
  
  // Sort by date ascending
  return result.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate kick statistics
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */
export function calculateKickStats(kicks: KickEvent[]): KickStats {
  const byStory = aggregateKicksByStory(kicks);
  const byCategory = aggregateKicksByCategory(kicks);
  const timeline = getKickTimeline(kicks);
  
  return {
    totalKicks: kicks.length,
    mostActiveStory: byStory.length > 0 ? byStory[0] : null,
    mostActiveCategory: byCategory.length > 0 ? byCategory[0] : null,
    kicksByDay: timeline,
  };
}

/**
 * Count kicks for a specific session
 * Property 9: Session kick counter accuracy
 * For any session, the displayed kick count equals the number of kick events with that sessionId
 * Requirements: 6.4
 */
export function countSessionKicks(kicks: KickEvent[], sessionId: string): number {
  return kicks.filter(kick => kick.sessionId === sessionId).length;
}


/**
 * Kick service interface for managing kick events
 */
export interface IKickService {
  logKick(
    profileId: string,
    storyId: number,
    sectionName: string,
    sessionId: string
  ): KickEvent;
  getKickStats(profileId: string): KickStats;
  getKicksByStory(profileId: string): StoryKickCount[];
  getKickTimeline(profileId: string, dateRange?: DateRange): KickTimelineEntry[];
  getSessionKicks(profileId: string, sessionId: string): KickEvent[];
  getSessionKickCount(profileId: string, sessionId: string): number;
  getAllKicks(profileId: string): KickEvent[];
  getKickRecord(profileId: string): KickRecord;
}

/**
 * Create kick service instance
 */
export function createKickService(): IKickService {
  return {
    /**
     * Log a kick event
     * Property 8: Kick event data completeness
     * Requirements: 6.2
     */
    logKick(
      profileId: string,
      storyId: number,
      sectionName: string,
      sessionId: string
    ): KickEvent {
      const record = loadKickRecord(profileId);
      
      const kick: KickEvent = {
        id: generateKickId(),
        profileId,
        storyId,
        sectionName,
        timestamp: Date.now(),
        sessionId,
      };
      
      // Validate kick event data completeness (Property 8)
      if (!validateKickEvent(kick)) {
        throw new Error('Invalid kick event data');
      }
      
      record.kicks.push(kick);
      record.totalKicks = record.kicks.length;
      
      saveKickRecord(record);
      
      return kick;
    },

    /**
     * Get kick statistics for a profile
     * Requirements: 7.1, 7.2, 7.3, 7.4
     */
    getKickStats(profileId: string): KickStats {
      const record = loadKickRecord(profileId);
      return calculateKickStats(record.kicks);
    },

    /**
     * Get kicks grouped by story
     * Property 10: Kick aggregation by story
     * Requirements: 7.1
     */
    getKicksByStory(profileId: string): StoryKickCount[] {
      const record = loadKickRecord(profileId);
      return aggregateKicksByStory(record.kicks);
    },

    /**
     * Get kick timeline with optional date range filter
     * Requirements: 7.3, 7.5
     */
    getKickTimeline(profileId: string, dateRange?: DateRange): KickTimelineEntry[] {
      const record = loadKickRecord(profileId);
      let kicks = record.kicks;
      
      if (dateRange) {
        kicks = filterKicksByDateRange(kicks, dateRange);
      }
      
      return getKickTimeline(kicks);
    },

    /**
     * Get kicks for a specific session
     * Requirements: 6.4
     */
    getSessionKicks(profileId: string, sessionId: string): KickEvent[] {
      const record = loadKickRecord(profileId);
      return record.kicks.filter(kick => kick.sessionId === sessionId);
    },

    /**
     * Get kick count for a specific session
     * Property 9: Session kick counter accuracy
     * Requirements: 6.4
     */
    getSessionKickCount(profileId: string, sessionId: string): number {
      const record = loadKickRecord(profileId);
      return countSessionKicks(record.kicks, sessionId);
    },

    /**
     * Get all kicks for a profile
     * Requirements: 7.4
     */
    getAllKicks(profileId: string): KickEvent[] {
      const record = loadKickRecord(profileId);
      return [...record.kicks];
    },

    /**
     * Get full kick record for a profile
     */
    getKickRecord(profileId: string): KickRecord {
      return loadKickRecord(profileId);
    },
  };
}

// Default kick service instance
export const kickService = createKickService();

// ============================================================================
// API-based Kick Service Functions
// These functions communicate with the backend API for authenticated users
// Requirements: 13.2, 13.5, 13.6, 14.1, 14.6
// ============================================================================

/**
 * API response types for kick operations
 */

/**
 * Kick event from the API
 * Requirements: 13.5 - Timestamp each kick event with the exact time
 */
export interface KickEventApi {
  id: string;
  timestamp: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Daily kick stats for graph
 * Requirements: 14.1 - Display daily kick count graph
 */
export interface DailyKickStats {
  date: string;
  count: number;
  firstKick: string | null;
  lastKick: string | null;
}

/**
 * Time period stats
 * Requirements: 14.6 - Display kick patterns by time of day
 */
export interface PeriodStats {
  period: string;
  label: string;
  count: number;
  percentage: number;
}

/**
 * Time patterns response
 * Requirements: 14.6 - Display kick patterns by time of day
 */
export interface TimePatterns {
  hourlyDistribution: { hour: number; count: number; label: string }[];
  periodStats: PeriodStats[];
  peakPeriod: { period: string; count: number; percentage: number } | null;
  peakHour: { hour: number; count: number; label: string } | null;
  totalKicks: number;
}

/**
 * Kick statistics from API
 * Requirements: 14.1, 14.6, 14.7
 */
export interface KickStatsApi {
  totalKicks: number;
  daysTracking: number;
  averagePerDay: number;
  weeklyKicks: number;
  weeklyAverage: number;
  firstKickDate: string | null;
  lastKickDate: string | null;
  milestones: {
    achieved: { count: number; label: string }[];
    next: { count: number; label: string } | null;
    progressToNext: number;
  };
}

/**
 * API response types
 */
interface KicksResponse {
  kicks: KickEventApi[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface LogKickResponse {
  message: string;
  kick: KickEventApi;
}

interface UpdateKickResponse {
  message: string;
  kick: KickEventApi;
}

interface DeleteKickResponse {
  message: string;
}

interface DailyStatsResponse {
  days: DailyKickStats[];
  summary: {
    totalKicks: number;
    averagePerDay: number;
    peakDay: { date: string; count: number } | null;
    daysWithKicks: number;
    daysWithoutKicks: number;
  };
}

/**
 * Log a kick event via API
 * Requirements: 13.2 - Allow users to log kicks directly from the journal interface
 * Requirements: 13.5 - Timestamp each kick event with the exact time
 * 
 * @param note - Optional note for the kick event
 * @param timestamp - Optional timestamp (defaults to current time)
 * @returns Promise resolving to the created kick event
 */
export async function logKick(
  note?: string,
  timestamp?: Date
): Promise<KickEventApi> {
  const body: { timestamp: string; note?: string } = {
    timestamp: (timestamp || new Date()).toISOString(),
  };
  
  if (note) {
    body.note = note;
  }
  
  const response = await post<LogKickResponse>('/kicks', body);
  return response.kick;
}

/**
 * Get kick events from the API with optional date range filter
 * Requirements: 13.5 - Timestamp each kick event with the exact time
 * 
 * @param startDate - Optional start date for filtering kicks
 * @param endDate - Optional end date for filtering kicks
 * @param limit - Maximum number of kicks to return (default: 100)
 * @param offset - Offset for pagination (default: 0)
 * @returns Promise resolving to array of kick events with pagination info
 */
export async function getKicks(
  startDate?: Date,
  endDate?: Date,
  limit = 100,
  offset = 0
): Promise<{ kicks: KickEventApi[]; pagination: KicksResponse['pagination'] }> {
  const params = new URLSearchParams();
  
  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }
  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }
  params.append('limit', limit.toString());
  params.append('offset', offset.toString());
  
  const queryString = params.toString();
  const endpoint = `/kicks?${queryString}`;
  
  const response = await get<KicksResponse>(endpoint);
  return {
    kicks: response.kicks,
    pagination: response.pagination,
  };
}

/**
 * Update a kick event (add/update note)
 * Requirements: 13.6 - Allow users to add notes to individual kick events
 * 
 * @param id - Kick event ID
 * @param note - Note to add or update
 * @returns Promise resolving to the updated kick event
 */
export async function updateKick(
  id: string,
  note: string
): Promise<KickEventApi> {
  const response = await put<UpdateKickResponse>(`/kicks/${id}`, { note });
  return response.kick;
}

/**
 * Delete a kick event
 * 
 * @param id - Kick event ID to delete
 * @returns Promise resolving when deletion is complete
 */
export async function deleteKick(id: string): Promise<void> {
  await del<DeleteKickResponse>(`/kicks/${id}`);
}

/**
 * Get daily kick statistics for graph
 * Requirements: 14.1 - Display a daily kick count graph showing kicks over the past 7 days
 * 
 * @param days - Number of days to include (default: 7)
 * @returns Promise resolving to daily kick stats with summary
 */
export async function getDailyStats(
  days = 7
): Promise<{ days: DailyKickStats[]; summary: DailyStatsResponse['summary'] }> {
  const response = await get<DailyStatsResponse>(`/kicks/daily?days=${days}`);
  return {
    days: response.days,
    summary: response.summary,
  };
}

/**
 * Get time-of-day kick patterns
 * Requirements: 14.6 - Display kick patterns by time of day (morning, afternoon, evening, night)
 * 
 * @returns Promise resolving to time patterns data
 */
export async function getTimePatterns(): Promise<TimePatterns> {
  const response = await get<TimePatterns>('/kicks/patterns');
  return response;
}

/**
 * Get overall kick statistics
 * Requirements: 14.1, 14.7 - Display statistics and milestone markers
 * 
 * @returns Promise resolving to kick statistics
 */
export async function getStats(): Promise<KickStatsApi> {
  const response = await get<KickStatsApi>('/kicks/stats');
  return response;
}

/**
 * API-based kick service interface
 * Requirements: 13.2, 13.5, 13.6, 14.1, 14.6
 */
export interface IApiKickService {
  logKick(note?: string, timestamp?: Date): Promise<KickEventApi>;
  getKicks(
    startDate?: Date,
    endDate?: Date,
    limit?: number,
    offset?: number
  ): Promise<{ kicks: KickEventApi[]; pagination: KicksResponse['pagination'] }>;
  updateKick(id: string, note: string): Promise<KickEventApi>;
  deleteKick(id: string): Promise<void>;
  getDailyStats(days?: number): Promise<{ days: DailyKickStats[]; summary: DailyStatsResponse['summary'] }>;
  getTimePatterns(): Promise<TimePatterns>;
  getStats(): Promise<KickStatsApi>;
}

/**
 * API-based kick service object
 * Use this for authenticated users to communicate with the backend
 * Requirements: 13.2, 13.5, 13.6, 14.1, 14.6
 */
export const apiKickService: IApiKickService = {
  logKick,
  getKicks,
  updateKick,
  deleteKick,
  getDailyStats,
  getTimePatterns,
  getStats,
};

export default kickService;
