# syntax=docker/dockerfile:1.4

# Multi-stage build for Next.js frontend - Optimized for local builds
FROM node:18-alpine AS base

# Install system dependencies once
RUN apk add --no-cache libc6-compat python3 make g++ wget curl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy only package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with BuildKit cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --include=dev && \
    rm -rf node_modules/@next/swc-linux-x64-gnu 2>/dev/null || true && \
    npm install --save-optional @next/swc-linux-x64-musl@latest || true

# Ensure autoprefixer and postcss are installed (required for Next.js build)
# Install separately to ensure it completes successfully
RUN npm install --save-dev autoprefixer postcss tailwindcss && \
    npm list autoprefixer postcss || (echo "ERROR: autoprefixer/postcss not installed!" && exit 1)

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json and lock file
COPY package.json package-lock.json* ./

# Copy application files (this layer will be invalidated on code changes)
COPY . .

# Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Build environment - use production for optimized builds
ENV NODE_ENV=production

# Increase Node.js heap size for build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Create SWC cache directory
RUN mkdir -p /root/.cache/next-swc

# Ensure SWC musl binary exists
RUN rm -rf node_modules/@next/swc-linux-x64-gnu 2>/dev/null || true && \
    npm install --save-optional @next/swc-linux-x64-musl@latest || true

# CRITICAL: Reinstall autoprefixer and postcss in builder stage to ensure they're available
# This is necessary because node_modules might not have them properly linked
RUN npm install --save-dev autoprefixer postcss tailwindcss && \
    npm list autoprefixer postcss || (echo "ERROR: autoprefixer/postcss installation failed!" && exit 1) && \
    ls -la node_modules/autoprefixer || (echo "ERROR: autoprefixer directory not found!" && exit 1)

# Build the application with BuildKit cache mount
RUN --mount=type=cache,target=/root/.cache/next-swc \
    --mount=type=cache,target=/app/.next/cache \
    npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_SWC_PATH=/root/.cache/next-swc
ENV NEXT_PRIVATE_SKIP_POSTCSS_PLUGINS=true

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy standalone output from Next.js build
# The standalone output includes node_modules and server.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy SWC cache if it exists
USER root
RUN mkdir -p /root/.cache/next-swc && \
    rm -rf /app/node_modules/@next/swc-linux-x64-gnu 2>/dev/null || true

COPY --from=builder /root/.cache/next-swc /root/.cache/next-swc 2>/dev/null || true
RUN chown -R nextjs:nodejs /root/.cache/next-swc 2>/dev/null || true

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use the standalone server
CMD ["node", "server.js"]
