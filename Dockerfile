# Building the application
FROM public.ecr.aws/docker/library/node:22-alpine AS build
WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn run build

# Clean up: remove devDependencies, source files, and build artifacts
RUN rm -rf node_modules && \
    yarn install --frozen-lockfile --production && \
    rm -rf src tsconfig*.json nest-cli.json eslint.config.mjs jest.config.js && \
    find . -name "*.spec.ts" -delete && \
    find . -name "__mocks__" -type d -exec rm -rf {} + 2>/dev/null || true && \
    yarn cache clean

# Production image
FROM public.ecr.aws/docker/library/node:22-alpine

# Install dumb-init and timezone data (keep tzdata for timezone support)
RUN apk add --no-cache dumb-init tzdata && \
    cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
    echo "America/Sao_Paulo" > /etc/timezone

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /usr/src/app

# Copy only necessary files from build stage
COPY --from=build --chown=nodejs:nodejs /usr/src/app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /usr/src/app/package.json ./package.json

EXPOSE 3000

USER nodejs

CMD ["dumb-init", "node", "dist/main.js"]