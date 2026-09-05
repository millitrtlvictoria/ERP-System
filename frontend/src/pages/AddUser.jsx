import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddUser.css";

function AddUser() {
const navigate = useNavigate();

// =====================================================
// FORM DATA
// =====================================================

const [formData, setFormData] = useState({
employeeId: "",
firstName: "",
lastName: "",
email: "",
phone: "",
username: "",
password: "",
confirmPassword: "",
role: "",
});

// =====================================================
// PERMISSIONS
// =====================================================

const [permissions, setPermissions] = useState({
dashboard: {
view: true,
add: false,
edit: false,
delete: false,
},
employees: {
view: true,
add: false,
edit: false,
delete: false,
},
users: {
view: false,
add: false,
edit: false,
delete: false,
},
attendance: {
view: false,
add: false,
edit: false,
delete: false,
},
leave: {
view: false,
add: false,
edit: false,
delete: false,
},
payroll: {
view: false,
add: false,
edit: false,
delete: false,
},
reports: {
view: false,
add: false,
edit: false,
delete: false,
},
documents: {
view: false,
add: false,
edit: false,
delete: false,
},
});

// =====================================================
// OTHER STATES
// =====================================================

const [errors, setErrors] = useState({});
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// =====================================================
// HANDLE FORM CHANGE
// =====================================================

const handleChange = (e) => {
const { name, value } = e.target;

setFormData((previous) => ({
  ...previous,
  [name]: value,
}));

if (errors[name]) {
  setErrors((previous) => ({
    ...previous,
    [name]: "",
  }));
}


};

// =====================================================
// HANDLE PERMISSION CHANGE
// =====================================================

const handlePermissionChange = (module, permission) => {
setPermissions((previous) => ({
...previous,
[module]: {
...previous[module],
[permission]: !previous[module][permission],
},
}));
};

// =====================================================
// SELECT ALL PERMISSIONS
// =====================================================

const handleSelectAll = (module, checked) => {
setPermissions((previous) => ({
...previous,
[module]: {
view: checked,
add: checked,
edit: checked,
delete: checked,
},
}));
};

// =====================================================
// VALIDATE FORM
// =====================================================

const validateForm = () => {
const newErrors = {};


// Employee ID
if (!formData.employeeId.trim()) {
  newErrors.employeeId = "Employee ID is required";
}

// First Name
if (!formData.firstName.trim()) {
  newErrors.firstName = "First name is required";
}

// Last Name
if (!formData.lastName.trim()) {
  newErrors.lastName = "Last name is required";
}

// Email
if (!formData.email.trim()) {
  newErrors.email = "Email address is required";
} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
  newErrors.email = "Enter a valid email address";
}

// Phone
if (!formData.phone.trim()) {
  newErrors.phone = "Phone number is required";
}

// Username
if (!formData.username.trim()) {
  newErrors.username = "Username is required";
}

// Password
if (!formData.password) {
  newErrors.password = "Password is required";
} else if (formData.password.length < 6) {
  newErrors.password =
    "Password must contain at least 6 characters";
}

// Confirm Password
if (!formData.confirmPassword) {
  newErrors.confirmPassword =
    "Please confirm your password";
} else if (
  formData.password !== formData.confirmPassword
) {
  newErrors.confirmPassword =
    "Passwords do not match";
}

// Role
if (!formData.role) {
  newErrors.role = "Please select a role";
}

setErrors(newErrors);

return Object.keys(newErrors).length === 0;


};

// =====================================================
// SUBMIT FORM
// =====================================================

