# Multi-stage build for Next.js frontend
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
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
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

# Set build environment to production for standalone output
# Next.js standalone mode requires NODE_ENV=production during build
ENV NODE_ENV=production

# Increase Node.js heap size for build
ENV NODE_OPTIONS="--max-old-space-size=16384"

# Create SWC cache directory
RUN mkdir -p /root/.cache/next-swc

# Build the application (this will download SWC binaries during build)
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install wget for healthcheck
RUN apk add --no-cache wget curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy .next folder (includes static and potentially standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules (required for next start)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy SWC cache from builder to avoid runtime download
# Use root user temporarily to copy cache, then change ownership
USER root
COPY --from=builder /root/.cache/next-swc /root/.cache/next-swc
RUN chown -R nextjs:nodejs /root/.cache/next-swc || true

# Set SWC path to use cached binaries
ENV NEXT_SWC_PATH=/root/.cache/next-swc

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV=production

# Use next start in production mode (standalone may not always be generated)
# Ensure we're in the app directory and use production mode
CMD ["sh", "-c", "cd /app && NODE_ENV=production npx next start"]
