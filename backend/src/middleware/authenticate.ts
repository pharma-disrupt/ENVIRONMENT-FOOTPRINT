import { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from './logger.js';

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify();
    
    if (!request.user) {
      throw new Error('No user found in token');
    }
    
    logger.debug({ userId: request.user.userId }, 'User authenticated');
  } catch (error) {
    logger.warn(
      { error, url: request.url, method: request.method },
      'Authentication failed'
    );
    reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid or expired authentication token',
    });
    throw error;
  }
}

export function optionalAuthenticate(
  request: FastifyRequest,
  reply: FastifyReply,
  done: () => void
) {
  // Don't fail if no token present, just continue without user context
  request.jwtVerify().catch(() => {
    // Silently fail - user will be treated as unauthenticated
  });
  done();
}
