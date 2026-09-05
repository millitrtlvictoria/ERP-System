from fastapi import (
    FastAPI,
    Depends,
    HTTPException
)

from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import models
import schemas
import crud

from database import (
    engine,
    Base,
    get_db
)


# =====================================================
# DATABASE INITIALIZATION
# =====================================================

Base.metadata.create_all(
    bind=engine
)


# =====================================================
# FASTAPI APPLICATION
# =====================================================

app = FastAPI(
    title="ERP Employee Management API",
    version="1.0.0"
)


# =====================================================
# CORS CONFIGURATION
# =====================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# =====================================================
# HOME / HEALTH CHECK
# =====================================================

@app.get("/")
def home():

    return {
        "message": "ERP Backend is running"
    }


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
    # AUTHENTICATE USER-2
    # -------------------------------------------------

    user = crud.authenticate_user(
        db,
        login_data.username,
        login_data.password
    )

    # -------------------------------------------------
    # INVALID LOGIN
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    # -------------------------------------------------
    # LOGIN SUCCESS
    # -------------------------------------------------

    return {
        "message": "Login successful",
        "user": crud.prepare_user2_response(user)
    }


# =====================================================
# CREATE EMPLOYEE
# =====================================================

@app.post(
    "/api/employees",
    response_model=schemas.EmployeeResponse
)
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK EMPLOYEE ID
    # -------------------------------------------------

    existing_employee = crud.get_employee_by_emp_id(
        db,
        employee.emp_id
    )

    if existing_employee:

        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists"
        )

    # -------------------------------------------------
    # CREATE EMPLOYEE
    # -------------------------------------------------

    try:

        return crud.create_employee(
            db,
            employee
        )

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=(
                "Employee could not be created "
                "because of a database constraint."
            )
        )


# =====================================================
# GET ALL EMPLOYEES
# =====================================================

@app.get(
    "/api/employees",
    response_model=list[schemas.EmployeeResponse]
)
def get_employees(
    db: Session = Depends(get_db)
):

    return crud.get_employees(db)


# =====================================================
# GET EMPLOYEE BY EMPLOYEE ID
# =====================================================

@app.get(
    "/api/employees/emp/{emp_id}",
    response_model=schemas.EmployeeResponse
)
def get_employee_by_emp_id(
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

    return employee


# =====================================================
# GET EMPLOYEE BY DATABASE ID
# =====================================================

@app.get(
    "/api/employees/id/{employee_id}",
    response_model=schemas.EmployeeResponse
)
def get_employee(
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

    return employee


# =====================================================
# UPDATE EMPLOYEE
# =====================================================

@app.put(
    "/api/employees/id/{employee_id}",
    response_model=schemas.EmployeeResponse
)
def update_employee(
    employee_id: int,
    employee: schemas.EmployeeUpdate,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK EMPLOYEE
    # -------------------------------------------------

    existing_employee = crud.get_employee(
        db,
        employee_id
    )

    if not existing_employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # -------------------------------------------------
    # UPDATE EMPLOYEE
    # -------------------------------------------------

    try:

        updated_employee = crud.update_employee(
            db,
            employee_id,
            employee
        )

        return updated_employee

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail=(
                "Employee could not be updated "
                "because of a database constraint."
            )
        )


# =====================================================
# DELETE EMPLOYEE
# =====================================================

@app.delete(
    "/api/employees/id/{employee_id}"
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # DELETE EMPLOYEE
    # -------------------------------------------------

    try:

        employee = crud.delete_employee(
            db,
            employee_id
        )

    except IntegrityError:

        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Employee could not be deleted."
        )

    # -------------------------------------------------
    # CHECK EMPLOYEE
    # -------------------------------------------------

    if not employee:

        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # -------------------------------------------------
    # SUCCESS RESPONSE
    # -------------------------------------------------

    return {
        "message": "Employee deleted successfully",
        "emp_id": employee.emp_id
    }


# =====================================================
# USER-2 MANAGEMENT
# =====================================================


# =====================================================
# CREATE USER-2
# =====================================================

@app.post(
    "/api/user-2",
    response_model=schemas.User2Response
)
def create_user2(
    user: schemas.User2Create,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CREATE USER-2
    # -------------------------------------------------

    new_user, error_message = crud.create_user2(
        db,
        user
    )

    # -------------------------------------------------
    # CHECK ERROR
    # -------------------------------------------------

    if error_message:

        raise HTTPException(
            status_code=400,
            detail=error_message
        )

    # -------------------------------------------------
    # RETURN USER-2
    # -------------------------------------------------

    return crud.prepare_user2_response(
        new_user
    )


# =====================================================
# GET ALL USER-2
# =====================================================

@app.get(
    "/api/user-2",
    response_model=list[schemas.User2Response]
)
def get_user2s(
    db: Session = Depends(get_db)
):

    return crud.get_user2s(db)


# =====================================================
# GET USER-2 BY DATABASE ID
# =====================================================

@app.get(
    "/api/user-2/{user_id}",
    response_model=schemas.User2Response
)
def get_user2(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = crud.get_user2(
        db,
        user_id
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return crud.prepare_user2_response(
        user
    )


# =====================================================
# UPDATE USER-2
# =====================================================

@app.put(
    "/api/user-2/{user_id}",
    response_model=schemas.User2Response
)
def update_user2(
    user_id: int,
    user: schemas.User2Update,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # CHECK USER
    # -------------------------------------------------

    existing_user = crud.get_user2(
        db,
        user_id
    )

    if not existing_user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -------------------------------------------------
    # UPDATE USER
    # -------------------------------------------------

    updated_user, error_message = crud.update_user2(
        db,
        user_id,
        user
    )

    # -------------------------------------------------
    # CHECK ERROR
    # -------------------------------------------------

    if error_message:

        raise HTTPException(
            status_code=400,
            detail=error_message
        )

    # -------------------------------------------------
    # RETURN UPDATED USER
    # -------------------------------------------------

    return crud.prepare_user2_response(
        updated_user
    )


# =====================================================
# DELETE USER-2
# =====================================================

@app.delete(
    "/api/user-2/{user_id}"
)
def delete_user2(
    user_id: int,
    db: Session = Depends(get_db)
):

    # -------------------------------------------------
    # DELETE USER
    # -------------------------------------------------

    user = crud.delete_user2(
        db,
        user_id
    )

    # -------------------------------------------------
    # CHECK USER
    # -------------------------------------------------

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # -------------------------------------------------
    # SUCCESS RESPONSE
    # -------------------------------------------------

    return {
        "message": "User deleted successfully",
        "id": user.id,
        "employee_id": user.employee_id
    }