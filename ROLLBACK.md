# Rollback

This release has no database schema migration. Mongo documents and uploads are compatible with the immediately preceding stateful-CMS image; the old static-only image cannot serve CMS data.

1. Stop new traffic or enable maintenance at the proxy.
2. Capture an incident-time Mongo/upload backup without overwriting the pre-deployment backup.
3. Replace only the web image with the previous verified stateful-CMS tag. Preserve Mongo and upload volumes.
4. Start web and wait for `/ready` to return 200.
5. Verify admin authentication, a published article, media, and sessions.
6. Restore traffic and retain both backups for reconciliation.

If a future release migrates data incompatibly, restore into a separate database first and validate before switching. Never use `docker compose down -v` during rollback.

