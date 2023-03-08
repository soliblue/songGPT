import os

import openai


class OpenAIGenerator:
    def __init__(self, previous_messages: list[str] = []):
        openai.organization = os.getenv("OPENAI_ORGANIZATION")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.previous_messages = previous_messages

    async def generate(
        self,
        input: str,
    ) -> str:
        # https://beta.openai.com/docs/api-reference/completions/create
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            user="experimental-notebook",
            messages=self.previous_messages
            + [
                {
                    "content": input,
                    "role": "user",
                }
            ],
        )
        message = response["choices"][0]["message"]["content"]
        return message
