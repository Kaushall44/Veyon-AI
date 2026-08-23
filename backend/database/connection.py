import os
import sqlite3
from typing import Dict, Any, List, Optional

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/soa_nexus")
USE_POSTGRES = os.getenv("USE_POSTGRES", "false").lower() == "true"

class DatabaseConnection:
    """
    Database Connection Wrapper for SOA Nexus AI Prototype.
    Supports PostgreSQL with pgvector when available, and provides a zero-config 
    in-memory SQLite fallback populated with seed records for offline hackathon evaluation.
    """
    def __init__(self):
        self.db_type = "postgresql" if USE_POSTGRES else "sqlite"
        self._sqlite_conn: Optional[sqlite3.Connection] = None

    def get_connection(self):
        if self.db_type == "sqlite":
            if self._sqlite_conn is None:
                self._sqlite_conn = sqlite3.connect(":memory:", check_same_thread=False)
                self._sqlite_conn.row_factory = sqlite3.Row
                self._init_sqlite_mock_db()
            return self._sqlite_conn
        else:
            try:
                import psycopg2
                return psycopg2.connect(DATABASE_URL)
            except Exception as e:
                print(f"[DB Warning] PostgreSQL connection failed: {e}. Falling back to SQLite mock engine.")
                self.db_type = "sqlite"
                return self.get_connection()

    def _init_sqlite_mock_db(self):
        """Initializes mock SQLite tables and populates prototype seed records."""
        cursor = self._sqlite_conn.cursor()
        
        # SQLite schema compatible with PostgreSQL model
        cursor.executescript("""
            CREATE TABLE IF NOT EXISTS roles (
                id TEXT PRIMARY KEY,
                name TEXT UNIQUE NOT NULL,
                permissions TEXT
            );

            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                role_id TEXT REFERENCES roles(id),
                department TEXT NOT NULL,
                registration_no TEXT
            );

            CREATE TABLE IF NOT EXISTS service_requests (
                id TEXT PRIMARY KEY,
                user_id TEXT REFERENCES users(id),
                service_type TEXT NOT NULL,
                status TEXT NOT NULL,
                current_step INT DEFAULT 1,
                ai_plan TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS lab_bookings (
                id TEXT PRIMARY KEY,
                request_id TEXT REFERENCES service_requests(id),
                lab_id TEXT NOT NULL,
                booking_date TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                purpose TEXT NOT NULL,
                access_pass_code TEXT
            );

            CREATE TABLE IF NOT EXISTS approvals (
                id TEXT PRIMARY KEY,
                request_id TEXT REFERENCES service_requests(id),
                approver_id TEXT REFERENCES users(id),
                assigned_role TEXT NOT NULL,
                status TEXT DEFAULT 'PENDING',
                approver_comments TEXT
            );
        """)

        # Insert Seed Data
        cursor.execute("INSERT OR IGNORE INTO roles VALUES ('r1', 'Student', '{}'), ('r2', 'Faculty', '{}'), ('r3', 'Lab_In_Charge', '{}'), ('r4', 'Maintenance_Staff', '{}'), ('r5', 'Admin', '{}')")
        cursor.execute("INSERT OR IGNORE INTO users VALUES ('u1', 'student@soa.ac.in', 'Rahul Sharma', 'r1', 'Computer Science & Engineering', '2023-CSE-042')")
        cursor.execute("INSERT OR IGNORE INTO users VALUES ('u2', 'faculty@soa.ac.in', 'Dr. Sunita Panigrahi', 'r2', 'Computer Science & Engineering', NULL)")
        cursor.execute("INSERT OR IGNORE INTO users VALUES ('u3', 'labincharge@soa.ac.in', 'Prof. A. K. Samanta', 'r3', 'Computer Science & Engineering', NULL)")
        cursor.execute("INSERT OR IGNORE INTO users VALUES ('u4', 'maintenance@soa.ac.in', 'Rajesh Kumar', 'r4', 'Campus Estates & Facilities', NULL)")
        cursor.execute("INSERT OR IGNORE INTO users VALUES ('u5', 'admin@soa.ac.in', 'Admin Officer Patnaik', 'r5', 'Academic Administration', NULL)")
        
        self._sqlite_conn.commit()

    def fetch_all(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        conn = self.get_connection()
        cursor = conn.cursor()
        cursor.execute(query, params)
        if self.db_type == "sqlite":
            rows = cursor.fetchall()
            return [dict(row) for row in rows]
        else:
            columns = [desc[0] for desc in cursor.description]
            return [dict(zip(columns, row)) for row in cursor.fetchall()]

# Singleton Database Instance
db = DatabaseConnection()

def get_db():
    return db
