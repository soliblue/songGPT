CREATE TABLE IF NOT EXISTS generation_rate_limits (
  client_key TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (client_key, window_start)
) WITHOUT ROWID;
