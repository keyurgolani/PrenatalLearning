import type { Trimester, TrimesterInfo } from '../types/trimester';
import type { Story } from '../types';

/**
 * Total pregnancy duration in weeks
 */
const PREGNANCY_WEEKS = 40;

/**
 * Trimester week boundaries
 */
const FIRST_TRIMESTER_END = 12;
const SECOND_TRIMESTER_END = 26;

/**
 * Calculates the current week number of pregnancy based on due date.
 * Week 1 starts 40 weeks before the due date.
 * 
 * @param dueDate - Expected due date
 * @param currentDate - Current date (defaults to now)
 * @returns Week number (1-40+)
 */
export function getWeekNumber(dueDate: Date, currentDate: Date = new Date()): number {
  const dueDateMs = dueDate.getTime();
  const currentMs = currentDate.getTime();
  
  // Calculate conception date (40 weeks before due date)
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const conceptionDateMs = dueDateMs - (PREGNANCY_WEEKS * msPerWeek);
  
  // Calculate weeks since conception
  const msSinceConception = currentMs - conceptionDateMs;
  const weeksSinceConception = msSinceConception / msPerWeek;
  
  // Week number is 1-indexed
  return Math.floor(weeksSinceConception) + 1;
}

/**
 * Determines the trimester based on week number.
 * - First trimester: weeks 1-12
 * - Second trimester: weeks 13-26
 * - Third trimester: weeks 27-40
 * 
 * @param week - Week number of pregnancy
 * @returns Trimester ('first', 'second', or 'third')
 */
export function getTrimesterFromWeek(week: number): Trimester {
  if (week <= FIRST_TRIMESTER_END) {
    return 'first';
  }
  if (week <= SECOND_TRIMESTER_END) {
    return 'second';
  }
  return 'third';
}

/**
 * Calculates comprehensive trimester information from a due date.
 * 
 * @param dueDate - Expected due date
 * @param currentDate - Current date (defaults to now)
 * @returns TrimesterInfo object with trimester, week, and date information
 */
export function calculateTrimester(dueDate: Date, currentDate: Date = new Date()): TrimesterInfo {
  const weekNumber = getWeekNumber(dueDate, currentDate);
  const trimester = getTrimesterFromWeek(weekNumber);
  
  const msPerDay = 24 * 60 * 60 * 1000;
  const msPerWeek = 7 * msPerDay;
  
  // Calculate conception date (start of pregnancy)
  const conceptionDateMs = dueDate.getTime() - (PREGNANCY_WEEKS * msPerWeek);
  
  // Calculate trimester boundaries
  let trimesterStartWeek: number;
  let trimesterEndWeek: number;
  
  switch (trimester) {
    case 'first':
      trimesterStartWeek = 1;
      trimesterEndWeek = FIRST_TRIMESTER_END;
      break;
    case 'second':
      trimesterStartWeek = FIRST_TRIMESTER_END + 1;
      trimesterEndWeek = SECOND_TRIMESTER_END;
      break;
    case 'third':
      trimesterStartWeek = SECOND_TRIMESTER_END + 1;
      trimesterEndWeek = PREGNANCY_WEEKS;
      break;
    default:
      trimesterStartWeek = 1;
      trimesterEndWeek = PREGNANCY_WEEKS;
  }
  
  // Calculate start and end dates for current trimester
  const startDate = new Date(conceptionDateMs + ((trimesterStartWeek - 1) * msPerWeek));
  const endDate = new Date(conceptionDateMs + (trimesterEndWeek * msPerWeek));
  
  // Calculate days remaining until due date
  const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - currentDate.getTime()) / msPerDay));
  
  return {
    trimester,
    weekNumber,
    daysRemaining,
    startDate,
    endDate,
  };
}


/**
 * Filters stories by trimester.
 * Stories marked as 'any' appear in all trimester filters.
 * When filter is 'all', returns all stories.
 * 
 * Requirements: 1.3, 1.5
 * - WHEN a user selects a trimester filter, THE System SHALL display only stories recommended for that trimester
 * - THE System SHALL allow stories marked as "any" to appear in all trimester filters
 * 
 * @param stories - Array of stories to filter
 * @param trimester - Trimester to filter by ('first', 'second', 'third', 'any', or 'all')
 * @returns Filtered array of stories matching the trimester or marked as 'any'
 */
export function filterStoriesByTrimester(
  stories: Story[],
  trimester: Trimester | 'all'
): Story[] {
  if (trimester === 'all') {
    return stories;
  }
  
  return stories.filter((story) => 
    story.recommendedTrimester === trimester || story.recommendedTrimester === 'any'
  );
}
