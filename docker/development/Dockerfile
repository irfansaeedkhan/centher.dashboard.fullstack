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

COPY . .

CMD ["yarn", "dev"]