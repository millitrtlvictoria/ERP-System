import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ViewProduction.css";

function Production() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [shift, setShift] = useState("All Shifts");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const productionData = [
    {
      id: 1,
      date: "17 Aug 2026",
      department: "SPINNING",
      shift: "A",
      production: "916.82",
      target: "1000",
      efficiency: "91.68%",
      hpt: "4.82",
      status: "Good",
    },
    {
      id: 2,
      date: "17 Aug 2026",
      department: "WEAVING-Rapier",
      shift: "A",
      production: "842.50",
      target: "900",
      efficiency: "93.61%",
      hpt: "4.56",
      status: "Excellent",
    },
    {
      id: 3,
      date: "17 Aug 2026",
      department: "WEAVING-S4",
      shift: "B",
      production: "785.40",
      target: "850",
      efficiency: "92.40%",
      hpt: "4.31",
      status: "Good",
    },
    {
      id: 4,
      date: "16 Aug 2026",
      department: "SPINNING",
      shift: "B",
      production: "875.30",
      target: "950",
      efficiency: "92.14%",
      hpt: "4.72",
      status: "Good",
    },
    {
      id: 5,
      date: "16 Aug 2026",
      department: "WEAVING-Rapier",
      shift: "C",
      production: "810.20",
      target: "900",
      efficiency: "90.02%",
      hpt: "4.48",
      status: "Average",
    },
  ];

  const filteredData = productionData.filter((item) => {
    const matchesSearch =
      item.department
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.date.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All Departments" ||
      item.department === department;

    const matchesShift =
      shift === "All Shifts" ||
      item.shift === shift;

    return matchesSearch && matchesDepartment && matchesShift;
  });

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setShift("All Shifts");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="production-page">

      {/* PAGE HEADER */}
      <div className="production-header">

        <div>
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Production View</h1>

          <p>
            Monitor daily production, targets and efficiency
            across all departments.
          </p>
        </div>

        <div className="production-actions">
          <button className="export-btn">
            ↓ Export
          </button>

          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
          >
            ↻ Refresh
          </button>
        </div>

      </div>


      {/* SUMMARY CARDS */}
      <div className="production-stats">

        <div className="production-stat-card">

          <div className="production-stat-icon blue">
            📦
          </div>

          <div>
            <span>Total Production</span>
            <h2>4,230.22</h2>
            <small>MT this period</small>
          </div>

        </div>


        <div className="production-stat-card">

          <div className="production-stat-icon green">
            🎯
          </div>

          <div>
            <span>Target Production</span>
            <h2>4,600.00</h2>
            <small>MT target</small>
          </div>

        </div>


        <div className="production-stat-card">

          <div className="production-stat-icon purple">
            📈
          </div>

          <div>
            <span>Average Efficiency</span>
            <h2>91.97%</h2>
            <small className="positive">
              ↑ 2.4% from last period
            </small>
          </div>

        </div>


        <div className="production-stat-card">

          <div className="production-stat-icon orange">
            ⚙️
          </div>

          <div>
            <span>Average HPT</span>
            <h2>4.58</h2>
            <small>Hours per ton</small>
          </div>

        </div>

      </div>


      {/* FILTER SECTION */}
      <div className="filter-card">

        <div className="filter-header">

          <div>
            <h2>Production Records</h2>
            <p>Filter production data by date, department and shift.</p>
          </div>

          <button
            className="clear-filter"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        <div className="filter-grid">

          <div className="filter-group">

            <label>From Date</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

          </div>


          <div className="filter-group">

            <label>To Date</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

          </div>


          <div className="filter-group">

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


          <div className="filter-group">

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


          <div className="filter-group search-group">

            <label>Search</label>

            <div className="search-box">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

          </div>

        </div>

      </div>


      {/* TABLE */}
      <div className="production-table-card">

        <div className="table-top">

          <div>
            <h2>Production Details</h2>

            <p>
              Showing {filteredData.length} production records
            </p>
          </div>

          <div className="table-actions">

            <button className="table-export">
              Excel
            </button>

            <button className="table-export">
              CSV
            </button>

          </div>

        </div>


        <div className="table-wrapper">

          <table className="production-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Department</th>
                <th>Shift</th>
                <th>Production</th>
                <th>Target</th>
                <th>Efficiency</th>
                <th>HPT</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredData.length > 0 ? (

                filteredData.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <strong>{item.date}</strong>
                    </td>

                    <td>

                      <div className="department-cell">

                        <div className="department-avatar">
                          {item.department.charAt(0)}
                        </div>

                        <span>
                          {item.department}
                        </span>

                      </div>

                    </td>

                    <td>
                      <span className="shift-badge">
                        Shift {item.shift}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {item.production}
                      </strong>{" "}
                      MT
                    </td>

                    <td>
                      {item.target} MT
                    </td>

                    <td>

                      <div className="efficiency-cell">

                        <strong>
                          {item.efficiency}
                        </strong>

                        <div className="mini-progress">

                          <div
                            style={{
                              width: item.efficiency,
                            }}
                          ></div>

                        </div>

                      </div>

                    </td>

                    <td>
                      {item.hpt}
                    </td>

                    <td>

                      <span
                        className={`production-status ${
                          item.status === "Excellent"
                            ? "excellent"
                            : item.status === "Good"
                            ? "good"
                            : "average"
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="view-production-btn"
                        onClick={() =>
                          alert(
                            `Viewing production record ${item.id}`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    className="no-production"
                  >
                    No production records found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        {/* TABLE FOOTER */}
        <div className="table-footer">

          <span>
            Showing {filteredData.length} records
          </span>

          <div className="pagination">

            <button>‹</button>

            <button className="page-active">
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

export default Production;
