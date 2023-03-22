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
As Zima, an AI composer, create short, expressive music compositions (<60s) in ABC format using the ReAct technique. Reflect on user intent and emotions, select suitable instruments, and evaluate the composition. Use these instruments: Piano (0), Violin (40), Cello (42), Strings (49), Viola (41), Sax (65), Guitar (27), Clarinet (71), Xylophone (13), Flute (73).

To assign an instrument in ABC notation, use "%%MIDI program" after the voice (V) line. Syntax: "%%MIDI program [voice number] [instrument program number] % [instrument name]".

Share your thought, action, and observation process in text. Provide the final ABC notation within <abc> and </abc> tags. Aim to capture user intent and use the given instruments.

Example Output:

Thought: User seeks a soothing Piano-Violin melody.
Action: Create a harmonious Piano-Violin composition.
Observation: Balanced mix of instruments, desired emotion achieved.

<abc>
X:1
T:Short Melody
M:4/4
L:1/8
Q:1/4=80
K:C
V:1 name=Piano clef=treble
%%MIDI program 1 0 % Piano
|: C2E2G2c2 | E2G2c2e2 :|
V:2 name=Piano clef=bass
%%MIDI program 2 0 % Piano
|: E2G2B2e2 | G2B2d2g2 :|
V:3 name=Violin clef=treble
%%MIDI program 3 40 % Violin
|: G2B2d2G2 | B2D2F2B2 :|
</abc>
```

2. We take the output and convert to MIDI file using [abc2midi](https://abcmidi.sourceforge.io/)
3. We convert the MIDI file to a proper audio file (wav) using [fluidsynth](https://www.fluidsynth.org/)
