# Privacy Policy — Slideshot MCP Server

**Last updated:** March 16, 2026

## Overview

Slideshot MCP (`slideshot-mcp`) is a local MCP server that converts HTML into high-resolution PNG, WebP, and PDF images using Puppeteer. It runs entirely on your machine — no data is sent to external servers by the tool itself.

## Data Collection

Slideshot MCP **does not collect, transmit, or store any user data** on remote servers. All processing happens locally on the user's device.

## Data Retention

- Input HTML is processed in-memory and discarded after rendering.
- Output files (PNG, WebP, PDF) are saved to a directory you specify and remain on your local filesystem.
- No logs, analytics, or telemetry are collected.

## Third-Party Services

When rendering HTML, the tool launches a local Chromium browser instance via Puppeteer. If your HTML references external resources (e.g., Google Fonts via `<link>` tags, external images), those requests are made by the browser and subject to the respective service's privacy policy:

- **Google Fonts** — [Google Privacy Policy](https://policies.google.com/privacy)

The MCP server itself makes no network requests.

## Data Sharing

No data is shared with third parties.

## Security

- The server communicates exclusively via stdio (standard input/output) with the MCP client.
- No HTTP server is started; no ports are opened.
- The tool only writes files to the output directory you explicitly provide.

## Children's Privacy

This tool does not knowingly collect any information from anyone, including children under 13.

## Changes to This Policy

Updates will be posted to this file in the [GitHub repository](https://github.com/06ketan/slideshot/blob/main/PRIVACY.md).

## Contact

For privacy questions or concerns:

- **GitHub Issues:** [github.com/06ketan/slideshot/issues](https://github.com/06ketan/slideshot/issues)
- **Author:** Ketan Chavan
