# songGPT - Back-end

The following is how to setup a simple backend serivce using songGPT. Prerequistes to follwing along are a firebase project and
a OpenAPI account.

## Setup

1.  Add your keys, tokens, or other sensitive information to the `.env` file in the root folder. You need to add the `OPENAI_ORGANIZATION`and `OPENAI_API_KEY`

```env
OPENAI_ORGANIZATION=<INSERT YOUR OPENAI ORGANIZATION ID>
OPENAI_API_KEY=<INSERT YOUR OPENAI API KEY>

2. Create `app/firebase.json` with the firebase serive account.

3. Navigate to the `back-end` directoy

```bash
cd back-end
```

2. Create a virtual environment using your preferred tool (e.g. `venv`, `conda`, etc.), for example:

```bash
python3 -m venv env && source env/bin/activate
```

3. Install the requirements

```bash
pip install -r requirements.txt "uvicorn[standard]==0.20.0" "gunicorn==20.1.0"
```

4. Start up the fastapi app.

```bash
uvicorn app.main:app --workers 1 --host 0.0.0.0 --port 8080 --reload
```

At this point the fastapi app should be runing on http://0.0.0.0:8080/ 🎉

## Usage

You can open http://0.0.0.0:8080/docs/ on your browser and play around.

## Contributing

We welcome contributions to the project! Please see the CONTRIBUTING.md file at the root of the project for more information.