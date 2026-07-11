import { cors, json, nowIso, songRow } from "../../_shared.js";

const allowedModels = new Set([
  "openai/gpt-5.6-sol",
  "anthropic/claude-opus-4-8",
]);
const defaultModel = "openai/gpt-5.6-sol";

const clientKey = async (request, env) => {
  const ip =
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown";
  const salt = env.RATE_LIMIT_SALT || env.COMPOSER_TOKEN || "songgpt";
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${ip}`),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const enforceCreationRateLimit = async (env, request) => {
  const limit = Math.max(1, Number(env.RATE_LIMIT_REQUESTS || 3));
  const windowSeconds = Math.max(60, Number(env.RATE_LIMIT_WINDOW_SECONDS || 3600));
  const nowSeconds = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(nowSeconds / windowSeconds) * windowSeconds;
  const result = await env.DB.prepare(
    `INSERT INTO generation_rate_limits (client_key, window_start, request_count)
     VALUES (?, ?, 1)
     ON CONFLICT(client_key, window_start) DO UPDATE
     SET request_count = request_count + 1
     WHERE request_count < ?`,
  )
    .bind(await clientKey(request, env), windowStart, limit)
    .run();

  if (Number(result.meta?.changes || 0) > 0) return null;

  const retryAfter = Math.max(1, windowStart + windowSeconds - nowSeconds);
  return json(
    { error: `You can create up to ${limit} songs per hour. Try again later.` },
    429,
    { "Retry-After": String(retryAfter) },
  );
};

export const onRequestOptions = () => cors();

export const onRequestGet = async ({ env, request }) => {
  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(Number(url.searchParams.get("limit") || 6), 50));
  const offset = Math.max(0, Number(url.searchParams.get("offset") || 0));
  const result = await env.DB.prepare(
    `SELECT * FROM songs
     WHERE status = 'complete'
     ORDER BY created_at DESC, id DESC
     LIMIT ? OFFSET ?`,
  )
    .bind(limit + 1, offset)
    .all();
  const rows = result.results || [];
  const hasMore = rows.length > limit;
  return json({
    songs: rows.slice(0, limit).map(songRow),
    next_offset: hasMore ? offset + limit : null,
  });
};

export const onRequestPost = async ({ env, request }) => {
  const body = await request.json().catch(() => null);
  if (!body?.system_message || !body?.prompt) {
    return json({ error: "system_message and prompt are required." }, 400);
  }

  const model = String(body.model || defaultModel);
  if (!allowedModels.has(model)) {
    return json({ error: "Unsupported composition model." }, 400);
  }

  const dailyLimit = Number(env.DAILY_SONG_LIMIT || 250);
  const maxPending = Math.max(1, Number(env.MAX_PENDING_SONGS || 3));
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const [count, pending] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS count FROM songs WHERE created_at >= ?")
      .bind(dayStart.toISOString())
      .first(),
    env.DB.prepare(
      "SELECT COUNT(*) AS count FROM songs WHERE status IN ('queued', 'processing')",
    ).first(),
  ]);

  if (count?.count >= dailyLimit) {
    return json(
      {
        error:
          "Daily free-tier song limit reached. Try again after the UTC reset.",
      },
      429,
    );
  }

  if (pending?.count >= maxPending) {
    return json(
      { error: "The composer queue is full. Please try again in a few minutes." },
      429,
      { "Retry-After": "60" },
    );
  }

  const rateLimitError = await enforceCreationRateLimit(env, request);
  if (rateLimitError) return rateLimitError;

  const id = crypto.randomUUID();
  const timestamp = nowIso();
  await env.DB.prepare(
    `INSERT INTO songs (
      id,
      system_message,
      prompt,
      soundfont,
      model,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, 'queued', ?, ?)`,
  )
    .bind(
      id,
      String(body.system_message).slice(0, 2500),
      String(body.prompt).slice(0, 1000),
      String(body.soundfont || "FluidR3_GM.sf2"),
      model,
      timestamp,
      timestamp,
    )
    .run();

  return json({ id, status: "queued" });
};
