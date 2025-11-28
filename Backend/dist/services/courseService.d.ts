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
export declare const courseService: {
    /**
     * Get all courses (with pagination)
     */
    getAllCourses: (limit?: number, offset?: number) => Promise<{
        courses: Course[];
        total: number;
    }>;
    /**
     * Get course by ID
     */
    getCourseById: (id: number) => Promise<{
        course: Course;
        modules: Module[];
    } | null>;
    /**
     * Create/Upload course metadata
     */
    uploadCourse: (courseData: CourseInput) => Promise<{
        tempId: string;
        course: Course;
    }>;
    /**
     * Update course with blockchain registration info
     * This is called after blockchain guy publishes the course
     */
    publishCourse: (courseId: number, ipTokenId: string, metadataHash: string, txHash: string) => Promise<Course>;
    /**
     * Get courses by creator wallet
     */
    getCoursesByCreator: (wallet: string) => Promise<Course[]>;
    /**
     * Add module to course
     */
    addModule: (courseId: number, title: string, resourceUrl: string, order: number) => Promise<Module>;
    /**
     * Get onchain courses (published with IP token)
     */
    getOnchainCourses: () => Promise<Course[]>;
};
//# sourceMappingURL=courseService.d.ts.map