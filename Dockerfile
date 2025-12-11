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
    npm install --save-optional @next/swc-linux-x64-musl@latest || true && \
    echo "✓ Dependencies installed"

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy package.json and lock file FIRST
COPY package.json package-lock.json* ./

# Copy node_modules from deps stage (preserve all files including symlinks)
COPY --from=deps --chown=root:root /app/node_modules ./node_modules

# Copy application files (this layer will be invalidated on code changes)
# Copy all files at once to ensure proper structure and path resolution
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

# Install postcss, tailwindcss, and autoprefixer
# Even though postcss.config.js doesn't reference it, Next.js still requires it
RUN npm install --save-dev postcss tailwindcss autoprefixer && \
    echo "✓ postcss, tailwindcss, and autoprefixer installed"

# Verify components directory and icon files are present
RUN ls -la components/icons/profile/check-circle-icon.tsx || (echo "ERROR: check-circle-icon.tsx not found!" && exit 1) && \
    ls -la components/icons/profile/user-icon.tsx || (echo "ERROR: user-icon.tsx not found!" && exit 1) && \
    ls -la components/icons/profile/document-text-icon.tsx || (echo "ERROR: document-text-icon.tsx not found!" && exit 1) && \
    ls -la tsconfig.json || (echo "ERROR: tsconfig.json not found!" && exit 1)

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

# Use the standalone server with fallback
# Check if server.js exists, otherwise use next start
CMD ["sh", "-c", "if [ -f server.js ]; then node server.js; else echo 'ERROR: server.js not found! Build may have failed.' && exit 1; fi"]
