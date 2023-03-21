import os
import re

import openai


class SongGPT:
    def __init__(self):
        # Set the API key and organization ID for OpenAI
        openai.api_key = os.getenv("OPENAI_API_KEY")
        openai.organization = os.getenv("OPENAI_ORGANIZATION")

    def generate_abc(self, system_message: str, prompt: str) -> str:
        """
        Generate an ABC notation file using ChatGPT based on the given prompt and system message.
        """
        # Create a ChatCompletion object for GPT-4
        response = openai.ChatCompletion.create(
            model="gpt-4",
            user="songGPT",
            messages=[
                {
                    "content": system_message,
                    "role": "system",
                },
                {
                    "content": prompt,
                    "role": "user",
                },
            ],
        )
        response = response["choices"][0]["message"]["content"]
        abc = (
            re.search(r"<abc>\*?(.*?)\*?</abc>", response, flags=re.DOTALL)
            .group(1)
            .strip()
        )
        abc_file_path = "./input.abc"
        with open(abc_file_path, "w") as f:
            f.write(abc)
        return response, abc, abc_file_path

    @staticmethod
    def abc_to_midi(abc_file_path: str) -> str:
        """
        Convert an ABC notation file to a MIDI file.
        """
        midi_file_path = "./output.mid"
        os.system(f"abc2midi {abc_file_path} -o {midi_file_path}")
        return midi_file_path

    @staticmethod
    def midi_to_wav(midi_file_path: str) -> str:
        """
        Convert a MIDI file to a WAV audio file.
        """
        wav_file_path = "./output.wav"
        soundfont_path = "app/internal/soundfont.sf2"
        os.system(
            f"fluidsynth -ni {soundfont_path} {midi_file_path} -F {wav_file_path} -r 44100"
        )
        return wav_file_path
