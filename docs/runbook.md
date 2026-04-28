# INTRADEBAS Runbook

## Health Checks

- Frontend: `curl -f http://localhost:3000/api/health`
- Backend: `curl -f http://localhost:4000/api/v1/health`
- Database: `docker exec intradebas-db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"`
- Redis: `docker exec intradebas-redis redis-cli ping`
- MinIO: `docker exec intradebas-minio mc ready local`

## Deploy

1. Pull the target branch in the deployment directory.
2. Run `docker compose -f docker-compose.prod.yml up -d --build`.
3. Run `docker exec intradebas-backend npm run prisma:migrate:deploy`.
4. Check backend health before releasing traffic.

## Logs

- Backend logs: `docker logs intradebas-backend --tail 200`
- Frontend logs: `docker logs intradebas-frontend --tail 200`
- Nginx logs: `docker logs intradebas-nginx --tail 200`
- All services: `docker compose -f docker-compose.prod.yml logs --tail 200`

Production compose uses `json-file` log rotation with `10m` files and `5` retained files per service.

## Common Recovery

- Backend unhealthy after deploy: check `DATABASE_URL`, Redis/MinIO credentials, then run `docker logs intradebas-backend --tail 200`.
- Prisma migration failure: do not run `db push` in production; inspect the failed migration and rerun `npm run prisma:migrate:deploy` after correction.
- Ranking not updating live: check Redis health and backend logs for Pub/Sub warnings.
- Media upload failure: verify MinIO health, bucket bootstrap, and `MINIO_BUCKET` in `.env`.
- Login failure after seed/reset: verify the admin user exists and is active in the `users` table.

## Validation Commands

- Backend tests: `cd backend && npm test`
- Backend build: `cd backend && npm run build`
- Frontend build: `cd frontend && npm run build`
- Frontend E2E: `cd frontend && npm run test:e2e`
- Prisma schema: `cd backend && DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy npx prisma validate`
