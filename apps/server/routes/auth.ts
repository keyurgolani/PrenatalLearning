import { Router, type Request, type Response, type NextFunction } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { authRateLimiter } from '../middleware/index.js';
import { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema,
  resetPasswordSchema,
  type RegisterInput, 
  type LoginInput,
  type ForgotPasswordInput,
  type ResetPasswordInput 
} from '../validators/auth.js';
import { getUsersCollection, type UserDocument } from '../models/User.js';
import { getUserPreferencesCollection, DEFAULT_PREFERENCES, type UserPreferencesDocument } from '../models/UserPreferences.js';
import { requireAuthWithUser } from '../middleware/auth.js';

// Password reset token expiration time (1 hour)
const RESET_TOKEN_EXPIRATION_MS = 60 * 60 * 1000;

// Generate a secure random token for password reset
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash the reset token for secure storage
function hashResetToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const router = Router();

// Apply stricter rate limiting to auth routes
router.use(authRateLimiter);

// Helper function to generate JWT token
function generateToken(userId: string, rememberMe = false): string {
  const expiresIn = rememberMe ? config.jwt.rememberMeExpiresIn : config.jwt.expiresIn;
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn } as SignOptions);
}

// Helper function to set JWT cookie
function setTokenCookie(res: Response, token: string, rememberMe = false): void {
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 30 or 7 days in ms
  res.cookie('token', token, {
    httpOnly: true,
    secure: config.server.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge,
  });
}

// POST /api/auth/register - Create new user account
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { email, password, name }: RegisterInput = validationResult.data;

    // Check if email already exists
    const usersCollection = getUsersCollection();
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        error: 'Email already registered',
      });
    }

    // Hash password with bcrypt (10 rounds)
    const passwordHash = await bcrypt.hash(password, 10);

    const now = new Date();

    // Create user document
    const userDoc: UserDocument = {
      email: email.toLowerCase(),
      passwordHash,
      name,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };

    // Insert user
    const userResult = await usersCollection.insertOne(userDoc as never);
    const userId = userResult.insertedId;

    // Create default user preferences
    const preferencesCollection = getUserPreferencesCollection();
    const preferencesDoc: UserPreferencesDocument = {
      userId,
      ...DEFAULT_PREFERENCES,
      updatedAt: now,
    };

    await preferencesCollection.insertOne(preferencesDoc as never);

    // Generate JWT token
    const token = generateToken(userId.toString());

    // Set HTTP-only cookie
    setTokenCookie(res, token);

    // Return success response
    return res.status(201).json({
      message: 'Registration successful. Welcome to Prenatal Learning Hub!',
      user: {
        id: userId.toString(),
        email: email.toLowerCase(),
        name,
      },
      token, // Also return token in body for clients that can't use cookies
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout - Invalidate session and clear JWT cookie
router.post('/logout', (_req: Request, res: Response) => {
  // Clear the JWT token cookie by setting it to empty with immediate expiration
  res.cookie('token', '', {
    httpOnly: true,
    secure: config.server.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    expires: new Date(0), // Set to epoch for older browsers
  });

  return res.status(200).json({
    message: 'Logout successful',
  });
});

// POST /api/auth/login - Authenticate user
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { email, password, rememberMe }: LoginInput = validationResult.data;

    // Find user by email
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    // Use generic error message for security (don't reveal if email exists)
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Check if account is pending deletion
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      
      if (new Date() < gracePeriodEnd) {
        // Account is in grace period, allow login but notify user
        // We'll continue with login but include a warning
      } else {
        // Account should have been deleted, treat as non-existent
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }
    }

    // Verify password against stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Update last login timestamp
    const now = new Date();
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { lastLoginAt: now } }
    );

    // Generate JWT token with configurable expiration
    const token = generateToken(user._id.toString(), rememberMe);

    // Set HTTP-only cookie
    setTokenCookie(res, token, rememberMe);

    // Build response
    const response: Record<string, unknown> = {
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        dueDate: user.dueDate?.toISOString() || null,
      },
      token, // Also return token in body for clients that can't use cookies
    };

    // Warn if account is pending deletion
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      response.warning = {
        type: 'deletion_pending',
        message: 'Your account is scheduled for deletion',
        deletionDate: gracePeriodEnd.toISOString(),
      };
    }

    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot - Request password reset
router.post('/forgot', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = forgotPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { email }: ForgotPasswordInput = validationResult.data;

    // Find user by email
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    // Always return success message for security (don't reveal if email exists)
    // This prevents email enumeration attacks
    const successMessage = 'If an account with that email exists, a password reset link has been sent.';

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.status(200).json({
        message: successMessage,
      });
    }

    // Check if account is pending deletion
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      
      if (new Date() >= gracePeriodEnd) {
        // Account should have been deleted, treat as non-existent
        return res.status(200).json({
          message: successMessage,
        });
      }
    }

    // Generate secure reset token
    const resetToken = generateResetToken();
    const hashedToken = hashResetToken(resetToken);
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MS);

    // Store hashed token in database
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: {
            token: hashedToken,
            expiresAt,
          },
          updatedAt: new Date(),
        },
      }
    );

    // In production, this would send an email with the reset link
    // For now, we log it (in development) and return success
    const resetUrl = `${config.cors.origin}/reset-password?token=${resetToken}`;
    
    if (config.server.nodeEnv !== 'production') {
      console.log('=== PASSWORD RESET EMAIL ===');
      console.log(`To: ${user.email}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log(`Token expires at: ${expiresAt.toISOString()}`);
      console.log('============================');
    }

    // TODO: Integrate with email service (e.g., SendGrid, AWS SES, Nodemailer)
    // await sendPasswordResetEmail(user.email, resetUrl);

    return res.status(200).json({
      message: successMessage,
      // Only include debug info in development
      ...(config.server.nodeEnv !== 'production' && {
        debug: {
          resetToken,
          resetUrl,
          expiresAt: expiresAt.toISOString(),
        },
      }),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/reset - Reset password with token
router.post('/reset', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = resetPasswordSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    const { token, newPassword }: ResetPasswordInput = validationResult.data;

    // Hash the provided token to compare with stored hash
    const hashedToken = hashResetToken(token);

    // Find user with matching reset token
    const usersCollection = getUsersCollection();
    const user = await usersCollection.findOne({
      'passwordResetToken.token': hashedToken,
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    // Check if token has expired
    if (!user.passwordResetToken || new Date() > user.passwordResetToken.expiresAt) {
      // Clear the expired token
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $unset: { passwordResetToken: '' },
          $set: { updatedAt: new Date() },
        }
      );

      return res.status(400).json({
        error: 'Invalid or expired reset token',
      });
    }

    // Check if account is pending deletion
    if (user.deletionRequestedAt) {
      const gracePeriodEnd = new Date(user.deletionRequestedAt);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
      
      if (new Date() >= gracePeriodEnd) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
        });
      }
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          updatedAt: new Date(),
        },
        $unset: { passwordResetToken: '' },
      }
    );

    // Log password reset for security monitoring
    console.log(`Password reset completed for user: ${user.email}`);

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Get current authenticated user
router.get('/me', requireAuthWithUser, async (req: Request, res: Response) => {
  const user = req.user!;

  return res.status(200).json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      dueDate: user.dueDate?.toISOString() || null,
    },
  });
});

export default router;
