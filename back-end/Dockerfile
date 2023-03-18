FROM tiangolo/uvicorn-gunicorn:python3.9

RUN apt-get update && apt-get install -y fluidsynth && apt-get install -y abcmidi

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY app app/

CMD exec gunicorn --bind :$PORT --workers 1 --worker-class uvicorn.workers.UvicornWorker --threads 1 --timeout 0 app.main:app