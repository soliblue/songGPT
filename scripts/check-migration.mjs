#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const appUrl = process.env.SONGGPT_APP_URL || "https://songgpt.soli.blue/songs/";
const apiBase = (process.env.SONGGPT_API_BASE || "https://api.songgpt.soli.blue").replace(
  /\/$/,
  "",
);
const legacyProofSongId =
  process.env.SONGGPT_LEGACY_PROOF_SONG_ID ||
  process.env.SONGGPT_PROOF_SONG_ID ||
  "661874d5-52fc-4cd9-8da4-df4a6b0bf68f";
const codexProofSongId =
  process.env.SONGGPT_CODEX_PROOF_SONG_ID ||
  process.env.SONGGPT_COMPOSER_PROOF_SONG_ID ||
  "5049059e-0f03-47d1-b9a3-92c5d2a65c9b";
const claudeProofSongId =
  process.env.SONGGPT_CLAUDE_PROOF_SONG_ID ||
  "1f37bbdd-925e-4f92-8dae-102134ba0259";

const failures = [];
const passes = [];

function pass(message) {
  passes.push(message);
}

function assert(condition, message) {
  if (condition) {
    pass(message);
  } else {
    failures.push(message);
  }
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function listFiles(start) {
  const absolute = join(root, start);
  if (!existsSync(absolute)) return [];

  const files = [];
  const stack = [absolute];
  while (stack.length) {
    const current = stack.pop();
    const stat = statSync(current);
    if (stat.isDirectory()) {
      if (
        current.includes("node_modules") ||
        current.includes("dist") ||
        current.includes("__pycache__")
      ) {
        continue;
      }
      for (const entry of readdirSync(current)) stack.push(join(current, entry));
    } else if (!current.endsWith(".pyc")) {
      files.push(current);
    }
  }
  return files;
}

function gitStatus(args) {
  return spawnSync("git", args, { cwd: root, stdio: "ignore" }).status;
}

function assertTrackedAndNotIgnored(path) {
  assert(gitStatus(["ls-files", "--error-unmatch", path]) === 0, `${path} is tracked`);
  assert(gitStatus(["check-ignore", "-q", path]) !== 0, `${path} is not ignored`);
}

function assertExecutable(path) {
  const mode = statSync(join(root, path)).mode;
  assert(Boolean(mode & 0o111), `${path} is executable`);
}

async function fetchJson(url) {
  const response = await fetch(url);
  assert(response.ok, `${url} returned ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  assert(contentType.includes("application/json"), `${url} returned JSON`);
  return response.json();
}

async function checkFile(url, expectedContentType, method = "GET") {
  const response = await fetch(url, { method });
  assert(response.ok, `${method} ${url} returned ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  assert(
    contentType.includes(expectedContentType),
    `${method} ${url} returned ${expectedContentType}`,
  );
  if (method === "GET") {
    const body = await response.arrayBuffer();
    assert(body.byteLength > 0, `${method} ${url} returned a non-empty body`);
  }
}

function songsAreNewestFirst(songs) {
  return songs.every((song, index) => {
    if (index === 0) return true;
    const previous = Date.parse(songs[index - 1].created_at || "");
    const current = Date.parse(song.created_at || "");
    return Number.isFinite(previous) && Number.isFinite(current) && previous >= current;
  });
}

async function checkComposerProof(songId, generator) {
  const song = await fetchJson(`${apiBase}/songs/${songId}`);
  const expectedModel =
    generator === "claude" ? /^anthropic\/claude-/i : /^openai\/gpt-/i;
  assert(song.status === "complete", `${generator} proof song is complete`);
  assert(
    expectedModel.test(song.model || ""),
    `${generator} proof song exposes provider-qualified model provenance`,
  );
  assert(Boolean(song.abc), `${generator} proof song has ABC notation in D1`);
  assert(Boolean(song.response), `${generator} proof song has composer response text`);
  await checkFile(`${apiBase}/songs/${songId}/files/abc`, "text/vnd.abc");
  await checkFile(`${apiBase}/songs/${songId}/files/abc`, "text/vnd.abc", "HEAD");
  await checkFile(`${apiBase}/songs/${songId}/files/mid`, "audio/midi");
  await checkFile(`${apiBase}/songs/${songId}/files/mid`, "audio/midi", "HEAD");
}

async function checkLiveUrls() {
  const rootResponse = await fetchJson(`${apiBase}/`);
  assert(rootResponse.ok === true, "API hostname root returns health payload");
  assert(rootResponse.endpoints?.includes("/songs/"), "API root advertises /songs/");

  const cleanSongs = await fetchJson(`${apiBase}/songs/?limit=6`);
  assert(Array.isArray(cleanSongs.songs), "API hostname /songs returns a songs array");
  assert(cleanSongs.songs.length > 0, "API hostname /songs returns migrated data");
  assert(
    cleanSongs.songs.every((song) => song.status === "complete"),
    "API hostname /songs only returns completed songs",
  );
  assert(Boolean(cleanSongs.songs[0]?.model), "song rows expose a model field");
  assert(songsAreNewestFirst(cleanSongs.songs), "API hostname /songs sorts songs by recency");

  const legacySongs = await fetchJson(`${apiBase}/api/songs/?limit=1`);
  assert(Array.isArray(legacySongs.songs), "compatibility /api/songs still works");

  await checkFile(`${apiBase}/songs/${legacyProofSongId}/files/abc`, "text/vnd.abc");
  await checkFile(`${apiBase}/songs/${legacyProofSongId}/files/abc`, "text/vnd.abc", "HEAD");
  await checkFile(`${apiBase}/songs/${legacyProofSongId}/files/mid`, "audio/midi");
  await checkFile(`${apiBase}/songs/${legacyProofSongId}/files/mid`, "audio/midi", "HEAD");
  await checkComposerProof(codexProofSongId, "codex");
  await checkComposerProof(claudeProofSongId, "claude");

  const appResponse = await fetch(appUrl);
  assert(appResponse.ok, `${appUrl} returned ${appResponse.status}`);
  const html = await appResponse.text();
  assert(html.includes("SongGPT") && html.includes('id="root"'), "app URL returns Vite HTML");
}

function checkRepoInvariants() {
  const packageJson = JSON.parse(read("front-end/package.json"));
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  const dependencyNames = Object.keys(dependencies);
  assert(
    !dependencyNames.some((name) => /firebase|openai|@google-cloud/i.test(name)),
    "frontend dependencies do not include Firebase, OpenAI, or Google Cloud SDKs",
  );

  const requirements = read("back-end/requirements.txt");
  assert(
    !/firebase|openai|google-cloud|pyFluidSynth|mido==/i.test(requirements),
    "fallback backend requirements stay provider-free and WAV-free",
  );

  const wrangler = JSON.parse(read("front-end/wrangler.jsonc"));
  assert(wrangler.name === "songgpt", "Wrangler project is songgpt");
  assert(
    wrangler.d1_databases?.some((db) => db.binding === "DB" && db.database_name === "songgpt"),
    "Wrangler config binds D1 as DB",
  );
  assert(
    wrangler.r2_buckets?.some(
      (bucket) => bucket.binding === "SONG_FILES" && bucket.bucket_name === "songgpt-files",
    ),
    "Wrangler config binds R2 songgpt-files as SONG_FILES",
  );
  assert(
    wrangler.vars?.DAILY_SONG_LIMIT === "250" &&
      wrangler.vars?.MAX_PENDING_SONGS === "3" &&
      wrangler.vars?.RATE_LIMIT_REQUESTS === "3" &&
      wrangler.vars?.RATE_LIMIT_WINDOW_SECONDS === "3600",
    "Wrangler config enforces free-tier generation limits",
  );

  const composer = read("composer/songgpt_composer.py");
  assert(
    composer.includes('"https://api.songgpt.soli.blue"') &&
      !composer.includes('"https://api.songgpt.soli.blue/api"'),
    "composer defaults to the API hostname root",
  );
  assert(
    composer.includes('"--safe-mode"') &&
      composer.includes('"--tools"') &&
      !composer.includes('"dontAsk"'),
    "Claude composer runs without bypass permissions or tools",
  );
  assert(
    composer.includes('"required": ["response", "abc"]') &&
      composer.includes('data.setdefault("score", {})') &&
      !composer.includes('"required": ["response", "abc", "score"]'),
    "composer keeps the structured output schema minimal",
  );
  assert(
    composer.includes('"gpt-5.6-sol"') &&
      composer.includes('"anthropic/claude-opus-4-8"') &&
      composer.includes("generator_for_song") &&
      composer.includes('"CODEX_REASONING_EFFORT"') &&
      composer.includes("openai/") &&
      composer.includes('"read-only"'),
    "composer routes Sol and Opus jobs with explicit model provenance",
  );

  const createSongs = read("front-end/functions/api/songs/index.js");
  assert(
    createSongs.includes("generation_rate_limits") &&
      createSongs.includes("MAX_PENDING_SONGS") &&
      createSongs.includes("CF-Connecting-IP") &&
      createSongs.includes("allowedModels"),
    "song creation has hashed per-client, queue, and model guards",
  );

  const app = read("front-end/src/App.jsx");
  const css = read("front-end/src/styles.css").replace(/\s+/g, "");
  assert(
    app.includes('label: "Sol"') &&
      app.includes('label: "Opus"') &&
      app.includes('aria-label="Composition model"'),
    "composer UI exposes the Sol and Opus selector accessibly",
  );
  assert(
    app.includes('<span className="brand-name">SongGPT</span>') &&
      !app.includes("SongGPT.xyz") &&
      !app.includes("<Info"),
    "header uses the clean SongGPT brand without the info control",
  );
  assert(
    app.includes("abcjs-waveform") &&
      app.includes("MutationObserver") &&
      app.includes('navigator.audioSession.type = "playback"') &&
      app.includes("claimAudioPlayback") &&
      app.includes("audioPlayers.forEach") &&
      app.includes("The response did not contain a valid musical score.") &&
      app.includes('title="Generation details"') &&
      app.includes('displayRestart: false') &&
      app.includes('className="instrument-picker"') &&
      app.includes('className="instrument-add"'),
    "audio waveform and icon instrument picker are wired to real controls",
  );
  assert(
    css.includes("overflow-x:clip") &&
      css.includes("overflow-wrap:anywhere") &&
      css.includes(".progress-footer"),
    "failed generation details cannot widen the mobile viewport",
  );
  assert(
    !dependencyNames.includes("react-select"),
    "frontend no longer ships the generic react-select dependency",
  );

  assertTrackedAndNotIgnored("front-end/src/data/defaultSystemMessage.js");
  assertTrackedAndNotIgnored("front-end/src/data/instruments.js");
  assertTrackedAndNotIgnored("scripts/install-composer-service.sh");
  assertTrackedAndNotIgnored("scripts/check-composer-service.sh");
  assertTrackedAndNotIgnored("scripts/check-decommissioned-services.sh");
  assertTrackedAndNotIgnored("front-end/migrations/0003_add_generation_rate_limits.sql");
  assertExecutable("scripts/install-composer-service.sh");
  assertExecutable("scripts/check-composer-service.sh");
  assertExecutable("scripts/check-decommissioned-services.sh");
  assert(
    spawnSync("bash", ["-n", "scripts/install-composer-service.sh"], {
      cwd: root,
      stdio: "ignore",
    }).status === 0,
    "composer service installer has valid shell syntax",
  );
  assert(
    spawnSync("bash", ["-n", "scripts/check-composer-service.sh"], {
      cwd: root,
      stdio: "ignore",
    }).status === 0,
    "composer service health check has valid shell syntax",
  );
  assert(
    spawnSync("bash", ["-n", "scripts/check-decommissioned-services.sh"], {
      cwd: root,
      stdio: "ignore",
    }).status === 0,
    "decommissioned service check has valid shell syntax",
  );
  assert(
    spawnSync("scripts/check-decommissioned-services.sh", {
      cwd: root,
      stdio: "ignore",
    }).status === 0,
    "Firebase/Expo/provider decommission check passes",
  );

  const activeFiles = [
    "front-end/src",
    "front-end/functions",
    "front-end/package.json",
    "front-end/package-lock.json",
    "front-end/wrangler.jsonc",
    "composer",
    "back-end/app",
    "back-end/requirements.txt",
  ].flatMap(listFiles);

  const bannedPatterns = [
    ["Firebase runtime references", /firebase|firestore|appspot|firebaseapp/i],
    ["provider API-key references", /OPENAI[_-]?API[_-]?KEY|api\.openai\.com|openai\.ChatCompletion/i],
    ["Google Cloud logging references", /google\.cloud|CLOUD_LOGGING/i],
    [
      "WAV generation/storage references",
      /midi_to_wav|midi_to_audio|audio\/wav|\.wav\b|fluidsynth\.wav|pyFluidSynth|mido==/i,
    ],
  ];

  for (const [label, pattern] of bannedPatterns) {
    const offenders = activeFiles
      .map((file) => [file, readFileSync(file, "utf8")])
      .filter(([, contents]) => pattern.test(contents))
      .map(([file]) => relative(root, file));
    assert(offenders.length === 0, `${label} absent from active runtime files`);
    if (offenders.length) {
      failures.push(`  ${label}: ${offenders.join(", ")}`);
    }
  }
}

async function main() {
  checkRepoInvariants();
  await checkLiveUrls();

  for (const message of passes) console.log(`ok - ${message}`);
  if (failures.length) {
    for (const message of failures) console.error(`not ok - ${message}`);
    process.exit(1);
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
