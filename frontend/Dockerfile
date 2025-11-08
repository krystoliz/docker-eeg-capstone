# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install

# 2. Build the app
# (This stage is the same)
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Run the app (NEW 'standalone' way)
FROM node:18-alpine AS runner
WORKDIR /app

# Set environment for production
ENV NODE_ENV=production

# Copy only the necessary files from the 'builder' stage
# This is much, much smaller than the full .next folder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Run the standalone server
CMD ["node", "server.js"]