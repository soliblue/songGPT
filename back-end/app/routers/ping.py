from fastapi import APIRouter, status

router = APIRouter()

# ping pong call in fastapi
@router.get("/", status_code=status.HTTP_200_OK)
async def ping():
    return {"ping": "pong!"}
