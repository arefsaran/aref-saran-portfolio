# Security Notes

Verified controls include bcrypt hashes; session rotation and destruction; Mongo sessions; production `HttpOnly`, `SameSite=Lax`, and `Secure` cookies; global CSRF; admin authorization; login rate limiting; escaped EJS; sanitized Markdown; safe URLs and JSON-LD; upload MIME/signature/size checks; generated filenames; reference-aware deletion; Helmet headers; and production fail-fast configuration.

Deployment constraints:

- Keep Mongo private and authenticated. Local Compose publishes no Mongo host port but is not a production credential configuration.
- `TRUST_PROXY=1` assumes exactly one controlled proxy.
- CSP still permits inline scripts/styles because audited views use them; removing this is P2 hardening requiring regression tests.
- No analytics exist. The public site sets no tracking cookie. Admin authentication uses a session cookie. Video listings link to YouTube rather than eagerly embedding it.
- Never log environment values, request bodies, passwords, session IDs, or Mongo URIs.

