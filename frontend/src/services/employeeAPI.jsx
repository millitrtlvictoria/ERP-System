
const API_URL = "http://127.0.0.1:8000/api/employees";


// =====================================================
// GET ALL EMPLOYEES
// =====================================================

export async function getEmployees() {

    const response = await fetch(API_URL);

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Failed to fetch employees"
        );
    }

    return await response.json();
}


// =====================================================
// GET EMPLOYEE BY EMPLOYEE ID
// Example: EMP001
// =====================================================

export async function getEmployeeByEmpId(empId) {

    const response = await fetch(
        `${API_URL}/emp/${encodeURIComponent(empId)}`
    );

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
            "Employee not found"
        );
    }

    return await response.json();
}


// =====================================================
// GET EMPLOYEE BY DATABASE ID
// Example: 1
// =====================================================

export async function getEmployee(employeeId) {

    const response = await fetch(
        `${API_URL}/id/${employeeId}`
    );

    if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
            errorData.detail ||
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
        `${API_URL}/id/${employeeId}`,
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
        `${API_URL}/id/${employeeId}`,
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
