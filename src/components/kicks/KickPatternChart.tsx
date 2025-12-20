import React, { useMemo, useState, useEffect } from 'react';
import { useKick, type PeriodStats } from '../../contexts/KickContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProfile } from '../../contexts/ProfileContext';

/**
 * KickPatternChart component - Time-of-day distribution visualization
 * 
 * Requirements:
 * - 14.3: THE System SHALL highlight peak activity times in the visualization
 * - 14.6: THE System SHALL display kick patterns by time of day (morning, afternoon, evening, night)
 */

export interface KickPatternChartProps {
  /** Height of the chart in pixels */
  height?: number;
  /** Whether to show hourly breakdown */
  showHourly?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Period icons and colors for visual representation
 */
const PERIOD_CONFIG: Record<string, { icon: string; color: string; gradient: string; bgColor: string }> = {
  morning: {
    icon: '🌅',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-400',
    bgColor: 'bg-amber-50',
  },
  afternoon: {
    icon: '☀️',
    color: '#eab308',
    gradient: 'from-yellow-400 to-amber-400',
    bgColor: 'bg-yellow-50',
  },
  evening: {
    icon: '🌆',
    color: '#f97316',
    gradient: 'from-orange-400 to-rose-400',
    bgColor: 'bg-orange-50',
  },
  night: {
    icon: '🌙',
    color: '#8b5cf6',
    gradient: 'from-purple-400 to-indigo-400',
    bgColor: 'bg-purple-50',
  },
};

/**
 * Baby kick icon SVG
 */
const BabyKickIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
  </svg>
);

/**
 * Period card component for displaying individual time period stats
 */
