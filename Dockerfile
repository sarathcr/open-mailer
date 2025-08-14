# ---- Base Stage: Build the application ----
FROM node:18-alpine AS base
WORKDIR /app

# Copy all source code and dependency files
COPY . .

# Enable yarn
RUN corepack enable

# 1. Install all dependencies from the lockfile
RUN yarn install --immutable

# 2. Generate Prisma client (now using the installed package)
RUN npx prisma generate

# 3. Build all applications that have a "build" script
RUN yarn workspaces foreach --all run build


# ---- Production Stage: Create the final image ----
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy dependency definition files from the base stage
COPY --from=base /app/package.json /app/yarn.lock ./

# Install ONLY production dependencies
RUN corepack enable && yarn install --production --immutable

# Copy the built application from the base stage
COPY --from=base /app/dist ./dist

# Copy the prisma schema and generate the client for production
# This ensures your production server can talk to the database
COPY --from=base /app/prisma ./prisma
RUN npx prisma generate

# Expose the port your app runs on (NestJS default is 3000)
EXPOSE 3000

# The command to start your application in production
CMD ["node", "dist/main"]