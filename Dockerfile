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

# Set build environment (not production yet - we need devDependencies for build)
ENV NODE_ENV=development

# Increase Node.js heap size for build
ENV NODE_OPTIONS="--max-old-space-size=16384"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy package.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy .next folder (includes static and potentially standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy node_modules as fallback (needed if standalone doesn't exist)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV=production

# Try standalone first, fallback to next start (production mode)
# Use explicit path and ensure production mode
CMD sh -c 'if [ -f "./server.js" ]; then node ./server.js; else cd /app && NODE_ENV=production npx next start; fi'
