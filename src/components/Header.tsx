import React from 'react';

interface HeaderProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

/**
 * Header component with progress display
 * 
 * Requirements:
 * - 2.3: Display overall progress as a percentage and count of completed stories
 * - 4.1: Display a soft gradient background using calming colors
 */
export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalCount,
  progressPercentage,
}) => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-white py-8 px-6 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Title and Tagline */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Prenatal Learning Hub
            </h1>
            <p className="text-purple-100 mt-1 text-sm md:text-base">
              Nurturing minds before birth through the wonder of knowledge
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm font-bold">{progressPercentage}%</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
                role="progressbar"
                aria-valuenow={progressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            
            {/* Completed Count */}
            <p className="text-xs text-purple-100 mt-2 text-center">
              {completedCount} of {totalCount} stories completed
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
