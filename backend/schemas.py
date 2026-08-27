
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict


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
    created_at: datetime
    updated_at: datetime

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

    emp_id: str

    first_name: str
    last_name: str

    gender: str
    date_of_birth: date

    phone: str
    email: EmailStr

    department: str
    designation: str

    joining_date: date

    employment_type: str

    monthly_salary: Optional[Decimal] = None

    status: str

    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None


# =====================================================
# EMPLOYEE UPDATE
# =====================================================

class EmployeeUpdate(BaseModel):

    emp_id: Optional[str] = None

    first_name: Optional[str] = None
    last_name: Optional[str] = None

    gender: Optional[str] = None
    date_of_birth: Optional[date] = None

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    department: Optional[str] = None
    designation: Optional[str] = None

    joining_date: Optional[date] = None

    employment_type: Optional[str] = None

    monthly_salary: Optional[Decimal] = None

    status: Optional[str] = None

    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None


# =====================================================
# EMPLOYEE RESPONSE
# =====================================================

class EmployeeResponse(BaseModel):

    id: int

    emp_id: str

    first_name: str
    last_name: str

    gender: str
    date_of_birth: date

    phone: str
    email: EmailStr

    department: str
    designation: str

    joining_date: date

    employment_type: str

    monthly_salary: Optional[Decimal] = None

    status: str

    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    photo_file_name: Optional[str] = None
    photo_file_path: Optional[str] = None
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None

    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True
    )
