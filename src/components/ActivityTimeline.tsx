import React from 'react';
import type { ActivityEntry } from '../types/dashboard';

/**
 * ActivityTimeline component for displaying recent learning activities
 * Requirements: 11.4 - Show recent activity timeline
 */

interface ActivityTimelineProps {
  activities: ActivityEntry[];
  className?: string;
  maxItems?: number;
}

/**
 * Format timestamp to relative time string
 */
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  // Format as date for older activities
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get icon and color for activity type
 */
function getActivityStyle(type: ActivityEntry['type']): {
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
} {
  switch (type) {
    case 'story_complete':
      return {
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
          </svg>
        ),
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-600',
      };
    case 'exercise_complete':
      return {
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        ),
        bgColor: 'bg-green-100',
        textColor: 'text-green-600',
      };
    case 'journal_entry':
      return {
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        ),
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-600',
      };
    case 'kick':
      return {
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ),
        bgColor: 'bg-pink-100',
        textColor: 'text-pink-600',
      };
    default:
      return {
        icon: (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ),
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
      };
  }
}


/**
 * Single activity item in the timeline
 */
const ActivityItem: React.FC<{
  activity: ActivityEntry;
  isLast: boolean;
}> = ({ activity, isLast }) => {
  const style = getActivityStyle(activity.type);
  
  return (
    <div className="flex gap-3">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${style.bgColor} ${style.textColor}`}>
          {style.icon}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-200 my-1" />
        )}
      </div>
      
      {/* Activity content */}
      <div className="flex-1 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium text-gray-800 text-sm">{activity.title}</p>
            {activity.description && (
              <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {formatRelativeTime(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  className = '',
  maxItems = 10,
}) => {
  const displayedActivities = activities.slice(0, maxItems);
  
  if (displayedActivities.length === 0) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="p-3 bg-gray-100 rounded-full inline-block mb-3">
          <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">No recent activity</p>
        <p className="text-gray-400 text-xs mt-1">
          Start learning to see your activity here
        </p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      {displayedActivities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          activity={activity}
          isLast={index === displayedActivities.length - 1}
        />
      ))}
      
      {activities.length > maxItems && (
        <p className="text-center text-xs text-gray-400 mt-2">
          +{activities.length - maxItems} more activities
        </p>
      )}
    </div>
  );
};

export default ActivityTimeline;
