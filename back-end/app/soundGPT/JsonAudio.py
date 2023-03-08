import re
from typing import List, Tuple

from pydantic import BaseModel, conint, constr, validator

NOTE_REGEX = r"(?P<name>[A-G][#b]?)(?P<octave>[1-9])-(?P<duration>\d+?[.]?\d+?)"
TIME_SIGNATURE_REGEX = r"(?P<numerator>\d+?)/(?P<denominator>\d+?)"


class JsonTrack(BaseModel):
    instrument: str
    notes: constr(regex=NOTE_REGEX, min_length=1)
    channel: conint(ge=0, le=15)

    def list_notes(self) -> List[Tuple(str, int, float)]:
        if not self.notes:
            return []
        notes = [m.groupdict() for m in re.finditer(NOTE_REGEX, self.notes)]
        return [(n["name"], int(n["octave"]), float(n["duration"])) for n in notes]


class JsonAudio(BaseModel):
    tempo: conint(ge=0)  # bpm - beats per minute
    time_signature: constr(regex=TIME_SIGNATURE_REGEX)
    tracks: List[JsonTrack]

    @validator("time_signature")
    def check_time_signature(cls, v):
        v = v.replace(" ", "")
        for x in v.split("/"):
            x = int(x)
            if x < 0 or x > 255:
                raise ValueError("Time signature must be between 0 and 255")
        return v
