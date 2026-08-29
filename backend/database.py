from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# =====================================================
# DATABASE CONFIGURATION
# =====================================================

DATABASE_URL = "sqlite:///./erp.db"


# =====================================================
# DATABASE ENGINE
# =====================================================

engine = create_engine(
    DATABASE_URL,
    connect_args={
        "check_same_thread": False
    }
)


# =====================================================
# DATABASE SESSION
# =====================================================

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)


# =====================================================
# BASE MODEL
# =====================================================

Base = declarative_base()


# =====================================================
# DATABASE DEPENDENCY
# =====================================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()