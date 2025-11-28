interface AdminStats {
    totalUsers: number;
    totalCourses: number;
    totalProgress: number;
    totalXp: number;
    averageXpPerUser: number;
    topUsers: Array<{
        wallet: string;
        xp: number;
        completedModules: number;
    }>;
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
export declare const adminService: {
    /**
     * Get dashboard statistics
     */
    getStats: () => Promise<AdminStats>;
    /**
     * Get all users with their stats
     */
    getAllUsers: (limit?: number, offset?: number) => Promise<Array<UserInfo>>;
    /**
     * Ban or unban a user
     */
    banUser: (userId: number, banned?: boolean) => Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Get user by wallet
     */
    getUserByWallet: (wallet: string) => Promise<any>;
};
export {};
//# sourceMappingURL=adminService.d.ts.map