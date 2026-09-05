from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import bcrypt
import json

import models
import schemas


# ============================================================
# EMPLOYEE CRUD
# ============================================================


# ============================================================
# CREATE EMPLOYEE
# ============================================================

def create_employee(
    db: Session,
    employee: schemas.EmployeeCreate
):
    db_employee = models.Employee(
        emp_id=employee.emp_id,
        first_name=employee.first_name,
        last_name=employee.last_name,
        gender=employee.gender,
        date_of_birth=employee.date_of_birth,
        phone=employee.phone,
        email=employee.email,
        address=employee.address,
        emergency_name=employee.emergency_name,
        emergency_phone=employee.emergency_phone,
        emergency_relationship=employee.emergency_relationship,
        department=employee.department,
        designation=employee.designation,
        joining_date=employee.joining_date,
        employment_type=employee.employment_type,
        monthly_salary=employee.monthly_salary,
        status=employee.status,
        photo_file_name=employee.photo_file_name,
        photo_file_path=employee.photo_file_path,
        photo_file_type=employee.photo_file_type,
        photo_file_size=employee.photo_file_size
    )

    try:
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)

        return db_employee

    except IntegrityError:
        db.rollback()
        raise


# ============================================================
# GET ALL EMPLOYEES
# ============================================================

def get_employees(
    db: Session
):
    return (
        db.query(models.Employee)
        .all()
    )


# ============================================================
# GET EMPLOYEE BY DATABASE ID
# ============================================================

def get_employee(
    db: Session,
    employee_id: int
):
    return (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id
        )
        .first()
    )


# ============================================================
# GET EMPLOYEE BY EMPLOYEE ID
# ============================================================

def get_employee_by_emp_id(
    db: Session,
    emp_id: str
):
    return (
        db.query(models.Employee)
        .filter(
            models.Employee.emp_id == emp_id
        )
        .first()
    )


# ============================================================
# UPDATE EMPLOYEE
# ============================================================

def update_employee(
    db: Session,
    employee_id: int,
    employee: schemas.EmployeeUpdate
):
    db_employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id
        )
        .first()
    )

    if not db_employee:
        return None

    update_data = employee.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            db_employee,
            field,
            value
        )

    try:
        db.commit()
        db.refresh(db_employee)

        return db_employee

    except IntegrityError:
        db.rollback()
        raise


# ============================================================
# DELETE EMPLOYEE
# ============================================================

def delete_employee(
    db: Session,
    employee_id: int
):
    db_employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id
        )
        .first()
    )

    if not db_employee:
        return None

    try:
        db.delete(db_employee)
        db.commit()

        return db_employee

    except IntegrityError:
        db.rollback()
        raise


# ============================================================
# USER-2 CRUD
# ============================================================


# ============================================================
# GET USER-2 BY DATABASE ID
# ============================================================

def get_user2(
    db: Session,
    user_id: int
):
    return (
        db.query(models.User2)
        .filter(
            models.User2.id == user_id
        )
        .first()
    )


# ============================================================
# GET USER-2 BY EMPLOYEE ID
# ============================================================

def get_user2_by_employee_id(
    db: Session,
    employee_id: str
):
    return (
        db.query(models.User2)
        .filter(
            models.User2.employee_id == employee_id
        )
        .first()
    )


# ============================================================
# GET USER-2 BY EMAIL
# ============================================================

def get_user2_by_email(
    db: Session,
    email: str
):
    return (
        db.query(models.User2)
        .filter(
            models.User2.email == email
        )
        .first()
    )


# ============================================================
# GET USER-2 BY USERNAME
# ============================================================

def get_user2_by_username(
    db: Session,
    username: str
):
    return (
        db.query(models.User2)
        .filter(
            models.User2.username == username
        )
        .first()
    )


# ============================================================
# PREPARE USER-2 RESPONSE
# ============================================================

def prepare_user2_response(
    user: models.User2
):
    try:
        permissions = json.loads(
            user.permissions
        )

    except (json.JSONDecodeError, TypeError):
        permissions = {}

    return {
        "id": user.id,
        "employee_id": user.employee_id,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone": user.phone,
        "username": user.username,
        "role": user.role,
        "permissions": permissions,
        "created_at": user.created_at,
        "updated_at": user.updated_at
    }


# ============================================================
# CREATE USER-2
# ============================================================

