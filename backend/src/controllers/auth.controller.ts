import { AuthService as AuthServiceModel } from '../models/user.model.js';
import { TokenService } from './token.service.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { logger } from '../middleware/logger.js';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginResult {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  refreshToken: string;
}

export class AuthService {
  private userModel: AuthServiceModel;
  private tokenService: TokenService;

  constructor() {
    this.userModel = new AuthServiceModel();
    this.tokenService = new TokenService();
  }

  async register(data: RegisterData): Promise<LoginResult> {
    const { email, password, name } = data;

    // Check if user already exists
    const existingUser = await this.userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await this.userModel.create({
      email,
      passwordHash,
      name,
      isEmailVerified: false,
    });

    // Generate tokens
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await this.tokenService.storeRefreshToken(user.id, refreshToken);

    // Send verification email (async, don't wait)
    this.sendVerificationEmail(user.email, user.id).catch((err) => {
      logger.error({ error: err }, 'Failed to send verification email');
    });

    logger.info({ userId: user.id, email }, 'User registered successfully');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    // Find user by email
    const user = await this.userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Check if email is verified (optional, can be configured)
    if (!user.isEmailVerified) {
      logger.warn({ userId: user.id }, 'Login attempt with unverified email');
    }

    // Generate tokens
    const { accessToken, refreshToken } = await this.tokenService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await this.tokenService.storeRefreshToken(user.id, refreshToken);

    // Update last login
    await this.userModel.updateLastLogin(user.id);

    logger.info({ userId: user.id, email }, 'User logged in successfully');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token: accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findByEmail(email);
    
    // Always return success message to prevent email enumeration
    if (!user) {
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await this.userModel.setResetToken(user.id, resetToken, resetTokenExpiry);

    // Send reset email (async)
    this.sendPasswordResetEmail(user.email, resetToken).catch((err) => {
      logger.error({ error: err }, 'Failed to send password reset email');
    });

    logger.info({ userId: user.id }, 'Password reset requested');
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user by reset token
    const user = await this.userModel.findByResetToken(token);
    
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset token
    await this.userModel.updatePassword(user.id, passwordHash);

    // Invalidate all refresh tokens for this user
    await this.tokenService.invalidateAllRefreshTokens(user.id);

    logger.info({ userId: user.id }, 'Password reset successfully');
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
    logger.info({ userId }, 'User logged out');
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.userModel.findByEmailVerificationToken(token);
    
    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    await this.userModel.verifyEmail(user.id);
    logger.info({ userId: user.id }, 'Email verified successfully');
  }

  private async sendVerificationEmail(email: string, userId: string): Promise<void> {
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    await this.userModel.setEmailVerificationToken(userId, verificationToken);

    // In production, send actual email
    // For now, just log it
    logger.info(
      { email, userId, verificationToken },
      'Email verification token generated (would send email in production)'
    );
  }

  private async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    // In production, send actual email
    logger.info(
      { email, resetToken },
      'Password reset token generated (would send email in production)'
    );
  }
}
