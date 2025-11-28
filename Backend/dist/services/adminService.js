import { db } from '../db/client.js';
export const adminService = {
    /**
     * Get dashboard statistics
     */
    getStats: async () => {
        try {
            // Total users
            const usersResult = await db.query('SELECT COUNT(*) as count FROM users WHERE status = ?', ['active']);
            const totalUsers = usersResult.rows[0]?.count || 0;
            // Total courses
            const coursesResult = await db.query('SELECT COUNT(*) as count FROM courses');
            const totalCourses = coursesResult.rows[0]?.count || 0;
            // Progress stats
            const progressResult = await db.query('SELECT COUNT(*) as count FROM progress');
            const totalProgress = progressResult.rows[0]?.count || 0;
            // XP stats
            const xpQuery = `
        SELECT 
          SUM(CASE WHEN completed_at IS NOT NULL THEN 100 ELSE 0 END) as total_xp,
          AVG(CASE WHEN completed_at IS NOT NULL THEN 100 ELSE 0 END) as avg_xp
        FROM progress
      `;
            const xpResult = await db.query(xpQuery);
            const totalXp = xpResult.rows[0]?.total_xp || 0;
            const averageXpPerUser = xpResult.rows[0]?.avg_xp ? Math.round(xpResult.rows[0].avg_xp) : 0;
            // Top users by XP
            const topUsersQuery = `
        SELECT 
          u.wallet,
          u.id,
          COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) as completedModules,
          COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) * 100 as xp
        FROM users u
        LEFT JOIN progress p ON u.id = p.user_id
        WHERE u.status = 'active'
        GROUP BY u.id
        ORDER BY xp DESC
        LIMIT 5
      `;
            const topUsersResult = await db.query(topUsersQuery);
            const topUsers = topUsersResult.rows || [];
            return {
                totalUsers,
                totalCourses,
                totalProgress,
                totalXp,
                averageXpPerUser,
                topUsers
            };
        }
        catch (error) {
            console.error('Error getting admin stats:', error);
            throw error;
        }
    },
    /**
     * Get all users with their stats
     */
    getAllUsers: async (limit = 50, offset = 0) => {
        try {
            const query = `
        SELECT 
          u.id,
          u.wallet,
          u.display_name,
          u.created_at,
          COALESCE(u.status, 'active') as status,
          COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) * 100 as xp,
          COUNT(CASE WHEN p.completed_at IS NOT NULL THEN 1 END) as completedModules
        FROM users u
        LEFT JOIN progress p ON u.id = p.user_id
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT ? OFFSET ?
      `;
            const result = await db.query(query, [limit, offset]);
            const users = (result.rows || result);
            return users;
        }
        catch (error) {
            console.error('Error getting users:', error);
            throw error;
        }
    },
    /**
     * Ban or unban a user
     */
    banUser: async (userId, banned = true) => {
        try {
            const status = banned ? 'banned' : 'active';
            const updateQuery = 'UPDATE users SET status = ? WHERE id = ?';
            await db.query(updateQuery, [status, userId]);
            return {
                success: true,
                message: `User ${banned ? 'banned' : 'unbanned'} successfully`
            };
        }
        catch (error) {
            console.error('Error banning user:', error);
            throw error;
        }
    },
    /**
     * Get user by wallet
     */
    getUserByWallet: async (wallet) => {
        try {
            const query = 'SELECT id FROM users WHERE wallet = ?';
            const result = await db.query(query, [wallet]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error getting user by wallet:', error);
            throw error;
        }
    }
};
//# sourceMappingURL=adminService.js.map