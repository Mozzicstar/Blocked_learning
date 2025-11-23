import { db } from '../db/client.js';

export interface CourseInput {
  title: string;
  description: string;
  tags: string[];
  fileCid: string;
  fileName: string;
  price?: number;
  creator_wallet: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  creator_wallet: string;
  file_cid: string;
  ip_token_id: string | null;
  metadata_hash: string | null;
  tags: string[];
  status: string;
  created_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  resource_url: string;
  module_order: number;
}

export const courseService = {
  /**
   * Get all courses (with pagination)
   */
  getAllCourses: async (limit: number = 10, offset: number = 0): Promise<{ courses: Course[]; total: number }> => {
    try {
      const result = await db.query(
        'SELECT * FROM courses ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      const countResult = await db.query('SELECT COUNT(*) as count FROM courses');
      const total = countResult.rows[0]?.count || 0;

      const courses = result.rows.map((row: any) => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));

      return { courses, total };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  /**
   * Get course by ID
   */
  getCourseById: async (id: number): Promise<{ course: Course; modules: Module[] } | null> => {
    try {
      const courseResult = await db.query(
        'SELECT * FROM courses WHERE id = ?',
        [id]
      );

      if (courseResult.rows.length === 0) {
        return null;
      }

      const course = {
        ...courseResult.rows[0],
        tags: courseResult.rows[0].tags ? JSON.parse(courseResult.rows[0].tags) : []
      };

      const modulesResult = await db.query(
        'SELECT * FROM modules WHERE course_id = ? ORDER BY module_order',
        [id]
      );

      return {
        course,
        modules: modulesResult.rows
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  /**
   * Create/Upload course metadata
   */
  uploadCourse: async (courseData: CourseInput): Promise<{ tempId: string; course: Course }> => {
    try {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const tagsJson = JSON.stringify(courseData.tags);

      const result = await db.query(
        `INSERT INTO courses (title, description, creator_wallet, file_cid, tags, status) 
         VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
        [
          courseData.title,
          courseData.description,
          courseData.creator_wallet,
          courseData.fileCid,
          tagsJson,
          'draft'
        ]
      );

      const course = {
        ...result.rows[0],
        tags: JSON.parse(result.rows[0].tags)
      };

      return { tempId, course };
    } catch (error) {
      console.error('Error uploading course:', error);
      throw error;
    }
  },

  /**
   * Update course with blockchain registration info
   * This is called after blockchain guy publishes the course
   */
  publishCourse: async (
    courseId: number,
    ipTokenId: string,
    metadataHash: string,
    txHash: string
  ): Promise<Course> => {
    try {
      const result = await db.query(
        `UPDATE courses 
         SET ip_token_id = ?, metadata_hash = ?, status = ? 
         WHERE id = ? RETURNING *`,
        [ipTokenId, metadataHash, 'published', courseId]
      );

      if (result.rows.length === 0) {
        throw new Error('Course not found');
      }

      return {
        ...result.rows[0],
        tags: JSON.parse(result.rows[0].tags)
      };
    } catch (error) {
      console.error('Error publishing course:', error);
      throw error;
    }
  },

  /**
   * Get courses by creator wallet
   */
  getCoursesByCreator: async (wallet: string): Promise<Course[]> => {
    try {
      const result = await db.query(
        'SELECT * FROM courses WHERE creator_wallet = ? ORDER BY created_at DESC',
        [wallet]
      );

      return result.rows.map((row: any) => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error fetching creator courses:', error);
      throw error;
    }
  },

  /**
   * Add module to course
   */
  addModule: async (
    courseId: number,
    title: string,
    resourceUrl: string,
    order: number
  ): Promise<Module> => {
    try {
      const result = await db.query(
        `INSERT INTO modules (course_id, title, resource_url, module_order) 
         VALUES (?, ?, ?, ?) RETURNING *`,
        [courseId, title, resourceUrl, order]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error adding module:', error);
      throw error;
    }
  },

  /**
   * Get onchain courses (published with IP token)
   */
  getOnchainCourses: async (): Promise<Course[]> => {
    try {
      const result = await db.query(
        'SELECT * FROM courses WHERE ip_token_id IS NOT NULL AND status = ? ORDER BY created_at DESC',
        ['published']
      );

      return result.rows.map((row: any) => ({
        ...row,
        tags: row.tags ? JSON.parse(row.tags) : []
      }));
    } catch (error) {
      console.error('Error fetching onchain courses:', error);
      throw error;
    }
  }
};
