#   docker build -f apps/backend/Dockerfile -t encodr-backend .

# ============================================================
# Stage 1: build
# ============================================================
FROM node:lts-slim AS build
WORKDIR /repo

COPY package.json package-lock.json ./
COPY apps/backend/package.json ./apps/backend/

RUN npm ci --workspace=backend --include-workspace-root

COPY apps/backend ./apps/backend

RUN npm run build --workspace=backend

# Strip dev dependencies so the runtime image is lean.
RUN npm prune --omit=dev --workspace=backend

# ============================================================
# Stage 2: runtime
# ============================================================
FROM node:lts-slim AS runtime
WORKDIR /repo
ENV NODE_ENV=production

# Download ffmpeg
RUN apt update && apt install ffmpeg -y

# Download aws cli. pick the build matching the image architecture.
RUN apt update && apt install -y unzip curl \
    && case "$(uname -m)" in \
         x86_64)  AWS_ARCH=x86_64 ;; \
         aarch64) AWS_ARCH=aarch64 ;; \
         *) echo "unsupported arch: $(uname -m)" && exit 1 ;; \
       esac \
    && curl "https://awscli.amazonaws.com/awscli-exe-linux-${AWS_ARCH}.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install \
    && rm -rf awscliv2.zip aws

# Bring over only what's needed to RUN (not to build):
COPY --from=build /repo/node_modules             ./node_modules
COPY --from=build /repo/apps/backend/dist         ./apps/backend/dist
COPY --from=build /repo/apps/backend/package.json ./apps/backend/
# Prisma schema is handy at runtime for migrations / introspection.
COPY --from=build /repo/apps/backend/prisma       ./apps/backend/prisma

WORKDIR /repo/apps/backend
EXPOSE 3000

# Default command = the API. worker / sqs-consumer override this in compose.
CMD ["node", "./dist/app.js"]
