
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/employees.css";

const API_URL = "http://127.0.0.1:8000";

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
  // EDIT EMPLOYEE
  // =====================================================

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // =====================================================
  // EDIT FORM
  // =====================================================

  const [editForm, setEditForm] = useState({
    emp_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    email: "",
    department: "",
    designation: "",
    joining_date: "",
    employment_type: "",
    monthly_salary: "",
    status: "",
    address: "",
  });

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

      setEmployees(
        Array.isArray(data) ? data : []
      );
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
  // GET EMPLOYEE NAME
  // =====================================================

  const getEmployeeName = (employee) => {
    if (!employee) {
      return "N/A";
    }

    if (employee.name) {
      return employee.name;
    }

    return `${employee.first_name || ""} ${
      employee.last_name || ""
    }`.trim() || "N/A";
  };

  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredEmployees = useMemo(() => {
    let result = employees.filter((employee) => {
      const searchText =
        search.trim().toLowerCase();

      // -------------------------------------------------
      // NAME
      // -------------------------------------------------

      const employeeName =
        getEmployeeName(employee).toLowerCase();

      // -------------------------------------------------
      // EMPLOYEE ID
      // -------------------------------------------------

      const employeeId =
        String(employee.emp_id || "").toLowerCase();

      // -------------------------------------------------
      // DATABASE ID
      // -------------------------------------------------

      const databaseId =
        String(employee.id || "").toLowerCase();

      // -------------------------------------------------
      // PHONE
      // -------------------------------------------------

      const employeePhone =
        String(employee.phone || "").toLowerCase();

      // -------------------------------------------------
      // EMAIL
      // -------------------------------------------------

      const employeeEmail =
        String(employee.email || "").toLowerCase();

      // -------------------------------------------------
      // SEARCH
      // -------------------------------------------------

      const matchesSearch =
        searchText === "" ||
        employeeName.includes(searchText) ||
        employeeId.includes(searchText) ||
        databaseId.includes(searchText) ||
        employeePhone.includes(searchText) ||
        employeeEmail.includes(searchText);

      // -------------------------------------------------
      // DEPARTMENT
      // -------------------------------------------------

      const employeeDepartment =
        String(employee.department || "")
          .trim()
          .toLowerCase();

      const selectedDepartment =
        String(department || "")
          .trim()
          .toLowerCase();

      const matchesDepartment =
        department === "All" ||
        employeeDepartment === selectedDepartment;

      // -------------------------------------------------
      // STATUS
      // -------------------------------------------------

      const employeeStatus =
        String(employee.status || "")
          .trim()
          .toLowerCase();

      const selectedStatus =
        String(status || "")
          .trim()
          .toLowerCase();

      const matchesStatus =
        status === "All" ||
        employeeStatus === selectedStatus;

      // -------------------------------------------------
      // GENDER
      // -------------------------------------------------

      const employeeGender =
        String(employee.gender || "")
          .trim()
          .toLowerCase();

      const selectedGender =
        String(gender || "")
          .trim()
          .toLowerCase();

      const matchesGender =
        gender === "All" ||
        employeeGender === selectedGender;

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
        return getEmployeeName(a).localeCompare(
          getEmployeeName(b)
        );
      }

      if (sortBy === "id") {
        return String(a.emp_id || "").localeCompare(
          String(b.emp_id || "")
        );
      }

      if (sortBy === "department") {
        return String(a.department || "").localeCompare(
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
    sortBy,
  ]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalEmployees =
    employees.length;

  const activeEmployees =
    employees.filter(
      (employee) =>
        String(employee.status || "")
          .trim()
          .toLowerCase() === "active"
    ).length;

  const leaveEmployees =
    employees.filter(
      (employee) =>
        String(employee.status || "")
          .trim()
          .toLowerCase() === "on leave"
    ).length;

  const inactiveEmployees =
    employees.filter(
      (employee) =>
        String(employee.status || "")
          .trim()
          .toLowerCase() === "inactive"
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
  // OPEN EDIT FORM
  // =====================================================

  const handleEditEmployee = (employee) => {
    console.log(
      "Opening edit employee:",
      employee
    );

    setEditError("");

    setEditForm({
      emp_id: employee.emp_id || "",
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      gender: employee.gender || "",
      date_of_birth:
        employee.date_of_birth || "",
      phone: employee.phone || "",
      email: employee.email || "",
      department:
        employee.department || "",
      designation:
        employee.designation || "",
      joining_date:
        employee.joining_date || "",
      employment_type:
        employee.employment_type || "",
      monthly_salary:
        employee.monthly_salary ?? "",
      status: employee.status || "",
      address: employee.address || "",
    });

    setEditingEmployee(employee);
  };

  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  // =====================================================
  // SAVE EDITED EMPLOYEE
  // =====================================================

  const handleSaveEmployee = async (e) => {
    e.preventDefault();

    if (!editingEmployee) {
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      console.log(
        "Updating database employee ID:",
        editingEmployee.id
      );

      const payload = {
        emp_id: editForm.emp_id.trim(),

        first_name:
          editForm.first_name.trim(),

        last_name:
          editForm.last_name.trim(),

        gender:
          editForm.gender,

        date_of_birth:
          editForm.date_of_birth,

        phone:
          editForm.phone.trim(),

        email:
          editForm.email.trim(),

        department:
          editForm.department.trim(),

        designation:
          editForm.designation.trim(),

        joining_date:
          editForm.joining_date,

        employment_type:
          editForm.employment_type.trim(),

        monthly_salary:
          editForm.monthly_salary === ""
            ? null
            : Number(editForm.monthly_salary),

        status:
          editForm.status,

        address:
          editForm.address.trim(),
      };

      console.log(
        "PUT payload:",
        payload
      );

      const response = await fetch(
        `${API_URL}/api/employees/id/${editingEmployee.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      console.log(
        "PUT employee status:",
        response.status
      );

      if (!response.ok) {
        const errorData =
          await response.json().catch(
            () => null
          );

        console.error(
          "Update backend error:",
          errorData
        );

        throw new Error(
          errorData?.detail ||
            `Failed to update employee (${response.status})`
        );
      }

      const updatedEmployee =
        await response.json();

      console.log(
        "Employee updated:",
        updatedEmployee
      );

      // -------------------------------------------------
      // CLOSE EDIT MODAL
      // -------------------------------------------------

      setEditingEmployee(null);

      // -------------------------------------------------
      // REFRESH EMPLOYEE LIST
      // -------------------------------------------------

      await fetchEmployees();

      alert(
        "Employee updated successfully."
      );
    } catch (err) {
      console.error(
        "Error updating employee:",
        err
      );

      setEditError(
        err.message ||
          "Unable to update employee."
      );
    } finally {
      setEditLoading(false);
    }
  };

  // =====================================================
  // DELETE EMPLOYEE
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
          method: "DELETE",
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

      await fetchEmployees();

      alert(
        "Employee deleted successfully."
      );
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
  // CLOSE VIEW
  // =====================================================

  const closeView = () => {
    setSelectedEmployee(null);
    setViewError("");
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEdit = () => {
    if (editLoading) {
      return;
    }

    setEditingEmployee(null);
    setEditError("");
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
              textAlign: "center",
            }}
          >
            <h2>
              Loading employees...
            </h2>

            <p>
              Please wait while employee
              data is being loaded.
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
              and workforce details
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
              textAlign: "center",
            }}
          >
            <h2>
              Unable to load employees
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={fetchEmployees}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer",
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
          SUMMARY CARDS
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
          FILTER CARD
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
          EMPLOYEE TABLE
      ================================================= */}

      <div className="employee-table-card">

        <div className="table-top">

          <div>
            <h2>
              Employee List
            </h2>

            <p>
              Showing{" "}
              {filteredEmployees.length}{" "}
              of{" "}
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
                  (employee) => {

                    const employeeName =
                      getEmployeeName(
                        employee
                      );

                    return (
                      <tr
                        key={employee.id}
                      >

                        {/* EMPLOYEE */}

                        <td>

                          <div className="employee-info">

                            <div className="employee-avatar">

                              {employeeName
                                .split(" ")
                                .filter(Boolean)
                                .map(
                                  (word) =>
                                    word[0]
                                )
                                .join("")
                                .substring(
                                  0,
                                  2
                                )
                                .toUpperCase()}

                            </div>


                            <div>

                              <strong>
                                {employeeName}
                              </strong>

                              <small>
                                {employee.email ||
                                  "No email"}
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
                              String(
                                employee.status ||
                                  ""
                              )
                                .toLowerCase() ===
                              "active"
                                ? "status-active"
                                : String(
                                    employee.status ||
                                      ""
                                  )
                                    .toLowerCase() ===
                                  "on leave"
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
                                handleEditEmployee(
                                  employee
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
                    );
                  }
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
          VIEW EMPLOYEE MODAL
      ================================================= */}

      {(viewLoading ||
        viewError ||
        selectedEmployee) && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => {
            if (!viewLoading) {
              closeView();
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
                "0 20px 60px rgba(0,0,0,0.25)",
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
                  padding: "40px",
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

            {!viewLoading &&
              viewError && (

                <div>

                  <h2>
                    Unable to fetch employee
                  </h2>

                  <p>
                    {viewError}
                  </p>

                  <button
                    type="button"
                    onClick={closeView}
                  >
                    Close
                  </button>

                </div>

              )}


            {/* DETAILS */}

            {!viewLoading &&
              !viewError &&
              selectedEmployee && (

                <div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      marginBottom:
                        "25px",
                    }}
                  >

                    <div>

                      <h2>
                        {getEmployeeName(
                          selectedEmployee
                        )}
                      </h2>

                      <p>
                        Employee ID:{" "}
                        <strong>
                          {
                            selectedEmployee.emp_id
                          }
                        </strong>
                      </p>

                    </div>


                    <button
                      type="button"
                      onClick={closeView}
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
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
                      marginBottom:
                        "25px",
                    }}
                  >

                    <div>
                      <strong>
                        First Name
                      </strong>

                      <div>
                        {
                          selectedEmployee.first_name
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Last Name
                      </strong>

                      <div>
                        {
                          selectedEmployee.last_name
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Gender
                      </strong>

                      <div>
                        {
                          selectedEmployee.gender
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Date of Birth
                      </strong>

                      <div>
                        {
                          selectedEmployee.date_of_birth
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Phone
                      </strong>

                      <div>
                        {
                          selectedEmployee.phone
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Email
                      </strong>

                      <div>
                        {
                          selectedEmployee.email
                        }
                      </div>
                    </div>


                    <div
                      style={{
                        gridColumn:
                          "1 / -1",
                      }}
                    >
                      <strong>
                        Address
                      </strong>

                      <div>
                        {
                          selectedEmployee.address ||
                          "N/A"
                        }
                      </div>
                    </div>

                  </div>


                  <h3>
                    Emergency Contact
                  </h3>


                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "15px",
                      marginBottom:
                        "25px",
                    }}
                  >

                    <div>
                      <strong>
                        Name
                      </strong>

                      <div>
                        {
                          selectedEmployee.emergency_name ||
                          "N/A"
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Phone
                      </strong>

                      <div>
                        {
                          selectedEmployee.emergency_phone ||
                          "N/A"
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Relationship
                      </strong>

                      <div>
                        {
                          selectedEmployee.emergency_relationship ||
                          "N/A"
                        }
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
                      gap: "15px",
                    }}
                  >

                    <div>
                      <strong>
                        Employee ID
                      </strong>

                      <div>
                        {
                          selectedEmployee.emp_id
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Department
                      </strong>

                      <div>
                        {
                          selectedEmployee.department
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Designation
                      </strong>

                      <div>
                        {
                          selectedEmployee.designation
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Joining Date
                      </strong>

                      <div>
                        {
                          selectedEmployee.joining_date
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Employment Type
                      </strong>

                      <div>
                        {
                          selectedEmployee.employment_type ||
                          "N/A"
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Monthly Salary
                      </strong>

                      <div>
                        {
                          selectedEmployee.monthly_salary ??
                          "N/A"
                        }
                      </div>
                    </div>


                    <div>
                      <strong>
                        Status
                      </strong>

                      <div>
                        {
                          selectedEmployee.status
                        }
                      </div>
                    </div>

                  </div>

                </div>

              )}

          </div>

        </div>

      )}


      {/* =================================================
          EDIT EMPLOYEE MODAL
      ================================================= */}

      {editingEmployee && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: "20px",
          }}
          onClick={() => {
            if (!editLoading) {
              closeEdit();
            }
          }}
        >

          <div
            style={{
              background: "#fff",
              width: "95%",
              maxWidth: "900px",
              maxHeight: "92vh",
              overflowY: "auto",
              borderRadius: "14px",
              padding: "30px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* EDIT HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >

              <div>

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Edit Employee
                </h2>

                <p
                  style={{
                    marginTop: "6px",
                    color: "#666",
                  }}
                >
                  Update employee information
                </p>

              </div>


              <button
                type="button"
                onClick={closeEdit}
                disabled={editLoading}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>

            </div>


            {/* ERROR */}

            {editError && (

              <div
                style={{
                  background: "#ffe8e8",
                  color: "#b00020",
                  padding: "12px 15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                {editError}
              </div>

            )}


            {/* FORM */}

            <form
              onSubmit={handleSaveEmployee}
            >

              {/* =======================================
                  PERSONAL INFORMATION
              ======================================= */}

              <h3>
                Personal Information
              </h3>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "18px",
                  marginBottom: "25px",
                }}
              >

                {/* EMP ID */}

                <div>

                  <label>
                    Employee ID
                  </label>

                  <input
                    type="text"
                    name="emp_id"
                    value={
                      editForm.emp_id
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* FIRST NAME */}

                <div>

                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={
                      editForm.first_name
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* LAST NAME */}

                <div>

                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={
                      editForm.last_name
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* GENDER */}

                <div>

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      editForm.gender
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                  </select>

                </div>


                {/* DOB */}

                <div>

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="date_of_birth"
                    value={
                      editForm.date_of_birth
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* PHONE */}

                <div>

                  <label>
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      editForm.phone
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* EMAIL */}

                <div>

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      editForm.email
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* ADDRESS */}

                <div
                  style={{
                    gridColumn:
                      "1 / -1",
                  }}
                >

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={
                      editForm.address
                    }
                    onChange={
                      handleEditChange
                    }
                    rows="3"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                      resize: "vertical",
                    }}
                  />

                </div>

              </div>


              {/* =======================================
                  EMERGENCY CONTACT
              ======================================= */}

              <h3>
                Emergency Contact
              </h3>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "18px",
                  marginBottom: "25px",
                }}
              >

                <div>

                  <label>
                    Emergency Name
                  </label>

                  <input
                    type="text"
                    value={
                      editingEmployee.emergency_name ||
                      ""
                    }
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                      background:
                        "#f5f5f5",
                    }}
                  />

                </div>


                <div>

                  <label>
                    Emergency Phone
                  </label>

                  <input
                    type="text"
                    value={
                      editingEmployee.emergency_phone ||
                      ""
                    }
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                      background:
                        "#f5f5f5",
                    }}
                  />

                </div>


                <div>

                  <label>
                    Relationship
                  </label>

                  <input
                    type="text"
                    value={
                      editingEmployee.emergency_relationship ||
                      ""
                    }
                    disabled
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                      background:
                        "#f5f5f5",
                    }}
                  />

                </div>

              </div>


              {/* =======================================
                  EMPLOYMENT INFORMATION
              ======================================= */}

              <h3>
                Employment Information
              </h3>


              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: "18px",
                  marginBottom: "25px",
                }}
              >

                {/* DEPARTMENT */}

                <div>

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={
                      editForm.department
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  >

                    <option value="">
                      Select Department
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


                {/* DESIGNATION */}

                <div>

                  <label>
                    Designation
                  </label>

                  <input
                    type="text"
                    name="designation"
                    value={
                      editForm.designation
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    placeholder="e.g. Jr Officer"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* JOINING DATE */}

                <div>

                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joining_date"
                    value={
                      editForm.joining_date
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* EMPLOYMENT TYPE */}

                <div>

                  <label>
                    Employment Type
                  </label>

                  <select
                    name="employment_type"
                    value={
                      editForm.employment_type
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  >

                    <option value="">
                      Select Type
                    </option>

                    <option value="Permanent">
                      Permanent
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                    <option value="Temporary">
                      Temporary
                    </option>

                    <option value="Intern">
                      Intern
                    </option>

                  </select>

                </div>


                {/* SALARY */}

                <div>

                  <label>
                    Monthly Salary
                  </label>

                  <input
                    type="number"
                    name="monthly_salary"
                    value={
                      editForm.monthly_salary
                    }
                    onChange={
                      handleEditChange
                    }
                    min="0"
                    step="0.01"
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  />

                </div>


                {/* STATUS */}

                <div>

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      editForm.status
                    }
                    onChange={
                      handleEditChange
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginTop: "6px",
                      boxSizing:
                        "border-box",
                    }}
                  >

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

              </div>


              {/* =======================================
                  BUTTONS
              ======================================= */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "12px",
                  marginTop: "25px",
                  borderTop:
                    "1px solid #eee",
                  paddingTop: "20px",
                }}
              >

                <button
                  type="button"
                  onClick={closeEdit}
                  disabled={editLoading}
                  style={{
                    padding:
                      "11px 22px",
                    borderRadius:
                      "8px",
                    border:
                      "1px solid #ccc",
                    background:
                      "#fff",
                    cursor:
                      editLoading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={editLoading}
                  style={{
                    padding:
                      "11px 25px",
                    borderRadius:
                      "8px",
                    border: "none",
                    background:
                      "#2563eb",
                    color: "#fff",
                    cursor:
                      editLoading
                        ? "not-allowed"
                        : "pointer",
                    fontWeight:
                      "600",
                  }}
                >

                  {editLoading
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Employees;
