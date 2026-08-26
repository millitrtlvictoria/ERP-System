const API_URL = "http://127.0.0.1:8000/api/employees";


// =====================================================
// GET ALL EMPLOYEES
// =====================================================

export async function getEmployees() {

    const response = await fetch(API_URL);

    if (!response.ok) {

        throw new Error(
            "Failed to fetch employees"
        );

    }

    return await response.json();
}


// =====================================================
// GET ONE EMPLOYEE
// =====================================================

export async function getEmployee(employeeId) {

    const response = await fetch(
        `${API_URL}/${employeeId}`
    );

    if (!response.ok) {

        throw new Error(
            "Employee not found"
        );

    }

    return await response.json();
}


// =====================================================
// CREATE EMPLOYEE
// =====================================================

export async function createEmployee(employeeData) {

    const response = await fetch(
        API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(employeeData)
        }
    );

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to create employee"
        );

    }

    return await response.json();
}


// =====================================================
// UPDATE EMPLOYEE
// =====================================================

export async function updateEmployee(
    employeeId,
    employeeData
) {

    const response = await fetch(
        `${API_URL}/${employeeId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(employeeData)
        }
    );

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to update employee"
        );

    }

    return await response.json();
}


// =====================================================
// DELETE EMPLOYEE
// =====================================================

export async function deleteEmployee(employeeId) {

    const response = await fetch(
        `${API_URL}/${employeeId}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to delete employee"
        );

    }

    return await response.json();
}