#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="${SERVICE_NAME:-songgpt-composer.service}"
XDG_CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
ENV_FILE="${ENV_FILE:-$XDG_CONFIG_HOME/songgpt/songgpt-composer.env}"
REPO_DIR="${REPO_DIR:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)}"
PYTHON_BIN="${PYTHON_BIN:-$(command -v python3)}"

fail() {
  echo "not ok - $*" >&2
  exit 1
}

ok() {
  echo "ok - $*"
}

[ -f "$ENV_FILE" ] || fail "composer env file exists at $ENV_FILE"
[ "$(stat -c '%a' "$ENV_FILE")" = "600" ] || fail "composer env file mode is 600"
ok "composer env file exists with mode 600"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

[ "${SONGGPT_API_BASE:-}" = "https://api.songgpt.soli.blue" ] ||
  fail "SONGGPT_API_BASE points at https://api.songgpt.soli.blue"
ok "SONGGPT_API_BASE points at clean API hostname"

[ -n "${COMPOSER_TOKEN:-}" ] || fail "COMPOSER_TOKEN is configured"
ok "COMPOSER_TOKEN is configured"

case "${SONGGPT_GENERATOR:-codex}" in
  claude|codex)
    ok "SONGGPT_GENERATOR is ${SONGGPT_GENERATOR:-codex}"
    ;;
  *)
    fail "SONGGPT_GENERATOR must be claude or codex"
    ;;
esac

command -v abc2midi >/dev/null 2>&1 || fail "abc2midi is installed"
ok "abc2midi is installed"

if [ "${SONGGPT_GENERATOR:-codex}" = "claude" ]; then
  command -v "${CLAUDE_BIN:-claude}" >/dev/null 2>&1 || fail "Claude CLI is installed"
  ok "Claude CLI is installed"
else
  command -v "${CODEX_BIN:-codex}" >/dev/null 2>&1 || fail "Codex CLI is installed"
  ok "Codex CLI is installed"
  [ "${CODEX_MODEL:-gpt-5.6-sol}" = "gpt-5.6-sol" ] ||
    fail "CODEX_MODEL is gpt-5.6-sol"
  ok "CODEX_MODEL is gpt-5.6-sol"
  [ "${CODEX_REASONING_EFFORT:-high}" = "high" ] ||
    fail "CODEX_REASONING_EFFORT is high"
  ok "CODEX_REASONING_EFFORT is high"
fi

systemctl --user is-enabled "$SERVICE_NAME" >/dev/null ||
  fail "$SERVICE_NAME is enabled"
ok "$SERVICE_NAME is enabled"

systemctl --user is-active "$SERVICE_NAME" >/dev/null ||
  fail "$SERVICE_NAME is active"
ok "$SERVICE_NAME is active"

if command -v loginctl >/dev/null 2>&1; then
  [ "$(loginctl show-user "$USER" -p Linger --value 2>/dev/null || true)" = "yes" ] ||
    fail "systemd linger is enabled for $USER"
  ok "systemd linger is enabled for $USER"
fi

"$PYTHON_BIN" "$REPO_DIR/composer/songgpt_composer.py" --check >/tmp/songgpt-composer-check.log
ok "composer preflight passes"

"$PYTHON_BIN" - <<'PY'
import json
import os
import sys
import urllib.request

base = os.environ["SONGGPT_API_BASE"].rstrip("/")
for path, label in [("/", "API health"), ("/songs/?limit=1", "song list")]:
    request = urllib.request.Request(
        f"{base}{path}",
        headers={"User-Agent": "SongGPT-Composer-Check/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise SystemExit(f"{label} returned {response.status}")
        payload = json.loads(response.read().decode("utf-8"))
        if path == "/" and payload.get("ok") is not True:
            raise SystemExit("API health did not return ok=true")
        if path.startswith("/songs/") and not isinstance(payload.get("songs"), list):
            raise SystemExit("song list did not return a songs array")
print("ok - public API responds")
PY

ok "composer service health check complete"
