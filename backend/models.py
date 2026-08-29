from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    Numeric
)

from database import Base


# =====================================================
# EMPLOYEE MODEL
# =====================================================

class Employee(Base):

    __tablename__ = "employees"

    # -------------------------------------------------
    # PRIMARY KEY
    # -------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # -------------------------------------------------
    # EMPLOYEE INFORMATION
    # -------------------------------------------------

    emp_id = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # -------------------------------------------------
    # PERSONAL INFORMATION
    # -------------------------------------------------

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    gender = Column(
        String(20),
        nullable=False
    )

    date_of_birth = Column(
        Date,
        nullable=False
    )

    # -------------------------------------------------
    # CONTACT INFORMATION
    # -------------------------------------------------

    phone = Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    address = Column(
        String(500),
        nullable=True
    )

    # -------------------------------------------------
    # EMERGENCY CONTACT
    # -------------------------------------------------

    emergency_name = Column(
        String(100),
        nullable=True
    )

    emergency_phone = Column(
        String(20),
        nullable=True
    )

    emergency_relationship = Column(
        String(50),
        nullable=True
    )

    # -------------------------------------------------
    # JOB INFORMATION
    # -------------------------------------------------

    department = Column(
        String(100),
        nullable=False
    )

    designation = Column(
        String(100),
        nullable=False
    )

    joining_date = Column(
        Date,
        nullable=False
    )

    employment_type = Column(
        String(50),
        nullable=False
    )

    monthly_salary = Column(
        Numeric(12, 2),
        nullable=True
    )

    status = Column(
        String(50),
        nullable=False
    )

    # -------------------------------------------------
    # EMPLOYEE PHOTO INFORMATION
    # -------------------------------------------------

    photo_file_name = Column(
        String(255),
        nullable=True
    )

    photo_file_path = Column(
        String(500),
        nullable=True
    )

    photo_file_type = Column(
        String(50),
        nullable=True
    )

    photo_file_size = Column(
        Integer,
        nullable=True
    )

    # -------------------------------------------------
    # SYSTEM TIMESTAMPS
    # -------------------------------------------------

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


# =====================================================
# USER MODEL
# =====================================================

class User(Base):

    __tablename__ = "users"

    # -------------------------------------------------
    # PRIMARY KEY
    # -------------------------------------------------

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # -------------------------------------------------
    # PERSONAL INFORMATION
    # -------------------------------------------------

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    # -------------------------------------------------
    # LOGIN INFORMATION
    # -------------------------------------------------

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    username = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # -------------------------------------------------
    # PASSWORD
    # -------------------------------------------------

    password_hash = Column(
        String(255),
        nullable=False
    )

    # -------------------------------------------------
    # SYSTEM TIMESTAMPS
    # -------------------------------------------------

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )