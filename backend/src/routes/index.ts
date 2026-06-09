import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes.js';
import { profileRoutes } from './profile.routes.js';
import { activityRoutes } from './activity.routes.js';
import { footprintRoutes } from './footprint.routes.js';
import { goalsRoutes } from './goals.routes.js';
import { challengesRoutes } from './challenges.routes.js';
import { insightsRoutes } from './insights.routes.js';

export async function registerRoutes(app: FastifyInstance) {
  const apiPrefix = `/api/${process.env.API_VERSION || 'v1'}`;

  // Register all routes
  await app.register(authRoutes, { prefix: `${apiPrefix}/auth` });
  await app.register(profileRoutes, { prefix: `${apiPrefix}/profile` });
  await app.register(activityRoutes, { prefix: `${apiPrefix}/activities` });
  await app.register(footprintRoutes, { prefix: `${apiPrefix}/footprint` });
  await app.register(goalsRoutes, { prefix: `${apiPrefix}/goals` });
  await app.register(challengesRoutes, { prefix: `${apiPrefix}/challenges` });
  await app.register(insightsRoutes, { prefix: `${apiPrefix}/insights` });

  app.log.info('All routes registered successfully');
}
