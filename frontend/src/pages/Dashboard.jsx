import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";


function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <Sidebar isOpen={sidebarOpen} />

      {/* MAIN CONTENT */}

      <main
        className={`main-content ${sidebarOpen ? "" : "expanded"
          }`}
      >

        {/* ================================
            NAVBAR
        ================================= */}

        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />


        {/* ================================
            DASHBOARD CONTENT
        ================================= */}

        <section className="content">


          {/* ================================
              PAGE INTRO
          ================================= */}

          <div className="dashboard-intro">

            <div>
              <h1>Dashboard Overview</h1>

              <p>
                Monitor your ERP operations, employees and production
                performance.
              </p>
            </div>

            <div className="dashboard-date"> 📅 Today </div>

          </div>


          {/* ================================
              STATISTICS
          ================================= */}

          <div className="stats-grid">


            {/* TOTAL EMPLOYEES */}

            <div className="stat-card">

              <div className="stat-top">

                <div>
                  <p>Total Employees</p>
                  <h2>248</h2>
                </div>

                <div className="stat-icon"> 👥 </div>

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

                <div className="stat-icon">🏭 </div>

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

                <div className="stat-icon">
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

                <div className="stat-icon">🕒</div>

              </div>

              <div className="stat-change down">
                ↓ 1.2%
                <span> vs yesterday</span>
              </div>

            </div>

          </div>


          {/* ================================
              QUICK ACTIONS
          ================================= */}

          <div className="section-header">

            <div>
              <h2>Quick Actions</h2>
              <p>Frequently used ERP functions</p>
            </div>

          </div>


          <div className="quick-actions">


            {/* ADD EMPLOYEE */}

            <Link
              to="/add-employee"
              className="quick-action-button">

              <span>👤</span>

              <div>
                <strong>Add Employee</strong>

                <small> Create new employee </small>
              </div>

            </Link>


            {/* PRODUCTION */}

             <Link
              to="/view-production"
              className="quick-action-button">

              <span>📊</span>

              <div>
                <strong>View Production</strong>

                <small> Check today's production </small>
              </div>

            </Link>
            

            {/* REPORT */}

            {/* <Link
              to="/reports"
              className="quick-action-button">

              <span>📄</span>

              <div>
                <strong>Generate Report</strong>
                <small> PDF / Excel / CSV</small>
              </div>

            </Link> */}


            {/* ATTENDANCE */}

            <Link
              to="/attendance"
              className="quick-action-button">

              <span>📅</span>

              <div>
                <strong>View Attendance</strong>
                <small> View Attendance </small>
              </div>

            </Link>

          </div>


          {/* ================================
              MAIN DASHBOARD GRID
          ================================= */}

          <div className="dashboard-grid">


            {/* ================================
                DEPARTMENT PERFORMANCE
            ================================= */}

            <div className="card">

              <div className="card-header">

                <div>

                  <h2> Department Performance </h2>
                  <p> Current efficiency by department </p>

                </div>

                <button
                  type="button"
                  className="view-btn">
                  View All
                </button>

              </div>


              {/* SPINNING */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">🧵</div>

                  <div>

                    <strong> Spinning </strong>
                    <small> Production Department </small>

                  </div>
                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span> Efficiency </span>
                    <strong> 94% </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "94%"
                      }}>
                    </div>

                  </div>

                </div>

              </div>


              {/* WEAVING RAPIER */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon"> 🏭 </div>

                  <div>

                    <strong> Weaving - Rapier </strong>
                    <small> Weaving Department </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span> Efficiency </span>
                    <strong> 89% </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "89%"
                      }}>
                    </div>

                  </div>

                </div>

              </div>


              {/* WEAVING S4 */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon">⚙️</div>

                  <div>

                    <strong> Weaving - S4 </strong>
                    <small> Weaving Department </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span> Efficiency </span>
                    <strong> 92% </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "92%"
                      }}>
                    </div>

                  </div>

                </div>

              </div>


              {/* HPT */}

              <div className="department">

                <div className="department-info">

                  <div className="department-icon"> 📦 </div>

                  <div>

                    <strong> HPT </strong>
                    <small> Production Support </small>

                  </div>

                </div>


                <div className="efficiency">

                  <div className="efficiency-text">

                    <span> Performance </span>
                    <strong> 87% </strong>

                  </div>

                  <div className="progress">

                    <div
                      style={{
                        width: "87%"
                      }}>
                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* ================================
                PRODUCTION SUMMARY
            ================================= */}

            <div className="card">

              <div className="card-header">

                <div>

                  <h2> production Summary </h2>
                  <p> Production performance this week </p>

                </div>

                <button
                  type="button"
                  className="view-btn">
                  Weekly
                </button>

              </div>


              <div className="summary-number">

                <h1> 68.4K </h1>
                <span> Units </span>

              </div>
              
              <div className="summary-change"> ↑ 14.8% compared to last week </div>


              {/* CHART */}

              <div className="chart">

                <div
                  className="bar"
                  style={{
                    height: "55%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "72%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "63%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "84%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "74%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "92%"
                  }}>
                </div>

                <div
                  className="bar"
                  style={{
                    height: "80%"
                  }}>
                </div>

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


          {/* ================================
              EMPLOYEE TABLE
          ================================= */}

          <div className="card employees-card">

            <div className="card-header">

              <div>

                <h2> Recent Employees </h2>
                <p> Recently added employees </p>

              </div>

              <Link
                to="/add-employee"
                className="view-btn">
                Add Employee
              </Link>

            </div>


            <div className="table-container">

              <table>

                <thead>

                  <tr>
                    
                    <th>Employee</th>
                    <th> Employee ID </th>
                    <th> Department </th>
                    <th> Phone </th>
                    <th> Status</th>

                  </tr>

                </thead>


                <tbody>
                  {/* EMPLOYEE 1 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">RK</div>
                        <strong> Rahul Kumar </strong>

                      </div>

                    </td>

                    <td> EMP001 </td>
                    <td> Spinning </td>
                    <td> 98765 43210 </td>

                    <td>
                      <span className="status active-status">Active </span>
                    </td>

                  </tr>


                  {/* EMPLOYEE 2 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar"> AS </div>
                        <strong> Ankit Sharma </strong>

                      </div>

                    </td>

                    <td> EMP002 </td>
                    <td> Weaving</td>
                    <td> 98765 1234</td>

                    <td>
                      <span className="status active-status">Active </span>
                    </td>

                  </tr>


                  {/* EMPLOYEE 3 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar"> PS </div>
                        <strong>Priya Singh</strong>

                      </div>

                    </td>

                    <td> EMP003 </td>
                    <td> HPT </td>
                    <td> 99887 66554</td>

                    <td>

                      <span className="status leave-status">On Leave </span>

                    </td>

                  </tr>


                  {/* EMPLOYEE 4 */}

                  <tr>

                    <td>

                      <div className="employee-name">

                        <div className="employee-avatar">AM </div>
                        <strong> Amit Mishra </strong>

                      </div>

                    </td>

                    <td> EMP004 </td>
                    <td> Weaving - S4 </td>
                    <td> 91234 56789 </td>

                    <td>
                      <span className="status active-status">Active</span>
                    </td>

                  </tr>


                </tbody>

              </table>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}


export default Dashboard;