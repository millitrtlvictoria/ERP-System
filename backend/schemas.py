from datetime import date, datetime
from decimal import Decimal
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)


# =====================================================
# EMERGENCY CONTACT CREATE
# =====================================================

class EmergencyContactCreate(BaseModel):

    contact_name: Optional[str] = None

    contact_phone: Optional[str] = None

    relationship: Optional[str] = None


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

    employment_type_: str

    monthly_salary: Optional[Decimal] = None

    status: str

    address: Optional[str] = None

    emergency_contact: Optional[
        EmergencyContactCreate
    ] = None


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

    email: str

    department: str

    designation: str

    joining_date: date

    employment_type: str = Field(
        validation_alias="employment_type_",
        serialization_alias="employment_type"
    )

    monthly_salary: Optional[Decimal] = None

    status: str

    address: Optional[str] = None

    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )


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

    model_config = ConfigDict(
        from_attributes=True
    )


# =====================================================
# USER LOGIN
# =====================================================

class LoginRequest(BaseModel):

    email: EmailStr

    password: str


# =====================================================
# LOGIN RESPONSE
# =====================================================

class LoginResponse(BaseModel):

    message: str

    user: UserResponse