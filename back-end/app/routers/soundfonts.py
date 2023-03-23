import os
import re
import shlex
import subprocess
from typing import Dict, List

from fastapi import APIRouter, status

router = APIRouter()


@router.get("/", status_code=status.HTTP_200_OK, response_model=List[str])
async def list_soundfonts():
    soundfonts = os.listdir("app/data/soundfonts")
    return soundfonts


@router.get(
    "/{soundfont}/instruments",
    status_code=status.HTTP_200_OK,
    response_model=List[Dict],
)
async def list_instruments(soundfont: str):
    path = f"app/data/soundfonts/{soundfont}"
    command = f"fluidsynth {path} -a file -n -q"
    input_str = "inst 1"

    args = shlex.split(command)
    process = subprocess.Popen(
        args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True
    )
    output, _ = process.communicate(input=input_str)
    process.kill()
    try:
        os.remove("fluidsynth.wav")
    except FileNotFoundError:
        pass

    INSTR_REGEX = r"\n?(?P<bank>\d{3})-(?P<num>\d{3}) (?P<instrument>[\w\d\- ]+)\n"
    matches = [m.groupdict() for m in re.finditer(INSTR_REGEX, output)]
    return matches
