import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>

      {/* LOGO */}
      <div className="logo">
        <div className="logo-icon">
          ERP
        </div>

        {isOpen && (
          <div>
            <h2>ERP System</h2>
            <span>ENTERPRISE MANAGEMENT</span>
          </div>
        )}
      </div>


      {/* MENU */}
      <nav className="sidebar-menu">

        {isOpen && (
          <p className="menu-title">
            MAIN MENU
          </p>
        )}

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>📊</span>

          {isOpen && <span>Dashboard</span>}
        </NavLink>


        <NavLink
          to="/employees"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>👤</span>

          {isOpen && <span>Employees</span>}
        </NavLink>


        <NavLink
          to="/reports"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>📄</span>

          {isOpen && <span>Reports</span>}
        </NavLink>


        <NavLink
          to="/user-management"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>👤</span>

          {isOpen && <span>User Management</span>}
        </NavLink>


        <NavLink
          to="/documents"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span> 📁</span>

          {isOpen && <span>Documents</span>}
        </NavLink>
        
      
        <NavLink
          to="/payroll"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>💰</span>

          {isOpen && <span>PayRoll</span>}
        </NavLink>


        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }>
          <span>⚙️</span>

          {isOpen && <span>Settings</span>}
        </NavLink>

      </nav>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        {isOpen && (
          <div className="user-mini">

            <div className="avatar">
              AD
            </div>

            <div>
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>

          </div>
        )}

        <button
          type="button"
          className="logout-btn"
          onClick={handleLogout}>
          🚪

          {isOpen && <span>Logout</span>}
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;