def create_user2(
    db: Session,
    user: schemas.User2Create
):
    # --------------------------------------------------------
    # CHECK PASSWORD
    # --------------------------------------------------------

    if user.password != user.confirm_password:
        return (
            None,
            "Passwords do not match"
        )

    # --------------------------------------------------------
    # CHECK EMPLOYEE ID
    # --------------------------------------------------------

    if get_user2_by_employee_id(
        db,
        user.employee_id
    ):
        return (
            None,
            "Employee ID already exists"
        )

    # --------------------------------------------------------
    # CHECK EMAIL
    # --------------------------------------------------------

    if get_user2_by_email(
        db,
        user.email
    ):
        return (
            None,
            "Email already exists"
        )

    # --------------------------------------------------------
    # CHECK USERNAME
    # --------------------------------------------------------

    if get_user2_by_username(
        db,
        user.username
    ):
        return (
            None,
            "Username already exists"
        )

    # --------------------------------------------------------
    # HASH PASSWORD
    # --------------------------------------------------------

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    # --------------------------------------------------------
    # CONVERT PERMISSIONS TO JSON
    # --------------------------------------------------------

    permissions_json = json.dumps(
        user.permissions
    )

    # --------------------------------------------------------
    # CREATE DATABASE OBJECT
    # --------------------------------------------------------

    db_user2 = models.User2(
        employee_id=user.employee_id,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        phone=user.phone,
        username=user.username,
        password_hash=password_hash,
        role=user.role,
        permissions=permissions_json
    )

    try:
        db.add(db_user2)
        db.commit()
        db.refresh(db_user2)

        return (
            db_user2,
            None
        )

    except IntegrityError:
        db.rollback()

        return (
            None,
            "Employee ID, email, or username already exists"
        )


# ============================================================
# GET ALL USER-2
# ============================================================

def get_user2s(
    db: Session
):
    users = (
        db.query(models.User2)
        .all()
    )

    return [
        prepare_user2_response(user)
        for user in users
    ]


# ============================================================
# UPDATE USER-2
# ============================================================

def update_user2(
    db: Session,
    user_id: int,
    user: schemas.User2Update
):
    db_user2 = (
        db.query(models.User2)
        .filter(
            models.User2.id == user_id
        )
        .first()
    )

    if not db_user2:
        return (
            None,
            "User not found"
        )

    # --------------------------------------------------------
    # GET PROVIDED FIELDS ONLY
    # --------------------------------------------------------

    update_data = user.model_dump(
        exclude_unset=True
    )

    # --------------------------------------------------------
    # PASSWORD UPDATE
    # --------------------------------------------------------

    if (
        "password" in update_data
        or "confirm_password" in update_data
    ):
        password = update_data.get(
            "password"
        )

        confirm_password = update_data.get(
            "confirm_password"
        )

        if password != confirm_password:
            return (
                None,
                "Passwords do not match"
            )

        if password:
            db_user2.password_hash = (
                bcrypt.hashpw(
                    password.encode("utf-8"),
                    bcrypt.gensalt()
                ).decode("utf-8")
            )

        update_data.pop(
            "password",
            None
        )

        update_data.pop(
            "confirm_password",
            None
        )

    # --------------------------------------------------------
    # PERMISSIONS UPDATE
    # --------------------------------------------------------

    if "permissions" in update_data:
        db_user2.permissions = json.dumps(
            update_data["permissions"]
        )

        update_data.pop(
            "permissions"
        )

    # --------------------------------------------------------
    # UPDATE OTHER FIELDS
    # --------------------------------------------------------

    for field, value in update_data.items():
        setattr(
            db_user2,
            field,
            value
        )

    try:
        db.commit()
        db.refresh(db_user2)

        return (
            db_user2,
            None
        )

    except IntegrityError:
        db.rollback()

        return (
            None,
            "Employee ID, email, or username already exists"
        )


# ============================================================
# DELETE USER-2
# ============================================================

def delete_user2(
    db: Session,
    user_id: int
):
    db_user2 = (
        db.query(models.User2)
        .filter(
            models.User2.id == user_id
        )
        .first()
    )

    if not db_user2:
        return None

    try:
        db.delete(db_user2)
        db.commit()

        return db_user2

    except IntegrityError:
        db.rollback()
        raise


# ============================================================
# AUTHENTICATE USER-2
# ============================================================

def authenticate_user(
    db: Session,
    username: str,
    password: str
):
    user = get_user2_by_username(
        db,
        username
    )

    if not user:
        return None

    password_correct = bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    )

    if not password_correct:
        return None

    return user