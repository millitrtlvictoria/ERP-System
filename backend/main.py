from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
import crud

from database import (
    engine,
    Base,
    get_db
)


# =====================================================
# CREATE DATABASE TABLES
# =====================================================

Base.metadata.create_all(bind=engine)


# =====================================================
# CREATE FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="ERP Employee Management System",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# =====================================================
# ROOT
# =====================================================

@app.get("/")
def root():

    return {
        "message": "ERP Backend is running"
    }


# =====================================================
# USER REGISTRATION
# =====================================================

@app.post(
    "/api/register",
    response_model=schemas.UserResponse,
    status_code=201
)
def register_user(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK PASSWORD CONFIRMATION
    # -------------------------------------------------

    if user_data.password != user_data.confirm_password:

        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    # -------------------------------------------------
    # CREATE USER
    # -------------------------------------------------

    result = crud.create_user(
        db,
        user_data
    )

    # -------------------------------------------------
    # EMAIL ALREADY EXISTS
    # -------------------------------------------------

    if result == "EMAIL_EXISTS":

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # -------------------------------------------------
    # USERNAME ALREADY EXISTS
    # -------------------------------------------------

    if result == "USERNAME_EXISTS":

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    return result


# =====================================================
# USER LOGIN
# =====================================================

@app.post(
    "/api/login",
    response_model=schemas.LoginResponse
)
def login_user(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # AUTHENTICATE USER
    # -------------------------------------------------

    user = crud.authenticate_user(
        db=db,
        email=login_data.email,
        password=login_data.password
    )

    # -------------------------------------------------
    # INVALID LOGIN
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -------------------------------------------------
    # LOGIN SUCCESS
    # -------------------------------------------------

    return {
        "message": "Login successful",
        "user": user
    }


# =====================================================
# GET ALL EMPLOYEES
# =====================================================

@app.get("/api/employees")
def get_all_employees(

    skip: int = 0,

    limit: int = 100,

    emp_id: str | None = None,

    search: str | None = None,

    department: str | None = None,

    status: str | None = None,

    gender: str | None = None,

    designation: str | None = None,

    db: Session = Depends(get_db)
):

    employees = crud.get_employees(

        db=db,

        skip=skip,

        limit=limit,

        emp_id=emp_id,

        search=search,

        department=department,

        status=status,

        gender=gender,

        designation=designation
    )

    return [

        {
            "id": employee.id,

            "emp_id": employee.emp_id,

            "first_name": employee.first_name,

            "last_name": employee.last_name,

            "name": (
                employee.first_name
                + " "
                + employee.last_name
            ),

            "gender": employee.gender,

            "date_of_birth": (
                employee.date_of_birth.isoformat()
                if employee.date_of_birth
                else None
            ),

            "phone": employee.phone,

            "email": employee.email,

            "department": employee.department,

            "designation": employee.designation,

            "joining_date": (
                employee.joining_date.isoformat()
                if employee.joining_date
                else None
            ),

            "employment_type_": employee.employment_type_,

            "monthly_salary": (
                float(employee.monthly_salary)
                if employee.monthly_salary is not None
                else None
            ),

            "status": employee.status,

            "address": employee.address,

            "created_at": (
                employee.created_at.isoformat()
                if employee.created_at
                else None
            ),

            "updated_at": (
                employee.updated_at.isoformat()
                if employee.updated_at
                else None
            )
        }

        for employee in employees
    ]


# =====================================================
# CREATE EMPLOYEE
# =====================================================

@app.post("/api/employees")
def create_new_employee(

    employee_data: schemas.EmployeeCreate,

    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK DUPLICATE EMPLOYEE ID
    # -------------------------------------------------

    existing_employee = crud.get_employee_by_emp_id(
        db,
        employee_data.emp_id
    )

    if existing_employee:

        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists"
        )

    # -------------------------------------------------
    # CREATE EMPLOYEE
    # -------------------------------------------------

    employee = crud.create_employee(
        db,
        employee_data
    )

    # -------------------------------------------------
    # RETURN CREATED EMPLOYEE
    # -------------------------------------------------

    return {

        "id": employee.id,

        "emp_id": employee.emp_id,

        "first_name": employee.first_name,

        "last_name": employee.last_name,

        "name": (
            employee.first_name
            + " "
            + employee.last_name
        ),

        "gender": employee.gender,

        "date_of_birth": (
            employee.date_of_birth.isoformat()
            if employee.date_of_birth
            else None
        ),

        "phone": employee.phone,

        "email": employee.email,

        "department": employee.department,

        "designation": employee.designation,

        "joining_date": (
            employee.joining_date.isoformat()
            if employee.joining_date
            else None
        ),

        "employment_type_": employee.employment_type_,

        "monthly_salary": (
            float(employee.monthly_salary)
            if employee.monthly_salary is not None
            else None
        ),

        "status": employee.status,

        "address": employee.address,

        "created_at": (
            employee.created_at.isoformat()
            if employee.created_at
            else None
        )
    }


# =====================================================
# GET EMPLOYEE BY DATABASE ID
# =====================================================

@app.get("/api/employees/id/{employee_id}")
def get_employee_by_database_id(

    employee_id: int,

    db: Session = Depends(get_db)
):

    employee = crud.get_employee(
        db,
        employee_id
    )

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {

        "id": employee.id,

        "emp_id": employee.emp_id,

        "first_name": employee.first_name,

        "last_name": employee.last_name,

        "name": (
            employee.first_name
            + " "
            + employee.last_name
        ),

        "gender": employee.gender,

        "date_of_birth": (
            employee.date_of_birth.isoformat()
            if employee.date_of_birth
            else None
        ),

        "phone": employee.phone,

        "email": employee.email,

        "department": employee.department,

        "designation": employee.designation,

        "joining_date": (
            employee.joining_date.isoformat()
            if employee.joining_date
            else None
        ),

        "employment_type_": employee.employment_type_,

        "monthly_salary": (
            float(employee.monthly_salary)
            if employee.monthly_salary is not None
            else None
        ),

        "status": employee.status,

        "address": employee.address
    }


# =====================================================
# GET EMPLOYEE BY EMPLOYEE ID
#
# Example:
# /api/employees/emp/EMP007
# =====================================================

@app.get("/api/employees/emp/{emp_id}")
def get_employee_by_employee_id(

    emp_id: str,

    db: Session = Depends(get_db)
):

    employee = crud.get_employee_by_emp_id(
        db,
        emp_id
    )

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {

        "id": employee.id,

        "emp_id": employee.emp_id,

        "first_name": employee.first_name,

        "last_name": employee.last_name,

        "name": (
            employee.first_name
            + " "
            + employee.last_name
        ),

        "gender": employee.gender,

        "date_of_birth": (
            employee.date_of_birth.isoformat()
            if employee.date_of_birth
            else None
        ),

        "phone": employee.phone,

        "email": employee.email,

        "department": employee.department,

        "designation": employee.designation,

        "joining_date": (
            employee.joining_date.isoformat()
            if employee.joining_date
            else None
        ),

        "employment_type_": employee.employment_type_,

        "monthly_salary": (
            float(employee.monthly_salary)
            if employee.monthly_salary is not None
            else None
        ),

        "status": employee.status,

        "address": employee.address
    }


# =====================================================
# UPDATE EMPLOYEE
# =====================================================

@app.put("/api/employees/id/{employee_id}")
def update_employee(

    employee_id: int,

    employee_data: schemas.EmployeeCreate,

    db: Session = Depends(get_db)
):

    employee = crud.update_employee(
        db,
        employee_id,
        employee_data
    )

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {

        "message": "Employee updated successfully",

        "employee": {

            "id": employee.id,

            "emp_id": employee.emp_id,

            "first_name": employee.first_name,

            "last_name": employee.last_name,

            "name": (
                employee.first_name
                + " "
                + employee.last_name
            ),

            "department": employee.department,

            "designation": employee.designation,

            "status": employee.status
        }
    }


# =====================================================
# DELETE EMPLOYEE
# =====================================================

@app.delete("/api/employees/id/{employee_id}")
def delete_employee(

    employee_id: int,

    db: Session = Depends(get_db)
):

    employee = crud.delete_employee(
        db,
        employee_id
    )

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    return {

        "message": "Employee deleted successfully",

        "emp_id": employee.emp_id
    }