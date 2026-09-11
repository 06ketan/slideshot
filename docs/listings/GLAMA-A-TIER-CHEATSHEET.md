# Glama Build Spec — Exact JSON Values for All 3 Servers

## How the form works (key insight)

Glama's base image (`debian:trixie-slim` default) **already has pre-installed**:
- Node.js (default 25)
- Python (default 3.14, but uv lets you switch)
- `mcp-proxy@6.4.3`
- `uv` + `pnpm`
- `git` + `curl` + `ca-certificates`

So you do **NOT** need to install Node, Python, uv, mcp-proxy, or git. Just install your project deps + state the run command.

The form takes **JSON arrays/objects** in every field. Copy-paste exactly as shown below.

---

## Server 1 — substack-ops

### URL
https://glama.ai/mcp/servers/06ketan/substack-ops/admin/dockerfile

### Form values (paste each into its field)

**Base image**: `debian:trixie-slim` (default — leave alone)

**Node.js version**: `25` (default — leave alone)

**Python version**: `3.12`

> ⚠️ Change Python from default `3.14` to `3.12`. Your `pyproject.toml` requires `>=3.12` and was tested on 3.12. The build will *probably* work on 3.14 but the previous attempt's build log warned about uv version mismatch — sticking to 3.12 is safer.

**Build steps** (paste this exact JSON):

```json
["uv sync --extra mcp"]
```

**CMD arguments** (paste this exact JSON):

```json
["mcp-proxy", "--", "uv", "run", "substack-ops", "mcp", "serve"]
```

**Environment variables JSON schema** (paste this exact JSON):

```json
{
  "type": "object",
  "properties": {
    "SUBSTACK_PUBLICATION_URL": {
      "type": "string",
      "description": "Your Substack publication URL (e.g. https://you.substack.com/)"
    },
    "SUBSTACK_USER_ID": {
      "type": "string",
      "description": "Your Substack numeric user id"
    },
    "SUBSTACK_SESSION_TOKEN": {
      "type": "string",
      "description": "Substack session cookie value (the s%3A... string)",
      "format": "password"
    },
    "SUBSTACK_OPS_LLM_CMD": {
      "type": "string",
      "description": "Override LLM command for daemon mode (default auto-detects claude/cursor-agent/codex)"
    }
  },
  "required": []
}
```

**Placeholder parameters** (paste this exact JSON):

```json
{
  "SUBSTACK_OPS_LLM_CMD": "claude"
}
```

**Pinned commit SHA**: leave empty (or current head)

