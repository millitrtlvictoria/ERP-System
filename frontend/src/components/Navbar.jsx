import "../styles/navbar.css";

function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <header className="navbar">

      {/* MENU BUTTON */}
      <button
        type="button"
        className="navbar-menu-button"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* PAGE TITLE */}
      <div className="navbar-title">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin 👋</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* NOTIFICATION */}
        <button
          type="button"
          className="navbar-notification"
        >
          🔔
          <span className="navbar-notification-dot"></span>
        </button>

        {/* PROFILE */}
        <div className="navbar-profile">

          <div className="navbar-avatar">
            AD
          </div>

          <div className="navbar-user-info">
            <strong>Admin User</strong>
            <small>Administrator</small>
          </div>

          <span className="navbar-arrow">
            ⌄
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;