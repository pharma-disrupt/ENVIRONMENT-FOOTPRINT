import jwt from 'jsonwebtoken';
import { redisClient } from '../config/redis.js';
import { env } from '../config/env.js';
import { logger } from '../middleware/logger.js';

interface JwtPayload {
  userId: string;
  email: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class TokenService {
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;
  private readonly refreshKeyPrefix = 'refresh_token:';
  private readonly blacklistPrefix = 'token_blacklist:';

  constructor() {
    this.accessTokenExpiry = env.JWT_EXPIRES_IN;
    this.refreshTokenExpiry = '30d';
  }

  async generateTokens(payload: JwtPayload): Promise<TokenPair> {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: this.accessTokenExpiry,
      issuer: env.JWT_ISSUER,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: this.refreshTokenExpiry,
      issuer: env.JWT_ISSUER,
    });
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = `${this.refreshKeyPrefix}${userId}`;
    
    // Get existing tokens
    const existing = await redisClient.get<string[]>(key);
    const tokens = existing || [];

    // Add new token and keep last 5
    tokens.push(refreshToken);
    const latestTokens = tokens.slice(-5);

    await redisClient.set(key, latestTokens, 30 * 24 * 60 * 60); // 30 days
    logger.debug({ userId }, 'Refresh token stored');
  }

  async validateRefreshToken(refreshToken: string): Promise<JwtPayload | null> {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await redisClient.exists(
        `${this.blacklistPrefix}${refreshToken}`
      );
      
      if (isBlacklisted) {
        logger.warn({ token: refreshToken.substring(0, 10) }, 'Token is blacklisted');
        return null;
      }

      const decoded = jwt.verify(refreshToken, env.JWT_SECRET, {
        issuer: env.JWT_ISSUER,
      }) as JwtPayload;

      // Verify token exists in user's token list
      const key = `${this.refreshKeyPrefix}${decoded.userId}`;
      const tokens = await redisClient.get<string[]>(key);

      if (!tokens || !tokens.includes(refreshToken)) {
        logger.warn({ userId: decoded.userId }, 'Refresh token not found in user tokens');
        return null;
      }

      return decoded;
    } catch (error) {
      logger.warn({ error }, 'Invalid refresh token');
      return null;
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.validateRefreshToken(refreshToken);

    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    // Generate new token pair
    const newTokens = await this.generateTokens(payload);

    // Store new refresh token
    await this.storeRefreshToken(payload.userId, newTokens.refreshToken);

    logger.debug({ userId: payload.userId }, 'Access token refreshed');

    return newTokens;
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET, {
        issuer: env.JWT_ISSUER,
      }) as JwtPayload;

      // Remove from user's token list
      const key = `${this.refreshKeyPrefix}${decoded.userId}`;
      const tokens = await redisClient.get<string[]>(key);

      if (tokens) {
        const filtered = tokens.filter((t) => t !== refreshToken);
        await redisClient.set(key, filtered, 30 * 24 * 60 * 60);
      }

      // Blacklist the token
      await redisClient.set(
        `${this.blacklistPrefix}${refreshToken}`,
        'revoked',
        24 * 60 * 60 // 24 hours
      );

      logger.debug({ userId: decoded.userId }, 'Refresh token revoked');
    } catch (error) {
      logger.warn({ error }, 'Error revoking refresh token');
    }
  }

  async invalidateAllRefreshTokens(userId: string): Promise<void> {
    const key = `${this.refreshKeyPrefix}${userId}`;
    const tokens = await redisClient.get<string[]>(key);

    if (tokens) {
      // Blacklist all tokens
      for (const token of tokens) {
        await redisClient.set(
          `${this.blacklistPrefix}${token}`,
          'revoked',
          24 * 60 * 60
        );
      }

      // Clear user's token list
      await redisClient.del(key);
    }

    logger.info({ userId }, 'All refresh tokens invalidated');
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: env.JWT_ISSUER,
      }) as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }
}
