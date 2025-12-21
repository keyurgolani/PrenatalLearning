/**
 * Kick tracking components
 * 
 * Requirements:
 * - 13.1: Display daily kick count summary within the journal view for each date
 * - 13.2: Allow users to log kicks directly from the journal interface
 * - 13.3: Show kick events that occurred on that date when viewing a journal entry
 * - 13.4: Provide a quick-add kick button in the floating journal bar
 * - 13.6: Allow users to add notes to individual kick events
 * - 14.1: Display a daily kick count graph showing kicks over the past 7 days
 * - 14.3: Highlight peak activity times in the visualization
 * - 14.4: Use inspiring and calming visual design for graphs
 * - 14.6: Display kick patterns by time of day (morning, afternoon, evening, night)
 * - 14.7: Show milestone markers when kick counts reach significant numbers
 */

export { KickLogButton, type KickLogButtonProps } from './KickLogButton';
export { KickDailySummary, type KickDailySummaryProps } from './KickDailySummary';
export { KickGraph, type KickGraphProps } from './KickGraph';
export { KickPatternChart, type KickPatternChartProps } from './KickPatternChart';
