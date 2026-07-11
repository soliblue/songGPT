import os
import re
import json
import subprocess
from pathlib import Path
from typing import Optional

from app.schemas.songs import SongGeneration


OUTPUT_SCHEMA = {
    "type": "object",
    "properties": {
        "response": {
            "type": "string",
            "description": "Thought process, action, and observation text shown to the user.",
        },
        "abc": {
            "type": "string",
            "description": "Valid ABC notation only, with no surrounding XML tags.",
        },
        "score": {
            "type": "object",
            "description": "Optional structured quality and musical metadata.",
            "additionalProperties": True,
        },
    },
    "required": ["response", "abc"],
    "additionalProperties": False,
}


class SongGPT:
    def __init__(self):
        self.claude_bin = os.getenv("CLAUDE_BIN", "claude")
        self.claude_model = os.getenv("CLAUDE_MODEL", "claude-opus-4-8")
        self.timeout = int(os.getenv("GENERATOR_TIMEOUT_SECONDS", "240"))

    def generate_abc(
        self,
        system_message: str,
        prompt: str,
        output_dir: Optional[str] = None,
    ) -> tuple[str, str, str, Optional[dict]]:
        """
        Generate an ABC notation file using a local Claude CLI subscription.
        """
        generation = self._run_claude(system_message, prompt)
        abc = self._extract_abc(generation.abc)
        response = generation.response
        if "<abc>" not in response:
            response = f"{response}\n\n<abc>\n{abc}\n</abc>"

        directory = Path(output_dir or os.getcwd())
        directory.mkdir(parents=True, exist_ok=True)
        abc_file_path = directory / "input.abc"
        abc_file_path.write_text(abc, encoding="utf-8")
        return response, abc, str(abc_file_path), generation.score

    def _run_claude(self, system_message: str, prompt: str) -> SongGeneration:
        full_prompt = (
            "System message for the composition:\n"
            f"{system_message}\n\n"
            "User input:\n"
            f"{prompt}\n\n"
            "Return a short original composition in the required JSON shape. "
            "The abc field must contain only valid ABC notation."
        )
        command = [
            self.claude_bin,
            "--model",
            self.claude_model,
            "--print",
            "--output-format",
            "json",
            "--json-schema",
            json.dumps(OUTPUT_SCHEMA),
            "--no-session-persistence",
            "--permission-mode",
            "dontAsk",
            "--tools",
            "",
            full_prompt,
        ]
        completed = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=self.timeout,
        )
        return SongGeneration(**self._parse_generator_stdout(completed.stdout))

    @staticmethod
    def _parse_generator_stdout(stdout: str) -> dict:
        data = json.loads(stdout)
        if "abc" in data:
            return data
        result = data.get("result", data)
        return json.loads(result) if isinstance(result, str) else result

    @staticmethod
    def _extract_abc(text: str) -> str:
        match = re.search(r"<abc>\*?(.*?)\*?</abc>", text, flags=re.DOTALL)
        return (match.group(1) if match else text).strip()

    @staticmethod
    def abc_to_midi(abc_file_path: str) -> str:
        """
        Convert an ABC notation file to a MIDI file.
        """
        midi_file_path = str(Path(abc_file_path).with_name("output.mid"))
        subprocess.run(
            ["abc2midi", abc_file_path, "-o", midi_file_path],
            check=True,
            capture_output=True,
            text=True,
        )
        return midi_file_path
