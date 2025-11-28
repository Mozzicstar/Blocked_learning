import { adminService } from '../services/adminService.js';
export const adminRoutes = async (app) => {
    /**
     * GET /api/admin/stats
     * Dashboard statistics - user count, course count, XP stats, top users
     */
    app.get('/api/admin/stats', async (request, reply) => {
        try {
            const stats = await adminService.getStats();
            return reply.status(200).send({
                statusCode: 200,
                data: stats
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to fetch admin statistics'
            });
        }
    });
    /**
     * GET /api/admin/users
     * Get all users with pagination
     */
    app.get('/api/admin/users', async (request, reply) => {
        try {
            const limit = parseInt(request.query.limit || '50', 10);
            const offset = parseInt(request.query.offset || '0', 10);
            if (limit > 100) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'Limit cannot exceed 100'
                });
            }
            const users = await adminService.getAllUsers(limit, offset);
            return reply.status(200).send({
                statusCode: 200,
                data: {
                    users,
                    limit,
                    offset,
                    total: users.length
                }
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to fetch users'
            });
        }
    });
    /**
     * POST /api/admin/ban
     * Ban or unban a user
     */
    app.post('/api/admin/ban', async (request, reply) => {
        try {
            const { wallet, banned } = request.body;
            if (!wallet) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'Wallet address is required'
                });
            }
            // Get user by wallet
            const user = await adminService.getUserByWallet(wallet);
            if (!user) {
                return reply.status(404).send({
                    statusCode: 404,
                    message: 'User not found'
                });
            }
            const result = await adminService.banUser(user.id, banned !== false);
            return reply.status(200).send({
                statusCode: 200,
                data: result
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to update user ban status'
            });
        }
    });
};
//# sourceMappingURL=admin.js.map