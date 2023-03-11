import logging
import os

LOG_LEVEL = os.environ.get("LOGLEVEL", "DEBUG")

# logger config
if os.getenv("CLOUD_LOGGING", False):
    import logging as log

    import google.cloud.logging

    client = google.cloud.logging.Client()
    client.setup_logging()
    log.getLogger().setLevel(LOG_LEVEL)
else:
    log = logging.getLogger(os.getenv("LOGGER", "gunicorn.error"))
    log.setLevel(LOG_LEVEL)
