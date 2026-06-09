import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ProfileService } from '../services/profile.service.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';
import { validateBody } from '../middleware/validate.js';

const profileService = new ProfileService();

export async function profileRoutes(app: FastifyInstance) {
  // Get current user profile
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get current user profile',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const profile = await profileService.getProfile(userId);

      return reply.send(profile);
    }
  );

  // Update profile
  app.put(
    '/',
    {
      preHandler: [app.authenticate, validateBody(updateProfileSchema)],
      schema: {
        description: 'Update user profile',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const updateData = request.body;

      const profile = await profileService.updateProfile(userId, updateData);

      return reply.send(profile);
    }
  );

  // Get onboarding status
  app.get(
    '/onboarding-status',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Check if user has completed onboarding',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const status = await profileService.getOnboardingStatus(userId);

      return reply.send(status);
    }
  );

  // Complete onboarding
  app.post(
    '/complete-onboarding',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Complete user onboarding with lifestyle data',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const onboardingData = request.body;

      const result = await profileService.completeOnboarding(userId, onboardingData);

      return reply.send(result);
    }
  );

  // Get carbon baseline
  app.get(
    '/baseline',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get user carbon footprint baseline',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const baseline = await profileService.getCarbonBaseline(userId);

      return reply.send(baseline);
    }
  );

  // Delete account
  app.delete(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Delete user account',
        tags: ['Profile'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      await profileService.deleteAccount(userId);

      return reply.send({ message: 'Account deleted successfully.' });
    }
  );
}
