from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# ============================================================
# USER 2 RESPONSE
# ============================================================

class User2Response(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    username: str
    role: str
    permissions: dict

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# LOGIN
# ============================================================

class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    message: str
    user: User2Response


# ============================================================
# USER 2 CREATE
# ============================================================

class User2Create(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    username: str
    password: str
    confirm_password: str
    role: str
    permissions: dict


# ============================================================
# USER 2 UPDATE
# ============================================================

class User2Update(BaseModel):
    employee_id: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    confirm_password: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[dict] = None


# ============================================================
# EMPLOYEE CREATE
# ============================================================

class EmployeeCreate(BaseModel):
    emp_id: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    phone: str
    email: EmailStr
    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    department: str
    designation: str
    joining_date: date
    employment_type: str
    monthly_salary: Optional[Decimal] = None
    status: str


# ============================================================
# EMPLOYEE UPDATE
# ============================================================

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    department: Optional[str] = None
    designation: Optional[str] = None
    joining_date: Optional[date] = None
    employment_type: Optional[str] = None
    monthly_salary: Optional[Decimal] = None
    status: Optional[str] = None


# ============================================================
# EMPLOYEE RESPONSE
# ============================================================

class EmployeeResponse(BaseModel):
    id: int
    emp_id: str
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    phone: str
    email: EmailStr
    address: Optional[str] = None

    emergency_name: Optional[str] = None
    emergency_phone: Optional[str] = None
    emergency_relationship: Optional[str] = None

    department: str
    designation: str
    joining_date: date
    employment_type: str
    monthly_salary: Optional[Decimal] = None
    status: str

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# EMPLOYEE PHOTO RESPONSE
# ============================================================

class EmployeePhotoResponse(BaseModel):
    id: int
    employee_id: int
    photo_file_name: str
    photo_file_path: str
    photo_file_type: Optional[str] = None
    photo_file_size: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)