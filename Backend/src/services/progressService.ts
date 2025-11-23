import { db } from '../db/client.js';

export interface ProgressInput {
  user_id: number;
  module_id: number;
}

export interface ProgressRecord {
  id: number;
  user_id: number;
  module_id: number;
  completed_at: string;
}

export interface UserProgress {
  userId: number;
  completedModules: number[];
  totalCompleted: number;
  badges: string[];
  xp: number;
}

export const progressService = {
  /**
   * Get user's progress
   */
  getUserProgress: async (userId: number): Promise<UserProgress> => {
    try {
      const result = await db.query(
        'SELECT module_id FROM progress WHERE user_id = ? ORDER BY completed_at',
        [userId]
      );

      const completedModules = result.rows.map((row: any) => row.module_id);
      
      // Calculate XP (100 points per module)
      const xp = completedModules.length * 100;
      
      // Award badges based on progress
      const badges = [];
      if (completedModules.length >= 1) badges.push('first-step');
      if (completedModules.length >= 5) badges.push('learner');
      if (completedModules.length >= 10) badges.push('master');
      if (completedModules.length >= 20) badges.push('expert');

      return {
        userId,
        completedModules,
        totalCompleted: completedModules.length,
        badges,
        xp
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  /**
   * Mark module as completed
   */
  markModuleComplete: async (userId: number, moduleId: number): Promise<ProgressRecord> => {
    try {
      // Check if already completed
      const checkResult = await db.query(
        'SELECT * FROM progress WHERE user_id = ? AND module_id = ?',
        [userId, moduleId]
      );

      if (checkResult.rows.length > 0) {
        // Already completed
        return checkResult.rows[0];
      }

      // Mark as completed
      const result = await db.query(
        'INSERT INTO progress (user_id, module_id) VALUES (?, ?) RETURNING *',
        [userId, moduleId]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error marking module complete:', error);
      throw error;
    }
  },

  /**
   * Get module completion status
   */
  isModuleCompleted: async (userId: number, moduleId: number): Promise<boolean> => {
    try {
      const result = await db.query(
        'SELECT * FROM progress WHERE user_id = ? AND module_id = ?',
        [userId, moduleId]
      );

      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking module completion:', error);
      throw error;
    }
  },

  /**
   * Get user's course progress
   */
  getCourseProgress: async (userId: number, courseId: number): Promise<{ completed: number; total: number; percentage: number }> => {
    try {
      // Get all modules for the course
      const modulesResult = await db.query(
        'SELECT id FROM modules WHERE course_id = ?',
        [courseId]
      );

      const totalModules = modulesResult.rows.length;
      const moduleIds = modulesResult.rows.map((row: any) => row.id);

      if (totalModules === 0) {
        return { completed: 0, total: 0, percentage: 0 };
      }

      // Count completed modules
      let completed = 0;
      for (const moduleId of moduleIds) {
        const isCompleted = await progressService.isModuleCompleted(userId, moduleId);
        if (isCompleted) completed++;
      }

      const percentage = Math.round((completed / totalModules) * 100);

      return { completed, total: totalModules, percentage };
    } catch (error) {
      console.error('Error getting course progress:', error);
      throw error;
    }
  },

  /**
   * Get all user progress records
   */
  getAllUserProgress: async (userId: number): Promise<ProgressRecord[]> => {
    try {
      const result = await db.query(
        'SELECT * FROM progress WHERE user_id = ? ORDER BY completed_at DESC',
        [userId]
      );

      return result.rows;
    } catch (error) {
      console.error('Error fetching all user progress:', error);
      throw error;
    }
  }
};
