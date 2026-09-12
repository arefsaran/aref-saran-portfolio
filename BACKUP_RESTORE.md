# Backup and Restore

MongoDB and `/app/uploads` are both required. Store encrypted backups outside the application host and test restoration regularly.

## Backup

```sh
mkdir -p backups/<timestamp>/uploads
docker compose exec -T mongo mongodump --db arefsaran --archive=/tmp/arefsaran.archive.gz --gzip
docker compose cp mongo:/tmp/arefsaran.archive.gz backups/<timestamp>/arefsaran.archive.gz
docker compose cp web:/app/uploads/. backups/<timestamp>/uploads
sha256sum backups/<timestamp>/arefsaran.archive.gz > backups/<timestamp>/SHA256SUMS
```

## Restore

Restore into isolation first. `--drop` is destructive and must target the intended restoration database.

```sh
sha256sum -c backups/<timestamp>/SHA256SUMS
docker compose cp backups/<timestamp>/arefsaran.archive.gz mongo:/tmp/restore.archive.gz
docker compose exec -T mongo mongorestore --drop --gzip --archive=/tmp/restore.archive.gz
docker compose cp backups/<timestamp>/uploads/. web:/app/uploads
curl --fail http://127.0.0.1:4173/ready
```

Verify admin, settings, counts, a published article, media records, and files. On 2026-09-12 this was executed against disposable containers: Mongo and upload markers were deleted, restored, read successfully, and `/ready` stayed 200.

