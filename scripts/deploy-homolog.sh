#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${HOMOLOG_ENV_FILE:-$ROOT_DIR/.env.homolog}"
COMPOSE_FILE="${HOMOLOG_COMPOSE_FILE:-$ROOT_DIR/docker-compose.homolog.yml}"
BRANCH="${HOMOLOG_BRANCH:-homolog}"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-intradebas-homolog}"
BACKEND_PORT="${HOMOLOG_BACKEND_PORT:-14000}"
HEALTH_URL="${HOMOLOG_API_HEALTH_URL:-http://127.0.0.1:${BACKEND_PORT}/api/v1/health}"
RUN_SEED_ON_DEPLOY="${RUN_SEED_ON_DEPLOY:-false}"

require_file() {
  local path="$1"

  if [[ ! -f "$path" ]]; then
    echo "Required file not found: $path" >&2
    exit 1
  fi
}

require_file "$ENV_FILE"
require_file "$COMPOSE_FILE"

cd "$ROOT_DIR"

echo "Updating repository branch $BRANCH..."
git fetch origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "Building application images..."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" build backend frontend

echo "Starting stateful services..."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d db redis minio

echo "Bootstrapping MinIO bucket..."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up --no-deps minio-init

echo "Synchronizing Prisma client and schema..."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm backend npm run prisma:generate
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm backend npm run prisma:migrate:deploy

if [[ "$RUN_SEED_ON_DEPLOY" == "true" ]]; then
  echo "Running seed because RUN_SEED_ON_DEPLOY=true..."
  docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" run --rm backend npm run prisma:seed
fi

echo "Starting application services..."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d backend frontend

echo "Waiting for health check..."
sleep 5
curl --fail --silent --show-error "$HEALTH_URL" >/dev/null

echo "Homolog deployment completed successfully."
docker compose --project-name "$PROJECT_NAME" --env-file "$ENV_FILE" -f "$COMPOSE_FILE" ps
