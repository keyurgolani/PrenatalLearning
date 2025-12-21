import React, { useMemo, useState, useEffect } from 'react';
import { useKick, type DailyKickStats } from '../../contexts/KickContext';
import { BabyKickIcon } from '../../components/icons/BabyKickIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';

/**
 * KickGraph component - Beautiful visualization of daily kick counts
 * 
 * Requirements:
 * - 14.1: THE System SHALL display a daily kick count graph showing kicks over the past 7 days
 * - 14.4: THE System SHALL use inspiring and calming visual design for graphs
 * - 14.7: THE System SHALL show milestone markers when kick counts reach significant numbers
 */

export interface KickGraphProps {
  /** Number of days to display (default: 7) */
  days?: number;
  /** Height of the graph in pixels */
  height?: number;
  /** Whether to show milestone markers */
  showMilestones?: boolean;
  /** Custom class name */
  className?: string;
  /** Chart type: 'bar' or 'line' */
  chartType?: 'bar' | 'line';
  /** Compact mode for smaller displays */
  compact?: boolean;
}

import { Star, Trophy, Crown, Sparkles, Award } from 'lucide-react';

/**
 * Milestone definitions for kick counts
 */
const MILESTONES = [
  { count: 10, label: 'First 10!', icon: <Star className="w-4 h-4 text-amber-500" /> },
  { count: 25, label: '25 kicks!', icon: <Star className="w-4 h-4 text-amber-500 fill-current" /> },
  { count: 50, label: '50 kicks!', icon: <Sparkles className="w-4 h-4 text-purple-500" /> },
  { count: 100, label: '100 kicks!', icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
  { count: 200, label: '200 kicks!', icon: <Award className="w-4 h-4 text-orange-500" /> },
  { count: 500, label: '500 kicks!', icon: <Crown className="w-4 h-4 text-yellow-600 fill-current" /> },
];

/**
 * Get milestone for a given count
 */
function getMilestoneForCount(count: number): { count: number; label: string; icon: React.ReactNode } | null {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (count >= MILESTONES[i].count) {
      return MILESTONES[i];
    }
  }
  return null;
}

/**
 * Format date for display (e.g., "Mon", "Tue")
 */
function formatDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Format date for tooltip (e.g., "Dec 18")
 */
function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Check if a date is today
 */
function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}



/**
 * KickGraph - A beautiful, calming visualization of daily kick counts
 */