### Action
Click **Build** to test (cheaper, doesn't auto-release). If it goes green, then click **Build & Release** with version `0.3.4`.

---

## Server 2 — medium-ops

### URL
https://glama.ai/mcp/servers/06ketan/medium-ops/admin/dockerfile

### Form values

**Base image**: `debian:trixie-slim` (default)

**Node.js version**: `25` (default)

**Python version**: `3.12`

**Build steps**:

```json
["uv sync --extra mcp"]
```

**CMD arguments**:

```json
["mcp-proxy", "--", "uv", "run", "medium-ops", "mcp", "serve"]
```

**Environment variables JSON schema**:

```json
{
  "type": "object",
  "properties": {
    "MEDIUM_INTEGRATION_TOKEN": {
      "type": "string",
      "description": "Legacy Medium Integration Token (api.medium.com/v1). Medium stopped issuing in 2023.",
      "format": "password"
    },
    "MEDIUM_SID": {
      "type": "string",
      "description": "Medium 'sid' cookie from medium.com Application -> Cookies. Used for authenticated reads + GraphQL.",
      "format": "password"
    },
    "MEDIUM_UID": {
      "type": "string",
      "description": "Medium 'uid' cookie. Required alongside sid for some authenticated endpoints."
    },
    "MEDIUM_XSRF": {
      "type": "string",
      "description": "Medium 'xsrf' cookie. Required for any dashboard write (post_response, publish_post, delete_post).",
      "format": "password"
    },
    "MEDIUM_USERNAME": {
      "type": "string",
      "description": "Your Medium handle (without the @). Required for the public RSS read path."
    },
    "MEDIUM_OPS_LLM_CMD": {
      "type": "string",
      "description": "Override LLM command for bulk mode (default auto-detects claude/cursor-agent/codex)"
    }
  },
  "required": []
}
```

**Placeholder parameters**:

```json
{
  "MEDIUM_OPS_LLM_CMD": "claude"
}
```

### Action
Click **Build** to test. If green, **Build & Release** with version `0.1.1`.

---

## Server 3 — slideshot

### URL
https://glama.ai/mcp/servers/06ketan/slideshot/admin/dockerfile

### Form values

**Base image**: `debian:trixie-slim` (default — important: keep this, NOT `node:22-slim`. Glama's base already has Node 25 baked in.)

**Node.js version**: `25` (default)

**Python version**: `3.14` (default, doesn't matter — slideshot is Node)

**Build steps**:

```json
["apt-get update && apt-get install -y --no-install-recommends chromium fonts-liberation libnss3 libxss1 libgbm1 && rm -rf /var/lib/apt/lists/*", "npm install -g slideshot-mcp@latest"]
```

> Two steps: install system Chromium + fonts so Puppeteer can launch headless, then install slideshot-mcp from npm.

**CMD arguments**:

```json
["mcp-proxy", "--", "slideshot-mcp"]
```

**Environment variables JSON schema**:

```json
{
  "type": "object",
  "properties": {
    "PUPPETEER_EXECUTABLE_PATH": {
      "type": "string",
      "description": "Path to Chromium binary. Set to /usr/bin/chromium so Puppeteer uses the system browser instead of downloading its bundled Chromium."
    },
    "PUPPETEER_SKIP_DOWNLOAD": {
      "type": "string",
      "description": "Set to 'true' to skip Puppeteer's bundled-Chromium download (we use system chromium installed via apt)."
    }
  },
  "required": []
}
```

**Placeholder parameters**:

```json
{
  "PUPPETEER_EXECUTABLE_PATH": "/usr/bin/chromium",
  "PUPPETEER_SKIP_DOWNLOAD": "true"
}
```

### Action
Click **Build** (this will be slow ~90-120s, Chromium install is heavy). If green, **Build & Release** with version `4.4.0`.

---

## After all 3 are built + released

### Cross-link related servers

- https://glama.ai/mcp/servers/06ketan/substack-ops/related-servers → add `medium-ops` + `slideshot`
- https://glama.ai/mcp/servers/06ketan/medium-ops/related-servers → add `substack-ops` + `slideshot`
- https://glama.ai/mcp/servers/06ketan/slideshot/related-servers → add `substack-ops` + `medium-ops`

### Seed usage counter

Open each server's main page → click **Try in Browser** → run any read-only tool once.

---

## What to expect on the test detail page

After clicking Build, watch the page. You should see:

1. **Docker build logs** (what's already shown on previous failures) — this is the build phase
2. **Instance logs** — this is when mcp-proxy starts your server. You want to see something like:
   ```
   transport event { type: 'open' }
   listing tools...
   tools/list returned: 26 tools
   ```
3. Green ✓ on **all** of:
   - Build container image
   - Start server
   - Respond to ping
   - List tools

If you see "Connection closed" or "Expected server to respond to ping" → the CMD is wrong. Don't release; tell me what the logs show.

---

## TDQS sanity-check before clicking "Make Release"

After Build succeeds, the test detail page lists every tool that was introspected with its description. **Eyeball them**:

- ❌ Empty description → tool will score F → drag your overall Quality grade down
- ❌ Description under 40 chars → low score on Conciseness & Structure
- ❌ Parameter without description → low score on Parameter Semantics

If anything looks bad, **don't click Make Release yet** — releases lock in the TDQS score. Patch the docstring in code, push to main, re-run Build, then release.

I can audit your tool docstrings ahead of time if you want — would catch any landmines before you click Release.

---

## Common pitfalls (seen on test 019de8b7 for substack-ops)

| Symptom | Cause | Fix |
|---|---|---|
| `[mcp-proxy] ignoring non-JSON output [Usage: ...]` then `Connection closed` | CMD ran `substack-ops` (no subcommand) → printed help and exited | Add `mcp serve` to CMD arguments |
| `tools/list returned 0 tools` | `mcp` SDK not installed → server fell back to dispatcher mcp-proxy can't talk to | Add `--extra mcp` to `uv sync` |
| `uv-build version mismatch warning` | pyproject restricts uv-build < 0.11 but Glama has 0.11.8 | Cosmetic only; build still works. Defer fix. |
| Chromium not found (slideshot) | apt didn't install chromium in build steps | Make sure `apt-get install ... chromium` is the FIRST build step |

---

## Reference: Glama's auto-baked tools in the base image

You don't need to install these — they're already in `debian:trixie-slim` after Glama's preprocessing:

- `node` (v25)
- `npm`, `pnpm` (v10.14.0)
- `mcp-proxy` (v6.4.3)
- `uv` (v0.11.8)
- `python` (v3.14, switchable via `Python version` field)
- `git`, `curl`, `ca-certificates`

This is why the build steps + CMD can be so concise.
