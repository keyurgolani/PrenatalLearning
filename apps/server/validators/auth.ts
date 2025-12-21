import { z } from 'zod';
import { emailSchema, passwordSchema, userNameSchema } from '../models/index.js';

// Registration validation schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: userNameSchema,
});

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});

// Forgot password validation schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password validation schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: passwordSchema,
});

// Change password validation schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// Update email validation schema
export const updateEmailSchema = z.object({
  newEmail: emailSchema,
  password: z.string().min(1, 'Password is required for email change'),
});

// Delete account validation schema
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required to delete account'),
});

// Recover account validation schema
export const recoverAccountSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required to recover account'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateEmailInput = z.infer<typeof updateEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type RecoverAccountInput = z.infer<typeof recoverAccountSchema>;
