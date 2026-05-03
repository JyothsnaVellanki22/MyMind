import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Try Vercel's automatic Postgres URL first
# 2. Try the manual DATABASE_URL next
# 3. Fallback to local SQLite for development
SQLALCHEMY_DATABASE_URL = os.getenv("POSTGRES_URL") or \
                          os.getenv("DATABASE_URL") or \
                          "sqlite:///./sql_app.db"

# Handle "postgres://" vs "postgresql://" and force pg8000 driver
if SQLALCHEMY_DATABASE_URL:
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
    elif SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Adjust engine parameters for PostgreSQL vs SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    # Production PostgreSQL (Vercel Postgres / Neon / Supabase)
    # We use pool_pre_ping to handle serverless connection drops
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
