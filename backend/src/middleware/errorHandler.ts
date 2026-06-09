import { FastifyError } from 'fastify';
import { FastifyReply, FastifyRequest } from 'fastify/types';
import { logger } from './logger.js';

interface ErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  details?: any;
}

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = (error as any).statusCode || error.statusCode || 500;
  
  // Log the error with context
  logger.error(
    {
      err: error,
      requestId: request.id,
      method: request.method,
      url: request.url,
      userId: (request as any).user?.userId,
    },
    error.message
  );

  let response: ErrorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode,
  };

  // Handle validation errors (Zod/Fastify)
  if (error.validation || error.name === 'ZodError') {
    response = {
      error: 'Bad Request',
      message: 'Validation failed',
      statusCode: 400,
      details: (error as any).details || (error as any).errors,
    };
  }

  // Handle JWT errors
  if (error.name === 'Unauthorized' || statusCode === 401) {
    response = {
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
      statusCode: 401,
    };
  }

  // Handle Forbidden errors
  if (statusCode === 403) {
    response = {
      error: 'Forbidden',
      message: error.message || 'You do not have permission to access this resource',
      statusCode: 403,
    };
  }

  // Handle Not Found errors
  if (statusCode === 404) {
    response = {
      error: 'Not Found',
      message: error.message || 'Resource not found',
      statusCode: 404,
    };
  }

  // Handle Conflict errors
  if (statusCode === 409) {
    response = {
      error: 'Conflict',
      message: error.message || 'Resource already exists',
      statusCode: 409,
    };
  }

  // Handle Bad Request errors
  if (statusCode === 400 && !response.details) {
    response = {
      error: 'Bad Request',
      message: error.message || 'Invalid request parameters',
      statusCode: 400,
    };
  }

  reply.code(statusCode).send(response);
}
