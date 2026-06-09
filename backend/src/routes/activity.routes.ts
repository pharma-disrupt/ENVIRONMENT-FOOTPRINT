import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ActivityService } from '../services/activity.service.js';
import {
  createActivitySchema,
  updateActivitySchema,
  activityQuerySchema,
} from '../schemas/activity.schema.js';
import { validateBody, validateQuery } from '../middleware/validate.js';

const activityService = new ActivityService();

export async function activityRoutes(app: FastifyInstance) {
  // Get all activities with filters
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get user activities with optional filters',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const query = request.query;

      const activities = await activityService.getActivities(userId, query);

      return reply.send(activities);
    }
  );

  // Get activity by ID
  app.get(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get specific activity by ID',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const activity = await activityService.getActivityById(userId, id);

      return reply.send(activity);
    }
  );

  // Create new activity
  app.post(
    '/',
    {
      preHandler: [app.authenticate, validateBody(createActivitySchema)],
      schema: {
        description: 'Log a new carbon-emitting activity',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const activityData = request.body;

      const activity = await activityService.createActivity(userId, activityData);

      return reply.code(201).send(activity);
    }
  );

  // Update activity
  app.put(
    '/:id',
    {
      preHandler: [app.authenticate, validateBody(updateActivitySchema)],
      schema: {
        description: 'Update an existing activity',
        tags: ['Activities'],
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

      const activity = await activityService.updateActivity(userId, id, updateData);

      return reply.send(activity);
    }
  );

  // Delete activity
  app.delete(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Delete an activity',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      await activityService.deleteActivity(userId, id);

      return reply.send({ message: 'Activity deleted successfully.' });
    }
  );

  // Get activities by category
  app.get(
    '/category/:category',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get activities filtered by category',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (
      request: FastifyRequest<{ Params: { category: string }; Querystring: any }>,
      reply: FastifyReply
    ) => {
      const userId = request.user!.userId;
      const { category } = request.params;
      const query = request.query;

      const activities = await activityService.getActivitiesByCategory(
        userId,
        category,
        query
      );

      return reply.send(activities);
    }
  );

  // Get recent activities
  app.get(
    '/recent',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get recent activities (last 7 days)',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const activities = await activityService.getRecentActivities(userId);

      return reply.send(activities);
    }
  );

  // Get activity statistics
  app.get(
    '/stats',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get activity statistics',
        tags: ['Activities'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const stats = await activityService.getActivityStats(userId);

      return reply.send(stats);
    }
  );
}
