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
# EMPLOYEE TABLE
# =====================================================

class Employee(Base):

    __tablename__ = "employees"

    # =================================================
    # PRIMARY KEY
    # =================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =================================================
    # EMPLOYEE ID
    # =================================================

    emp_id = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    # =================================================
    # PERSONAL INFORMATION
    # =================================================

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

    # =================================================
    # CONTACT INFORMATION
    # =================================================

    phone = Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    # =================================================
    # JOB INFORMATION
    # =================================================

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

    # =================================================
    # OTHER INFORMATION
    # =================================================

    address = Column(
        String(500),
        nullable=True
    )

    emergency_contact = Column(
        String(500),
        nullable=True
    )

    employee_photo = Column(
        String(500),
        nullable=True
    )

    # =================================================
    # TIMESTAMPS
    # =================================================

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
# USER TABLE
# Registration + Login
# =====================================================

class User(Base):

    __tablename__ = "users"

    # =================================================
    # PRIMARY KEY
    # =================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =================================================
    # PERSONAL INFORMATION
    # =================================================

    first_name = Column(
        String(100),
        nullable=False
    )

    last_name = Column(
        String(100),
        nullable=False
    )

    # =================================================
    # LOGIN INFORMATION
    # =================================================

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

    # IMPORTANT:
    # Never store the actual password.
    # Store only the hashed password.

    password_hash = Column(
        String(255),
        nullable=False
    )

    # =================================================
    # TIMESTAMPS
    # =================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
