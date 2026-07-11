CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  system_message TEXT NOT NULL,
  prompt TEXT NOT NULL,
  soundfont TEXT NOT NULL DEFAULT 'FluidR3_GM.sf2',
  status TEXT NOT NULL DEFAULT 'queued',
  abc TEXT,
  response TEXT,
  score_json TEXT,
  error TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0,
  abc_key TEXT,
  midi_key TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  processing_started_at TEXT,
  lease_expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_songs_list
ON songs (created_at, is_featured);

CREATE INDEX IF NOT EXISTS idx_songs_status_created
ON songs (status, created_at);

CREATE INDEX IF NOT EXISTS idx_songs_created_at
ON songs (created_at);
