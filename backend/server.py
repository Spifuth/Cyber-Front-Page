from __future__ import annotations

import logging
import os
import re
from collections import defaultdict
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from time import time
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, field_validator

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent

# Load environment variables from project root then backend folder
for env_file in (PROJECT_ROOT / ".env", BASE_DIR / ".env"):
    if env_file.exists():
        load_dotenv(env_file)

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "cyberfront")
TRUSTED_ORIGINS = [origin.strip() for origin in os.getenv("TRUSTED_ORIGINS", "http://localhost:5173").split(",") if origin.strip()]

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("cyberfront.backend")

status_collection = None
memory_status_checks: list[dict] = []

# Simple in-memory rate limiter
rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "30"))  # requests per window
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds

# Regex pattern for client_name validation (alphanumeric, dash, underscore, space)
CLIENT_NAME_PATTERN = re.compile(r"^[\w\s\-\.]+$", re.UNICODE)


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: os.urandom(8).hex())
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=128)
    
    @field_validator("client_name")
    @classmethod
    def validate_client_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("client_name cannot be empty or whitespace only")
        if not CLIENT_NAME_PATTERN.match(v):
            raise ValueError("client_name contains invalid characters")
        return v


def check_rate_limit(client_ip: str) -> bool:
    """Check if client has exceeded rate limit. Returns True if allowed."""
    now = time()
    window_start = now - RATE_LIMIT_WINDOW
    
    # Clean old entries
    rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if t > window_start]
    
    if len(rate_limit_store[client_ip]) >= RATE_LIMIT_REQUESTS:
        return False
    
    rate_limit_store[client_ip].append(now)
    return True


@asynccontextmanager
async def lifespan(app: FastAPI):
    global status_collection
    mongo_client: Optional[AsyncIOMotorClient] = None
    if MONGO_URL:
        try:
            mongo_client = AsyncIOMotorClient(
                MONGO_URL,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=5000,
                socketTimeoutMS=10000,
                maxPoolSize=10,
            )
            await mongo_client.server_info()
            status_collection = mongo_client[DB_NAME].status_checks
            # Log connection without exposing credentials
            logger.info("Connected to MongoDB successfully")
        except Exception as exc:  # pragma: no cover - logging branch
            logger.warning("MongoDB connection failed, falling back to in-memory store", exc_info=exc)
            mongo_client = None
            status_collection = None
    else:
        logger.info("No MongoDB URL provided, using in-memory store")

    try:
        yield
    finally:
        if mongo_client:
            mongo_client.close()
            mongo_client = None
            logger.info("MongoDB connection closed")
        status_collection = None


app = FastAPI(title="Cyber Front Page API", lifespan=lifespan)

api_router = APIRouter(prefix="/api", tags=["status"])


async def save_status(status: StatusCheck) -> StatusCheck:
    if status_collection:
        await status_collection.insert_one(status.model_dump())
    else:
        memory_status_checks.append(status.model_dump())
        if len(memory_status_checks) > 100:
            memory_status_checks[:] = memory_status_checks[-100:]
    return status


async def fetch_statuses() -> List[StatusCheck]:
    if status_collection:
        documents = await status_collection.find().sort("timestamp", -1).to_list(length=100)
        return [StatusCheck(**document) for document in documents]
    return [StatusCheck(**item) for item in reversed(memory_status_checks[-100:])]


@api_router.get("/", response_model=dict)
async def root() -> dict:
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck, status_code=status.HTTP_201_CREATED)
async def create_status_check(request: Request, payload: StatusCheckCreate) -> StatusCheck:
    # Rate limiting
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later."
        )
    
    status_obj = StatusCheck(client_name=payload.client_name)  # Already stripped by validator
    return await save_status(status_obj)


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    return await fetch_statuses()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=TRUSTED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],  # Only methods we actually use
    allow_headers=["Content-Type", "Accept", "Origin"],  # Only headers we need
)


@app.get("/health", tags=["health"])
async def healthcheck() -> dict:
    db_status = "connected" if status_collection else "offline"
    return {"status": "ok", "database": db_status}
