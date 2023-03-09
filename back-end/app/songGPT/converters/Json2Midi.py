import mido
from app.songGPT.JsonAudio import JsonAudio, JsonTrackNote


class Json2Midi:
    # instrument_to_channel =
    def __init__(self):
        pass

    def convert(self, json_audio: JsonAudio) -> mido.MidiFile:
        # Create a MIDI file object
        mid = mido.MidiFile()

        # create instrument_to_channel mapping
        instrument_to_channel = self.get_instrument_to_channel_mapping(json_audio)

        # Create a track for each track in the score
        for track in json_audio.tracks:
            # Add a track name meta message
            mid_track = mido.MidiTrack()
            mid_track.append(mido.MetaMessage("track_name", name=track.instrument))

            # Set the tempo meta message based on the score tempo
            mid_track.append(
                mido.MetaMessage("set_tempo", tempo=mido.bpm2tempo(json_audio.tempo))
            )

            # Set the time signature meta message based on the score time signature
            mid_track.append(
                mido.MetaMessage(
                    "time_signature",
                    numerator=json_audio.time_signature.numerator,
                    denominator=json_audio.time_signature.denominator,
                )
            )

            # Add note messages for each note in the track
            for note in track.notes:
                # Extract pitch and duration from the note string
                pitch = self.parse_note(note)
                duration = int(
                    note.duration * mid.ticks_per_beat * (json_audio.tempo / 60)
                )

                # Add note on and note off messages with velocity 64 and time 0
                mid_track.append(
                    mido.Message(
                        "note_on",
                        channel=instrument_to_channel[track.instrument],
                        note=pitch,
                        velocity=64,
                        time=0,
                    )
                )
                mid_track.append(
                    mido.Message(
                        "note_off",
                        channel=instrument_to_channel[track.instrument],
                        note=pitch,
                        velocity=64,
                        time=duration,
                    )
                )

            # Add end of track meta message
            mid_track.append(mido.MetaMessage("end_of_track"))

            # Append the track to the MIDI file object
            mid.tracks.append(mid_track)

        return mid

    @staticmethod
    def get_instrument_to_channel_mapping(json_audio: JsonAudio) -> dict:
        instrument_set = set(track.instrument for track in json_audio.tracks) - {
            "Drums"
        }
        channels = list(range(0, 9)) + list(range(10, 15))
        instrument_to_channel = {
            instrument: channel for channel, instrument in zip(channels, instrument_set)
        }
        return instrument_to_channel

    @staticmethod
    def parse_note(note: JsonTrackNote):
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

        # Calculate the MIDI note number based on the formula:
        # note_number = (octave + 1) * 12 + note_names[note_name]
        note_number = (note.octave + 1) * 12 + note_names[note.name]

        # Return the MIDI note number
        return note_number
