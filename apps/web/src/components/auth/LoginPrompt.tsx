import React, { useCallback, useEffect, useRef } from 'react';

/**
 * Types of persistence features that require login
 */
export type PersistenceFeature = 
  | 'progress'
  | 'journal'
  | 'kicks'
  | 'streaks'
  | 'preferences'
  | 'voiceNotes'
  | 'profiles';

/**
 * Feature information for display
 */
interface FeatureInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
}

/**
 * Map of features to their display information
 */
const featureInfoMap: Record<PersistenceFeature, FeatureInfo> = {
  progress: {
    title: 'Save Your Progress',
    description: 'Track your learning journey and pick up where you left off on any device.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  journal: {
    title: 'Pregnancy Journal',
    description: 'Document your journey with daily entries, mood tracking, and voice notes.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  kicks: {
    title: 'Kick Counter',
    description: 'Track your baby\'s movements and see beautiful activity patterns over time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  streaks: {
    title: 'Learning Streaks',
    description: 'Build healthy learning habits and celebrate your consistency.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
  preferences: {
    title: 'Sync Preferences',
    description: 'Keep your theme, font size, and accessibility settings across all devices.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  voiceNotes: {
    title: 'Voice Notes',
    description: 'Record audio memories and reflections to treasure forever.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  profiles: {
    title: 'Baby Profiles',
    description: 'Create separate profiles for each child to track their unique journey.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
};

/**
 * Benefits of registration to highlight
 */
const registrationBenefits = [
  'Sync across all your devices',
  'Never lose your progress',
  'Track multiple pregnancies',
  'Access your data anytime',
];

/**
 * Props for the LoginPrompt component
 */
interface LoginPromptProps {
  /** Whether the prompt is open */
  isOpen: boolean;
  /** Callback when prompt should close */
  onClose: () => void;
  /** Callback to open login modal */
  onLogin: () => void;
  /** Callback to open registration modal */
  onRegister: () => void;
  /** The feature that triggered the prompt */
  feature: PersistenceFeature;
}

/**
 * LoginPrompt component - Shows when guest attempts persistence features
 * 
 * Requirements:
 * - 6.4: WHEN a guest user attempts to use a persistence feature, THE System SHALL display a prompt encouraging registration
 * - 6.5: THE System SHALL clearly indicate which features require login with subtle visual cues
 */
export const LoginPrompt: React.FC<LoginPromptProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  feature,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const featureInfo = featureInfoMap[feature];

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when modal opens
    firstElement?.focus();

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  /**
   * Handle backdrop click to close
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Handle login button click
   */
  const handleLogin = useCallback(() => {
    onClose();
    onLogin();
  }, [onClose, onLogin]);

  /**
   * Handle register button click
   */
  const handleRegister = useCallback(() => {
    onClose();
    onRegister();
  }, [onClose, onRegister]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-pop-in"
        >
          {/* Header with gradient and feature icon */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              {featureInfo.icon}
            </div>
            <h2 id="login-prompt-title" className="text-2xl font-bold mb-2">
              {featureInfo.title}
            </h2>
            <p className="text-purple-100 text-sm">
              {featureInfo.description}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close prompt"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Benefits list - Requirements: 6.4 - Highlight benefits of registration */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Create a free account to:
              </h3>
              <ul className="space-y-2">
                {registrationBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRegister}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-indigo-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
              >
                Create Free Account
              </button>
              
              <button
                onClick={handleLogin}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all"
              >
                I Already Have an Account
              </button>
            </div>

            {/* Continue as guest option */}
            <div className="mt-4 text-center">
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue as guest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
