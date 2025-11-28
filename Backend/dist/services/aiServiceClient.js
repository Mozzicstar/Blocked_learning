const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://blockedlearning-production.up.railway.app';
const RATE_LIMIT_PER_MINUTE = parseInt(process.env.RATE_LIMIT || '10');
// In-memory rate limiter (in production, use Redis)
const requestCounts = new Map();
export const aiServiceClient = {
    /**
     * Check rate limit for user
     */
    checkRateLimit: (userId) => {
        const now = Date.now();
        const userKey = `ai_${userId}`;
        if (!requestCounts.has(userKey)) {
            requestCounts.set(userKey, { count: 1, resetAt: now + 60000 });
            return true;
        }
        const data = requestCounts.get(userKey);
        if (now > data.resetAt) {
            // Reset window
            requestCounts.set(userKey, { count: 1, resetAt: now + 60000 });
            return true;
        }
        if (data.count >= RATE_LIMIT_PER_MINUTE) {
            return false;
        }
        data.count++;
        return true;
    },
    /**
     * Make request to AI service
     */
    makeRequest: async (endpoint, method = 'POST', body) => {
        try {
            const url = `${AI_SERVICE_URL}${endpoint}`;
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            if (body) {
                options.body = JSON.stringify(body);
            }
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`AI Service error: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            console.error(`AI Service request failed for ${endpoint}:`, error);
            throw error;
        }
    },
    /**
     * POST /mentor/explain
     */
    explainTopic: async (wallet, question) => {
        return aiServiceClient.makeRequest('/mentor/explain', 'POST', { wallet, question });
    },
    /**
     * POST /mentor/suggest
     */
    suggestNext: async (wallet, progress) => {
        return aiServiceClient.makeRequest('/mentor/suggest', 'POST', { wallet, progress });
    },
    /**
     * GET /mentor/profile/:wallet
     */
    getProfile: async (wallet) => {
        return aiServiceClient.makeRequest(`/mentor/profile/${wallet}`, 'GET');
    },
    /**
     * POST /mentor/audit-code
     */
    auditCode: async (wallet, code) => {
        return aiServiceClient.makeRequest('/mentor/audit-code', 'POST', { wallet, code });
    },
    /**
     * POST /mentor/generate-project
     */
    generateProject: async (wallet, payload) => {
        return aiServiceClient.makeRequest('/mentor/generate-project', 'POST', { wallet, ...payload });
    },
    /**
     * POST /analyze/video
     */
    analyzeVideo: async (video_path, creator_wallet, title) => {
        return aiServiceClient.makeRequest('/analyze/video', 'POST', { video_path, creator_wallet, title });
    },
    /**
     * POST /analyze/quality
     */
    analyzeQuality: async (video_url, transcript) => {
        return aiServiceClient.makeRequest('/analyze/quality', 'POST', { video_url, transcript });
    },
    /**
     * POST /generate/quiz
     */
    generateQuiz: async (video_id, transcript) => {
        return aiServiceClient.makeRequest('/generate/quiz', 'POST', { video_id: parseInt(video_id), transcript });
    },
    /**
     * POST /search/semantic
     */
    semanticSearch: async (query) => {
        return aiServiceClient.makeRequest('/search/semantic', 'POST', { query });
    },
    /**
     * POST /recommend/next
     */
    getRecommendations: async (userId, currentVideoId) => {
        return aiServiceClient.makeRequest('/recommend/next', 'POST', { user_id: userId, current_video: currentVideoId });
    },
    /**
     * GET /trends/industry
     */
    getIndustryTrends: async () => {
        return aiServiceClient.makeRequest('/trends/industry', 'GET');
    }
};
//# sourceMappingURL=aiServiceClient.js.map