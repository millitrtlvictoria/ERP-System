
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import bcrypt

import models
import schemas


# =====================================================
# EMPLOYEE CRUD
# =====================================================


# =====================================================
# CREATE EMPLOYEE
# =====================================================

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
        department=employee.department,
        designation=employee.designation,
        joining_date=employee.joining_date,
        employment_type=employee.employment_type,
        monthly_salary=employee.monthly_salary,
        status=employee.status,
        address=employee.address,
        emergency_contact=employee.emergency_contact,
        employee_photo=employee.employee_photo
    )

    try:

        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)

        return db_employee

    except IntegrityError:

        db.rollback()
        raise


# =====================================================
# GET ALL EMPLOYEES
# =====================================================

def get_employees(db: Session):

    return (
        db.query(models.Employee)
        .all()
    )


# =====================================================
# GET EMPLOYEE BY DATABASE ID
# =====================================================

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


# =====================================================
# GET EMPLOYEE BY EMPLOYEE ID
# =====================================================

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


# =====================================================
# UPDATE EMPLOYEE
# =====================================================

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


# =====================================================
# DELETE EMPLOYEE
# =====================================================

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

    db.delete(db_employee)
    db.commit()

    return db_employee


# =====================================================
# USER AUTHENTICATION
# =====================================================


# =====================================================
# GET USER BY EMAIL
# =====================================================

def get_user_by_email(
    db: Session,
    email: str
):

    return (
        db.query(models.User)
        .filter(
            models.User.email == email
        )
        .first()
    )


# =====================================================
# GET USER BY USERNAME
# =====================================================

def get_user_by_username(
    db: Session,
    username: str
):

    return (
        db.query(models.User)
        .filter(
            models.User.username == username
        )
        .first()
    )


# =====================================================
# CREATE USER / REGISTER
# =====================================================

def create_user(
    db: Session,
    user: schemas.UserCreate
):

    # -------------------------------------------------
    # CHECK EMAIL
    # -------------------------------------------------

    existing_email = get_user_by_email(
        db,
        user.email
    )

    if existing_email:
        return None, "Email already registered"


    # -------------------------------------------------
    # CHECK USERNAME
    # -------------------------------------------------

    existing_username = get_user_by_username(
        db,
        user.username
    )

    if existing_username:
        return None, "Username already exists"


    # -------------------------------------------------
    # HASH PASSWORD
    # -------------------------------------------------

    password_hash = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")


    # -------------------------------------------------
    # CREATE USER
    # -------------------------------------------------

    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        username=user.username,
        password_hash=password_hash
    )


    try:

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user, None

    except IntegrityError:

        db.rollback()

        return None, "Email or username already exists"


# =====================================================
# AUTHENTICATE USER / LOGIN
# =====================================================

def authenticate_user(
    db: Session,
    username: str,
    password: str
):

    # -------------------------------------------------
    # FIND USER
    # -------------------------------------------------

    user = get_user_by_username(
        db,
        username
    )

    if not user:
        return None


    # -------------------------------------------------
    # CHECK PASSWORD
    # -------------------------------------------------

    password_correct = bcrypt.checkpw(
        password.encode("utf-8"),
        user.password_hash.encode("utf-8")
    )

    if not password_correct:
        return None


    # -------------------------------------------------
    # LOGIN SUCCESS
    # -------------------------------------------------

    return user
