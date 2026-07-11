#!/usr/bin/env python3
import argparse
import json
import mimetypes
import os
import re
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
import uuid
from pathlib import Path


OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "response": {
            "type": "string",
            "description": "Thought process, action, and observation text shown to the user.",
        },
        "abc": {
            "type": "string",
            "description": "Valid ABC notation only, with no surrounding XML tags.",
        },
    },
    "required": ["response", "abc"],
    "additionalProperties": False,
}

SOL_MODEL = "openai/gpt-5.6-sol"
OPUS_MODEL = "anthropic/claude-opus-4-8"


def env(name, default=None):
    return os.environ.get(name, default)


def api_base():
    return env("SONGGPT_API_BASE", "https://api.songgpt.soli.blue").rstrip("/")


def composer_token():
    token = env("COMPOSER_TOKEN")
    if not token:
        raise RuntimeError("COMPOSER_TOKEN is required.")
    return token


def user_agent():
    return env("SONGGPT_USER_AGENT", "SongGPT-Composer/2.0")


def request_json(path, method="GET", body=None):
    data = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        f"{api_base()}{path}",
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {composer_token()}",
            "Content-Type": "application/json",
            "User-Agent": user_agent(),
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            if response.status == 204:
                return None
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {path} failed: {error.code} {detail}") from error


def claim_song():
    return request_json("/composer/claim", method="POST")


def fail_song(song_id, error):
    request_json(f"/composer/{song_id}/fail", method="POST", body={"error": str(error)})


def prompt_for(song):
    return (
        "System message for the composition:\n"
        f"{song['system_message']}\n\n"
        "User input:\n"
        f"{song['prompt']}\n\n"
        "Return a short original composition in the required JSON shape. "
        "The abc field must contain only valid ABC notation."
    )


def parse_generation(text):
    data = json.loads(text)
    if isinstance(data.get("structured_output"), dict):
        data = data["structured_output"]
    elif (
        "result" in data
        and isinstance(data["result"], str)
        and data["result"].strip()
    ):
        data = json.loads(data["result"])
    if "abc" not in data:
        raise RuntimeError("Generator did not return an abc field.")
    data.setdefault("score", {})
    data["abc"] = extract_abc(data["abc"])
    if "<abc>" not in data.get("response", ""):
        data["response"] = f"{data.get('response', '')}\n\n<abc>\n{data['abc']}\n</abc>"
    return data


def extract_abc(text):
    match = re.search(r"<abc>\*?(.*?)\*?</abc>", text, flags=re.DOTALL)
    return (match.group(1) if match else text).strip()


def generate_with_claude(song):
    command = [
        env("CLAUDE_BIN", "claude"),
        "--model",
        env("CLAUDE_MODEL", "claude-opus-4-8"),
        "--print",
        "--output-format",
        "json",
        "--json-schema",
        json.dumps(OUTPUT_SCHEMA),
        "--no-session-persistence",
        "--safe-mode",
        "--tools",
        "",
    ]
    try:
        completed = subprocess.run(
            command,
            check=True,
            input=prompt_for(song),
            capture_output=True,
            text=True,
            timeout=int(env("GENERATOR_TIMEOUT_SECONDS", "240")),
        )
    except subprocess.CalledProcessError as error:
        detail = (error.stderr or error.stdout or "").strip()
        raise RuntimeError(f"Claude failed: {detail}") from error
    return parse_generation(completed.stdout)


def generate_with_codex(song, workdir):
    schema_path = Path(workdir) / "schema.json"
    output_path = Path(workdir) / "codex-output.json"
    schema_path.write_text(json.dumps(OUTPUT_SCHEMA), encoding="utf-8")
    command = [
        env("CODEX_BIN", "codex"),
        "exec",
        "--model",
        env("CODEX_MODEL", "gpt-5.6-sol"),
        "--config",
        f'model_reasoning_effort="{env("CODEX_REASONING_EFFORT", "high")}"',
    ]
    command.extend(
        [
            "--sandbox",
            "read-only",
            "--ephemeral",
            "--output-schema",
            str(schema_path),
            "--output-last-message",
            str(output_path),
            "-",
        ],
    )
    try:
        subprocess.run(
            command,
            check=True,
            input=prompt_for(song),
            capture_output=True,
            text=True,
            timeout=int(env("GENERATOR_TIMEOUT_SECONDS", "240")),
        )
    except subprocess.CalledProcessError as error:
        detail = (error.stderr or error.stdout or "").strip()
        raise RuntimeError(f"Codex failed: {detail}") from error
    return parse_generation(output_path.read_text(encoding="utf-8"))


