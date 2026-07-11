import {
  contentTypes,
  cors,
  fileKeys,
  json,
  nowIso,
  requireComposer,
} from "../../../_shared.js";

export const onRequestOptions = () => cors();

export const onRequestPost = async ({ env, request, params }) => {
  const authError = requireComposer(request, env);
  if (authError) return authError;

  const form = await request.formData();
  const response = String(form.get("response") || "");
  const abc = String(form.get("abc") || "");
  const score = String(form.get("score") || "");
  const model = String(form.get("model") || "local-cli").slice(0, 120);
  const midi = form.get("mid");

  if (!response || !abc || !midi) {
    return json({ error: "response, abc, and mid are required." }, 400);
  }

  const keys = fileKeys(params.id);
  await env.SONG_FILES.put(keys.abc, abc, {
    httpMetadata: { contentType: contentTypes.abc },
  });
  await env.SONG_FILES.put(keys.mid, midi, {
    httpMetadata: { contentType: contentTypes.mid },
  });

  const timestamp = nowIso();
  await env.DB.prepare(
    `UPDATE songs
     SET status = 'complete',
         model = ?,
         abc = ?,
         response = ?,
         score_json = ?,
         abc_key = ?,
         midi_key = ?,
         error = NULL,
         updated_at = ?,
         lease_expires_at = NULL
     WHERE id = ?`,
  )
    .bind(
      model,
      abc,
      response,
      score || null,
      keys.abc,
      keys.mid,
      timestamp,
      params.id,
    )
    .run();

  return json({ id: params.id, status: "complete" });
};
