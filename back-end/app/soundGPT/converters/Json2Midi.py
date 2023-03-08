from app.soundGPT.JsonAudio import JsonAudio


class Json2Midi:
    def __init__(self, json: JsonAudio):
        self.json = json

    def convert(self):
        pass

    @staticmethod
    def parse_note(pitch):
        """Convert a pitch name to a MIDI note number."""
        # Define a dictionary of note names and their offsets from C
        note_names = {
            "C": 0,
            "C#": 1,
            "Db": 1,
            "D": 2,
            "D#": 3,
            "Eb": 3,
            "E": 4,
            "F": 5,
            "F#": 6,
            "Gb": 6,
            "G": 7,
            "G#": 8,
            "Ab": 8,
            "A": 9,
            "A#": 10,
            "Bb": 10,
            "B": 11,
        }

        # Split the pitch name into note name and octave number
        note_name = pitch[:-1]
        octave = int(pitch[-1])

        # Calculate the MIDI note number based on the formula:
        # note_number = (octave + 1) * 12 + note_names[note_name]
        note_number = (octave + 1) * 12 + note_names[note_name]

        # Return the MIDI note number
        return note_number
