import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/employees.css";

import {
  uploadEmployeePhoto,
  getEmployeePhoto,
  deleteEmployeePhoto,
} from "../services/employeeAPI";

const API_URL = "http://127.0.0.1:8000";

const DEPARTMENTS = [
  "SPINNING",
  "WEAVING-Rapier",
  "WEAVING-S4",
  "HR",
  "IT",
  "Administration",
];

const STATUSES = [
  "Active",
  "On Leave",
  "Inactive",
];

const GENDERS = [
  "Male",
  "Female",
];

const EMPLOYMENT_TYPES = [
  "Permanent",
  "Contract",
  "Temporary",
  "Intern",
];


// =====================================================
// HELPER FUNCTIONS
// =====================================================

function getEmployeeName(employee) {
  if (employee.name) {
    return employee.name;
  }

  return `${employee.first_name || ""} ${
    employee.last_name || ""
  }`.trim();
}


function getInitials(employee) {
  const name = getEmployeeName(employee);

  if (!name) {
    return "NA";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}


function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function formatSalary(salary) {
  if (
    salary === null ||
    salary === undefined ||
    salary === ""
  ) {
    return "-";
  }

  const number = Number(salary);

  if (Number.isNaN(number)) {
    return salary;
  }

  return `₹${number.toLocaleString("en-IN")}`;
}


function getStatusClass(status) {
  if (status === "Active") {
    return "status-active";
  }

  if (status === "On Leave") {
    return "status-leave";
  }

  return "status-inactive";
}


function getPhotoUrl(photoPath) {
  if (!photoPath) {
    return "";
  }

  if (photoPath.startsWith("http")) {
    return photoPath;
  }

  const cleanPath = photoPath.startsWith("/")
    ? photoPath
    : `/${photoPath}`;

  return `${API_URL}${cleanPath}`;
}


// =====================================================
// EMPLOYEE PHOTO THUMBNAIL
// =====================================================

function EmployeePhotoThumbnail({ employeeId, initials }) {
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPhoto = async () => {
      try {
        setLoading(true);

        const photo = await getEmployeePhoto(employeeId);

        if (!isMounted) {
          return;
        }

        if (photo?.photo_file_path) {
          setPhotoUrl(
            getPhotoUrl(photo.photo_file_path)
          );
        } else {
          setPhotoUrl("");
        }
      } catch (error) {
        if (isMounted) {
          setPhotoUrl("");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPhoto();

    return () => {
      isMounted = false;
    };
  }, [employeeId]);


  if (loading) {
    return (
      <div className="employee-photo-thumbnail photo-loading">
        <span>...</span>
      </div>
    );
  }


  if (!photoUrl) {
    return (
      <div className="employee-photo-thumbnail photo-placeholder">
        {initials}
      </div>
    );
  }


  return (
    <div className="employee-photo-thumbnail">
      <img
        src={photoUrl}
        alt="Employee"
        onError={() => setPhotoUrl("")}
      />
    </div>
  );
}


// =====================================================
// MAIN COMPONENT
// =====================================================

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

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);

  const [viewLoading, setViewLoading] =
    useState(false);

  const [viewError, setViewError] =
    useState("");

  const [viewPhoto, setViewPhoto] =
    useState(null);

  const [viewPhotoError, setViewPhotoError] =
    useState(false);


  // =====================================================
  // EDIT EMPLOYEE
  // =====================================================

  const [editingEmployee, setEditingEmployee] =
    useState(null);

  const [editForm, setEditForm] = useState({
    emp_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    emergency_name: "",
    emergency_phone: "",
    emergency_relationship: "",
    department: "",
    designation: "",
    joining_date: "",
    employment_type: "",
    monthly_salary: "",
    status: "Active",
  });

  const [editLoading, setEditLoading] =
    useState(false);

  const [editError, setEditError] =
    useState("");


  // =====================================================
  // EDIT PHOTO
  // =====================================================

  const [editPhoto, setEditPhoto] =
    useState(null);

  const [editPhotoFile, setEditPhotoFile] =
    useState(null);

  const [editPhotoLoading, setEditPhotoLoading] =
    useState(false);

  const [savedEditPhoto, setSavedEditPhoto] =
    useState(null);

  const [photoInputKey, setPhotoInputKey] =
    useState(Date.now());


  // =====================================================
  // FETCH ALL EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/employees`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

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


  useEffect(() => {
    fetchEmployees();
  }, []);


  // =====================================================
  // FILTER + SEARCH + SORT
  // =====================================================

  const filteredEmployees = useMemo(() => {

    let result = employees.filter(
      (employee) => {

        const searchText =
          search.trim().toLowerCase();

        const employeeName =
          getEmployeeName(employee).toLowerCase();

        const employeeId =
          String(
            employee.emp_id || ""
          ).toLowerCase();

        const employeeDatabaseId =
          String(
            employee.id || ""
          ).toLowerCase();

        const employeePhone =
          String(
            employee.phone || ""
          ).toLowerCase();

        const employeeEmail =
          String(
            employee.email || ""
          ).toLowerCase();

        const matchesSearch =
          !searchText ||
          employeeName.includes(searchText) ||
          employeeId.includes(searchText) ||
          employeeDatabaseId.includes(searchText) ||
          employeePhone.includes(searchText) ||
          employeeEmail.includes(searchText);

        const matchesDepartment =
          department === "All" ||
          String(
            employee.department || ""
          ).toLowerCase() ===
            department.toLowerCase();

        const matchesStatus =
          status === "All" ||
          String(
            employee.status || ""
          ).toLowerCase() ===
            status.toLowerCase();

        const matchesGender =
          gender === "All" ||
          String(
            employee.gender || ""
          ).toLowerCase() ===
            gender.toLowerCase();

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesStatus &&
          matchesGender
        );
      }
    );


    result = [...result].sort(
      (a, b) => {

        if (sortBy === "name") {
          return getEmployeeName(a).localeCompare(
            getEmployeeName(b)
          );
        }

        if (sortBy === "id") {
          return String(
            a.emp_id || ""
          ).localeCompare(
            String(b.emp_id || "")
          );
        }

        if (sortBy === "department") {
          return String(
            a.department || ""
          ).localeCompare(
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
      }
    );

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

    try {

      setViewLoading(true);
      setViewError("");
      setSelectedEmployee(null);
      setViewPhoto(null);
      setViewPhotoError(false);

      const response = await fetch(
        `${API_URL}/api/employees/emp/${encodeURIComponent(
          empId
        )}`
      );

      if (!response.ok) {

        const errorData =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          errorData?.detail ||
            `Employee not found (${response.status})`
        );
      }

      const employee =
        await response.json();

      setSelectedEmployee(employee);


      // -----------------------------------------------
      // LOAD EMPLOYEE PHOTO
      // -----------------------------------------------

      try {

        const photo =
          await getEmployeePhoto(
            employee.id
          );

        if (
          photo?.photo_file_path
        ) {

          setViewPhoto(
            getPhotoUrl(
              photo.photo_file_path
            )
          );

        } else {

          setViewPhoto(null);
        }

      } catch (photoError) {

        console.error(
          "Error loading employee photo:",
          photoError
        );

        setViewPhoto(null);
      }

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
  // CLOSE VIEW MODAL
  // =====================================================

  const closeViewModal = () => {
    setSelectedEmployee(null);
    setViewError("");
    setViewPhoto(null);
    setViewPhotoError(false);
  };


  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditEmployee = async (employee) => {

    setEditingEmployee(employee);

    setEditError("");

    setEditPhoto(null);
    setEditPhotoFile(null);
    setSavedEditPhoto(null);

    setPhotoInputKey(Date.now());

    setEditForm({
      emp_id: employee.emp_id || "",
      first_name: employee.first_name || "",
      last_name: employee.last_name || "",
      gender: employee.gender || "",
      date_of_birth:
        employee.date_of_birth || "",
      phone: employee.phone || "",
      email: employee.email || "",
      address: employee.address || "",
      emergency_name:
        employee.emergency_name || "",
      emergency_phone:
        employee.emergency_phone || "",
      emergency_relationship:
        employee.emergency_relationship || "",
      department:
        employee.department || "",
      designation:
        employee.designation || "",
      joining_date:
        employee.joining_date || "",
      employment_type:
        employee.employment_type ||
        employee.employment_type_ ||
        "",
      monthly_salary:
        employee.monthly_salary ?? "",
      status:
        employee.status || "Active",
    });


    // -----------------------------------------------
    // LOAD SAVED PHOTO
    // -----------------------------------------------

    try {

      setEditPhotoLoading(true);

      const photo =
        await getEmployeePhoto(
          employee.id
        );

      if (
        photo?.photo_file_path
      ) {

        setSavedEditPhoto({
          ...photo,
          url: getPhotoUrl(
            photo.photo_file_path
          ),
        });

      } else {

        setSavedEditPhoto(null);
      }

    } catch (err) {

      console.error(
        "Error loading edit photo:",
        err
      );

      setSavedEditPhoto(null);

    } finally {

      setEditPhotoLoading(false);
    }
  };


  // =====================================================
  // EDIT FORM CHANGE
  // =====================================================

  const handleEditChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setEditForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // =====================================================
  // SELECT NEW PHOTO
  // =====================================================

  const handleEditPhotoChange = (e) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      alert(
        "Please select a JPEG, PNG or WebP image."
      );

      e.target.value = "";
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {

      alert(
        "Photo size must be 5 MB or less."
      );

      e.target.value = "";
      return;
    }

    if (editPhoto) {
      URL.revokeObjectURL(editPhoto);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setEditPhoto(previewUrl);
    setEditPhotoFile(file);
  };


  // =====================================================
  // REMOVE SELECTED PHOTO
  // =====================================================

  const handleRemoveSelectedPhoto = () => {

    if (editPhoto) {
      URL.revokeObjectURL(editPhoto);
    }

    setEditPhoto(null);
    setEditPhotoFile(null);

    setPhotoInputKey(Date.now());
  };


  // =====================================================
  // DELETE SAVED PHOTO
  // =====================================================

  const handleDeleteEmployeePhoto = async () => {

    if (!editingEmployee) {
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to remove this employee photo?"
      );

    if (!confirmDelete) {
      return;
    }

    try {

      setEditPhotoLoading(true);

      await deleteEmployeePhoto(
        editingEmployee.id
      );

      setSavedEditPhoto(null);

      setEditPhoto(null);
      setEditPhotoFile(null);

      setPhotoInputKey(Date.now());

      alert(
        "Employee photo removed successfully."
      );

    } catch (err) {

      console.error(
        "Delete photo error:",
        err
      );

      alert(
        err.message ||
          "Unable to remove employee photo."
      );

    } finally {

      setEditPhotoLoading(false);
    }
  };


  // =====================================================
  // SAVE EMPLOYEE
  // =====================================================

  const handleSaveEmployee = async (e) => {

    e.preventDefault();

    if (!editingEmployee) {
      return;
    }

    try {

      setEditLoading(true);
      setEditError("");

      const employeeData = {
        emp_id: editForm.emp_id,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        gender: editForm.gender,
        date_of_birth:
          editForm.date_of_birth,
        phone: editForm.phone,
        email: editForm.email,

        address:
          editForm.address === ""
            ? null
            : editForm.address,

        emergency_name:
          editForm.emergency_name === ""
            ? null
            : editForm.emergency_name,

        emergency_phone:
          editForm.emergency_phone === ""
            ? null
            : editForm.emergency_phone,

        emergency_relationship:
          editForm.emergency_relationship === ""
            ? null
            : editForm.emergency_relationship,

        department:
          editForm.department,

        designation:
          editForm.designation,

        joining_date:
          editForm.joining_date,

        employment_type:
          editForm.employment_type,

        monthly_salary:
          editForm.monthly_salary === ""
            ? null
            : Number(
                editForm.monthly_salary
              ),

        status:
          editForm.status,
      };


      // -----------------------------------------------
      // UPDATE EMPLOYEE DATA
      // -----------------------------------------------

      const response = await fetch(
        `${API_URL}/api/employees/id/${editingEmployee.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            employeeData
          ),
        }
      );


      if (!response.ok) {

        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.detail ||
            "Failed to update employee."
        );
      }


      // -----------------------------------------------
      // UPLOAD NEW PHOTO IF SELECTED
      // -----------------------------------------------

      if (editPhotoFile) {

        await uploadEmployeePhoto(
          editingEmployee.id,
          editPhotoFile
        );
      }


      // -----------------------------------------------
      // REFRESH EMPLOYEE LIST
      // -----------------------------------------------

      await fetchEmployees();

      alert(
        "Employee updated successfully."
      );


      // -----------------------------------------------
      // CLOSE MODAL
      // -----------------------------------------------

      if (editPhoto) {
        URL.revokeObjectURL(editPhoto);
      }

      setEditingEmployee(null);
      setEditPhoto(null);
      setEditPhotoFile(null);
      setSavedEditPhoto(null);

    } catch (err) {

      console.error(
        "Update employee error:",
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
  // CLOSE EDIT MODAL
  // =====================================================

  const closeEditModal = () => {

    if (editPhoto) {
      URL.revokeObjectURL(editPhoto);
    }

    setEditingEmployee(null);

    setEditError("");

    setEditPhoto(null);
    setEditPhotoFile(null);
    setSavedEditPhoto(null);

    setPhotoInputKey(Date.now());
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
          await response
            .json()
            .catch(() => null);

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
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="employees-page">

        <div className="employee-table-card">

          <div className="employees-state">

            <div className="state-spinner"></div>

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

          <div className="employees-state error-state">

            <div className="state-icon">
              !
            </div>

            <h2>
              Unable to load employees
            </h2>

            <p>
              {error}
            </p>

            <button
              type="button"
              className="try-again-btn"
              onClick={fetchEmployees}
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
          PAGE HEADER
      ================================================= */}

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
              Search and filter employee
              records
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
                setSearch(
                  e.target.value
                )
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
                setDepartment(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Departments
              </option>

              {DEPARTMENTS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

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
                setStatus(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Status
              </option>

              {STATUSES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

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
                setGender(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Gender
              </option>

              {GENDERS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

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
                setSortBy(
                  e.target.value
                )
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
                  Photo
                </th>

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

                    const name =
                      getEmployeeName(
                        employee
                      );

                    const initials =
                      getInitials(
                        employee
                      );


                    return (
                      <tr
                        key={employee.id}
                      >

                        {/* PHOTO */}

                        <td>

                          <EmployeePhotoThumbnail
                            employeeId={
                              employee.id
                            }
                            initials={
                              initials
                            }
                          />

                        </td>


                        {/* EMPLOYEE */}

                        <td>

                          <div className="employee-info">

                            <div className="employee-avatar">

                              {initials}

                            </div>


                            <div>

                              <strong>
                                {name || "Unknown Employee"}
                              </strong>

                              <small>
                                {employee.email || "-"}
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
                          {employee.phone || "-"}
                        </td>


                        {/* DEPARTMENT */}

                        <td>

                          <span className="department-badge">
                            {employee.department || "-"}
                          </span>

                        </td>


                        {/* DESIGNATION */}

                        <td>
                          {employee.designation || "-"}
                        </td>


                        {/* GENDER */}

                        <td>
                          {employee.gender || "-"}
                        </td>


                        {/* JOINING DATE */}

                        <td>
                          {formatDate(
                            employee.joining_date
                          )}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`employee-status ${getStatusClass(
                              employee.status
                            )}`}
                          >
                            {employee.status || "-"}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="employee-actions">

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
                    colSpan="10"
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
          className="employee-modal-overlay"
          onClick={() => {
            if (!viewLoading) {
              closeViewModal();
            }
          }}
        >

          <div
            className="employee-modal view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* VIEW LOADING */}

            {viewLoading && (

              <div className="modal-state">

                <div className="state-spinner"></div>

                <h2>
                  Loading employee...
                </h2>

                <p>
                  Fetching employee data
                  from FastAPI.
                </p>

              </div>

            )}


            {/* VIEW ERROR */}

            {!viewLoading &&
              viewError && (

                <div className="modal-state error-state">

                  <div className="state-icon">
                    !
                  </div>

                  <h2>
                    Unable to fetch employee
                  </h2>

                  <p>
                    {viewError}
                  </p>

                  <button
                    type="button"
                    className="modal-primary-btn"
                    onClick={
                      closeViewModal
                    }
                  >
                    Close
                  </button>

                </div>
              )}


            {/* EMPLOYEE DETAILS */}

            {!viewLoading &&
              !viewError &&
              selectedEmployee && (

                <>

                  {/* =================================================
                      VIEW MODAL HEADER
                      PHOTO MOVED TO TOP-RIGHT
                  ================================================= */}

                  <div className="modal-header">

                    <div className="view-employee-title">

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


                    <div className="view-photo-large">

                      {viewPhoto &&
                      !viewPhotoError ? (

                        <img
                          src={viewPhoto}
                          alt="Employee"
                          onError={() =>
                            setViewPhotoError(
                              true
                            )
                          }
                        />

                      ) : (

                        <span>
                          {getInitials(
                            selectedEmployee
                          )}
                        </span>

                      )}

                    </div>


                    <button
                      type="button"
                      className="modal-close-btn"
                      onClick={
                        closeViewModal
                      }
                    >
                      ✕
                    </button>

                  </div>


                  <div className="modal-divider"></div>


                  {/* PERSONAL INFORMATION */}

                  <section className="details-section">

                    <h3>
                      Personal Information
                    </h3>


                    <div className="details-grid">

                      <div className="detail-item">

                        <span>
                          First Name
                        </span>

                        <strong>
                          {
                            selectedEmployee.first_name ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Last Name
                        </span>

                        <strong>
                          {
                            selectedEmployee.last_name ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Gender
                        </span>

                        <strong>
                          {
                            selectedEmployee.gender ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Date of Birth
                        </span>

                        <strong>
                          {formatDate(
                            selectedEmployee.date_of_birth
                          )}
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Phone
                        </span>

                        <strong>
                          {
                            selectedEmployee.phone ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Email
                        </span>

                        <strong>
                          {
                            selectedEmployee.email ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item detail-full">

                        <span>
                          Address
                        </span>

                        <strong>
                          {
                            selectedEmployee.address ||
                            "-"
                          }
                        </strong>

                      </div>

                    </div>

                  </section>


                  {/* EMERGENCY INFORMATION */}

                  <section className="details-section">

                    <h3>
                      Emergency Contact
                    </h3>


                    <div className="details-grid">

                      <div className="detail-item">

                        <span>
                          Contact Name
                        </span>

                        <strong>
                          {
                            selectedEmployee.emergency_name ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Contact Phone
                        </span>

                        <strong>
                          {
                            selectedEmployee.emergency_phone ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Relationship
                        </span>

                        <strong>
                          {
                            selectedEmployee.emergency_relationship ||
                            "-"
                          }
                        </strong>

                      </div>

                    </div>

                  </section>


                  {/* EMPLOYMENT INFORMATION */}

                  <section className="details-section">

                    <h3>
                      Employment Information
                    </h3>


                    <div className="details-grid">

                      <div className="detail-item">

                        <span>
                          Employee ID
                        </span>

                        <strong>
                          {
                            selectedEmployee.emp_id ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Department
                        </span>

                        <strong>
                          {
                            selectedEmployee.department ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Designation
                        </span>

                        <strong>
                          {
                            selectedEmployee.designation ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Joining Date
                        </span>

                        <strong>
                          {formatDate(
                            selectedEmployee.joining_date
                          )}
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Employment Type
                        </span>

                        <strong>
                          {
                            selectedEmployee.employment_type ||
                            selectedEmployee.employment_type_ ||
                            "-"
                          }
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Monthly Salary
                        </span>

                        <strong>
                          {formatSalary(
                            selectedEmployee.monthly_salary
                          )}
                        </strong>

                      </div>


                      <div className="detail-item">

                        <span>
                          Status
                        </span>

                        <strong
                          className={`detail-status ${getStatusClass(
                            selectedEmployee.status
                          )}`}
                        >
                          {
                            selectedEmployee.status ||
                            "-"
                          }
                        </strong>

                      </div>

                    </div>

                  </section>


                  <div className="modal-footer">

                    <button
                      type="button"
                      className="modal-secondary-btn"
                      onClick={
                        closeViewModal
                      }
                    >
                      Close
                    </button>

                  </div>

                </>
              )}

          </div>

        </div>
      )}


      {/* =================================================
          EDIT EMPLOYEE MODAL
      ================================================= */}

      {editingEmployee && (

        <div
          className="employee-modal-overlay"
          onClick={() => {
            if (!editLoading) {
              closeEditModal();
            }
          }}
        >

          <div
            className="employee-modal edit-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Edit Employee
                </h2>

                <p>
                  Update employee information
                  and profile photo.
                </p>

              </div>


              <button
                type="button"
                className="modal-close-btn"
                onClick={
                  closeEditModal
                }
                disabled={editLoading}
              >
                ✕
              </button>

            </div>


            {editError && (

              <div className="form-error-message">
                {editError}
              </div>

            )}


            <form
              className="edit-employee-form"
              onSubmit={
                handleSaveEmployee
              }
            >


              {/* BASIC INFORMATION */}

              <section className="edit-section">

                <div className="edit-section-heading">

                  <div className="edit-section-icon">
                    👤
                  </div>

                  <div>

                    <h3>
                      Basic Information
                    </h3>

                    <p>
                      Employee personal details
                    </p>

                  </div>

                </div>


                <div className="edit-form-grid">

                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    >

                      <option value="">
                        Select Gender
                      </option>

                      {GENDERS.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={
                        editForm.phone
                      }
                      onChange={
                        handleEditChange
                      }
                      required
                    />

                  </div>


                  <div className="edit-form-group edit-full-width">

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
                    />

                  </div>


                  <div className="edit-form-group edit-full-width">

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
                    />

                  </div>

                </div>

              </section>


              {/* EMERGENCY CONTACT */}

              <section className="edit-section">

                <div className="edit-section-heading">

                  <div className="edit-section-icon">
                    ☎
                  </div>

                  <div>

                    <h3>
                      Emergency Contact
                    </h3>

                    <p>
                      Emergency contact information
                    </p>

                  </div>

                </div>


                <div className="edit-form-grid">

                  <div className="edit-form-group">

                    <label>
                      Contact Name
                    </label>

                    <input
                      type="text"
                      name="emergency_name"
                      value={
                        editForm.emergency_name
                      }
                      onChange={
                        handleEditChange
                      }
                    />

                  </div>


                  <div className="edit-form-group">

                    <label>
                      Contact Phone
                    </label>

                    <input
                      type="tel"
                      name="emergency_phone"
                      value={
                        editForm.emergency_phone
                      }
                      onChange={
                        handleEditChange
                      }
                    />

                  </div>


                  <div className="edit-form-group">

                    <label>
                      Relationship
                    </label>

                    <input
                      type="text"
                      name="emergency_relationship"
                      value={
                        editForm.emergency_relationship
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="e.g. Father, Mother, Spouse"
                    />

                  </div>

                </div>

              </section>


              {/* EMPLOYMENT INFORMATION */}

              <section className="edit-section">

                <div className="edit-section-heading">

                  <div className="edit-section-icon">
                    💼
                  </div>

                  <div>

                    <h3>
                      Employment Information
                    </h3>

                    <p>
                      Job and employment details
                    </p>

                  </div>

                </div>


                <div className="edit-form-grid">

                  <div className="edit-form-group">

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
                    >

                      <option value="">
                        Select Department
                      </option>

                      {DEPARTMENTS.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    >

                      <option value="">
                        Select Employment Type
                      </option>

                      {EMPLOYMENT_TYPES.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  <div className="edit-form-group">

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
                    />

                  </div>


                  <div className="edit-form-group">

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
                    >

                      {STATUSES.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </section>


              {/* EMPLOYEE PHOTO */}

              <section className="edit-section">

                <div className="edit-section-heading">

                  <div className="edit-section-icon">
                    📷
                  </div>

                  <div>

                    <h3>
                      Employee Photo
                    </h3>

                    <p>
                      Upload or replace employee
                      profile photo
                    </p>

                  </div>

                </div>


                <div className="edit-photo-area">


                  {/* CURRENT / PREVIEW PHOTO */}

                  <div className="edit-photo-preview">

                    {editPhoto ? (

                      <img
                        src={editPhoto}
                        alt="New employee preview"
                      />

                    ) : savedEditPhoto ? (

                      <img
                        src={
                          savedEditPhoto.url
                        }
                        alt="Current employee"
                        onError={() =>
                          setSavedEditPhoto(
                            null
                          )
                        }
                      />

                    ) : (

                      <span>
                        {getInitials(
                          editingEmployee
                        )}
                      </span>

                    )}

                  </div>


                  <div className="edit-photo-controls">

                    <label
                      htmlFor="editEmployeePhoto"
                      className="choose-photo-btn"
                    >
                      Choose Photo
                    </label>

                    <input
                      key={photoInputKey}
                      id="editEmployeePhoto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleEditPhotoChange
                      }
                    />


                    <p className="photo-help-text">
                      JPG, PNG or WebP.
                      Maximum size: 5 MB.
                    </p>


                    {editPhoto && (

                      <button
                        type="button"
                        className="remove-selected-photo-btn"
                        onClick={
                          handleRemoveSelectedPhoto
                        }
                      >
                        Remove Selected Photo
                      </button>

                    )}


                    {!editPhoto &&
                      savedEditPhoto && (

                        <button
                          type="button"
                          className="remove-saved-photo-btn"
                          onClick={
                            handleDeleteEmployeePhoto
                          }
                          disabled={
                            editPhotoLoading
                          }
                        >
                          {editPhotoLoading
                            ? "Removing..."
                            : "Remove Current Photo"}
                        </button>

                      )}

                  </div>

                </div>

              </section>


              {/* FORM ACTIONS */}

              <div className="edit-modal-actions">

                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={
                    closeEditModal
                  }
                  disabled={editLoading}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="modal-primary-btn"
                  disabled={editLoading}
                >
                  {editLoading
                    ? "Saving..."
                    : "✓ Save Changes"}
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