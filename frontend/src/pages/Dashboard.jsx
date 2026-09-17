import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar isOpen={sidebarOpen} />


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main
        className={`main-content ${
          sidebarOpen ? "" : "expanded"
        }`}
      >

        {/* ===================================================
            NAVBAR
        =================================================== */}

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />


        {/* ===================================================
            DASHBOARD CONTENT
        =================================================== */}

        <section className="content">


          {/* =================================================
              PAGE INTRO
          ================================================= */}

          <div className="dashboard-intro">

            <div>
              <div className="eyebrow">
                ERP ANALYTICS
              </div>

              <h1>
                Dashboard Overview
              </h1>

              <p>
                Monitor your ERP operations, employees and
                production performance.
              </p>
            </div>

            <div className="dashboard-date">
              📅 Today
            </div>

          </div>


          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="stats-grid">


            {/* TOTAL EMPLOYEES */}

            <div className="stat-card">

              <div className="stat-top">

                <div>
                  <p>Total Employees</p>

                  <h2>248</h2>
                </div>

                <div className="stat-icon cyan">
                  👥
                </div>

              </div>

              <div className="stat-change up">
                ↑ 8.2%
                <span> vs last month</span>
              </div>

            </div>


            {/* TODAY'S PRODUCTION */}

            <div className="stat-card">

              <div className="stat-top">

                <div>
                  <p>Today's Production</p>

                  <h2>9,840</h2>
                </div>

                <div className="stat-icon blue">
                  🏭
                </div>

              </div>

              <div className="stat-change up">
                ↑ 12.5%
                <span> vs yesterday</span>
              </div>

            </div>


            {/* AVERAGE EFFICIENCY */}

            <div className="stat-card">

              <div className="stat-top">

                <div>
                  <p>Average Efficiency</p>

                  <h2>91.8%</h2>
                </div>

                <div className="stat-icon green">
                  📈
                </div>

              </div>

              <div className="stat-change up">
                ↑ 3.4%
                <span> this month</span>
              </div>

            </div>


            {/* TODAY'S ATTENDANCE */}

            <div className="stat-card">

              <div className="stat-top">

                <div>
                  <p>Today's Attendance</p>

                  <h2>94.6%</h2>
                </div>

                <div className="stat-icon purple">
                  🕒
                </div>

              </div>

              <div className="stat-change down">
                ↓ 1.2%
                <span> vs yesterday</span>
              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="section-header">

            <div>
              <div className="section-kicker">
                SHORTCUTS
              </div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used ERP functions
              </p>
            </div>

          </div>


          <div className="quick-actions">


            {/* ADD EMPLOYEE */}

            <Link
              to="/add-employee"
              className="quick-action-button"
            >

              <span className="quick-icon cyan">
                👤
              </span>

              <div>
                <strong>
                  Add Employee
                </strong>

                <small>
                  Create new employee
                </small>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>


            {/* PRODUCTION */}

            <Link
              to="/view-production"
              className="quick-action-button"
            >

              <span className="quick-icon blue">
                📊
              </span>

              <div>
                <strong>
                  View Production
                </strong>

                <small>
                  Check today's production
                </small>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>


            {/* ATTENDANCE */}

            <Link
              to="/attendance"
              className="quick-action-button"
            >

              <span className="quick-icon green">
                📅
              </span>

              <div>
                <strong>
                  View Attendance
                </strong>

                <small>
                  View attendance
                </small>
              </div>

              <span className="quick-arrow">
                →
              </span>

            </Link>

          </div>


          {/* =================================================
              ANALYTICS ROW
          ================================================= */}

          <div className="analytics-grid">


            {/* =================================================
                MODE SHARE DONUT
            ================================================= */}

            <div className="analytics-card mode-share-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Mode Share Breakdown
                  </h2>

                  <p>
                    ERP workforce distribution by operational mode
                  </p>

                </div>

                <span className="period-badge">
                  2026
                </span>

              </div>


              <div className="donut-layout">

                <div className="donut-chart">

                  <div className="donut-ring">

                    <div className="donut-center">

                      <strong>
                        100%
                      </strong>

                      <span>
                        ERP USERS
                      </span>

                    </div>

                  </div>

                </div>


                <div className="donut-legend">

                  <div className="legend-item">

                    <span className="legend-dot cyan-bg"></span>

                    <span>
                      Production
                    </span>

                    <strong>
                      38%
                    </strong>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot orange-bg"></span>

                    <span>
                      Administration
                    </span>

                    <strong>
                      32%
                    </strong>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot green-bg"></span>

                    <span>
                      Operations
                    </span>

                    <strong>
                      18%
                    </strong>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot purple-bg"></span>

                    <span>
                      Support / Other
                    </span>

                    <strong>
                      12%
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                COMMUTE / PRODUCTION DISTRIBUTION
            ================================================= */}

            <div className="analytics-card duration-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Production Distribution
                  </h2>

                  <p>
                    Percentage of workforce production by daily output range
                  </p>

                </div>

                <span className="average-badge">
                  Avg: 9,840 Units
                </span>

              </div>


              <div className="duration-chart">

                <div className="chart-y-axis">

                  <span>
                    40%
                  </span>

                  <span>
                    30%
                  </span>

                  <span>
                    20%
                  </span>

                  <span>
                    10%
                  </span>

                  <span>
                    0%
                  </span>

                </div>


                <div className="duration-bars">

                  <div className="duration-bar-group">

                    <div
                      className="duration-bar cyan-bar"
                      style={{ height: "42%" }}
                    >
                      <span>
                        12%
                      </span>
                    </div>

                    <label>
                      &lt;5K
                    </label>

                  </div>


                  <div className="duration-bar-group">

                    <div
                      className="duration-bar cyan-bar"
                      style={{ height: "85%" }}
                    >
                      <span>
                        34%
                      </span>
                    </div>

                    <label>
                      5–8K
                    </label>

                  </div>


                  <div className="duration-bar-group">

                    <div
                      className="duration-bar cyan-bar"
                      style={{ height: "70%" }}
                    >
                      <span>
                        28%
                      </span>
                    </div>

                    <label>
                      8–10K
                    </label>

                  </div>


                  <div className="duration-bar-group">

                    <div
                      className="duration-bar blue-bar"
                      style={{ height: "35%" }}
                    >
                      <span>
                        14%
                      </span>
                    </div>

                    <label>
                      10–12K
                    </label>

                  </div>


                  <div className="duration-bar-group">

                    <div
                      className="duration-bar purple-bar"
                      style={{ height: "20%" }}
                    >
                      <span>
                        8%
                      </span>
                    </div>

                    <label>
                      12–15K
                    </label>

                  </div>


                  <div className="duration-bar-group">

                    <div
                      className="duration-bar purple-bar"
                      style={{ height: "10%" }}
                    >
                      <span>
                        4%
                      </span>
                    </div>

                    <label>
                      15K+
                    </label>

                  </div>

                </div>

              </div>


              <div className="chart-footer">

                <span>
                  <i className="dot cyan-bg"></i>
                  Standard Range (86%)
                </span>

                <span>
                  <i className="dot purple-bg"></i>
                  High Output (12%)
                </span>

              </div>

            </div>


            {/* =================================================
                10 YEAR SHIFT
            ================================================= */}

            <div className="analytics-card shift-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    10-Year Shift
                  </h2>

                  <p>
                    2016 vs 2026 ERP distribution
                  </p>

                </div>

              </div>


              <div className="shift-years">

                <span>
                  2016
                </span>

                <span>
                  2026
                </span>

              </div>


              <div className="line-chart">

                <div className="line-grid">

                  <span>48%</span>
                  <span>31%</span>
                  <span>18%</span>
                  <span>9%</span>

                </div>


                <svg
                  className="shift-svg"
                  viewBox="0 0 320 190"
                  preserveAspectRatio="none"
                >

                  <line
                    x1="50"
                    y1="20"
                    x2="50"
                    y2="170"
                    className="chart-axis"
                  />

                  <line
                    x1="270"
                    y1="20"
                    x2="270"
                    y2="170"
                    className="chart-axis"
                  />


                  {/* BLUE LINE */}

                  <polyline
                    points="50,125 270,55"
                    className="line cyan-line"
                  />

                  <circle
                    cx="50"
                    cy="125"
                    r="5"
                    className="point cyan-point"
                  />

                  <circle
                    cx="270"
                    cy="55"
                    r="5"
                    className="point cyan-point"
                  />


                  {/* ORANGE LINE */}

                  <polyline
                    points="50,45 270,110"
                    className="line orange-line"
                  />

                  <circle
                    cx="50"
                    cy="45"
                    r="5"
                    className="point orange-point"
                  />

                  <circle
                    cx="270"
                    cy="110"
                    r="5"
                    className="point orange-point"
                  />


                  {/* GREEN LINE */}

                  <polyline
                    points="50,165 270,145"
                    className="line green-line"
                  />

                  <circle
                    cx="50"
                    cy="165"
                    r="5"
                    className="point green-point"
                  />

                  <circle
                    cx="270"
                    cy="145"
                    r="5"
                    className="point green-point"
                  />


                  {/* PURPLE LINE */}

                  <polyline
                    points="50,180 270,170"
                    className="line purple-line"
                  />

                  <circle
                    cx="50"
                    cy="180"
                    r="5"
                    className="point purple-point"
                  />

                  <circle
                    cx="270"
                    cy="170"
                    r="5"
                    className="point purple-point"
                  />

                </svg>


                <div className="shift-labels">

                  <span className="shift-cyan">
                    38% Production
                  </span>

                  <span className="shift-orange">
                    32% Admin
                  </span>

                  <span className="shift-green">
                    18% Operations
                  </span>

                  <span className="shift-purple">
                    12% Support
                  </span>

                </div>

              </div>


              <div className="shift-note">
                *10-year change in workforce distribution
              </div>

            </div>

          </div>


          {/* =================================================
              DEPARTMENT PERFORMANCE + PRODUCTION SUMMARY
          ================================================= */}

          <div className="dashboard-grid">


            {/* =================================================
                DEPARTMENT PERFORMANCE
            ================================================= */}

            <div className="card department-card">

              <div className="card-header">

                <div>

                  <h2>
                    Department Performance
                  </h2>

                  <p>
                    Current efficiency by department
                  </p>

                </div>

                <button
                  type="button"
                  className="view-btn"
                >
                  View All
                </button>

              </div>


              {/* SPINNING */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">
                    🧵
                  </div>

                  <div>

                    <strong>
                      Spinning
                    </strong>

                    <small>
                      Production Department
                    </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span>
                      Efficiency
                    </span>

                    <strong>
                      94%
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "94%"
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* WEAVING RAPIER */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">
                    🏭
                  </div>

                  <div>

                    <strong>
                      Weaving - Rapier
                    </strong>

                    <small>
                      Weaving Department
                    </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span>
                      Efficiency
                    </span>

                    <strong>
                      89%
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "89%"
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* WEAVING S4 */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">
                    ⚙️
                  </div>

                  <div>

                    <strong>
                      Weaving - S4
                    </strong>

                    <small>
                      Weaving Department
                    </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span>
                      Efficiency
                    </span>

                    <strong>
                      92%
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "92%"
                      }}
                    />

                  </div>

                </div>

              </div>


              {/* HPT */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">
                    📦
                  </div>

                  <div>

                    <strong>
                      HPT
                    </strong>

                    <small>
                      Production Support
                    </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span>
                      Performance
                    </span>

                    <strong>
                      87%
                    </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "87%"
                      }}
                    />

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                EXISTING PRODUCTION SUMMARY
            ================================================= */}

            <div className="card production-summary-card">

              <div className="card-header">

                <div>

                  <h2>
                    Production Summary
                  </h2>

                  <p>
                    Production performance this week
                  </p>

                </div>

                <button
                  type="button"
                  className="view-btn"
                >
                  Weekly
                </button>

              </div>


              <div className="summary-number">

                <h1>
                  68.4K
                </h1>

                <span>
                  Units
                </span>

              </div>


              <div className="summary-change">
                ↑ 14.8% compared to last week
              </div>


              {/* EXISTING CHART */}

              <div className="chart">

                <div
                  className="bar"
                  style={{ height: "55%" }}
                />

                <div
                  className="bar"
                  style={{ height: "72%" }}
                />

                <div
                  className="bar"
                  style={{ height: "63%" }}
                />

                <div
                  className="bar"
                  style={{ height: "84%" }}
                />

                <div
                  className="bar"
                  style={{ height: "74%" }}
                />

                <div
                  className="bar"
                  style={{ height: "92%" }}
                />

                <div
                  className="bar"
                  style={{ height: "80%" }}
                />

              </div>


              <div className="chart-labels">

                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

              </div>

            </div>

          </div>


          {/* =================================================
              MODAL DISTRIBUTION + EFFICIENCY TABLE
          ================================================= */}

          <div className="lower-analytics-grid">


            {/* =================================================
                MODAL DISTRIBUTION
            ================================================= */}

            <div className="analytics-card persona-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Workforce Distribution by Employee Group
                  </h2>

                  <p>
                    Proportional breakdown across major ERP workforce groups
                  </p>

                </div>

              </div>


              {/* GROUP 1 */}

              <div className="persona-row">

                <div className="persona-name">
                  Production Core
                </div>

                <div className="persona-blocks">

                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box green"></span>
                  <span className="persona-box green"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>

                </div>

                <span className="persona-badge cyan-outline">
                  60% Production
                </span>

              </div>


              {/* GROUP 2 */}

              <div className="persona-row">

                <div className="persona-name">
                  Administration
                </div>

                <div className="persona-blocks">

                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box green"></span>
                  <span className="persona-box green"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>

                </div>

                <span className="persona-badge orange-outline">
                  40% Support
                </span>

              </div>


              {/* GROUP 3 */}

              <div className="persona-row">

                <div className="persona-name">
                  Operations
                </div>

                <div className="persona-blocks">

                  <span className="persona-box cyan"></span>
                  <span className="persona-box cyan"></span>
                  <span className="persona-box green"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>
                  <span className="persona-box orange"></span>

                </div>

                <span className="persona-badge orange-outline">
                  70% Operations
                </span>

              </div>


              <div className="persona-legend">

                <span>
                  <i className="dot cyan-bg"></i>
                  Production
                </span>

                <span>
                  <i className="dot green-bg"></i>
                  Operations
                </span>

                <span>
                  <i className="dot orange-bg"></i>
                  Administration
                </span>

              </div>

            </div>


            {/* =================================================
                TOP EFFICIENCY TABLE
            ================================================= */}

            <div className="analytics-card efficiency-table-card">

              <div className="analytics-header">

                <div>

                  <h2>
                    Top Department Efficiency
                  </h2>

                  <p>
                    Current ERP performance index
                  </p>

                </div>

              </div>


              <div className="efficiency-table-wrapper">

                <table className="efficiency-table">

                  <thead>

                    <tr>

                      <th>
                        DEPARTMENT
                      </th>

                      <th>
                        EFFICIENCY %
                      </th>

                      <th>
                        AVG OUTPUT
                      </th>

                      <th>
                        INDEX
                      </th>

                      <th>
                        TREND
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    <tr>

                      <td>
                        <strong>
                          Spinning
                        </strong>
                      </td>

                      <td className="blue-value">
                        94.2%
                      </td>

                      <td>
                        10,240
                      </td>

                      <td className="green-value">
                        92 / 100
                      </td>

                      <td>
                        <span className="trend-pill">
                          +2.4%
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        <strong>
                          Weaving - S4
                        </strong>
                      </td>

                      <td className="blue-value">
                        92.1%
                      </td>

                      <td>
                        9,840
                      </td>

                      <td className="green-value">
                        90 / 100
                      </td>

                      <td>
                        <span className="trend-pill">
                          +3.1%
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        <strong>
                          Weaving - Rapier
                        </strong>
                      </td>

                      <td className="blue-value">
                        89.4%
                      </td>

                      <td>
                        9,210
                      </td>

                      <td className="orange-value">
                        76 / 100
                      </td>

                      <td>
                        <span className="trend-pill">
                          +1.8%
                        </span>
                      </td>

                    </tr>


                    <tr>

                      <td>
                        <strong>
                          HPT
                        </strong>
                      </td>

                      <td className="blue-value">
                        87.3%
                      </td>

                      <td>
                        8,620
                      </td>

                      <td className="green-value">
                        88 / 100
                      </td>

                      <td>
                        <span className="trend-pill">
                          +4.0%
                        </span>
                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>


              <div className="table-note">
                Showing top 4 of 7 tracked ERP departments
              </div>

            </div>

          </div>


          {/* =================================================
              RECENT EMPLOYEES
          ================================================= */}

          <div className="card employees-card">

            <div className="card-header">

              <div>

                <h2>
                  Recent Employees
                </h2>

                <p>
                  Recently added employees
                </p>

              </div>

              <Link
                to="/add-employee"
                className="view-btn"
              >
                Add Employee
              </Link>

            </div>


            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    <th>
                      Employee
                    </th>

                    <th>
                      Employee ID
                    </th>

                    <th>
                      Department
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {/* EMPLOYEE 1 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">
                          RK
                        </div>

                        <strong>
                          Rahul Kumar
                        </strong>

                      </div>

                    </td>

                    <td>
                      EMP001
                    </td>

                    <td>
                      Spinning
                    </td>

                    <td>
                      98765 43210
                    </td>

                    <td>

                      <span className="status active-status">
                        Active
                      </span>

                    </td>

                  </tr>


                  {/* EMPLOYEE 2 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">
                          AS
                        </div>

                        <strong>
                          Ankit Sharma
                        </strong>

                      </div>

                    </td>

                    <td>
                      EMP002
                    </td>

                    <td>
                      Weaving
                    </td>

                    <td>
                      98765 1234
                    </td>

                    <td>

                      <span className="status active-status">
                        Active
                      </span>

                    </td>

                  </tr>


                  {/* EMPLOYEE 3 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">
                          PS
                        </div>

                        <strong>
                          Priya Singh
                        </strong>

                      </div>

                    </td>

                    <td>
                      EMP003
                    </td>

                    <td>
                      HPT
                    </td>

                    <td>
                      99887 66554
                    </td>

                    <td>

                      <span className="status leave-status">
                        On Leave
                      </span>

                    </td>

                  </tr>


                  {/* EMPLOYEE 4 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">
                          AM
                        </div>

                        <strong>
                          Amit Mishra
                        </strong>

                      </div>

                    </td>

                    <td>
                      EMP004
                    </td>

                    <td>
                      Weaving - S4
                    </td>

                    <td>
                      91234 56789
                    </td>

                    <td>

                      <span className="status active-status">
                        Active
                      </span>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>


          {/* =================================================
              METHODOLOGY / FOOTER
          ================================================= */}

          <div className="dashboard-footer">

            <div>

              <strong>
                ERP ANALYTICS &amp; PERFORMANCE
              </strong>

              <p>
                Dashboard metrics are currently using representative
                dummy values and can later be connected to your ERP data.
              </p>

            </div>


            <div className="footer-right">

              <span>
                Report Ref: ERP-DASH-2026
              </span>

              <span>
                Synthetic dashboard data
              </span>

            </div>


            <button
              type="button"
              className="export-btn"
            >
              Export Dashboard →
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;