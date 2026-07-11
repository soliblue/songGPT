# songGPT

[![Migration Checks](https://github.com/soliblue/songGPT/actions/workflows/migration-checks.yml/badge.svg)](https://github.com/soliblue/songGPT/actions/workflows/migration-checks.yml)

songGPT is an open-source project that generates short musical compositions in
ABC notation, converts them to MIDI, and plays them in the browser. The current
hosted path is designed to stay on Cloudflare's free tiers: Cloudflare Pages for
the React app, Pages Functions for the API, D1 for song metadata, and R2 for
ABC and MIDI files.

The composer itself runs outside Cloudflare through an existing subscription CLI
login. Use `SONGGPT_GENERATOR=claude` for Claude Code or `SONGGPT_GENERATOR=codex`
for Codex CLI; both paths use structured JSON output and then render the music
locally with `abc2midi`.

Production:

- App: `https://songgpt.soli.blue/`
- Pages fallback: `https://songgpt.pages.dev/`
- API routes: `https://songgpt.soli.blue/api/...`
- API hostname: `https://api.songgpt.soli.blue/...`

## Repository Structure

- **front-end**: Vite React app, Cloudflare Pages Functions, D1 migrations, and
  R2 bindings.
- **composer**: A small polling worker that claims queued songs from the
  Cloudflare API, runs Claude or Codex CLI, renders MIDI, and uploads
  results.
- **back-end**: The original FastAPI shape preserved as a local/VPS-compatible
  fallback. It now uses the same local CLI composer idea with SQLite and local
  file storage instead of Firebase/provider APIs.
- **notebooks**: Historical Jupyter experiments from the first version of the
  project.

## How It Works

1. The React app creates a queued song row through `/api/songs`, including the
   selected Sol or Opus model.
2. D1 stores the prompt, system message, status, and finished ABC/response text.
3. The composer worker polls `/api/composer/claim` using `COMPOSER_TOKEN`.
4. The worker runs Claude or Codex CLI with a JSON schema requiring `response`,
   `abc`, and a `score` object.
5. The worker writes `.abc`, runs `abc2midi`, and uploads the finished files
   back through `/api/composer/:id/complete`.
6. R2 stores generated `.abc` and `.mid` files. The app reads them from
   `/api/songs/:id/files/:type`.

Song creation is capped at 3 requests per client per hour, 3 pending jobs, and
250 total jobs per UTC day. Client addresses are salted and hashed before the
rate-limit key is stored in D1.

## Firebase Migration

Firebase is no longer used by the hosted application. The legacy Firestore
`songs` collection from project `songgpt-xyz` was imported into D1:

- `openai/gpt-4` complete songs: 1,628
- `openai/gpt-4` score-only legacy rows: 259

The score-only rows are kept for archival completeness and marked `failed`
because they did not contain ABC notation. Completed legacy rows keep their ABC
notation in D1, and the ABC download route falls back to D1 when an R2 object is
not present. Firebase Storage was not used as a source of truth during the
migration because it returned billing/availability errors.

The repository also keeps a dedicated decommission check for stale Firebase,
Expo, provider SDK, and WAV-generation runtime pieces:

```bash
scripts/check-decommissioned-services.sh
```

This check is part of CI. It verifies that old Firebase config/build state is
not tracked and that active runtime files stay on Cloudflare D1/R2 plus the
local CLI composer path.

## Cloudflare Setup

Use secrets from your local environment at command time. Do not commit them.
The command below assumes a repo-local ignored `.env` containing your
Cloudflare token/account variables.

```bash
cd front-end
set -a
source ../.env
set +a

npx wrangler@latest d1 create songgpt
npx wrangler@latest r2 bucket create songgpt-files
```

Copy the created D1 database id into `front-end/wrangler.jsonc`, then apply the
migration:

```bash
npx wrangler@latest d1 migrations apply songgpt --remote
```

Set `COMPOSER_TOKEN` as a Pages secret in Cloudflare, then deploy:

```bash
npm run build
npx wrangler@latest pages deploy dist --project-name=songgpt --branch=main --commit-dirty=true
```

Attach `songgpt.soli.blue` and `api.songgpt.soli.blue` to the Pages project.
The app hostname uses Pages Functions at `/api/...`; middleware rewrites only
the API hostname, so `https://api.songgpt.soli.blue/songs/` maps to the same API
without requiring callers to include `/api`.

## Migration Health Check

Run this from the repo root after deploys or before declaring Firebase fully
retired:

```bash
node scripts/check-migration.mjs
```

The check verifies the live app/API URLs, the clean `api.songgpt.soli.blue`
surface, tracked frontend source data, Cloudflare D1/R2 bindings, and active
runtime files for Firebase/provider/WAV regressions. It also runs the
decommissioned service check and checks three live proof songs: one legacy
Firestore import, one Codex CLI-generated song, and one Claude CLI-generated
song. Use `SONGGPT_LEGACY_PROOF_SONG_ID`,
`SONGGPT_CODEX_PROOF_SONG_ID`, or `SONGGPT_CLAUDE_PROOF_SONG_ID` to override
those IDs if a proof row is intentionally replaced.

## Backups

D1 is the source of truth now that Firebase is retired. Export it before risky
schema or migration work:

```bash
scripts/export-d1-backup.sh
```

The script writes an ignored SQL dump and metadata files under `backups/`. It
uses `ENV_FILE=...`, `OUTPUT_DIR=...`, and `DATABASE_NAME=...` overrides when
needed, and it never commits the generated dump.

## Composer Worker

```bash
export SONGGPT_API_BASE="https://api.songgpt.soli.blue"
export COMPOSER_TOKEN="<same secret configured in Cloudflare>"
export SONGGPT_GENERATOR="codex" # or "claude"
export CODEX_MODEL="gpt-5.6-sol"
export CODEX_REASONING_EFFORT="high"
export CLAUDE_MODEL="claude-opus-4-8"

python3 composer/songgpt_composer.py
```

Each queued song selects either GPT-5.6 Sol with high reasoning in a read-only
Codex sandbox or Claude Opus 4.8 in safe mode with tools disabled. SongGPT only
needs text generation here; local rendering and uploads are handled by the
composer process.

For continuous operation on a local machine or VPS, use
`scripts/install-composer-service.sh` and keep the real `COMPOSER_TOKEN` in the
ignored env file it creates at `~/.config/songgpt/songgpt-composer.env`.

```bash
scripts/install-composer-service.sh --enable-linger --start
journalctl --user -u songgpt-composer.service -f
```

To verify the local composer daemon after deploys or reboots:

```bash
scripts/check-composer-service.sh
```

## Contributing

We welcome contributions to the project. Please see `CONTRIBUTING.md` for more.
