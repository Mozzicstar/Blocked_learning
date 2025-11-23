import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { courseService } from '../services/courseService.js';

interface UploadCourseBody {
  title: string;
  description: string;
  tags: string[];
  fileCid: string;
  fileName: string;
  price?: number;
}

interface PublishCourseBody {
  courseId: number;
  ipTokenId: string;
  metadataHash: string;
  txHash: string;
}

export const courseRoutes = async (app: FastifyInstance) => {
  /**
   * GET /api/courses
   * List all courses with pagination
   */
  app.get<{ Querystring: { limit?: string; offset?: string } }>(
    '/api/courses',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const limit = Math.min(parseInt(request.query.limit || '10'), 100);
        const offset = parseInt(request.query.offset || '0');

        const { courses, total } = await courseService.getAllCourses(limit, offset);

        return reply.status(200).send({
          statusCode: 200,
          data: courses,
          pagination: {
            limit,
            offset,
            total,
            pages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch courses'
        });
      }
    }
  );

  /**
   * GET /api/courses/:id
   * Get specific course with modules
   */
  app.get<{ Params: { id: string } }>(
    '/api/courses/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const courseId = parseInt(request.params.id);

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID'
          });
        }

        const result = await courseService.getCourseById(courseId);

        if (!result) {
          return reply.status(404).send({
            statusCode: 404,
            message: 'Course not found'
          });
        }

        return reply.status(200).send({
          statusCode: 200,
          data: result
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch course'
        });
      }
    }
  );

  /**
   * POST /api/courses/upload
   * Upload course metadata (requires auth)
   */
  app.post<{ Body: UploadCourseBody }>(
    '/api/courses/upload',
    async (request: FastifyRequest<{ Body: UploadCourseBody }>, reply: FastifyReply) => {
      try {
        // TODO: Add auth middleware here
        // For now, require wallet in body
        const { title, description, tags, fileCid, fileName } = request.body;
        const creatorWallet = (request as any).headers['x-wallet'] || '0x0000000000000000000000000000000000000000';

        if (!title || !description || !fileCid) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required fields: title, description, fileCid'
          });
        }

        const { tempId, course } = await courseService.uploadCourse({
          title,
          description,
          tags: tags || [],
          fileCid,
          fileName,
          creator_wallet: creatorWallet
        });

        return reply.status(201).send({
          statusCode: 201,
          message: 'Course uploaded successfully',
          data: {
            tempId,
            course,
            next: 'Publish course when ready'
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to upload course'
        });
      }
    }
  );

  /**
   * POST /api/courses/publish
   * Publish course on blockchain (⚠️ TODO LATER - Needs blockchain guy)
   * Requires: ipTokenId, metadataHash from blockchain registration
   */
  app.post<{ Body: PublishCourseBody }>(
    '/api/courses/publish',
    async (request: FastifyRequest<{ Body: PublishCourseBody }>, reply: FastifyReply) => {
      try {
        const { courseId, ipTokenId, metadataHash, txHash } = request.body;

        if (!courseId || !ipTokenId || !metadataHash) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required fields: courseId, ipTokenId, metadataHash'
          });
        }

        // TODO: In Phase 7, integrate blockchain guy's registerIP() function here
        // For now, just update the course with the provided blockchain data
        const publishedCourse = await courseService.publishCourse(
          courseId,
          ipTokenId,
          metadataHash,
          txHash
        );

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course published successfully',
          data: {
            course: publishedCourse,
            ipTokenId,
            txHash
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to publish course'
        });
      }
    }
  );

  /**
   * GET /api/courses/onchain
   * Get only published courses with IP tokens (⚠️ TODO LATER - Needs blockchain guy)
   */
  app.get(
    '/api/courses/onchain',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // TODO: In Phase 7, integrate blockchain guy's read functions
        // For now, return courses from DB that have ip_token_id
        const courses = await courseService.getOnchainCourses();

        return reply.status(200).send({
          statusCode: 200,
          data: courses,
          message: 'Note: These courses have blockchain registration data in DB'
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch onchain courses'
        });
      }
    }
  );

  /**
   * GET /api/courses/creator/:wallet
   * Get courses by specific creator
   */
  app.get<{ Params: { wallet: string } }>(
    '/api/courses/creator/:wallet',
    async (request: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address'
          });
        }

        const courses = await courseService.getCoursesByCreator(wallet);

        return reply.status(200).send({
          statusCode: 200,
          data: courses
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch creator courses'
        });
      }
    }
  );
};
