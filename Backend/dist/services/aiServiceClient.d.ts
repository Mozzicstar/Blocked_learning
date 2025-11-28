export declare const aiServiceClient: {
    /**
     * Check rate limit for user
     */
    checkRateLimit: (userId: string) => boolean;
    /**
     * Make request to AI service
     */
    makeRequest: (endpoint: string, method?: string, body?: any) => Promise<any>;
    /**
     * POST /mentor/explain
     */
    explainTopic: (wallet: string, question: string) => Promise<any>;
    /**
     * POST /mentor/suggest
     */
    suggestNext: (wallet: string, progress: any) => Promise<any>;
    /**
     * GET /mentor/profile/:wallet
     */
    getProfile: (wallet: string) => Promise<any>;
    /**
     * POST /mentor/audit-code
     */
    auditCode: (wallet: string, code: string) => Promise<any>;
    /**
     * POST /mentor/generate-project
     */
    generateProject: (wallet: string, payload: any) => Promise<any>;
    /**
     * POST /analyze/video
     */
    analyzeVideo: (video_path: string, creator_wallet: string, title: string) => Promise<any>;
    /**
     * POST /analyze/quality
     */
    analyzeQuality: (video_url: string, transcript: string) => Promise<any>;
    /**
     * POST /generate/quiz
     */
    generateQuiz: (video_id: string, transcript: string) => Promise<any>;
    /**
     * POST /search/semantic
     */
    semanticSearch: (query: string) => Promise<any>;
    /**
     * POST /recommend/next
     */
    getRecommendations: (userId: string, currentVideoId: string) => Promise<any>;
    /**
     * GET /trends/industry
     */
    getIndustryTrends: () => Promise<any>;
};
//# sourceMappingURL=aiServiceClient.d.ts.map