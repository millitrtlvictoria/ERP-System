import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddUser.css";

const API_URL = "http://127.0.0.1:8000";

const DEFAULT_PERMISSIONS = {
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
};

function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [permissions, setPermissions] = useState(
    DEFAULT_PERMISSIONS
  );

  // =====================================================
  // OTHER STATES
  // =====================================================

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  // LOAD USER
  // =====================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(
          `${API_URL}/api/user-2/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load user information.");
        }

        const user = await response.json();

        console.log("User loaded for editing:", user);

        setFormData({
          employeeId: user.employee_id || "",
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "",
          username: user.username || "",
          password: "",
          confirmPassword: "",
          role: user.role || "",
        });

        if (user.permissions) {
          let loadedPermissions = user.permissions;

          if (typeof loadedPermissions === "string") {
            try {
              loadedPermissions = JSON.parse(
                loadedPermissions
              );
            } catch {
              loadedPermissions = {};
            }
          }

          setPermissions({
            ...DEFAULT_PERMISSIONS,
            ...loadedPermissions,
          });
        }
      } catch (error) {
        console.error("Error loading user:", error);

        alert(
          `Unable to load user.\n\n${error.message}`
        );

        navigate("/user-management");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadUser();
    }
  }, [id, navigate]);

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

  const handlePermissionChange = (
    module,
    permission
  ) => {
    setPermissions((previous) => ({
      ...previous,
      [module]: {
        ...previous[module],
        [permission]:
          !previous[module][permission],
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

    if (!formData.employeeId.trim()) {
      newErrors.employeeId =
        "Employee ID is required";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName =
        "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName =
        "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(formData.email)
    ) {
      newErrors.email =
        "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    }

    if (!formData.username.trim()) {
      newErrors.username =
        "Username is required";
    }

    // Password is optional while editing.
    // If user enters a new password, validate it.

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password =
          "Password must contain at least 6 characters";
      }

      if (
        formData.password !==
        formData.confirmPassword
      ) {
        newErrors.confirmPassword =
          "Passwords do not match";
      }
    }

    if (!formData.role) {
      newErrors.role =
        "Please select a role";
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
      const userData = {
        employee_id:
          formData.employeeId.trim(),

        first_name:
          formData.firstName.trim(),

        last_name:
          formData.lastName.trim(),

        email:
          formData.email.trim(),

        phone:
          formData.phone.trim(),

        username:
          formData.username.trim(),

        role:
          formData.role,

        permissions:
          permissions,
      };

      // Only send password when the user
      // actually entered a new password.

      if (formData.password) {
        userData.password =
          formData.password;

        userData.confirm_password =
          formData.confirmPassword;
      }

      console.log(
        "Updating user:",
        userData
      );

      const response = await fetch(
        `${API_URL}/api/user-2/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json();

        let errorMessage =
          "Failed to update user.";

        if (errorData.detail) {
          if (
            typeof errorData.detail ===
            "string"
          ) {
            errorMessage =
              errorData.detail;
          } else {
            errorMessage =
              JSON.stringify(
                errorData.detail
              );
          }
        }

        throw new Error(
          errorMessage
        );
      }

      const updatedUser =
        await response.json();

      console.log(
        "User updated successfully:",
        updatedUser
      );

      alert(
        "User updated successfully!"
      );

      navigate(
        "/user-management"
      );
    } catch (error) {
      console.error(
        "Error updating user:",
        error
      );

      alert(
        `Unable to update user.\n\n${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // RENDER LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div className="add-user-page">
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          Loading user information...
        </div>
      </div>
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="add-user-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="add-user-header">

        <div>

          <div className="breadcrumb">

            <span
              onClick={() =>
                navigate(
                  "/user-management"
                )
              }
            >
              User Management
            </span>

            <span className="breadcrumb-separator">
              /
            </span>

            <span>
              Edit User
            </span>

          </div>

          <h1>
            Edit User
          </h1>

          <p>
            Update the user account
            information and system
            permissions.
          </p>

        </div>

        <button
          type="button"
          className="back-button"
          onClick={() =>
            navigate(
              "/user-management"
            )
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

              <h2>
                Employee Information
              </h2>

              <p>
                Update the basic
                information of the user.
              </p>

            </div>

          </div>

          <div className="form-grid">

            {/* EMPLOYEE ID */}

            <div className="form-group">

              <label>
                Employee ID{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="employeeId"
                value={
                  formData.employeeId
                }
                onChange={
                  handleChange
                }
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
                First Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="firstName"
                value={
                  formData.firstName
                }
                onChange={
                  handleChange
                }
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
                Last Name{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="lastName"
                value={
                  formData.lastName
                }
                onChange={
                  handleChange
                }
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
                Email Address{" "}
                <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={
                  formData.email
                }
                onChange={
                  handleChange
                }
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
                Phone Number{" "}
                <span>*</span>
              </label>

              <input
                type="tel"
                name="phone"
                value={
                  formData.phone
                }
                onChange={
                  handleChange
                }
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

              <h2>
                Account Information
              </h2>

              <p>
                Update login credentials
                and account role.
              </p>

            </div>

          </div>

          <div className="form-grid">

            {/* USERNAME */}

            <div className="form-group">

              <label>
                Username{" "}
                <span>*</span>
              </label>

              <input
                type="text"
                name="username"
                value={
                  formData.username
                }
                onChange={
                  handleChange
                }
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
                New Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Leave blank to keep current password"
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
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              {errors.password && (
                <small className="error-message">
                  {errors.password}
                </small>
              )}

              <small className="field-hint">
                Leave blank if you do not
                want to change the password.
              </small>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="form-group">

              <label>
                Confirm New Password
              </label>

              <div className="password-wrapper">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={
                    formData.confirmPassword
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="Confirm new password"
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
                  {
                    errors.confirmPassword
                  }
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
                value={
                  formData.role
                }
                onChange={
                  handleChange
                }
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
                    System Access &
                    Permissions
                  </h2>

                  <p>
                    Select what this user
                    can view, create,
                    edit, or delete.
                  </p>

                </div>

              </div>

            </div>

            <div className="permission-note">
              Permissions can be changed
              from User Management.
            </div>

          </div>

          <div className="permission-table-wrapper">

            <table className="permission-table">

              <thead>

                <tr>

                  <th>
                    Module
                  </th>

                  <th>
                    View
                  </th>

                  <th>
                    Add
                  </th>

                  <th>
                    Edit
                  </th>

                  <th>
                    Delete
                  </th>

                  <th>
                    Full Access
                  </th>

                </tr>

              </thead>

              <tbody>

                {modules.map(
                  (module) => {

                    const modulePermissions =
                      permissions[
                        module.key
                      ];

                    const fullAccess =
                      modulePermissions.view &&
                      modulePermissions.add &&
                      modulePermissions.edit &&
                      modulePermissions.delete;

                    return (
                      <tr
                        key={
                          module.key
                        }
                      >

                        <td>
                          <strong>
                            {
                              module.label
                            }
                          </strong>
                        </td>

                        {[
                          "view",
                          "add",
                          "edit",
                          "delete",
                        ].map(
                          (
                            permission
                          ) => (

                            <td
                              key={
                                permission
                              }
                            >

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

                          )
                        )}

                        <td>

                          <label className="checkbox-container">

                            <input
                              type="checkbox"
                              checked={
                                fullAccess
                              }
                              onChange={(
                                e
                              ) =>
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
                  }
                )}

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
              Passwords are securely
              handled by the backend.
              Leave the password fields
              blank to keep the existing
              password.
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
              navigate(
                "/user-management"
              )
            }
            disabled={
              isSubmitting
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="create-button"
            disabled={
              isSubmitting
            }
          >
            {isSubmitting
              ? "Saving Changes..."
              : "✓ Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditUser;