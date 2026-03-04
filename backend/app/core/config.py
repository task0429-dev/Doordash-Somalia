import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app:app@postgres:5432/doordash_so")
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
APP_NAME = os.getenv("APP_NAME", "DoorDash Somalia MVP")
