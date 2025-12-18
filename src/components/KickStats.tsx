import React, { useState, useEffect } from 'react';
import { kickService } from '../services/kickService';
import type { KickStats as KickStatsType, StoryKickCount, DateRange, KickTimelineEntry } from '../types/kick';

/**
 * KickStats component for displaying kick statistics
 * 
 * Requirements:
 * - 7.1: Aggregate kick counts by story and category
 * - 7.2: Display "Most Active Topics" section showing stories with highest kick counts
 * - 7.3: Show kick activity over time in a simple chart
 * - 7.4: Display total kicks logged across all sessions
 * - 7.5: Allow filtering kick history by date range
 */

interface KickStatsProps {
  /** Profile ID for the current user */
  profileId: string;
  /** Custom class name */
  className?: string;
}

/**
 * Date range presets for filtering
 */
type DateRangePreset = 'week' | 'month' | 'all';

/**
 * Get date range from preset
 */
function getDateRangeFromPreset(preset: DateRangePreset): DateRange | undefined {
  if (preset === 'all') {
    return undefined;
  }

  const now = new Date();
  const to = now.toISOString().split('T')[0];
  
  if (preset === 'week') {
    const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { from: from.toISOString().split('T')[0], to };
  }
  
  if (preset === 'month') {
    const from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { from: from.toISOString().split('T')[0], to };
  }

  return undefined;
}

/**
 * Baby icon for stats
 */
const BabyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

/**
 * Chart icon
 */
const ChartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
);

/**
 * Star icon for most active
 */
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

/**
 * Stat card component
 */
const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

/**
 * Simple bar chart for kick timeline
 * Requirements: 7.3
 */
const KickTimelineChart: React.FC<{ data: KickTimelineEntry[] }> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No kick activity to display
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  // Show last 14 days max
  const displayData = data.slice(-14);

  return (
    <div className="space-y-2">
      <div className="flex items-end gap-1 h-32">
        {displayData.map((entry, index) => {
          const height = (entry.count / maxCount) * 100;
          const date = new Date(entry.date);
          const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          return (
            <div 
              key={entry.date}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div 
                className="w-full bg-gradient-to-t from-pink-400 to-rose-300 rounded-t-sm transition-all duration-300 hover:from-pink-500 hover:to-rose-400"
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${entry.date}: ${entry.count} kicks`}
                aria-label={`${entry.date}: ${entry.count} kicks`}
              />
              <span className="text-xs text-gray-400 truncate w-full text-center">
                {index === 0 || index === displayData.length - 1 ? dayLabel : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{displayData[0]?.date}</span>
        <span>{displayData[displayData.length - 1]?.date}</span>
      </div>
    </div>
  );
};

/**
 * Most active topics list
 * Requirements: 7.2
 */
const MostActiveTopics: React.FC<{ topics: StoryKickCount[] }> = ({ topics }) => {
  if (topics.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No kick data yet. Start logging kicks while reading!
      </div>
    );
  }

  // Show top 5 topics
  const topTopics = topics.slice(0, 5);
  const maxCount = topTopics[0]?.count || 1;

  return (
    <div className="space-y-3">
      {topTopics.map((topic, index) => {
        const percentage = (topic.count / maxCount) * 100;
        
        return (
          <div key={topic.storyId} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {topic.storyTitle}
                </span>
              </div>
              <span className="text-sm font-bold text-pink-600">
                {topic.count}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const KickStats: React.FC<KickStatsProps> = ({
  profileId,
  className = '',
}) => {
  const [stats, setStats] = useState<KickStatsType | null>(null);
  const [kicksByStory, setKicksByStory] = useState<StoryKickCount[]>([]);
  const [timeline, setTimeline] = useState<KickTimelineEntry[]>([]);
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load kick data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        const kickStats = kickService.getKickStats(profileId);
        const storyKicks = kickService.getKicksByStory(profileId);
        const dateRange = getDateRangeFromPreset(dateRangePreset);
        const kickTimeline = kickService.getKickTimeline(profileId, dateRange);

        setStats(kickStats);
        setKicksByStory(storyKicks);
        setTimeline(kickTimeline);
      } catch (error) {
        console.error('Failed to load kick stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [profileId, dateRangePreset]);



  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Grid - Requirements: 7.1, 7.4 */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Total Kicks"
          value={stats?.totalKicks || 0}
          icon={<BabyIcon className="w-6 h-6 text-pink-500" />}
          color="bg-pink-100"
        />
        <StatCard
          label="Most Active Category"
          value={stats?.mostActiveCategory?.category || 'None'}
          icon={<ChartIcon className="w-6 h-6 text-purple-500" />}
          color="bg-purple-100"
        />
      </div>

      {/* Date Range Filter - Requirements: 7.5 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Kick Activity</h3>
          <div className="flex gap-2">
            {(['week', 'month', 'all'] as DateRangePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setDateRangePreset(preset)}
                className={`px-3 py-1 text-sm rounded-lg transition-all ${
                  dateRangePreset === preset
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {preset === 'week' ? '7 Days' : preset === 'month' ? '30 Days' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Chart - Requirements: 7.3 */}
        <KickTimelineChart data={timeline} />
      </div>

      {/* Most Active Topics - Requirements: 7.2 */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Most Active Topics
        </h3>
        <MostActiveTopics topics={kicksByStory} />
      </div>

      {/* Encouragement message */}
      {stats && stats.totalKicks > 0 && (
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
          <p className="text-gray-700 text-center">
            💕 Your baby has responded {stats.totalKicks} times during your learning sessions!
            {stats.mostActiveStory && (
              <span className="block mt-1 text-sm text-gray-500">
                Most active during: {stats.mostActiveStory.storyTitle}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default KickStats;