def generator_for_song(song):
    requested_model = song.get("model")
    if requested_model == SOL_MODEL:
        return "codex"
    if requested_model == OPUS_MODEL:
        return "claude"
    return env("SONGGPT_GENERATOR", "codex").lower()


def generate_song(song, workdir):
    generator = generator_for_song(song)
    if generator == "claude":
        return generate_with_claude(song)
    if generator == "codex":
        return generate_with_codex(song, workdir)
    raise RuntimeError("SONGGPT_GENERATOR must be 'claude' or 'codex'.")


def model_provenance(song):
    generator = generator_for_song(song)
    if generator == "codex":
        return f'openai/{env("CODEX_MODEL", "gpt-5.6-sol")}'
    return f'anthropic/{env("CLAUDE_MODEL", "claude-opus-4-8")}'


def check_environment():
    errors = []
    generator = env("SONGGPT_GENERATOR", "codex").lower()

    print(f"API base: {api_base()}")
    print(f"Generator: {generator}")

    if generator not in {"claude", "codex"}:
        errors.append("SONGGPT_GENERATOR must be 'claude' or 'codex'.")

    for label, generator_bin in (
        ("Codex", env("CODEX_BIN", "codex")),
        ("Claude", env("CLAUDE_BIN", "claude")),
    ):
        if shutil.which(generator_bin):
            print(f"{label} binary: {generator_bin}")
        else:
            errors.append(f"{label} binary not found: {generator_bin}")

    if env("COMPOSER_TOKEN"):
        print("Composer token: configured")
    else:
        errors.append("COMPOSER_TOKEN is required.")

    if shutil.which("abc2midi"):
        print("abc2midi: installed")
    else:
        errors.append("abc2midi is not installed.")

    if errors:
        for error in errors:
            print(f"ERROR: {error}", flush=True)
        return False
    return True


def run_checked(command):
    subprocess.run(command, check=True, capture_output=True, text=True)


def render_files(song, generation, workdir):
    if not shutil.which("abc2midi"):
        raise RuntimeError("abc2midi is not installed.")

    abc_path = Path(workdir) / f"{song['id']}.abc"
    midi_path = Path(workdir) / f"{song['id']}.mid"
    abc_path.write_text(generation["abc"], encoding="utf-8")
    run_checked(["abc2midi", str(abc_path), "-o", str(midi_path)])
    return abc_path, midi_path


def multipart_body(fields, files):
    boundary = f"songgpt-{uuid.uuid4().hex}"
    chunks = []
    for name, value in fields.items():
        chunks.append(f"--{boundary}\r\n".encode())
        chunks.append(
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode()
        )
        chunks.append(str(value).encode("utf-8"))
        chunks.append(b"\r\n")
    for name, path in files.items():
        path = Path(path)
        content_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
        chunks.append(f"--{boundary}\r\n".encode())
        chunks.append(
            (
                f'Content-Disposition: form-data; name="{name}"; '
                f'filename="{path.name}"\r\n'
                f"Content-Type: {content_type}\r\n\r\n"
            ).encode()
        )
        chunks.append(path.read_bytes())
        chunks.append(b"\r\n")
    chunks.append(f"--{boundary}--\r\n".encode())
    return boundary, b"".join(chunks)


def complete_song(song, generation, midi_path):
    boundary, body = multipart_body(
        fields={
            "response": generation["response"],
            "abc": generation["abc"],
            "score": json.dumps(generation.get("score") or {}),
            "model": model_provenance(song),
        },
        files={"mid": midi_path},
    )
    request = urllib.request.Request(
        f"{api_base()}/composer/{song['id']}/complete",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {composer_token()}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": user_agent(),
        },
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))


def process_once():
    claimed = claim_song()
    if not claimed:
        return False
    song = claimed["song"]
    print(f"Claimed {song['id']}", flush=True)
    try:
        with tempfile.TemporaryDirectory(prefix="songgpt-composer-") as workdir:
            generation = generate_song(song, workdir)
            _, midi_path = render_files(song, generation, workdir)
            complete_song(song, generation, midi_path)
            print(f"Completed {song['id']}", flush=True)
    except Exception as error:
        fail_song(song["id"], error)
        print(f"Failed {song['id']}: {error}", flush=True)
    return True


def main():
    parser = argparse.ArgumentParser(description="SongGPT Cloudflare composer worker")
    parser.add_argument("--once", action="store_true", help="Process at most one job.")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate environment and local tools without claiming a job.",
    )
    args = parser.parse_args()
    if args.check:
        raise SystemExit(0 if check_environment() else 1)
    poll_seconds = int(env("POLL_SECONDS", "10"))
    while True:
        had_work = process_once()
        if args.once:
            return
        if not had_work:
            time.sleep(poll_seconds)


if __name__ == "__main__":
    main()
