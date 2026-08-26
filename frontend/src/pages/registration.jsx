import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/RegistraionFrom.css";

function RegistrationForm() {
  const navigate = useNavigate();

  // =====================================================
  // BACKEND API URL
  // =====================================================

  const API_URL = "http://127.0.0.1:8000";

  // =====================================================
  // FORM DATA
  // =====================================================

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // =====================================================
  // ERRORS
  // =====================================================

  const [errors, setErrors] = useState({});

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  const [isSubmitted, setIsSubmitted] = useState(false);

  // =====================================================
  // LOADING
  // =====================================================

  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    // Remove error for this field
    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }

    // Remove success message when user starts typing again
    setIsSubmitted(false);
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================

  const validateForm = () => {
    const newErrors = {};

    // -------------------------------------------------
    // FIRST NAME
    // -------------------------------------------------

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // -------------------------------------------------
    // LAST NAME
    // -------------------------------------------------

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email is invalid";
    }

    // -------------------------------------------------
    // USERNAME
    // -------------------------------------------------

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username =
        "Username must be at least 3 characters";
    }

    // -------------------------------------------------
    // PASSWORD
    // -------------------------------------------------

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    // -------------------------------------------------
    // CONFIRM PASSWORD
    // -------------------------------------------------

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setIsSubmitted(false);

    // Validate frontend
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    // Start loading
    setIsLoading(true);

    // Clear previous backend errors
    setErrors({});

    try {
      // =================================================
      // DATA SENT TO FASTAPI
      // =================================================

      const requestData = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };

      console.log("Sending registration data:", {
        ...requestData,
        password: "********",
        confirm_password: "********",
      });

      // =================================================
      // CALL BACKEND
      // =================================================

      const response = await fetch(
        `${API_URL}/api/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },

          body: JSON.stringify(requestData),
        }
      );

      // =================================================
      // READ RESPONSE
      // =================================================

      const data = await response.json();

      console.log("Backend response:", data);

      // =================================================
      // SUCCESS
      // =================================================

      if (response.ok) {
        setIsSubmitted(true);

        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });

        console.log(
          "Registration successful:",
          data
        );

        return;
      }

      // =================================================
      // BACKEND ERROR
      // =================================================

      if (response.status === 400) {
        const message =
          data.detail || "Registration failed";

        // Duplicate email
        if (
          message
            .toLowerCase()
            .includes("email")
        ) {
          setErrors({
            email: message,
          });

          return;
        }

        // Duplicate username
        if (
          message
            .toLowerCase()
            .includes("username")
        ) {
          setErrors({
            username: message,
          });

          return;
        }

        // Password mismatch
        if (
          message
            .toLowerCase()
            .includes("password")
        ) {
          setErrors({
            confirmPassword: message,
          });

          return;
        }

        setErrors({
          general: message,
        });

        return;
      }

      // =================================================
      // VALIDATION ERROR
      // =================================================

      if (response.status === 422) {
        setErrors({
          general:
            "Some registration information is invalid.",
        });

        return;
      }

      // =================================================
      // OTHER SERVER ERROR
      // =================================================

      setErrors({
        general:
          "Something went wrong. Please try again.",
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      // =================================================
      // CONNECTION ERROR
      // =================================================

      setErrors({
        general:
          "Unable to connect to the backend server. Please make sure FastAPI is running.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // GO BACK TO LOGIN
  // =====================================================

  const handleLogin = () => {
    navigate("/");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="registration-container">

      <div className="registration-box">

        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          ERP System
        </h1>

        <h2>
          Create an Account
        </h2>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {isSubmitted && (
          <div className="success-message">
            Registration Successful!
          </div>
        )}

        {/* =================================================
            GENERAL ERROR
        ================================================= */}

        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        {/* =================================================
            REGISTRATION FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="registration-form"
        >

          {/* =================================================
              FIRST NAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="firstName">
              First Name
            </label>

            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              className={
                errors.firstName
                  ? "error-input"
                  : ""
              }
            />

            {errors.firstName && (
              <span className="error-text">
                {errors.firstName}
              </span>
            )}

          </div>

          {/* =================================================
              LAST NAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="lastName">
              Last Name
            </label>

            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              className={
                errors.lastName
                  ? "error-input"
                  : ""
              }
            />

            {errors.lastName && (
              <span className="error-text">
                {errors.lastName}
              </span>
            )}

          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={
                errors.email
                  ? "error-input"
                  : ""
              }
            />

            {errors.email && (
              <span className="error-text">
                {errors.email}
              </span>
            )}

          </div>

          {/* =================================================
              USERNAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={
                errors.username
                  ? "error-input"
                  : ""
              }
            />

            {errors.username && (
              <span className="error-text">
                {errors.username}
              </span>
            )}

          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={
                errors.password
                  ? "error-input"
                  : ""
              }
            />

            {errors.password && (
              <span className="error-text">
                {errors.password}
              </span>
            )}

          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={
                errors.confirmPassword
                  ? "error-input"
                  : ""
              }
            />

            {errors.confirmPassword && (
              <span className="error-text">
                {errors.confirmPassword}
              </span>
            )}

          </div>

          {/* =================================================
              REGISTER BUTTON
          ================================================= */}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >

            {isLoading
              ? "Registering..."
              : "Register"}

          </button>

        </form>

        {/* =================================================
            BACK TO LOGIN
        ================================================= */}

        <div className="login-link">

          <p>
            Already have an account?
          </p>

          <button
            type="button"
            onClick={handleLogin}
          >
            Back to Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default RegistrationForm;