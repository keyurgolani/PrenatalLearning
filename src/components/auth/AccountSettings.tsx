import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { accountService, ApiError } from '../../services/accountService';

/**
 * Props for the AccountSettings component
 */
interface AccountSettingsProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
}

/**
 * Active section in the settings
 */
type SettingsSection = 'profile' | 'email' | 'password' | 'delete';

/**
 * Validation errors for form fields
 */
interface ValidationErrors {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  deletePassword?: string;
}

/**
 * Validate email format
 */
function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validate password requirements
 */
function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return undefined;
}

/**
 * AccountSettings component for managing user account
 * 
 * Requirements:
 * - 5.1: Allow users to update their display name
 * - 5.2: Allow users to update their email address with re-verification
 * - 5.3: Allow users to change their password after confirming current password
 * - 5.4: Prompt for confirmation when user requests account deletion
 */
export const AccountSettings: React.FC<AccountSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout, isLoading: authLoading } = useAuth();
  
  // Active section state
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  
  // Form states
  const [name, setName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  // Refs
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize form with user data
  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setNewEmail(user.email || '');
    }
  }, [isOpen, user]);



  // Clear states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setActiveSection('profile');
      setEmailPassword('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDeletePassword('');
      setDeleteConfirmText('');
      setError(null);
      setSuccess(null);
      setValidationErrors({});
      setShowDeleteConfirm(false);
      setShowPasswords({});
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  /**
   * Toggle password visibility
   */
  const togglePasswordVisibility = useCallback((field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  }, []);

  /**
   * Handle name update
   * Requirements: 5.1 - Allow users to update their display name
   */
  const handleUpdateName = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    if (!name.trim()) {
      setValidationErrors({ name: 'Name is required' });
      return;
    }
    if (name.trim().length > 100) {
      setValidationErrors({ name: 'Name must be 100 characters or less' });
      return;
    }

    setIsLoading(true);
    try {
      await accountService.updateAccount(name.trim());
      setSuccess('Name updated successfully');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update name. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [name]);

  /**
   * Handle email update
   * Requirements: 5.2 - Allow users to update their email address with re-verification
   */
  const handleUpdateEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    const emailError = validateEmail(newEmail);
    if (emailError) {
      setValidationErrors({ email: emailError });
      return;
    }
    if (!emailPassword) {
      setValidationErrors({ currentPassword: 'Password is required to change email' });
      return;
    }

    setIsLoading(true);
    try {
      await accountService.updateEmail(newEmail.trim(), emailPassword);
      setSuccess('Email updated successfully. Please check your inbox for verification.');
      setEmailPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [newEmail, emailPassword]);

  /**
   * Handle password change
   * Requirements: 5.3 - Allow users to change their password after confirming current password
   */
  const handleChangePassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    const errors: ValidationErrors = {};
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    const newPasswordError = validatePassword(newPassword);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await accountService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  /**
   * Handle account deletion
   * Requirements: 5.4 - Prompt for confirmation when user requests account deletion
   */
  const handleDeleteAccount = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!deletePassword) {
      setValidationErrors({ deletePassword: 'Password is required to delete account' });
      return;
    }
    if (deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setIsLoading(true);
    try {
      await accountService.deleteAccount(deletePassword);
      // Log out after successful deletion request
      await logout();
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to delete account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [deletePassword, deleteConfirmText, logout, onClose]);

  /**
   * Handle backdrop click
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  /**
   * Render password input with toggle
   */
  const renderPasswordInput = (
    id: string,
    value: string,
    onChange: (value: string) => void,
    placeholder: string,
    error?: string,
    autoComplete?: string
  ) => (
    <div className="relative">
      <input
        id={id}
        type={showPasswords[id] ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none pr-12 ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-300'
        }`}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={isLoading}
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(id)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label={showPasswords[id] ? 'Hide password' : 'Show password'}
      >
        {showPasswords[id] ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
    </div>
  );

  // Don't render if modal is closed
  if (!isOpen) return null;

  // Show loading state if auth is still loading
  // Requirements: 5.8 - Display account settings content properly without blank pages
  if (authLoading || !user) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-settings-title"
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
        {/* Loading State */}
        <div 
          className="relative min-h-screen flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <svg className="animate-spin h-8 w-8 text-purple-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Loading account settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="account-settings-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className="relative min-h-screen flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-pop-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-6 text-white">
            <h2 id="account-settings-title" className="text-2xl font-bold">
              Account Settings
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              Manage your account details and preferences
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close account settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex">
            {/* Sidebar Navigation */}
            <nav className="w-48 bg-gray-50 border-r border-gray-200 p-4 space-y-1">
              <button
                onClick={() => { setActiveSection('profile'); setError(null); setSuccess(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'profile'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => { setActiveSection('email'); setError(null); setSuccess(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'email'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => { setActiveSection('password'); setError(null); setSuccess(null); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'password'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => { setActiveSection('delete'); setError(null); setSuccess(null); setShowDeleteConfirm(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === 'delete'
                    ? 'bg-red-100 text-red-700'
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                Delete Account
              </button>
            </nav>

            {/* Content Area */}
            <div className="flex-1 p-6 min-h-[400px]">
              {/* Success Message */}
              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Profile Section - Requirements: 5.1 */}
              {activeSection === 'profile' && (
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Profile</h3>
                  <div>
                    <label htmlFor="settings-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Display Name
                    </label>
                    <input
                      id="settings-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
                        validationErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Your name"
                      disabled={isLoading}
                    />
                    {validationErrors.name && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              )}

              {/* Email Section - Requirements: 5.2 */}
              {activeSection === 'email' && (
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Email</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Changing your email will require re-verification.
                  </p>
                  <div>
                    <label htmlFor="settings-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Email Address
                    </label>
                    <input
                      id="settings-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
                        validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="new@example.com"
                      disabled={isLoading}
                    />
                    {validationErrors.email && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    {renderPasswordInput(
                      'email-password',
                      emailPassword,
                      setEmailPassword,
                      'Enter your password',
                      validationErrors.currentPassword,
                      'current-password'
                    )}
                    {validationErrors.currentPassword && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.currentPassword}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Email'}
                  </button>
                </form>
              )}

              {/* Password Section - Requirements: 5.3 */}
              {activeSection === 'password' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    {renderPasswordInput(
                      'current-password',
                      currentPassword,
                      setCurrentPassword,
                      'Enter current password',
                      validationErrors.currentPassword,
                      'current-password'
                    )}
                    {validationErrors.currentPassword && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.currentPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    {renderPasswordInput(
                      'new-password',
                      newPassword,
                      setNewPassword,
                      'Enter new password',
                      validationErrors.newPassword,
                      'new-password'
                    )}
                    <p className="mt-1.5 text-xs text-gray-500">
                      At least 8 characters with a letter and number
                    </p>
                    {validationErrors.newPassword && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.newPassword}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    {renderPasswordInput(
                      'confirm-new-password',
                      confirmPassword,
                      setConfirmPassword,
                      'Confirm new password',
                      validationErrors.confirmPassword,
                      'new-password'
                    )}
                    {validationErrors.confirmPassword && (
                      <p className="mt-1.5 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              )}

              {/* Delete Account Section - Requirements: 5.4 */}
              {activeSection === 'delete' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-600 mb-4">Delete Account</h3>
                  
                  {!showDeleteConfirm ? (
                    <>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-800 mb-2">Warning</h4>
                        <p className="text-sm text-red-700">
                          Deleting your account will permanently remove all your data, including:
                        </p>
                        <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
                          <li>All baby profiles and their data</li>
                          <li>Journal entries and voice notes</li>
                          <li>Kick tracking history</li>
                          <li>Learning progress and streaks</li>
                          <li>All preferences and settings</li>
                        </ul>
                        <p className="mt-3 text-sm text-red-700">
                          You will have a 30-day grace period to recover your account before permanent deletion.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                      >
                        I understand, delete my account
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handleDeleteAccount} className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-700 font-medium">
                          This action cannot be undone after the 30-day grace period.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Enter your password
                        </label>
                        {renderPasswordInput(
                          'delete-password',
                          deletePassword,
                          setDeletePassword,
                          'Your password',
                          validationErrors.deletePassword,
                          'current-password'
                        )}
                        {validationErrors.deletePassword && (
                          <p className="mt-1.5 text-sm text-red-600">{validationErrors.deletePassword}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="delete-confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Type DELETE to confirm
                        </label>
                        <input
                          id="delete-confirm"
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                          placeholder="DELETE"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeletePassword('');
                            setDeleteConfirmText('');
                            setError(null);
                          }}
                          className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading || deleteConfirmText !== 'DELETE'}
                          className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'Deleting...' : 'Delete Account'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;