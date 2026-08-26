import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

  // ================================
  // FILTER USERS
  // ================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.employeeId.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All Roles" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  // ================================
  // DELETE USER
  // ================================

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== id)
    );
  };

  // ================================
  // RESET FILTERS
  // ================================

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("All Roles");
    setStatusFilter("All Status");
  };

  // ================================
  // ROLE COLOR
  // ================================

  const getRoleStyle = (role) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-700";

      case "HR Manager":
        return "bg-blue-100 text-blue-700";

      case "Production Manager":
        return "bg-orange-100 text-orange-700";

      case "HR Executive":
        return "bg-cyan-100 text-cyan-700";

      case "Supervisor":
        return "bg-indigo-100 text-indigo-700";

      case "Viewer":
        return "bg-slate-100 text-slate-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================================
  // STATUS COLOR
  // ================================

  const getStatusStyle = (status) => {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =========================================
          HEADER
      ========================================= */}

      <header className="bg-white border-b border-slate-200">

        <div className="px-8 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            {/* TITLE */}

            <div>

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-3"
              >
                ← Back to Dashboard
              </Link>

              <h1 className="text-2xl font-bold text-slate-800">
                User Management
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Manage ERP users, roles, permissions and account status.
              </p>

            </div>


            {/* ADD USER */}

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition"
              onClick={() => alert("Add User form will open here.")}
            >
              <span className="text-lg">+</span>
              Add User
            </button>

          </div>

        </div>

      </header>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="p-8">


        {/* =========================================
            SUMMARY CARDS
        ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">


          {/* TOTAL USERS */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Total Users
                </p>

                <h2 className="text-3xl font-bold text-slate-800 mt-2">
                  {users.length}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                👥
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Registered ERP users
            </p>

          </div>


          {/* ACTIVE */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Active Users
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {users.filter(
                    (user) => user.status === "Active"
                  ).length}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                ✓
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Currently active accounts
            </p>

          </div>


          {/* INACTIVE */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Inactive Users
                </p>

                <h2 className="text-3xl font-bold text-red-500 mt-2">
                  {users.filter(
                    (user) => user.status === "Inactive"
                  ).length}
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-xl">
                ⏸
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Disabled accounts
            </p>

          </div>


          {/* ADMIN */}

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  Administrators
                </p>

                <h2 className="text-3xl font-bold text-purple-600 mt-2">
                  {
                    users.filter(
                      (user) =>
                        user.role === "Administrator"
                    ).length
                  }
                </h2>

              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                🔐
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Users with admin access
            </p>

          </div>

        </div>


        {/* =========================================
            USER TABLE CARD
        ========================================= */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">


          {/* TABLE HEADER */}

          <div className="p-6 border-b border-slate-200">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

              <div>

                <h2 className="text-lg font-semibold text-slate-800">
                  System Users
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  View and manage all registered users.
                </p>

              </div>


              {/* SEARCH */}

              <div className="relative w-full xl:w-80">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search name, email or employee ID..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

              </div>

            </div>


            {/* FILTERS */}

            <div className="flex flex-col md:flex-row gap-3 mt-5">


              {/* ROLE */}

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>All Roles</option>
                <option>Administrator</option>
                <option>HR Manager</option>
                <option>Production Manager</option>
                <option>HR Executive</option>
                <option>Supervisor</option>
                <option>Viewer</option>

              </select>


              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>

              </select>


              {/* CLEAR */}

              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Clear Filters
              </button>

            </div>

          </div>


          {/* =========================================
              TABLE
          ========================================= */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead className="bg-slate-50">

                <tr>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Employee ID
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Department
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Last Login
                  </th>

                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="divide-y divide-slate-100">

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((user) => (

                    <tr
                      key={user.id}
                      className="hover:bg-slate-50 transition"
                    >

                      {/* USER */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {user.initials}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {user.name}
                            </p>

                            <p className="text-xs text-slate-500 mt-0.5">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* EMPLOYEE ID */}

                      <td className="px-6 py-4">

                        <span className="text-sm font-medium text-slate-700">
                          {user.employeeId}
                        </span>

                      </td>


                      {/* DEPARTMENT */}

                      <td className="px-6 py-4">

                        <span className="text-sm text-slate-600">
                          {user.department}
                        </span>

                      </td>


                      {/* ROLE */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            user.status
                          )}`}
                        >

                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "Active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></span>

                          {user.status}

                        </span>

                      </td>


                      {/* LAST LOGIN */}

                      <td className="px-6 py-4">

                        <span className="text-xs text-slate-500">
                          {user.lastLogin}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              alert(
                                `Edit ${user.name}`
                              )
                            }
                            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(user.id)
                            }
                            className="px-3 py-1.5 rounded-md border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition"
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
                      className="px-6 py-16 text-center"
                    >

                      <div className="text-4xl mb-3">
                        🔍
                      </div>

                      <h3 className="text-sm font-semibold text-slate-800">
                        No users found
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Try changing your search or filters.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>


          {/* =========================================
              FOOTER
          ========================================= */}

          <div className="px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {users.length}
              </span>{" "}
              users
            </p>


            <div className="flex items-center gap-1">

              <button
                type="button"
                className="w-8 h-8 border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50"
              >
                ‹
              </button>

              <button
                type="button"
                className="w-8 h-8 rounded-md bg-blue-600 text-white text-sm font-semibold"
              >
                1
              </button>

              <button
                type="button"
                className="w-8 h-8 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
              >
                2
              </button>

              <button
                type="button"
                className="w-8 h-8 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
              >
                3
              </button>

              <button
                type="button"
                className="w-8 h-8 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50"
              >
                ›
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default UserManagement;
