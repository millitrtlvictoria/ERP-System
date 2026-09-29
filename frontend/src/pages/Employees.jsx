import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/employees.css";
import API_URL from "../config/api";

function Employees() {
  // =====================================================
  // EMPLOYEE DATA
  // =====================================================

  const [employees, setEmployees] = useState([]);

  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [gender, setGender] = useState("All");
  const [sortBy, setSortBy] = useState("name");

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  // =====================================================
  // FETCH ALL EMPLOYEES
  // =====================================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/employees`
      );

      console.log(
        "GET employees status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log(
        "Employees received from backend:",
        data
      );

      setEmployees(data);

    } catch (err) {
      console.error(
        "Error fetching employees:",
        err
      );

      setError(
        "Unable to load employee data. Make sure FastAPI is running."
      );

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredEmployees = useMemo(() => {
    let result = employees.filter((employee) => {

      const searchText =
        search.trim().toLowerCase();

      // -----------------------------------------------
      // NAME
      // -----------------------------------------------

      const employeeName =
        String(employee.name || "")
          .toLowerCase();

      // -----------------------------------------------
      // EMPLOYEE ID
      // IMPORTANT:
      // Use emp_id, NOT id
      // -----------------------------------------------

      const employeeId =
        String(employee.emp_id || "")
          .toLowerCase();

      // -----------------------------------------------
      // PHONE
      // -----------------------------------------------

      const employeePhone =
        String(employee.phone || "")
          .toLowerCase();

      // -----------------------------------------------
      // EMAIL
      // -----------------------------------------------

      const employeeEmail =
        String(employee.email || "")
          .toLowerCase();

      // -----------------------------------------------
      // SEARCH
      // -----------------------------------------------

      const matchesSearch =
        employeeName.includes(searchText) ||
        employeeId.includes(searchText) ||
        employeePhone.includes(searchText) ||
        employeeEmail.includes(searchText);

      // -----------------------------------------------
      // DEPARTMENT
      // -----------------------------------------------

      const matchesDepartment =
        department === "All" ||
        String(employee.department || "")
          .toLowerCase() ===
          department.toLowerCase();

      // -----------------------------------------------
      // STATUS
      // -----------------------------------------------

      const matchesStatus =
        status === "All" ||
        String(employee.status || "")
          .toLowerCase() ===
          status.toLowerCase();

      // -----------------------------------------------
      // GENDER
      // -----------------------------------------------

      const matchesGender =
        gender === "All" ||
        String(employee.gender || "")
          .toLowerCase() ===
          gender.toLowerCase();

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesGender
      );
    });

    // ===================================================
    // SORT
    // ===================================================

    result = [...result].sort((a, b) => {

      if (sortBy === "name") {
        return String(a.name || "")
          .localeCompare(
            String(b.name || "")
          );
      }

      if (sortBy === "id") {
        return String(a.emp_id || "")
          .localeCompare(
            String(b.emp_id || "")
          );
      }

      if (sortBy === "department") {
        return String(a.department || "")
          .localeCompare(
            String(b.department || "")
          );
      }

      if (sortBy === "joiningDate") {
        return (
          new Date(b.joining_date || 0) -
          new Date(a.joining_date || 0)
        );
      }

      return 0;
    });

    return result;

  }, [
    employees,
    search,
    department,
    status,
    gender,
    sortBy
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        employee.status === "Active"
    ).length;

  const leaveEmployees =
    employees.filter(
      (employee) =>
        employee.status === "On Leave"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (employee) =>
        employee.status === "Inactive"
    ).length;

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setDepartment("All");
    setStatus("All");
    setGender("All");
    setSortBy("name");
  };

  // =====================================================
  // VIEW EMPLOYEE
  // =====================================================

  const handleViewEmployee = async (empId) => {

    console.log(
      "Fetching employee by EMP ID:",
      empId
    );

    try {
      setViewLoading(true);
      setViewError("");
      setSelectedEmployee(null);

      // -----------------------------------------------
      // IMPORTANT:
      // Use emp_id in the URL
      // -----------------------------------------------

      const url =
        `${API_URL}/api/employees/emp/${encodeURIComponent(
          empId
        )}`;

      console.log(
        "Employee details URL:",
        url
      );

      const response = await fetch(url);

      console.log(
        "Employee details status:",
        response.status
      );

      if (!response.ok) {

        const errorData =
          await response.json().catch(
            () => null
          );

        console.error(
          "Backend error:",
          errorData
        );

        throw new Error(
          errorData?.detail ||
          `Employee not found (${response.status})`
        );
      }

      const data =
        await response.json();

      console.log(
        "Employee details received:",
        data
      );

      setSelectedEmployee(data);

    } catch (err) {

      console.error(
        "Error fetching employee:",
        err
      );

      setViewError(
        err.message ||
        "Unable to fetch employee."
      );

    } finally {
      setViewLoading(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (databaseId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this employee?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `${API_URL}/api/employees/id/${databaseId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {

        const data =
          await response.json().catch(
            () => null
          );

        throw new Error(
          data?.detail ||
          "Failed to delete employee"
        );
      }

      // Refresh list from database
      await fetchEmployees();

    } catch (err) {

      console.error(
        "Delete error:",
        err
      );

      alert(
        err.message ||
        "Unable to delete employee."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="employees-page">

        <div className="employee-table-card">

          <div
            style={{
              padding: "40px",
              textAlign: "center"
            }}
          >

            <h2>
              Loading employees...
            </h2>

            <p>
              Please wait...
            </p>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div className="employees-page">

        <div className="employees-header">

          <div>

            <h1>
              Employees
            </h1>

            <p>
              Manage employee information
            </p>

          </div>

          <Link
            to="/add-employee"
            className="add-employee-btn"
          >
            + Add Employee
          </Link>

        </div>

        <div className="employee-table-card">

          <div
            style={{
              padding: "40px",
              textAlign: "center"
            }}
          >

            <h2>
              Unable to load employees
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={fetchEmployees}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div className="employees-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="employees-header">

        <div>

          <h1>
            Employees
          </h1>

          <p>
            Manage employee information and
            workforce details
          </p>

        </div>

        <Link
          to="/add-employee"
          className="add-employee-btn"
        >
          + Add Employee
        </Link>

      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="employee-summary">

        <div className="employee-summary-card">

          <div className="summary-icon">
            👥
          </div>

          <div>

            <span>
              Total Employees
            </span>

            <strong>
              {totalEmployees}
            </strong>

          </div>

        </div>

        <div className="employee-summary-card">

          <div className="summary-icon active-icon">
            ✓
          </div>

          <div>

            <span>
              Active Employees
            </span>

            <strong>
              {activeEmployees}
            </strong>

          </div>

        </div>

        <div className="employee-summary-card">

          <div className="summary-icon leave-icon">
            ⏱
          </div>

          <div>

            <span>
              On Leave
            </span>

            <strong>
              {leaveEmployees}
            </strong>

          </div>

        </div>

        <div className="employee-summary-card">

          <div className="summary-icon inactive-icon">
            −
          </div>

          <div>

            <span>
              Inactive
            </span>

            <strong>
              {inactiveEmployees}
            </strong>

          </div>

        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="employee-filter-card">

        <div className="filter-heading">

          <div>

            <h2>
              Employee Directory
            </h2>

            <p>
              Search and filter employee records
            </p>

          </div>

          <span className="result-count">

            {filteredEmployees.length} employee
            {filteredEmployees.length !== 1
              ? "s"
              : ""}

          </span>

        </div>

        <div className="filter-row">

          {/* SEARCH */}

          <div className="search-box">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search name, EMP ID, phone or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* DEPARTMENT */}

          <div className="filter-control">

            <label>
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >

              <option value="All">
                All Departments
              </option>

              <option value="SPINNING">
                SPINNING
              </option>

              <option value="WEAVING-Rapier">
                WEAVING-Rapier
              </option>

              <option value="WEAVING-S4">
                WEAVING-S4
              </option>

              <option value="HR">
                HR
              </option>

              <option value="IT">
                IT
              </option>

              <option value="Administration">
                Administration
              </option>

            </select>

          </div>

          {/* STATUS */}

          <div className="filter-control">

            <label>
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="On Leave">
                On Leave
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

          </div>

          {/* GENDER */}

          <div className="filter-control">

            <label>
              Gender
            </label>

            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
            >

              <option value="All">
                All Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

          </div>

          {/* RESET */}

          <button
            type="button"
            className="reset-filter-btn"
            onClick={resetFilters}
          >
            Reset
          </button>

        </div>

        {/* SORT */}

        <div className="filter-bottom">

          <div className="sort-control">

            <label>
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="name">
                Name
              </option>

              <option value="id">
                Employee ID
              </option>

              <option value="department">
                Department
              </option>

              <option value="joiningDate">
                Joining Date
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="employee-table-card">

        <div className="table-top">

          <div>

            <h2>
              Employee List
            </h2>

            <p>
              Showing {filteredEmployees.length} of{" "}
              {employees.length} employees
            </p>

          </div>

        </div>

        <div className="employee-table-wrapper">

          <table className="employee-table">

            <thead>

              <tr>

                <th>
                  Employee
                </th>

                <th>
                  Employee ID
                </th>

                <th>
                  Phone
                </th>

                <th>
                  Department
                </th>

                <th>
                  Designation
                </th>

                <th>
                  Gender
                </th>

                <th>
                  Joining Date
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.length > 0 ? (

                filteredEmployees.map(
                  (employee) => (

                    <tr
                      key={employee.id}
                    >

                      {/* EMPLOYEE */}

                      <td>

                        <div className="employee-info">

                          <div className="employee-avatar">

                            {(employee.name || "NA")
                              .split(" ")
                              .map(
                                (word) =>
                                  word[0]
                              )
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {employee.name}
                            </strong>

                            <small>
                              {employee.email}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* EMPLOYEE ID */}

                      <td>

                        <span className="employee-id">
                          {employee.emp_id}
                        </span>

                      </td>

                      {/* PHONE */}

                      <td>
                        {employee.phone}
                      </td>

                      {/* DEPARTMENT */}

                      <td>

                        <span className="department-badge">
                          {employee.department}
                        </span>

                      </td>

                      {/* DESIGNATION */}

                      <td>
                        {employee.designation}
                      </td>

                      {/* GENDER */}

                      <td>
                        {employee.gender}
                      </td>

                      {/* JOINING DATE */}

                      <td>
                        {employee.joining_date}
                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`employee-status ${
                            employee.status === "Active"
                              ? "status-active"
                              : employee.status ===
                                "On Leave"
                              ? "status-leave"
                              : "status-inactive"
                          }`}
                        >
                          {employee.status}
                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="employee-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="action-view"
                            title="View Employee"
                            onClick={() =>
                              handleViewEmployee(
                                employee.emp_id
                              )
                            }
                          >
                            👁
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            className="action-edit"
                            title="Edit Employee"
                            onClick={() =>
                              alert(
                                `Edit ${employee.emp_id}`
                              )
                            }
                          >
                            ✏️
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="action-delete"
                            title="Delete Employee"
                            onClick={() =>
                              handleDelete(
                                employee.id
                              )
                            }
                          >
                            🗑
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="no-employees"
                  >

                    <div>

                      <span>
                        🔍
                      </span>

                      <strong>
                        No employees found
                      </strong>

                      <p>
                        Try changing your
                        search or filters.
                      </p>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          EMPLOYEE VIEW MODAL
      ================================================= */}

      {(viewLoading ||
        viewError ||
        selectedEmployee) && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
          onClick={() => {

            if (!viewLoading) {

              setSelectedEmployee(null);
              setViewError("");

            }

          }}
        >

          <div
            style={{
              background: "#fff",
              width: "90%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
              borderRadius: "12px",
              padding: "30px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)"
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* LOADING */}

            {viewLoading && (

              <div
                style={{
                  textAlign: "center",
                  padding: "40px"
                }}
              >

                <h2>
                  Loading employee...
                </h2>

                <p>
                  Fetching employee data
                  from FastAPI.
                </p>

              </div>

            )}

            {/* ERROR */}

            {!viewLoading && viewError && (

              <div>

                <h2>
                  Unable to fetch employee
                </h2>

                <p>
                  {viewError}
                </p>

                <button
                  onClick={() => {

                    setSelectedEmployee(null);
                    setViewError("");

                  }}
                >
                  Close
                </button>

              </div>

            )}

            {/* EMPLOYEE DETAILS */}

            {!viewLoading &&
              !viewError &&
              selectedEmployee && (

                <div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginBottom: "25px"
                    }}
                  >

                    <div>

                      <h2>
                        {selectedEmployee.name}
                      </h2>

                      <p>
                        Employee ID:{" "}
                        <strong>
                          {selectedEmployee.emp_id}
                        </strong>
                      </p>

                    </div>

                    <button
                      onClick={() => {
                        setSelectedEmployee(
                          null
                        );
                      }}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer"
                      }}
                    >
                      ✕
                    </button>

                  </div>

                  <hr />

                  <h3>
                    Personal Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px",
                      marginBottom: "25px"
                    }}
                  >

                    <div>

                      <strong>
                        First Name
                      </strong>

                      <div>
                        {selectedEmployee.first_name}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Last Name
                      </strong>

                      <div>
                        {selectedEmployee.last_name}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Gender
                      </strong>

                      <div>
                        {selectedEmployee.gender}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Date of Birth
                      </strong>

                      <div>
                        {selectedEmployee.date_of_birth}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Phone
                      </strong>

                      <div>
                        {selectedEmployee.phone}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Email
                      </strong>

                      <div>
                        {selectedEmployee.email}
                      </div>

                    </div>

                  </div>

                  <h3>
                    Employment Information
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px"
                    }}
                  >

                    <div>

                      <strong>
                        Employee ID
                      </strong>

                      <div>
                        {selectedEmployee.emp_id}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Department
                      </strong>

                      <div>
                        {selectedEmployee.department}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Designation
                      </strong>

                      <div>
                        {selectedEmployee.designation}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Joining Date
                      </strong>

                      <div>
                        {selectedEmployee.joining_date}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Employment Type
                      </strong>

                      <div>
                        {selectedEmployee.employment_type_}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Monthly Salary
                      </strong>

                      <div>
                        {selectedEmployee.monthly_salary}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Status
                      </strong>

                      <div>
                        {selectedEmployee.status}
                      </div>

                    </div>

                    <div>

                      <strong>
                        Address
                      </strong>

                      <div>
                        {selectedEmployee.address}
                      </div>

                    </div>

                  </div>

                </div>

              )}

          </div>

        </div>

      )}

    </div>
  );
}

export default Employees;

