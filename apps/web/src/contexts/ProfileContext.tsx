/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useMemo } from 'react';
import type { ProfileContextValue } from '../types/auth';
import { useAuth } from './AuthContext';

/**
 * ProfileContext - Simplified version after removing baby profiles feature
 * Users now have a single account per baby (create new account for new baby)
 * This context provides backward compatibility for components that used activeProfile
 */
const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

interface ProfileProviderProps {
  children: React.ReactNode;
}

/**
 * ProfileProvider component - simplified to work without baby profiles
 * The "active profile" is now just the user's account
 */
export function ProfileProvider({ children }: ProfileProviderProps): React.ReactElement {
  const { user, isAuthenticated } = useAuth();

  // Create a synthetic profile from the user's data for backward compatibility
  const activeProfile = useMemo(() => {
    if (!isAuthenticated || !user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      expectedDate: user.dueDate || undefined,
      birthDate: undefined,
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [isAuthenticated, user]);

  const contextValue = useMemo<ProfileContextValue>(() => ({
    profiles: activeProfile ? [activeProfile] : [],
    activeProfile,
    isLoading: false,
    error: null,
    // These functions are no-ops since profiles are removed
    createProfile: async () => { throw new Error('Profiles feature has been removed'); },
    switchProfile: async () => { /* no-op */ },
    updateProfile: async () => { throw new Error('Profiles feature has been removed'); },
    archiveProfile: async () => { /* no-op */ },
    refreshProfiles: async () => { /* no-op */ },
    clearError: () => { /* no-op */ },
  }), [activeProfile]);

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

/**
 * Hook to access profile context
 * @throws Error if used outside of ProfileProvider
 */
export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileProvider;
