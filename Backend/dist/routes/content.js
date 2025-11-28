import { aiServiceClient } from '../services/aiServiceClient.js';
export const contentRoutes = async (app) => {
    /**
     * POST /api/analyze/video
     * Video content analysis and key concepts extraction
     */
    app.post('/api/analyze/video', async (request, reply) => {
        try {
            const { video_path, creator_wallet, title } = request.body;
            const userId = request.headers['x-user-id'] || 'anonymous';
            if (!video_path || !creator_wallet) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'video_path and creator_wallet are required'
                });
            }
            // Check rate limit
            if (!aiServiceClient.checkRateLimit(userId)) {
                return reply.status(429).send({
                    statusCode: 429,
                    message: 'Rate limit exceeded. Max 10 requests per minute.'
                });
            }
            const result = await aiServiceClient.analyzeVideo(video_path, creator_wallet, title || 'Video');
            return reply.status(200).send({
                statusCode: 200,
                data: result
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to analyze video from AI service'
            });
        }
    });
    /**
     * POST /api/analyze/quality
     * Content quality scoring and improvement suggestions
     */
    app.post('/api/analyze/quality', async (request, reply) => {
        try {
            const { video_url, transcript } = request.body;
            const userId = request.headers['x-user-id'] || 'anonymous';
            if (!video_url || !transcript) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'video_url and transcript are required'
                });
            }
            if (!aiServiceClient.checkRateLimit(userId)) {
                return reply.status(429).send({
                    statusCode: 429,
                    message: 'Rate limit exceeded'
                });
            }
            const result = await aiServiceClient.analyzeQuality(video_url, transcript);
            return reply.status(200).send({
                statusCode: 200,
                data: result
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to analyze content quality from AI service'
            });
        }
    });
    /**
     * POST /api/generate/quiz
     * Quiz generation from video content
     */
    app.post('/api/generate/quiz', async (request, reply) => {
        try {
            const { video_id, transcript } = request.body;
            const userId = request.headers['x-user-id'] || 'anonymous';
            if (!video_id || !transcript) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'video_id and transcript are required'
                });
            }
            if (!aiServiceClient.checkRateLimit(userId)) {
                return reply.status(429).send({
                    statusCode: 429,
                    message: 'Rate limit exceeded'
                });
            }
            const result = await aiServiceClient.generateQuiz(video_id.toString(), transcript);
            return reply.status(200).send({
                statusCode: 200,
                data: result
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to generate quiz from AI service'
            });
        }
    });
    /**
     * POST /api/search/semantic
     * Semantic search across learning content
     */
    app.post('/api/search/semantic', async (request, reply) => {
        try {
            const { query } = request.body;
            const userId = request.headers['x-user-id'] || 'anonymous';
            if (!query) {
                return reply.status(400).send({
                    statusCode: 400,
                    message: 'Query is required'
                });
            }
            if (!aiServiceClient.checkRateLimit(userId)) {
                return reply.status(429).send({
                    statusCode: 429,
                    message: 'Rate limit exceeded'
                });
            }
            const result = await aiServiceClient.semanticSearch(query);
            return reply.status(200).send({
                statusCode: 200,
                data: result
            });
        }
        catch (error) {
            app.log.error(error);
            return reply.status(500).send({
                statusCode: 500,
                message: 'Failed to search from AI service'
            });
        }
    });
};
//# sourceMappingURL=content.js.map