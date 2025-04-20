FROM node:18-alpine as build

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm ci
RUN cd client && npm ci

# Copy source code
COPY . .

# Build client
RUN npm run client:build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY --from=build /app/client/dist ./client/dist

# Install production dependencies only
RUN npm ci --omit=dev

# Copy server files and built client
COPY server ./server

# Set environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE 5000

# Start the application
CMD ["node", "server/server.js"] 