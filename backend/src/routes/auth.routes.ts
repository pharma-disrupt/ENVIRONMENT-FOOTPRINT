import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { TokenService } from '../services/token.service.js';
import { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema.js';
import { validateBody } from '../middleware/validate.js';

const authService = new AuthService();
const tokenService = new TokenService();

export async function authRoutes(app: FastifyInstance) {
  // Register new user
  app.post(
    '/register',
    {
      preHandler: [validateBody(registerSchema)],
      schema: {
        description: 'Register a new user account',
        tags: ['Authentication'],
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
          },
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: { type: 'object' },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const { email, password, name } = request.body;

      const result = await authService.register({ email, password, name });

      return reply.code(201).send(result);
    }
  );

  // Login
  app.post(
    '/login',
    {
      preHandler: [validateBody(loginSchema)],
      schema: {
        description: 'Login with email and password',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const { email, password } = request.body;

      const result = await authService.login(email, password);

      return reply.send(result);
    }
  );

  // Refresh token
  app.post(
    '/refresh',
    {
      preHandler: [validateBody(refreshTokenSchema)],
      schema: {
        description: 'Refresh access token',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const { refreshToken } = request.body;

      const result = await tokenService.refreshAccessToken(refreshToken);

      return reply.send(result);
    }
  );

  // Forgot password
  app.post(
    '/forgot-password',
    {
      preHandler: [validateBody(forgotPasswordSchema)],
      schema: {
        description: 'Request password reset email',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const { email } = request.body;

      await authService.forgotPassword(email);

      return reply.send({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    }
  );

  // Reset password
  app.post(
    '/reset-password',
    {
      preHandler: [validateBody(resetPasswordSchema)],
      schema: {
        description: 'Reset password with token',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const { token, newPassword } = request.body;

      await authService.resetPassword(token, newPassword);

      return reply.send({ message: 'Password has been reset successfully.' });
    }
  );

  // Logout (invalidate refresh token)
  app.post(
    '/logout',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Logout and invalidate tokens',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const refreshToken = (request.headers.authorization?.split(' ')[1]) as string;

      await authService.logout(userId, refreshToken);

      return reply.send({ message: 'Logged out successfully.' });
    }
  );

  // Verify email
  app.get(
    '/verify-email/:token',
    {
      schema: {
        description: 'Verify email address',
        tags: ['Authentication'],
      },
    },
    async (request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) => {
      const { token } = request.params;

      await authService.verifyEmail(token);

      return reply.send({ message: 'Email verified successfully.' });
    }
  );
}
