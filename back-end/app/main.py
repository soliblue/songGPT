from dotenv import load_dotenv
from pydantic import BaseModel, contstr
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter, HTTPException, status

from app.soundGPT.JsonAudio import JsonAudio
from app.soundGPT.generators.OpenAIGenerator import OpenAIGenerator
from app.soundGPT.generators.OpenAIGeneratorMessages import MESSAGES_1

router = APIRouter()


@router.get("/ping", status_code=status.HTTP_200_OK, response_model=str)
async def pong():
    return "pong!"


class CreateSongInput(BaseModel):
    prompt: contstr(min_length=1, max_length=500)


openai_generator = OpenAIGenerator(previous_messages=MESSAGES_1)


@router.post("/songs/", status_code=status.HTTP_200_OK, response_model=str)
async def audio(payload: CreateSongInput):

    # Create firebase document

    # Ask the generator to generate a json parseable string
    response = openai_generator.generate(
        payload.prompt,
    )

    # Try to parse the response into a JsonAudio object
    try:
        json_audio = JsonAudio.parse_raw(response)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Something went wrong please try again",
        )

    # Convert the JsonAudio object into a midi file / wav file

    # Store


def create_application() -> FastAPI:
    is_env_loaded = load_dotenv()
    assert is_env_loaded, "Failed to load .env file"
    application = FastAPI(
        title="SongGPT",
        description="Experimental open-source project exploring the potential of LLMs, specifically ChatGPT, in generating original and customizable musical compositions.",
        version="0.0.1",
    )
    # middlewares
    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # ping pong
    application.include_router(router, prefix="", tags=["audioGTP"])
    return application


app = create_application()
