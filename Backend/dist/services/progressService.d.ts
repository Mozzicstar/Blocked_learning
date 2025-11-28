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
export declare const progressService: {
    /**
     * Get user's progress
     */
    getUserProgress: (userId: number) => Promise<UserProgress>;
    /**
     * Mark module as completed
     */
    markModuleComplete: (userId: number, moduleId: number) => Promise<ProgressRecord>;
    /**
     * Get module completion status
     */
    isModuleCompleted: (userId: number, moduleId: number) => Promise<boolean>;
    /**
     * Get user's course progress
     */
    getCourseProgress: (userId: number, courseId: number) => Promise<{
        completed: number;
        total: number;
        percentage: number;
    }>;
    /**
     * Get all user progress records
     */
    getAllUserProgress: (userId: number) => Promise<ProgressRecord[]>;
};
//# sourceMappingURL=progressService.d.ts.map