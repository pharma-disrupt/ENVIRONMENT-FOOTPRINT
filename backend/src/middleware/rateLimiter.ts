import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { logger } from './logger.js';

export async function rateLimiter(
  app: FastifyInstance,
  maxRequests: number = 100,
  timeWindow: string = '1 minute'
) {
  await app.register(rateLimit, {
    max: maxRequests,
    timeWindow: timeWindow,
    keyGenerator: (request) => {
      return (request.headers['x-forwarded-for'] as string) || request.ip;
    },
    allowList: ['127.0.0.1', '::1'], // Whitelist localhost
    errorResponseBuilder: (
      request: FastifyRequest,
      context: { after: string; max: number }
    ) => {
      logger.warn(
        {
          ip: request.ip,
          url: request.url,
          method: request.method,
          max: context.max,
          after: context.after,
        },
        'Rate limit exceeded'
      );

      return {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Maximum ${context.max} requests per ${context.after}.`,
        statusCode: 429,
      };
    },
  });
}

export const apiRateLimiter = rateLimiter;
export const authRateLimiter = (app: FastifyInstance) =>
  rateLimiter(app, 5, '1 minute'); // Stricter for auth endpoints
export const searchRateLimiter = (app: FastifyInstance) =>
  rateLimiter(app, 30, '1 minute'); // Moderate for search
