# Verification Evidence

Executed 2026-09-12 with Node v24.18.1/npm 11.16.0; Docker used Node 22 Alpine.

| Check | Result |
|---|---|
| `npm ci --ignore-scripts --no-audit --no-fund` | PASS — deterministic install |
| `npm audit --omit=dev --audit-level=moderate` | PASS — 0 vulnerabilities |
| `npm run format:check`; `npm run lint`; `npm run build` | PASS |
| `npm test` | PASS — 10 tests |
| `npm run test:e2e` | PASS after locator, heading, and contrast corrections |
| Docker build/Compose start | PASS — Mongo and web healthy |
| `/health`; `/ready` | PASS — HTTP 200 |
| Mongo/upload restart | PASS — markers persisted |
| `node scripts/verify-session-persistence.mjs` | PASS — SID rotated and survived restart |
| Mongo/upload backup-delete-restore | PASS — markers recovered |
| learninggerman format/lint/unit/integration/course/build | PASS — 10 + 5 + 3 tests |
| Live HTTPS preflight | FAIL — canonical arefsaran.ir 200; other three hosts 404 |

The first E2E attempt timed out while downloading a 599.7 MB MongoDB test binary. Once cached, actual failures were reproduced and fixed; the download timeout is not a product failure.

Git branch/commits could not be created because `.git` is read-only in this environment. Existing audited working-tree changes were preserved.
