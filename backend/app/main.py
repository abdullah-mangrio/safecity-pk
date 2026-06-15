from fastapi import FastAPI
import os
from fastapi.middleware.cors import CORSMiddleware
from app.routes import logs
from app.routes import crimes, analytics, reports, users, auth

app = FastAPI(title="SafeCity PK API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174"
        ).split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(logs.router)
app.include_router(crimes.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(users.router)
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


@app.get("/")
def root():
    return {"message": "SafeCity PK API running"}
