/**
 * Account management service for API communication
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */

import type { User } from '../types/auth';
import { apiClient, ApiError } from './apiClient';

/**
 * Response type for account update operations
 */
export interface AccountUpdateResponse {
  message: string;
  user: User;
}

/**
 * Response type for password change
 */
export interface PasswordChangeResponse {
  message: string;
}

/**
 * Response type for account deletion request
 */
export interface AccountDeletionResponse {
  message: string;
  deletionRequestedAt: string;
  permanentDeletionAt: string;
}

/**
 * Response type for account recovery
 */
export interface AccountRecoveryResponse {
  message: string;
  user: User;
}

/**
 * Update account details (name)
 * Requirements: 5.1 - Allow users to update their display name
 */
export async function updateAccount(name: string): Promise<AccountUpdateResponse> {
  return apiClient.put<AccountUpdateResponse>('/account', { name });
}

/**
 * Update email address (requires password confirmation)
 * Requirements: 5.2 - Allow users to update their email address with re-verification
 */
export async function updateEmail(
  newEmail: string,
  password: string
): Promise<AccountUpdateResponse> {
  return apiClient.put<AccountUpdateResponse>('/account/email', {
    newEmail,
    password,
  });
}

/**
 * Change password (requires current password)
 * Requirements: 5.3 - Allow users to change their password after confirming current password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<PasswordChangeResponse> {
  return apiClient.put<PasswordChangeResponse>('/account/password', {
    currentPassword,
    newPassword,
  });
}

/**
 * Request account deletion with 30-day grace period
 * Requirements: 5.5 - Permanently delete user account and all associated data
 */
export async function deleteAccount(
  password: string
): Promise<AccountDeletionResponse> {
  return apiClient.request<AccountDeletionResponse>('/account', {
    method: 'DELETE',
    body: { password },
  });
}

/**
 * Recover account within grace period
 * Requirements: 5.5 - Account can be recovered within grace period
 */
export async function recoverAccount(
  email: string,
  password: string
): Promise<AccountRecoveryResponse> {
  return apiClient.post<AccountRecoveryResponse>('/account/recover', {
    email,
    password,
  });
}

export const accountService = {
  updateAccount,
  updateEmail,
  changePassword,
  deleteAccount,
  recoverAccount,
};

export { ApiError };

export default accountService;
