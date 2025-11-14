"""Minimal test server for Railway"""
from fastapi import FastAPI
import os

app = FastAPI()

@app.get("/")
def root():
    return {"message": "AION Backend Test", "port": os.getenv("PORT", "unknown")}

@app.get("/health")
def health():
    return {"status": "ok"}
