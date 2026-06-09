import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema, ZodError } from 'zod';
import { logger } from './logger.js';

export function validateBody(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.body = schema.parse(request.body);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(
          { errors: error.errors, body: request.body },
          'Request body validation failed'
        );
        
        reply.code(400).send({
          error: 'Bad Request',
          message: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        throw error;
      }
      throw error;
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.query = schema.parse(request.query);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(
          { errors: error.errors, query: request.query },
          'Request query validation failed'
        );
        
        reply.code(400).send({
          error: 'Bad Request',
          message: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        throw error;
      }
      throw error;
    }
  };
}

export function validateParams(schema: ZodSchema) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      request.params = schema.parse(request.params);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn(
          { errors: error.errors, params: request.params },
          'Request params validation failed'
        );
        
        reply.code(400).send({
          error: 'Bad Request',
          message: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        throw error;
      }
      throw error;
    }
  };
}
