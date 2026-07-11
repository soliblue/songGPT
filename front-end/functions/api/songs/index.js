import { cors, json, nowIso, songRow } from "../../_shared.js";

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

  const dailyLimit = Number(env.DAILY_SONG_LIMIT || 25);
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const count = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM songs WHERE created_at >= ?",
  )
    .bind(dayStart.toISOString())
    .first();

  if (count?.count >= dailyLimit) {
    return json(
      {
        error:
          "Daily free-tier song limit reached. Try again after the UTC reset.",
      },
      429,
    );
  }

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
      String(body.model || "local-cli").slice(0, 120),
      timestamp,
      timestamp,
    )
    .run();

  return json({ id, status: "queued" });
};
