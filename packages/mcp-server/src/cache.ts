// Module-level cache for the single stdio connection.
// Safe because each MCP stdio transport = one connection = one process.

let lastHtml: string | null = null;
let lastHtmlPath: string | null = null;
let discoveryDone = false;
let userApproved = false;

export function cacheHtml(html: string, htmlPath: string): void {
  lastHtml = html;
  lastHtmlPath = htmlPath;
  // New HTML means user hasn't approved this version yet
  userApproved = false;
}

export function getCachedHtml(): { html: string; htmlPath: string } | null {
  if (lastHtml && lastHtmlPath) return { html: lastHtml, htmlPath: lastHtmlPath };
  return null;
}

export function clearCache(): void {
  lastHtml = null;
  lastHtmlPath = null;
  userApproved = false;
}

export function markDiscoveryDone(): void {
  discoveryDone = true;
}

export function isDiscoveryDone(): boolean {
  return discoveryDone;
}

export function resetDiscovery(): void {
  discoveryDone = false;
  userApproved = false;
}

export function markApproved(): void {
  userApproved = true;
}

export function isApproved(): boolean {
  return userApproved;
}
