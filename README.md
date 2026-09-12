# arefsaran.ir — Test Engineering Portfolio + Publishing CMS

`arefsaran.ir` is Aref Saran's Test Engineering portfolio and canonical technical publishing platform. The public site focuses on engineering evidence; the private `/admin` area manages articles, LinkedIn derivatives, case studies, projects, videos, media, and content export.

## Architecture decision

The original repository was a static Nginx site. The new admin/CMS requirement is a real application requirement, so the public design is preserved while the runtime changes to **Node.js + Express + EJS + MongoDB**.

Why MongoDB here:

- the related `learninggerman.ir` project already uses MongoDB operationally;
- article documents contain nested metadata, revisions, LinkedIn fields, and relations;
- MongoDB avoids adding a native SQLite dependency to the existing JavaScript deployment;
- `connect-mongo` stores authenticated sessions server-side;
- the application remains portable to a managed MongoDB service or a Docker volume.

## Public information architecture

- `/` — Test Engineering homepage
- `/articles` — canonical long-form engineering articles
- `/articles/:slug` — server-rendered article with SEO/social metadata
- `/case-studies` — generalized engineering case studies
- `/projects` — public/experimental/planned engineering projects
- `/videos` — real published video entries or a truthful empty state
- `https://learninggerman.ir` — secondary German-learning journey

## Admin CMS

- `/admin/login`
- `/admin`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/:id`
- `/admin/media`
- `/admin/taxonomy`
- `/admin/case-studies`
- `/admin/projects`
- `/admin/videos`
- `/admin/export/content.json`

### Article workflow

`draft → scheduled → published → archived`

A background scheduler checks once per minute and publishes due scheduled articles while the application process is running.

Each article supports:

- title, slug, subtitle, excerpt, Markdown body;
- cover image, tags, series, featured state, language;
- publication and scheduled timestamps;
- SEO title, meta description, canonical URL, OG image;
- LinkedIn hook, summary, key points, CTA, hashtags, status, post URL/date;
- optional German summary;
- private internal notes;
- up to 20 previous text revisions;
- safe public Markdown rendering;
- private admin preview;
- JSON and Markdown export.

### LinkedIn workflow

The website remains canonical:

`Article → deterministic LinkedIn draft → review/edit → copy → publish manually`

Direct LinkedIn OAuth/publishing is intentionally not enabled in v1. This avoids unnecessary token/API complexity and keeps AI/automation from publishing unreviewed content.

## Security controls

- server-side admin authorization;
- bcrypt password hashing;
- Mongo-backed sessions;
- HttpOnly, SameSite cookies; Secure cookies in production;
- session regeneration after successful sign-in;
- CSRF protection via Lusca;
- login rate limiting;
- Helmet security headers and CSP;
- Markdown/HTML sanitization;
- `javascript:` URL removal;
- upload MIME allowlist plus image magic-byte verification;
- no SVG upload support;
- upload size limit;
- private previews require an authenticated admin session;
- admin pages use `noindex`;
- no secrets in the repository.

## Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Required production values:

```dotenv
NODE_ENV=production
PORT=4173
BASE_URL=https://arefsaran.ir
MONGODB_URI=mongodb://...
SESSION_SECRET=<at-least-32-random-characters>
ADMIN_EMAIL=arefsaran@gmail.com
ADMIN_PASSWORD=<temporary-bootstrap-password>
UPLOAD_DIR=/app/uploads
MAX_UPLOAD_MB=5
TRUST_PROXY=1
```

`ADMIN_PASSWORD` is used only by the admin bootstrap script. After creating/updating the admin, remove it from the runtime environment if your deployment platform permits that separation.

## Install

```bash
npm install
```

## Create the admin

Ensure MongoDB is reachable, then:

```bash
npm run admin:create
```

The command hashes the password before storage and upserts the configured admin email.

To migrate the three generalized case studies already present in the original static portfolio into CMS-managed records:

```bash
npm run seed:portfolio
```

The seed is idempotent by slug and does not create fake articles, projects, or videos.

## Run locally

Start MongoDB, then:

```bash
npm start
```

Open:

- Public site: `http://127.0.0.1:4173`
- Admin: `http://127.0.0.1:4173/admin/login`