const PeriodCard: React.FC<{
  period: PeriodStats;
  isPeak: boolean;
  isAnimated: boolean;
  index: number;
}> = ({ period, isPeak, isAnimated, index }) => {
  const config = PERIOD_CONFIG[period.period] || PERIOD_CONFIG.morning;
  
  return (
    <div
      className={`
        relative flex flex-col items-center p-3 rounded-xl transition-all duration-500
        ${isPeak ? 'ring-2 ring-pink-300 shadow-lg scale-105' : 'hover:scale-102'}
        ${config.bgColor}
      `}
      style={{
        transitionDelay: `${index * 100}ms`,
        opacity: isAnimated ? 1 : 0,
        transform: isAnimated ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      {/* Peak indicator badge */}
      {isPeak && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-medium rounded-full shadow-sm">
          Peak ⭐
        </div>
      )}
      
      {/* Period icon */}
      <span className="text-2xl mb-1" aria-hidden="true">
        {config.icon}
      </span>
      
      {/* Period label */}
      <span className="text-xs font-medium text-gray-600 capitalize mb-2">
        {period.label}
      </span>
      
      {/* Kick count */}
      <span 
        className={`text-xl font-bold ${isPeak ? 'text-pink-600' : 'text-gray-700'}`}
      >
        {period.count}
      </span>
      
      {/* Percentage bar */}
      <div className="w-full mt-2">
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${config.gradient} transition-all duration-700 ease-out`}
            style={{
              width: isAnimated ? `${period.percentage}%` : '0%',
              transitionDelay: `${index * 100 + 200}ms`,
            }}
          />
        </div>
        <span className="text-xs text-gray-500 mt-1 block text-center">
          {period.percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
};

/**
 * Radial chart for visual time distribution
 */
const RadialChart: React.FC<{
  periods: PeriodStats[];
  peakPeriod: string | null;
  isAnimated: boolean;
}> = ({ periods, peakPeriod, isAnimated }) => {
  const size = 160;
  const center = size / 2;
  const radius = 60;
  const innerRadius = 35;
  
  // Calculate angles for each period (4 equal segments)
  const segmentAngle = (2 * Math.PI) / 4;
  const startOffset = -Math.PI / 2; // Start from top
  
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
      role="img"
      aria-label="Kick pattern radial chart"
    >
      <defs>
        <linearGradient id="morningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="afternoonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="eveningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
        <linearGradient id="nightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <filter id="peakGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#fce7f3"
        strokeWidth="2"
      />
      
      {/* Period segments */}
      {periods.map((period, index) => {
        const startAngle = startOffset + index * segmentAngle;
        const endAngle = startAngle + segmentAngle;
        const isPeak = period.period === peakPeriod;
        
        // Calculate the arc radius based on percentage
        const arcRadius = innerRadius + (radius - innerRadius) * (period.percentage / 100);
        
        // Calculate arc path
        const x1 = center + arcRadius * Math.cos(startAngle);
        const y1 = center + arcRadius * Math.sin(startAngle);
        const x2 = center + arcRadius * Math.cos(endAngle);
        const y2 = center + arcRadius * Math.sin(endAngle);
        
        // Inner arc points
        const ix1 = center + innerRadius * Math.cos(startAngle);
        const iy1 = center + innerRadius * Math.sin(startAngle);
        const ix2 = center + innerRadius * Math.cos(endAngle);
        const iy2 = center + innerRadius * Math.sin(endAngle);
        
        const gradientId = `${period.period}Grad`;
        
        return (
          <g key={period.period}>
            <path
              d={`
                M ${ix1} ${iy1}
                L ${isAnimated ? x1 : ix1} ${isAnimated ? y1 : iy1}
                A ${isAnimated ? arcRadius : innerRadius} ${isAnimated ? arcRadius : innerRadius} 0 0 1 ${isAnimated ? x2 : ix2} ${isAnimated ? y2 : iy2}
                L ${ix2} ${iy2}
                A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1}
              `}
              fill={`url(#${gradientId})`}
              opacity={isPeak ? 1 : 0.7}
              filter={isPeak ? 'url(#peakGlow)' : undefined}
              className="transition-all duration-700 ease-out"
              style={{ transitionDelay: `${index * 100}ms` }}
            />
          </g>
        );
      })}
      
      {/* Center circle with total */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius - 5}
        fill="white"
        stroke="#fce7f3"
        strokeWidth="1"
      />
      
      {/* Center icon */}
      <text
        x={center}
        y={center - 5}
        textAnchor="middle"
        fontSize="16"
        aria-hidden="true"
      >
        👶
      </text>
      <text
        x={center}
        y={center + 12}
        textAnchor="middle"
        fontSize="10"
        fill="#6b7280"
        fontWeight="500"
      >
        kicks
      </text>
    </svg>
  );
};

/**
 * KickPatternChart - Time-of-day distribution visualization
 * 
 * Requirements:
 * - 14.3: Highlight peak activity times in the visualization
 * - 14.6: Display kick patterns by time of day (morning, afternoon, evening, night)
 */
