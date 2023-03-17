import os

import openai


class ChatGPT:
    def __init__(self, history: list[str] = []):
        openai.organization = os.getenv("OPENAI_ORGANIZATION")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.history = history

    def generate(
        self,
        input: str,
    ) -> str:
        # https://beta.openai.com/docs/api-reference/completions/create
        response = openai.ChatCompletion.create(
            model="gpt-4",
            user="experimental-notebook",
            messages=self.history
            + [
                {
                    "content": input,
                    "role": "user",
                }
            ],
        )
        message = response["choices"][0]["message"]["content"]
        return message
