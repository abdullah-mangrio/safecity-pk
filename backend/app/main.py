# backend/app/main.py

from fastapi import FastAPI
from app.routes import crimes, analytics
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SafeCity PK API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crimes.router)
app.include_router(analytics.router)

@app.get("/")
def root():
    return {"message": "SafeCity PK API running"}
