import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar({ sidebarOpen, setSidebarOpen }) {

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

  // =====================================================
  // PAGE
  // =====================================================

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

        <p>
          Welcome back, {firstName} 👋
        </p>

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

          {/* AVATAR */}
          <div className="navbar-avatar">
            {firstName.charAt(0).toUpperCase()}
            {lastName.charAt(0).toUpperCase()}
          </div>


          {/* USER INFORMATION */}
          <div className="navbar-user-info">

            <strong>
              {fullName}
            </strong>

            <small>
              {role}
            </small>

          </div>


          {/* ARROW */}
          <span className="navbar-arrow">
            ⌄
          </span>

        </div>

      </div>

    </header>
  );
}

export default Navbar;
