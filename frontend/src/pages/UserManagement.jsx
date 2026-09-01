
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserManagement.css";

function UserManagement() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      email: "admin@erp.com",
      employeeId: "EMP001",
      role: "Administrator",
      department: "Management",
      status: "Active",
      lastLogin: "17 Aug 2026, 10:42 AM",
      initials: "AU",
    },
    {
      id: 2,
      name: "Victoria Jute",
      email: "victoria@erp.com",
      employeeId: "EMP002",
      role: "IT Manager",
      department: "IT",
      status: "Active",
      lastLogin: "17 Aug 2026, 09:35 AM",
      initials: "VJ",
    },
    {
      id: 3,
      name: "Rahul Das",
      email: "rahul@erp.com",
      employeeId: "EMP003",
      role: "HR Manager",
      department: "Human Resources",
      status: "Active",
      lastLogin: "16 Aug 2026, 04:20 PM",
      initials: "RD",
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya@erp.com",
      employeeId: "EMP004",
      role: "Employee",
      department: "Finance",
      status: "Inactive",
      lastLogin: "10 Aug 2026, 11:15 AM",
      initials: "PS",
    },
    {
      id: 5,
      name: "Amit Roy",
      email: "amit@erp.com",
      employeeId: "EMP005",
      role: "Employee",
      department: "Production",
      status: "Active",
      lastLogin: "17 Aug 2026, 08:50 AM",
      initials: "AR",
    },
  ]);

  // =========================
  // FILTER USERS
  // =========================

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.employeeId.toLowerCase().includes(searchValue) ||
        user.role.toLowerCase().includes(searchValue) ||
        user.department.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // =========================
  // USER ACTIONS
  // =========================

  const handleDeleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );
  };

  const handleToggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="user-management-page">
      {/* =========================
          HEADER
      ========================= */}

      <div className="um-header">
        <div>
          <div className="um-breadcrumb">
            <Link to="/dashboard">Dashboard</Link>
            <span>›</span>
            <span>User Management</span>
          </div>

          <h1>User Management</h1>

          <p>
            Manage system users, roles, access and account status.
          </p>
        </div>

        <button
          type="button"
          className="um-add-button"
          onClick={() => navigate("/add-user")}
        >
          <span>+</span>
          Add User
        </button>
      </div>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="um-summary-grid">
        <div className="um-summary-card">
          <div className="um-summary-icon">👥</div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="um-summary-card">
          <div className="um-summary-icon">✓</div>

          <div>
            <span>Active Users</span>
            <strong>
              {users.filter((user) => user.status === "Active").length}
            </strong>
          </div>
        </div>

        <div className="um-summary-card">
          <div className="um-summary-icon">○</div>

          <div>
            <span>Inactive Users</span>
            <strong>
              {users.filter((user) => user.status === "Inactive").length}
            </strong>
          </div>
        </div>

        <div className="um-summary-card">
          <div className="um-summary-icon">🔐</div>

          <div>
            <span>Administrators</span>
            <strong>
              {users.filter((user) => user.role === "Administrator").length}
            </strong>
          </div>
        </div>
      </div>

      {/* =========================
          FILTER SECTION
      ========================= */}

      <div className="um-filter-card">
        <div className="um-search-box">
          <span className="um-search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search by name, email or employee ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="um-filter-group">
          <label htmlFor="role-filter">Role</label>

          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All Roles</option>
            <option>Administrator</option>
            <option>IT Manager</option>
            <option>HR Manager</option>
            <option>Employee</option>
          </select>
        </div>

        <div className="um-filter-group">
          <label htmlFor="status-filter">Status</label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <button
          type="button"
          className="um-reset-button"
          onClick={handleResetFilters}
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
            <h2>System Users</h2>

            <p>
              {filteredUsers.length} user
              {filteredUsers.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Employee ID</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    {/* USER */}
                    <td>
                      <div className="um-user-cell">
                        <div className="um-avatar">
                          {user.initials}
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>{user.email}</span>
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
                    <td>{user.department}</td>

                    {/* STATUS */}
                    <td>
                      <button
                        type="button"
                        className={`um-status ${
                          user.status === "Active"
                            ? "active"
                            : "inactive"
                        }`}
                        onClick={() =>
                          handleToggleStatus(user.id)
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
                        <button
                          type="button"
                          className="um-action-button"
                          title="Edit user"
                          onClick={() =>
                            navigate(`/users/edit/${user.id}`)
                          }
                        >
                          ✎
                        </button>

                        <button
                          type="button"
                          className="um-action-button delete"
                          title="Delete user"
                          onClick={() =>
                            handleDeleteUser(user.id)
                          }
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    <div className="um-empty-state">
                      <div className="um-empty-icon">⌕</div>

                      <h3>No users found</h3>

                      <p>
                        Try changing your search or filter
                        criteria.
                      </p>

                      <button
                        type="button"
                        onClick={handleResetFilters}
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
