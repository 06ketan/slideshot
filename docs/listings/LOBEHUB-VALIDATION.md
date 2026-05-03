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

## LobeHub score breakdown — what each item is worth

LobeHub grades servers F (0–60%) → B (60–80%) → A (80–100%). The score
breaks down into the 9 items below. **Required items** (4 total) carry the
most weight; the others are reinforcement.

| Score item                              | How to pass                                                              | Status across our 3 servers |
|-----------------------------------------|--------------------------------------------------------------------------|------------------------------|
| **Validated** *(required)*              | Server passes LobeHub's `tools/list` + `tools/call` validator             | After re-trigger ✓           |
| **At least one installation method** *(required)* | Manifest / package metadata declares an install command                | ✓                            |
| **At least one Skill** *(required)*     | At least one MCP tool is discoverable via `tools/list`                    | ✓ (slideshot 6, medium 16, substack 26) |
| **Has README**                           | `README.md` at repo root                                                 | ✓                            |
| **Friendly installation methods**        | Anything other than "manual" — `uvx` / `npx` / `.mcpb` / Docker all count | ✓                            |
| **Has LICENSE**                          | `LICENSE` at repo root (we use MIT)                                      | ✓                            |
| **Includes Prompts**                     | Server registers `prompts/list` capability                                | ✗ (none of the 3 do today — see "Future score lifts") |
| **Includes Resources**                   | Server registers `resources/list` capability                              | ✗ (none of the 3 do today — see "Future score lifts") |
| **Claimed by Owner** *(required)*        | LobeHub badge embedded in repo `README.md`                                | ✓ (badge row shipped)        |

The screenshot showed `slideshot` at `45 / 100 (F)` because **3 of 4 required
items were missing** — Validated, Skill list (the kwargs bug was breaking
tools/call indirectly), and Claimed. After this round all 4 required items
pass, projecting the listing into B-tier (~70 / 100). To clear A-tier
(80+) we'd still need Prompts + Resources support — covered below.

---

## How to claim the listing — the badge route

LobeHub's "Claimed by Owner" check works by scanning the repo's `README.md`
for a link to `https://lobehub.com/mcp/<slug>`. As soon as the badge lands
on `main`, the next nightly re-scan flips the check ✓ — no manual claim
flow required.

The badges shipped in our 3 READMEs:

```markdown
[![MCP Badge](https://lobehub.com/badge/mcp/06ketan-slideshot)](https://lobehub.com/mcp/06ketan-slideshot)
[![MCP Badge](https://lobehub.com/badge/mcp/06ketan-medium-ops)](https://lobehub.com/mcp/06ketan-medium-ops)
[![MCP Badge](https://lobehub.com/badge/mcp/06ketan-substack-ops)](https://lobehub.com/mcp/06ketan-substack-ops)
```

LobeHub also offers a card-style badge for hero sections of READMEs
(theme=light or theme=dark):

```markdown
[![MCP Badge](https://lobehub.com/badge/mcp-full/06ketan-slideshot?theme=light)](https://lobehub.com/mcp/06ketan-slideshot)
```

Both forms count for the "Claimed" check; we use the flat-square form for
parity with our other shields.io badges in the badge row.

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
servers to **Validated + Claimed** unlocks organic discovery on a directory
that sees ~6-figure monthly traffic.

---

## Future score lifts — A-tier work

After the badge ships and validation re-runs, the remaining unchecked
items in LobeHub's score breakdown are **Includes Prompts** and
**Includes Resources**. Each is worth a few points; together they're the
gap between B-tier (60–80%) and A-tier (80+).

### Includes Prompts

Register an `MCP prompts/list` capability + at least one prompt template.

- **slideshot** — natural fit. Each of the 8 themes (`generic`, `branded`,
  `dark-modern`, `editorial`, `infographic`, `instagram-carousel`,
  `pitch-deck`, `browser-shell`) is already a prompt template at
  `prompts/*.md`. Wrapping them in MCP prompts via the TypeScript SDK is
  ~30 lines of code; the prompt body is loaded from disk and parameterised
  on `topic`, `audience`, `slide_count`.
- **substack-ops** — registering a `triage_unanswered_comments` prompt
  that the host LLM can preload before calling `bulk_draft_replies` would
  also unlock the score and give users a single-click reply workflow.
- **medium-ops** — same pattern: a `triage_responses` prompt feeding the
  reply-drafting tool family.

### Includes Resources

Register an `MCP resources/list` capability. Resources are read-only
context the host LLM can attach into its window without paying tool-call
overhead.

- **slideshot** — `resource://themes` listing the 8 theme catalogs +
  `resource://schema/render-options` for the render contract are obvious
  fits.
- **substack-ops / medium-ops** — `resource://drafts/<id>` and
  `resource://policy/comment-rules` would surface in MCP clients without
  needing a tool round-trip.

Both items would be a single follow-on phase per server. Estimated effort:
- slideshot ≈ 1–2 hours (TypeScript SDK, schemas already written)
- substack-ops / medium-ops ≈ 2–3 hours each (FastMCP `@server.prompt` and
  `@server.resource` decorators; need real prompt copy and resource URIs)

After both ship, all 9 LobeHub score items pass and listings should land
in the A-tier 80–95% range, with the exact score depending on
`tools/call` runtime and uptime metrics that LobeHub tracks separately.
