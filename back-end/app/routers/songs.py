from app.daos.songs import SongsDAO
from app.internal.config import log
from app.internal.firebase import upload_file
from app.internal.SongGPT import SongGPT
from app.schemas.songs import SongCreate, SongCreateInput
from fastapi import APIRouter, status

router = APIRouter()


@router.post("/", status_code=status.HTTP_200_OK)
async def create_song(payload: SongCreateInput):
    songGPT = SongGPT()
    # 1. Generate ABC using ChatGPT (LLM)
    log.info("Generating ABC...")
    abc, abc_file_path = songGPT.generate_abc(
        system_message=payload.system_message,
        prompt=payload.prompt,
    )
    log.info("Generated ABC")
    # 2. Convert the ABC to MIDI using ABC2MIDI
    midi_file_path = songGPT.abc_to_midi(abc_file_path)
    # 3. Convert the MIDI file to a WAV file
    wav_file_path = songGPT.midi_to_wav(midi_file_path)
    # 4. Save generated files / data
    songDao = SongsDAO()
    ## Create a new song in firestore
    songID = songDao.create(
        SongCreate(
            **payload.dict(),
            abc=abc,
        )
    )
    # upload all files to google cloud storage
    upload_file(abc_file_path, f"songs/{songID}", f"{songID}.abc", "text/vnd.abc")
    upload_file(midi_file_path, f"songs/{songID}", f"{songID}.mid", "audio/midi")
    upload_file(wav_file_path, f"songs/{songID}", f"{songID}.wav", "audio/wav")
    return songID
