# 1. Install dependencies and build app
FROM node:18.16.0-bullseye AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

# Copy source files
COPY . .

# This will do the trick for public environment variables
COPY .env.production .env.production

RUN yarn build

# 2. Production image, copy all the files and run next
FROM node:18.16.0-bullseye-slim AS runner

WORKDIR /app

# Create nodejs user and group
RUN groupadd -r nodejs && useradd -r -g nodejs nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]