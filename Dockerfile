# Build stage
FROM node:23-alpine as build

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy all frontend files
COPY . .

# Build the app
RUN npm run build

# Production stage - Run Next.js server
FROM node:23-alpine as production

WORKDIR /app

# Copy package files
COPY package*.json ./

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install only production dependencies
RUN npm ci --only=production --force

# Copy built application from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV NODE_ENV production
ENV PORT 3000

CMD ["npm", "start"]