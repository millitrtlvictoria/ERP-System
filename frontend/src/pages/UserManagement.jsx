import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserManagement.css";

const API_URL = "http://127.0.0.1:8000";

function UserManagement() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingUserId, setDeletingUserId] = useState(null);

  // =====================================================
  // FETCH REAL USERS
  // =====================================================

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_URL}/api/user-2`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        console.log(
          "User Management API response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.detail || "Unable to fetch users"
          );
        }

        // -------------------------------------------------
        // API RESPONSE
        // -------------------------------------------------

        const apiUsers = Array.isArray(data)
          ? data
          : data.users || [];

        // -------------------------------------------------
        // CONVERT BACKEND DATA TO TABLE FORMAT
        // -------------------------------------------------

        const formattedUsers = apiUsers.map((user) => {
          const firstName = user.first_name || "";
          const lastName = user.last_name || "";

          const fullName =
            `${firstName} ${lastName}`.trim() ||
            user.username ||
            "Unknown User";

          const initials =
            `${firstName.charAt(0)}${lastName.charAt(0)}`
              .toUpperCase() ||
            user.username
              ?.substring(0, 2)
              .toUpperCase() ||
            "US";

          return {
            id: user.id,

            name: fullName,

            email: user.email || "—",

            employeeId:
              user.employee_id || "—",

            role: user.role || "—",

            // user_2 does not currently provide department
            department:
              user.department || "—",

            // Keep current UI structure.
            // user_2 does not currently provide status.
            status:
              user.status || "Active",

            // user_2 does not currently provide lastLogin
            lastLogin:
              user.last_login || "—",

            initials: initials,
          };
        });

        setUsers(formattedUsers);

      } catch (error) {
        console.error(
          "Error fetching users:",
          error
        );

        setError(
          error.message ||
          "Unable to connect to the server."
        );

        setUsers([]);

      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchValue) ||

        user.email
          .toLowerCase()
          .includes(searchValue) ||

        user.employeeId
          .toLowerCase()
          .includes(searchValue) ||

        user.role
          .toLowerCase()
          .includes(searchValue) ||

        user.department
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "All Roles" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });

  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ]);

  // =====================================================
  // EDIT USER
  // =====================================================

  const handleEditUser = (id) => {
    if (!id) {
      console.error(
        "Cannot edit user: user ID is missing."
      );
      return;
    }

    console.log(
      "Opening EditUser for user ID:",
      id
    );

    navigate(`/users/edit/${id}`);
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (id) => {
    if (!id) {
      console.error(
        "Cannot delete user: user ID is missing."
      );

      window.alert(
        "Unable to delete user because the user ID is missing."
      );

      return;
    }

    // -------------------------------------------------
    // CONFIRM DELETE
    // -------------------------------------------------

    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    // -------------------------------------------------
    // START DELETE
    // -------------------------------------------------

    setDeletingUserId(id);
    setError("");

    try {
      console.log(
        "Deleting user ID:",
        id
      );

      // -------------------------------------------------
      // CALL FASTAPI DELETE ENDPOINT
      // -------------------------------------------------

      const response = await fetch(
        `${API_URL}/api/user-2/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      // -------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      console.log(
        "Delete user API response:",
        data
      );

      // -------------------------------------------------
      // HANDLE BACKEND ERROR
      // -------------------------------------------------

      if (!response.ok) {
        let errorMessage =
          "Failed to delete user.";

        if (data.detail) {
          if (
            typeof data.detail === "string"
          ) {
            errorMessage =
              data.detail;
          } else {
            errorMessage =
              JSON.stringify(
                data.detail
              );
          }
        }

        throw new Error(
          errorMessage
        );
      }

      // -------------------------------------------------
      // REMOVE USER FROM SCREEN
      // ONLY AFTER DATABASE DELETE SUCCEEDS
      // -------------------------------------------------

      setUsers(
        (currentUsers) =>
          currentUsers.filter(
            (user) =>
              user.id !== id
          )
      );

      console.log(
        "User deleted successfully."
      );

      window.alert(
        "User deleted successfully!"
      );

    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      const errorMessage =
        error.message ||
        "Unable to delete user.";

      setError(
        errorMessage
      );

      window.alert(
        `Unable to delete user.\n\n${errorMessage}`
      );

    } finally {
      setDeletingUserId(null);
    }
  };

  // =====================================================
  // TOGGLE STATUS
  // =====================================================

  const handleToggleStatus = (id) => {
    // -------------------------------------------------
    // TEMPORARY FRONTEND STATUS TOGGLE
    // -------------------------------------------------
    // Status is not currently stored in user_2.
    // Therefore this only changes the current screen.
    // -------------------------------------------------

    setUsers(
      (currentUsers) =>
        currentUsers.map(
          (user) =>
            user.id === id
              ? {
                  ...user,
                  status:
                    user.status === "Active"
                      ? "Inactive"
                      : "Active",
                }
              : user
        )
    );
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="user-management-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="um-header">

        <div>

          <div className="um-breadcrumb">

            <Link to="/dashboard">
              Dashboard
            </Link>

            <span>›</span>

            <span>
              User Management
            </span>

          </div>

          <h1>
            User Management
          </h1>

          <p>
            Manage system users, roles, access and account status.
          </p>

        </div>

        <button
          type="button"
          className="um-add-button"
          onClick={() =>
            navigate("/add-user")
          }
        >
          <span>+</span>
          Add User
        </button>

      </div>


      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="um-summary-grid">

        {/* TOTAL USERS */}

        <div className="um-summary-card">

          <div className="um-summary-icon">
            👥
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>


        {/* ACTIVE USERS */}

        <div className="um-summary-card">

          <div className="um-summary-icon">
            ✓
          </div>

          <div>

            <span>
              Active Users
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.status === "Active"
                ).length
              }
            </strong>

          </div>

        </div>


        {/* INACTIVE USERS */}

        <div className="um-summary-card">

          <div className="um-summary-icon">
            ○
          </div>

          <div>

            <span>
              Inactive Users
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.status === "Inactive"
                ).length
              }
            </strong>

          </div>

        </div>


        {/* ADMINISTRATORS */}

        <div className="um-summary-card">

          <div className="um-summary-icon">
            🔐
          </div>

          <div>

            <span>
              Administrators
            </span>

            <strong>
              {
                users.filter(
                  (user) =>
                    user.role ===
                      "Administrator" ||
                    user.role === "Admin"
                ).length
              }
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          FILTER SECTION
      ========================= */}

      <div className="um-filter-card">

        {/* SEARCH */}

        <div className="um-search-box">

          <span className="um-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by name, email or employee ID..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* ROLE FILTER */}

        <div className="um-filter-group">

          <label htmlFor="role-filter">
            Role
          </label>

          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(
                e.target.value
              )
            }
          >

            <option>
              All Roles
            </option>

            <option>
              Administrator
            </option>

            <option>
              Admin
            </option>

            <option>
              IT Manager
            </option>

            <option>
              HR Manager
            </option>

            <option>
              Employee
            </option>

          </select>

        </div>


        {/* STATUS FILTER */}

        <div className="um-filter-group">

          <label htmlFor="status-filter">
            Status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >

            <option>
              All Status
            </option>

            <option>
              Active
            </option>

            <option>
              Inactive
            </option>

          </select>

        </div>


        {/* RESET */}

        <button
          type="button"
          className="um-reset-button"
          onClick={
            handleResetFilters
          }
        >
          Reset
        </button>

      </div>


      {/* =========================
          USER TABLE
      ========================= */}

      <div className="um-table-card">

        <div className="um-table-header">

          <div>

            <h2>
              System Users
            </h2>

            <p>
              {loading
                ? "Loading users..."
                : `${filteredUsers.length} user${
                    filteredUsers.length !== 1
                      ? "s"
                      : ""
                  } found`}
            </p>

          </div>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================= */}

        {error && (

          <div
            style={{
              padding: "15px 20px",
              margin: "0 20px 15px",
              borderRadius: "8px",
              background: "#fff1f0",
              color: "#c62828",
              border: "1px solid #ffcdd2",
            }}
          >
            {error}
          </div>

        )}


        <div className="um-table-wrapper">

          <table className="um-table">

            <thead>

              <tr>

                <th>
                  User
                </th>

                <th>
                  Employee ID
                </th>

                <th>
                  Role
                </th>

                <th>
                  Department
                </th>

                <th>
                  Status
                </th>

                <th>
                  Last Login
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {/* =========================
                  LOADING
              ========================= */}

              {loading ? (

                <tr>

                  <td colSpan="7">

                    <div className="um-empty-state">

                      <h3>
                        Loading users...
                      </h3>

                      <p>
                        Fetching users from the database.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : filteredUsers.length > 0 ? (

                /* =========================
                   USERS
                ========================= */

                filteredUsers.map(
                  (user) => (

                    <tr
                      key={user.id}
                    >

                      {/* USER */}

                      <td>

                        <div className="um-user-cell">

                          <div className="um-avatar">
                            {user.initials}
                          </div>

                          <div>

                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              {user.email}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMPLOYEE ID */}

                      <td>

                        <span className="um-employee-id">
                          {user.employeeId}
                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span className="um-role">
                          {user.role}
                        </span>

                      </td>


                      {/* DEPARTMENT */}

                      <td>
                        {user.department}
                      </td>


                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          className={`um-status ${
                            user.status ===
                            "Active"
                              ? "active"
                              : "inactive"
                          }`}
                          onClick={() =>
                            handleToggleStatus(
                              user.id
                            )
                          }
                          title="Click to change status"
                        >

                          <span className="um-status-dot"></span>

                          {user.status}

                        </button>

                      </td>


                      {/* LAST LOGIN */}

                      <td>

                        <span className="um-last-login">
                          {user.lastLogin}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="um-actions">

                          {/* EDIT */}

                          <button
                            type="button"
                            className="um-action-button"
                            title="Edit user"
                            onClick={() =>
                              handleEditUser(
                                user.id
                              )
                            }
                            disabled={
                              deletingUserId !==
                              null
                            }
                          >
                            ✎
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="um-action-button delete"
                            title="Delete user"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
                            }
                            disabled={
                              deletingUserId ===
                              user.id
                            }
                          >

                            {deletingUserId ===
                            user.id
                              ? "..."
                              : "🗑"}

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                /* =========================
                   NO USERS
                ========================= */

                <tr>

                  <td colSpan="7">

                    <div className="um-empty-state">

                      <div className="um-empty-icon">
                        ⌕
                      </div>

                      <h3>
                        No users found
                      </h3>

                      <p>
                        {error
                          ? "Unable to load users from the database."
                          : "Try changing your search or filter criteria."}
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleResetFilters
                        }
                        className="um-reset-empty"
                      >
                        Clear Filters
                      </button>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UserManagement;
