from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    Numeric,
    ForeignKey
)

from sqlalchemy.orm import relationship as orm_relationship

from database import Base


# =====================================================
# DEPARTMENT TABLE
# =====================================================

class Department(Base):

    __tablename__ = "departments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    department_code = Column(
        String(30),
        unique=True,
        nullable=False
    )

    department_name = Column(
        String(100),
        unique=True,
        nullable=False
    )

    unit = Column(
        String(100),
        nullable=True
    )

    status = Column(
        String(20),
        default="Active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# =====================================================
# EMPLOYMENT TYPE TABLE
# =====================================================

class EmploymentType(Base):

    __tablename__ = "employment_types"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    type_name = Column(
        String(50),
        unique=True,
        nullable=False
    )

    status = Column(
        String(20),
        default="Active"
    )


# =====================================================
# EMPLOYEE STATUS TABLE
# =====================================================

class EmployeeStatus(Base):

    __tablename__ = "employee_statuses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    status_name = Column(
        String(50),
        unique=True,
        nullable=False
    )

    status = Column(
        String(20),
        default="Active"
    )


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
    # Example: EMP001
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

    phone = Column(
        String(20),
        nullable=False
    )

    email = Column(
        String(150),
        nullable=False
    )

    # =================================================
    # EMPLOYMENT INFORMATION
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

    employment_type_ = Column(
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
    # CONTACT INFORMATION
    # =================================================

    address = Column(
        String(500),
        nullable=True
    )

    # =================================================
    # SYSTEM INFORMATION
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

    # =================================================
    # RELATIONSHIPS
    # =================================================

    emergency_contact = orm_relationship(
        "EmergencyContact",
        back_populates="employee",
        uselist=False,
        cascade="all, delete-orphan"
    )

    photo = orm_relationship(
        "EmployeePhoto",
        back_populates="employee",
        uselist=False,
        cascade="all, delete-orphan"
    )


# =====================================================
# EMERGENCY CONTACT TABLE
# =====================================================

class EmergencyContact(Base):

    __tablename__ = "emergency_contacts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        unique=True,
        nullable=False
    )

    contact_name = Column(
        String(100),
        nullable=True
    )

    contact_phone = Column(
        String(20),
        nullable=True
    )

    relationship = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    employee = orm_relationship(
        "Employee",
        back_populates="emergency_contact"
    )


# =====================================================
# EMPLOYEE PHOTO TABLE
# =====================================================

class EmployeePhoto(Base):

    __tablename__ = "employee_photos"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        unique=True,
        nullable=False
    )

    file_name = Column(
        String(255),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    file_type = Column(
        String(50),
        nullable=True
    )

    file_size = Column(
        Integer,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    employee = orm_relationship(
        "Employee",
        back_populates="photo"
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

    password_hash = Column(
        String(255),
        nullable=False
    )

    # =================================================
    # SYSTEM INFORMATION
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