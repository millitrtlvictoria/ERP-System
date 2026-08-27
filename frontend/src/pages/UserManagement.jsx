
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UserManagement.css";

function UserManagement() {
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
      name: "Rahul Sharma",
      email: "rahul@erp.com",
      employeeId: "EMP002",
      role: "HR Manager",
      department: "Human Resources",
      status: "Active",
      lastLogin: "17 Aug 2026, 09:35 AM",
      initials: "RS",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@erp.com",
      employeeId: "EMP003",
      role: "Production Manager",
      department: "SPINNING",
      status: "Active",
      lastLogin: "16 Aug 2026, 06:25 PM",
      initials: "AK",
    },
    {
      id: 4,
      name: "Priya Singh",
      email: "priya@erp.com",
      employeeId: "EMP004",
      role: "HR Executive",
      department: "Human Resources",
      status: "Inactive",
      lastLogin: "12 Aug 2026, 04:15 PM",
      initials: "PS",
    },
    {
      id: 5,
      name: "Suresh Das",
      email: "suresh@erp.com",
      employeeId: "EMP005",
      role: "Supervisor",
      department: "WEAVING-Rapier",
      status: "Active",
      lastLogin: "17 Aug 2026, 08:50 AM",
      initials: "SD",
    },
    {
      id: 6,
      name: "Neha Roy",
      email: "neha@erp.com",
      employeeId: "EMP006",
      role: "Viewer",
      department: "Accounts",
      status: "Active",
      lastLogin: "16 Aug 2026, 02:10 PM",
      initials: "NR",
    },
  ]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.employeeId.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const administrators = users.filter(
    (user) => user.role === "Administrator"
  ).length;

  const handleDelete = (id) => {
    const user = users.find((item) => item.id === id);

    if (!user) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    setUsers((currentUsers) =>
      currentUsers.filter((item) => item.id !== id)
    );
  };

  const handleEdit = (user) => {
    window.alert(`Edit User: ${user.name}`);
  };

  const handleAddUser = () => {
    window.alert("Add User form will be added here.");
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  const getInitials = (user) => {
    if (user.initials) return user.initials;

    return user.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="user-management-page">

      {/* HEADER */}
      <header className="um-header">
        <div className="um-header-content">

          <div className="um-title-section">

            <Link to="/dashboard" className="um-back-link">
              ← Back to Dashboard
            </Link>

            <h1>User Management</h1>

            <p>
              Manage ERP users, roles, permissions and account status.
            </p>

          </div>

          <button
            type="button"
            className="um-add-button"
            onClick={handleAddUser}
          >
            <span>+</span>
            Add User
          </button>

        </div>
      </header>


      {/* MAIN */}
      <main className="um-main">

        {/* SUMMARY CARDS */}
        <section className="um-summary-grid">

          <div className="um-summary-card">

            <div className="um-summary-info">
              <span className="um-summary-label">
                Total Users
              </span>

              <strong className="um-summary-number">
                {users.length}
              </strong>

              <span className="um-summary-description">
                Registered ERP users
              </span>
            </div>

            <div className="um-summary-icon blue">
              👥
            </div>

          </div>


          <div className="um-summary-card">

            <div className="um-summary-info">
              <span className="um-summary-label">
                Active Users
              </span>

              <strong className="um-summary-number green">
                {activeUsers}
              </strong>

              <span className="um-summary-description">
                Currently active accounts
              </span>
            </div>

            <div className="um-summary-icon green">
              ✓
            </div>

          </div>


          <div className="um-summary-card">

            <div className="um-summary-info">
              <span className="um-summary-label">
                Inactive Users
              </span>

              <strong className="um-summary-number red">
                {inactiveUsers}
              </strong>

              <span className="um-summary-description">
                Disabled accounts
              </span>
            </div>

            <div className="um-summary-icon red">
              ⏸
            </div>

          </div>


          <div className="um-summary-card">

            <div className="um-summary-info">
              <span className="um-summary-label">
                Administrators
              </span>

              <strong className="um-summary-number purple">
                {administrators}
              </strong>

              <span className="um-summary-description">
                Users with admin access
              </span>
            </div>

            <div className="um-summary-icon purple">
              🔐
            </div>

          </div>

        </section>


        {/* USER TABLE CARD */}
        <section className="um-table-card">

          {/* TABLE HEADER */}
          <div className="um-table-header">

            <div className="um-table-title">
              <h2>System Users</h2>

              <p>
                View and manage all registered users.
              </p>
            </div>


            {/* SEARCH */}
            <div className="um-search-wrapper">

              <span className="um-search-icon">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search name, email or employee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>


          {/* FILTERS */}
          <div className="um-filter-row">

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option>All Roles</option>
              <option>Administrator</option>
              <option>HR Manager</option>
              <option>Production Manager</option>
              <option>HR Executive</option>
              <option>Supervisor</option>
              <option>Viewer</option>
            </select>


            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>


            <button
              type="button"
              className="um-clear-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>


          {/* TABLE */}
          <div className="um-table-wrapper">

            <table className="um-table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th className="um-action-heading">
                    Actions
                  </th>
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
                            {getInitials(user)}
                          </div>

                          <div className="um-user-details">

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


                      {/* DEPARTMENT */}
                      <td>
                        <span className="um-department">
                          {user.department}
                        </span>
                      </td>


                      {/* ROLE */}
                      <td>

                        <span
                          className={`um-role-badge role-${user.role
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          {user.role}
                        </span>

                      </td>


                      {/* STATUS */}
                      <td>

                        <span
                          className={`um-status-badge ${
                            user.status === "Active"
                              ? "active"
                              : "inactive"
                          }`}
                        >
                          <span className="um-status-dot"></span>
                          {user.status}
                        </span>

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
                            className="um-edit-button"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="um-delete-button"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="um-empty-cell"
                    >

                      <div className="um-empty-state">

                        <div className="um-empty-icon">
                          🔍
                        </div>

                        <h3>
                          No users found
                        </h3>

                        <p>
                          Try changing your search or filters.
                        </p>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* FOOTER */}
          <div className="um-table-footer">

            <p>
              Showing{" "}
              <strong>
                {filteredUsers.length}
              </strong>{" "}
              of{" "}
              <strong>
                {users.length}
              </strong>{" "}
              users
            </p>

            <div className="um-pagination">

              <button type="button">
                ‹
              </button>

              <button
                type="button"
                className="active"
              >
                1
              </button>

              <button type="button">
                2
              </button>

              <button type="button">
                3
              </button>

              <button type="button">
                ›
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UserManagement;
