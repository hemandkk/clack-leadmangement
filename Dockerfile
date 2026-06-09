# ----------------------------
# Base
# ----------------------------
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# ----------------------------
# Dependencies
# ----------------------------
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps/web/package.json ./apps/web/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/validators/package.json ./packages/validators/
COPY packages/ui/package.json ./packages/ui/

RUN pnpm install --frozen-lockfile

# ----------------------------
# Builder
# ----------------------------
FROM deps AS builder

WORKDIR /app

COPY . .

RUN pnpm turbo build --filter=web

# ----------------------------
# Runner
# ----------------------------
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S nextjs
RUN adduser -S nextjs -G nextjs

USER nextjs

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 3000

ENV PORT=3000

CMD ["node", "apps/web/server.js"]

#Build locally
#docker build -t clack-web .
#docker run -p 3000:3000 clack-web



#old docker setup
#FROM node:20-alpine AS base

#RUN corepack enable

#WORKDIR /app

#COPY . .

#RUN pnpm install --frozen-lockfile

#RUN pnpm turbo build --filter=web

#EXPOSE 3000

#CMD ["pnpm", "--filter", "web", "start"]