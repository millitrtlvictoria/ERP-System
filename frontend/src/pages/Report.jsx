import { useState } from "react";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import "../styles/report.css";

function Reports() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [reportType, setReportType] = useState("employee");

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All Departments");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // =====================================================
  // EMPLOYEE DATA
  // =====================================================

  const employeeData = [
    {
      employeeId: "EMP001",
      name: "Rahul Kumar",
      department: "SPINNING",
      designation: "Operator",
      joiningDate: "2024-01-15",
      phone: "9876543210",
      status: "Active",
    },

    {
      employeeId: "EMP002",
      name: "Amit Das",
      department: "WEAVING-Rapier",
      designation: "Supervisor",
      joiningDate: "2023-06-20",
      phone: "9876543211",
      status: "Active",
    },

    {
      employeeId: "EMP003",
      name: "Rakesh Singh",
      department: "WEAVING-S4",
      designation: "Operator",
      joiningDate: "2024-03-10",
      phone: "9876543212",
      status: "Leave",
    },

    {
      employeeId: "EMP004",
      name: "Sanjay Roy",
      department: "SPINNING",
      designation: "Worker",
      joiningDate: "2022-11-05",
      phone: "9876543213",
      status: "Active",
    },

    {
      employeeId: "EMP005",
      name: "Vikash Sharma",
      department: "WEAVING-Rapier",
      designation: "Operator",
      joiningDate: "2023-09-12",
      phone: "9876543214",
      status: "Active",
    },
  ];

  // =====================================================
  // ATTENDANCE DATA
  // =====================================================

  const attendanceData = [
    {
      date: "2026-08-17",
      employeeId: "EMP001",
      name: "Rahul Kumar",
      department: "SPINNING",
      shift: "A",
      inTime: "08:02",
      outTime: "17:05",
      status: "Present",
      hours: "9.05",
      overtime: "1.05",
    },

    {
      date: "2026-08-17",
      employeeId: "EMP002",
      name: "Amit Das",
      department: "WEAVING-Rapier",
      shift: "A",
      inTime: "08:10",
      outTime: "17:00",
      status: "Present",
      hours: "8.50",
      overtime: "0.50",
    },

    {
      date: "2026-08-17",
      employeeId: "EMP003",
      name: "Rakesh Singh",
      department: "WEAVING-S4",
      shift: "B",
      inTime: "-",
      outTime: "-",
      status: "Leave",
      hours: "0",
      overtime: "0",
    },

    {
      date: "2026-08-17",
      employeeId: "EMP004",
      name: "Sanjay Roy",
      department: "SPINNING",
      shift: "B",
      inTime: "14:00",
      outTime: "22:10",
      status: "Present",
      hours: "8.10",
      overtime: "0.10",
    },
  ];

  // =====================================================
  // PRODUCTION DATA
  // =====================================================

  const productionData = [
    {
      date: "2026-08-17",
      department: "SPINNING",
      shift: "A",
      production: "916.82",
      target: "1000",
      efficiency: "91.68%",
      hpt: "4.82",
      status: "Good",
    },

    {
      date: "2026-08-17",
      department: "WEAVING-Rapier",
      shift: "A",
      production: "842.50",
      target: "900",
      efficiency: "93.61%",
      hpt: "4.56",
      status: "Excellent",
    },

    {
      date: "2026-08-17",
      department: "WEAVING-S4",
      shift: "B",
      production: "785.40",
      target: "850",
      efficiency: "92.40%",
      hpt: "4.31",
      status: "Good",
    },

    {
      date: "2026-08-16",
      department: "SPINNING",
      shift: "B",
      production: "875.30",
      target: "950",
      efficiency: "92.14%",
      hpt: "4.72",
      status: "Good",
    },
  ];

  // =====================================================
  // DEPARTMENT DATA
  // =====================================================

  const departmentData = [
    {
      department: "SPINNING",
      employees: "52",
      present: "48",
      absent: "2",
      leave: "2",
      production: "1792.12",
      target: "1950",
      efficiency: "91.91%",
      hpt: "4.77",
    },

    {
      department: "WEAVING-Rapier",
      employees: "38",
      present: "36",
      absent: "1",
      leave: "1",
      production: "1652.70",
      target: "1800",
      efficiency: "91.82%",
      hpt: "4.52",
    },

    {
      department: "WEAVING-S4",
      employees: "31",
      present: "29",
      absent: "1",
      leave: "1",
      production: "785.40",
      target: "850",
      efficiency: "92.40%",
      hpt: "4.31",
    },
  ];

  // =====================================================
  // REPORT CONFIGURATION
  // =====================================================

  const reports = {
    employee: {
      title: "Employee Report",

      description:
        "Employee master information",

      columns: [
        "Employee ID",
        "Name",
        "Department",
        "Designation",
        "Joining Date",
        "Phone",
        "Status",
      ],
    },

    attendance: {
      title: "Attendance Report",

      description:
        "Employee attendance information",

      columns: [
        "Date",
        "Employee ID",
        "Name",
        "Department",
        "Shift",
        "In Time",
        "Out Time",
        "Status",
        "Hours",
        "Overtime",
      ],
    },

    production: {
      title: "Production Report",

      description:
        "Daily production and efficiency information",

      columns: [
        "Date",
        "Department",
        "Shift",
        "Production",
        "Target",
        "Efficiency",
        "HPT",
        "Status",
      ],
    },

    department: {
      title: "Department Report",

      description:
        "Department performance summary",

      columns: [
        "Department",
        "Employees",
        "Present",
        "Absent",
        "Leave",
        "Production",
        "Target",
        "Efficiency",
        "HPT",
      ],
    },
  };

  // =====================================================
  // GET CURRENT DATA
  // =====================================================

  const getCurrentData = () => {
    if (reportType === "employee") {
      return employeeData;
    }

    if (reportType === "attendance") {
      return attendanceData;
    }

    if (reportType === "production") {
      return productionData;
    }

    if (reportType === "department") {
      return departmentData;
    }

    return [];
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredData = getCurrentData().filter((item) => {
    let searchMatch = true;
    let departmentMatch = true;
    let fromDateMatch = true;
    let toDateMatch = true;

    // SEARCH
    if (search.trim() !== "") {
      const searchText =
        search.toLowerCase();

      searchMatch =
        Object.values(item).some((value) =>
          String(value)
            .toLowerCase()
            .includes(searchText)
        );
    }

    // DEPARTMENT
    if (
      department !== "All Departments" &&
      item.department
    ) {
      departmentMatch =
        item.department === department;
    }

    // FROM DATE
    if (fromDate && item.date) {
      fromDateMatch =
        item.date >= fromDate;
    }

    // TO DATE
    if (toDate && item.date) {
      toDateMatch =
        item.date <= toDate;
    }

    return (
      searchMatch &&
      departmentMatch &&
      fromDateMatch &&
      toDateMatch
    );
  });

  // =====================================================
  // CONVERT DATA INTO TABLE ROWS
  // =====================================================

  const getRows = () => {
    if (reportType === "employee") {
      return filteredData.map((item) => [
        item.employeeId,
        item.name,
        item.department,
        item.designation,
        item.joiningDate,
        item.phone,
        item.status,
      ]);
    }

    if (reportType === "attendance") {
      return filteredData.map((item) => [
        item.date,
        item.employeeId,
        item.name,
        item.department,
        item.shift,
        item.inTime,
        item.outTime,
        item.status,
        item.hours,
        item.overtime,
      ]);
    }

    if (reportType === "production") {
      return filteredData.map((item) => [
        item.date,
        item.department,
        item.shift,
        item.production,
        item.target,
        item.efficiency,
        item.hpt,
        item.status,
      ]);
    }

    if (reportType === "department") {
      return filteredData.map((item) => [
        item.department,
        item.employees,
        item.present,
        item.absent,
        item.leave,
        item.production,
        item.target,
        item.efficiency,
        item.hpt,
      ]);
    }

    return [];
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setFromDate("");
    setToDate("");
  };

  // =====================================================
  // CSV DOWNLOAD
  // =====================================================

  const downloadCSV = () => {
    const headers =
      reports[reportType].columns;

    const rows = getRows();

    const csvRows = [];

    csvRows.push(
      headers
        .map((header) => `"${header}"`)
        .join(",")
    );

    rows.forEach((row) => {
      csvRows.push(
        row
          .map(
            (value) =>
              `"${String(value).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      );
    });

    const csvContent =
      csvRows.join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${reportType}-report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // EXCEL DOWNLOAD
  // =====================================================

  const downloadExcel = () => {
    const headers =
      reports[reportType].columns;

    const rows = getRows();

    const worksheetData = [
      headers,
      ...rows,
    ];

    const worksheet =
      XLSX.utils.aoa_to_sheet(
        worksheetData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Report"
    );

    XLSX.writeFile(
      workbook,
      `${reportType}-report.xlsx`
    );
  };

  // =====================================================
  // PDF DOWNLOAD
  // =====================================================

  const downloadPDF = () => {
    const headers =
      reports[reportType].columns;

    const rows = getRows();

    const isWide =
      headers.length > 7;

    const doc = new jsPDF({
      orientation: isWide
        ? "landscape"
        : "portrait",

      unit: "mm",
      format: "a4",
    });

    // TITLE
    doc.setFontSize(20);

    doc.text(
      reports[reportType].title,
      14,
      18
    );

    // DESCRIPTION
    doc.setFontSize(10);

    doc.text(
      reports[reportType].description,
      14,
      26
    );

    // DATE
    doc.setFontSize(9);

    doc.text(
      `Generated on: ${new Date().toLocaleString()}`,
      14,
      33
    );

    // FILTER INFORMATION
    let filterText =
      "Department: " +
      department;

    if (fromDate) {
      filterText +=
        ` | From: ${fromDate}`;
    }

    if (toDate) {
      filterText +=
        ` | To: ${toDate}`;
    }

    doc.text(
      filterText,
      14,
      39
    );

    // TABLE
    autoTable(doc, {
      startY: 45,

      head: [headers],

      body: rows,

      theme: "grid",

      styles: {
        fontSize: 7,
        cellPadding: 2,
      },

      headStyles: {
        fontSize: 7,
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [245, 247, 251],
      },
    });

    // FOOTER
    const pageCount =
      doc.internal.getNumberOfPages();

    for (
      let i = 1;
      i <= pageCount;
      i++
    ) {
      doc.setPage(i);

      doc.setFontSize(8);

      doc.text(
        `Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 8
      );
    }

    // SAVE
    doc.save(
      `${reportType}-report.pdf`
    );
  };

  // =====================================================
  // REPORT TAB DATA
  // =====================================================

  const reportTabs = [
    {
      id: "employee",
      icon: "👥",
      title: "Employee Report",
      description:
        "Employee information",
    },

    {
      id: "attendance",
      icon: "📅",
      title: "Attendance Report",
      description:
        "Attendance records",
    },

    {
      id: "production",
      icon: "🏭",
      title: "Production Report",
      description:
        "Production performance",
    },

    {
      id: "department",
      icon: "🏢",
      title: "Department Report",
      description:
        "Department summary",
    },
  ];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="reports-page">

      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="reports-header">

        <div>

          <button
            className="reports-back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <h1>Reports</h1>

          <p>
            Generate and download
            professional ERP reports.
          </p>

        </div>

      </div>


      {/* ============================================= */}
      {/* REPORT TYPES */}
      {/* ============================================= */}

      <div className="report-tabs">

        {reportTabs.map((tab) => (

          <button
            key={tab.id}
            className={
              reportType === tab.id
                ? "report-tab active"
                : "report-tab"
            }
            onClick={() => {
              setReportType(tab.id);
              clearFilters();
            }}
          >

            <span className="report-tab-icon">
              {tab.icon}
            </span>

            <span>

              <strong>
                {tab.title}
              </strong>

              <small>
                {tab.description}
              </small>

            </span>

          </button>

        ))}

      </div>


      {/* ============================================= */}
      {/* FILTER */}
      {/* ============================================= */}

      <div className="report-filter-card">

        <div className="report-filter-header">

          <div>

            <h2>
              {reports[reportType].title}
            </h2>

            <p>
              {reports[reportType].description}
            </p>

          </div>

          <button
            className="clear-report-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        <div className="report-filter-grid">

          {/* FROM DATE */}

          <div className="report-filter-group">

            <label>
              From Date
            </label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) =>
                setFromDate(e.target.value)
              }
            />

          </div>


          {/* TO DATE */}

          <div className="report-filter-group">

            <label>
              To Date
            </label>

            <input
              type="date"
              value={toDate}
              onChange={(e) =>
                setToDate(e.target.value)
              }
            />

          </div>


          {/* DEPARTMENT */}

          <div className="report-filter-group">

            <label>
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
            >

              <option>
                All Departments
              </option>

              <option>
                SPINNING
              </option>

              <option>
                WEAVING-Rapier
              </option>

              <option>
                WEAVING-S4
              </option>

            </select>

          </div>


          {/* SEARCH */}

          <div className="report-filter-group">

            <label>
              Search
            </label>

            <input
              type="text"
              placeholder="Search report..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

      </div>


      {/* ============================================= */}
      {/* REPORT PREVIEW */}
      {/* ============================================= */}

      <div className="report-preview-card">

        <div className="report-preview-header">

          <div>

            <h2>
              Report Preview
            </h2>

            <p>
              {filteredData.length} records found
            </p>

          </div>


          {/* DOWNLOAD BUTTONS */}

          <div className="report-download-buttons">

            <button
              className="download-btn pdf"
              onClick={downloadPDF}
            >
              ↓ Download PDF
            </button>

            <button
              className="download-btn excel"
              onClick={downloadExcel}
            >
              ↓ Download Excel
            </button>

            <button
              className="download-btn csv"
              onClick={downloadCSV}
            >
              ↓ Download CSV
            </button>

          </div>

        </div>


        {/* ========================================= */}
        {/* TABLE */}
        {/* ========================================= */}

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>

                {reports[
                  reportType
                ].columns.map(
                  (column) => (

                    <th key={column}>
                      {column}
                    </th>

                  )
                )}

              </tr>

            </thead>


            <tbody>

              {getRows().length > 0 ? (

                getRows().map(
                  (row, rowIndex) => (

                    <tr key={rowIndex}>

                      {row.map(
                        (
                          value,
                          cellIndex
                        ) => (

                          <td
                            key={
                              cellIndex
                            }
                          >
                            {value}
                          </td>

                        )
                      )}

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan={
                      reports[
                        reportType
                      ].columns.length
                    }
                    className="no-report-data"
                  >
                    No records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="report-footer">

          <span>
            Total Records:
            {" "}
            <strong>
              {filteredData.length}
            </strong>
          </span>

          <span>
            {reports[reportType].title}
          </span>

        </div>

      </div>

    </div>
  );
}

export default Reports;