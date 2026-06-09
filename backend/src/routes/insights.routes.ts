import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { InsightsService } from '../services/insights.service.js';

const insightsService = new InsightsService();

export async function insightsRoutes(app: FastifyInstance) {
  // Get personalized insights
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get personalized carbon reduction insights',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const insights = await insightsService.getPersonalizedInsights(userId);

      return reply.send(insights);
    }
  );

  // Get tips list
  app.get(
    '/tips',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get carbon reduction tips',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { category, limit } = request.query;

      const tips = await insightsService.getTips(userId, category, limit);

      return reply.send(tips);
    }
  );

  // Get recommendations based on footprint
  app.get(
    '/recommendations',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get personalized recommendations',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const recommendations = await insightsService.getRecommendations(userId);

      return reply.send(recommendations);
    }
  );

  // Get insight by ID
  app.get(
    '/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get specific insight by ID',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      const insight = await insightsService.getInsightById(userId, id);

      return reply.send(insight);
    }
  );

  // Mark insight as helpful
  app.post(
    '/:id/helpful',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Mark an insight as helpful',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      await insightsService.markInsightHelpful(userId, id);

      return reply.send({ message: 'Insight marked as helpful.' });
    }
  );

  // Mark insight as not relevant
  app.post(
    '/:id/not-relevant',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Mark an insight as not relevant',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { id } = request.params;

      await insightsService.markInsightNotRelevant(userId, id);

      return reply.send({ message: 'Insight marked as not relevant.' });
    }
  );

  // Get weekly digest
  app.get(
    '/weekly-digest',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get weekly insights digest',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const digest = await insightsService.getWeeklyDigest(userId);

      return reply.send(digest);
    }
  );

  // Get insights by category
  app.get(
    '/category/:category',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get insights filtered by category',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (
      request: FastifyRequest<{ Params: { category: string } }>,
      reply: FastifyReply
    ) => {
      const userId = request.user!.userId;
      const { category } = request.params;

      const insights = await insightsService.getInsightsByCategory(userId, category);

      return reply.send(insights);
    }
  );

  // Get quick wins (high impact, low effort actions)
  app.get(
    '/quick-wins',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get quick win recommendations',
        tags: ['Insights'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const quickWins = await insightsService.getQuickWins(userId);

      return reply.send(quickWins);
    }
  );
}
