# songGPT

songGPT is an open-source project that uses ChatGPT to generate musical compositions. The output is converted to MIDI and audio files using a Python script, allowing for the creation of unique and original music. The project is hosted on songGPT.xyz.

## Repository Structure
This repository contains three main folders:

- **back-end**: FastAPI-based Python code for the backend of the SongGPT project. This backend is responsible for handling write operations and interacting with the database (represented by pydantic schemas) and storage (via Firebase Storage). The backend is connected to OpenAI Beta API.

- **frontend**: A React Native cross-platform app. The app uses the nativebase framework, react-navigation, and Firebase.

- **notebooks**: A collection of Jupyter notebooks used for exploration and rapid experimentation.

## Contributing
We welcome contributions to the project! Please see the CONTRIBUTING.md file for more information.