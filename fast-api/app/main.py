# main.py
from fastapi import FastAPI

# FastAPI app

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}