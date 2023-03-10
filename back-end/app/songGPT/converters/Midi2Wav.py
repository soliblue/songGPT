import re
import shlex
import subprocess
import tempfile
from io import BytesIO

import mido


def get_file_instruments(sound_font):
    command = f"fluidsynth {sound_font} -f app/songGPT/converters/list_instruments.txt -in -v -a file"

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
            "Yamaha Grand Piano": {"bank": 0, "num": 0},
            "Violin": {"bank": 0, "num": 40},
            "Cello": {"bank": 0, "num": 42},
        }
        # self.instruments = get_file_instruments(sound_font) Should work ;)

    def convert(self, mid: mido.MidiFile, instr_to_channel: dict) -> BytesIO:
        with tempfile.NamedTemporaryFile(
            dir=".", suffix=".mid", delete=True
        ) as midi_file:
            with tempfile.NamedTemporaryFile(
                dir=".", suffix=".wav", delete=True
            ) as wav_file:
                with tempfile.NamedTemporaryFile(
                    dir=".", suffix=".txt", mode="w", delete=True
                ) as config_file:
                    # Save the mid object to the temporary MIDI file
                    mid.save(midi_file.name)
                    # Convert the MIDI file to a WAV file
                    config = [
                        f"prog {channel} {self.instruments[instr]['num']}"
                        for instr, channel in instr_to_channel.items()
                    ] + ["channels"]
                    config_file.write("\n".join(config))
                    config_file.flush()

                    command = f"fluidsynth -ni -g 0.2 {self.sound_font} {midi_file.name} -F {wav_file.name} -r 44100 -f {config_file.name} -a file"

                    print(f"Running command: {command}")

                    subprocess.call(
                        shlex.split(command),
                        stdout=None,
                    )
                    # fluidsynth FluidR3_GM.sf2 midi_file.name -F wav_file.name -r 44100 -f config_file.name
                    # Return a FileIO object containing the WAV data
                    return BytesIO(wav_file.read())
