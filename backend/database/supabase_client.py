import os
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

logger = logging.getLogger("soa_nexus_supabase")

try:
    from supabase import create_client, Client
except ImportError:
    create_client = None
    Client = None

try:
    from backend.core.config import settings
except ImportError:
    from core.config import settings

_supabase_client: Optional[Any] = None

def get_supabase_client() -> Optional[Any]:
    """
    Initializes and returns the singleton Supabase client using project URL & Service Key.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if not create_client:
        logger.warning("Supabase python package not available.")
        return None

    url = getattr(settings, "SUPABASE_URL", os.getenv("SUPABASE_URL", ""))
    key = getattr(settings, "SUPABASE_SERVICE_KEY", os.getenv("SUPABASE_SERVICE_KEY", ""))

    if not url or not key:
        logger.warning("Supabase URL or Service Key missing.")
        return None

    try:
        _supabase_client = create_client(url, key)
        logger.info(f"Connected to Supabase PostgreSQL at {url}")
        return _supabase_client
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {e}")
        return None

# Generic Supabase helper operations
def supabase_select(table: str, filters: Optional[Dict[str, Any]] = None, limit: Optional[int] = None) -> List[Dict[str, Any]]:
    """Selects records from Supabase table with optional equality filters."""
    client = get_supabase_client()
    if not client:
        return []

    try:
        query = client.table(table).select("*")
        if filters:
            for k, v in filters.items():
                if v is not None:
                    query = query.eq(k, v)
        if limit:
            query = query.limit(limit)
        res = query.execute()
        return res.data if res and hasattr(res, "data") else []
    except Exception as e:
        logger.warning(f"Supabase select error on '{table}': {e}")
        return []

def supabase_insert(table: str, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Inserts a record into a Supabase table."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        res = client.table(table).insert(payload).execute()
        if res and hasattr(res, "data") and len(res.data) > 0:
            return res.data[0]
        return payload
    except Exception as e:
        logger.warning(f"Supabase insert error on '{table}': {e}")
        return None

def supabase_update(table: str, filters: Dict[str, Any], payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Updates matching records in a Supabase table."""
    client = get_supabase_client()
    if not client:
        return None

    try:
        query = client.table(table).update(payload)
        for k, v in filters.items():
            query = query.eq(k, v)
        res = query.execute()
        if res and hasattr(res, "data") and len(res.data) > 0:
            return res.data[0]
        return payload
    except Exception as e:
        logger.warning(f"Supabase update error on '{table}': {e}")
        return None
