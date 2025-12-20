import React, { useEffect } from 'react';
import { useStreak } from '../contexts/StreakContext';
import { useTheme } from '../contexts/ThemeContext';
import { STREAK_MILESTONES } from '../types/streak';

/**
 * StreakBadge component for displaying current streak in header
 * Requirements: 4.3 - Display current streak count in header or profile area
 * Requirements: 4.6 - Display streak milestones with celebratory messages
 */

interface StreakBadgeProps {
  /** Whether to show in compact mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Get milestone message for celebration
 */
function getMilestoneMessage(milestone: number): string {
  switch (milestone) {
    case 7:
      return '🎉 One week streak! Amazing!';
    case 30:
      return '🏆 30 day streak! Incredible!';
    case 100:
      return '👑 100 day streak! Legendary!';
    default:
      return `🎉 ${milestone} day milestone!`;
  }
}

/**
 * Get streak status color based on streak count
 */
function getStreakColor(streak: number, hasActiveStreak: boolean): string {
  if (!hasActiveStreak || streak === 0) {
    return 'text-gray-400';
  }
  if (streak >= 100) {
    return 'text-yellow-400';
  }
  if (streak >= 30) {
    return 'text-purple-400';
  }
  if (streak >= 7) {
    return 'text-orange-400';
  }
  return 'text-orange-300';
}

/**
 * Fire icon for streak display
 */
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 23c-4.97 0-9-3.58-9-8 0-2.52 1.17-4.83 3-6.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c.47-.17.97-.29 1.5-.36V6c0-.55.45-1 1-1s1 .45 1 1v2.28c.53.07 1.03.19 1.5.36V8c0-.55.45-1 1-1s1 .45 1 1v.64c1.83 1.53 3 3.84 3 6.36 0 4.42-4.03 8-9 8zm0-14c-3.31 0-6 2.69-6 6 0 2.76 2.69 5 6 5s6-2.24 6-5c0-3.31-2.69-6-6-6z" />
    <path d="M12 19c-1.66 0-3-1.12-3-2.5S10.34 14 12 14s3 1.12 3 2.5-1.34 2.5-3 2.5z" />
  </svg>
);


/**
 * Milestone celebration modal
 */
const MilestoneCelebration: React.FC<{
  milestone: number;
  onClose: () => void;
}> = ({ milestone, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Streak milestone celebration"
    >
      <div 
        className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4 animate-bounce-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl mb-4">
          {milestone >= 100 ? '👑' : milestone >= 30 ? '🏆' : '🔥'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {milestone} Day Streak!
        </h2>
        <p className="text-gray-600 mb-4">
          {getMilestoneMessage(milestone)}
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {STREAK_MILESTONES.map(m => (
            <div
              key={m}
              className={`w-3 h-3 rounded-full ${
                milestone >= m ? 'bg-orange-400' : 'bg-gray-200'
              }`}
              aria-label={`${m} day milestone ${milestone >= m ? 'achieved' : 'not achieved'}`}
            />
          ))}
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full font-medium hover:from-orange-500 hover:to-red-600 transition-all"
        >
          Keep Going!
        </button>
      </div>
    </div>
  );
};

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  compact = false,
  className = '',
}) => {
  const { currentStreak, hasActiveStreak, currentMilestone, clearMilestone } = useStreak();
  const { currentTheme } = useTheme();
  
  // Show celebration is derived from currentMilestone presence
  const showCelebration = currentMilestone !== null;

  const handleCloseCelebration = () => {
    clearMilestone();
  };

  const streakColor = getStreakColor(currentStreak, hasActiveStreak);
  const isOnFire = hasActiveStreak && currentStreak > 0;

  // Calculate flame size based on streak weeks
  const streakWeeks = Math.floor(currentStreak / 7);
  const getFlameSize = () => {
    if (streakWeeks >= 10) return 'text-lg'; // 10+ weeks
    if (streakWeeks >= 4) return 'text-base'; // 4+ weeks
    if (streakWeeks >= 1) return 'text-sm'; // 1+ week
    return 'text-xs'; // less than a week
  };
  
  const isRadiating = streakWeeks >= 15;

  if (compact) {
    return (
      <>
        <div
          className={`flex items-center gap-1.5 ${className}`}
          title={`${currentStreak} day streak${!hasActiveStreak ? ' (inactive)' : ''}`}
          aria-label={`Current streak: ${currentStreak} days${!hasActiveStreak ? ', inactive' : ''}`}
        >
          <span 
            className={`${getFlameSize()} ${isRadiating ? 'animate-radiate' : ''}`}
            style={isRadiating ? { 
              filter: 'drop-shadow(0 0 4px rgba(251, 146, 60, 0.8))',
            } : undefined}
          >
            🔥
          </span>
          <span 
            className="text-sm font-semibold"
            style={{ color: currentTheme.isDark ? currentTheme.colors.text : '#374151' }}
          >
            {currentStreak}d
          </span>
          <span 
            className="text-sm"
            style={{ color: currentTheme.isDark ? currentTheme.colors.textMuted : '#6b7280' }}
          >
            streak
          </span>
        </div>
        {showCelebration && currentMilestone && (
          <MilestoneCelebration
            milestone={currentMilestone}
            onClose={handleCloseCelebration}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={`bg-white/15 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 ${className}`}
        aria-label={`Current streak: ${currentStreak} days${!hasActiveStreak ? ', inactive' : ''}`}
      >
        <div className="flex items-center gap-2">
          <FireIcon className={`w-5 h-5 ${streakColor} ${isOnFire ? 'animate-pulse' : ''}`} />
          <div className="flex flex-col">
            <span className={`text-lg font-bold ${streakColor}`}>
              {currentStreak}
            </span>
            <span className="text-xs text-white/70">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
        </div>
      </div>
      {showCelebration && currentMilestone && (
        <MilestoneCelebration
          milestone={currentMilestone}
          onClose={handleCloseCelebration}
        />
      )}
    </>
  );
};

export default StreakBadge;
