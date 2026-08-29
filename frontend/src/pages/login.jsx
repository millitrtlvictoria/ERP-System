import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // UI STATE
  // =====================================================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // -------------------------------------------------
    // FRONTEND VALIDATION
    // -------------------------------------------------

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      // -------------------------------------------------
      // CALL FASTAPI LOGIN API
      // -------------------------------------------------

      const response = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify({
            username: username.trim(),
            password: password,
          }),
        }
      );

      // -------------------------------------------------
      // READ RESPONSE
      // -------------------------------------------------

      const data = await response.json();

      console.log("Login response:", data);

      // -------------------------------------------------
      // LOGIN FAILED
      // -------------------------------------------------

      if (!response.ok) {
        setError(
          data.detail || "Invalid username or password"
        );

        return;
      }

      // -------------------------------------------------
      // LOGIN SUCCESSFUL
      // -------------------------------------------------

      console.log("Login successful:", data);

      // -------------------------------------------------
      // SAVE USER INFORMATION
      // -------------------------------------------------

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // -------------------------------------------------
      // SAVE LOGIN STATUS
      // -------------------------------------------------

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // -------------------------------------------------
      // CLEAR FORM
      // -------------------------------------------------

      setUsername("");
      setPassword("");

      // -------------------------------------------------
      // GO TO DASHBOARD
      // -------------------------------------------------

      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleRegister = () => {
    navigate("/register");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="login-container">

      <div className="login-box">

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>ERP System</h1>

        <h2>Login</h2>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form onSubmit={handleLogin}>

          {/* =================================================
              USERNAME
          ================================================= */}

          <div className="input-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              disabled={loading}
              autoComplete="username"
              required
            />

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="input-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);

                if (error) {
                  setError("");
                }
              }}
              disabled={loading}
              autoComplete="current-password"
              required
            />

          </div>

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* =================================================
            REGISTRATION
        ================================================= */}

        <div className="register-section">

          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="register-button"
            onClick={handleRegister}
            disabled={loading}
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;