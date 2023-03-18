from uuid import UUID

from app.internal.firebase import db
from app.schemas.songs import SongCreate, SongRead


class SongsDAO:
    def __init__(self):
        self.storage_folder = "songs"
        self.collection_reference = db.collection("songs")

    def get(self, id: UUID) -> SongRead:
        doc = self.collection_reference.document(str(id)).get()
        if doc.exists:
            return SongRead(**doc.to_dict())

    def create(self, song_create: SongCreate) -> UUID:
        data = song_create.dict()
        for key in data:
            if isinstance(data[key], UUID):
                data[key] = str(data[key])
        doc_ref = self.collection_reference.document(str(song_create.id))
        doc_ref.set(data)
        return song_create.id

    def delete(self, id: UUID) -> None:
        self.collection_reference.document(str(id)).delete()
