from sqlalchemy.orm import Session
from sqlalchemy import or_

from passlib.context import CryptContext

import models
import schemas


# =====================================================
# PASSWORD HASHING
# =====================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =====================================================
# CREATE EMPLOYEE
# =====================================================

def create_employee(
    db: Session,
    employee_data: schemas.EmployeeCreate
):

    employee = models.Employee(

        emp_id=employee_data.emp_id,

        first_name=employee_data.first_name,

        last_name=employee_data.last_name,

        gender=employee_data.gender,

        date_of_birth=employee_data.date_of_birth,

        phone=employee_data.phone,

        email=employee_data.email,

        department=employee_data.department,

        designation=employee_data.designation,

        joining_date=employee_data.joining_date,

        employment_type_=employee_data.employment_type_,

        monthly_salary=employee_data.monthly_salary,

        status=employee_data.status,

        address=employee_data.address
    )

    db.add(employee)

    db.commit()

    db.refresh(employee)

    # -------------------------------------------------
    # CREATE EMERGENCY CONTACT
    # -------------------------------------------------

    if employee_data.emergency_contact:

        emergency = models.EmergencyContact(

            employee_id=employee.id,

            contact_name=(
                employee_data
                .emergency_contact
                .contact_name
            ),

            contact_phone=(
                employee_data
                .emergency_contact
                .contact_phone
            ),

            relationship=(
                employee_data
                .emergency_contact
                .relationship
            )
        )

        db.add(emergency)

        db.commit()

        db.refresh(employee)

    return employee


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
# GET ALL EMPLOYEES + FILTERS
# =====================================================

def get_employees(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    emp_id: str | None = None,
    search: str | None = None,
    department: str | None = None,
    status: str | None = None,
    gender: str | None = None,
    designation: str | None = None
):

    query = db.query(models.Employee)

    if emp_id:

        query = query.filter(
            models.Employee.emp_id.ilike(
                emp_id.strip()
            )
        )

    if search:

        search_value = f"%{search.strip()}%"

        query = query.filter(
            or_(
                models.Employee.emp_id.ilike(
                    search_value
                ),

                models.Employee.first_name.ilike(
                    search_value
                ),

                models.Employee.last_name.ilike(
                    search_value
                ),

                models.Employee.phone.ilike(
                    search_value
                ),

                models.Employee.email.ilike(
                    search_value
                )
            )
        )

    if department:

        query = query.filter(
            models.Employee.department.ilike(
                department.strip()
            )
        )

    if status:

        query = query.filter(
            models.Employee.status.ilike(
                status.strip()
            )
        )

    if gender:

        query = query.filter(
            models.Employee.gender.ilike(
                gender.strip()
            )
        )

    if designation:

        query = query.filter(
            models.Employee.designation.ilike(
                designation.strip()
            )
        )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


# =====================================================
# UPDATE EMPLOYEE
# =====================================================

def update_employee(
    db: Session,
    employee_id: int,
    employee_data: schemas.EmployeeCreate
):

    employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        return None

    employee.emp_id = employee_data.emp_id

    employee.first_name = employee_data.first_name

    employee.last_name = employee_data.last_name

    employee.gender = employee_data.gender

    employee.date_of_birth = employee_data.date_of_birth

    employee.phone = employee_data.phone

    employee.email = employee_data.email

    employee.department = employee_data.department

    employee.designation = employee_data.designation

    employee.joining_date = employee_data.joining_date

    employee.employment_type_ = (
        employee_data.employment_type_
    )

    employee.monthly_salary = (
        employee_data.monthly_salary
    )

    employee.status = employee_data.status

    employee.address = employee_data.address

    db.commit()

    db.refresh(employee)

    return employee


# =====================================================
# DELETE EMPLOYEE
# =====================================================

def delete_employee(
    db: Session,
    employee_id: int
):

    employee = (
        db.query(models.Employee)
        .filter(
            models.Employee.id == employee_id
        )
        .first()
    )

    if not employee:
        return None

    db.delete(employee)

    db.commit()

    return employee


# =====================================================
# CREATE USER / REGISTRATION
# =====================================================

# =====================================================
# CREATE USER / REGISTRATION
# =====================================================

def create_user(
    db: Session,
    user_data: schemas.UserCreate
):

    # -------------------------------------------------
    # CHECK PASSWORDS
    # -------------------------------------------------

    if user_data.password != user_data.confirm_password:

        raise ValueError(
            "Passwords do not match"
        )

    # -------------------------------------------------
    # CHECK EMAIL
    # -------------------------------------------------

    existing_email = (
        db.query(models.User)
        .filter(
            models.User.email == user_data.email
        )
        .first()
    )

    if existing_email:

        return "EMAIL_EXISTS"

    # -------------------------------------------------
    # CHECK USERNAME
    # -------------------------------------------------

    existing_username = (
        db.query(models.User)
        .filter(
            models.User.username == user_data.username
        )
        .first()
    )

    if existing_username:

        return "USERNAME_EXISTS"

    # -------------------------------------------------
    # HASH PASSWORD
    # -------------------------------------------------

    password_hash = pwd_context.hash(
        user_data.password
    )

    # -------------------------------------------------
    # CREATE USER
    # -------------------------------------------------

    user = models.User(

        first_name=user_data.first_name,

        last_name=user_data.last_name,

        email=user_data.email,

        username=user_data.username,

        password_hash=password_hash
    )

    # -------------------------------------------------
    # SAVE USER
    # -------------------------------------------------

    db.add(user)

    db.commit()

    db.refresh(user)

    return user

    # -------------------------------------------------
    # CHECK USERNAME
    # -------------------------------------------------

    existing_username = (
        db.query(models.User)
        .filter(
            models.User.username == user_data.username
        )
        .first()
    )

    if existing_username:

        return "USERNAME_EXISTS"

    # -------------------------------------------------
    # HASH PASSWORD
    # -------------------------------------------------

    password_hash = pwd_context.hash(
        user_data.password
    )

    # -------------------------------------------------
    # CREATE USER
    # -------------------------------------------------

    user = models.User(

        first_name=user_data.first_name,

        last_name=user_data.last_name,

        email=user_data.email,

        username=user_data.username,

        password_hash=password_hash
    )

    # -------------------------------------------------
    # SAVE USER
    # -------------------------------------------------

    db.add(user)

    db.commit()

    db.refresh(user)

    return user


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
# VERIFY USER LOGIN
# =====================================================

def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = get_user_by_email(
        db,
        email
    )

    if not user:

        return None

    password_valid = pwd_context.verify(
        password,
        user.password_hash
    )

    if not password_valid:

        return None

    return user