const handleSubmit = async (e) => {
e.preventDefault();

if (!validateForm()) {
  return;
}

setIsSubmitting(true);

try {
  // =================================================
  // CONVERT FRONTEND DATA TO BACKEND FORMAT
  // =================================================

  const userData = {
    employee_id: formData.employeeId.trim(),
    first_name: formData.firstName.trim(),
    last_name: formData.lastName.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    username: formData.username.trim(),
    password: formData.password,
    confirm_password: formData.confirmPassword,
    role: formData.role,
    permissions: permissions,
  };

  console.log("Sending user data:", userData);

  // =================================================
  // SEND DATA TO FASTAPI
  // =================================================

  const response = await fetch(
    "http://127.0.0.1:8000/api/user-2",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  // =================================================
  // HANDLE BACKEND ERROR
  // =================================================

  if (!response.ok) {
    const errorData = await response.json();

    let errorMessage = "Failed to create user.";

    if (errorData.detail) {
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else {
        errorMessage = JSON.stringify(errorData.detail);
      }
    }

    throw new Error(errorMessage);
  }

  // =================================================
  // SUCCESS
  // =================================================

  const createdUser = await response.json();

  console.log(
    "User created successfully:",
    createdUser
  );

  alert("User created successfully!");

  navigate("/user-management");
} catch (error) {
  console.error("Error creating user:", error);

  alert(
    `Unable to create user.\n\n${error.message}`
  );
} finally {
  setIsSubmitting(false);
}


};

// =====================================================
// RESET FORM
// =====================================================

const handleReset = () => {
setFormData({
employeeId: "",
firstName: "",
lastName: "",
email: "",
phone: "",
username: "",
password: "",
confirmPassword: "",
role: "",
});


setPermissions({
  dashboard: {
    view: true,
    add: false,
    edit: false,
    delete: false,
  },
  employees: {
    view: true,
    add: false,
    edit: false,
    delete: false,
  },
  users: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  attendance: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  leave: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  payroll: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  reports: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
  documents: {
    view: false,
    add: false,
    edit: false,
    delete: false,
  },
});

setErrors({});


};

// =====================================================
// MODULES
// =====================================================

const modules = [
{
key: "dashboard",
label: "Dashboard",
},
{
key: "employees",
label: "Employee Management",
},
{
key: "users",
label: "User Management",
},
{
key: "attendance",
label: "Attendance",
},
{
key: "leave",
label: "Leave Management",
},
{
key: "payroll",
label: "Payroll",
},
{
key: "reports",
label: "Reports",
},
{
key: "documents",
label: "Documents",
},
];

// =====================================================
// RENDER
// =====================================================

return ( <div className="add-user-page">


  {/* =================================================
      HEADER
  ================================================= */}

  <div className="add-user-header">
    <div>
      <div className="breadcrumb">

        <span
          onClick={() =>
            navigate("/user-management")
          }
        >
          User Management
        </span>

        <span className="breadcrumb-separator">
          /
        </span>

        <span>
          Add User
        </span>

      </div>

      <h1>Add New User</h1>

      <p>
        Create a new user account and configure
        their access to the ERP system.
      </p>
    </div>

    <button
      type="button"
      className="back-button"
      onClick={() =>
        navigate("/user-management")
      }
    >
      ← Back to Users
    </button>
  </div>

  <form onSubmit={handleSubmit}>

    {/* =================================================
        1. EMPLOYEE INFORMATION
    ================================================= */}

    <section className="user-card">

      <div className="section-header">

        <div className="section-icon">
          👤
        </div>

        <div>
          <h2>Employee Information</h2>

          <p>
            Enter the basic information of the user.
          </p>
        </div>

      </div>

      <div className="form-grid">

        {/* EMPLOYEE ID */}

        <div className="form-group">

          <label>
            Employee ID <span>*</span>
          </label>

          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            placeholder="e.g. EMP001"
            className={
              errors.employeeId
                ? "input-error"
                : ""
            }
          />

          {errors.employeeId && (
            <small className="error-message">
              {errors.employeeId}
            </small>
          )}

        </div>

        {/* FIRST NAME */}

        <div className="form-group">

          <label>
            First Name <span>*</span>
          </label>

          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            className={
              errors.firstName
                ? "input-error"
                : ""
            }
          />

          {errors.firstName && (
            <small className="error-message">
              {errors.firstName}
            </small>
          )}

        </div>

        {/* LAST NAME */}

        <div className="form-group">

          <label>
            Last Name <span>*</span>
          </label>

          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            className={
              errors.lastName
                ? "input-error"
                : ""
            }
          />

          {errors.lastName && (
            <small className="error-message">
              {errors.lastName}
            </small>
          )}

        </div>

        {/* EMAIL */}

        <div className="form-group">

          <label>
            Email Address <span>*</span>
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            className={
              errors.email
                ? "input-error"
                : ""
            }
          />

          {errors.email && (
            <small className="error-message">
              {errors.email}
            </small>
          )}

        </div>

        {/* PHONE */}

        <div className="form-group">

          <label>
            Phone Number <span>*</span>
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={
              errors.phone
                ? "input-error"
                : ""
            }
          />

          {errors.phone && (
            <small className="error-message">
              {errors.phone}
            </small>
          )}

        </div>

      </div>

    </section>

    {/* =================================================
        2. ACCOUNT INFORMATION
    ================================================= */}

    <section className="user-card">

      <div className="section-header">

        <div className="section-icon">
          🔐
        </div>

        <div>

          <h2>Account Information</h2>

          <p>
            Configure login credentials and account role.
          </p>

        </div>

      </div>

      <div className="form-grid">

        {/* USERNAME */}

        <div className="form-group">

          <label>
            Username <span>*</span>
          </label>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter username"
            className={
              errors.username
                ? "input-error"
                : ""
            }
          />

          {errors.username && (
            <small className="error-message">
              {errors.username}
            </small>
          )}

        </div>

        {/* PASSWORD */}

        <div className="form-group">

          <label>
            Password <span>*</span>
          </label>

          <div className="password-wrapper">

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className={
                errors.password
                  ? "input-error"
                  : ""
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

          {errors.password && (
            <small className="error-message">
              {errors.password}
            </small>
          )}

          <small className="field-hint">
            Password must contain at least 6
            characters.
          </small>

        </div>

        {/* CONFIRM PASSWORD */}

        <div className="form-group">

          <label>
            Confirm Password <span>*</span>
          </label>

          <div className="password-wrapper">

            <input
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className={
                errors.confirmPassword
                  ? "input-error"
                  : ""
              }
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword
                ? "Hide"
                : "Show"}
            </button>

          </div>

          {errors.confirmPassword && (
            <small className="error-message">
              {errors.confirmPassword}
            </small>
          )}

        </div>

        {/* ROLE */}

        <div className="form-group">

          <label>
            Role <span>*</span>
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={
              errors.role
                ? "input-error"
                : ""
            }
          >
            <option value="">
              Select role
            </option>

            <option value="Admin">
              Administrator
            </option>

            <option value="HR">
              HR Manager
            </option>

            <option value="Manager">
              Manager
            </option>

            <option value="Employee">
              Employee
            </option>

            <option value="IT">
              IT Officer
            </option>

          </select>

          {errors.role && (
            <small className="error-message">
              {errors.role}
            </small>
          )}

        </div>

      </div>

    </section>

    {/* =================================================
        3. PERMISSIONS
    ================================================= */}

    <section className="user-card">

      <div className="section-header permission-header">

        <div>

          <div className="section-title-row">

            <div className="section-icon">
              🛡️
            </div>

            <div>

              <h2>
                System Access & Permissions
              </h2>

              <p>
                Select what this user can view,
                create, edit, or delete.
              </p>

            </div>

          </div>

        </div>

        <div className="permission-note">
          Permissions can be changed later from
          User Management.
        </div>

      </div>

      <div className="permission-table-wrapper">

        <table className="permission-table">

          <thead>

            <tr>
              <th>Module</th>
              <th>View</th>
              <th>Add</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Full Access</th>
            </tr>

          </thead>

          <tbody>

            {modules.map((module) => {

              const modulePermissions =
                permissions[module.key];

              const fullAccess =
                modulePermissions.view &&
                modulePermissions.add &&
                modulePermissions.edit &&
                modulePermissions.delete;

              return (
                <tr key={module.key}>

                  <td>
                    <strong>
                      {module.label}
                    </strong>
                  </td>

                  {[
                    "view",
                    "add",
                    "edit",
                    "delete",
                  ].map((permission) => (

                    <td key={permission}>

                      <label className="checkbox-container">

                        <input
                          type="checkbox"
                          checked={
                            modulePermissions[
                              permission
                            ]
                          }
                          onChange={() =>
                            handlePermissionChange(
                              module.key,
                              permission
                            )
                          }
                        />

                        <span className="custom-checkbox"></span>

                      </label>

                    </td>

                  ))}

                  <td>

                    <label className="checkbox-container">

                      <input
                        type="checkbox"
                        checked={fullAccess}
                        onChange={(e) =>
                          handleSelectAll(
                            module.key,
                            e.target.checked
                          )
                        }
                      />

                      <span className="custom-checkbox"></span>

                    </label>

                  </td>

                </tr>
              );
            })}

          </tbody>

        </table>

      </div>

    </section>

    {/* =================================================
        SECURITY NOTICE
    ================================================= */}

    <div className="security-notice">

      <div className="security-icon">
        🔒
      </div>

      <div>

        <h3>
          Security Notice
        </h3>

        <p>
          User passwords should always be securely
          hashed before being stored in the database.
          Never store plain-text passwords.
        </p>

      </div>

    </div>

    {/* =================================================
        FORM ACTIONS
    ================================================= */}

    <div className="form-actions">

      <button
        type="button"
        className="cancel-button"
        onClick={() =>
          navigate("/user-management")
        }
        disabled={isSubmitting}
      >
        Cancel
      </button>

      <button
        type="button"
        className="reset-button"
        onClick={handleReset}
        disabled={isSubmitting}
      >
        Reset Form
      </button>

      <button
        type="submit"
        className="create-button"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Creating User..."
          : "+ Create User"}
      </button>

    </div>

  </form>

</div>


);
}

export default AddUser;
