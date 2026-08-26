import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const searchValue = search.toLowerCase();

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

  const handleUpload = (e) => {
    e.preventDefault();

    if (
      !newDocument.employeeId ||
      !newDocument.employeeName ||
      !newDocument.documentName
    ) {
      alert("Please fill Employee ID, Employee Name and Document Name.");
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

  const deleteDocument = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) return;

    setDocuments((prev) =>
      prev.filter((doc) => doc.id !== id)
    );
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setType("All Types");
    setStatus("All Status");
    setDepartment("All Departments");
  };

  const statusStyle = (value) => {
    if (value === "Verified") {
      return "bg-green-100 text-green-700";
    }

    if (value === "Expiring Soon") {
      return "bg-orange-100 text-orange-700";
    }

    if (value === "Expired") {
      return "bg-red-100 text-red-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* HEADER */}
      <div className="border-b bg-white px-6 py-5 shadow-sm">
        <div className="mx-auto max-w-7xl">

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-3 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </button>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Document Management
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage, organize and track all employee and company
                documents from one place.
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              + Upload Document
            </button>

          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto max-w-7xl space-y-6 p-6">

        {/* STATISTICS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Total Documents
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {documents.length}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  All uploaded documents
                </p>
              </div>

              <div className="rounded-xl bg-blue-100 p-4 text-2xl">
                📁
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Active Documents
                </p>

                <h2 className="mt-2 text-3xl font-bold text-green-600">
                  {activeDocuments}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Currently active
                </p>
              </div>

              <div className="rounded-xl bg-green-100 p-4 text-2xl">
                ✓
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Verified
                </p>

                <h2 className="mt-2 text-3xl font-bold text-purple-600">
                  {verifiedDocuments}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Verified documents
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-4 text-2xl">
                ✓
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Expiring Soon
                </p>

                <h2 className="mt-2 text-3xl font-bold text-orange-600">
                  {expiringDocuments}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Require attention
                </p>
              </div>

              <div className="rounded-xl bg-orange-100 p-4 text-2xl">
                ⚠
              </div>
            </div>
          </div>

        </div>

        {/* DOCUMENT CATEGORY SUMMARY */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Employee Documents
            </p>

            <p className="mt-2 text-2xl font-bold">
              {employeeDocuments}
            </p>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-blue-600"
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

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Payroll Documents
            </p>

            <p className="mt-2 text-2xl font-bold">
              {
                documents.filter(
                  (doc) =>
                    doc.category === "Payroll Documents"
                ).length
              }
            </p>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-purple-600"
                style={{
                  width: `${
                    documents.length
                      ? (documents.filter(
                          (doc) =>
                            doc.category ===
                            "Payroll Documents"
                        ).length /
                          documents.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Production Documents
            </p>

            <p className="mt-2 text-2xl font-bold">
              {
                documents.filter(
                  (doc) =>
                    doc.category ===
                    "Production Documents"
                ).length
              }
            </p>

            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-orange-500"
                style={{
                  width: `${
                    documents.length
                      ? (documents.filter(
                          (doc) =>
                            doc.category ===
                            "Production Documents"
                        ).length /
                          documents.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

        </div>

        {/* FILTER CARD */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">

          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Document Records
              </h2>

              <p className="text-sm text-slate-500">
                Search and filter your documents.
              </p>
            </div>

            <button
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Clear Filters
            </button>

          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Employee ID, name or document..."
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Verified</option>
                <option>Expiring Soon</option>
                <option>Expired</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-600">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option>All Departments</option>
                <option>HR</option>
                <option>SPINNING</option>
                <option>WEAVING-Rapier</option>
                <option>WEAVING-S4</option>
              </select>
            </div>

          </div>

          <div className="mt-4 max-w-xs">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Document Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
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

        {/* TABLE */}
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b p-5 md:flex-row md:items-center">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                All Documents
              </h2>

              <p className="text-sm text-slate-500">
                Showing {filteredDocuments.length} of{" "}
                {documents.length} documents
              </p>
            </div>

            <button
              onClick={() => setShowUpload(true)}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Add Document
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead className="bg-slate-50">

                <tr className="border-b text-left text-xs uppercase text-slate-500">

                  <th className="px-5 py-4">
                    Document
                  </th>

                  <th className="px-5 py-4">
                    Employee ID
                  </th>

                  <th className="px-5 py-4">
                    Employee Name
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Department
                  </th>

                  <th className="px-5 py-4">
                    Uploaded
                  </th>

                  <th className="px-5 py-4">
                    Expiry
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (

                    <tr
                      key={doc.id}
                      className="border-b transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-lg">
                            📄
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {doc.documentName}
                            </p>

                            <p className="text-xs text-slate-400">
                              {doc.documentId} • {doc.size}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="font-semibold text-blue-600">
                          {doc.employeeId}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
                            {doc.employeeName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <span className="font-medium">
                            {doc.employeeName}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {doc.category}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-sm">
                        {doc.department}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {doc.uploadedDate}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {doc.expiryDate}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-center gap-2">

                          <button
                            onClick={() => setShowDetails(doc)}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-slate-50"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              alert(
                                `Download: ${doc.documentName}`
                              )
                            }
                            className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                          >
                            Download
                          </button>

                          <button
                            onClick={() => deleteDocument(doc.id)}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
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
                      className="px-5 py-16 text-center"
                    >

                      <div className="text-4xl">
                        📂
                      </div>

                      <h3 className="mt-3 font-semibold text-slate-800">
                        No documents found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* UPLOAD MODAL */}
      {showUpload && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Upload Document
                </h2>

                <p className="text-sm text-slate-500">
                  Add a new document to the ERP system.
                </p>
              </div>

              <button
                onClick={() => setShowUpload(false)}
                className="rounded-lg px-3 py-2 text-xl hover:bg-slate-100"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleUpload}
              className="space-y-5 p-6"
            >

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Employee ID *
                  </label>

                  <input
                    name="employeeId"
                    value={newDocument.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP-001"
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Employee Name *
                  </label>

                  <input
                    name="employeeName"
                    value={newDocument.employeeName}
                    onChange={handleInputChange}
                    placeholder="Employee name"
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold">
                    Document Name *
                  </label>

                  <input
                    name="documentName"
                    value={newDocument.documentName}
                    onChange={handleInputChange}
                    placeholder="Example: Aadhaar Card"
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={newDocument.category}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option>Employee Documents</option>
                    <option>HR Documents</option>
                    <option>Payroll Documents</option>
                    <option>Production Documents</option>
                    <option>Attendance Documents</option>
                    <option>Company Documents</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Document Type
                  </label>

                  <select
                    name="type"
                    value={newDocument.type}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option>ID Proof</option>
                    <option>Appointment Letter</option>
                    <option>Experience Certificate</option>
                    <option>Salary Slip</option>
                    <option>Medical Certificate</option>
                    <option>Production Report</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Department
                  </label>

                  <select
                    name="department"
                    value={newDocument.department}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  >
                    <option>HR</option>
                    <option>SPINNING</option>
                    <option>WEAVING-Rapier</option>
                    <option>WEAVING-S4</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={newDocument.expiryDate}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-4 py-2.5 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">

                  <label className="mb-1 block text-sm font-semibold">
                    Select File
                  </label>

                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full rounded-lg border border-dashed p-4 text-sm"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Supported files can be PDF, Excel, Word, JPG or PNG.
                  </p>

                </div>

              </div>

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="rounded-lg border px-5 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Upload Document
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* DETAILS MODAL */}
      {showDetails && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b p-6">

              <div>
                <h2 className="text-xl font-bold">
                  Document Details
                </h2>

                <p className="text-sm text-slate-500">
                  {showDetails.documentId}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(null)}
                className="rounded-lg px-3 py-2 text-xl hover:bg-slate-100"
              >
                ×
              </button>

            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

              <div>
                <p className="text-xs text-slate-400">
                  Employee ID
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.employeeId}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Employee Name
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.employeeName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Document Name
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.documentName}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Document Type
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.type}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Category
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.category}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Department
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.department}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Uploaded Date
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.uploadedDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Expiry Date
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.expiryDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  File Size
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.size}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Uploaded By
                </p>

                <p className="mt-1 font-semibold">
                  {showDetails.uploadedBy}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Status
                </p>

                <span
                  className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                    showDetails.status
                  )}`}
                >
                  {showDetails.status}
                </span>
              </div>

            </div>

            <div className="flex justify-end border-t p-5">

              <button
                onClick={() => setShowDetails(null)}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
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
