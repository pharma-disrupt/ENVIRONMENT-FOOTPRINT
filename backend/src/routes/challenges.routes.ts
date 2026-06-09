import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ChallengeService } from '../services/challenge.service.js';
import { createChallengeSchema, joinChallengeSchema } from '../schemas/challenge.schema.js';
import { validateBody } from '../middleware/validate.js';

const challengeService = new ChallengeService();

export async function challengesRoutes(app: FastifyInstance) {
  // Get all available challenges
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get all available challenges',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const challenges = await challengeService.getAvailableChallenges(userId);

      return reply.send(challenges);
    }
  );

  // Get challenge by ID
  app.get(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get specific challenge by ID',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const challenge = await challengeService.getChallengeById(userId, id);

      return reply.send(challenge);
    }
  );

  // Join a challenge
  app.post(
    '/:id/join',
    {
      preHandler: [app.authenticate, validateBody(joinChallengeSchema)],
      schema: {
        description: 'Join a challenge',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const participation = await challengeService.joinChallenge(userId, id);

      return reply.code(201).send(participation);
    }
  );

  // Leave a challenge
  app.post(
    '/:id/leave',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Leave a challenge',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      await challengeService.leaveChallenge(userId, id);

      return reply.send({ message: 'Left challenge successfully.' });
    }
  );

  // Get user's joined challenges
  app.get(
    '/my-challenges',
    {
      preHandler: [app.authenticate],
      schema: {
        description: "Get user's joined challenges",
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const challenges = await challengeService.getUserChallenges(userId);

      return reply.send(challenges);
    }
  );

  // Get challenge progress
  app.get(
    '/:id/progress',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get progress for a specific challenge',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const progress = await challengeService.getChallengeProgress(userId, id);

      return reply.send(progress);
    }
  );

  // Submit challenge proof
  app.post(
    '/:id/submit-proof',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Submit proof of challenge completion',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: any }>,
      reply: FastifyReply
    ) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const { proofData } = request.body;

      const submission = await challengeService.submitProof(userId, id, proofData);

      return reply.code(201).send(submission);
    }
  );

  // Get challenge leaderboard
  app.get(
    '/:id/leaderboard',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get challenge leaderboard',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;

      const leaderboard = await challengeService.getLeaderboard(id);

      return reply.send(leaderboard);
    }
  );

  // Create new challenge (admin/community leader)
  app.post(
    '/',
    {
      preHandler: [app.authenticate, validateBody(createChallengeSchema)],
      schema: {
        description: 'Create a new challenge',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const challengeData = request.body;

      const challenge = await challengeService.createChallenge(userId, challengeData);

      return reply.code(201).send(challenge);
    }
  );

  // Get active challenges
  app.get(
    '/active',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get currently active challenges',
        tags: ['Challenges'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const challenges = await challengeService.getActiveChallenges(userId);

      return reply.send(challenges);
    }
  );
}
