from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# =====================================================
# USER REGISTRATION
# =====================================================

class UserCreate(BaseModel):
    first_name: str
    last_name: str

    email: EmailStr
    username: str

    password: str
    confirm_password: str


# =====================================================
# USER RESPONSE
# =====================================================

class UserResponse(BaseModel):
    id: int

    first_name: str
    last_name: str

    email: EmailStr
    username: str

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# LOGIN REQUEST
# =====================================================

class LoginRequest(BaseModel):
    username: str
    password: str


# =====================================================
# LOGIN RESPONSE
# =====================================================

class LoginResponse(BaseModel):
    message: str
    user: UserResponse


# =====================================================
# EMPLOYEE CREATE
# =====================================================

class EmployeeCreate(BaseModel):

    # -------------------------------------------------
    # EMPLOYEE INFORMATION
    # -------------------------------------------------

    emp_id: str

    # -------------------------------------------------
    # PERSONAL INFORMATION
    # -------------------------------------------------

    first_name: str
    last_name: str

    gender: str
    date_of_birth: date

    # -------------------------------------------------
    # CONTACT INFORMATION
    # -------------------------------------------------

    phone: str
    email: EmailStr

    address: Optional[str] = None

    # -------------------------------------------------
    # EMERGENCY CONTACT
    # -------------------------------------------------

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    # -------------------------------------------------
    # JOB INFORMATION
    # -------------------------------------------------

    department: str
    designation: str

    joining_date: date
    employment_type: str

    monthly_salary: Optional[Decimal] = None

    status: str

    # -------------------------------------------------
    # PHOTO INFORMATION
    # -------------------------------------------------

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None


# =====================================================
# EMPLOYEE UPDATE
# =====================================================

class EmployeeUpdate(BaseModel):

    # -------------------------------------------------
    # EMPLOYEE INFORMATION
    # -------------------------------------------------

    emp_id: Optional[str] = None

    # -------------------------------------------------
    # PERSONAL INFORMATION
    # -------------------------------------------------

    first_name: Optional[str] = None
    last_name: Optional[str] = None

    gender: Optional[str] = None
    date_of_birth: Optional[date] = None

    # -------------------------------------------------
    # CONTACT INFORMATION
    # -------------------------------------------------

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    address: Optional[str] = None

    # -------------------------------------------------
    # EMERGENCY CONTACT
    # -------------------------------------------------

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    # -------------------------------------------------
    # JOB INFORMATION
    # -------------------------------------------------

    department: Optional[str] = None
    designation: Optional[str] = None

    joining_date: Optional[date] = None
    employment_type: Optional[str] = None

    monthly_salary: Optional[Decimal] = None

    status: Optional[str] = None

    # -------------------------------------------------
    # PHOTO INFORMATION
    # -------------------------------------------------

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None


# =====================================================
# EMPLOYEE RESPONSE
# =====================================================

class EmployeeResponse(BaseModel):

    # -------------------------------------------------
    # PRIMARY KEY
    # -------------------------------------------------

    id: int

    # -------------------------------------------------
    # EMPLOYEE INFORMATION
    # -------------------------------------------------

    emp_id: str

    # -------------------------------------------------
    # PERSONAL INFORMATION
    # -------------------------------------------------

    first_name: str
    last_name: str

    gender: str
    date_of_birth: date

    # -------------------------------------------------
    # CONTACT INFORMATION
    # -------------------------------------------------

    phone: str
    email: EmailStr

    address: Optional[str] = None

    # -------------------------------------------------
    # EMERGENCY CONTACT
    # -------------------------------------------------

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    # -------------------------------------------------
    # JOB INFORMATION
    # -------------------------------------------------

    department: str
    designation: str

    joining_date: date
    employment_type: str

    monthly_salary: Optional[Decimal] = None

    status: str

    # -------------------------------------------------
    # PHOTO INFORMATION
    # -------------------------------------------------

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None

    # -------------------------------------------------
    # SYSTEM TIMESTAMPS
    # -------------------------------------------------

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )