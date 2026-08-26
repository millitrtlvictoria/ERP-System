import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/attendance.css";

function Attendance() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [shift, setShift] = useState("All Shifts");
  const [status, setStatus] = useState("All Status");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      empId: "EMP001",
      name: "Rahul Kumar",
      department: "SPINNING",
      shift: "A",
      date: "17 Aug 2026",
      inTime: "08:02 AM",
      outTime: "05:04 PM",
      hours: "8.9",
      status: "Present",
    },
    {
      id: 2,
      empId: "EMP002",
      name: "Amit Das",
      department: "WEAVING-Rapier",
      shift: "A",
      date: "17 Aug 2026",
      inTime: "08:15 AM",
      outTime: "05:10 PM",
      hours: "8.8",
      status: "Late",
    },
    {
      id: 3,
      empId: "EMP003",
      name: "Sanjay Roy",
      department: "WEAVING-S4",
      shift: "B",
      date: "17 Aug 2026",
      inTime: "04:00 PM",
      outTime: "12:05 AM",
      hours: "8.1",
      status: "Present",
    },
    {
      id: 4,
      empId: "EMP004",
      name: "Priya Sharma",
      department: "SPINNING",
      shift: "A",
      date: "17 Aug 2026",
      inTime: "--",
      outTime: "--",
      hours: "0",
      status: "Absent",
    },
    {
      id: 5,
      empId: "EMP005",
      name: "Neha Singh",
      department: "WEAVING-Rapier",
      shift: "C",
      date: "17 Aug 2026",
      inTime: "12:04 PM",
      outTime: "08:05 PM",
      hours: "7.9",
      status: "Present",
    },
    {
      id: 6,
      empId: "EMP006",
      name: "Arjun Paul",
      department: "WEAVING-S4",
      shift: "B",
      date: "17 Aug 2026",
      inTime: "--",
      outTime: "--",
      hours: "0",
      status: "Leave",
    },
  ]);

  const filteredData = attendanceData.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.empId.toLowerCase().includes(searchValue) ||
      item.name.toLowerCase().includes(searchValue) ||
      item.department.toLowerCase().includes(searchValue);

    const matchesDepartment =
      department === "All Departments" ||
      item.department === department;

    const matchesShift =
      shift === "All Shifts" ||
      item.shift === shift;

    const matchesStatus =
      status === "All Status" ||
      item.status === status;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesShift &&
      matchesStatus
    );
  });

  const totalEmployees = attendanceData.length;

  const presentCount = attendanceData.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendanceData.filter(
    (item) => item.status === "Absent"
  ).length;

  const leaveCount = attendanceData.filter(
    (item) => item.status === "Leave"
  ).length;

  const lateCount = attendanceData.filter(
    (item) => item.status === "Late"
  ).length;

  const attendancePercentage =
    totalEmployees > 0
      ? (((presentCount + lateCount) / totalEmployees) * 100).toFixed(1)
      : "0.0";

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setShift("All Shifts");
    setStatus("All Status");
    setFromDate("");
    setToDate("");
  };

  const markPresent = (id) => {
    setAttendanceData((previousData) =>
      previousData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Present",
              inTime: "08:00 AM",
              outTime: "05:00 PM",
              hours: "9.0",
            }
          : item
      )
    );
  };

  const markAbsent = (id) => {
    setAttendanceData((previousData) =>
      previousData.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Absent",
              inTime: "--",
              outTime: "--",
              hours: "0",
            }
          : item
      )
    );
  };

  const getStatusClass = (itemStatus) => {
    if (itemStatus === "Present") return "present";
    if (itemStatus === "Absent") return "absent";
    if (itemStatus === "Late") return "late";
    if (itemStatus === "Leave") return "leave";

    return "";
  };

  return (
    <div className="attendance-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="attendance-header">

        <div className="attendance-header-left">

          <button
            className="attendance-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Attendance Management</h1>

          <p>
            Monitor employee attendance, working hours,
            late arrivals and leave records.
          </p>

        </div>

        <div className="attendance-header-actions">

          <button className="attendance-export-btn">
            ↓ Export
          </button>

          <button
            className="attendance-refresh-btn"
            onClick={() => window.location.reload()}
          >
            ↻ Refresh
          </button>

        </div>

      </div>


      {/* =========================================
          SUMMARY CARDS
      ========================================= */}

      <div className="attendance-summary">

        <div className="attendance-summary-card">

          <div className="attendance-summary-icon blue">
            👥
          </div>

          <div>
            <span>Total Employees</span>
            <h2>{totalEmployees}</h2>
            <small>Registered employees</small>
          </div>

        </div>


        <div className="attendance-summary-card">

          <div className="attendance-summary-icon green">
            ✓
          </div>

          <div>
            <span>Present</span>
            <h2>{presentCount}</h2>
            <small>Employees present</small>
          </div>

        </div>


        <div className="attendance-summary-card">

          <div className="attendance-summary-icon red">
            !
          </div>

          <div>
            <span>Absent</span>
            <h2>{absentCount}</h2>
            <small>Employees absent</small>
          </div>

        </div>


        <div className="attendance-summary-card">

          <div className="attendance-summary-icon orange">
            ⏰
          </div>

          <div>
            <span>Late</span>
            <h2>{lateCount}</h2>
            <small>Late arrivals</small>
          </div>

        </div>


        <div className="attendance-summary-card">

          <div className="attendance-summary-icon purple">
            📅
          </div>

          <div>
            <span>On Leave</span>
            <h2>{leaveCount}</h2>
            <small>Employees on leave</small>
          </div>

        </div>


        <div className="attendance-summary-card">

          <div className="attendance-summary-icon teal">
            📊
          </div>

          <div>
            <span>Attendance Rate</span>
            <h2>{attendancePercentage}%</h2>
            <small>Current attendance</small>
          </div>

        </div>

      </div>


      {/* =========================================
          FILTER SECTION
      ========================================= */}

      <div className="attendance-filter-card">

        <div className="attendance-filter-header">

          <div>
            <h2>Attendance Records</h2>

            <p>
              Search and filter employee attendance records.
            </p>
          </div>

          <button
            className="attendance-clear-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        <div className="attendance-filter-grid">

          <div className="attendance-filter-group">

            <label>From Date</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

          </div>


          <div className="attendance-filter-group">

            <label>To Date</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

          </div>


          <div className="attendance-filter-group">

            <label>Department</label>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option>All Departments</option>
              <option>SPINNING</option>
              <option>WEAVING-Rapier</option>
              <option>WEAVING-S4</option>
            </select>

          </div>


          <div className="attendance-filter-group">

            <label>Shift</label>

            <select
              value={shift}
              onChange={(e) => setShift(e.target.value)}
            >
              <option>All Shifts</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>

          </div>


          <div className="attendance-filter-group">

            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All Status</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
              <option>Leave</option>
            </select>

          </div>


          <div className="attendance-filter-group attendance-search-group">

            <label>Search Employee</label>

            <div className="attendance-search-box">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Employee ID, name or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          ATTENDANCE TABLE
      ========================================= */}

      <div className="attendance-table-card">

        <div className="attendance-table-header">

          <div>

            <h2>Daily Attendance</h2>

            <p>
              Showing {filteredData.length} attendance records
            </p>

          </div>


          <div className="attendance-table-actions">

            <button className="attendance-table-export">
              PDF
            </button>

            <button className="attendance-table-export">
              Excel
            </button>

            <button className="attendance-table-export">
              CSV
            </button>

          </div>

        </div>


        <div className="attendance-table-wrapper">

          <table className="attendance-table">

            <thead>

              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Hours</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item) => (

                  <tr key={item.id}>

                    <td>

                      <div className="attendance-employee">

                        <div className="attendance-avatar">
                          {item.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .substring(0, 2)}
                        </div>

                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.empId}</small>
                        </div>

                      </div>

                    </td>


                    <td>
                      <span className="attendance-department">
                        {item.department}
                      </span>
                    </td>


                    <td>

                      <span className="attendance-shift">
                        Shift {item.shift}
                      </span>

                    </td>


                    <td>
                      {item.date}
                    </td>


                    <td>
                      {item.inTime}
                    </td>


                    <td>
                      {item.outTime}
                    </td>


                    <td>

                      <strong>
                        {item.hours} hrs
                      </strong>

                    </td>


                    <td>

                      <span
                        className={`attendance-status ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>

                    </td>


                    <td>

                      <div className="attendance-action-buttons">

                        <button
                          className="mark-present-btn"
                          onClick={() => markPresent(item.id)}
                          title="Mark Present"
                        >
                          ✓
                        </button>

                        <button
                          className="mark-absent-btn"
                          onClick={() => markAbsent(item.id)}
                          title="Mark Absent"
                        >
                          ✕
                        </button>

                        <button
                          className="attendance-view-btn"
                          onClick={() =>
                            alert(
                              `Viewing attendance of ${item.name}`
                            )
                          }
                        >
                          View
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="attendance-no-data"
                  >
                    No attendance records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* =========================================
            FOOTER
        ========================================= */}

        <div className="attendance-table-footer">

          <span>
            Showing {filteredData.length} records
          </span>

          <div className="attendance-pagination">

            <button>‹</button>

            <button className="attendance-page-active">
              1
            </button>

            <button>2</button>

            <button>3</button>

            <button>›</button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Attendance;
