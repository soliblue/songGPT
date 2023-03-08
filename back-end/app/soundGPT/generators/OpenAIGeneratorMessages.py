MESSAGES_1 = [
    {
        "content": "I need your support generating unique and original music based on the user input. Make sure to produce unique and original music inpsired by the user input",
        "role": "user",
    },
    {
        "content": "This is an example JSON file showcasing the format of the output I expect from you.",
        "role": "user",
    },
    {
        "content": """
              {
                "tempo": 80,
                "time_signature": "4/4",
                "tracks": [
                  {
                    "instrument": "Piano",
                    "notes": "A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5, A5-1.5, D5-0.5, F#5-1.5, D5-0.5",
                    "channel": 0
                  },
                  {
                    "instrument": "Strings",
                    "notes": "A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5, A3-1.5, D3-0.5, F#3-1.5, D3-0.5",
                    "channel": 1
                  },
                  {
                    "instrument": "Synth",
                    "notes": "A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5, A5-1.5, D6-0.5, F#5-1.5, D6-0.5",
                    "channel": 2
                  },
                  {
                    "instrument": "Drums",
                    "notes": "C2-1.0, C2-0.5, C2-0.5, C2-0.5, C2-0.5, C2-0.5, C2-0.5, C2-0.5, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, C2-0.25, G3-2.0, G3-2.0, G3-2.0, G3-2.0"
                  }
                ]
              }
              """,
        "role": "user",
    },
    {
        "content": "I already have a function that will take your output and convert into proper MIDI files + wav files. So no need to worry about that. I just need you to generate the JSON file. Just return the JSON file. No questions. No additional information. No comments. Only the JSON file. Your first letter is { and the last letter is }",
        "role": "user",
    },
]
