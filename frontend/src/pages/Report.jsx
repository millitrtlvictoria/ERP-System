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
        let message =
          "Failed to fetch employee data.";

        try {
          const errorData =
            await response.json();

          if (errorData?.detail) {
            message =
              errorData.detail;
          }
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
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
          "Unable to load employee data."
      );
    } finally {
      setLoadingEmployees(false);
    }
  };

  // =====================================================
  // LOAD EMPLOYEES
  // =====================================================

  useEffect(() => {
    fetchEmployees();
  }, []);

  // =====================================================
  // EMPLOYEE DATA
  // =====================================================

  const employeeData = useMemo(() => {
    return employees;
  }, [employees]);

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
      description: "Employee information",
    },
    {
      id: "attendance",
      icon: "📅",
      title: "Attendance Report",
      description: "Attendance records",
    },
    {
      id: "production",
      icon: "🏭",
      title: "Production Report",
      description: "Production performance",
    },
    {
      id: "department",
      icon: "🏢",
      title: "Department Report",
      description: "Department summary",
    },
  ];

  // =====================================================
  // DEPARTMENTS
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
  // CURRENT DATA
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

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    if (
      typeof value === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      const [
        year,
        month,
        day,
      ] = value.split("-");

      return `${day}/${month}/${year}`;
    }

    return String(value);
  };

  // =====================================================
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (value) => {
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

  const formatSalary = (value) => {
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
  // EMPLOYMENT TYPE
  // =====================================================

  const getEmploymentType = (
    employee
  ) => {
    const value =
      employee.employment_type_ ??
      employee.employment_type ??
      employee.employmentType ??
      "";

    if (
      value === null ||
      value === undefined ||
      String(value).trim() === ""
    ) {
      return "-";
    }

    return String(value);
  };

  // =====================================================
  // FILTER DATA
  // =====================================================

  const filteredData =
    getCurrentData().filter(
      (item) => {
        let searchMatch = true;
        let departmentMatch = true;
        let fromDateMatch = true;
        let toDateMatch = true;

        // =================================================
        // SEARCH
        // =================================================

        if (
          search.trim() !== ""
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
              item.gender,
              item.date_of_birth,
              item.phone,
              item.email,
              item.department,
              item.designation,
              item.joining_date,
              item.employment_type_,
              item.employment_type,
              item.employmentType,
              item.monthly_salary,
              item.status,
              item.address,
              item.created_at,
              item.updated_at,
            ].some(
              (value) =>
                String(
                  value ?? ""
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
                    value ?? ""
                  )
                    .toLowerCase()
                    .includes(
                      searchText
                    )
              );
          }
        }

        // =================================================
        // DEPARTMENT
        // =================================================

        if (
          department !==
            "All Departments" &&
          item.department
        ) {
          departmentMatch =
            String(
              item.department
            ).trim() ===
            String(
              department
            ).trim();
        }

        // =================================================
        // DATE
        // =================================================

        const itemDate =
          reportType ===
          "employee"
            ? item.joining_date
            : item.date;

        if (
          fromDate &&
          itemDate
        ) {
          fromDateMatch =
            itemDate >=
            fromDate;
        }

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
  // GET TABLE ROWS
  // =====================================================

  const getRows = () => {
    // ===================================================
    // EMPLOYEE
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
    // ATTENDANCE
    // ===================================================

    if (
      reportType ===
      "attendance"
    ) {
      return filteredData.map(
        (item) => [
          formatDate(
            item.date
          ),
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
    // PRODUCTION
    // ===================================================

    if (
      reportType ===
      "production"
    ) {
      return filteredData.map(
        (item) => [
          formatDate(
            item.date
          ),
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
    // DEPARTMENT
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

    if (rows.length === 0) {
      alert(
        "No records found for CSV."
      );

      return;
    }

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
      csvRows.join("\n");

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

  const downloadExcel = () => {
    const headers =
      reports[
        reportType
      ].columns;

    const rows =
      getRows();

    if (rows.length === 0) {
      alert(
        "No records found for Excel."
      );

      return;
    }

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
  // EMPLOYEE A3 PDF
  // WORKER DETAILS FORMAT
  // =====================================================

  const downloadEmployeePDF = () => {
  if (!filteredData.length) {
    alert("No employees available for PDF.");
    return;
  }

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a3",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // ============================================================
  // CENTER THE COMPLETE REPORT ON A3 PAGE
  // ============================================================

  const reportWidth = 350;
  const reportHeight = 190;

  const reportX = (pageWidth - reportWidth) / 2;
  const reportY = (pageHeight - reportHeight) / 2;

  const left = reportX + 8;
  const right = reportX + reportWidth - 8;
  const width = right - left;

  // ============================================================
  // HELPERS
  // ============================================================

  const textValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    return String(value);
  };

  const fullName = (employee) => {
    const first = employee?.first_name
      ? String(employee.first_name).trim()
      : "";

    const last = employee?.last_name
      ? String(employee.last_name).trim()
      : "";

    return `${first} ${last}`.trim() || "-";
  };

  const employmentType = (employee) => {
    return (
      employee?.employment_type_ ??
      employee?.employment_type ??
      employee?.employmentType ??
      "-"
    );
  };

  const dateValue = (value) => {
    if (!value) return "-";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("en-GB");
  };

  const salaryValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "-";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return String(value);
    }

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fitText = (
    value,
    maxWidth,
    maxLines = 2
  ) => {
    const lines = doc.splitTextToSize(
      textValue(value),
      maxWidth
    );

    if (lines.length <= maxLines) {
      return lines;
    }

    const result = lines.slice(0, maxLines);

    let last = result[maxLines - 1];

    if (last.length > 4) {
      last = last.substring(
        0,
        last.length - 4
      ) + "...";
    }

    result[maxLines - 1] = last;

    return result;
  };

  // ============================================================
  // DRAW SIMPLE FIELD
  //
  // No large horizontal line through the report.
  // Each field has its own small bottom separator.
  // ============================================================

  const drawField = (
    label,
    value,
    x,
    y,
    fieldWidth
  ) => {
    const labelWidth = 32;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.setFontSize(7);

    doc.setTextColor(
      30,
      30,
      30
    );

    doc.text(
      label,
      x,
      y
    );

    doc.setFont(
      "helvetica",
      "normal"
    );

    doc.setFontSize(8);

    const valueLines = fitText(
      value,
      fieldWidth - labelWidth - 3,
      2
    );

    doc.text(
      valueLines,
      x + labelWidth,
      y,
      {
        lineHeightFactor: 1.1,
      }
    );

    // Small separator belonging ONLY to this field
    doc.setLineWidth(0.18);

    doc.setDrawColor(
      150,
      150,
      150
    );

    doc.line(
      x,
      y + 3,
      x + fieldWidth,
      y + 3
    );
  };

  // ============================================================
  // EACH EMPLOYEE = ONE PAGE
  // ============================================================

  filteredData.forEach(
    (employee, index) => {
      if (index > 0) {
        doc.addPage();
      }

      // ========================================================
      // BASIC PDF SETTINGS
      // ========================================================

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setTextColor(
        30,
        30,
        30
      );

      doc.setDrawColor(
        90,
        90,
        90
      );

      // ========================================================
      // OUTER REPORT BORDER
      // ========================================================

      doc.setLineWidth(0.45);

      doc.rect(
        reportX,
        reportY,
        reportWidth,
        reportHeight
      );

      // ========================================================
      // HEADER
      // ========================================================

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(15);

      doc.text(
        "EMPLOYEE DETAILS",
        pageWidth / 2,
        reportY + 10,
        {
          align: "center",
        }
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(7);

      doc.text(
        `On ${formatDate(new Date())}`,
        right,
        reportY + 17,
        {
          align: "right",
        }
      );

      // ========================================================
      // HEADER LINE
      // ========================================================

      const headerLineY =
        reportY + 22;

      doc.setLineWidth(0.3);

      doc.line(
        left,
        headerLineY,
        right,
        headerLineY
      );

      // ========================================================
      // TOP INFORMATION AREA
      // ========================================================

      const columnGap = 18;

      const columnWidth =
        (width - columnGap) / 2;

      const leftX = left;

      const rightX =
        left +
        columnWidth +
        columnGap;

      let leftY =
        headerLineY + 9;

      let rightY =
        headerLineY + 9;

      const rowGap = 12;

      // --------------------------------------------------------
      // LEFT SIDE
      // --------------------------------------------------------

      drawField(
        "Employee ID",
        employee.emp_id,
        leftX,
        leftY,
        columnWidth
      );

      leftY += rowGap;

      drawField(
        "Name",
        fullName(employee),
        leftX,
        leftY,
        columnWidth
      );

      leftY += rowGap;

      drawField(
        "Gender",
        employee.gender,
        leftX,
        leftY,
        columnWidth
      );

      leftY += rowGap;

      drawField(
        "Phone",
        employee.phone,
        leftX,
        leftY,
        columnWidth
      );

      leftY += rowGap;

      drawField(
        "Email",
        employee.email,
        leftX,
        leftY,
        columnWidth
      );

      // --------------------------------------------------------
      // RIGHT SIDE
      // --------------------------------------------------------

      drawField(
        "Date of Birth",
        dateValue(
          employee.date_of_birth
        ),
        rightX,
        rightY,
        columnWidth
      );

      rightY += rowGap;

      drawField(
        "Joining Date",
        dateValue(
          employee.joining_date
        ),
        rightX,
        rightY,
        columnWidth
      );

      rightY += rowGap;

      drawField(
        "Department",
        employee.department,
        rightX,
        rightY,
        columnWidth
      );

      rightY += rowGap;

      drawField(
        "Designation",
        employee.designation,
        rightX,
        rightY,
        columnWidth
      );

      rightY += rowGap;

      drawField(
        "Employment Type",
        employmentType(employee),
        rightX,
        rightY,
        columnWidth
      );

      rightY += rowGap;

      drawField(
        "Status",
        employee.status,
        rightX,
        rightY,
        columnWidth
      );

      // ========================================================
      // IMPORTANT FIX
      //
      // The separator is positioned AFTER the RIGHT COLUMN.
      // It can therefore NEVER cross Status or another field.
      // ========================================================

      const informationBottom =
        Math.max(
          leftY,
          rightY
        );

      const separatorY =
        informationBottom + 5;

      doc.setLineWidth(0.35);

      doc.line(
        left,
        separatorY,
        right,
        separatorY
      );

      // ========================================================
      // ADDRESS SECTION
      // ========================================================

      const addressTitleY =
        separatorY + 8;

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(8);

      doc.text(
        "Address",
        left,
        addressTitleY
      );

      const addressY =
        addressTitleY + 5;

      const addressHeight = 22;

      doc.setLineWidth(0.25);

      doc.rect(
        left,
        addressY,
        width,
        addressHeight
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(6.5);

      doc.text(
        "Address",
        left + 3,
        addressY + 5
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(8);

      const addressLines =
        fitText(
          employee.address,
          width - 6,
          3
        );

      doc.text(
        addressLines,
        left + 3,
        addressY + 11,
        {
          lineHeightFactor: 1.15,
        }
      );

      // ========================================================
      // ========================================================
// LAST WORKING DETAILS
// ========================================================

const lastWorkingTitleY =
  addressY + 13;

doc.setFont(
  "helvetica",
  "bold"
);

doc.setFontSize(8);

doc.text(
  "Last Working Details",
  pageWidth / 2,
  lastWorkingTitleY,
  {
    align: "center",
  }
);

// ========================================================
// LAST WORKING DETAILS TABLE
// ========================================================

const tableY =
  lastWorkingTitleY + 4;

// Available width inside report
const tableWidth = width;

// IMPORTANT:
// Total column widths = 334mm or less.
// This prevents the table from crossing the report margin.
autoTable(doc, {
  startY: tableY,

  margin: {
    left: left,
    right: pageWidth - right,
  },

  tableWidth: tableWidth,

  head: [
    [
      "Date",
      "Department",
      "Mill",
      "RShift",
      "WShift",
      "Hours",
      "Working Status",
    ],
  ],

  body: [
    [
      // Available backend data
      dateValue(
        employee.joining_date
      ),

      textValue(
        employee.department
      ),

      // These fields are not currently
      // available in your backend.
      "-",

      "-",

      "-",

      "-",

      // Existing employee status
      textValue(
        employee.status
      ),
    ],
  ],

  theme: "grid",

  styles: {
    font: "helvetica",
    fontSize: 6.5,

    textColor: [
      30,
      30,
      30,
    ],

    lineColor: [
      100,
      100,
      100,
    ],

    lineWidth: 0.25,

    cellPadding: 2,

    valign: "middle",
    halign: "center",

    overflow: "linebreak",
  },

  headStyles: {
    font: "helvetica",
    fontStyle: "bold",

    fontSize: 6.5,

    fillColor: [
      245,
      245,
      245,
    ],

    textColor: [
      30,
      30,
      30,
    ],

    halign: "center",
    valign: "middle",

    lineColor: [
      100,
      100,
      100,
    ],

    lineWidth: 0.25,
  },

  bodyStyles: {
    fontSize: 6.5,

    halign: "center",
    valign: "middle",

    minCellHeight: 9,

    lineColor: [
      100,
      100,
      100,
    ],

    lineWidth: 0.25,
  },

  // ======================================================
  // TOTAL = 334mm
  // EXACTLY FITS THE AVAILABLE REPORT CONTENT WIDTH
  // ======================================================

  columnStyles: {
    0: {
      cellWidth: 40, // Date
    },

    1: {
      cellWidth: 55, // Department
    },

    2: {
      cellWidth: 45, // Mill
    },

    3: {
      cellWidth: 40, // RShift
    },

    4: {
      cellWidth: 40, // WShift
    },

    5: {
      cellWidth: 45, // Hours
    },

    6: {
      cellWidth: 69, // Working Status
    },
  },
});

      // FOOTER
      // ========================================================

      const finalY =
        doc.lastAutoTable?.finalY ||
        tableY + 15;

      const footerY =
        Math.min(
          finalY + 7,
          reportY +
            reportHeight -
            4
        );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(6.5);

      doc.text(
        "Employee Record",
        left,
        footerY
      );

      doc.text(
        `Page ${index + 1} of ${
          filteredData.length
        }`,
        right,
        footerY,
        {
          align: "right",
        }
      );
    }
  );

  // ============================================================
  // SAVE
  // ============================================================

  doc.save(
    "employee-details-A3.pdf"
  );
};
  // =====================================================
  // NORMAL PDF FOR OTHER REPORTS
  // =====================================================

  const downloadNormalPDF = () => {
    const headers =
      reports[
        reportType
      ].columns;

    const rows =
      getRows();

    if (rows.length === 0) {
      alert(
        "No records found for PDF."
      );

      return;
    }

    const isWide =
      headers.length > 7;

    const doc =
      new jsPDF({
        orientation:
          isWide
            ? "landscape"
            : "portrait",

        unit:
          "mm",

        format:
          "a4",
      });

    // =================================================
    // TITLE
    // =================================================

    doc.setFont(
      "helvetica",
      "bold"
    );

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

    doc.setFont(
      "helvetica",
      "normal"
    );

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
      `Department: ${department}`;

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
      search.trim() !== ""
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
        startY:
          45,

        head: [
          headers,
        ],

        body:
          rows,

        theme:
          "grid",

        styles: {
          fontSize:
            7,

          cellPadding:
            2,

          textColor: [
            30,
            30,
            30,
          ],

          lineColor: [
            100,
            100,
            100,
          ],

          lineWidth:
            0.2,
        },

        headStyles: {
          fontSize:
            7,

          fontStyle:
            "bold",

          textColor: [
            20,
            20,
            20,
          ],

          fillColor: [
            240,
            240,
            240,
          ],

          lineColor: [
            100,
            100,
            100,
          ],
        },

        alternateRowStyles: {
          fillColor: [
            255,
            255,
            255,
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
      doc.setPage(i);

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(
        8
      );

      doc.text(
        `Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize
          .height - 8
      );
    }

    // =================================================
    // SAVE
    // =================================================

    doc.save(
      `${reportType}-report.pdf`
    );
  };

  // =====================================================
  // PDF MAIN FUNCTION
  // ONLY ONE downloadPDF FUNCTION
  // =====================================================

  const downloadPDF = () => {
    if (
      reportType ===
      "employee"
    ) {
      downloadEmployeePDF();

      return;
    }

    downloadNormalPDF();
  };

  // =====================================================
  // CHANGE REPORT TYPE
  // =====================================================

  const changeReportType = (
    type
  ) => {
    setReportType(type);

    setSearch("");

    setDepartment(
      "All Departments"
    );

    setFromDate("");

    setToDate("");
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="reports-page">

      {/* =================================================
          HEADER
      ================================================= */}

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

      {/* =================================================
          REPORT TABS
      ================================================= */}

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

              onClick={() =>
                changeReportType(
                  tab.id
                )
              }
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

          )
        )}

      </div>

      {/* =================================================
          FILTER CARD
      ================================================= */}

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

        {/* =================================================
            FILTER GRID
        ================================================= */}

        <div className="report-filter-grid">

          {/* FROM DATE */}

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

              onChange={(e) =>
                setFromDate(
                  e.target.value
                )
              }
            />

          </div>

          {/* TO DATE */}

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

              onChange={(e) =>
                setToDate(
                  e.target.value
                )
              }
            />

          </div>

          {/* DEPARTMENT */}

          <div className="report-filter-group">

            <label>
              Department
            </label>

            <select
              value={
                department
              }

              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >

              <option value="All Departments">
                All Departments
              </option>

              {reportType ===
              "employee" ? (

                employeeDepartments.map(
                  (dept) => (

                    <option
                      key={
                        dept
                      }

                      value={
                        dept
                      }
                    >
                      {dept}
                    </option>

                  )
                )

              ) : (

                <>

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

                </>

              )}

            </select>

          </div>

          {/* SEARCH */}

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

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

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
            {employeeError}
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

      {/* =================================================
          REPORT PREVIEW
      ================================================= */}

      <div className="report-preview-card">

        {/* =================================================
            PREVIEW HEADER
        ================================================= */}

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

          {/* =================================================
              DOWNLOAD BUTTONS
          ================================================= */}

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

        {/* =================================================
            EMPLOYEE PDF NOTE
        ================================================= */}

        {reportType ===
          "employee" && (

          <div
            style={{
              margin:
                "0 20px 15px",

              padding:
                "10px 14px",

              borderRadius:
                "8px",

              background:
                "#f5f5f5",

              border:
                "1px solid #dddddd",

              color:
                "#444444",

              fontSize:
                "13px",
            }}
          >

            <strong>
              Employee PDF:
            </strong>{" "}

            A3 Landscape,
            centered Worker
            Details format using
            employee database
            information.

          </div>

        )}

        {/* =================================================
            REPORT TABLE
        ================================================= */}

        <div className="report-table-wrapper">

          <table className="report-table">

            <thead>

              <tr>

                {reports[
                  reportType
                ].columns.map(
                  (column) => (

                    <th
                      key={
                        column
                      }
                    >
                      {column}
                    </th>

                  )
                )}

              </tr>

            </thead>

            <tbody>

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
                    data from backend...
                  </td>

                </tr>

              ) : employeeError &&
                reportType ===
                  "employee" ? (

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

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="report-footer">

          <span>
            Total Records:{" "}

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