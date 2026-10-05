import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ViewProduction.css";

const productionData = [
  {
    date: "17 Aug 2026",
    department: "SPINNING",
    shift: "A",
    production: 916.82,
    target: 1000,
    efficiency: 91.68,
    hpt: 4.82,
    status: "Good",
  },
  {
    date: "17 Aug 2026",
    department: "WEAVING-Rapier",
    shift: "A",
    production: 842.5,
    target: 900,
    efficiency: 93.61,
    hpt: 4.56,
    status: "Excellent",
  },
  {
    date: "17 Aug 2026",
    department: "WEAVING-S4",
    shift: "B",
    production: 785.4,
    target: 850,
    efficiency: 92.4,
    hpt: 4.31,
    status: "Good",
  },
  {
    date: "16 Aug 2026",
    department: "SPINNING",
    shift: "B",
    production: 875.3,
    target: 950,
    efficiency: 92.14,
    hpt: 4.72,
    status: "Good",
  },
  {
    date: "16 Aug 2026",
    department: "WEAVING-Rapier",
    shift: "C",
    production: 810.2,
    target: 900,
    efficiency: 90.02,
    hpt: 4.48,
    status: "Average",
  },
];

function Production() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [shift, setShift] = useState("All Shifts");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setShift("All Shifts");
    setFromDate("");
    setToDate("");
  };

  const filteredData = productionData.filter((item) => {
    const matchesSearch =
      search === "" ||
      item.department.toLowerCase().includes(search.toLowerCase()) ||
      item.shift.toLowerCase().includes(search.toLowerCase()) ||
      item.status.toLowerCase().includes(search.toLowerCase());

    const matchesDepartment =
      department === "All Departments" ||
      item.department === department;

    const matchesShift =
      shift === "All Shifts" ||
      item.shift === shift;

    const itemDate = new Date(item.date);
    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;

    const matchesFromDate =
      !startDate || itemDate >= startDate;

    const matchesToDate =
      !endDate || itemDate <= endDate;

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesShift &&
      matchesFromDate &&
      matchesToDate
    );
  });

  /*
   * =========================================================
   * SUMMARY DATA
   * =========================================================
   */

  const totalProduction = filteredData.reduce(
    (sum, item) => sum + item.production,
    0
  );

  const totalTarget = filteredData.reduce(
    (sum, item) => sum + item.target,
    0
  );

  const averageEfficiency =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, item) => sum + item.efficiency,
          0
        ) / filteredData.length
      : 0;

  const averageHpt =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, item) => sum + item.hpt,
          0
        ) / filteredData.length
      : 0;

  /*
   * =========================================================
   * DEPARTMENT CHART DATA
   * =========================================================
   */

  const departments = [
    "SPINNING",
    "WEAVING-Rapier",
    "WEAVING-S4",
  ];

  const departmentChartData = departments.map((dept) => {
    const rows = filteredData.filter(
      (item) => item.department === dept
    );

    const production = rows.reduce(
      (sum, item) => sum + item.production,
      0
    );

    const target = rows.reduce(
      (sum, item) => sum + item.target,
      0
    );

    const efficiency =
      rows.length > 0
        ? rows.reduce(
            (sum, item) => sum + item.efficiency,
            0
          ) / rows.length
        : 0;

    return {
      dept,
      production,
      target,
      efficiency,
    };
  });

  /*
   * =========================================================
   * SHIFT CHART DATA
   * =========================================================
   */

  const shifts = ["A", "B", "C"];

  const shiftChartData = shifts.map((shiftName) => {
    const rows = filteredData.filter(
      (item) => item.shift === shiftName
    );

    return {
      shift: shiftName,
      production: rows.reduce(
        (sum, item) => sum + item.production,
        0
      ),
    };
  });

  const maxShiftProduction = Math.max(
    ...shiftChartData.map((item) => item.production),
    1
  );

  /*
   * =========================================================
   * STATUS CHART DATA
   * =========================================================
   */

  const statuses = [
    "Excellent",
    "Good",
    "Average",
  ];

  const statusChartData = statuses.map((status) => ({
    status,
    count: filteredData.filter(
      (item) => item.status === status
    ).length,
  }));

  const maxStatusCount = Math.max(
    ...statusChartData.map((item) => item.count),
    1
  );

  /*
   * =========================================================
   * PRODUCTION DISTRIBUTION
   * =========================================================
   */

  const maxDepartmentProduction = Math.max(
    ...departmentChartData.map(
      (item) => item.production
    ),
    1
  );

  /*
   * =========================================================
   * PIE CHART DATA
   * =========================================================
   */

  const piePercentage0 =
    totalProduction > 0
      ? (departmentChartData[0].production /
          totalProduction) *
        100
      : 0;

  const piePercentage1 =
    totalProduction > 0
      ? (departmentChartData[1].production /
          totalProduction) *
        100
      : 0;

  const pieStop1 = piePercentage0;
  const pieStop2 =
    piePercentage0 + piePercentage1;

  const pieGradient =
    totalProduction > 0
      ? `conic-gradient(
          #19d4e5 0% ${pieStop1}%,
          #8b5cf6 ${pieStop1}% ${pieStop2}%,
          #f97316 ${pieStop2}% 100%
        )`
      : "conic-gradient(#243447 0% 100%)";

  /*
   * =========================================================
   * BAR CHART DATA
   * =========================================================
   */

  const departmentBarData =
    departmentChartData.map((item) => ({
      department: item.dept,
      production: Number(
        item.production.toFixed(2)
      ),
      target: Number(
        item.target.toFixed(2)
      ),
    }));

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="production-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="production-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <h1>Production View</h1>

          <p>
            Monitor daily production, targets and
            efficiency across all departments.
          </p>
        </div>

        <div className="production-header-actions">
          <button className="export-button">
            Export
          </button>

          <button
            className="refresh-button"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="production-filters">

        <div className="filter-group">
          <label>Search</label>

          <input
            type="text"
            placeholder="Search production..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="filter-group">
          <label>Department</label>

          <select
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
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
            onChange={(e) =>
              setShift(e.target.value)
            }
          >
            <option>All Shifts</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={(e) =>
              setFromDate(e.target.value)
            }
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            onChange={(e) =>
              setToDate(e.target.value)
            }
          />
        </div>

        <button
          className="clear-filter-button"
          onClick={clearFilters}
        >
          Clear
        </button>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="production-summary">

        <div className="production-summary-card">
          <span>Total Production</span>
          <strong>
            {totalProduction.toFixed(2)}
          </strong>
          <small>MT</small>
        </div>

        <div className="production-summary-card">
          <span>Total Target</span>
          <strong>
            {totalTarget.toFixed(2)}
          </strong>
          <small>MT</small>
        </div>

        <div className="production-summary-card">
          <span>Average Efficiency</span>
          <strong>
            {averageEfficiency.toFixed(2)}%
          </strong>
          <small>Overall</small>
        </div>

        <div className="production-summary-card">
          <span>Average HPT</span>
          <strong>
            {averageHpt.toFixed(2)}
          </strong>
          <small>HPT</small>
        </div>

      </div>

      {/* =====================================================
          PRODUCTION ANALYTICS
      ===================================================== */}

      <section className="production-dashboard-charts">

        <div className="production-chart-heading">

          <div>
            <span className="chart-kicker">
              LIVE ANALYTICS
            </span>

            <h2>Production Analytics</h2>

            <p>
              Production performance across departments,
              shifts and targets.
            </p>
          </div>

          <span className="chart-live-badge">
            ● Live Data
          </span>

        </div>

        <div className="production-chart-grid">

          {/* =================================================
              1. PRODUCTION VS TARGET
          ================================================= */}

          <div className="production-chart-card chart-wide">

            <div className="chart-card-header">

              <div>
                <h3>Production vs Target</h3>
                <p>
                  Department production performance
                </p>
              </div>

              <div className="chart-header-icon cyan">
                ↗
              </div>

            </div>

            <div className="department-performance-chart">

              {departmentChartData.map((item) => {

                const targetPercentage =
                  item.target > 0
                    ? Math.min(
                        (item.production /
                          item.target) *
                          100,
                        100
                      )
                    : 0;

                return (
                  <div
                    className="department-chart-row"
                    key={item.dept}
                  >

                    <div className="department-chart-label">
                      <strong>{item.dept}</strong>

                      <span>
                        {item.production.toFixed(2)} /
                        {item.target.toFixed(2)} MT
                      </span>
                    </div>

                    <div className="department-chart-track">

                      <div
                        className="department-target-bar"
                      ></div>

                      <div
                        className="department-production-bar"
                        style={{
                          width: `${targetPercentage}%`,
                        }}
                      ></div>

                    </div>

                    <div className="department-chart-percent">
                      {targetPercentage.toFixed(1)}%
                    </div>

                  </div>
                );
              })}

            </div>

            <div className="chart-legend">

              <span>
                <i className="legend-production"></i>
                Production
              </span>

              <span>
                <i className="legend-target"></i>
                Target
              </span>

            </div>

          </div>

          {/* =================================================
              2. DEPARTMENT EFFICIENCY
          ================================================= */}

          <div className="production-chart-card">

            <div className="chart-card-header">

              <div>
                <h3>Department Efficiency</h3>
                <p>
                  Average efficiency by department
                </p>
              </div>

              <div className="chart-header-icon purple">
                %
              </div>

            </div>

            <div className="efficiency-chart">

              {departmentChartData.map((item) => {

                const efficiency =
                  Math.min(item.efficiency, 100);

                return (
                  <div
                    className="efficiency-chart-row"
                    key={item.dept}
                  >

                    <div className="efficiency-chart-top">
                      <span>{item.dept}</span>

                      <strong>
                        {item.efficiency.toFixed(2)}%
                      </strong>
                    </div>

                    <div className="efficiency-track">

                      <div
                        className="efficiency-fill"
                        style={{
                          width: `${efficiency}%`,
                        }}
                      ></div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* =================================================
              3. SHIFT-WISE PRODUCTION
          ================================================= */}

          <div className="production-chart-card">

            <div className="chart-card-header">

              <div>
                <h3>Shift-wise Production</h3>
                <p>
                  Production volume by shift
                </p>
              </div>

              <div className="chart-header-icon orange">
                ▥
              </div>

            </div>

            <div className="shift-chart">

              {shiftChartData.map((item) => {

                const height =
                  (item.production /
                    maxShiftProduction) *
                  100;

                return (
                  <div
                    className="shift-chart-item"
                    key={item.shift}
                  >

                    <span className="shift-value">
                      {item.production.toFixed(0)}
                    </span>

                    <div className="shift-bar-area">

                      <div
                        className="shift-bar"
                        style={{
                          height: `${height}%`,
                        }}
                      ></div>

                    </div>

                    <strong>
                      Shift {item.shift}
                    </strong>

                  </div>
                );
              })}

            </div>

          </div>

          {/* =================================================
              4. PRODUCTION STATUS
          ================================================= */}

          <div className="production-chart-card">

            <div className="chart-card-header">

              <div>
                <h3>Production Status</h3>
                <p>
                  Current production status distribution
                </p>
              </div>

              <div className="chart-header-icon green">
                ✓
              </div>

            </div>

            <div className="status-chart">

              {statusChartData.map((item) => {

                const width =
                  (item.count /
                    maxStatusCount) *
                  100;

                return (
                  <div
                    className="status-chart-row"
                    key={item.status}
                  >

                    <div className="status-chart-label">
                      <span>
                        {item.status}
                      </span>

                      <strong>
                        {item.count}
                      </strong>
                    </div>

                    <div className="status-chart-track">

                      <div
                        className={`status-chart-fill status-${item.status.toLowerCase()}`}
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>

                    </div>

                  </div>
                );
              })}

            </div>

          </div>

          {/* =================================================
              5. PRODUCTION DISTRIBUTION
          ================================================= */}

          <div className="production-chart-card">

            <div className="chart-card-header">

              <div>
                <h3>
                  Production Distribution
                </h3>

                <p>
                  Production contribution by department
                </p>
              </div>

              <div className="chart-header-icon blue">
                ◈
              </div>

            </div>

            <div className="distribution-chart">

              {departmentChartData.map((item) => {

                const width =
                  (item.production /
                    maxDepartmentProduction) *
                  100;

                return (
                  <div
                    className="distribution-row"
                    key={item.dept}
                  >

                    <div className="distribution-info">
                      <span>
                        {item.dept}
                      </span>

                      <strong>
                        {item.production.toFixed(2)} MT
                      </strong>
                    </div>

                    <div className="distribution-track">

                      <div
                        className="distribution-fill"
                        style={{
                          width: `${width}%`,
                        }}
                      ></div>

                    </div>

                    <span className="distribution-percent">
                      {width.toFixed(1)}%
                    </span>

                  </div>
                );
              })}

            </div>

          </div>

          {/* =================================================
              6. PRODUCTION SHARE — PIE CHART
          ================================================= */}

          <div className="production-chart-card">

            <div className="chart-card-header">

              <div>
                <h3>Production Share</h3>

                <p>
                  Production contribution by department
                </p>
              </div>

              <div className="chart-header-icon purple">
                ◔
              </div>

            </div>

            <div className="production-pie-chart">

              <div
                className="pie-chart"
                style={{
                  background: pieGradient,
                }}
              ></div>

              <div className="pie-center">
                <strong>
                  {totalProduction.toFixed(0)}
                </strong>

                <span>
                  MT Total
                </span>
              </div>

            </div>

            <div className="pie-legend">

              {departmentChartData.map(
                (item, index) => {

                  const percentage =
                    totalProduction > 0
                      ? (item.production /
                          totalProduction) *
                        100
                      : 0;

                  return (
                    <div
                      className="pie-legend-item"
                      key={item.dept}
                    >

                      <div className="pie-legend-left">

                        <span
                          className={`pie-dot pie-dot-${index}`}
                        ></span>

                        <span>
                          {item.dept}
                        </span>

                      </div>

                      <strong>
                        {percentage.toFixed(1)}%
                      </strong>

                    </div>
                  );
                }
              )}

            </div>

          </div>

          {/* =================================================
              7. TARGET VS ACTUAL — BAR CHART
          ================================================= */}

          <div className="production-chart-card chart-wide">

            <div className="chart-card-header">

              <div>
                <h3>Target vs Actual</h3>

                <p>
                  Department production comparison
                </p>
              </div>

              <div className="chart-header-icon orange">
                ▥
              </div>

            </div>

            <div className="target-bar-chart">

              {departmentBarData.map((item) => {

                const maxValue = Math.max(
                  item.target,
                  item.production,
                  1
                );

                const targetHeight =
                  (item.target /
                    maxValue) *
                  100;

                const actualHeight =
                  (item.production /
                    maxValue) *
                  100;

                return (
                  <div
                    className="target-bar-column"
                    key={item.department}
                  >

                    <div className="target-bar-values">
                      <span>
                        {item.production.toFixed(0)}
                      </span>
                    </div>

                    <div className="target-bar-area">

                      <div
                        className="target-bar"
                        style={{
                          height: `${targetHeight}%`,
                        }}
                        title={`Target: ${item.target} MT`}
                      ></div>

                      <div
                        className="actual-bar"
                        style={{
                          height: `${actualHeight}%`,
                        }}
                        title={`Actual: ${item.production} MT`}
                      ></div>

                    </div>

                    <span className="target-bar-label">
                      {item.department}
                    </span>

                  </div>
                );
              })}

            </div>

            <div className="bar-chart-legend">

              <span>
                <i className="bar-legend-target"></i>
                Target
              </span>

              <span>
                <i className="bar-legend-actual"></i>
                Actual
              </span>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCTION TABLE
      ===================================================== */}

      <section className="production-table-section">

        <div className="production-table-header">

          <div>
            <h2>Production Records</h2>

            <p>
              Showing {filteredData.length} production
              record
              {filteredData.length !== 1
                ? "s"
                : ""}
            </p>
          </div>

        </div>

        <div className="production-table-wrapper">

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
                filteredData.map((item, index) => (
                  <tr key={`${item.date}-${item.department}-${item.shift}-${index}`}>

                    <td>
                      {item.date}
                    </td>

                    <td>
                      {item.department}
                    </td>

                    <td>
                      {item.shift}
                    </td>

                    <td>
                      {item.production.toFixed(2)}
                    </td>

                    <td>
                      {item.target.toFixed(2)}
                    </td>

                    <td>
                      {item.efficiency.toFixed(2)}%
                    </td>

                    <td>
                      {item.hpt.toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`production-status production-status-${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="production-view-button"
                        onClick={() =>
                          alert(
                            `Viewing ${item.department} - Shift ${item.shift}`
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
                    className="no-production-data"
                  >
                    No production records found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

export default Production;