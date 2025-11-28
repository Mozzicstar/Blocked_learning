export interface Course {
    id: bigint;
    creator: string;
    metadataHash: string;
    timestamp: bigint;
    isActive: boolean;
    tags: string[];
    royaltyBps: bigint;
}
export interface CourseStats {
    enrollments: bigint;
    completions: bigint;
    totalRating: bigint;
    ratingCount: bigint;
    views: bigint;
}
export interface Certificate {
    courseId: bigint;
    learner: string;
    completionDate: bigint;
    score: bigint;
    metadataUri: string;
}
export interface UserProfile {
    totalXP: bigint;
    level: bigint;
    coursesCompleted: bigint;
    coursesCreated: bigint;
    totalRatingsGiven: bigint;
    streak: bigint;
    lastActivityDate: bigint;
}
export interface Badge {
    name: string;
    description: string;
    imageUri: string;
    requiredXP: bigint;
    exists: boolean;
}
export declare const ipRegistryService: {
    /**
     * Register a new course on-chain
     */
    registerCourse: (metadataHash: string, tags: string[], royaltyBps: number) => Promise<{
        txHash: string;
        courseId: bigint;
    }>;
    /**
     * Get course details by ID
     */
    getCourse: (courseId: number) => Promise<Course>;
    /**
     * Get all course IDs by a creator
     */
    getCreatorCourses: (creatorAddress: string) => Promise<bigint[]>;
    /**
     * Get course ID by metadata hash
     */
    getCourseByMetadataHash: (metadataHash: string) => Promise<bigint>;
    /**
     * Get total number of courses
     */
    getTotalCourses: () => Promise<bigint>;
    /**
     * Check if a course is active
     */
    isCourseActive: (courseId: number) => Promise<boolean>;
    /**
     * Update course metadata (creator only)
     */
    updateCourseMetadata: (courseId: number, newMetadataHash: string) => Promise<{
        txHash: string;
    }>;
    /**
     * Deactivate a course (creator only)
     */
    deactivateCourse: (courseId: number) => Promise<{
        txHash: string;
    }>;
};
export declare const courseDirectoryService: {
    /**
     * Enroll in a course
     */
    enrollCourse: (courseId: number) => Promise<{
        txHash: string;
    }>;
    /**
     * Mark course as completed
     */
    completeCourse: (courseId: number) => Promise<{
        txHash: string;
    }>;
    /**
     * Rate a course (1-5 stars)
     */
    rateCourse: (courseId: number, rating: number) => Promise<{
        txHash: string;
    }>;
    /**
     * Record a course view
     */
    viewCourse: (courseId: number) => Promise<{
        txHash: string;
    }>;
    /**
     * Get course statistics
     */
    getCourseStats: (courseId: number) => Promise<CourseStats>;
    /**
     * Get average rating for a course (scaled by 100)
     */
    getAverageRating: (courseId: number) => Promise<bigint>;
    /**
     * Check if user is enrolled in a course
     */
    isEnrolled: (courseId: number, learnerAddress: string) => Promise<boolean>;
    /**
     * Check if user has completed a course
     */
    hasCompleted: (courseId: number, learnerAddress: string) => Promise<boolean>;
    /**
     * Get completion rate (scaled by 10000)
     */
    getCompletionRate: (courseId: number) => Promise<bigint>;
};
export declare const certificateService: {
    /**
     * Mint a certificate for course completion
     */
    mintCertificate: (courseId: number, score: number, metadataUri: string) => Promise<{
        txHash: string;
        tokenId: bigint;
    }>;
    /**
     * Get certificate details by token ID
     */
    getCertificate: (tokenId: number) => Promise<Certificate>;
    /**
     * Get all certificate token IDs for a learner
     */
    getLearnerCertificates: (learnerAddress: string) => Promise<bigint[]>;
    /**
     * Get certificate token ID for a specific course and learner
     */
    getCertificateForCourse: (learnerAddress: string, courseId: number) => Promise<bigint>;
    /**
     * Get total certificates issued
     */
    getTotalCertificates: () => Promise<bigint>;
    /**
     * Get certificate token URI
     */
    getTokenURI: (tokenId: number) => Promise<string>;
    /**
     * Get certificate owner
     */
    getOwner: (tokenId: number) => Promise<string>;
};
export declare const reputationService: {
    /**
     * Award XP for completing a course
     */
    awardCourseCompletionXP: (userAddress: string, courseId: number) => Promise<{
        txHash: string;
    }>;
    /**
     * Award XP for creating a course
     */
    awardCourseCreationXP: (userAddress: string) => Promise<{
        txHash: string;
    }>;
    /**
     * Award XP for rating a course
     */
    awardRatingXP: (userAddress: string) => Promise<{
        txHash: string;
    }>;
    /**
     * Get user profile (XP, level, stats)
     */
    getUserProfile: (userAddress: string) => Promise<UserProfile>;
    /**
     * Get all badge IDs earned by user
     */
    getUserBadges: (userAddress: string) => Promise<bigint[]>;
    /**
     * Get badge details by ID
     */
    getBadge: (badgeId: number) => Promise<Badge>;
    /**
     * Check if user has a specific badge
     */
    userHasBadge: (userAddress: string, badgeId: number) => Promise<boolean>;
    /**
     * Get XP needed for next level
     */
    getXPToNextLevel: (userAddress: string) => Promise<bigint>;
    /**
     * Get total badge count
     */
    getBadgeCount: () => Promise<bigint>;
};
export declare const royaltyService: {
    /**
     * Purchase a course
     */
    purchaseCourse: (courseId: number, valueInWei: bigint) => Promise<{
        txHash: string;
    }>;
    /**
     * Set course price (creator only)
     */
    setCoursePrice: (courseId: number, priceInWei: bigint) => Promise<{
        txHash: string;
    }>;
    /**
     * Withdraw pending earnings (creator)
     */
    withdrawEarnings: () => Promise<{
        txHash: string;
    }>;
    /**
     * Get course price
     */
    getCoursePrice: (courseId: number) => Promise<bigint>;
    /**
     * Check if user has purchased a course
     */
    hasUserPurchased: (courseId: number, buyerAddress: string) => Promise<boolean>;
    /**
     * Get pending withdrawals for creator
     */
    getPendingWithdrawals: (creatorAddress: string) => Promise<bigint>;
    /**
     * Get total revenue for a course
     */
    getCourseRevenue: (courseId: number) => Promise<bigint>;
    /**
     * Calculate fees for a given price
     */
    calculateFees: (priceInWei: bigint) => Promise<{
        platformFee: bigint;
        creatorAmount: bigint;
    }>;
    /**
     * Get platform fee in basis points
     */
    getPlatformFeeBps: () => Promise<bigint>;
};
export declare const blockchainUtils: {
    /**
     * Convert ETH to Wei
     */
    toWei: (ethAmount: string) => bigint;
    /**
     * Convert Wei to ETH
     */
    fromWei: (weiAmount: bigint) => string;
    /**
     * Check if blockchain service is configured
     */
    isConfigured: () => boolean;
    /**
     * Get current block number
     */
    getBlockNumber: () => Promise<number>;
    /**
     * Get wallet balance
     */
    getBalance: (address: string) => Promise<string>;
};
export declare const blockchainService: {
    ipRegistry: {
        /**
         * Register a new course on-chain
         */
        registerCourse: (metadataHash: string, tags: string[], royaltyBps: number) => Promise<{
            txHash: string;
            courseId: bigint;
        }>;
        /**
         * Get course details by ID
         */
        getCourse: (courseId: number) => Promise<Course>;
        /**
         * Get all course IDs by a creator
         */
        getCreatorCourses: (creatorAddress: string) => Promise<bigint[]>;
        /**
         * Get course ID by metadata hash
         */
        getCourseByMetadataHash: (metadataHash: string) => Promise<bigint>;
        /**
         * Get total number of courses
         */
        getTotalCourses: () => Promise<bigint>;
        /**
         * Check if a course is active
         */
        isCourseActive: (courseId: number) => Promise<boolean>;
        /**
         * Update course metadata (creator only)
         */
        updateCourseMetadata: (courseId: number, newMetadataHash: string) => Promise<{
            txHash: string;
        }>;
        /**
         * Deactivate a course (creator only)
         */
        deactivateCourse: (courseId: number) => Promise<{
            txHash: string;
        }>;
    };
    courseDirectory: {
        /**
         * Enroll in a course
         */
        enrollCourse: (courseId: number) => Promise<{
            txHash: string;
        }>;
        /**
         * Mark course as completed
         */
        completeCourse: (courseId: number) => Promise<{
            txHash: string;
        }>;
        /**
         * Rate a course (1-5 stars)
         */
        rateCourse: (courseId: number, rating: number) => Promise<{
            txHash: string;
        }>;
        /**
         * Record a course view
         */
        viewCourse: (courseId: number) => Promise<{
            txHash: string;
        }>;
        /**
         * Get course statistics
         */
        getCourseStats: (courseId: number) => Promise<CourseStats>;
        /**
         * Get average rating for a course (scaled by 100)
         */
        getAverageRating: (courseId: number) => Promise<bigint>;
        /**
         * Check if user is enrolled in a course
         */
        isEnrolled: (courseId: number, learnerAddress: string) => Promise<boolean>;
        /**
         * Check if user has completed a course
         */
        hasCompleted: (courseId: number, learnerAddress: string) => Promise<boolean>;
        /**
         * Get completion rate (scaled by 10000)
         */
        getCompletionRate: (courseId: number) => Promise<bigint>;
    };
    certificates: {
        /**
         * Mint a certificate for course completion
         */
        mintCertificate: (courseId: number, score: number, metadataUri: string) => Promise<{
            txHash: string;
            tokenId: bigint;
        }>;
        /**
         * Get certificate details by token ID
         */
        getCertificate: (tokenId: number) => Promise<Certificate>;
        /**
         * Get all certificate token IDs for a learner
         */
        getLearnerCertificates: (learnerAddress: string) => Promise<bigint[]>;
        /**
         * Get certificate token ID for a specific course and learner
         */
        getCertificateForCourse: (learnerAddress: string, courseId: number) => Promise<bigint>;
        /**
         * Get total certificates issued
         */
        getTotalCertificates: () => Promise<bigint>;
        /**
         * Get certificate token URI
         */
        getTokenURI: (tokenId: number) => Promise<string>;
        /**
         * Get certificate owner
         */
        getOwner: (tokenId: number) => Promise<string>;
    };
    reputation: {
        /**
         * Award XP for completing a course
         */
        awardCourseCompletionXP: (userAddress: string, courseId: number) => Promise<{
            txHash: string;
        }>;
        /**
         * Award XP for creating a course
         */
        awardCourseCreationXP: (userAddress: string) => Promise<{
            txHash: string;
        }>;
        /**
         * Award XP for rating a course
         */
        awardRatingXP: (userAddress: string) => Promise<{
            txHash: string;
        }>;
        /**
         * Get user profile (XP, level, stats)
         */
        getUserProfile: (userAddress: string) => Promise<UserProfile>;
        /**
         * Get all badge IDs earned by user
         */
        getUserBadges: (userAddress: string) => Promise<bigint[]>;
        /**
         * Get badge details by ID
         */
        getBadge: (badgeId: number) => Promise<Badge>;
        /**
         * Check if user has a specific badge
         */
        userHasBadge: (userAddress: string, badgeId: number) => Promise<boolean>;
        /**
         * Get XP needed for next level
         */
        getXPToNextLevel: (userAddress: string) => Promise<bigint>;
        /**
         * Get total badge count
         */
        getBadgeCount: () => Promise<bigint>;
    };
    royalty: {
        /**
         * Purchase a course
         */
        purchaseCourse: (courseId: number, valueInWei: bigint) => Promise<{
            txHash: string;
        }>;
        /**
         * Set course price (creator only)
         */
        setCoursePrice: (courseId: number, priceInWei: bigint) => Promise<{
            txHash: string;
        }>;
        /**
         * Withdraw pending earnings (creator)
         */
        withdrawEarnings: () => Promise<{
            txHash: string;
        }>;
        /**
         * Get course price
         */
        getCoursePrice: (courseId: number) => Promise<bigint>;
        /**
         * Check if user has purchased a course
         */
        hasUserPurchased: (courseId: number, buyerAddress: string) => Promise<boolean>;
        /**
         * Get pending withdrawals for creator
         */
        getPendingWithdrawals: (creatorAddress: string) => Promise<bigint>;
        /**
         * Get total revenue for a course
         */
        getCourseRevenue: (courseId: number) => Promise<bigint>;
        /**
         * Calculate fees for a given price
         */
        calculateFees: (priceInWei: bigint) => Promise<{
            platformFee: bigint;
            creatorAmount: bigint;
        }>;
        /**
         * Get platform fee in basis points
         */
        getPlatformFeeBps: () => Promise<bigint>;
    };
    utils: {
        /**
         * Convert ETH to Wei
         */
        toWei: (ethAmount: string) => bigint;
        /**
         * Convert Wei to ETH
         */
        fromWei: (weiAmount: bigint) => string;
        /**
         * Check if blockchain service is configured
         */
        isConfigured: () => boolean;
        /**
         * Get current block number
         */
        getBlockNumber: () => Promise<number>;
        /**
         * Get wallet balance
         */
        getBalance: (address: string) => Promise<string>;
    };
};
export default blockchainService;
//# sourceMappingURL=blockchainService.d.ts.map