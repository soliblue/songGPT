# Notebooks (Playground)

Welcome to Playground, a place for rapid experimentation and iteration. Getting this playground up and running is matter of minutes. You have to follow 4 basic steps and you will be able to experiment with the code on your local machine inside of Python notebooks 😉

## Getting Started

We recommend using [Visual Studio Code](https://code.visualstudio.com/). To get started with the notebook, follow the steps below:

1. Navigate to the `notebooks` directoy

```bash
cd notebooks
```

2. Create a virtual environment using your preferred tool (e.g. `venv`, `conda`, etc.), for example:

```bash
python3.10 -m venv env && source env/bin/activate
```

3. Install the required dependencies

```bash
pip install -r requirements.txt
```

4. Add your keys, tokens, or other sensitive information to the `.env` file in the root folder. You need to add the `OPENAI_ORGANIZATION`and `OPENAI_API_KEY`

```env
OPENAI_ORGANIZATION=<INSERT YOUR OPENAI ORGANIZATION ID>
OPENAI_API_KEY=<INSERT YOUR OPENAI API KEY>
```

> 🛟 In case you don't have an openAI account, just create one through the following [URL](https://platform.openai.com/)

> 🛟 If you can't find your organization ID or API key just follow [this guide](https://platform.openai.com/docs/api-reference/introduction) by OpenAI

5. Run the `playground.ipynb` script to start using the notebook. If you encounter problems check our tips section below

> 🛟 Make sure you install the [Jupyter Extension](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.jupyter) for Visual Studio. This allows you to [choose the virtual env we created above as the kernel for the notebook](https://code.visualstudio.com/docs/datascience/jupyter-kernel-management).