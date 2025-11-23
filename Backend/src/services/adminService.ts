import { db } from '../db/client.js';

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalProgress: number;
  totalXp: number;
  averageXpPerUser: number;
  topUsers: Array<{ wallet: string; xp: number; completedModules: number }>;
}

interface UserInfo {
  id: number;
  wallet: string;
  display_name: string;
  created_at: string;
  status: 'active' | 'banned';
  xp: number;
  completedModules: number;
}

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<AdminStats> => {
    try {
      // Total users
      const usersResult = await db.query('SELECT COUNT(*) as count FROM users WHERE status = ?', ['active']) as any;
      const totalUsers = usersResult.rows[0]?.count || 0;

      // Total courses
      const coursesResult = await db.query('SELECT COUNT(*) as count FROM courses') as any;
      const totalCourses = coursesResult.rows[0]?.count || 0;

      // Progress stats
      const progressResult = await db.query('SELECT COUNT(*) as count FROM progress') as any;
      const totalProgress = progressResult.rows[0]?.count || 0;

      // XP stats
      const xpQuery = `
        SELECT 
          SUM(CASE WHEN completed_at IS NOT NULL THEN 100 ELSE 0 END) as total_xp,
          AVG(CASE WHEN completed_at IS NOT NULL THEN 100 ELSE 0 END) as avg_xp
        FROM progress
      `;
      const xpResult = await db.query(xpQuery) as any;
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
      const topUsersResult = await db.query(topUsersQuery) as any;
      const topUsers = topUsersResult.rows || [];

      return {
        totalUsers,
        totalCourses,
        totalProgress,
        totalXp,
        averageXpPerUser,
        topUsers
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  },

  /**
   * Get all users with their stats
   */
  getAllUsers: async (limit: number = 50, offset: number = 0): Promise<Array<UserInfo>> => {
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
      const result = await db.query(query, [limit, offset]) as any;
      const users = (result.rows || result) as Array<UserInfo>;
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  /**
   * Ban or unban a user
   */
  banUser: async (userId: number, banned: boolean = true): Promise<{ success: boolean; message: string }> => {
    try {
      const status = banned ? 'banned' : 'active';
      const updateQuery = 'UPDATE users SET status = ? WHERE id = ?';
      await db.query(updateQuery, [status, userId]);

      return {
        success: true,
        message: `User ${banned ? 'banned' : 'unbanned'} successfully`
      };
    } catch (error) {
      console.error('Error banning user:', error);
      throw error;
    }
  },

  /**
   * Get user by wallet
   */
  getUserByWallet: async (wallet: string): Promise<any> => {
    try {
      const query = 'SELECT id FROM users WHERE wallet = ?';
      const result = await db.query(query, [wallet]) as any;
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user by wallet:', error);
      throw error;
    }
  }
};
