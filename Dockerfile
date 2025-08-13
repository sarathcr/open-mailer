# ---- Base Stage: Build the application ----
FROM node:18-alpine AS base
WORKDIR /app

# Copy dependency definition files
COPY package.json yarn.lock ./
# Copy all source code
COPY . .

# Enable yarn
RUN corepack enable

# Install all dependencies to build the project
RUN yarn install --immutable

# Build all workspaces (if any) and the main app
RUN yarn build


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