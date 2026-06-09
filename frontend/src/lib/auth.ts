import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Check if a JWT token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.userId;
  } catch {
    return null;
  }
}

/**
 * Get expiration time from JWT token
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return new Date(decoded.exp * 1000);
  } catch {
    return null;
  }
}

/**
 * Check if token is about to expire (within 5 minutes)
 */
export function isTokenExpiringSoon(token: string, thresholdMinutes = 5): boolean {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const now = Date.now() / 1000;
    const threshold = thresholdMinutes * 60;
    return decoded.exp - now < threshold;
  } catch {
    return true;
  }
}
