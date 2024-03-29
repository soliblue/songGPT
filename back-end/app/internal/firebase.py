import os

import firebase_admin
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import firestore, storage
from google.cloud.storage import Blob

if os.path.exists("app/internal/firebase.json"):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "app/internal/firebase.json"

STORAGE_BUCKET_NAME = "songgpt-xyz.appspot.com"
firebase_app = firebase_admin.initialize_app(
    options={"storageBucket": STORAGE_BUCKET_NAME}
)
# initialize firestore database client
db = firestore.client()
# initialize firebase storage bucket
bucket = storage.bucket()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def upload_file(source_file_path, target_path, target_file_name, content_type) -> Blob:
    blob = bucket.blob(f"{target_path}/{target_file_name}")
    blob.upload_from_filename(source_file_path, content_type=content_type)
    return blob
