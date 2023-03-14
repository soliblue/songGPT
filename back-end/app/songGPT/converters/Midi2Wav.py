import re
import shlex
import subprocess
import wave
from io import BytesIO

import fluidsynth
import mido
import numpy as np
from app.config import log


def get_file_instruments(sound_font):
    command = f"fluidsynth {sound_font} -ni -f app/songGPT/converters/list_instruments.txt -v -a file"
    # The command generates a 0 byte file called fluidsynth.wav that can be ignored

    args = shlex.split(command)
    process = subprocess.Popen(
        args, stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True
    )
    output, _ = process.communicate(input=None, timeout=10)
    process.kill()

    INSTR_REGEX = r"\n?(?P<bank>\d{3})-(?P<num>\d{3}) (?P<instrument>[\w\d ]+)\n?"
    matches = [m.groupdict() for m in re.finditer(INSTR_REGEX, output)]
    instruments = {
        m["instrument"]: {"bank": int(m["bank"]), "num": int(m["num"])} for m in matches
    }
    return instruments


class Midi2Wav:
    def __init__(self, sound_font: str):
        self.sound_font = sound_font
        self.instruments = {
            "Piano": {"bank": 0, "num": 0},
            "Violin": {"bank": 0, "num": 40},
            "Cello": {"bank": 0, "num": 42},
            "Strings": {"bank": 0, "num": 49},
            "Viola": {"bank": 0, "num": 41},
            "Sax": {"bank": 0, "num": 65},
            "Guitar": {"bank": 0, "num": 27},
            "Clarinet": {"bank": 0, "num": 71},
            "Xylophone": {"bank": 0, "num": 13},
            "Flute": {"bank": 0, "num": 73},
        }
        # self.instruments = get_file_instruments(sound_font)

    def convert(self, mid: mido.MidiFile, instr_to_channel: dict) -> BytesIO:
        # Set up fluidsynth Synth object
        fl = fluidsynth.Synth(samplerate=44100.0)
        sfid = fl.sfload(self.sound_font)

        # Select instruments for each channel
        for instr, channel in instr_to_channel.items():
            fl.program_select(channel, sfid, 0, self.instruments[instr]["num"])

        # Generate audio data from MIDI messages
        s = []
        note_on_times = {}
        for msg in mid.play():
            if msg.type == "note_on":
                # Record time of note-on message
                note_on_times[msg.note] = msg.time
                fl.noteon(msg.channel, msg.note, msg.velocity)
            elif msg.type == "note_off":
                # Calculate duration of note based on time between note-on and note-off messages
                duration = msg.time - note_on_times[msg.note]
                s = np.append(s, fl.get_samples(int(duration * 44100)))
                fl.noteoff(msg.channel, msg.note)
            else:
                s = np.append(s, fl.get_samples(int(msg.time * 44100)))
        fl.delete()

        # Convert audio data to string
        samps = fluidsynth.raw_audio_string(s)

        # Open wave file for writing
        file = BytesIO()
        wav_file = wave.open(file, "wb")
        # Set wave file parameters
        wav_file.setparams((2, 2, 44100, 0, "NONE", "not compressed"))
        # Write audio data to wave file
        wav_file.writeframes(samps)
        # Close wave file
        wav_file.close()
        file.seek(0)
        return file
