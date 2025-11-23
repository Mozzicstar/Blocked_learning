import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { aiServiceClient } from '../services/aiServiceClient.js';

interface AnalyzeVideoBody {
  video_path: string;
  creator_wallet: string;
  title?: string;
}

interface AnalyzeQualityBody {
  video_url: string;
  transcript: string;
}

interface GenerateQuizBody {
  video_id: number;
  transcript: string;
}

interface SemanticSearchBody {
  query: string;
}

export const contentRoutes = async (app: FastifyInstance) => {
  /**
   * POST /api/analyze/video
   * Video content analysis and key concepts extraction
   */
  app.post<{ Body: AnalyzeVideoBody }>(
    '/api/analyze/video',
    async (request: FastifyRequest<{ Body: AnalyzeVideoBody }>, reply: FastifyReply) => {
      try {
        const { video_path, creator_wallet, title } = request.body;
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!video_path || !creator_wallet) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'video_path and creator_wallet are required'
          });
        }

        // Check rate limit
        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded. Max 10 requests per minute.'
          });
        }

        const result = await aiServiceClient.analyzeVideo(video_path, creator_wallet, title || 'Video');

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to analyze video from AI service'
        });
      }
    }
  );

  /**
   * POST /api/analyze/quality
   * Content quality scoring and improvement suggestions
   */
  app.post<{ Body: AnalyzeQualityBody }>(
    '/api/analyze/quality',
    async (request: FastifyRequest<{ Body: AnalyzeQualityBody }>, reply: FastifyReply) => {
      try {
        const { video_url, transcript } = request.body;
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!video_url || !transcript) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'video_url and transcript are required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.analyzeQuality(video_url, transcript);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to analyze content quality from AI service'
        });
      }
    }
  );

  /**
   * POST /api/generate/quiz
   * Quiz generation from video content
   */
  app.post<{ Body: GenerateQuizBody }>(
    '/api/generate/quiz',
    async (request: FastifyRequest<{ Body: GenerateQuizBody }>, reply: FastifyReply) => {
      try {
        const { video_id, transcript } = request.body;
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!video_id || !transcript) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'video_id and transcript are required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.generateQuiz(video_id.toString(), transcript);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to generate quiz from AI service'
        });
      }
    }
  );

  /**
   * POST /api/search/semantic
   * Semantic search across learning content
   */
  app.post<{ Body: SemanticSearchBody }>(
    '/api/search/semantic',
    async (request: FastifyRequest<{ Body: SemanticSearchBody }>, reply: FastifyReply) => {
      try {
        const { query } = request.body;
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!query) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Query is required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.semanticSearch(query);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to search from AI service'
        });
      }
    }
  );
};
