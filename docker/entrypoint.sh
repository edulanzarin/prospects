#!/bin/sh
set -e

UPLOADS_DIR="${UPLOADS_DIR:-/app/uploads}"
mkdir -p "$UPLOADS_DIR"
chown -R nextjs:nodejs "$UPLOADS_DIR"

echo "[entrypoint] Aplicando migrations..."
su-exec nextjs npx prisma migrate deploy

echo "[entrypoint] Rodando seed (idempotente)..."
su-exec nextjs npx prisma db seed

echo "[entrypoint] Iniciando servidor..."
exec su-exec nextjs node server.js
