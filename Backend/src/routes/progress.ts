import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { progressService } from '../services/progressService.js';

interface MarkCompleteBody {
  moduleId: number;
}

interface GetProgressQuery {
  userId: string;
}

export const progressRoutes = async (app: FastifyInstance) => {
  /**
   * GET /api/user/progress
   * Get authenticated user's progress
   */
  app.get(
    '/api/user/progress',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // For now, get userId from header (TODO: use JWT auth)
        const userIdHeader = (request as any).headers['x-user-id'];
        if (!userIdHeader) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'User ID required in x-user-id header'
          });
        }

        const userId = parseInt(userIdHeader);
        const progress = await progressService.getUserProgress(userId);

        return reply.status(200).send({
          statusCode: 200,
          data: progress
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch user progress'
        });
      }
    }
  );

  /**
   * POST /api/user/progress
   * Mark a module as completed
   */
  app.post<{ Body: MarkCompleteBody }>(
    '/api/user/progress',
    async (request: FastifyRequest<{ Body: MarkCompleteBody }>, reply: FastifyReply) => {
      try {
        const { moduleId } = request.body;
        const userIdHeader = (request as any).headers['x-user-id'];

        if (!userIdHeader || !moduleId) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'User ID (in x-user-id header) and moduleId are required'
          });
        }

        const userId = parseInt(userIdHeader);
        const progressRecord = await progressService.markModuleComplete(userId, moduleId);
        const updatedProgress = await progressService.getUserProgress(userId);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Module marked as complete',
          data: {
            progressRecord,
            updatedProgress,
            nextSuggestion: 'Great! You completed a module. Check AI service for personalized next steps.'
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to mark module complete'
        });
      }
    }
  );

  /**
   * GET /api/user/progress/course/:courseId
   * Get user's progress for a specific course
   */
  app.get<{ Params: { courseId: string } }>(
    '/api/user/progress/course/:courseId',
    async (request: FastifyRequest<{ Params: { courseId: string } }>, reply: FastifyReply) => {
      try {
        const userIdHeader = (request as any).headers['x-user-id'];
        const courseId = parseInt(request.params.courseId);

        if (!userIdHeader || isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'User ID (in x-user-id header) and valid courseId are required'
          });
        }

        const userId = parseInt(userIdHeader);
        const courseProgress = await progressService.getCourseProgress(userId, courseId);

        return reply.status(200).send({
          statusCode: 200,
          data: courseProgress
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch course progress'
        });
      }
    }
  );

  /**
   * GET /api/user/progress/all
   * This is duplicate of GET /api/user/progress - removed to avoid conflicts
   */
};
