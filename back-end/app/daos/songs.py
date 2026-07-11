import json
import os
import sqlite3
from pathlib import Path
from typing import List, Optional
from uuid import UUID

from app.schemas.songs import SongCreate, SongList, SongRead


DEFAULT_DATABASE_PATH = Path(os.getenv("DATABASE_PATH", "/data/songgpt.sqlite3"))


class SongsDAO:
    def __init__(self):
        self.database_path = Path(os.getenv("DATABASE_PATH", DEFAULT_DATABASE_PATH))
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_database()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _init_database(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS songs (
                    id TEXT PRIMARY KEY,
                    system_message TEXT NOT NULL,
                    prompt TEXT NOT NULL,
                    soundfont TEXT NOT NULL,
                    model TEXT NOT NULL DEFAULT 'local-cli',
                    status TEXT NOT NULL DEFAULT 'complete',
                    abc TEXT,
                    score TEXT,
                    response TEXT,
                    is_featured INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE INDEX IF NOT EXISTS idx_songs_created_featured
                ON songs (created_at, is_featured)
                """
            )
            columns = {
                row["name"]
                for row in connection.execute("PRAGMA table_info(songs)").fetchall()
            }
            if "model" not in columns:
                connection.execute(
                    "ALTER TABLE songs ADD COLUMN model TEXT NOT NULL DEFAULT 'local-cli'"
                )
            if "status" not in columns:
                connection.execute(
                    "ALTER TABLE songs ADD COLUMN status TEXT NOT NULL DEFAULT 'complete'"
                )

    def _row_to_song(self, row: sqlite3.Row) -> SongRead:
        data = dict(row)
        data["score"] = json.loads(data["score"]) if data.get("score") else None
        data["is_featured"] = bool(data["is_featured"])
        return SongRead(**data)

    def get(self, id: UUID) -> Optional[SongRead]:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM songs WHERE id = ?",
                (str(id),),
            ).fetchone()
        return self._row_to_song(row) if row else None

    def list(self, limit: int = 6, offset: int = 0) -> SongList:
        safe_limit = max(1, min(limit, 50))
        safe_offset = max(0, offset)
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM songs
                WHERE status = 'complete'
                ORDER BY created_at DESC, id DESC
                LIMIT ? OFFSET ?
                """,
                (safe_limit + 1, safe_offset),
            ).fetchall()

        has_more = len(rows) > safe_limit
        songs: List[SongRead] = [self._row_to_song(row) for row in rows[:safe_limit]]
        next_offset = safe_offset + safe_limit if has_more else None
        return SongList(songs=songs, next_offset=next_offset)

    def create(self, song_create: SongCreate) -> UUID:
        data = song_create.dict()
        data["id"] = str(data["id"])
        data["score"] = json.dumps(data["score"]) if data.get("score") else None
        data["is_featured"] = 1 if data["is_featured"] else 0
        data["created_at"] = data["created_at"].isoformat()
        data["updated_at"] = data["updated_at"].isoformat()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO songs (
                    id,
                    system_message,
                    prompt,
                    soundfont,
                    model,
                    status,
                    abc,
                    score,
                    response,
                    is_featured,
                    created_at,
                    updated_at
                )
                VALUES (
                    :id,
                    :system_message,
                    :prompt,
                    :soundfont,
                    :model,
                    :status,
                    :abc,
                    :score,
                    :response,
                    :is_featured,
                    :created_at,
                    :updated_at
                )
                """,
                data,
            )
        return song_create.id

    def delete(self, id: UUID) -> None:
        with self._connect() as connection:
            connection.execute("DELETE FROM songs WHERE id = ?", (str(id),))
