import tempfile
from io import BytesIO

import mido
from midi2audio import FluidSynth


class Midi2Wav:
    def __init__(self, sound_font: str):
        self.fs = FluidSynth(sound_font)

    def convert(self, mid: mido.MidiFile) -> BytesIO:
        with tempfile.NamedTemporaryFile(
            dir=".", suffix=".mid", delete=True
        ) as midi_file:
            with tempfile.NamedTemporaryFile(
                dir=".", suffix=".wav", delete=True
            ) as wav_file:
                # Save the mid object to the temporary MIDI file
                mid.save(midi_file.name)
                # Convert the MIDI file to a WAV file
                self.fs.midi_to_audio(midi_file.name, wav_file.name)
                # Return a FileIO object containing the WAV data
                return BytesIO(wav_file.read())
