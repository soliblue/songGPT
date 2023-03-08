import os

import firebase_admin
from google.cloud.storage import Blob
from firebase_admin import storage, firestore
from fastapi.security import OAuth2PasswordBearer

if os.path.exists("app/firestore.json"):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "app/firestore.json"

STORAGE_BUCKET_NAME = "songgpt.appspot.com"
firebase_app = firebase_admin.initialize_app(
    options={"storageBucket": STORAGE_BUCKET_NAME}
)
# initialize firestore database client
db = firestore.client()
# initialize firebase storage bucket
bucket = storage.bucket()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def upload_image_from_file(file, id: str, folder: str, image_type: str = "png") -> Blob:
    file.seek(0)
    blob = bucket.blob(f"{folder}/{id}.{image_type}")
    blob.upload_from_file(file, content_type=f"image/{image_type}")
    return blob
