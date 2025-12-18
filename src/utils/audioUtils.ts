/**
 * Audio utility functions
 *
 * Requirements:
 * - 3.1: Progress calculation for audio playback
 * - 3.3: Time formatting in MM:SS format
 */

/**
 * Format time in seconds to MM:SS format
 * Requirements: 3.3
 * @param seconds - Time in seconds
 * @returns Formatted time string in MM:SS format
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) {
    return '00:00';
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate progress percentage from current time and duration
 * Requirements: 3.1
 * @param currentTime - Current playback time in seconds
 * @param duration - Total duration in seconds
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(currentTime: number, duration: number): number {
  if (duration <= 0 || !isFinite(duration) || !isFinite(currentTime)) {
    return 0;
  }
  const progress = (currentTime / duration) * 100;
  return Math.min(100, Math.max(0, progress));
}
