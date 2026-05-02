# Dockerfile for Glama introspection + standalone container deploys.
#
# Image entrypoint runs the slideshot-mcp stdio MCP server.
# - For Glama introspection (initialize + tools/list), no Chromium is needed.
# - For actual rendering (render_slides tool), this image bundles a system
#   Chromium so Puppeteer can launch headless without downloading at runtime.
#
# Why a system Chromium and not Puppeteer's bundled binary:
#   Puppeteer's bundled Chromium fails to extract on alpine/musl and on some
#   Glama runners. We pin to debian-slim's chromium and tell Puppeteer to use
#   it via PUPPETEER_EXECUTABLE_PATH + PUPPETEER_SKIP_DOWNLOAD.

FROM node:22-slim AS base

ENV NODE_ENV=production \
    PUPPETEER_SKIP_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        ca-certificates \
        fonts-liberation \
        fonts-noto-color-emoji \
        libnss3 \
        libxss1 \
        libgbm1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install slideshot-mcp from npm (latest published).
# Using `npm install` (not `-g`) keeps the install hermetic to /app/node_modules.
RUN npm install --omit=dev slideshot-mcp@latest \
    && npm cache clean --force

# Non-root user for safety
RUN useradd --uid 10001 --user-group --create-home --home-dir /home/app app \
    && chown -R app:app /app
USER app

# stdio MCP server — runs the bin shipped by slideshot-mcp
ENTRYPOINT ["npx", "--no-install", "slideshot-mcp"]
