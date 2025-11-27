import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  blockchainService,
  ipRegistryService,
  courseDirectoryService,
  certificateService,
  reputationService,
  royaltyService,
  blockchainUtils,
} from '../services/blockchainService.js';

// ============ Request Body Types ============

interface RegisterCourseBody {
  metadataHash: string;
  tags: string[];
  royaltyBps: number;
}

interface EnrollCourseBody {
  courseId: number;
}

interface CompleteCourseBody {
  courseId: number;
}

interface RateCourseBody {
  courseId: number;
  rating: number;
}

interface MintCertificateBody {
  courseId: number;
  score: number;
  metadataUri: string;
}

interface PurchaseCourseBody {
  courseId: number;
  priceInEth: string;
}

interface SetCoursePriceBody {
  courseId: number;
  priceInEth: string;
}

// ============ Routes ============

export const blockchainRoutes = async (app: FastifyInstance) => {
  // ===== Health Check =====

  /**
   * GET /api/blockchain/status
   * Check if blockchain service is configured and connected
   */
  app.get('/api/blockchain/status', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const isConfigured = blockchainUtils.isConfigured();
      
      let blockNumber = null;
      if (isConfigured) {
        try {
          blockNumber = await blockchainUtils.getBlockNumber();
        } catch (e) {
          // Connection failed
        }
      }

      return reply.status(200).send({
        statusCode: 200,
        data: {
          configured: isConfigured,
          connected: blockNumber !== null,
          blockNumber,
        },
      });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        message: 'Failed to check blockchain status',
      });
    }
  });

  // ===== IPRegistry Routes =====

  /**
   * POST /api/blockchain/courses/register
   * Register a new course on-chain
   */
  app.post<{ Body: RegisterCourseBody }>(
    '/api/blockchain/courses/register',
    async (request: FastifyRequest<{ Body: RegisterCourseBody }>, reply: FastifyReply) => {
      try {
        const { metadataHash, tags, royaltyBps } = request.body;

        if (!metadataHash) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required field: metadataHash',
          });
        }

        if (royaltyBps > 10000) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'royaltyBps cannot exceed 10000 (100%)',
          });
        }

        const result = await ipRegistryService.registerCourse(
          metadataHash,
          tags || [],
          royaltyBps || 500
        );

        return reply.status(201).send({
          statusCode: 201,
          message: 'Course registered on-chain successfully',
          data: {
            txHash: result.txHash,
            courseId: result.courseId.toString(),
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to register course on-chain',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/courses/:id
   * Get course details from blockchain
   */
  app.get<{ Params: { id: string } }>(
    '/api/blockchain/courses/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const courseId = parseInt(request.params.id);

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        const course = await ipRegistryService.getCourse(courseId);
        const stats = await courseDirectoryService.getCourseStats(courseId);
        const avgRating = await courseDirectoryService.getAverageRating(courseId);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            course: {
              id: course.id.toString(),
              creator: course.creator,
              metadataHash: course.metadataHash,
              timestamp: course.timestamp.toString(),
              isActive: course.isActive,
              tags: course.tags,
              royaltyBps: course.royaltyBps.toString(),
            },
            stats: {
              enrollments: stats.enrollments.toString(),
              completions: stats.completions.toString(),
              totalRating: stats.totalRating.toString(),
              ratingCount: stats.ratingCount.toString(),
              views: stats.views.toString(),
              averageRating: (Number(avgRating) / 100).toFixed(2),
            },
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to fetch course from blockchain',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/courses/creator/:wallet
   * Get all course IDs by a creator
   */
  app.get<{ Params: { wallet: string } }>(
    '/api/blockchain/courses/creator/:wallet',
    async (request: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const courseIds = await ipRegistryService.getCreatorCourses(wallet);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            creator: wallet,
            courseIds: courseIds.map((id) => id.toString()),
            count: courseIds.length,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to fetch creator courses',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/courses/total
   * Get total number of courses registered
   */
  app.get('/api/blockchain/courses/total', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const total = await ipRegistryService.getTotalCourses();

      return reply.status(200).send({
        statusCode: 200,
        data: {
          totalCourses: total.toString(),
        },
      });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        message: error.message || 'Failed to fetch total courses',
      });
    }
  });

  // ===== CourseDirectory Routes =====

  /**
   * POST /api/blockchain/courses/:id/enroll
   * Enroll in a course
   */
  app.post<{ Params: { id: string } }>(
    '/api/blockchain/courses/:id/enroll',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const courseId = parseInt(request.params.id);

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        const result = await courseDirectoryService.enrollCourse(courseId);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Successfully enrolled in course',
          data: {
            courseId,
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to enroll in course',
        });
      }
    }
  );

  /**
   * POST /api/blockchain/courses/:id/complete
   * Mark course as completed
   */
  app.post<{ Params: { id: string } }>(
    '/api/blockchain/courses/:id/complete',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const courseId = parseInt(request.params.id);

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        const result = await courseDirectoryService.completeCourse(courseId);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course marked as completed',
          data: {
            courseId,
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to complete course',
        });
      }
    }
  );

  /**
   * POST /api/blockchain/courses/:id/rate
   * Rate a course (1-5 stars)
   */
  app.post<{ Params: { id: string }; Body: { rating: number } }>(
    '/api/blockchain/courses/:id/rate',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { rating: number } }>,
      reply: FastifyReply
    ) => {
      try {
        const courseId = parseInt(request.params.id);
        const { rating } = request.body;

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        if (!rating || rating < 1 || rating > 5) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Rating must be between 1 and 5',
          });
        }

        const result = await courseDirectoryService.rateCourse(courseId, rating);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course rated successfully',
          data: {
            courseId,
            rating,
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to rate course',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/courses/:id/enrollment/:wallet
   * Check if a user is enrolled and has completed a course
   */
  app.get<{ Params: { id: string; wallet: string } }>(
    '/api/blockchain/courses/:id/enrollment/:wallet',
    async (
      request: FastifyRequest<{ Params: { id: string; wallet: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const courseId = parseInt(request.params.id);
        const { wallet } = request.params;

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const [isEnrolled, hasCompleted] = await Promise.all([
          courseDirectoryService.isEnrolled(courseId, wallet),
          courseDirectoryService.hasCompleted(courseId, wallet),
        ]);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            courseId,
            wallet,
            isEnrolled,
            hasCompleted,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to check enrollment status',
        });
      }
    }
  );

  // ===== Certificate Routes =====

  /**
   * POST /api/blockchain/certificates/mint
   * Mint a certificate for course completion
   */
  app.post<{ Body: MintCertificateBody }>(
    '/api/blockchain/certificates/mint',
    async (request: FastifyRequest<{ Body: MintCertificateBody }>, reply: FastifyReply) => {
      try {
        const { courseId, score, metadataUri } = request.body;

        if (!courseId || !metadataUri) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required fields: courseId, metadataUri',
          });
        }

        if (score < 0 || score > 100) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Score must be between 0 and 100',
          });
        }

        const result = await certificateService.mintCertificate(courseId, score || 0, metadataUri);

        return reply.status(201).send({
          statusCode: 201,
          message: 'Certificate minted successfully',
          data: {
            tokenId: result.tokenId.toString(),
            txHash: result.txHash,
            courseId,
            score,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to mint certificate',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/certificates/:tokenId
   * Get certificate details by token ID
   */
  app.get<{ Params: { tokenId: string } }>(
    '/api/blockchain/certificates/:tokenId',
    async (request: FastifyRequest<{ Params: { tokenId: string } }>, reply: FastifyReply) => {
      try {
        const tokenId = parseInt(request.params.tokenId);

        if (isNaN(tokenId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid token ID',
          });
        }

        const [certificate, tokenUri, owner] = await Promise.all([
          certificateService.getCertificate(tokenId),
          certificateService.getTokenURI(tokenId),
          certificateService.getOwner(tokenId),
        ]);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            tokenId,
            courseId: certificate.courseId.toString(),
            learner: certificate.learner,
            completionDate: certificate.completionDate.toString(),
            score: certificate.score.toString(),
            metadataUri: certificate.metadataUri,
            tokenUri,
            owner,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to fetch certificate',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/certificates/learner/:wallet
   * Get all certificates for a learner
   */
  app.get<{ Params: { wallet: string } }>(
    '/api/blockchain/certificates/learner/:wallet',
    async (request: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const tokenIds = await certificateService.getLearnerCertificates(wallet);

        // Optionally fetch full details for each certificate
        const certificates = await Promise.all(
          tokenIds.map(async (tokenId) => {
            const cert = await certificateService.getCertificate(Number(tokenId));
            return {
              tokenId: tokenId.toString(),
              courseId: cert.courseId.toString(),
              completionDate: cert.completionDate.toString(),
              score: cert.score.toString(),
              metadataUri: cert.metadataUri,
            };
          })
        );

        return reply.status(200).send({
          statusCode: 200,
          data: {
            learner: wallet,
            count: certificates.length,
            certificates,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to fetch learner certificates',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/certificates/total
   * Get total certificates issued
   */
  app.get('/api/blockchain/certificates/total', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const total = await certificateService.getTotalCertificates();

      return reply.status(200).send({
        statusCode: 200,
        data: {
          totalCertificates: total.toString(),
        },
      });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        message: error.message || 'Failed to fetch total certificates',
      });
    }
  });

  // ===== Reputation Routes =====

  /**
   * GET /api/blockchain/reputation/:wallet
   * Get user profile (XP, level, badges)
   */
  app.get<{ Params: { wallet: string } }>(
    '/api/blockchain/reputation/:wallet',
    async (request: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const [profile, badgeIds, xpToNext] = await Promise.all([
          reputationService.getUserProfile(wallet),
          reputationService.getUserBadges(wallet),
          reputationService.getXPToNextLevel(wallet),
        ]);

        // Fetch badge details
        const badges = await Promise.all(
          badgeIds.map(async (badgeId) => {
            const badge = await reputationService.getBadge(Number(badgeId));
            return {
              id: badgeId.toString(),
              name: badge.name,
              description: badge.description,
              imageUri: badge.imageUri,
            };
          })
        );

        return reply.status(200).send({
          statusCode: 200,
          data: {
            wallet,
            profile: {
              totalXP: profile.totalXP.toString(),
              level: profile.level.toString(),
              coursesCompleted: profile.coursesCompleted.toString(),
              coursesCreated: profile.coursesCreated.toString(),
              totalRatingsGiven: profile.totalRatingsGiven.toString(),
              streak: profile.streak.toString(),
              lastActivityDate: profile.lastActivityDate.toString(),
            },
            xpToNextLevel: xpToNext.toString(),
            badges,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to fetch reputation',
        });
      }
    }
  );

  /**
   * POST /api/blockchain/reputation/:wallet/award-completion
   * Award XP for course completion (admin/backend call)
   */
  app.post<{ Params: { wallet: string }; Body: { courseId: number } }>(
    '/api/blockchain/reputation/:wallet/award-completion',
    async (
      request: FastifyRequest<{ Params: { wallet: string }; Body: { courseId: number } }>,
      reply: FastifyReply
    ) => {
      try {
        const { wallet } = request.params;
        const { courseId } = request.body;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        if (!courseId) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required field: courseId',
          });
        }

        const result = await reputationService.awardCourseCompletionXP(wallet, courseId);

        return reply.status(200).send({
          statusCode: 200,
          message: 'XP awarded for course completion',
          data: {
            wallet,
            courseId,
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to award XP',
        });
      }
    }
  );

  // ===== Royalty/Purchase Routes =====

  /**
   * POST /api/blockchain/courses/:id/purchase
   * Purchase a course
   */
  app.post<{ Params: { id: string }; Body: { priceInEth?: string } }>(
    '/api/blockchain/courses/:id/purchase',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { priceInEth?: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const courseId = parseInt(request.params.id);
        const { priceInEth } = request.body;

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        // Get course price if not provided
        let priceInWei: bigint;
        if (priceInEth) {
          priceInWei = blockchainUtils.toWei(priceInEth);
        } else {
          priceInWei = await royaltyService.getCoursePrice(courseId);
        }

        if (priceInWei === BigInt(0)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Course price not set or is free',
          });
        }

        const result = await royaltyService.purchaseCourse(courseId, priceInWei);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course purchased successfully',
          data: {
            courseId,
            priceInWei: priceInWei.toString(),
            priceInEth: blockchainUtils.fromWei(priceInWei),
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to purchase course',
        });
      }
    }
  );

  /**
   * POST /api/blockchain/courses/:id/price
   * Set course price (creator only)
   */
  app.post<{ Params: { id: string }; Body: SetCoursePriceBody }>(
    '/api/blockchain/courses/:id/price',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: SetCoursePriceBody }>,
      reply: FastifyReply
    ) => {
      try {
        const courseId = parseInt(request.params.id);
        const { priceInEth } = request.body;

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        if (!priceInEth) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Missing required field: priceInEth',
          });
        }

        const priceInWei = blockchainUtils.toWei(priceInEth);
        const result = await royaltyService.setCoursePrice(courseId, priceInWei);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Course price set successfully',
          data: {
            courseId,
            priceInWei: priceInWei.toString(),
            priceInEth,
            txHash: result.txHash,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to set course price',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/courses/:id/price
   * Get course price
   */
  app.get<{ Params: { id: string } }>(
    '/api/blockchain/courses/:id/price',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const courseId = parseInt(request.params.id);

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        const priceInWei = await royaltyService.getCoursePrice(courseId);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            courseId,
            priceInWei: priceInWei.toString(),
            priceInEth: blockchainUtils.fromWei(priceInWei),
            isFree: priceInWei === BigInt(0),
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to get course price',
        });
      }
    }
  );

  /**
   * GET /api/blockchain/earnings/:wallet
   * Get pending withdrawals for creator
   */
  app.get<{ Params: { wallet: string } }>(
    '/api/blockchain/earnings/:wallet',
    async (request: FastifyRequest<{ Params: { wallet: string } }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.params;

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const pendingInWei = await royaltyService.getPendingWithdrawals(wallet);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            wallet,
            pendingInWei: pendingInWei.toString(),
            pendingInEth: blockchainUtils.fromWei(pendingInWei),
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to get pending earnings',
        });
      }
    }
  );

  /**
   * POST /api/blockchain/earnings/withdraw
   * Withdraw pending earnings (caller must be the creator)
   */
  app.post('/api/blockchain/earnings/withdraw', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await royaltyService.withdrawEarnings();

      return reply.status(200).send({
        statusCode: 200,
        message: 'Earnings withdrawn successfully',
        data: {
          txHash: result.txHash,
        },
      });
    } catch (error: any) {
      app.log.error(error);
      return reply.status(500).send({
        statusCode: 500,
        message: error.message || 'Failed to withdraw earnings',
      });
    }
  });

  /**
   * GET /api/blockchain/courses/:id/purchase-status/:wallet
   * Check if user has purchased a course
   */
  app.get<{ Params: { id: string; wallet: string } }>(
    '/api/blockchain/courses/:id/purchase-status/:wallet',
    async (
      request: FastifyRequest<{ Params: { id: string; wallet: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const courseId = parseInt(request.params.id);
        const { wallet } = request.params;

        if (isNaN(courseId)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid course ID',
          });
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address',
          });
        }

        const hasPurchased = await royaltyService.hasUserPurchased(courseId, wallet);

        return reply.status(200).send({
          statusCode: 200,
          data: {
            courseId,
            wallet,
            hasPurchased,
          },
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: error.message || 'Failed to check purchase status',
        });
      }
    }
  );
};
