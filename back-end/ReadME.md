# songGPT - Back-end

The primary hosted path now lives in `front-end/functions` on Cloudflare Pages.
This FastAPI service is kept as a local/VPS-compatible fallback because it
preserves the original `SongGPT`, router, schema, and `SongsDAO` shape.

It uses:

- local Claude CLI structured output
- SQLite metadata storage through `SongsDAO`
- local file storage under `SONGGPT_STORAGE_DIR`
- `abc2midi` for MIDI rendering
- optional `fluidsynth` tooling for the legacy soundfont inspection endpoints

## Setup

```bash
cd back-end
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

You also need `abc2midi`. Install `fluidsynth` and a soundfont package too if
you want to use the `/soundfonts` inspection endpoints.

```bash
sudo apt-get install abcmidi fluidsynth fluid-soundfont-gm
```

## Run

```bash
export CLAUDE_MODEL=claude-opus-4-8
export DATABASE_PATH="$PWD/data/songgpt.sqlite3"
export SONGGPT_STORAGE_DIR="$PWD/data/storage"

uvicorn app.main:app --workers 1 --host 0.0.0.0 --port 8080 --reload
```

The API docs are available at `http://0.0.0.0:8080/docs/`.
