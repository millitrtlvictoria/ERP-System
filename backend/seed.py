from database import (
    SessionLocal,
    engine,
    Base
)

import models


# =====================================================
# CREATE TABLES
# =====================================================

Base.metadata.create_all(
    bind=engine
)


# =====================================================
# OPEN DATABASE SESSION
# =====================================================

db = SessionLocal()


# =====================================================
# DEPARTMENTS
# =====================================================

departments = [

    {
        "department_code": "SPN",
        "department_name": "SPINNING",
        "unit": "Unit 1",
        "status": "Active"
    },

    {
        "department_code": "WVR",
        "department_name": "WEAVING-Rapier",
        "unit": "Unit 1",
        "status": "Active"
    },

    {
        "department_code": "WVS",
        "department_name": "WEAVING-S4",
        "unit": "Unit 2",
        "status": "Active"
    }

]


for department in departments:

    existing = (

        db.query(models.Department)

        .filter(

            models.Department.department_code
            == department["department_code"]

        )

        .first()

    )


    if not existing:

        db.add(

            models.Department(
                **department
            )

        )


# =====================================================
# EMPLOYMENT TYPES
# =====================================================

employment_types = [

    "Permanent",

    "Contract",

    "Temporary",

    "Trainee",

    "Part Time"

]


for type_name in employment_types:

    existing = (

        db.query(models.EmploymentType)

        .filter(

            models.EmploymentType.type_name
            == type_name

        )

        .first()

    )


    if not existing:

        db.add(

            models.EmploymentType(

                type_name=type_name,

                status="Active"

            )

        )


# =====================================================
# EMPLOYEE STATUSES
# =====================================================

statuses = [

    "Active",

    "Inactive",

    "Resigned",

    "Terminated",

    "Retired"

]


for status_name in statuses:

    existing = (

        db.query(models.EmployeeStatus)

        .filter(

            models.EmployeeStatus.status_name
            == status_name

        )

        .first()

    )


    if not existing:

        db.add(

            models.EmployeeStatus(

                status_name=status_name,

                status="Active"

            )

        )


# =====================================================
# SAVE DATA
# =====================================================

db.commit()


# =====================================================
# CLOSE DATABASE
# =====================================================

db.close()


print(
    "Seed data inserted successfully!"
)