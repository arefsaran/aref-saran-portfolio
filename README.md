# Aref Saran — Personal Portfolio

Production-ready static portfolio for `arefsaran.ir`, served by Nginx in a small Docker image.

## Architecture decision

The site deliberately uses semantic HTML, CSS, and a small progressive-enhancement script instead of a JavaScript framework. It has no authentication, API, database, or content-management requirement. A zero-build static implementation gives you:

- fewer dependencies and supply-chain risks;
- faster builds and smaller images;
- lower memory consumption on Hamravesh;
- simpler deployment and rollback;
- better baseline performance;
- easier maintenance.

A framework can be added later only when the site gains a real application requirement.

## Public positioning decisions

- The current employer is not named.
- The public phone number is omitted.
- The uploaded résumé is not published because its current-employer wording needs updating and it exposes a personal phone number.
- Case studies are generalized to avoid exposing company-confidential implementation details.
- LinkedIn: `https://linkedin.com/in/arefsaran`
- GitHub: `https://github.com/arefsaran`

## Preview locally

From the project directory:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Automated UI quality checks

Development-only Playwright and axe checks cover the core page load, the interactive automation demo, keyboard navigation, WCAG A/AA issues, reduced-motion behavior, and horizontal overflow from 320px through desktop widths.

```bash
npm install
npm test
```

The local suite uses an installed Chrome browser. CI installs its own isolated Chromium runtime before running the same checks.

## Test with Docker

```bash
docker build -t aref-saran-portfolio .
docker run --rm -p 8080:80 aref-saran-portfolio
```

Open `http://localhost:8080`.

## Push to GitHub

Create an empty repository named `aref-saran-portfolio` under the `arefsaran` account, then run:

```bash
git init
git add .
git commit -m "Create personal portfolio"
git branch -M main
git remote add origin git@github.com:arefsaran/aref-saran-portfolio.git
git push -u origin main
```

HTTPS alternative:

```bash
git remote add origin https://github.com/arefsaran/aref-saran-portfolio.git
```

## Deploy on Hamravesh Darkube

In the Hamravesh console:

1. Create a new application.
2. Select **Git source**.
3. Connect GitHub and select `arefsaran/aref-saran-portfolio`.
4. Select branch `main`.
5. Set the Dockerfile path to `Dockerfile`, or leave the repository-root default.
6. Set the service/application port to `80`.
7. No database, persistent disk, worker, or environment variables are required.
8. Select the smallest suitable application plan.
9. Create/deploy the application and wait for the image build to pass.
10. Add a temporary `darkube.app` address and verify the website before changing DNS.

The application must use port `80`, matching the Nginx configuration and `EXPOSE 80`.

## Connect `arefsaran.ir`

Use the exact DNS target shown by Darkube for your application. Never copy a DNS target from another project.

Recommended rollout:

1. Add `www.arefsaran.ir` as a personal domain in the Darkube application.
2. In the domain DNS panel, create the CNAME record requested by Darkube for `www`.
3. Verify `https://www.arefsaran.ir` after DNS propagation.
4. Add `arefsaran.ir` to Darkube as a second domain if the console supports the root domain.
5. Configure the root domain using the exact record Darkube displays. Root-domain CNAME support differs by DNS provider; use ALIAS/ANAME only when your provider supports it.
6. Select one canonical address and redirect the other. The website metadata currently uses `https://arefsaran.ir/` as canonical.
7. Enable the SSL certificate and HTTPS redirect from the domain section.

DNS changes can take several minutes or hours to propagate.

## Verification checklist

- Hamravesh build is successful.
- The app responds on port 80.
- The Darkube temporary domain loads over HTTPS.
- `arefsaran.ir` and `www.arefsaran.ir` resolve as intended.
- HTTPS redirect is enabled.
- LinkedIn, GitHub, and email links work.
- Portrait and social preview image load.
- Mobile layout works at 360px width.
- Browser console contains no errors.
- `/robots.txt` and `/sitemap.xml` load.

## Content maintenance

- Page content: `index.html`
- Visual styling: `styles.css`
- Progressive interactions: `script.js`
- Browser quality suite: `tests/portfolio.spec.mjs`
- Nginx and security headers: `nginx.conf`
- Hamravesh container: `Dockerfile`

Before publishing a downloadable résumé, create a current public version that:

- does not name the current employer;
- does not expose the phone number unless intentional;
- uses accurate dates;
- removes confidential internal details;
- uses the same professional positioning as the website.