export const KickGraph: React.FC<KickGraphProps> = ({
  days = 7,
  height = 220,
  showMilestones = true,
  className = '',
  chartType = 'bar',
  compact = false,
}) => {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  const { dailyStats, stats, refreshDailyStats, isLoading } = useKick();

  const [isAnimated, setIsAnimated] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated && activeProfile) {
      refreshDailyStats(days);
    }
  }, [isAuthenticated, activeProfile, days, refreshDailyStats]);

  useEffect(() => {
    if (dailyStats.length > 0 && !isLoading) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [dailyStats, isLoading]);

  const graphData = useMemo(() => {
    if (dailyStats.length === 0) {
      const emptyData: DailyKickStats[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        emptyData.push({
          date: date.toISOString().split('T')[0],
          count: 0,
          firstKick: null,
          lastKick: null,
        });
      }
      return emptyData;
    }
    return dailyStats.slice(-days);
  }, [dailyStats, days]);

  const maxCount = useMemo(() => {
    const max = Math.max(...graphData.map(d => d.count), 1);
    return Math.ceil(max / 5) * 5 || 10;
  }, [graphData]);

  const totalKicks = useMemo(() => {
    return graphData.reduce((sum, d) => sum + d.count, 0);
  }, [graphData]);

  const currentMilestone = useMemo(() => {
    if (!stats) return null;
    return getMilestoneForCount(stats.totalKicks);
  }, [stats]);

  const nextMilestone = useMemo(() => {
    if (!stats) return null;
    return MILESTONES.find(m => m.count > stats.totalKicks) || null;
  }, [stats]);

  if (!isAuthenticated || !activeProfile) {
    return null;
  }

  const padding = { top: 24, right: 16, bottom: 48, left: 32 };
  const graphHeight = height - padding.top - padding.bottom;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Beautiful gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(236, 72, 153, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className={`${compact ? 'px-3 py-2' : 'px-4 py-3'} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-lg shadow-sm">
              <BabyKickIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold text-gray-800 ${compact ? 'text-sm' : 'text-base'}`}>
                Daily Kicks
              </h3>
              {!compact && (
                <p className="text-xs text-gray-500">Past {days} days</p>
              )}
            </div>
          </div>
          
          {/* Total kicks badge */}
          <div className="flex items-center gap-2">
            {compact && <span className="text-xs text-gray-500">Last {days} days</span>}
            <div className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-md shadow-pink-200/50">
              <span className={`font-bold ${compact ? 'text-sm' : 'text-base'}`}>{totalKicks}</span>
              <span className={`ml-1 opacity-90 ${compact ? 'text-xs' : 'text-sm'}`}>kicks</span>
            </div>
          </div>
        </div>

        {/* Milestone banner */}
        {showMilestones && currentMilestone && !compact && (
          <div className="mx-4 mb-2 px-3 py-2 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 backdrop-blur-sm rounded-xl border border-amber-200/50 flex items-center justify-center gap-2">
            <span className="text-base" aria-hidden="true">{currentMilestone.icon}</span>
            <span className="text-sm font-medium text-amber-700">
              {currentMilestone.label}
            </span>
            <span className="text-base" aria-hidden="true">{currentMilestone.icon}</span>
          </div>
        )}

        {/* Graph container */}
        <div className={compact ? 'px-2 pb-2' : 'px-4 pb-3'}>
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ height }}>
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-500 animate-spin" />
                  <BabyKickIcon className="absolute inset-0 m-auto w-5 h-5 text-pink-400" />
                </div>
                <span className="text-sm text-gray-500">Loading activity...</span>
              </div>
            </div>
          ) : (
            <div className="relative" style={{ height }}>
              <svg
                width="100%"
                height={height}
                viewBox={`0 0 400 ${height}`}
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-label={`Kick activity chart showing ${totalKicks} kicks over the last ${days} days`}
              >
                <defs>
                  {/* Bar gradients */}
                  <linearGradient id="barGradientActive" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#db2777" />
                    <stop offset="100%" stopColor="#be185d" />
                  </linearGradient>
                  <linearGradient id="barGradientNormal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f9a8d4" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                  <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  
                  {/* Line chart gradients */}
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                  </linearGradient>
                  
                  {/* Glow filter */}
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  
                  {/* Shadow filter */}
                  <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ec4899" floodOpacity="0.3"/>
                  </filter>
                </defs>

                {/* Background grid */}
                <rect 
                  x={padding.left} 
                  y={padding.top} 
                  width={400 - padding.left - padding.right} 
                  height={graphHeight}
                  fill="white"
                  fillOpacity="0.5"
                  rx="8"
                />

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padding.top + graphHeight * (1 - ratio);
                  const value = Math.round(maxCount * ratio);
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={400 - padding.right}
                        y2={y}
                        stroke={ratio === 0 ? "#fda4af" : "#fce7f3"}
                        strokeWidth={ratio === 0 ? "2" : "1"}
                        strokeDasharray={ratio === 0 ? "0" : "6,4"}
                        strokeLinecap="round"
                      />
                      <text
                        x={padding.left - 6}
                        y={y + 4}
                        textAnchor="end"
                        fill="#9ca3af"
                        fontSize="10"
                        fontWeight="500"
                      >
                        {value}
                      </text>
                    </g>
                  );
                })}

                {/* Chart content */}
                {chartType === 'bar' ? (
                  graphData.map((day, index) => {
                    const barPadding = 6;
                    const availableWidth = (400 - padding.left - padding.right) / graphData.length;
                    const actualBarWidth = Math.min(availableWidth - barPadding * 2, 36);
                    const xOffset = (availableWidth - actualBarWidth) / 2;
                    const x = padding.left + index * availableWidth + xOffset;
                    const barHeight = day.count > 0 ? Math.max((day.count / maxCount) * graphHeight, 8) : 4;
                    const y = padding.top + graphHeight - barHeight;
                    const today = isToday(day.date);
                    const isHovered = hoveredBar === index;

                    return (
                      <g 
                        key={day.date}
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Bar background (for empty days) */}
                        {day.count === 0 && (
                          <rect
                            x={x}
                            y={padding.top + graphHeight - 4}
                            width={actualBarWidth}
                            height={4}
                            rx="2"
                            fill="#fce7f3"
                          />
                        )}
                        
                        {/* Main bar */}
                        {day.count > 0 && (
                          <rect
                            x={x}
                            y={isAnimated ? y : padding.top + graphHeight}
                            width={actualBarWidth}
                            height={isAnimated ? barHeight : 0}
                            rx="6"
                            fill={today ? "url(#barGradientActive)" : isHovered ? "url(#barGradientHover)" : "url(#barGradientNormal)"}
                            filter={today || isHovered ? "url(#barShadow)" : "none"}
                            className="transition-all duration-500 ease-out"
                            style={{ transitionDelay: `${index * 60}ms` }}
                          />
                        )}
                        
                        {/* Count label */}
                        {day.count > 0 && (
                          <g
                            className="transition-all duration-500 ease-out"
                            style={{ 
                              opacity: isAnimated ? 1 : 0,
                              transitionDelay: `${index * 60 + 300}ms` 
                            }}
                          >
                            {/* Label background */}
                            <rect
                              x={x + actualBarWidth / 2 - 12}
                              y={y - 22}
                              width={24}
                              height={18}
                              rx="9"
                              fill={today ? "#ec4899" : "#f472b6"}
                              fillOpacity={isHovered ? 1 : 0.9}
                            />
                            <text
                              x={x + actualBarWidth / 2}
                              y={y - 10}
                              textAnchor="middle"
                              fill="white"
                              fontSize="11"
                              fontWeight="600"
                            >
                              {day.count}
                            </text>
                          </g>
                        )}

                        {/* Day label */}
                        <text
                          x={x + actualBarWidth / 2}
                          y={height - 24}
                          textAnchor="middle"
                          fill={today ? "#db2777" : "#6b7280"}
                          fontSize="11"
                          fontWeight={today ? "700" : "500"}
                        >
                          {formatDayLabel(day.date)}
                        </text>
                        
                        {/* Date label */}
                        <text
                          x={x + actualBarWidth / 2}
                          y={height - 10}
                          textAnchor="middle"
                          fill="#9ca3af"
                          fontSize="9"
                        >
                          {formatDateLabel(day.date)}
                        </text>

                        {/* Today indicator dot */}
                        {today && (
                          <circle
                            cx={x + actualBarWidth / 2}
                            cy={height - 38}
                            r="3"
                            fill="#ec4899"
                            className="animate-pulse"
                          />
                        )}
                      </g>
                    );
                  })
                ) : (
                  /* Line chart */
                  <>
                    <path
                      d={`
                        M ${padding.left} ${padding.top + graphHeight}
                        ${graphData.map((day, index) => {
                          const availableWidth = (400 - padding.left - padding.right) / graphData.length;
                          const x = padding.left + index * availableWidth + availableWidth / 2;
                          const y = padding.top + graphHeight - (day.count / maxCount) * graphHeight;
                          return `L ${x} ${isAnimated ? y : padding.top + graphHeight}`;
                        }).join(' ')}
                        L ${400 - padding.right - (400 - padding.left - padding.right) / graphData.length / 2} ${padding.top + graphHeight}
                        Z
                      `}
                      fill="url(#areaGradient)"
                      className="transition-all duration-700 ease-out"
                    />

                    <path
                      d={graphData.map((day, index) => {
                        const availableWidth = (400 - padding.left - padding.right) / graphData.length;
                        const x = padding.left + index * availableWidth + availableWidth / 2;
                        const y = padding.top + graphHeight - (day.count / maxCount) * graphHeight;
                        return `${index === 0 ? 'M' : 'L'} ${x} ${isAnimated ? y : padding.top + graphHeight}`;
                      }).join(' ')}
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-all duration-700 ease-out"
                    />

                    {graphData.map((day, index) => {
                      const availableWidth = (400 - padding.left - padding.right) / graphData.length;
                      const x = padding.left + index * availableWidth + availableWidth / 2;
                      const y = padding.top + graphHeight - (day.count / maxCount) * graphHeight;
                      const today = isToday(day.date);

                      return (
                        <g key={day.date}>
                          <circle
                            cx={x}
                            cy={isAnimated ? y : padding.top + graphHeight}
                            r={today ? 7 : 5}
                            fill="white"
                            stroke={today ? "#ec4899" : "#f472b6"}
                            strokeWidth="3"
                            filter={today ? "url(#glow)" : "none"}
                            className="transition-all duration-700 ease-out"
                            style={{ transitionDelay: `${index * 50}ms` }}
                          />

                          {day.count > 0 && (
                            <text
                              x={x}
                              y={isAnimated ? y - 14 : padding.top + graphHeight - 14}
                              textAnchor="middle"
                              fill="#db2777"
                              fontSize="11"
                              fontWeight="600"
                              className="transition-all duration-700 ease-out"
                              style={{ transitionDelay: `${index * 50 + 200}ms` }}
                            >
                              {day.count}
                            </text>
                          )}

                          <text
                            x={x}
                            y={height - 24}
                            textAnchor="middle"
                            fill={today ? "#db2777" : "#6b7280"}
                            fontSize="11"
                            fontWeight={today ? "700" : "500"}
                          >
                            {formatDayLabel(day.date)}
                          </text>
                          
                          <text
                            x={x}
                            y={height - 10}
                            textAnchor="middle"
                            fill="#9ca3af"
                            fontSize="9"
                          >
                            {formatDateLabel(day.date)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                )}
              </svg>

              {/* Empty state */}
              {totalKicks === 0 && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-pink-100">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center">
                      <BabyKickIcon className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="text-gray-700 font-medium">No kicks yet</p>
                    <p className="text-gray-500 text-sm mt-1">
                      Start tracking your baby's movements!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer stats */}
        {!isLoading && totalKicks > 0 && (
          <div className={`${compact ? 'px-3 py-2.5' : 'px-4 py-3'} bg-white/70 backdrop-blur-sm border-t border-pink-100/50`}>
            <div className={`flex items-center gap-4 ${compact ? 'text-xs' : 'text-sm'}`}>
              {/* Average stat */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500" />
                <span className="text-gray-500">Avg:</span>
                <span className="font-bold text-pink-600">{(totalKicks / days).toFixed(1)}</span>
                <span className="text-gray-400">/day</span>
              </div>
              
              {/* Next milestone with progress */}
              {nextMilestone && stats && (
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-gray-400 shrink-0">Next:</span>
                  <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden min-w-[60px]">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min((stats.totalKicks / nextMilestone.count) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-bold text-amber-600">{nextMilestone.count}</span>
                    <span className="text-sm">{nextMilestone.icon}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KickGraph;
