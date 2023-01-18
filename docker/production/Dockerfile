# 1. Install dependencies and build app
FROM ubuntu:20.04 AS builder

RUN apt-get update > /dev/null && apt-get install curl build-essential -qq > /dev/null

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install nodejs -qq > /dev/null

# Install Yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update > /dev/null && apt-get install yarn -qq > /dev/null

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
FROM ubuntu:20.04 AS runner

RUN apt-get update > /dev/null && apt-get install curl -qq > /dev/null

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install nodejs -qq > /dev/null

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