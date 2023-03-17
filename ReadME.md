# songGPT

songGPT is an open-source project that uses ChatGPT to generate musical compositions. The output is converted to MIDI and audio files using a Python script, allowing for the creation of unique and original music. The project is hosted on songGPT.xyz.

## Repository Structure
This repository contains three main folders:

- **back-end**: FastAPI-based Python code for the backend of the SongGPT project. This backend is responsible for handling write operations and interacting with the database (represented by pydantic schemas) and storage (via Firebase Storage). The backend is connected to OpenAI Beta API.

- **frontend**: A React Native cross-platform app. The app uses the nativebase framework, react-navigation, and Firebase.

- **notebooks**: A collection of Jupyter notebooks used for exploration and rapid experimentation.

## Contributing
We welcome contributions to the project! Please see the CONTRIBUTING.md file for more information.

## How does this work?

1. We pass the following prompt to ChatGPT API:

```
As an AI composer, create a unique and expressive composition composition in JSON format based on the given text input.

The JSON should include tempo, time signature, key signature, and tracks, using standard musical notes.

Ensure the JSON is under 1000 characters.

Follow these rules:
1. Compose original, creative, and beautiful music.
2. Avoid questions or comments.
3. Always respond in JSON format.
4. Only use the following instruments: Piano, Violin, Cello, Strings, Viola, Sax, Guitar, Clarinet, Xylophone, Flute

Example output:

{
    "tempo": 120,                                  // Beats per minute (BPM) of the composition
    "time_signature": "4/4",                       // Time signature, e.g., "4/4", "3/4", "6/8", etc.
    "key_signature": "C Major",                    // Key signature, e.g., "C Major", "D minor", etc.
    "tracks": [                                    // An array of tracks, each representing an instrument
        {
            "instrument": "Piano",                 // Name of the instrument
            "start_time": 0.0,                     // Time in seconds when the instrument starts playing
            "notes": "E5-0.5-pp, F#5-0.5-mf, ...", // Notes for the instrument in the format "Pitch-Duration-Dynamic" (e.g., "E5-0.5-pp")
        },
        {
            "instrument": "Violin",
            "start_time": 5.0,                      // The violin starts playing after 5 seconds
            "notes": "E2-1.0-p, A2-1.0-f, ...",
        },
        {
            "instrument": "Cello",
            "start_time": 0.0,
            "notes": "B2-0.25-mp, B2-0.25-mp, ...",
        }
    ]
}

Now, create a musical composition inspired by the following input:  
```

2. We take the output and convert to MIDI file using [mido](https://mido.readthedocs.io/en/latest/)
3. We convert the MIDI file to a proper audio file (wav) using [midi2audio](https://github.com/bzamecnik/midi2audio)
