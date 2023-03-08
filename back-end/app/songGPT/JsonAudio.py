import re
from typing import List, Union

from pydantic import BaseModel, confloat, conint, constr, validator

NOTE_REGEX = r"(?P<name>[A-G][#b]?)(?P<octave>[1-9])-(?P<duration>\d+?[.]?\d+?)"
TIME_SIGNATURE_REGEX = r"(?P<numerator>\d+?)/(?P<denominator>\d+?)"


class JsonTrackNote(BaseModel):
    name: constr(regex=r"[A-G][#b]?")
    octave: conint(ge=1, le=9)
    duration: confloat(ge=0)


class JsonTrack(BaseModel):
    instrument: str
    notes: Union[constr(regex=NOTE_REGEX, min_length=1), List[JsonTrackNote]]

    @validator("notes")
    def validate_notes(cls, v) -> List[JsonTrackNote]:
        """Parse notes string into a list of Tuples(name, octave, duration)"""
        if not v:
            return []
        if isinstance(v, str):
            v = [
                JsonTrackNote.parse_obj(m.groupdict())
                for m in re.finditer(NOTE_REGEX, v)
            ]
        return v


class JsonTimeSignature(BaseModel):
    numerator: conint(ge=0, le=255)
    denominator: conint(ge=0, le=255)


class JsonAudio(BaseModel):
    tempo: conint(ge=0)  # bpm - beats per minute
    time_signature: Union[constr(regex=TIME_SIGNATURE_REGEX), JsonTimeSignature]
    tracks: List[JsonTrack]

    @validator("time_signature")
    def check_time_signature(cls, v) -> JsonTimeSignature:
        if isinstance(v, str):
            v = v.replace(" ", "")
            values = v.split("/")
            return JsonTimeSignature(numerator=values[0], denominator=values[1])
        return v
