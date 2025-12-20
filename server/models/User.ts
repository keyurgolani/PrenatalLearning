import { ObjectId, Collection } from 'mongodb';
import { z } from 'zod';
import { getDatabase } from '../db/index.js';
import { COLLECTIONS } from '../db/init.js';

// Password reset token interface
export interface PasswordResetToken {
  token: string;
  expiresAt: Date;
}

// User interface
export interface User {
  _id: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  dueDate?: Date;
  deletionRequestedAt?: Date;
  passwordResetToken?: PasswordResetToken;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
}

// User document type for insertion (without _id)
export type UserDocument = Omit<User, '_id'>;

// Zod validation schemas
export const emailSchema = z.string().email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const userNameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less');

export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: userNameSchema,
});

export const updateUserSchema = z.object({
  name: userNameSchema.optional(),
  dueDate: z.string().datetime().optional().nullable(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Get users collection
export function getUsersCollection(): Collection<User> {
  return getDatabase().collection<User>(COLLECTIONS.USERS);
}
