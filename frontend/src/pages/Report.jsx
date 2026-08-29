
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

import "../styles/report.css";

function Reports() {
  const navigate = useNavigate();

  // =====================================================
  // API
  // =====================================================

  const API_URL = "http://127.0.0.1:8000";

  // =====================================================
  // STATE
  // =====================================================

  const [reportType, setReportType] =
    useState("employee");

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("All Departments");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  // =====================================================
  // LIVE EMPLOYEE DATA
  // =====================================================

  const [employees, setEmployees] =
    useState([]);

  const [loadingEmployees, setLoadingEmployees] =
    useState(false);

  const [employeeError, setEmployeeError] =
    useState("");

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setEmployeeError("");

    try {
      const response = await fetch(
        `${API_URL}/api/employees?skip=0&limit=10000`
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to fetch employee data.";

        try {
          const errorData =
            await response.json();

          if (errorData?.detail) {
            errorMessage =
              errorData.detail;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid employee data received from server."
        );
      }

      setEmployees(data);
    } catch (error) {
      console.error(
        "Error fetching employees:",
        error
      );

      setEmployees([]);

      setEmployeeError(
        error.message ||
          "Unable to load employee data from server."
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  // =====================================================
  // LOAD EMPLOYEES WHEN PAGE OPENS
  // =====================================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =====================================================
  // EMPLOYEE DATA
  // =====================================================

  /*
   * Employee data is LIVE.
   *
   * No dummy employee data is used.
   */

  const employeeData = useMemo(() => {
    return employees;
  }, [employees]);

  // =====================================================
  // ATTENDANCE DATA
  // =====================================================

  /*
   * KEPT AS ORIGINAL.
   *
   * This section is not connected to backend yet.
   */

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

  /*
   * KEPT AS ORIGINAL.
   *
   * This section is not connected to backend yet.
   */

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

  /*
   * KEPT AS ORIGINAL.
   *
   * This section is not connected to backend yet.
   */

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
        "First Name",
        "Last Name",
        "Gender",
        "Date of Birth",
        "Phone",
        "Email",
        "Department",
        "Designation",
        "Joining Date",
        "Employment Type",
        "Monthly Salary",
        "Status",
        "Address",
        "Created At",
        "Updated At",
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
  // REPORT TABS
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
  // EMPLOYEE DEPARTMENTS
  // =====================================================

  const employeeDepartments =
    useMemo(() => {
      const departments = [
        ...new Set(
          employeeData
            .map(
              (employee) =>
                employee.department
            )
            .filter(
              (value) =>
                value !== null &&
                value !== undefined &&
                String(value).trim() !== ""
            )
            .map((value) =>
              String(value).trim()
            )
        ),
      ];

      return departments.sort(
        (a, b) =>
          a.localeCompare(b)
      );
    }, [employeeData]);

  // =====================================================
  // GET CURRENT DATA
  // =====================================================

  const getCurrentData = () => {
    if (
      reportType ===
      "employee"
    ) {
      return employeeData;
    }

    if (
      reportType ===
      "attendance"
    ) {
      return attendanceData;
    }

    if (
      reportType ===
      "production"
    ) {
      return productionData;
    }

    if (
      reportType ===
      "department"
    ) {
      return departmentData;
    }

    return [];
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    if (
      typeof value ===
        "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(
        value
      )
    ) {
      const [
        year,
        month,
        day,
      ] =
        value.split("-");

      return `${day}/${month}/${year}`;
    }

    return String(value);
  };

  // =====================================================
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (
    value
  ) => {
    if (!value) {
      return "-";
    }

    try {
      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return String(value);
      }

      return date.toLocaleString();
    } catch {
      return String(value);
    }
  };

  // =====================================================
  // FORMAT SALARY
  // =====================================================

  const formatSalary = (
    value
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    const numberValue =
      Number(value);

    if (
      Number.isNaN(
        numberValue
      )
    ) {
      return String(value);
    }

    return numberValue.toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // =====================================================
  // GET EMPLOYMENT TYPE
  // =====================================================

  /*
   * IMPORTANT FIX
   *
   * Depending on your Pydantic schema / backend response,
   * employment type may be returned as:
   *
   *     employment_type_
   *
   * OR
   *
   *     employment_type
   *
   * This function supports BOTH.
   */

  const getEmploymentType = (
    employee
  ) => {
    const employmentType =
      employee.employment_type_ ??
      employee.employment_type ??
      employee.employmentType ??
      "";

    if (
      employmentType ===
        null ||
      employmentType ===
        undefined ||
      String(
        employmentType
      ).trim() === ""
    ) {
      return "-";
    }

    return String(
      employmentType
    );
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredData =
    getCurrentData().filter(
      (item) => {
        let searchMatch = true;

        let departmentMatch =
          true;

        let fromDateMatch =
          true;

        let toDateMatch =
          true;

        // =============================================
        // SEARCH
        // =============================================

        if (
          search.trim() !==
          ""
        ) {
          const searchText =
            search
              .trim()
              .toLowerCase();

          if (
            reportType ===
            "employee"
          ) {
            searchMatch = [
              item.id,
              item.emp_id,
              item.first_name,
              item.last_name,
              item.name,
              item.gender,
              item.date_of_birth,
              item.phone,
              item.email,
              item.department,
              item.designation,
              item.joining_date,

              // IMPORTANT:
              // Search both employment type names.
              item.employment_type_,
              item.employment_type,

              item.monthly_salary,
              item.status,
              item.address,
              item.created_at,
              item.updated_at,
            ].some(
              (value) =>
                String(
                  value ??
                    ""
                )
                  .toLowerCase()
                  .includes(
                    searchText
                  )
            );
          } else {
            searchMatch =
              Object.values(
                item
              ).some(
                (value) =>
                  String(
                    value
                  )
                    .toLowerCase()
                    .includes(
                      searchText
                    )
              );
          }
        }

        // =============================================
        // DEPARTMENT
        // =============================================

        if (
          department !==
            "All Departments" &&
          item.department
        ) {
          departmentMatch =
            item.department ===
            department;
        }

        // =============================================
        // DATE
        // =============================================

        const itemDate =
          reportType ===
          "employee"
            ? item.joining_date
            : item.date;

        // =============================================
        // FROM DATE
        // =============================================

        if (
          fromDate &&
          itemDate
        ) {
          fromDateMatch =
            itemDate >=
            fromDate;
        }

        // =============================================
        // TO DATE
        // =============================================

        if (
          toDate &&
          itemDate
        ) {
          toDateMatch =
            itemDate <=
            toDate;
        }

        return (
          searchMatch &&
          departmentMatch &&
          fromDateMatch &&
          toDateMatch
        );
      }
    );

  // =====================================================
  // CONVERT DATA INTO TABLE ROWS
  // =====================================================

  const getRows = () => {
    // ===================================================
    // EMPLOYEE REPORT
    // ===================================================

    if (
      reportType ===
      "employee"
    ) {
      return filteredData.map(
        (employee) => [
          employee.emp_id ??
            "-",

          employee.first_name ??
            "-",

          employee.last_name ??
            "-",

          employee.gender ??
            "-",

          formatDate(
            employee.date_of_birth
          ),

          employee.phone ??
            "-",

          employee.email ??
            "-",

          employee.department ??
            "-",

          employee.designation ??
            "-",

          formatDate(
            employee.joining_date
          ),

          // ===========================================
          // EMPLOYMENT TYPE FIX
          // ===========================================

          getEmploymentType(
            employee
          ),

          formatSalary(
            employee.monthly_salary
          ),

          employee.status ??
            "-",

          employee.address ??
            "-",

          formatDateTime(
            employee.created_at
          ),

          formatDateTime(
            employee.updated_at
          ),
        ]
      );
    }

    // ===================================================
    // ATTENDANCE REPORT
    // ===================================================

    if (
      reportType ===
      "attendance"
    ) {
      return filteredData.map(
        (item) => [
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
        ]
      );
    }

    // ===================================================
    // PRODUCTION REPORT
    // ===================================================

    if (
      reportType ===
      "production"
    ) {
      return filteredData.map(
        (item) => [
          item.date,
          item.department,
          item.shift,
          item.production,
          item.target,
          item.efficiency,
          item.hpt,
          item.status,
        ]
      );
    }

    // ===================================================
    // DEPARTMENT REPORT
    // ===================================================

    if (
      reportType ===
      "department"
    ) {
      return filteredData.map(
        (item) => [
          item.department,
          item.employees,
          item.present,
          item.absent,
          item.leave,
          item.production,
          item.target,
          item.efficiency,
          item.hpt,
        ]
      );
    }

    return [];
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");

    setDepartment(
      "All Departments"
    );

    setFromDate("");

    setToDate("");
  };

  // =====================================================
  // CSV DOWNLOAD
  // =====================================================

  const downloadCSV = () => {
    const headers =
      reports[
        reportType
      ].columns;

    const rows =
      getRows();

    const csvRows = [];

    csvRows.push(
      headers
        .map(
          (header) =>
            `"${header.replace(
              /"/g,
              '""'
            )}"`
        )
        .join(",")
    );

    rows.forEach(
      (row) => {
        csvRows.push(
          row
            .map(
              (value) =>
                `"${String(
                  value ??
                    ""
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
        );
      }
    );

    const csvContent =
      "\uFEFF" +
      csvRows.join(
        "\n"
      );

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `${reportType}-report.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  // =====================================================
  // EXCEL DOWNLOAD
  // =====================================================

  const downloadExcel =
    () => {
      const headers =
        reports[
          reportType
        ].columns;

      const rows =
        getRows();

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

  const downloadPDF =
    () => {
      const headers =
        reports[
          reportType
        ].columns;

      const rows =
        getRows();

      const isWide =
        headers.length > 7;

      const doc =
        new jsPDF({
          orientation:
            isWide
              ? "landscape"
              : "portrait",

          unit: "mm",

          format: "a4",
        });

      // =================================================
      // TITLE
      // =================================================

      doc.setFontSize(
        20
      );

      doc.text(
        reports[
          reportType
        ].title,
        14,
        18
      );

      // =================================================
      // DESCRIPTION
      // =================================================

      doc.setFontSize(
        10
      );

      doc.text(
        reports[
          reportType
        ].description,
        14,
        26
      );

      // =================================================
      // GENERATED DATE
      // =================================================

      doc.setFontSize(
        9
      );

      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        14,
        33
      );

      // =================================================
      // FILTER INFORMATION
      // =================================================

      let filterText =
        "Department: " +
        department;

      if (fromDate) {
        filterText +=
          ` | From: ${formatDate(
            fromDate
          )}`;
      }

      if (toDate) {
        filterText +=
          ` | To: ${formatDate(
            toDate
          )}`;
      }

      if (
        search.trim() !==
        ""
      ) {
        filterText +=
          ` | Search: ${search.trim()}`;
      }

      doc.text(
        filterText,
        14,
        39
      );

      // =================================================
      // TABLE
      // =================================================

      autoTable(
        doc,
        {
          startY: 45,

          head: [
            headers,
          ],

          body: rows,

          theme: "grid",

          styles: {
            fontSize: 7,
            cellPadding: 2,
          },

          headStyles: {
            fontSize: 7,
            fontStyle:
              "bold",
          },

          alternateRowStyles:
            {
              fillColor:
                [
                  245,
                  247,
                  251,
                ],
            },
        }
      );

      // =================================================
      // FOOTER
      // =================================================

      const pageCount =
        doc.internal.getNumberOfPages();

      for (
        let i = 1;
        i <= pageCount;
        i++
      ) {
        doc.setPage(
          i
        );

        doc.setFontSize(
          8
        );

        doc.text(
          `Page ${i} of ${pageCount}`,
          14,
          doc.internal
            .pageSize
            .height - 8
        );
      }

      // =================================================
      // SAVE PDF
      // =================================================

      doc.save(
        `${reportType}-report.pdf`
      );
    };

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
              navigate(
                "/dashboard"
              )
            }
          >
            ← Dashboard
          </button>

          <h1>
            Reports
          </h1>

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

        {reportTabs.map(
          (tab) => (

            <button
              key={
                tab.id
              }
              className={
                reportType ===
                tab.id
                  ? "report-tab active"
                  : "report-tab"
              }
              onClick={() => {
                setReportType(
                  tab.id
                );

                clearFilters();
              }}
            >

              <span className="report-tab-icon">
                {
                  tab.icon
                }
              </span>

              <span>

                <strong>
                  {
                    tab.title
                  }
                </strong>

                <small>
                  {
                    tab.description
                  }
                </small>

              </span>

            </button>

          )
        )}

      </div>


      {/* ============================================= */}
      {/* FILTER */}
      {/* ============================================= */}

      <div className="report-filter-card">

        <div className="report-filter-header">

          <div>

            <h2>
              {
                reports[
                  reportType
                ].title
              }
            </h2>

            <p>
              {
                reports[
                  reportType
                ].description
              }
            </p>

          </div>


          <div
            style={{
              display:
                "flex",
              gap:
                "10px",
              alignItems:
                "center",
            }}
          >

            {/* ======================================= */}
            {/* REFRESH */}
            {/* ======================================= */}

            {reportType ===
              "employee" && (

              <button
                className="clear-report-btn"
                onClick={
                  fetchEmployees
                }
                disabled={
                  loadingEmployees
                }
              >
                {loadingEmployees
                  ? "Refreshing..."
                  : "↻ Refresh"}
              </button>

            )}

            <button
              className="clear-report-btn"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>

        </div>


        <div className="report-filter-grid">

          {/* ========================================= */}
          {/* FROM DATE */}
          {/* ========================================= */}

          <div className="report-filter-group">

            <label>
              {reportType ===
              "employee"
                ? "Joining From"
                : "From Date"}
            </label>

            <input
              type="date"
              value={
                fromDate
              }
              onChange={(
                e
              ) =>
                setFromDate(
                  e.target
                    .value
                )
              }
            />

          </div>


          {/* ========================================= */}
          {/* TO DATE */}
          {/* ========================================= */}

          <div className="report-filter-group">

            <label>
              {reportType ===
              "employee"
                ? "Joining To"
                : "To Date"}
            </label>

            <input
              type="date"
              value={
                toDate
              }
              onChange={(
                e
              ) =>
                setToDate(
                  e.target
                    .value
                )
              }
            />

          </div>


          {/* ========================================= */}
          {/* DEPARTMENT */}
          {/* ========================================= */}

          <div className="report-filter-group">

            <label>
              Department
            </label>

            <select
              value={
                department
              }
              onChange={(
                e
              ) =>
                setDepartment(
                  e.target
                    .value
                )
              }
            >

              <option value="All Departments">
                All Departments
              </option>

              {reportType ===
              "employee" ? (

                employeeDepartments.map(
                  (
                    dept
                  ) => (

                    <option
                      key={
                        dept
                      }
                      value={
                        dept
                      }
                    >
                      {
                        dept
                      }
                    </option>

                  )
                )

              ) : (

                <>
                  <option>
                    SPINNING
                  </option>

                  <option>
                    WEAVING-Rapier
                  </option>

                  <option>
                    WEAVING-S4
                  </option>

                  <option>
                    HR
                  </option>

                  <option>
                    IT
                  </option>

                  <option>
                    Accounts
                  </option>
                </>

              )}

            </select>

          </div>


          {/* ========================================= */}
          {/* SEARCH */}
          {/* ========================================= */}

          <div className="report-filter-group">

            <label>
              Search
            </label>

            <input
              type="text"
              placeholder={
                reportType ===
                "employee"
                  ? "Search employee..."
                  : "Search report..."
              }
              value={
                search
              }
              onChange={(
                e
              ) =>
                setSearch(
                  e.target
                    .value
                )
              }
            />

          </div>

        </div>

      </div>


      {/* ============================================= */}
      {/* EMPLOYEE ERROR */}
      {/* ============================================= */}

      {reportType ===
        "employee" &&
        employeeError && (

        <div
          style={{
            marginTop:
              "15px",
            padding:
              "14px 18px",
            borderRadius:
              "8px",
            background:
              "#fff1f2",
            border:
              "1px solid #fecdd3",
            color:
              "#be123c",
          }}
        >

          <strong>
            Unable to load employee data
          </strong>

          <div
            style={{
              marginTop:
                "5px",
            }}
          >
            {
              employeeError
            }
          </div>

          <button
            onClick={
              fetchEmployees
            }
            style={{
              marginTop:
                "10px",
              cursor:
                "pointer",
            }}
          >
            Try Again
          </button>

        </div>

      )}


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
              {loadingEmployees &&
              reportType ===
                "employee"
                ? "Loading employee records..."
                : `${filteredData.length} records found`}
            </p>

          </div>


          {/* ========================================= */}
          {/* DOWNLOAD BUTTONS */}
          {/* ========================================= */}

          <div className="report-download-buttons">

            <button
              className="download-btn pdf"
              onClick={
                downloadPDF
              }
              disabled={
                loadingEmployees ||
                filteredData.length ===
                  0
              }
            >
              ↓ Download PDF
            </button>

            <button
              className="download-btn excel"
              onClick={
                downloadExcel
              }
              disabled={
                loadingEmployees ||
                filteredData.length ===
                  0
              }
            >
              ↓ Download Excel
            </button>

            <button
              className="download-btn csv"
              onClick={
                downloadCSV
              }
              disabled={
                loadingEmployees ||
                filteredData.length ===
                  0
              }
            >
              ↓ Download CSV
            </button>

          </div>

        </div>


        {/* ============================================= */}
        {/* TABLE */}
        {/* ============================================= */}

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>

                {reports[
                  reportType
                ].columns.map(
                  (
                    column
                  ) => (

                    <th
                      key={
                        column
                      }
                    >
                      {
                        column
                      }
                    </th>

                  )
                )}

              </tr>

            </thead>


            <tbody>

              {/* ======================================= */}
              {/* LOADING */}
              {/* ======================================= */}

              {reportType ===
                "employee" &&
              loadingEmployees ? (

                <tr>

                  <td
                    colSpan={
                      reports[
                        reportType
                      ].columns
                        .length
                    }
                    className="no-report-data"
                  >
                    Loading employee
                    data from
                    backend...
                  </td>

                </tr>

              ) : reportType ===
                  "employee" &&
                employeeError ? (

                <tr>

                  <td
                    colSpan={
                      reports[
                        reportType
                      ].columns
                        .length
                    }
                    className="no-report-data"
                  >
                    Employee data
                    could not be
                    loaded.
                  </td>

                </tr>

              ) : getRows()
                  .length >
                0 ? (

                getRows().map(
                  (
                    row,
                    rowIndex
                  ) => (

                    <tr
                      key={
                        rowIndex
                      }
                    >

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
                            {
                              value
                            }
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
                      ].columns
                        .length
                    }
                    className="no-report-data"
                  >
                    No records
                    found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* ============================================= */}
        {/* FOOTER */}
        {/* ============================================= */}

        <div className="report-footer">

          <span>
            Total Records:
            {" "}

            <strong>
              {
                filteredData.length
              }
            </strong>

          </span>

          <span>
            {
              reports[
                reportType
              ].title
            }
          </span>

        </div>

      </div>

    </div>
  );
}

export default Reports;