## Docker Compose

```bash
export SESSION_SECRET='replace-with-a-long-random-secret'
docker compose up --build -d
export ADMIN_PASSWORD='replace-with-a-strong-bootstrap-password'
docker compose exec -e ADMIN_PASSWORD="$ADMIN_PASSWORD" web npm run admin:create
```

Persistent volumes:

- `mongo-data` — MongoDB documents and sessions
- `uploads` — uploaded article/media images

## Backups

Back up **both** MongoDB and uploaded media.

Mongo example:

```bash
mongodump --uri "$MONGODB_URI" --archive=arefsaran-$(date +%F).archive --gzip
```

Restore example:

```bash
mongorestore --uri "$MONGODB_URI" --archive=arefsaran-YYYY-MM-DD.archive --gzip --drop
```

Also copy the persistent upload volume/object-storage bucket. A database backup without uploaded images is incomplete.

Admin content can additionally be exported from:

`/admin/export/content.json`

Each article can be exported individually as Markdown.

## Testing

Unit tests:

```bash
npm test
```

Browser tests:

```bash
npm run test:e2e
```

The Playwright test server uses `mongodb-memory-server` and seeds a test-only admin/article. Browser tests cover:

- Germany-focused Test Engineering homepage positioning;
- exact `https://learninggerman.ir` link;
- public article rendering;
- responsive overflow checks;
- automated WCAG A/AA scanning;
- anonymous admin rejection;
- admin sign-in;
- article creation/persistence/private preview/publication;
- stored-XSS sanitization;
- deterministic LinkedIn draft generation.

Quality commands:

```bash
npm run lint
npm run format:check
npm run verify
```

## Content safety checklist

Before publishing company-derived Test Engineering material, verify:

- no production URLs;
- no credentials/tokens;
- no customer data;
- no private database schema;
- no proprietary business rule that should remain confidential;
- no internal screenshot;
- synthetic/anonymized example data;
- numerical metrics are verified and permitted to publish;
- employer attribution is permitted.

## learninggerman.ir integration

`arefsaran.ir` links to `https://learninggerman.ir` as a secondary Germany-career journey. The provided `learninggerman.ir` repository has also been updated with a reciprocal `https://arefsaran.ir` Test Engineering portfolio link.

The relationship is intentionally asymmetric:

`arefsaran.ir → engineering identity → German learning → learninggerman.ir`

The German platform does not replace the engineering portfolio.

## Deployment notes

The previous Docker image was Nginx-only. That runtime cannot host authenticated CMS routes, MongoDB sessions, Markdown publication, or media uploads. The new Dockerfile runs the Node application on port `4173`.

For Hamravesh/Darkube or another container host:

1. build the repository Dockerfile;
2. expose application port `4173`;
3. attach/provide a persistent MongoDB service;
4. provide persistent storage for `/app/uploads` or replace local upload storage with object storage;
5. set `BASE_URL=https://arefsaran.ir`;
6. use a strong `SESSION_SECRET`;
7. set `TRUST_PROXY=1` when HTTPS terminates at the platform proxy;
8. run `npm run admin:create` once against production MongoDB;
9. verify `/health`;
10. verify `/admin` redirects anonymous users to `/admin/login`;
11. publish a draft article and verify private preview before public publication;
12. verify `robots.txt`, `/sitemap.xml`, article OG metadata, and the German-learning link.

## Important remaining production decision

Local filesystem uploads require a persistent volume. If the production platform does not guarantee persistent writable storage, move media to S3-compatible object storage before relying on uploads. Do not deploy local uploads on ephemeral container storage.
