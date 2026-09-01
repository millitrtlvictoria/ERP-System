import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddEmployee.css";
import { createEmployee } from "../services/employeeAPI";


function AddEmployee() {

  const navigate = useNavigate();


  // =====================================================
  // EMPLOYEE FORM DATA
  // =====================================================

  const initialEmployee = {

    employeeId: "",

    firstName: "",
    lastName: "",

    gender: "",
    dob: "",

    phone: "",
    email: "",

    department: "",
    designation: "",

    joiningDate: "",

    employmentType: "",

    salary: "",

    status: "Active",

    address: "",

    emergencyName: "",
    emergencyPhone: "",
  };


  const [employee, setEmployee] = useState(
    initialEmployee
  );


  // =====================================================
  // PHOTO
  // =====================================================

  // Stores the selected photo preview
  const [photo, setPhoto] = useState(null);

  // Stores the actual selected image file
  const [photoFile, setPhotoFile] = useState(null);


  // =====================================================
  // HANDLE FORM CHANGES
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setEmployee(
      (previousEmployee) => ({

        ...previousEmployee,

        [name]: value

      })
    );
  };


  // =====================================================
  // HANDLE PHOTO
  // =====================================================

  const handlePhoto = (e) => {

    const file = e.target.files[0];


    if (!file) {

      return;
    }


    // -------------------------------------------------
    // SAVE ACTUAL FILE
    // -------------------------------------------------

    setPhotoFile(file);


    // -------------------------------------------------
    // CREATE PREVIEW
    // -------------------------------------------------

    const previewUrl = URL.createObjectURL(file);

    setPhoto(previewUrl);
  };


  // =====================================================
  // SUBMIT EMPLOYEE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    // =================================================
    // PREPARE EMPLOYEE DATA
    // =================================================

    const employeeData = {

      // -------------------------------------------------
      // EMPLOYEE ID
      // -------------------------------------------------

      emp_id: employee.employeeId,


      // -------------------------------------------------
      // PERSONAL INFORMATION
      // -------------------------------------------------

      first_name: employee.firstName,

      last_name: employee.lastName,

      gender: employee.gender,

      date_of_birth: employee.dob,


      // -------------------------------------------------
      // CONTACT INFORMATION
      // -------------------------------------------------

      phone: employee.phone,

      email: employee.email,


      // -------------------------------------------------
      // EMPLOYMENT INFORMATION
      // -------------------------------------------------

      department: employee.department,

      designation: employee.designation,

      joining_date: employee.joiningDate,

      employment_type: employee.employmentType,

      monthly_salary:
        employee.salary === ""
          ? null
          : Number(employee.salary),

      status: employee.status,


      // -------------------------------------------------
      // ADDRESS
      // -------------------------------------------------

      address:
        employee.address === ""
          ? null
          : employee.address,


      // -------------------------------------------------
      // EMERGENCY CONTACT
      //
      // These are now stored directly in employees table.
      // -------------------------------------------------

      emergency_name:
        employee.emergencyName === ""
          ? null
          : employee.emergencyName,

      emergency_phone:
        employee.emergencyPhone === ""
          ? null
          : employee.emergencyPhone,

      emergency_relationship: null,


      // -------------------------------------------------
      // EMPLOYEE PHOTO
      //
      // The actual image upload is not being sent yet.
      // We store the available file information.
      // -------------------------------------------------

      photo_file_name:
        photoFile
          ? photoFile.name
          : null,

      photo_file_path: null,

      photo_file_type:
        photoFile
          ? photoFile.type
          : null,

      photo_file_size:
        photoFile
          ? photoFile.size
          : null
    };


    // =================================================
    // DEBUG
    // =================================================

    console.log(
      "Sending employee data:",
      employeeData
    );


    // =================================================
    // SEND DATA TO BACKEND
    // =================================================

    try {

      const result = await createEmployee(
        employeeData
      );


      console.log(
        "Server response:",
        result
      );


      alert(
        "Employee added successfully!"
      );


      // -------------------------------------------------
      // GO BACK TO DASHBOARD
      // -------------------------------------------------

      navigate("/dashboard");

    } catch (error) {

      console.error(
        "Error creating employee:",
        error
      );


      alert(
        error.message ||
        "Failed to create employee"
      );
    }
  };


  // =====================================================
  // RESET FORM
  // =====================================================

  const handleReset = () => {

    setEmployee(
      initialEmployee
    );


    setPhoto(null);

    setPhotoFile(null);
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (

    <div className="add-employee-page">


      {/* =================================================
          TOP HEADER
      ================================================= */}

      <div className="employee-page-header">

        <div>

          <h1>
            Add Employee
          </h1>

          <p>
            Create a new employee profile in the ERP system
          </p>

        </div>


        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      <form onSubmit={handleSubmit}>


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="employee-card">

          <div className="card-heading">

            <div className="heading-icon">
              👤
            </div>


            <div>

              <h2>
                Personal Information
              </h2>

              <p>
                Basic information about the employee
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* =================================================
                EMPLOYEE ID
            ================================================= */}

            <div className="form-group">

              <label>
                Employee ID <span>*</span>
              </label>


              <input
                type="text"
                name="employeeId"
                placeholder="EMP-001"
                value={employee.employeeId}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                FIRST NAME
            ================================================= */}

            <div className="form-group">

              <label>
                First Name <span>*</span>
              </label>


              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={employee.firstName}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                LAST NAME
            ================================================= */}

            <div className="form-group">

              <label>
                Last Name <span>*</span>
              </label>


              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={employee.lastName}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                GENDER
            ================================================= */}

            <div className="form-group">

              <label>
                Gender <span>*</span>
              </label>


              <select
                name="gender"
                value={employee.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* =================================================
                DATE OF BIRTH
            ================================================= */}

            <div className="form-group">

              <label>
                Date of Birth <span>*</span>
              </label>


              <input
                type="date"
                name="dob"
                value={employee.dob}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                PHONE
            ================================================= */}

            <div className="form-group">

              <label>
                Phone Number <span>*</span>
              </label>


              <input
                type="tel"
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                value={employee.phone}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                EMAIL
            ================================================= */}

            <div className="form-group full-width">

              <label>
                Email Address <span>*</span>
              </label>


              <input
                type="email"
                name="email"
                placeholder="employee@company.com"
                value={employee.email}
                onChange={handleChange}
                required
              />

            </div>


          </div>

        </div>


        {/* =================================================
            EMPLOYMENT INFORMATION
        ================================================= */}

        <div className="employee-card">

          <div className="card-heading">

            <div className="heading-icon">
              💼
            </div>


            <div>

              <h2>
                Employment Information
              </h2>

              <p>
                Department and employment details
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* =================================================
                DEPARTMENT
            ================================================= */}

            <div className="form-group">

              <label>
                Department <span>*</span>
              </label>


              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select department
                </option>

                <option value="SPINNING">
                  SPINNING
                </option>

                <option value="WEAVING-Rapier">
                  WEAVING-Rapier
                </option>

                <option value="WEAVING-S4">
                  WEAVING-S4
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="IT">
                  IT
                </option>

                <option value="Accounts">
                  Accounts
                </option>

                <option value="Administration">
                  Administration
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* =================================================
                DESIGNATION
            ================================================= */}

            <div className="form-group">

              <label>
                Designation <span>*</span>
              </label>


              <input
                type="text"
                name="designation"
                placeholder="e.g. Production Manager"
                value={employee.designation}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                JOINING DATE
            ================================================= */}

            <div className="form-group">

              <label>
                Joining Date <span>*</span>
              </label>


              <input
                type="date"
                name="joiningDate"
                value={employee.joiningDate}
                onChange={handleChange}
                required
              />

            </div>


            {/* =================================================
                EMPLOYMENT TYPE
            ================================================= */}

            <div className="form-group">

              <label>
                Employment Type <span>*</span>
              </label>


              <select
                name="employmentType"
                value={employee.employmentType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select type
                </option>

                <option value="Permanent">
                  Permanent
                </option>

                <option value="Probation">
                  Probation
                </option>

                <option value="Contract">
                  Contract
                </option>

                <option value="Temporary">
                  Temporary
                </option>

                <option value="Intern">
                  Intern
                </option>

              </select>

            </div>


            {/* =================================================
                MONTHLY SALARY
            ================================================= */}

            <div className="form-group">

              <label>
                Monthly Salary
              </label>


              <input
                type="number"
                name="salary"
                placeholder="Enter salary"
                value={employee.salary}
                onChange={handleChange}
                min="0"
              />

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="form-group">

              <label>
                Employee Status
              </label>


              <select
                name="status"
                value={employee.status}
                onChange={handleChange}
              >

                <option value="">
                  Select status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="On Leave">
                  On Leave
                </option>

              </select>

            </div>


          </div>

        </div>


        {/* =================================================
            CONTACT INFORMATION
        ================================================= */}

        <div className="employee-card">

          <div className="card-heading">

            <div className="heading-icon">
              📍
            </div>


            <div>

              <h2>
                Contact Information
              </h2>

              <p>
                Address and emergency contact details
              </p>

            </div>

          </div>


          <div className="form-grid">


            {/* =================================================
                ADDRESS
            ================================================= */}

            <div className="form-group full-width">

              <label>
                Address
              </label>


              <textarea
                name="address"
                placeholder="Enter complete address"
                value={employee.address}
                onChange={handleChange}
                rows="4"
              />

            </div>


            {/* =================================================
                EMERGENCY NAME
            ================================================= */}

            <div className="form-group">

              <label>
                Emergency Contact Name
              </label>


              <input
                type="text"
                name="emergencyName"
                placeholder="Contact person name"
                value={employee.emergencyName}
                onChange={handleChange}
              />

            </div>


            {/* =================================================
                EMERGENCY PHONE
            ================================================= */}

            <div className="form-group">

              <label>
                Emergency Contact Phone
              </label>


              <input
                type="tel"
                name="emergencyPhone"
                placeholder="Contact phone number"
                value={employee.emergencyPhone}
                onChange={handleChange}
              />

            </div>


          </div>

        </div>


        {/* =================================================
            PROFILE PHOTO
        ================================================= */}

        <div className="employee-card">

          <div className="card-heading">

            <div className="heading-icon">
              📷
            </div>


            <div>

              <h2>
                Employee Photo
              </h2>

              <p>
                Upload employee profile picture
              </p>

            </div>

          </div>


          <div className="photo-section">


            {/* =================================================
                PHOTO PREVIEW
            ================================================= */}

            <div className="photo-preview">

              {photo ? (

                <img
                  src={photo}
                  alt="Employee Preview"
                />

              ) : (

                <span>
                  👤
                </span>

              )}

            </div>


            {/* =================================================
                PHOTO UPLOAD
            ================================================= */}

            <div className="photo-upload">

              <label htmlFor="employeePhoto">
                Choose Photo
              </label>


              <input
                id="employeePhoto"
                type="file"
                accept="image/*"
                onChange={handlePhoto}
              />


              <p>
                JPG, PNG or JPEG
                <br />
                Maximum recommended size: 2 MB
              </p>

            </div>


          </div>

        </div>


        {/* =================================================
            FORM ACTIONS
        ================================================= */}

        <div className="form-actions">


          {/* =================================================
              CANCEL
          ================================================= */}

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>


          {/* =================================================
              RESET
          ================================================= */}

          <button
            type="button"
            className="reset-btn"
            onClick={handleReset}
          >
            Reset
          </button>


          {/* =================================================
              SAVE
          ================================================= */}

          <button
            type="submit"
            className="save-employee-btn"
          >
            ✓ Save Employee
          </button>


        </div>


      </form>

    </div>
  );
}


export default AddEmployee;