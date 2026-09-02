import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Documents.css";

function Documents() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [type, setType] = useState("All Types");
  const [status, setStatus] = useState("All Status");
  const [department, setDepartment] = useState("All Departments");
  const [showUpload, setShowUpload] = useState(false);
  const [showDetails, setShowDetails] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentId: "DOC-1001",
      employeeId: "EMP-001",
      employeeName: "Rahul Kumar",
      documentName: "Appointment Letter",
      category: "Employee Documents",
      type: "Appointment Letter",
      department: "HR",
      uploadedDate: "2026-08-10",
      expiryDate: "N/A",
      size: "245 KB",
      uploadedBy: "Admin",
      status: "Active",
    },
    {
      id: 2,
      documentId: "DOC-1002",
      employeeId: "EMP-002",
      employeeName: "Amit Sharma",
      documentName: "Aadhaar Card",
      category: "Employee Documents",
      type: "ID Proof",
      department: "SPINNING",
      uploadedDate: "2026-08-08",
      expiryDate: "N/A",
      size: "520 KB",
      uploadedBy: "HR Manager",
      status: "Verified",
    },
    {
      id: 3,
      documentId: "DOC-1003",
      employeeId: "EMP-003",
      employeeName: "Priya Das",
      documentName: "Salary Slip - July 2026",
      category: "Payroll Documents",
      type: "Salary Slip",
      department: "WEAVING-Rapier",
      uploadedDate: "2026-08-05",
      expiryDate: "N/A",
      size: "180 KB",
      uploadedBy: "Payroll Admin",
      status: "Active",
    },
    {
      id: 4,
      documentId: "DOC-1004",
      employeeId: "EMP-004",
      employeeName: "Sanjay Roy",
      documentName: "Experience Certificate",
      category: "Employee Documents",
      type: "Experience Certificate",
      department: "WEAVING-S4",
      uploadedDate: "2026-07-28",
      expiryDate: "N/A",
      size: "310 KB",
      uploadedBy: "HR Manager",
      status: "Verified",
    },
    {
      id: 5,
      documentId: "DOC-1005",
      employeeId: "EMP-005",
      employeeName: "Neha Singh",
      documentName: "Medical Certificate",
      category: "Employee Documents",
      type: "Medical Certificate",
      department: "SPINNING",
      uploadedDate: "2026-07-22",
      expiryDate: "2026-09-15",
      size: "420 KB",
      uploadedBy: "Admin",
      status: "Expiring Soon",
    },
    {
      id: 6,
      documentId: "DOC-1006",
      employeeId: "EMP-006",
      employeeName: "Rakesh Das",
      documentName: "Production Report - July",
      category: "Production Documents",
      type: "Production Report",
      department: "SPINNING",
      uploadedDate: "2026-07-31",
      expiryDate: "N/A",
      size: "1.2 MB",
      uploadedBy: "Production Manager",
      status: "Active",
    },
  ]);

  const [newDocument, setNewDocument] = useState({
    employeeId: "",
    employeeName: "",
    documentName: "",
    category: "Employee Documents",
    type: "ID Proof",
    department: "HR",
    expiryDate: "",
    file: null,
  });

  /* =====================================================
     FILTER DOCUMENTS
  ===================================================== */

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        doc.documentId.toLowerCase().includes(searchValue) ||
        doc.employeeId.toLowerCase().includes(searchValue) ||
        doc.employeeName.toLowerCase().includes(searchValue) ||
        doc.documentName.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All Categories" || doc.category === category;

      const matchesType =
        type === "All Types" || doc.type === type;

      const matchesStatus =
        status === "All Status" || doc.status === status;

      const matchesDepartment =
        department === "All Departments" ||
        doc.department === department;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [documents, search, category, type, status, department]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const activeDocuments = documents.filter(
    (doc) => doc.status === "Active"
  ).length;

  const verifiedDocuments = documents.filter(
    (doc) => doc.status === "Verified"
  ).length;

  const expiringDocuments = documents.filter(
    (doc) => doc.status === "Expiring Soon"
  ).length;

  const employeeDocuments = documents.filter(
    (doc) => doc.category === "Employee Documents"
  ).length;

  const payrollDocuments = documents.filter(
    (doc) => doc.category === "Payroll Documents"
  ).length;

  const productionDocuments = documents.filter(
    (doc) => doc.category === "Production Documents"
  ).length;

  /* =====================================================
     FORM HANDLERS
  ===================================================== */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewDocument((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewDocument((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  /* =====================================================
     UPLOAD DOCUMENT
  ===================================================== */

  const handleUpload = (e) => {
    e.preventDefault();

    if (
      !newDocument.employeeId ||
      !newDocument.employeeName ||
      !newDocument.documentName
    ) {
      alert(
        "Please fill Employee ID, Employee Name and Document Name."
      );
      return;
    }

    const newDoc = {
      id: Date.now(),
      documentId: `DOC-${1000 + documents.length + 1}`,
      employeeId: newDocument.employeeId,
      employeeName: newDocument.employeeName,
      documentName: newDocument.documentName,
      category: newDocument.category,
      type: newDocument.type,
      department: newDocument.department,
      uploadedDate: new Date().toISOString().split("T")[0],
      expiryDate: newDocument.expiryDate || "N/A",
      size: newDocument.file
        ? `${Math.max(
            1,
            Math.round(newDocument.file.size / 1024)
          )} KB`
        : "N/A",
      uploadedBy: "Admin",
      status: "Active",
    };

    setDocuments((prev) => [newDoc, ...prev]);

    setNewDocument({
      employeeId: "",
      employeeName: "",
      documentName: "",
      category: "Employee Documents",
      type: "ID Proof",
      department: "HR",
      expiryDate: "",
      file: null,    
    });

    setShowUpload(false);
  };

  /* =====================================================
     DELETE DOCUMENT
  ===================================================== */

  const deleteDocument = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id)
    );
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setType("All Types");
    setStatus("All Status");
    setDepartment("All Departments");
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const statusClass = (value) => {
    if (value === "Verified") {
      return "status-verified";
    }

    if (value === "Expiring Soon") {
      return "status-expiring";
    }

    if (value === "Expired") {
      return "status-expired";
    }

    return "status-active";
  };

  /* =====================================================
     EMPLOYEE INITIALS
  ===================================================== */

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="documents-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="documents-header">

        <div className="documents-header-inner">

          <button
            onClick={() => navigate("/dashboard")}
            className="back-dashboard-btn"
          >
            ← Back to Dashboard
          </button>

          <div className="documents-header-row">

            <div className="documents-title-section">

              <h1>Document Management</h1>

              <p>
                Manage, organize and track all employee and company
                documents from one place.
              </p>

            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="primary-upload-btn"
            >
              <span className="button-plus">+</span>
              Upload Document
            </button>

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="documents-main">

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="statistics-grid">

          {/* TOTAL DOCUMENTS */}

          <div className="stat-card">

            <div className="stat-content">

              <div>
                <p className="stat-label">
                  Total Documents
                </p>

                <h2 className="stat-number stat-total">
                  {documents.length}
                </h2>

                <p className="stat-description">
                  All uploaded documents
                </p>
              </div>

              <div className="stat-icon stat-icon-blue">
                📁
              </div>

            </div>

          </div>

          {/* ACTIVE DOCUMENTS */}

          <div className="stat-card">

            <div className="stat-content">

              <div>
                <p className="stat-label">
                  Active Documents
                </p>

                <h2 className="stat-number stat-active">
                  {activeDocuments}
                </h2>

                <p className="stat-description">
                  Currently active
                </p>
              </div>

              <div className="stat-icon stat-icon-green">
                ✓
              </div>

            </div>

          </div>

          {/* VERIFIED */}

          <div className="stat-card">

            <div className="stat-content">

              <div>
                <p className="stat-label">
                  Verified
                </p>

                <h2 className="stat-number stat-verified-number">
                  {verifiedDocuments}
                </h2>

                <p className="stat-description">
                  Verified documents
                </p>
              </div>

              <div className="stat-icon stat-icon-purple">
                ✓
              </div>

            </div>

          </div>

          {/* EXPIRING */}

          <div className="stat-card">

            <div className="stat-content">

              <div>
                <p className="stat-label">
                  Expiring Soon
                </p>

                <h2 className="stat-number stat-expiring-number">
                  {expiringDocuments}
                </h2>

                <p className="stat-description">
                  Require attention
                </p>
              </div>

              <div className="stat-icon stat-icon-orange">
                ⚠
              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            CATEGORY SUMMARY
        ================================================= */}

        <section className="category-summary-grid">

          {/* EMPLOYEE */}

          <div className="category-card">

            <div className="category-card-header">

              <div>
                <p className="category-title">
                  Employee Documents
                </p>

                <h3>
                  {employeeDocuments}
                </h3>
              </div>

              <div className="category-percentage">
                {documents.length
                  ? Math.round(
                      (employeeDocuments / documents.length) * 100
                    )
                  : 0}
                %
              </div>

            </div>

            <div className="progress-track">
              <div
                className="progress-bar progress-blue"
                style={{
                  width: `${
                    documents.length
                      ? (employeeDocuments / documents.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

          {/* PAYROLL */}

          <div className="category-card">

            <div className="category-card-header">

              <div>
                <p className="category-title">
                  Payroll Documents
                </p>

                <h3>
                  {payrollDocuments}
                </h3>
              </div>

              <div className="category-percentage">
                {documents.length
                  ? Math.round(
                      (payrollDocuments / documents.length) * 100
                    )
                  : 0}
                %
              </div>

            </div>

            <div className="progress-track">
              <div
                className="progress-bar progress-purple"
                style={{
                  width: `${
                    documents.length
                      ? (payrollDocuments / documents.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

          {/* PRODUCTION */}

          <div className="category-card">

            <div className="category-card-header">

              <div>
                <p className="category-title">
                  Production Documents
                </p>

                <h3>
                  {productionDocuments}
                </h3>
              </div>

              <div className="category-percentage">
                {documents.length
                  ? Math.round(
                      (productionDocuments / documents.length) * 100
                    )
                  : 0}
                %
              </div>

            </div>

            <div className="progress-track">
              <div
                className="progress-bar progress-orange"
                style={{
                  width: `${
                    documents.length
                      ? (productionDocuments / documents.length) * 100
                      : 0
                  }%`,
                }}
              />
            </div>

          </div>

        </section>

        {/* =================================================
            FILTER SECTION
        ================================================= */}

        <section className="filter-card">

          <div className="filter-header">

            <div>
              <h2>
                Document Records
              </h2>

              <p>
                Search and filter your documents.
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="clear-filter-btn"
            >
              Clear Filters
            </button>

          </div>

          <div className="filter-grid">

            {/* SEARCH */}

            <div className="filter-field search-field">

              <label>
                Search
              </label>

              <div className="search-input-wrapper">

                <span className="search-icon">
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Employee ID, name or document..."
                />

              </div>

            </div>

            {/* CATEGORY */}

            <div className="filter-field">

              <label>
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>All Categories</option>
                <option>Employee Documents</option>
                <option>HR Documents</option>
                <option>Payroll Documents</option>
                <option>Production Documents</option>
                <option>Attendance Documents</option>
                <option>Company Documents</option>
              </select>

            </div>

            {/* STATUS */}

            <div className="filter-field">

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Verified</option>
                <option>Expiring Soon</option>
                <option>Expired</option>
              </select>

            </div>

            {/* DEPARTMENT */}

            <div className="filter-field">

              <label>
                Department
              </label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >
                <option>All Departments</option>
                <option>HR</option>
                <option>SPINNING</option>
                <option>WEAVING-Rapier</option>
                <option>WEAVING-S4</option>
              </select>

            </div>

            {/* DOCUMENT TYPE */}

            <div className="filter-field">

              <label>
                Document Type
              </label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option>All Types</option>
                <option>ID Proof</option>
                <option>Appointment Letter</option>
                <option>Experience Certificate</option>
                <option>Salary Slip</option>
                <option>Medical Certificate</option>
                <option>Production Report</option>
              </select>

            </div>

          </div>

        </section>

        {/* =================================================
            DOCUMENT TABLE
        ================================================= */}

        <section className="documents-table-card">

          <div className="table-header">

            <div>

              <h2>
                All Documents
              </h2>

              <p>
                Showing{" "}
                <strong>
                  {filteredDocuments.length}
                </strong>{" "}
                of{" "}
                <strong>
                  {documents.length}
                </strong>{" "}
                documents
              </p>

            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="add-document-btn"
            >
              <span>+</span>
              Add Document
            </button>

          </div>

          <div className="table-wrapper">

            <table className="documents-table">

              <thead>

                <tr>

                  <th>Document</th>
                  <th>Employee ID</th>
                  <th>Employee Name</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Uploaded</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th className="actions-header">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDocuments.length > 0 ? (

                  filteredDocuments.map((doc) => (

                    <tr key={doc.id}>

                      {/* DOCUMENT */}

                      <td>

                        <div className="document-info">

                          <div className="document-icon">
                            📄
                          </div>

                          <div className="document-text">

                            <p className="document-name">
                              {doc.documentName}
                            </p>

                            <span>
                              {doc.documentId}
                              {" • "}
                              {doc.size}
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* EMPLOYEE ID */}

                      <td>

                        <span className="employee-id">
                          {doc.employeeId}
                        </span>

                      </td>

                      {/* EMPLOYEE NAME */}

                      <td>

                        <div className="employee-info">

                          <div className="employee-avatar">
                            {getInitials(
                              doc.employeeName
                            )}
                          </div>

                          <span>
                            {doc.employeeName}
                          </span>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td>

                        <span className="category-badge">
                          {doc.category}
                        </span>

                      </td>

                      {/* DEPARTMENT */}

                      <td>

                        <span className="department-text">
                          {doc.department}
                        </span>

                      </td>

                      {/* UPLOADED */}

                      <td>

                        <span className="date-text">
                          {doc.uploadedDate}
                        </span>

                      </td>

                      {/* EXPIRY */}

                      <td>

                        <span
                          className={
                            doc.expiryDate !== "N/A"
                              ? "expiry-warning"
                              : "date-text"
                          }
                        >
                          {doc.expiryDate}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`status-badge ${statusClass(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="table-actions">

                          <button
                            onClick={() =>
                              setShowDetails(doc)
                            }
                            className="view-btn"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              alert(
                                `Download: ${doc.documentName}`
                              )
                            }
                            className="download-btn"
                          >
                            Download
                          </button>

                          <button
                            onClick={() =>
                              deleteDocument(doc.id)
                            }
                            className="delete-btn"
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
                      colSpan="9"
                      className="empty-table-cell"
                    >

                      <div className="empty-state">

                        <div className="empty-icon">
                          📂
                        </div>

                        <h3>
                          No documents found
                        </h3>

                        <p>
                          Try changing your search or filters.
                        </p>

                        <button
                          onClick={clearFilters}
                          className="empty-clear-btn"
                        >
                          Clear Filters
                        </button>

                      </div>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>

      {/* =================================================
          UPLOAD MODAL
      ================================================= */}

      {showUpload && (

        <div className="modal-overlay">

          <div className="upload-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Upload Document
                </h2>

                <p>
                  Add a new document to the ERP system.
                </p>

              </div>

              <button
                onClick={() => setShowUpload(false)}
                className="modal-close-btn"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleUpload}
              className="upload-form"
            >

              <div className="form-grid">

                {/* EMPLOYEE ID */}

                <div className="form-field">

                  <label>
                    Employee ID <span>*</span>
                  </label>

                  <input
                    name="employeeId"
                    value={newDocument.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP-001"
                  />

                </div>

                {/* EMPLOYEE NAME */}

                <div className="form-field">

                  <label>
                    Employee Name <span>*</span>
                  </label>

                  <input
                    name="employeeName"
                    value={newDocument.employeeName}
                    onChange={handleInputChange}
                    placeholder="Employee name"
                  />

                </div>

                {/* DOCUMENT NAME */}

                <div className="form-field form-full">

                  <label>
                    Document Name <span>*</span>
                  </label>

                  <input
                    name="documentName"
                    value={newDocument.documentName}
                    onChange={handleInputChange}
                    placeholder="Example: Aadhaar Card"
                  />

                </div>

                {/* CATEGORY */}

                <div className="form-field">

                  <label>
                    Category
                  </label>

                  <select
                    name="category"
                    value={newDocument.category}
                    onChange={handleInputChange}
                  >
                    <option>Employee Documents</option>
                    <option>HR Documents</option>
                    <option>Payroll Documents</option>
                    <option>Production Documents</option>
                    <option>Attendance Documents</option>
                    <option>Company Documents</option>
                  </select>

                </div>

                {/* DOCUMENT TYPE */}

                <div className="form-field">

                  <label>
                    Document Type
                  </label>

                  <select
                    name="type"
                    value={newDocument.type}
                    onChange={handleInputChange}
                  >
                    <option>ID Proof</option>
                    <option>Appointment Letter</option>
                    <option>Experience Certificate</option>
                    <option>Salary Slip</option>
                    <option>Medical Certificate</option>
                    <option>Production Report</option>
                  </select>

                </div>

                {/* DEPARTMENT */}

                <div className="form-field">

                  <label>
                    Department
                  </label>

                  <select
                    name="department"
                    value={newDocument.department}
                    onChange={handleInputChange}
                  >
                    <option>HR</option>
                    <option>SPINNING</option>
                    <option>WEAVING-Rapier</option>
                    <option>WEAVING-S4</option>
                  </select>

                </div>

                {/* EXPIRY */}

                <div className="form-field">

                  <label>
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={newDocument.expiryDate}
                    onChange={handleInputChange}
                  />

                </div>

                {/* FILE */}

                <div className="form-field form-full">

                  <label>
                    Select File
                  </label>

                  <div className="file-upload-area">

                    <input
                      type="file"
                      onChange={handleFileChange}
                      id="document-file"
                    />

                    <label
                      htmlFor="document-file"
                      className="file-upload-label"
                    >

                      <span className="file-upload-icon">
                        📎
                      </span>

                      <span className="file-upload-title">
                        {newDocument.file
                          ? newDocument.file.name
                          : "Choose a document"}
                      </span>

                      <span className="file-upload-subtitle">
                        Click to browse from your computer
                      </span>

                    </label>

                  </div>

                  <p className="file-help-text">
                    Supported files: PDF, Excel, Word, JPG or PNG.
                  </p>

                </div>

              </div>

              {/* MODAL FOOTER */}

              <div className="modal-footer">

                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-upload-btn"
                >
                  Upload Document
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {showDetails && (

        <div className="modal-overlay">

          <div className="details-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Document Details
                </h2>

                <p>
                  {showDetails.documentId}
                </p>

              </div>

              <button
                onClick={() => setShowDetails(null)}
                className="modal-close-btn"
              >
                ×
              </button>

            </div>

            <div className="details-content">

              {/* EMPLOYEE ID */}

              <div className="detail-item">

                <span>
                  Employee ID
                </span>

                <strong>
                  {showDetails.employeeId}
                </strong>

              </div>

              {/* EMPLOYEE NAME */}

              <div className="detail-item">

                <span>
                  Employee Name
                </span>

                <strong>
                  {showDetails.employeeName}
                </strong>

              </div>

              {/* DOCUMENT NAME */}

              <div className="detail-item">

                <span>
                  Document Name
                </span>

                <strong>
                  {showDetails.documentName}
                </strong>

              </div>

              {/* TYPE */}

              <div className="detail-item">

                <span>
                  Document Type
                </span>

                <strong>
                  {showDetails.type}
                </strong>

              </div>

              {/* CATEGORY */}

              <div className="detail-item">

                <span>
                  Category
                </span>

                <strong>
                  {showDetails.category}
                </strong>

              </div>

              {/* DEPARTMENT */}

              <div className="detail-item">

                <span>
                  Department
                </span>

                <strong>
                  {showDetails.department}
                </strong>

              </div>

              {/* UPLOADED DATE */}

              <div className="detail-item">

                <span>
                  Uploaded Date
                </span>

                <strong>
                  {showDetails.uploadedDate}
                </strong>

              </div>

              {/* EXPIRY */}

              <div className="detail-item">

                <span>
                  Expiry Date
                </span>

                <strong>
                  {showDetails.expiryDate}
                </strong>

              </div>

              {/* FILE SIZE */}

              <div className="detail-item">

                <span>
                  File Size
                </span>

                <strong>
                  {showDetails.size}
                </strong>

              </div>

              {/* UPLOADED BY */}

              <div className="detail-item">

                <span>
                  Uploaded By
                </span>

                <strong>
                  {showDetails.uploadedBy}
                </strong>

              </div>

              {/* STATUS */}

              <div className="detail-item">

                <span>
                  Status
                </span>

                <span
                  className={`status-badge ${statusClass(
                    showDetails.status
                  )}`}
                >
                  {showDetails.status}
                </span>

              </div>

            </div>

            <div className="details-footer">

              <button
                onClick={() => setShowDetails(null)}
                className="close-details-btn"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Documents;