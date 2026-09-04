FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Cache npm packages across builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Cache Next.js compiler output across builds
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build

CMD [ "npm", "start" ]
