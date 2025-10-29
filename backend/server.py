from __future__ import annotations

import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

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

mongo_client: Optional[AsyncIOMotorClient] = None
status_collection = None
memory_status_checks: list[dict] = []


class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: os.urandom(8).hex())
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str = Field(..., min_length=1, max_length=128)


@asynccontextmanager
async def lifespan(app: FastAPI):
    global mongo_client, status_collection
    if MONGO_URL:
        try:
            mongo_client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
            await mongo_client.server_info()
            status_collection = mongo_client[DB_NAME].status_checks
            logger.info("Connected to MongoDB", extra={"mongo_url": MONGO_URL})
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
        del memory_status_checks[:-100]  # keep last 100 entries
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
async def create_status_check(payload: StatusCheckCreate) -> StatusCheck:
    status_obj = StatusCheck(client_name=payload.client_name.strip())
    return await save_status(status_obj)


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks() -> List[StatusCheck]:
    return await fetch_statuses()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=TRUSTED_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
async def healthcheck() -> dict:
    db_status = "connected" if status_collection else "offline"
    return {"status": "ok", "database": db_status}
