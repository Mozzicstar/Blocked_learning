# Root Dockerfile that builds the Backend service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY Backend/package.json Backend/package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY Backend/tsconfig.json ./
COPY Backend/src ./src

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy package files
COPY Backend/package.json Backend/package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/contracts ./dist/contracts

# Copy .env if it exists
COPY Backend/.env* ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/server.js"]
