from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    with open(f"images/{file.filename}", "wb") as f:
        f.write(contents)
    return {"status": "saved", "filename": file.filename}

@app.get("/latest-image")
def get_latest_image():
    files = sorted(os.listdir("images"), reverse=True)
    if files:
        return FileResponse(f"images/{files[0]}", media_type="image/jpeg")
    return {"error": "No image found"}
