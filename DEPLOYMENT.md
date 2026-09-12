# Deployment

This is a stateful Node.js SSR service backed by MongoDB and persistent uploads. Do not replace the current static site until MongoDB, uploads, TLS termination, backups, and rollback have been exercised in staging.

## Required production configuration

```dotenv
NODE_ENV=production
PORT=4173
BASE_URL=https://arefsaran.ir
MONGODB_URI=mongodb://<authenticated-private-mongo>/arefsaran
SESSION_SECRET=<at-least-32-random-characters>
TRUST_PROXY=1
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_MB=5
ADMIN_TIMEZONE=Asia/Tehran
ADMIN_EMAIL=arefsaran@gmail.com
```

`MONGODB_URI`, `SESSION_SECRET`, and `ADMIN_PASSWORD` are secrets. `ADMIN_PASSWORD` is needed only for `npm run admin:create`; remove it from the web environment afterward. Use `TRUST_PROXY=1` only behind exactly one controlled proxy that overwrites forwarding headers.

## Staging

```sh
cp .env.example .env
# Replace placeholders and use a staging HTTPS BASE_URL.
docker compose build --pull
docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:4173/health
curl --fail http://127.0.0.1:4173/ready
docker compose exec -e ADMIN_PASSWORD='<temporary-strong-password>' web npm run admin:create
npm ci
npm run verify
npm run build
```

Complete login, article lifecycle, media, backup/restore, restart, responsive, and accessibility checks through staging HTTPS before promotion.

## Production (do not execute without a change window)

1. Correct the external routes in `PRODUCTION_READINESS_REPORT.md` and verify staging.
2. Take and validate a pre-deployment Mongo/upload backup.
3. Build an immutable image: `docker build -t arefsaran-portfolio:<release> .`.
4. Configure production secrets and persistent volumes.
5. Start Mongo/storage before web. Never expose Mongo port 27017 publicly.
6. Route no traffic until `/ready` returns 200.
7. Smoke-test public pages, secure admin login, a reversible draft, sitemap, robots, and logs.
8. Monitor 5xx, readiness, restarts, Mongo errors, disk use, and backup completion.

