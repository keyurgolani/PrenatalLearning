/**
 * Trimester type representing pregnancy stages
 * - first: weeks 1-12
 * - second: weeks 13-26
 * - third: weeks 27-40
 * - any: content suitable for all trimesters
 */
export type Trimester = 'first' | 'second' | 'third' | 'any';

/**
 * Information about the current trimester based on due date
 */
export interface TrimesterInfo {
  trimester: Trimester;
  weekNumber: number;
  daysRemaining: number;
  startDate: Date;
  endDate: Date;
}
