import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { aiServiceClient } from '../services/aiServiceClient.js';

interface MentorExplainBody {
  question: string;
}

interface MentorSuggestBody {
  progress: any;
}

interface MentorProfileParams {
  wallet: string;
}

interface CodeAuditBody {
  code: string;
}

interface ProjectGenerationBody {
  topic: string;
  difficulty: string;
  title?: string;
  description?: string;
  skill_level?: string;
}

export const mentorRoutes = async (app: FastifyInstance) => {
  /**
   * POST /api/mentor/explain
   * Personalized explanations with code examples
   */
  app.post<{ Body: MentorExplainBody }>(
    '/api/mentor/explain',
    async (request: FastifyRequest<{ Body: MentorExplainBody }>, reply: FastifyReply) => {
      try {
        const { question } = request.body;
        const wallet = (request as any).headers['x-wallet'] || 'default-wallet';
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!question) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Question is required'
          });
        }

        // Check rate limit
        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded. Max 10 requests per minute.'
          });
        }

        const result = await aiServiceClient.explainTopic(wallet, question);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to get explanation from AI service'
        });
      }
    }
  );

  /**
   * POST /api/mentor/suggest
   * Smart next-step recommendations
   */
  app.post<{ Body: MentorSuggestBody }>(
    '/api/mentor/suggest',
    async (request: FastifyRequest<{ Body: MentorSuggestBody }>, reply: FastifyReply) => {
      try {
        const { progress } = request.body;
        const wallet = (request as any).headers['x-wallet'] || 'default-wallet';
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!progress) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Progress data is required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.suggestNext(wallet, progress);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to get suggestion from AI service'
        });
      }
    }
  );

  /**
   * GET /api/mentor/profile/:wallet
   * Learning profile analysis & 4-week plan
   */
  app.get<{ Params: MentorProfileParams }>(
    '/api/mentor/profile/:wallet',
    async (request: FastifyRequest<{ Params: MentorProfileParams }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!wallet) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Wallet address is required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.getProfile(wallet);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to get profile from AI service'
        });
      }
    }
  );

  /**
   * POST /api/mentor/audit-code
   * Security vulnerability detection
   */
  app.post<{ Body: CodeAuditBody }>(
    '/api/mentor/audit-code',
    async (request: FastifyRequest<{ Body: CodeAuditBody }>, reply: FastifyReply) => {
      try {
        const { code } = request.body;
        const wallet = (request as any).headers['x-wallet'] || 'default-wallet';
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!code) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Code is required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.auditCode(wallet, code);

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to audit code from AI service'
        });
      }
    }
  );

  /**
   * POST /api/mentor/generate-project
   * Custom project templates
   */
  app.post<{ Body: ProjectGenerationBody }>(
    '/api/mentor/generate-project',
    async (request: FastifyRequest<{ Body: ProjectGenerationBody }>, reply: FastifyReply) => {
      try {
        const { topic, difficulty, title, description, skill_level } = request.body;
        const wallet = (request as any).headers['x-wallet'] || 'default-wallet';
        const userId = (request as any).headers['x-user-id'] || 'anonymous';

        if (!topic || !difficulty) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Topic and difficulty are required'
          });
        }

        if (!aiServiceClient.checkRateLimit(userId)) {
          return reply.status(429).send({
            statusCode: 429,
            message: 'Rate limit exceeded'
          });
        }

        const result = await aiServiceClient.generateProject(wallet, {
          topic,
          difficulty,
          title: title || 'Project',
          description: description || 'Create a project based on the topic',
          skill_level: skill_level || difficulty,
          technologies: ['Solidity', 'Hardhat', 'Ethers.js'],
          learning_goals: ['Complete the project', 'Understand core concepts', 'Deploy to testnet']
        });

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to generate project from AI service'
        });
      }
    }
  );
};
