import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // MESSAGE STATE
  // =====================================================

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    // Clear previous error
    setError("");

    // Start loading
    setLoading(true);

    try {

      // =================================================
      // SEND LOGIN REQUEST TO FASTAPI
      // =================================================

      const response = await fetch(
        "http://127.0.0.1:8000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      // =================================================
      // GET RESPONSE
      // =================================================

      const data = await response.json();

      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!response.ok) {

        setError(
          data.detail || "Invalid email or password"
        );

        return;
      }

      // =================================================
      // LOGIN SUCCESSFUL
      // =================================================

      console.log("Login successful:", data);

      // =================================================
      // SAVE USER INFORMATION
      // =================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =================================================
      // SAVE LOGIN STATUS
      // =================================================

      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      // =================================================
      // GO TO DASHBOARD
      // =================================================

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );

    } finally {

      // Stop loading
      setLoading(false);
    }
  };


  // =====================================================
  // GO TO REGISTRATION PAGE
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
              EMAIL
          ================================================= */}

          <div className="input-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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

            {loading
              ? "Logging in..."
              : "Login"
            }

          </button>

        </form>


        {/* =================================================
            REGISTRATION SECTION
        ================================================= */}

        <div className="register-section">

          <p>
            Don't have an account?
          </p>

          <button
            type="button"
            className="register-button"
            onClick={handleRegister}
          >
            Register
          </button>

        </div>

      </div>

    </div>

  );
}

export default Login;