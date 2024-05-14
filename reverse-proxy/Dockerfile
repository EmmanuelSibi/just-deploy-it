# Stage 1: Base Image
FROM node:18-alpine AS base

# Stage 2: Builder
FROM base AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install && npx prisma generate

# Copy your project code
COPY . .

# Stage 3: Runner
FROM base AS runner

# Set working directory
WORKDIR /app

# Copy application from installer stage
COPY --from=builder /app .

# Start the server (replace 'your-app.js' with your actual entry point)
CMD ["node", "index.js"]


