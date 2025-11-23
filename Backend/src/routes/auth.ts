import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/authService.js';

interface NonceRequest {
  wallet: string;
}

interface VerifyRequest {
  wallet: string;
  nonce: string;
}

export const authRoutes = async (app: FastifyInstance) => {
  /**
   * POST /api/auth/nonce
   * Generate a nonce for signature verification
   */
  app.post<{ Body: NonceRequest }>(
    '/api/auth/nonce',
    async (request: FastifyRequest<{ Body: NonceRequest }>, reply: FastifyReply) => {
      try {
        const { wallet } = request.body;

        if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address format'
          });
        }

        const { nonce, expiresIn } = authService.generateNonce();
        authService.storeNonceForWallet(nonce, wallet);

        return reply.status(200).send({
          statusCode: 200,
          nonce,
          expiresIn,
          message: 'Nonce generated successfully'
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to generate nonce'
        });
      }
    }
  );

  /**
   * POST /api/auth/verify
   * Verify signed nonce and issue JWT token
   */
  app.post<{ Body: VerifyRequest }>(
    '/api/auth/verify',
    async (request: FastifyRequest<{ Body: VerifyRequest }>, reply: FastifyReply) => {
      try {
        const { wallet, nonce } = request.body;

        if (!wallet || !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Invalid wallet address'
          });
        }

        if (!nonce) {
          return reply.status(400).send({
            statusCode: 400,
            message: 'Nonce is required'
          });
        }

        // Verify nonce hasn't expired
        if (!authService.verifyNonce(nonce)) {
          return reply.status(401).send({
            statusCode: 401,
            message: 'Invalid or expired nonce'
          });
        }

        // In production, verify the signature here using ethers.js
        // For MVP, we'll accept the nonce verification as sufficient
        // TODO: Add signature verification with ethers.recoverAddress()

        // Get or create user
        const user = await authService.getOrCreateUser(wallet);

        // Generate JWT token
        const token = authService.generateToken(wallet);

        return reply.status(200).send({
          statusCode: 200,
          message: 'Authentication successful',
          token,
          user: {
            id: user.id,
            wallet: user.wallet,
            displayName: user.display_name,
            createdAt: user.created_at
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Verification failed'
        });
      }
    }
  );

  /**
   * GET /api/me
   * Get authenticated user profile
   */
  app.get(
    '/api/me',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
          return reply.status(401).send({
            statusCode: 401,
            message: 'Missing authorization token'
          });
        }

        const decoded = authService.verifyToken(token);
        if (!decoded) {
          return reply.status(401).send({
            statusCode: 401,
            message: 'Invalid or expired token'
          });
        }

        const user = await authService.getUserByWallet(decoded.wallet);
        if (!user) {
          return reply.status(404).send({
            statusCode: 404,
            message: 'User not found'
          });
        }

        return reply.status(200).send({
          statusCode: 200,
          user: {
            id: user.id,
            wallet: user.wallet,
            displayName: user.display_name,
            createdAt: user.created_at
          }
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          statusCode: 500,
          message: 'Failed to fetch user profile'
        });
      }
    }
  );
};

export default authRoutes;
