import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

/**
 * Props for the RegisterModal component
 */
interface RegisterModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback to switch to login modal */
  onSwitchToLogin?: () => void;
}

/**
 * Password strength levels
 * Requirements: 15.4 - Show password strength indicator during registration
 */
type PasswordStrength = 'weak' | 'medium' | 'strong';

interface PasswordStrengthResult {
  strength: PasswordStrength;
  label: string;
  color: string;
  bgColor: string;
  percentage: number;
}

/**
 * Calculate password strength based on requirements
 * Requirements: 15.4 - Password strength indicator
 * - "weak" for <8 chars or missing letter/number
 * - "medium" for meeting minimum requirements (8+ chars, has letter and number)
 * - "strong" for 12+ chars with mixed case and special characters
 */
function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      strength: 'weak',
      label: '',
      color: 'text-gray-400',
      bgColor: 'bg-gray-200',
      percentage: 0,
    };
  }

  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const hasLongLength = password.length >= 12;

  // Weak: doesn't meet minimum requirements
  if (!hasMinLength || !hasLetter || !hasNumber) {
    return {
      strength: 'weak',
      label: 'Weak',
      color: 'text-red-600',
      bgColor: 'bg-red-500',
      percentage: 33,
    };
  }

  // Strong: 12+ chars with mixed case and special characters
  if (hasLongLength && hasUpperCase && hasLowerCase && hasSpecialChar) {
    return {
      strength: 'strong',
      label: 'Strong',
      color: 'text-green-600',
      bgColor: 'bg-green-500',
      percentage: 100,
    };
  }

  // Medium: meets minimum requirements
  return {
    strength: 'medium',
    label: 'Medium',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    percentage: 66,
  };
}

/**
 * Validation errors for form fields
 */
interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Validate email format
 * Requirements: 2.2 - Validate that the email address is in a valid format
 */
function validateEmail(email: string): string | undefined {
  if (!email.trim()) {
    return 'Email is required';
  }
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return undefined;
}

/**
 * Validate password requirements
 * Requirements: 2.3 - Require passwords to be at least 8 characters with at least one number and one letter
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
 * Validate name
 */
function validateName(name: string): string | undefined {
  if (!name.trim()) {
    return 'Name is required';
  }
  if (name.trim().length > 100) {
    return 'Name must be 100 characters or less';
  }
  return undefined;
}

/**
 * RegisterModal component for user registration
 * 
 * Requirements:
 * - 15.3: Provide a modal for login and registration forms
 * - 15.4: Show password strength indicator during registration
 * - 2.2: Validate email format
 * - 2.3: Validate password requirements (8+ chars, letter, number)
 */
export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { register, isLoading, error, clearError } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // Refs for focus management
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Calculate password strength
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Focus name input when modal opens
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clear errors and form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      clearError();
      const timer = setTimeout(() => {
        setValidationErrors({});
        setTouched({});
      }, 0);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false);
        setShowConfirmPassword(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, clearError]);

  // Debounced validation
  useEffect(() => {
    const timer = setTimeout(() => {
      const errors: ValidationErrors = {};
      
      if (touched.name) errors.name = validateName(name);
      if (touched.email) errors.email = validateEmail(email);
      if (touched.password) errors.password = validatePassword(password);
      if (touched.confirmPassword) {
        errors.confirmPassword = confirmPassword && confirmPassword !== password 
          ? 'Passwords do not match' 
          : undefined;
      }

      setValidationErrors(prev => ({
        ...prev,
        ...errors
      }));
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [name, email, password, confirmPassword, touched]);

  /**
   * Handle field change and mark as touched
   */
  const handleChange = (field: keyof ValidationErrors, value: string) => {
    switch (field) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
  };

  /**
   * Handle field blur
   */
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  /**
   * Validate all fields immediately (for submit)
   */
  const validateAll = useCallback((): boolean => {
    const errors: ValidationErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: confirmPassword !== password ? 'Passwords do not match' : undefined,
    };
    
    setValidationErrors(errors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    
    return !Object.values(errors).some(Boolean);
  }, [name, email, password, confirmPassword]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    try {
      await register(email.trim(), password, name.trim());
      onClose();
    } catch {
      // Error is handled by AuthContext
    }
  }, [validateAll, register, email, password, name, onClose]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Account"
      testId="register-modal"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-8 text-white text-center">
        <h2 id="register-modal-title" className="text-2xl font-bold mb-2">
          Create Account
        </h2>
        <p className="text-purple-100 text-sm">
          Join us to save your progress and track your journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4" data-testid="register-form">
        {/* Server Error Message */}
        {error && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2"
            role="alert"
            aria-live="polite"
            data-testid="register-error"
          >
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Name Field */}
        <Input
          ref={nameInputRef}
          id="register-name"
          label="Your Name"
          type="text"
          value={name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          placeholder="Enter your name"
          autoComplete="name"
          disabled={isLoading}
          error={touched.name ? validationErrors.name : undefined}
          data-testid="register-name-input"
        />

        {/* Email Field */}
        <Input
          id="register-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isLoading}
          error={touched.email ? validationErrors.email : undefined}
          data-testid="register-email-input"
        />

        {/* Password Field */}
        <div>
          <Input
            id="register-password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={() => handleBlur('password')}
            placeholder="Create a password"
            autoComplete="new-password"
            disabled={isLoading}
            error={touched.password ? validationErrors.password : undefined}
            data-testid="register-password-input"
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
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2" data-testid="password-strength">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passwordStrength.bgColor}`}
                    style={{ width: `${passwordStrength.percentage}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.label}
                </span>
              </div>
            </div>
          )}
          
          <p id="password-requirements" className="mt-1.5 text-xs text-gray-500">
            At least 8 characters with a letter and number
          </p>
        </div>

        {/* Confirm Password Field */}
        <Input
          id="register-confirm-password"
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          placeholder="Confirm your password"
          autoComplete="new-password"
          disabled={isLoading}
          error={touched.confirmPassword ? validationErrors.confirmPassword : undefined}
          data-testid="register-confirm-password-input"
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          fullWidth
          isLoading={isLoading}
          className="mt-6"
          data-testid="register-submit-button"
        >
          Create Account
        </Button>

        {/* Terms notice */}
        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>

      {/* Footer - Link to Login */}
      <div className="px-6 pb-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          {onSwitchToLogin ? (
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              disabled={isLoading}
              data-testid="switch-to-login"
            >
              Sign in
            </button>
          ) : (
            <span className="text-purple-600 font-medium">Sign in</span>
          )}
        </p>
      </div>
    </Modal>
  );
};
