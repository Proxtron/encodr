# Backend image for the encodr monorepo.
#
# IMPORTANT: build from the REPO ROOT, not from apps/backend, because the
# lockfile + hoisted node_modules live at the root:
#
#   docker build -f apps/backend/Dockerfile -t encodr-backend .
#                                                              ^ the "." is the
#                                                                build context
#                                                                = repo root
#
# One image. The api / worker / sqs-consumer all run FROM this same image;
# they just start a different file (see docker-compose.yml `command:`).

# ============================================================
# Stage 1: build — has the TypeScript compiler + Prisma CLI.
# This stage is thrown away; only its output is copied forward.
# ============================================================
FROM node:lts-slim AS build
WORKDIR /repo

# Prisma's query engine needs openssl present.
# RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy ONLY manifests first. Docker caches each layer; as long as these files
# don't change, the expensive `npm ci` layer below is reused on rebuilds.
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/

# Deterministic install from the lockfile, limited to the backend workspace
# (+ whatever it shares at the root). `ci` = clean, reproducible install.
RUN npm ci --workspace=backend

# NOW copy source. A code change busts only the layers below this line, not
# the install above — that's why manifests are copied first.
COPY apps/backend ./apps/backend

# `prisma generate && tsc` (defined in apps/backend/package.json).
RUN npm run build --workspace=backend

# Strip dev dependencies (typescript, tsx, etc.) so the runtime image is lean.
RUN npm prune --omit=dev --workspace=backend

# ============================================================
# Stage 2: runtime — no compiler, no dev deps, just node + built JS.
# ============================================================
FROM node:lts-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Bring over only what's needed to RUN (not to build):
COPY --from=build /repo/node_modules             ./node_modules
COPY --from=build /repo/apps/backend/dist         ./apps/backend/dist
COPY --from=build /repo/apps/backend/package.json ./apps/backend/
# Prisma schema is handy at runtime for migrations / introspection.
COPY --from=build /repo/apps/backend/prisma       ./apps/backend/prisma

WORKDIR /repo/apps/backend
EXPOSE 3000

# Default command = the API. worker / sqs-consumer override this in compose.
# Output is dist/app.js (not dist/src/app.js) because tsconfig rootDir = ./src.
CMD ["node", "./dist/app.js"]
