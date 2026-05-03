# LobeHub validation — A-tier cheatsheet for all 3 servers

LobeHub auto-scrapes MCP servers from GitHub + the official MCP Registry,
then runs its own validator against the install snippet it generated. The
validator opens a stdio session, calls `tools/list`, then calls each tool
with empty args. If any of these steps fail, the listing stays in the
**Unvalidated** state and never appears in LobeHub's marketplace search.

This cheatsheet covers what's required to flip each of our three servers
to **Validated** status.

---

## Status snapshot

| Server         | LobeHub URL                                              | Auto-scraped version | Real version | Auto-scraped install snippet            | Correct install snippet           |
|----------------|----------------------------------------------------------|----------------------|--------------|------------------------------------------|------------------------------------|
| `slideshot`    | [lobehub.com/mcp/06ketan-slideshot](https://lobehub.com/mcp/06ketan-slideshot)       | `1.0.0`              | `2.10.x+`    | (varies / wrong)                         | `npx -y slideshot-mcp`             |
| `medium-ops`   | [lobehub.com/mcp/06ketan-medium-ops](https://lobehub.com/mcp/06ketan-medium-ops)     | `0.1.0`              | `0.1.2`      | `npx -y 06ketan-medium-ops` (wrong, this is a Python pkg) | `uvx medium-ops mcp serve`         |
| `substack-ops` | [lobehub.com/mcp/06ketan-substack-ops](https://lobehub.com/mcp/06ketan-substack-ops) | `0.3.0`              | `0.3.5`      | (varies / wrong)                         | `uvx substack-ops mcp serve`       |

---

## How LobeHub's validator works

```mermaid
flowchart LR
    A[LobeHub validator] -->|spawn install snippet| B[stdio MCP server]
    B -->|initialize| A
    B -->|tools/list| A
    A -->|tools/call each tool with {}| B
    B -->|content / error| A
    A -->|all green?| C{Validate}
    C -->|yes| D[Listing flipped to Validated]
    C -->|no| E[Listing stays Unvalidated]
```

Two things commonly break this:

1. **Wrong install snippet** — LobeHub auto-derives the snippet from the
   server name and registry. For Python servers that ship to PyPI it
   often guesses `npx -y <slug>`, which fails immediately because the
   package isn't on npm. We override this in the LobeHub UI.
2. **Bug in the server itself** — if `tools/call` 500s on every empty-arg
   call, validation fails. This is the `kwargs: Field required` FastMCP
   signature-fallback bug we fixed in medium-ops 0.1.2 / substack-ops 0.3.5.

---

## Per-server overrides

### slideshot

- **Install snippet:** `npx -y slideshot-mcp`
- **Env vars:** none (no auth / no creds needed)
- **Env JSON schema:** `{}` (or omit the field entirely)
- **Status:** safe to re-trigger immediately. Already on npm with the
  TypeScript SDK + Zod schemas, never had the kwargs bug.
- **Tools that LobeHub will call with `{}`:** `health_check`,
  `discover_themes`, `list_themes`, `create_slides` (returns prompt when
  no html), `render_slides` (returns useful error), `edit_slides`. All
  return non-error content for empty args because the schemas allow it.

### medium-ops

- **Install snippet:** `uvx medium-ops mcp serve`
- **Env vars (JSON schema for the LobeHub form):**

  ```json
  {
    "MEDIUM_INTEGRATION_TOKEN": {
      "type": "string",
      "description": "Optional. Legacy Medium write token (api.medium.com/v1/*). Medium stopped issuing these in 2023. Used by publish_post / create_draft.",
      "required": false,
      "secret": true
    },
    "MEDIUM_SID": {
      "type": "string",
      "description": "Required for reads. Medium session cookie copied from DevTools → Application → Cookies → medium.com → sid. See https://github.com/06ketan/medium-ops/blob/main/docs/AUTH-SETUP.md",
      "required": false,
      "secret": true
    },
    "MEDIUM_UID": {
      "type": "string",
      "description": "Optional. Medium user id cookie. Speeds up self-lookup; resolved automatically if missing.",
      "required": false,
      "secret": false
    },
    "MEDIUM_USERNAME": {
      "type": "string",
      "description": "Optional but recommended. Your Medium handle for self-routes.",
      "required": false,
      "secret": false
    },
    "MEDIUM_XSRF": {
      "type": "string",
      "description": "Required for dashboard writes (post_response, clap_for_post). Copy from DevTools → Cookies → medium.com → xsrf.",
      "required": false,
      "secret": true
    },
    "MEDIUM_CF_CLEARANCE": {
      "type": "string",
      "description": "Last-resort. Cloudflare challenge cookie if your account is flagged. Short-lived. See AUTH-SETUP.md Path D.",
      "required": false,
      "secret": true
    }
  }
  ```

- **Status:** safe to re-trigger immediately. Version 0.1.2 on PyPI is the
  first build with the FastMCP signature-synthesis fix. `tools/list`
  returns 16 clean schemas; `tools/call test_connection` returns a
  clean "Missing Medium credentials" error (LobeHub's validator is
  fine with this — it counts as a successful round-trip).

### substack-ops

- **Install snippet:** `uvx substack-ops mcp serve`
- **Env vars (JSON schema for the LobeHub form):**

  ```json
  {
    "SUBSTACK_PUBLICATION_URL": {
      "type": "string",
      "description": "Optional. Your Substack publication URL (e.g. https://you.substack.com/). Auto-discovered by `substack-ops auth login --browser chrome`.",
      "required": false,
      "secret": false
    },
    "SUBSTACK_USER_ID": {
      "type": "string",
      "description": "Optional. Your Substack numeric user id.",
      "required": false,
      "secret": false
    },
    "SUBSTACK_SESSION_TOKEN": {
      "type": "string",
      "description": "Required for authenticated calls. Substack session cookie value (the s%3A... string). Easier path: run `substack-ops auth login --browser chrome` and the cookie is auto-grabbed.",
      "required": false,
      "secret": true
    }
  }
  ```

- **Status:** **DO NOT re-trigger before 0.3.5 is live on PyPI.** The
  earlier 0.3.4 build has the FastMCP `kwargs: Field required` bug —
  LobeHub's validator will fail every `tools/call` and the listing will
  stay Unvalidated.
  - To check: `pip index versions substack-ops` should list `0.3.5`.
  - Once 0.3.5 is live, re-trigger validation. `tools/list` returns 26
    clean schemas; `tools/call test_connection` returns either real
    Substack data (if a cookie is cached) or a clean "Missing Substack
    credentials" error — both are acceptable to LobeHub's validator.

---

## Step-by-step: claim and re-validate one listing

1. Visit your LobeHub profile page → **MCP Servers**.
   ([lobehub.com/dashboard/profile/mcp](https://lobehub.com/dashboard/profile/mcp)
   when signed in.)
2. Click your server's row → **Claim Server** (only available if the
   server's `repository.url` in the published metadata matches a GitHub
   repo you own).
3. Edit the **Install** field → paste the correct install snippet from
   the table above. Pick stdio transport.
4. Edit the **Environment Variables** field → paste the matching env
   JSON schema.
5. Save. LobeHub queues a re-validation in their pipeline; the listing
   shows **Pending** for ~6–24 hours.
6. Listing flips to **Validated** automatically once the pipeline run
   finishes successfully.

---

## Validator timing & expectations

| Stage                              | Typical duration   | What you'll see                              |
|------------------------------------|--------------------|----------------------------------------------|
| Submit override                    | instant            | Listing reads "Pending re-validation"        |
| LobeHub queue picks it up          | up to 24 hours     | No visible change                            |
| Validator runs                     | 30–90 seconds      | Logs visible in claim dashboard              |
| Listing flips to Validated         | seconds after pass | Green badge appears, listing is searchable   |

If after 48 hours the badge has not flipped, common causes:

1. Install snippet still points at the wrong package manager (e.g.
   `npx -y` for a Python uvx package).
2. PyPI version not yet propagated through CDN — wait 10–15 min after
   the GitHub Release shows the wheel attached.
3. Server prints non-JSON banner to stdout before the MCP `initialize`
   response (validator's JSON parser bails). All 3 of our servers are
   stdio-clean — but if you ever see "Connection closed" in LobeHub's
   logs this is what to check first.

---

## Per-server quick links

- LobeHub claim flow guide: [lobehub.com/docs/usage/providers/mcp](https://lobehub.com/docs/usage/providers/mcp)
- LobeHub MCP Validator source (open source): [github.com/lobehub/market-cli](https://github.com/lobehub/market-cli)
- Our parallel Glama A-tier cheatsheet: [./GLAMA-A-TIER-CHEATSHEET.md](./GLAMA-A-TIER-CHEATSHEET.md)
- Anthropic DXT submission guide: [./anthropic-dxt.md](./anthropic-dxt.md)

---

## Why this matters

LobeHub Marketplace is one of the top 5 MCP discovery surfaces (alongside
Glama, the Official MCP Registry, mcp.so, and Anthropic's DXT directory).
Validated listings appear in their search and recommended carousels;
Unvalidated listings are visible only via direct URL. Getting all three
servers to **Validated** unlocks organic discovery on a directory that
sees ~6-figure monthly traffic.
