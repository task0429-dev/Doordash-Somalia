from app.core.config import (
    SUPABASE_ANON_KEY,
    SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_URL,
)


def get_supabase_public_config() -> dict[str, str]:
    return {
        "url": SUPABASE_URL,
        "publishableKey": SUPABASE_PUBLISHABLE_KEY,
        "anonKey": SUPABASE_ANON_KEY,
    }


def has_supabase_server_config() -> bool:
    return bool(SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
