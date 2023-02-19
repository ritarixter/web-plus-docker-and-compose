
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS node
WORKDIR /app
RUN npm install pm2 -g
COPY --from=builder /app/package*.json ./
RUN npm i --omit=dev
COPY --from=builder /app/ecosystem.config.js ./ecosystem.config.js
COPY --from=builder /app/dist ./dist/
EXPOSE 3001
CMD ["pm2-runtime", "start", "ecosystem.config.js"]