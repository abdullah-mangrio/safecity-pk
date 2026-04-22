# backend/app/main.py

from fastapi import FastAPI
from app.routes import crimes, analytics

app = FastAPI(title="SafeCity PK API")

app.include_router(crimes.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "SafeCity PK API running"}
