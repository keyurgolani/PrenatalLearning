import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useProfile } from '../../contexts/ProfileContext';
import type { CreateProfileData } from '../../types/auth';

/**
 * Props for the ProfileSelector component
 */
interface ProfileSelectorProps {
  /** Whether the selector dropdown is open */
  isOpen: boolean;
  /** Callback when selector should close */
  onClose: () => void;
  /** Optional callback when a profile is switched */
  onProfileSwitch?: () => void;
}

/**
 * ProfileSelector component for managing baby profiles
 * 
 * Requirements:
 * - 7.3: Allow users to switch between baby profiles from a profile selector
 * - 7.5: Display the active baby profile name in the header
 */
export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  isOpen,
  onClose,
  onProfileSwitch,
}) => {
  const { 
    profiles, 
    activeProfile, 
    isLoading, 
    error,
    createProfile, 
    switchProfile,
    clearError,
  } = useProfile();
  
  // State for create profile form
  const [isCreating, setIsCreating] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileExpectedDate, setNewProfileExpectedDate] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  
  // Refs for focus management
  const selectorRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle name input change - memoized to prevent unnecessary re-renders
   * Requirements: 7.8 - Properly display text input as user types
   */
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfileName(e.target.value);
  }, []);

  /**
   * Handle date input change - memoized to prevent unnecessary re-renders
   */
  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfileExpectedDate(e.target.value);
  }, []);

  // Focus name input when creating
  useEffect(() => {
    if (isCreating && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCreating]);

  // Clear errors when opening/closing
  useEffect(() => {
    if (isOpen) {
      clearError();
      setCreateError(null);
    }
  }, [isOpen, clearError]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (isCreating) {
          setIsCreating(false);
          setNewProfileName('');
          setNewProfileExpectedDate('');
          setCreateError(null);
        } else {
          onClose();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isCreating, onClose]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  /**
   * Handle switching to a different profile
   * Requirements: 7.3 - Allow users to switch between baby profiles
   */
  const handleSwitchProfile = useCallback(async (profileId: string) => {
    if (activeProfile?.id === profileId) {
      return; // Already active
    }

    try {
      await switchProfile(profileId);
      onProfileSwitch?.();
      onClose();
    } catch {
      // Error is handled by ProfileContext
    }
  }, [activeProfile?.id, switchProfile, onProfileSwitch, onClose]);

  /**
   * Handle creating a new profile
   * Requirements: 7.1 - Create new baby profile with name and dates
   */
  const handleCreateProfile = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newProfileName.trim()) {
      setCreateError('Please enter a name for the profile');
      return;
    }

    const profileData: CreateProfileData = {
      name: newProfileName.trim(),
    };

    if (newProfileExpectedDate) {
      profileData.expectedDate = newProfileExpectedDate;
    }

    try {
      await createProfile(profileData);
      // Reset form and close create mode
      setNewProfileName('');
      setNewProfileExpectedDate('');
      setIsCreating(false);
    } catch {
      setCreateError('Failed to create profile. Please try again.');
    }
  }, [newProfileName, newProfileExpectedDate, createProfile]);

  /**
   * Cancel creating a new profile
   */
  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewProfileName('');
    setNewProfileExpectedDate('');
    setCreateError(null);
  }, []);

  /**
   * Format date for display
   */
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  // Filter out archived profiles
  const activeProfiles = profiles.filter(p => !p.isArchived);

  return (
    <div
      ref={selectorRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-pop-in"
      role="menu"
      aria-label="Baby profile selector"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-3 text-white">
        <h3 className="font-semibold text-sm">Baby Profiles</h3>
        <p className="text-purple-100 text-xs mt-0.5">
          Switch between profiles or create a new one
        </p>
      </div>

      {/* Error Message */}
      {(error || createError) && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-100">
          <p className="text-sm text-red-600 flex items-center gap-1.5">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error || createError}
          </p>
        </div>
      )}

      {/* Profile List */}
      {!isCreating && (
        <div className="max-h-64 overflow-y-auto">
          {activeProfiles.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">No profiles yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first baby profile</p>
            </div>
          ) : (
            <ul className="py-1" role="listbox" aria-label="Available profiles">
              {activeProfiles.map((profile) => {
                const isActive = activeProfile?.id === profile.id;
                return (
                  <li key={profile.id}>
                    <button
                      onClick={() => handleSwitchProfile(profile.id)}
                      disabled={isLoading}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                        isActive ? 'bg-purple-50' : ''
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      role="option"
                      aria-selected={isActive}
                    >
                      {/* Profile Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        isActive 
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-500' 
                          : 'bg-gray-300'
                      }`}>
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      
                      {/* Profile Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium truncate ${
                            isActive ? 'text-purple-700' : 'text-gray-900'
                          }`}>
                            {profile.name}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                              Active
                            </span>
                          )}
                        </div>
                        {(profile.expectedDate || profile.birthDate) && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {profile.birthDate 
                              ? `Born: ${formatDate(profile.birthDate)}`
                              : `Due: ${formatDate(profile.expectedDate)}`
                            }
                          </p>
                        )}
                      </div>

                      {/* Active Indicator */}
                      {isActive && (
                        <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Create Profile Form */}
      {isCreating && (
        <form onSubmit={handleCreateProfile} className="p-4 space-y-3">
          <div>
            <label 
              htmlFor="new-profile-name" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Baby's Name
            </label>
            <input
              ref={nameInputRef}
              id="new-profile-name"
              type="text"
              value={newProfileName}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-white"
              style={{ color: '#111827' }}
              placeholder="Enter baby's name"
              disabled={isLoading}
              maxLength={50}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div>
            <label 
              htmlFor="new-profile-date" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expected/Birth Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="new-profile-date"
              type="date"
              value={newProfileExpectedDate}
              onChange={handleDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm bg-white"
              style={{ color: '#111827' }}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancelCreate}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !newProfileName.trim()}
              className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Profile</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Footer - Create New Profile Button */}
      {!isCreating && (
        <div className="border-t border-gray-100 p-2">
          <button
            onClick={() => setIsCreating(true)}
            disabled={isLoading}
            className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileSelector;