export const KickPatternChart: React.FC<KickPatternChartProps> = ({
  height = 280,
  showHourly = false,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const { activeProfile } = useProfile();
  const { timePatterns, refreshTimePatterns, isLoading } = useKick();
  
  // Animation state
  const [isAnimated, setIsAnimated] = useState(false);
  
  // Fetch time patterns when component mounts
  useEffect(() => {
    if (isAuthenticated && activeProfile) {
      refreshTimePatterns();
    }
  }, [isAuthenticated, activeProfile, refreshTimePatterns]);
  
  // Trigger animation after data loads
  useEffect(() => {
    if (timePatterns && !isLoading) {
      const timer = setTimeout(() => setIsAnimated(true), 100);
      return () => clearTimeout(timer);
    }
  }, [timePatterns, isLoading]);
  
  // Get period stats with defaults
  const periodStats = useMemo<PeriodStats[]>(() => {
    if (!timePatterns?.periodStats) {
      return [
        { period: 'morning', label: 'Morning', count: 0, percentage: 0 },
        { period: 'afternoon', label: 'Afternoon', count: 0, percentage: 0 },
        { period: 'evening', label: 'Evening', count: 0, percentage: 0 },
        { period: 'night', label: 'Night', count: 0, percentage: 0 },
      ];
    }
    return timePatterns.periodStats;
  }, [timePatterns]);
  
  // Get peak period
  const peakPeriod = useMemo(() => {
    return timePatterns?.peakPeriod?.period || null;
  }, [timePatterns]);
  
  // Calculate total kicks
  const totalKicks = useMemo(() => {
    return timePatterns?.totalKicks || 0;
  }, [timePatterns]);
  
  // Don't render if not authenticated or no active profile
  if (!isAuthenticated || !activeProfile) {
    return null;
  }
  
  return (
    <div 
      className={`bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-2xl border border-pink-100 overflow-hidden ${className}`}
      style={{ minHeight: height }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-pink-100/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BabyKickIcon className="w-5 h-5 text-pink-500" />
          <h3 className="font-medium text-gray-800">
            Activity Patterns
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Time of day
          </span>
          {totalKicks > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              {totalKicks} total
            </span>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex items-center justify-center" style={{ height: height - 60 }}>
            <div className="flex flex-col items-center gap-2">
              <svg className="animate-spin w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-sm text-gray-500">Loading patterns...</span>
            </div>
          </div>
        ) : totalKicks === 0 ? (
          <div className="flex items-center justify-center" style={{ height: height - 60 }}>
            <div className="text-center px-4">
              <BabyKickIcon className="w-12 h-12 text-pink-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                No kick patterns yet
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Start logging kicks to see activity patterns!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Radial chart */}
            <div className="flex justify-center">
              <RadialChart
                periods={periodStats}
                peakPeriod={peakPeriod}
                isAnimated={isAnimated}
              />
            </div>
            
            {/* Period cards grid */}
            <div className="grid grid-cols-4 gap-2">
              {periodStats.map((period, index) => (
                <PeriodCard
                  key={period.period}
                  period={period}
                  isPeak={period.period === peakPeriod}
                  isAnimated={isAnimated}
                  index={index}
                />
              ))}
            </div>
            
            {/* Hourly breakdown (optional) */}
            {showHourly && timePatterns?.hourlyDistribution && (
              <div className="mt-4 pt-4 border-t border-pink-100/50">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Hourly Distribution
                </h4>
                <div className="flex items-end justify-between h-16 gap-0.5">
                  {timePatterns.hourlyDistribution.map((hour, index) => {
                    const maxCount = Math.max(...timePatterns.hourlyDistribution.map(h => h.count), 1);
                    const heightPercent = (hour.count / maxCount) * 100;
                    const isPeakHour = timePatterns.peakHour?.hour === hour.hour;
                    
                    return (
                      <div
                        key={hour.hour}
                        className="flex-1 flex flex-col items-center"
                        title={`${hour.label}: ${hour.count} kicks`}
                      >
                        <div
                          className={`w-full rounded-t transition-all duration-500 ${
                            isPeakHour 
                              ? 'bg-gradient-to-t from-pink-500 to-rose-400' 
                              : 'bg-gradient-to-t from-pink-300 to-pink-200'
                          }`}
                          style={{
                            height: isAnimated ? `${Math.max(heightPercent, 4)}%` : '4%',
                            transitionDelay: `${index * 30}ms`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>12am</span>
                  <span>6am</span>
                  <span>12pm</span>
                  <span>6pm</span>
                  <span>12am</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer with peak info */}
      {!isLoading && totalKicks > 0 && peakPeriod && (
        <div className="px-4 py-3 bg-pink-50/50 border-t border-pink-100/50">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-gray-600">
              Your baby is most active in the
            </span>
            <span className="font-medium text-pink-600 capitalize flex items-center gap-1">
              {PERIOD_CONFIG[peakPeriod]?.icon} {peakPeriod}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KickPatternChart;
