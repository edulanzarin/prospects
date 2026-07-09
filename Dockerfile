# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl su-exec
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# prisma/seed.ts é executado via tsx a partir do código-fonte (não do bundle
# do Next), então o Prisma Client gerado precisa existir aqui também.
COPY --from=builder /app/src/generated/prisma ./src/generated/prisma
COPY docker/entrypoint.sh ./docker/entrypoint.sh
# sed remove CRLF caso o build parta de um checkout Windows — com \r no
# shebang o exec falha com "no such file or directory".
RUN sed -i 's/\r$//' ./docker/entrypoint.sh && chmod +x ./docker/entrypoint.sh && chown -R nextjs:nodejs /app

# Continua como root: o entrypoint ajusta a permissão do volume de uploads e
# então baixa privilégio para o usuário "nextjs" antes de rodar a aplicação.
EXPOSE 3000

ENTRYPOINT ["./docker/entrypoint.sh"]
