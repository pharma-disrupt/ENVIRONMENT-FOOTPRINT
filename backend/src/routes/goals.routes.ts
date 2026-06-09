import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { GoalsService } from '../services/goals.service.js';
import { createGoalSchema, updateGoalSchema } from '../schemas/goals.schema.js';
import { validateBody } from '../middleware/validate.js';

const goalsService = new GoalsService();

export async function goalsRoutes(app: FastifyInstance) {
  // Get all user goals
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get all user carbon reduction goals',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const goals = await goalsService.getUserGoals(userId);

      return reply.send(goals);
    }
  );

  // Get goal by ID
  app.get(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get specific goal by ID',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const goal = await goalsService.getGoalById(userId, id);

      return reply.send(goal);
    }
  );

  // Create new goal
  app.post(
    '/',
    {
      preHandler: [app.authenticate, validateBody(createGoalSchema)],
      schema: {
        description: 'Create a new carbon reduction goal',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const goalData = request.body;

      const goal = await goalsService.createGoal(userId, goalData);

      return reply.code(201).send(goal);
    }
  );

  // Update goal
  app.put(
    '/:id',
    {
      preHandler: [app.authenticate, validateBody(updateGoalSchema)],
      schema: {
        description: 'Update an existing goal',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: any }>,
      reply: FastifyReply
    ) => {
      const userId = request.user!.userId;
      const { id } = request.params;
      const updateData = request.body;

      const goal = await goalsService.updateGoal(userId, id, updateData);

      return reply.send(goal);
    }
  );

  // Delete goal
  app.delete(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Delete a goal',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      await goalsService.deleteGoal(userId, id);

      return reply.send({ message: 'Goal deleted successfully.' });
    }
  );

  // Get goal progress
  app.get(
    '/:id/progress',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get progress for a specific goal',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const progress = await goalsService.getGoalProgress(userId, id);

      return reply.send(progress);
    }
  );

  // Get active goals
  app.get(
    '/active',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get all active goals',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const goals = await goalsService.getActiveGoals(userId);

      return reply.send(goals);
    }
  );

  // Get completed goals
  app.get(
    '/completed',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get all completed goals',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const goals = await goalsService.getCompletedGoals(userId);

      return reply.send(goals);
    }
  );

  // Mark goal as completed
  app.post(
    '/:id/complete',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Mark a goal as completed',
        tags: ['Goals'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const goal = await goalsService.markGoalComplete(userId, id);

      return reply.send(goal);
    }
  );
}
