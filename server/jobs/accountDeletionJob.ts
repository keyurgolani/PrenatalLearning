import { processExpiredAccountDeletions } from '../routes/account.js';

// Default interval: run every hour (in milliseconds)
const DEFAULT_INTERVAL_MS = 60 * 60 * 1000;

let intervalId: NodeJS.Timeout | null = null;

/**
 * Start the scheduled job for processing expired account deletions.
 * This job runs periodically to find and permanently delete accounts
 * where the 30-day grace period has expired.
 * 
 * @param intervalMs - Interval between job runs in milliseconds (default: 1 hour)
 */
export function startAccountDeletionJob(intervalMs: number = DEFAULT_INTERVAL_MS): void {
  if (intervalId) {
    console.log('Account deletion job is already running');
    return;
  }

  console.log(`Starting account deletion job (interval: ${intervalMs}ms)`);

  // Run immediately on startup
  runJob();

  // Schedule periodic runs
  intervalId = setInterval(runJob, intervalMs);
}

/**
 * Stop the scheduled job for processing expired account deletions.
 */
export function stopAccountDeletionJob(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Account deletion job stopped');
  }
}

/**
 * Run the account deletion job once.
 */
async function runJob(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Running account deletion job...`);
  
  try {
    const deletedCount = await processExpiredAccountDeletions();
    console.log(`[${new Date().toISOString()}] Account deletion job completed. Deleted ${deletedCount} accounts.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Account deletion job failed:`, error);
  }
}

/**
 * Check if the account deletion job is currently running.
 */
export function isAccountDeletionJobRunning(): boolean {
  return intervalId !== null;
}
