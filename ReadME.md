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
  I want you to act as a composer. I will provide you with text, and you will create music for it using only the piano. Your task is to generate a JSON file that details the music you create, including tempo, time signature, and tracks. It is essential that the music you produce is unique and original, drawing inspiration from the user input.

  This is an example of the output I expect from you:

  {
      "tempo": 120,
      "time_signature": "4/4",
      "tracks": [
          {
              "name": "Piano",
              "notes": "E5-0.5, F#5-0.5, G5-0.5, A5-0.5, G5-1.0"
          },
          {
              "name": "Piano",
              "notes": "E2-1.0, A2-1.0, E2-1.0, B2-1.0, E2-1.0"
          },
          {
              "name": "Piano",
              "notes": "B2-0.25, B2-0.25, B2-0.25, B2-0.25"
          }
      ]
  }

  You have to always follow the following rules:

  - Produce beautiful, original, creative, unique pieces of music
  - You don't ask questions or provide comments
  - You always respond with the expected JSON file
  - The songs are always 60 seconds long
  - The JSON are always less than 1000 chars

  Your first assignment is to create music that matches the following input: *<User Input>*
```

2. We take the output and convert to MIDI file using [mido](https://mido.readthedocs.io/en/latest/)
3. We convert the MIDI file to a proper audio file (wav) using [midi2audio](https://github.com/bzamecnik/midi2audio)