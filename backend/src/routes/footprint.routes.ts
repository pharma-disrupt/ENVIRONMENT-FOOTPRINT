import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { FootprintService } from '../services/footprint.service.js';

const footprintService = new FootprintService();

export async function footprintRoutes(app: FastifyInstance) {
  // Get current footprint overview
  app.get(
    '/',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get user carbon footprint overview',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const footprint = await footprintService.getFootprintOverview(userId);

      return reply.send(footprint);
    }
  );

  // Get footprint breakdown by category
  app.get(
    '/breakdown',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get carbon footprint breakdown by category',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const breakdown = await footprintService.getFootprintBreakdown(userId);

      return reply.send(breakdown);
    }
  );

  // Get footprint trends over time
  app.get(
    '/trends',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get carbon footprint trends over time',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const period = request.query.period || 'month';

      const trends = await footprintService.getFootprintTrends(userId, period);

      return reply.send(trends);
    }
  );

  // Compare with national average
  app.get(
    '/comparison',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Compare footprint with national average',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const comparison = await footprintService.compareWithAverage(userId);

      return reply.send(comparison);
    }
  );

  // Get impact equivalents
  app.get(
    '/equivalents',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get carbon footprint in relatable equivalents',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const equivalents = await footprintService.getImpactEquivalents(userId);

      return reply.send(equivalents);
    }
  );

  // Recalculate footprint
  app.post(
    '/recalculate',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Recalculate user carbon footprint',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.userId;

      const footprint = await footprintService.recalculateFootprint(userId);

      return reply.send(footprint);
    }
  );

  // Get monthly summary
  app.get(
    '/monthly-summary',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get monthly footprint summary',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { year, month } = request.query;

      const summary = await footprintService.getMonthlySummary(userId, year, month);

      return reply.send(summary);
    }
  );

  // Get footprint history
  app.get(
    '/history',
    {
      preHandler: [app.authenticate],
      schema: {
        description: 'Get historical footprint snapshots',
        tags: ['Footprint'],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Querystring: any }>, reply: FastifyReply) => {
      const userId = request.user!.userId;
      const { startDate, endDate } = request.query;

      const history = await footprintService.getFootprintHistory(
        userId,
        startDate,
        endDate
      );

      return reply.send(history);
    }
  );
}
