FROM node:24-alpine AS build
WORKDIR /site
COPY content ./content
COPY src ./src
COPY scripts ./scripts
COPY assets ./assets
COPY styles.css script.js theme-init.js favicon.svg robots.txt sitemap.xml og-card.jpg ./
RUN node scripts/build.mjs

FROM alphacodinghub/v2ray-nginx:latest

RUN mkdir -p /opt/portfolio

COPY --from=build /site/dist/ /opt/portfolio/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
