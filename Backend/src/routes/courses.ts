import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { courseService } from '../services/courseService.js';
import { ipRegistryService, blockchainUtils } from '../services/blockchainService.js';

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
        const limit = Math.min(parseInt((request.query as { limit?: string; offset?: string }).limit || '10'), 100);
        const offset = parseInt((request.query as { limit?: string; offset?: string }).offset || '0');

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
   * Publish course on blockchain using IPRegistry contract
   * Can either accept pre-registered blockchain data OR register on-chain
   */
  app.post<{ Body: PublishCourseBody }>(
    '/api/courses/publish',
    async (request: FastifyRequest<{ Body: PublishCourseBody }>, reply: FastifyReply) => {
      try {
        const { courseId, ipTokenId, metadataHash, txHash } = request.body;

        if (!courseId) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required field: courseId'
          });
        }

        // If blockchain data is provided, just update DB
        // Otherwise, attempt to register on-chain
        let finalIpTokenId = ipTokenId;
        let finalTxHash = txHash;
        let finalMetadataHash = metadataHash;

        if (!ipTokenId && blockchainUtils.isConfigured()) {
          // Get course from DB to get metadata for blockchain registration
          const courseData = await courseService.getCourseById(courseId);
          if (!courseData) {
            return reply.status(404).send({
              statusCode: 404,
              message: 'Course not found'
            });
          }

          // Use file_cid as metadata hash for on-chain registration
          const onchainMetadataHash = courseData.course.file_cid;
          const tags = courseData.course.tags || [];
          const royaltyBps = 500; // 5% default royalty

          try {
            const result = await ipRegistryService.registerCourse(
              onchainMetadataHash,
              tags,
              royaltyBps
            );
            finalIpTokenId = result.courseId.toString();
            finalTxHash = result.txHash;
            finalMetadataHash = onchainMetadataHash;
          } catch (blockchainError: any) {
            app.log.error('Blockchain registration failed:', blockchainError);
            return reply.status(500).send({
              statusCode: 500,
              message: `Blockchain registration failed: ${blockchainError.message}`
            });
          }
        } else if (!ipTokenId) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Blockchain not configured. Please provide ipTokenId, metadataHash, txHash manually.'
          });
        }

        // Update course in DB with blockchain data
        const publishedCourse = await courseService.publishCourse(
          courseId,
          finalIpTokenId!,
          finalMetadataHash!,
          finalTxHash!
        );

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course published successfully',
          data: {
            course: publishedCourse,
            ipTokenId: finalIpTokenId,
            txHash: finalTxHash,
            onChain: blockchainUtils.isConfigured()
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
   * Get published courses - combines DB data with on-chain data when available
   */
  app.get(
    '/api/courses/onchain',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // Get courses from DB that have ip_token_id
        const dbCourses = await courseService.getOnchainCourses();

        // If blockchain is configured, enrich with on-chain data
        let enrichedCourses = dbCourses;
        if (blockchainUtils.isConfigured()) {
          enrichedCourses = await Promise.all(
            dbCourses.map(async (course) => {
              if (course.ip_token_id) {
                try {
                  const onchainCourse = await ipRegistryService.getCourse(
                    parseInt(course.ip_token_id)
                  );
                  return {
                    ...course,
                    onchain: {
                      creator: onchainCourse.creator,
                      timestamp: onchainCourse.timestamp.toString(),
                      isActive: onchainCourse.isActive,
                      royaltyBps: onchainCourse.royaltyBps.toString(),
                    },
                  };
                } catch {
                  // On-chain data not available
                  return course;
                }
              }
              return course;
            })
          );
        }

        return reply.status(200).send({
          statusCode: 200,
          data: enrichedCourses,
          blockchainConnected: blockchainUtils.isConfigured()
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
