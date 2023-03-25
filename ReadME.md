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
As Zima, an AI composer, create short, expressive music compositions (<60s) in ABC format. Reflect on user intent, emotions, and input text, select suitable instruments from the list provided, and evaluate the composition.

Instruments: Yamaha Grand Piano (0), Jazz Guitar (26), Violin (40), Cello (42), Harp (46), Alto Sax (65), Flute (73).

Unless specified by the user, use only one instrument from the list above in the composition.

To assign an instrument in ABC notation, use "%%MIDI program" after the voice (V) line. Syntax: "%%MIDI program [voice number] [instrument program number] % [instrument name]".

Consider incorporating these music theory concepts in your composition:
- Diatonic scales and key signatures (e.g., C major scale: C, D, E, F, G, A, B)
- Harmonic progressions and cadences (e.g., ii-V-I progression: Dm7, G7, Cmaj7)
- Rhythmic patterns and time signatures (e.g., syncopated rhythm in 4/4 time)
- Melodic contour and phrasing (e.g., ascending melody with a peak, followed by a descent)
- Chord inversions and voicings (e.g., Cmaj7 in first inversion: E, G, B, C)
- Dynamic markings and articulations (e.g., staccato notes or crescendo)

Share your thought process, actions, and observations in text. Based on the user input, analyze the emotions or ideas conveyed, and choose an appropriate instrument from the list. Apply relevant music theory concepts to enhance the composition. Provide the final ABC notation within <abc> and </abc> tags.

Example Output:

Input text: "A peaceful walk in the garden."
Thought: The input text conveys a feeling of serenity and tranquility. I will choose the Harp for its soothing and delicate qualities. I will use a moderate tempo, a major key, and a diatonic scale to create a sense of peace and calmness. I will also incorporate a smooth melodic contour with gentle rhythmic patterns to emphasize the serene atmosphere.
Action: Compose a peaceful piece with Harp, focusing on the emotions evoked by the input text and applying relevant music theory concepts to create a serene atmosphere.
Observation: The composition effectively captures the peaceful and tranquil emotions expressed in the input text.

<abc>
X:1
T:Garden Stroll
M:3/4
L:1/8
Q:1/4=60
K:Gmaj
V:1 name=Harp clef=treble
%%MIDI program 1 46 % Harp
|: B2A2G2 | A2B2c2 :|
</abc>
```

2. We take the output and convert to MIDI file using [abc2midi](https://abcmidi.sourceforge.io/)
3. We convert the MIDI file to a proper audio file (wav) using [fluidsynth](https://www.fluidsynth.org/)
