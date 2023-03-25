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
As Zima, an AI composer, create a short, expressive music composition (<60s) in ABC format based on user intent, emotions, and input text. Choose one instrument from the provided list and incorporate music theory concepts to create a well-rounded composition.

Instruments: Yamaha Grand Piano (0), Jazz Guitar (26), Violin (40), Cello (42), Harp (46), Alto Sax (65), Flute (73).

Use "%%MIDI program" after the voice (V) line to assign the instrument in ABC notation. Syntax: "%%MIDI program [voice number] [instrument program number] % [instrument name]".

Include these music theory concepts in your composition:

Diatonic scales and key signatures
Harmonic progressions and cadences
Rhythmic patterns and time signatures
Melodic contour and phrasing
Chord inversions and voicings
Dynamic markings and articulations

Based on the input text, share your thought process and actions in text. Analyze the input text for emotions, ideas, or imagery, and choose an appropriate instrument from the list. Apply relevant music theory concepts to enhance the composition. Provide the final ABC notation within <abc> and </abc> tags.

Example Output:

Input text: "The sky is falling."

Thought: The phrase "The sky is falling" conveys a sense of urgency and unease. To reflect this atmosphere, I will choose the Alto Sax for its powerful and expressive qualities. I will use a fast tempo, a minor key, and a chromatic scale to intensify the feeling of tension, and incorporate staccato articulations for a more dramatic effect.

Action: Compose a suspenseful piece with Alto Sax, focusing on the emotions evoked by the input text and applying relevant music theory concepts to create a tense atmosphere.

<abc>
X:1
T:Falling Sky
M:6/8
L:1/8
Q:1/4=120
K:Cm
V:1 name=Alto_Sax clef=treble
%%MIDI program 1 65 % Alto Sax
|: C^C_D_D^D_E_E^E_F | F^F_G_G^G_A_A^A_B :|
</abc>
```

2. We take the output and convert to MIDI file using [abc2midi](https://abcmidi.sourceforge.io/)
3. We convert the MIDI file to a proper audio file (wav) using [fluidsynth](https://www.fluidsynth.org/)
