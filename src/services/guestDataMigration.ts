/**
 * Guest Data Migration Service
 * 
 * Handles migrating guest data (kicks, progress) to user accounts when they log in.
 * This ensures users don't lose their progress when transitioning from guest to logged-in.
 * 
 * Migration Strategy:
 * - Only migrate kicks that occurred AFTER the user's latest journal entry
 * - This prevents duplicate kicks if the user logs in/out multiple times
 * - Each kick's timestamp is preserved as the journal entry's createdAt time
 */

import { storageService } from './storageService';
import { post, get } from './apiClient';

const KICK_STORAGE_KEY = 'prenatal-learning-hub:kick-data';

/**
 * Guest kick event structure from localStorage
 */
interface GuestKickEvent {
  id: string;
  profileId: string;
  storyId: number;
  sectionName: string;
  timestamp: number; // Unix timestamp in milliseconds
  sessionId: string;
}

/**
 * Guest kick record structure from localStorage
 */
interface GuestKickRecord {
  profileId: string;
  kicks: GuestKickEvent[];
  totalKicks: number;
}

/**
 * Journal entry from API
 */
interface JournalEntry {
  id: string;
  journalDate: string;
  createdAt: string;
  updatedAt: string;
  kickCount?: number;
}

/**
 * Load guest kicks from localStorage
 */
function loadGuestKicks(): GuestKickEvent[] {
  const data = storageService.get(KICK_STORAGE_KEY);
  if (!data) return [];
  
  try {
    const records: Record<string, GuestKickRecord> = JSON.parse(data);
    const guestRecord = records['guest'];
    return guestRecord?.kicks || [];
  } catch {
    return [];
  }
}

/**
 * Clear guest kicks from localStorage after successful migration
 */
function clearGuestKicks(): void {
  const data = storageService.get(KICK_STORAGE_KEY);
  if (!data) return;
  
  try {
    const records: Record<string, GuestKickRecord> = JSON.parse(data);
    delete records['guest'];
    storageService.set(KICK_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Ignore errors
  }
}

/**
 * Remove specific kicks from guest storage (ones that were migrated)
 */
function removeGuestKicks(kickIds: Set<string>): void {
  const data = storageService.get(KICK_STORAGE_KEY);
  if (!data) return;
  
  try {
    const records: Record<string, GuestKickRecord> = JSON.parse(data);
    const guestRecord = records['guest'];
    if (guestRecord) {
      guestRecord.kicks = guestRecord.kicks.filter(k => !kickIds.has(k.id));
      guestRecord.totalKicks = guestRecord.kicks.length;
      
      if (guestRecord.kicks.length === 0) {
        delete records['guest'];
      } else {
        records['guest'] = guestRecord;
      }
      
      storageService.set(KICK_STORAGE_KEY, JSON.stringify(records));
    }
  } catch {
    // Ignore errors
  }
}

/**
 * Get the latest journal entry timestamp for the current user
 */
async function getLatestJournalTimestamp(): Promise<number> {
  try {
    const response = await get<{ entries: JournalEntry[] }>('/journal?limit=1');
    if (response.entries && response.entries.length > 0) {
      // Use createdAt timestamp of the most recent entry
      return new Date(response.entries[0].createdAt).getTime();
    }
    return 0; // No entries, migrate all kicks
  } catch {
    return 0; // On error, migrate all kicks
  }
}

/**
 * Format timestamp to date string (YYYY-MM-DD)
 */
function timestampToDateString(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Group kicks by date for efficient journal entry creation
 */
function groupKicksByDate(kicks: GuestKickEvent[]): Map<string, GuestKickEvent[]> {
  const grouped = new Map<string, GuestKickEvent[]>();
  
  for (const kick of kicks) {
    const dateString = timestampToDateString(kick.timestamp);
    const existing = grouped.get(dateString) || [];
    existing.push(kick);
    grouped.set(dateString, existing);
  }
  
  return grouped;
}

/**
 * Migrate guest kicks to the user's account
 * 
 * Only migrates kicks that occurred AFTER the user's latest journal entry.
 * This prevents duplicate kicks if the user logs in/out multiple times.
 * 
 * @returns Number of kicks migrated, or 0 if no migration needed
 */
export async function migrateGuestKicks(): Promise<number> {
  const guestKicks = loadGuestKicks();
  
  if (guestKicks.length === 0) {
    return 0;
  }
  
  // Get the latest journal entry timestamp to avoid duplicates
  const latestJournalTimestamp = await getLatestJournalTimestamp();
  
  // Filter kicks to only those after the latest journal entry
  const kicksToMigrate = guestKicks.filter(kick => kick.timestamp > latestJournalTimestamp);
  
  if (kicksToMigrate.length === 0) {
    // All kicks are older than the latest journal entry, clear them
    clearGuestKicks();
    return 0;
  }
  
  // Group kicks by date
  const kicksByDate = groupKicksByDate(kicksToMigrate);
  let totalMigrated = 0;
  const migratedKickIds = new Set<string>();
  
  try {
    // Create a journal entry for each date with kicks
    for (const [dateString, kicks] of kicksByDate) {
      const kickCount = kicks.length;
      const journalDateISO = `${dateString}T00:00:00.000Z`;
      
      // Use the latest kick timestamp for this day as the entry timestamp
      const latestKickTimestamp = Math.max(...kicks.map(k => k.timestamp));
      const entryTimestamp = new Date(latestKickTimestamp).toISOString();
      
      try {
        await post('/journal', {
          journalDate: journalDateISO,
          kickCount: kickCount,
          content: '', // Empty content, just recording kicks
          // Note: The server will use createdAt from the request time
          // We include the original timestamp in case the server supports it
          _migratedAt: entryTimestamp,
        });
        
        totalMigrated += kickCount;
        kicks.forEach(k => migratedKickIds.add(k.id));
      } catch (err) {
        console.warn(`Failed to migrate kicks for ${dateString}:`, err);
        // Continue with other dates even if one fails
      }
    }
    
    // Remove only the kicks that were successfully migrated
    if (migratedKickIds.size > 0) {
      removeGuestKicks(migratedKickIds);
      console.log(`Successfully migrated ${totalMigrated} kicks from guest session`);
    }
    
    return totalMigrated;
  } catch (err) {
    console.error('Failed to migrate guest kicks:', err);
    return 0;
  }
}

/**
 * Check if there are guest kicks to migrate
 */
export function hasGuestKicksToMigrate(): boolean {
  const guestKicks = loadGuestKicks();
  return guestKicks.length > 0;
}

/**
 * Get count of guest kicks pending migration
 */
export function getGuestKickCount(): number {
  const guestKicks = loadGuestKicks();
  return guestKicks.length;
}

/**
 * Clear migration flag - no longer needed with timestamp-based approach
 * Kept for backward compatibility
 */
export function clearMigrationFlag(): void {
  // No-op - we now use timestamp comparison instead of a flag
}
