# SongGPT Composer

This worker runs outside Cloudflare on any machine that has a logged-in
subscription CLI and `abc2midi`.

It polls the Cloudflare Pages Function API for queued songs, generates ABC with
either Claude or Codex, renders MIDI locally, and uploads the ABC/MIDI files to
R2 through the protected composer endpoint.

```bash
export SONGGPT_API_BASE="https://api.songgpt.soli.blue"
export COMPOSER_TOKEN="<same secret configured in Cloudflare Pages>"
export SONGGPT_GENERATOR="codex" # or "claude"
export CODEX_MODEL="gpt-5.6-sol"
export CODEX_REASONING_EFFORT="high"
export CLAUDE_MODEL="claude-opus-4-8"

python3 composer/songgpt_composer.py
```

Each song's requested model routes it to GPT-5.6 Sol with high reasoning and a
read-only Codex sandbox, or Claude Opus 4.8 with safe mode and tools disabled.
The composer process handles ABC/MIDI rendering and uploads itself.

For a single smoke-test job:

```bash
python3 composer/songgpt_composer.py --once
```

For a safe preflight that does not claim a job:

```bash
python3 composer/songgpt_composer.py --check
```

## Continuous Worker

The easiest install path is the user-level systemd helper. It writes no
secrets; if the env file is missing, it creates one from
`composer/songgpt-composer.env.example` with `COMPOSER_TOKEN` left blank.

```bash
scripts/install-composer-service.sh
$EDITOR ~/.config/songgpt/songgpt-composer.env
systemctl --user enable --now songgpt-composer.service
journalctl --user -u songgpt-composer.service -f
```

On a headless VPS, add `--enable-linger` so the user service keeps running after
logout:

```bash
scripts/install-composer-service.sh --enable-linger --start
```

Check the local service without printing secrets or claiming a job:

```bash
scripts/check-composer-service.sh
```

The older `composer/songgpt-composer.service.example` remains available for
system-level installs that intentionally use `/opt/songgpt`.

```bash
sudo cp composer/songgpt-composer.service.example /etc/systemd/system/songgpt-composer.service
sudo systemctl daemon-reload
sudo systemctl enable --now songgpt-composer.service
sudo journalctl -u songgpt-composer.service -f
```
