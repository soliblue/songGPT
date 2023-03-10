import os
from io import BytesIO, StringIO

from app.config import log
from app.daos.songs import SongsDAO
from app.firebase import upload_file
from app.schemas.songs import SongCreate, SongCreateInput
from app.songGPT.converters.Json2Midi import Json2Midi
from app.songGPT.converters.Midi2Wav import Midi2Wav
from app.songGPT.generators.ChatGPT import ChatGPT
from app.songGPT.JsonAudio import JsonAudio
from fastapi import APIRouter, status

router = APIRouter()

MIDI2WAV_CONVERTER = Midi2Wav(sound_font="app/data/soundfonts/FluidR3_GM.sf2")
JSON2MIDI_CONVERTER = Json2Midi()

log.info(f"Loaded instruments: {MIDI2WAV_CONVERTER.instruments}")


@router.post("/", status_code=status.HTTP_200_OK)
async def create_song(payload: SongCreateInput):
    # read the content of the file pre_prompt.txt into a string
    with open("app/songGPT/generators/pre_prompt.txt", "r") as f:
        pre_prompt = f.read()
        history = [{"content": pre_prompt, "role": "user"}]
    # load a new instance of the ChatGPT with the pre_prompt
    chatGPT = ChatGPT(history=history)
    score = chatGPT.generate(
        input=payload.prompt,
    )

    log.info(f"{payload.prompt=}{score=}")
    json_audio = JsonAudio.parse_raw(score)
    mid = JSON2MIDI_CONVERTER.convert(json_audio)
    # create a new file in python and store it in firebase
    wav_file = MIDI2WAV_CONVERTER.convert(
        mid, Json2Midi.get_instrument_to_channel_mapping(json_audio)
    )
    # create a new file in python and store it in firebase
    midi_file = BytesIO()
    mid.save(file=midi_file)
    json_file = StringIO(json_audio.json())
    # init connection to firestore songs collections
    songDao = SongsDAO()
    # create a new song in firestore
    songID = songDao.create(
        SongCreate(
            history=history,
            score=json_audio,
            prompt=payload.prompt,
        )
    )
    # upload both files to firebase
    upload_file(
        json_file,
        f"songs/{songID}",
        f"{songID}.json",
        content_type="application/json",
    )
    upload_file(
        midi_file, f"songs/{songID}", f"{songID}.mid", content_type="audio/midi"
    )
    upload_file(wav_file, f"songs/{songID}", f"{songID}.wav", content_type="audio/wav")
    return songID
