import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/sidebar.css";

function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  // =====================================================
  // LOGGED-IN USER
  // =====================================================

  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Unable to read logged-in user:", error);
    }
  }, []);

  // =====================================================
  // USER INFORMATION
  // =====================================================

  const firstName = user?.first_name || "Admin";
  const lastName = user?.last_name || "User";

  const fullName = `${firstName} ${lastName}`.trim();

  const role = user?.role || "Administrator";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  // =====================================================
  // MENU ITEM
  // =====================================================

  const MenuItem = ({ to, icon, children }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `menu-item ${isActive ? "active" : ""}`
        }
      >
        <span className="menu-icon">
          {icon}
        </span>

        {isOpen && (
          <span className="menu-text">
            {children}
          </span>
        )}
      </NavLink>
    );
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

  return (
    <aside
      className={`sidebar ${
        isOpen ? "open" : "closed"
      }`}
    >

      {/* =================================================
          LOGO
      ================================================= */}

      <div className="logo">

        <div className="logo-icon">
          ERP
        </div>

        {isOpen && (
          <div className="logo-content">

            <h2>ERP System</h2>

            <span>
              ENTERPRISE MANAGEMENT
            </span>

          </div>
        )}

      </div>


      {/* =================================================
          MENU
      ================================================= */}

      <nav className="sidebar-menu">

        {isOpen && (
          <p className="menu-title">
            MAIN MENU
          </p>
        )}


        <MenuItem
          to="/dashboard"
          icon="⌂"
        >
          Dashboard
        </MenuItem>


        <MenuItem
          to="/employees"
          icon="♙"
        >
          Employees
        </MenuItem>


        <MenuItem
          to="/reports"
          icon="▤"
        >
          Reports
        </MenuItem>


        <MenuItem
          to="/user-management"
          icon="♙"
        >
          User Management
        </MenuItem>


        <MenuItem
          to="/documents"
          icon="▱"
        >
          Documents
        </MenuItem>


        <MenuItem
          to="/payroll"
          icon="₹"
        >
          Payroll
        </MenuItem>


        <MenuItem
          to="/settings"
          icon="⚙"
        >
          Settings
        </MenuItem>

      </nav>


      {/* =================================================
          BOTTOM USER SECTION
      ================================================= */}

      <div className="sidebar-bottom">

        {isOpen && (
          <div className="user-mini">

            <div className="avatar">
              {initials}
            </div>

            <div className="user-mini-info">

              <strong>
                {fullName}
              </strong>

              <small>
                {role}
              </small>

            </div>

          </div>
        )}


        {/* =================================================
            LOGOUT
        ================================================= */}

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}
        >

          <span className="logout-icon">
            ⇥
          </span>

          {isOpen && (
            <span>
              Logout
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;