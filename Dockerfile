# Multi-stage build for Next.js frontend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# Ensure devDependencies are installed for build (tailwindcss, etc.)
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED 1

# Set build environment - use development for build, production for runtime
ENV NODE_ENV=development

# Increase Node.js heap size for build
ENV NODE_OPTIONS="--max-old-space-size=16384"

# Build the application
# Use explicit error handling to see if build fails
RUN set -eux; \
    echo "Starting Next.js build..."; \
    npm run build || (echo "Build failed with exit code $?" && exit 1); \
    echo "Build completed successfully"; \
    echo "Checking .next folder..."; \
    ls -la /app/.next/ || (echo "ERROR: .next folder not found after build!" && exit 1); \
    echo "Checking .next/static folder..."; \
    ls -la /app/.next/static/ || echo "WARNING: .next/static not found"; \
    echo "Build verification complete"

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Install wget and curl for healthcheck
RUN apk add --no-cache wget curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy .next folder - this will fail if build didn't complete
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules (required for next start)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Verify files were copied
RUN echo "Verifying copied files..." && \
    ls -la /app/.next/ && \
    ls -la /app/.next/static/ 2>/dev/null || echo "Static folder missing" && \
    echo "Files verified"

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV=production

# Use next start in production mode
CMD ["sh", "-c", "cd /app && NODE_ENV=production npx next start"]
