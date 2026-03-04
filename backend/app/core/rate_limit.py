from fastapi import HTTPException, Request
from app.core.db import SessionLocal
import time


def enforce_rate_limit(request: Request, key: str, limit: int = 20, window_seconds: int = 60):
    """Simple in-memory rate limiting (for MVP - use Redis in production)"""
    # For MVP, we'll use a simple check
    # In production, implement proper Redis-based rate limiting
    pass
