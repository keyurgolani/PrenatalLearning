import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

/**
 * Props for the LoginModal component
 */
interface LoginModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback to switch to registration modal */
  onSwitchToRegister?: () => void;
  /** Callback to switch to forgot password modal */
  onForgotPassword?: () => void;
}

/**
 * LoginModal component for user authentication
 * 
 * Requirements:
 * - 15.3: Provide a modal for login and registration forms
 * - 15.5: Provide a "Remember me" option to extend session duration
 * - 3.4: Show generic error messages without revealing which field is incorrect
 */
export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onForgotPassword,
}) => {
  const { login, isLoading, error, clearError } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Refs for focus management
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Focus email input when modal opens
  useEffect(() => {
    if (isOpen && emailInputRef.current) {
      // Small delay to ensure modal is rendered and Modal's initial focus trap is handled
      const timer = setTimeout(() => {
        emailInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clear errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      clearError();
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, clearError]);

  // Handle keys/backdrop (Now handled by simple props in Modal)

  /**
   * Handle form submission
   * Requirements: 3.4 - Show generic error messages
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Basic validation
    if (!email.trim()) {
      setLocalError('Please enter your email address');
      return;
    }
    if (!password) {
      setLocalError('Please enter your password');
      return;
    }

    try {
      await login(email.trim(), password, rememberMe);
      
      // Login successful - close modal immediately
      setEmail('');
      setPassword('');
      setRememberMe(false);
      onClose();
    } catch {
      // Error is handled by AuthContext and displayed via error prop
    }
  }, [email, password, rememberMe, login, onClose]);

  if (!isOpen) return null;

  // Display error - prefer context error over local error
  // Requirements: 3.4 - Generic error messages
  const displayError = error || localError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome Back"
      testId="login-modal"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-8 text-white text-center">
        <h2 id="login-modal-title" className="text-2xl font-bold mb-2">
          Welcome Back
        </h2>
        <p className="text-purple-100 text-sm">
          Sign in to access your saved progress and preferences
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5" data-testid="login-form">
        {/* Error Message - Requirements: 3.4 */}
        {displayError && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
            role="alert"
            aria-live="polite"
            data-testid="login-error"
          >
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{displayError}</span>
          </div>
        )}

        {/* Email Field */}
        <Input
          ref={emailInputRef}
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          error={displayError && !email ? 'Field is required' : undefined}
          data-testid="login-email-input"
        />

        {/* Password Field */}
        <div>
          <Input
            id="login-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled={isLoading}
            error={displayError && !password ? 'Field is required' : undefined}
            data-testid="login-password-input"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
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
            }
          />
        </div>

        {/* Remember Me & Forgot Password Row - Requirements: 15.5 */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              disabled={isLoading}
              data-testid="remember-me-checkbox"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </label>
          
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
              disabled={isLoading}
              data-testid="forgot-password"
            >
              Forgot password?
            </button>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          fullWidth
          isLoading={isLoading}
          data-testid="login-submit-button"
        >
          Sign In
        </Button>
      </form>

      {/* Footer - Link to Registration */}
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          {onSwitchToRegister ? (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              disabled={isLoading}
              data-testid="switch-to-register"
            >
              Create one
            </button>
          ) : (
            <span className="text-purple-600 font-medium">Create one</span>
          )}
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
