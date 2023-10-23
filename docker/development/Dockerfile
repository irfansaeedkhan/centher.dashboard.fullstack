# 1. Install dependencies and build app
FROM node:18.18.2-bullseye AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* ./
RUN yarn --frozen-lockfile

COPY . .

CMD ["yarn", "dev"]