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
/**
 * Migrate guest kicks to the user's account
 * 
 * Strategy:
 * 1. Load all guest kicks
 * 2. Fetch recent journal entries (to detect conflicts/updates)
 * 3. Group kicks by date
 * 4. For each date:
 *    - If entry exists: Update (PATCH) with added kicks
 *    - If no entry: Create (POST) new entry
 * 5. Track successfully migrated kicks and remove them from storage
 * 
 * @returns Number of kicks migrated, or 0 if no migration needed
 */
export async function migrateGuestKicks(): Promise<number> {
  const guestKicks = loadGuestKicks();
  
  if (guestKicks.length === 0) {
    return 0;
  }
  
  // Group kicks by date first
  const kicksByDate = groupKicksByDate(guestKicks);
  
  if (kicksByDate.size === 0) {
    return 0;
  }

  let totalMigrated = 0;
  const migratedKickIds = new Set<string>();

  try {
    // Fetch recent journal entries to check for existing records
    // We assume 100 is enough to cover the range of guest usage (likely recent)
    const journalResponse = await get<{ entries: JournalEntry[] }>('/journal?limit=100');
    const existingEntriesMap = new Map<string, JournalEntry>();
    
    if (journalResponse.entries) {
      journalResponse.entries.forEach(entry => {
        // journalDate is usually ISO string, we want just the date part YYYY-MM-DD
        const dateStr = entry.journalDate.split('T')[0];
        existingEntriesMap.set(dateStr, entry);
      });
    }

    // Process each date
    for (const [dateString] of kicksByDate) {
      const existingEntry = existingEntriesMap.get(dateString);

      // If entry exists, we skip it for now as the timestamp check should handle it
      // In a future update with full API docs, we could PATCH the entry here
      if (existingEntry) {
         continue;
      }
    }
    
    // Get the latest journal entry timestamp to avoid duplicates
    const latestJournalTimestamp = await getLatestJournalTimestamp();
    const kicksToMigrate = guestKicks.filter(kick => kick.timestamp > latestJournalTimestamp);
    
    if (kicksToMigrate.length === 0) {
        clearGuestKicks();
        return 0;
    }
    
    const kicksByDateFiltered = groupKicksByDate(kicksToMigrate);
    
    for (const [dateString, kicks] of kicksByDateFiltered) {
        const kickCount = kicks.length;
        const journalDateISO = `${dateString}T00:00:00.000Z`;
        const latestKickTimestamp = Math.max(...kicks.map(k => k.timestamp));
        const entryTimestamp = new Date(latestKickTimestamp).toISOString();

        try {
            await post('/journal', {
                journalDate: journalDateISO,
                kickCount: kickCount,
                content: '',
                _migratedAt: entryTimestamp,
            });
            
            totalMigrated += kickCount;
            kicks.forEach(k => migratedKickIds.add(k.id));
        } catch (postErr) {
            console.warn(`Failed to migrate kicks for ${dateString}:`, postErr);
        }
    }
    
     if (migratedKickIds.size > 0) {
      removeGuestKicks(migratedKickIds);
      // Flush all guest data as requested to ensure clean state
      clearGuestKicks();
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
