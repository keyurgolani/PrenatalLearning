import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ViewModeToggle } from './ViewModeToggle';
import { MiniAudioPlayer } from './MiniAudioPlayer';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useTrimester } from '../contexts/TrimesterContext';
import { useReadingMode } from '../contexts/ReadingModeContext';
import { useModal } from '../contexts';

/**
 * Calendar Popup Component for date selection in user menu - matches SecondaryHeader calendar
 */
interface UserMenuCalendarPopupProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onClear: () => void;
  onClose: () => void;
}

const UserMenuCalendarPopup: React.FC<UserMenuCalendarPopupProps> = ({ selectedDate, onSelectDate, onClear, onClose }) => {
  const { currentTheme } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const isDark = currentTheme.isDark;
  
  // Start with selected date's month or current month
  const [viewDate, setViewDate] = useState(() => {
    const base = selectedDate || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === viewDate.getMonth() && 
           selectedDate.getFullYear() === viewDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === viewDate.getMonth() && 
           today.getFullYear() === viewDate.getFullYear();
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onSelectDate(newDate);
    onClose();
  };

  const days = [];
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const selected = isSelected(day);
    const today = isToday(day);
    days.push(
      <button
        key={day}
        onClick={() => handleDayClick(day)}
        className={`w-8 h-8 rounded-full text-xs font-medium transition-all ${
          selected 
            ? 'text-white shadow-md' 
            : today
              ? 'font-bold'
              : ''
        }`}
        style={{
          backgroundColor: selected 
            ? currentTheme.colors.primary 
            : today 
              ? `${currentTheme.colors.primary}20` 
              : 'transparent',
          color: selected 
            ? '#ffffff' 
            : isDark 
              ? currentTheme.colors.text 
              : '#374151',
        }}
        onMouseEnter={(e) => {
          if (!selected && !today) {
            e.currentTarget.style.backgroundColor = isDark 
              ? currentTheme.colors.surfaceHover || currentTheme.colors.border 
              : '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          if (!selected && !today) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {day}
      </button>
    );
  }

  return (
    <div
      ref={popupRef}
      className="rounded-xl shadow-lg overflow-hidden animate-pop-in"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-3 py-2"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
          borderBottom: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}`,
        }}
      >
        <button
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Previous month"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-white">{monthName}</span>
        <button
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          aria-label="Next month"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-0.5 px-2 pt-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div 
            key={d} 
            className="w-8 h-6 flex items-center justify-center text-[10px] font-semibold uppercase"
            style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5 p-2">
        {days}
      </div>

      {/* Footer with clear button */}
      {selectedDate && (
        <div 
          className="px-2 py-2"
          style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
        >
          <button
            onClick={() => { onClear(); onClose(); }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors text-red-500"
            style={{ 
              backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Due Date
          </button>
        </div>
      )}
    </div>
  );
};

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
 * User menu dropdown component for authenticated users
 * Requirements: 15.2 - Display user's name and profile menu when logged in
 * Requirements: 17.4 - Display due date in user dropdown menu when user is logged in
 * Requirements: 5.8 - Display account settings content properly without blank pages
 */
interface UserMenuProps {
  onLogout: () => void;
  onOpenAccountSettings: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLogout, onOpenAccountSettings }) => {
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const { hasDueDate, currentTrimester, currentWeek, dueDate, setDueDate, clearDueDate } = useTrimester();
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isDark = currentTheme.isDark;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    onLogout();
  }, [onLogout]);

  const handleOpenAccountSettings = useCallback(() => {
    setIsOpen(false);
    onOpenAccountSettings();
  }, [onOpenAccountSettings]);

  if (!user) return null;

  return (
    <div ref={menuRef} className="relative">
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium button-interactive focus-ring-light"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* User Avatar */}
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        {/* User Name */}
        <span className="hidden sm:inline font-medium leading-tight">{user.name}</span>

        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-xl overflow-hidden z-50 animate-pop-in"
          style={{
            backgroundColor: isDark ? currentTheme.colors.surface : '#ffffff',
            border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
          }}
          role="menu"
        >
          {/* User Info Header */}
          <div 
            className="px-4 py-3"
            style={{
              backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb',
              borderBottom: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}`,
            }}
          >
            <p 
              className="font-medium truncate"
              style={{ color: isDark ? currentTheme.colors.text : '#111827' }}
            >
              {user.name}
            </p>
            <p 
              className="text-sm truncate"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
            >
              {user.email}
            </p>
          </div>

          {/* Due Date Section - Requirements: 17.4 - Display due date in user dropdown menu */}
          <div 
            className="px-4 py-2"
            style={{
              borderBottom: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}`,
            }}
          >
            <p 
              className="text-xs uppercase tracking-wide mb-1"
              style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
            >
              Due Date
            </p>
            {hasDueDate ? (
              <div className="space-y-2">
                {/* Current trimester and week display */}
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center gap-2 p-1.5 -mx-1.5 rounded-lg transition-colors"
                  style={{
                    backgroundColor: isDark ? `${currentTheme.colors.primary}20` : '#faf5ff',
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentTrimester === 'first' ? 'bg-pink-500' :
                    currentTrimester === 'second' ? 'bg-purple-500' : 'bg-indigo-500'
                  }`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p 
                      className="font-medium text-sm"
                      style={{ color: isDark ? currentTheme.colors.text : '#111827' }}
                    >
                      {currentTrimester === 'first' ? '1st' : currentTrimester === 'second' ? '2nd' : '3rd'} Trimester
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                    >
                      Week {currentWeek} • Due {dueDate?.toLocaleDateString()}
                    </p>
                  </div>
                  <svg 
                    className="w-4 h-4" 
                    style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                
                {/* Calendar popup */}
                {showCalendar && (
                  <UserMenuCalendarPopup
                    selectedDate={dueDate}
                    onSelectDate={(date) => {
                      setDueDate(date);
                      setShowCalendar(false);
                    }}
                    onClear={() => {
                      clearDueDate();
                      setShowCalendar(false);
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>
            ) : (
              /* No due date set - show set button */
              <div className="space-y-2">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full flex items-center gap-2 text-left rounded-lg p-1.5 -mx-1.5 transition-colors"
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || '' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                  role="menuitem"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: isDark ? currentTheme.colors.border : '#f3f4f6' }}
                  >
                    <svg 
                      className="w-4 h-4" 
                      style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="font-medium text-sm"
                      style={{ color: isDark ? currentTheme.colors.text : '#111827' }}
                    >
                      Set due date
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}
                    >
                      For personalized content
                    </p>
                  </div>
                  <svg 
                    className="w-4 h-4" 
                    style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                
                {/* Calendar popup */}
                {showCalendar && (
                  <UserMenuCalendarPopup
                    selectedDate={null}
                    onSelectDate={(date) => {
                      setDueDate(date);
                      setShowCalendar(false);
                    }}
                    onClear={() => setShowCalendar(false)}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleOpenAccountSettings}
              className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors"
              style={{ 
                color: isDark ? currentTheme.colors.text : '#374151',
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? currentTheme.colors.surfaceHover || '' : '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              role="menuitem"
            >
              <svg 
                className="w-5 h-5" 
                style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Account Settings
            </button>
          </div>

          {/* Logout */}
          <div 
            className="py-1"
            style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}
          >
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-red-500 flex items-center gap-3 transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              role="menuitem"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Header component - clean, uniform design
 * Requirements: 15.1 - Display login/register button when no user is logged in
 * Requirements: 15.2 - Display user's name and profile menu when logged in
 * Requirements: 7.5 - Display active baby profile name in header
 */
export const Header: React.FC<HeaderProps> = () => {
  const { currentTheme } = useTheme();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { settings } = useReadingMode();
  const { openLogin, openRegister, openSettings } = useModal();
  
  /**
   * Handle logout
   * Requirements: 4.3 - Redirect to home page in guest mode
   */
  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return (
    <header className="relative z-50 flex-shrink-0" role="banner">
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
          {/* Main header row: Logo left, ViewToggle right, MiniPlayer absolutely centered */}
          <div className="relative flex items-center justify-between gap-3">
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

            {/* Center: Mini Audio Player (fixed at bottom centered, appears when audio is playing) - hidden in reading mode */}
            {!settings?.readingModeEnabled && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-center pointer-events-none">
                <div className="pointer-events-auto">
                  <MiniAudioPlayer />
                </div>
              </div>
            )}

            {/* Right: View Toggle and Auth */}
            <div className="flex items-center gap-2">
              <ViewModeToggle variant="header" />
              
              {/* Auth Section */}
              {authLoading ? (
                // Loading state
                <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
              ) : isAuthenticated ? (
                // Authenticated: Show user menu
                // Requirements: 15.2 - Display user's name and profile menu when logged in
                <UserMenu 
                  onLogout={handleLogout} 
                  onOpenAccountSettings={openSettings}
                />
              ) : (
                // Not authenticated: Show login/register buttons
                // Requirements: 15.1 - Display login/register button when no user is logged in
                <div className="flex items-center gap-2">
                  <button
                    onClick={openLogin}
                    className="px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openRegister}
                    className="px-3 py-1.5 text-sm font-medium bg-white text-purple-600 hover:bg-white/90 rounded-lg transition-colors"
                    aria-label="Create a new account"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
