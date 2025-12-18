import React from 'react';
import { Link } from 'react-router-dom';
import { ViewModeToggle } from './ViewModeToggle';
import { MiniAudioPlayer } from './MiniAudioPlayer';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  // Props kept for backwards compatibility but no longer used in header
  completedCount?: number;
  totalCount?: number;
  progressPercentage?: number;
}

/**
 * Branded Logo component - themed with current theme colors
 * Baby has soft peach skin tone with theme-colored accents and 3D shadow
 */
const BrandLogo: React.FC<{ primaryColor?: string; secondaryColor?: string }> = ({ 
  primaryColor = '#7c3aed', 
  secondaryColor = '#a855f7' 
}) => (
  <div className="relative flex-shrink-0">
    {/* White background circle for contrast */}
    <div className="absolute inset-0 bg-white rounded-full shadow-md" />
    <svg viewBox="0 0 48 48" className="w-11 h-11 relative" aria-hidden="true">
      {/* Outer ring with theme color */}
      <circle cx="24" cy="24" r="23" fill="none" stroke={primaryColor} strokeWidth="2.5" opacity="0.5" />
      {/* Main background - theme gradient */}
      <circle cx="24" cy="24" r="21" fill="url(#logoGradientThemed)" />
      
      {/* Baby illustration with 3D shadow effect */}
      <g transform="translate(24, 25)" filter="url(#babyShadow)">
        {/* Body shadow (offset down-right for 3D effect) */}
        <ellipse cx="1" cy="7" rx="6" ry="8" fill="rgba(0,0,0,0.15)" />
        {/* Head shadow */}
        <circle cx="1" cy="-4" r="5.5" fill="rgba(0,0,0,0.15)" />
        
        {/* Body - soft peach with theme outline */}
        <ellipse cx="0" cy="5" rx="6" ry="8" fill="url(#skinGradient)" stroke={primaryColor} strokeWidth="0.8" />
        {/* Head - soft peach with theme outline */}
        <circle cx="0" cy="-6" r="5.5" fill="url(#skinGradient)" stroke={primaryColor} strokeWidth="0.8" />
        
        {/* Highlight on head for 3D effect */}
        <circle cx="-2" cy="-8" r="2" fill="rgba(255,255,255,0.4)" />
        
        {/* Rosy cheeks */}
        <circle cx="-2.5" cy="-4" r="1" fill="#FFB5C5" opacity="0.6" />
        <circle cx="2.5" cy="-4" r="1" fill="#FFB5C5" opacity="0.6" />
        {/* Closed eyes - theme colored */}
        <path d="M-2.5 -7 Q-1.5 -8 -0.5 -7" stroke={primaryColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M0.5 -7 Q1.5 -8 2.5 -7" stroke={primaryColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Smile */}
        <path d="M-1.5 -3.5 Q0 -2 1.5 -3.5" stroke={primaryColor} strokeWidth="0.8" fill="none" strokeLinecap="round" />
        {/* Sprout on head */}
        <path d="M0 -11.5 Q-2.5 -14 0 -16 Q2.5 -14 0 -11.5" fill="#7DD3A0" stroke="#5CB87A" strokeWidth="0.6" />
        <path d="M0 -11.5 L0 -10" stroke="#5CB87A" strokeWidth="1" strokeLinecap="round" />
      </g>
      
      {/* Sparkles with white color */}
      <g fill="#ffffff" opacity="0.9">
        <circle cx="10" cy="12" r="2" />
        <circle cx="38" cy="14" r="1.5" />
        <circle cx="8" cy="34" r="1.2" />
        <circle cx="40" cy="32" r="1.8" />
      </g>
      
      <defs>
        {/* Theme gradient for background */}
        <linearGradient id="logoGradientThemed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.85" />
        </linearGradient>
        
        {/* Skin gradient for 3D effect on baby */}
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF5E6" />
          <stop offset="50%" stopColor="#FFECD2" />
          <stop offset="100%" stopColor="#F5DCC3" />
        </linearGradient>
        
        {/* Drop shadow filter for baby */}
        <filter id="babyShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="rgba(0,0,0,0.2)" />
        </filter>
      </defs>
    </svg>
  </div>
);

/**
 * Header component - clean, uniform design
 */
export const Header: React.FC<HeaderProps> = () => {
  const { currentTheme } = useTheme();

  return (
    <header className="relative z-20 flex-shrink-0" role="banner">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      {/* Background */}
      <div 
        className="absolute inset-0 transition-theme"
        style={{ background: `linear-gradient(135deg, ${currentTheme.colors.primary} 0%, ${currentTheme.colors.secondary} 100%)` }}
      />
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative text-white py-3 px-4 lg:px-6 xl:px-8 2xl:px-12">
        <div className="w-full">
          {/* Main header row: Logo left, MiniPlayer center, ViewToggle right */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            {/* Left: Logo and Title */}
            <Link 
              to="/"
              className="flex items-center gap-2 group"
              aria-label="Prenatal Learning Hub - Go to home page"
            >
              <BrandLogo 
                primaryColor={currentTheme.colors.primary || '#7c3aed'} 
                secondaryColor={currentTheme.colors.secondary || '#a855f7'} 
              />
              <span className="hidden sm:block text-base font-semibold tracking-tight">
                Prenatal Learning Hub
              </span>
            </Link>

            {/* Center: Mini Audio Player (appears when audio is playing) */}
            <div className="flex items-center justify-center">
              <MiniAudioPlayer />
            </div>

            {/* Right: View Toggle only */}
            <ViewModeToggle variant="header" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
