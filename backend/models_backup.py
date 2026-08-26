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

    # -------------------------------------------------
    # NOTE:
    # Employee.department is a STRING column.
    #
    # Therefore we DO NOT create an SQLAlchemy
    # relationship between Department and Employee.
    #
    # This avoids the previous NoForeignKeysError.
    # -------------------------------------------------


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

    # -------------------------------------------------
    # No relationship with Employee.
    #
    # Employee stores employment_type_ as a string.
    # -------------------------------------------------


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

    # -------------------------------------------------
    # No relationship with Employee.
    #
    # Employee stores status as a string.
    # -------------------------------------------------


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

    # IMPORTANT:
    # Your EmployeeCreate schema contains:
    #
    # department: str
    #
    # Therefore this is stored as a STRING.

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

    # IMPORTANT:
    # Your schema uses:
    #
    # employment_type_: str
    #
    # Therefore the database column uses the same name.

    employment_type_ = Column(
        String(50),
        nullable=False
    )

    monthly_salary = Column(
        Numeric(12, 2),
        nullable=True
    )

    # Your schema uses:
    #
    # status: str

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

    # One Employee -> One Emergency Contact

    emergency_contact = orm_relationship(
        "EmergencyContact",
        back_populates="employee",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # One Employee -> One Employee Photo

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

    # =================================================
    # PRIMARY KEY
    # =================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =================================================
    # EMPLOYEE FOREIGN KEY
    # =================================================

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        unique=True,
        nullable=False
    )

    # =================================================
    # CONTACT INFORMATION
    # =================================================

    contact_name = Column(
        String(100),
        nullable=True
    )

    contact_phone = Column(
        String(20),
        nullable=True
    )

    # IMPORTANT:
    # "relationship" is a database column.
    #
    # We use orm_relationship() for SQLAlchemy
    # relationships, so there is no naming conflict.

    relationship = Column(
        String(50),
        nullable=True
    )

    # =================================================
    # SYSTEM INFORMATION
    # =================================================

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    # =================================================
    # RELATIONSHIP BACK TO EMPLOYEE
    # =================================================

    employee = orm_relationship(
        "Employee",
        back_populates="emergency_contact"
    )


# =====================================================
# EMPLOYEE PHOTO TABLE
# =====================================================

class EmployeePhoto(Base):

    __tablename__ = "employee_photos"

    # =================================================
    # PRIMARY KEY
    # =================================================

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    # =================================================
    # EMPLOYEE FOREIGN KEY
    # =================================================

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        unique=True,
        nullable=False
    )

    # =================================================
    # PHOTO INFORMATION
    # =================================================

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

    # =================================================
    # RELATIONSHIP BACK TO EMPLOYEE
    # =================================================

    employee = orm_relationship(
        "Employee",
        back_populates="photo"
    )