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

  /* =====================================================
     FILTER DATA
  ===================================================== */

  const filteredData = productionData.filter((item) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      item.department.toLowerCase().includes(searchValue) ||
      item.date.toLowerCase().includes(searchValue);

    const matchesDepartment =
      department === "All Departments" ||
      item.department === department;

    const matchesShift =
      shift === "All Shifts" ||
      item.shift === shift;

    let matchesFromDate = true;
    let matchesToDate = true;

    if (fromDate) {
      const itemDate = new Date(item.date);
      const startDate = new Date(fromDate);

      matchesFromDate = itemDate >= startDate;
    }

    if (toDate) {
      const itemDate = new Date(item.date);
      const endDate = new Date(toDate);

      matchesToDate = itemDate <= endDate;
    }

    return (
      matchesSearch &&
      matchesDepartment &&
      matchesShift &&
      matchesFromDate &&
      matchesToDate
    );
  });

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setShift("All Shifts");
    setFromDate("");
    setToDate("");
  };

  /* =====================================================
     DEPARTMENT CHART DATA
  ===================================================== */

  const chartDepartments = [
    "SPINNING",
    "WEAVING-Rapier",
    "WEAVING-S4",
  ];

  const departmentChartData = chartDepartments.map((dept) => {
    const rows = filteredData.filter(
      (item) => item.department === dept
    );

    const production = rows.reduce(
      (sum, item) => sum + Number(item.production),
      0
    );

    const target = rows.reduce(
      (sum, item) => sum + Number(item.target),
      0
    );

    const efficiency =
      rows.length > 0
        ? rows.reduce(
            (sum, item) => sum + parseFloat(item.efficiency),
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

  /* =====================================================
     SHIFT CHART DATA
  ===================================================== */

  const shiftChartData = ["A", "B", "C"].map((shiftName) => ({
    shift: shiftName,
    production: filteredData
      .filter((item) => item.shift === shiftName)
      .reduce(
        (sum, item) => sum + Number(item.production),
        0
      ),
  }));

  /* =====================================================
     STATUS CHART DATA
  ===================================================== */

  const statusChartData = [
    "Excellent",
    "Good",
    "Average",
  ].map((status) => ({
    status,
    count: filteredData.filter(
      (item) => item.status === status
    ).length,
  }));

  const maxShiftProduction = Math.max(
    ...shiftChartData.map((item) => item.production),
    1
  );

  const maxStatusCount = Math.max(
    ...statusChartData.map((item) => item.count),
    1
  );

  /* =====================================================
     PIE CHART DATA
  ===================================================== */

  const totalProduction = departmentChartData.reduce(
    (sum, item) => sum + item.production,
    0
  );

  /* =====================================================
     BAR CHART DATA
  ===================================================== */

  const departmentBarData = departmentChartData.map((item) => ({
    department: item.dept,
    production: Number(item.production.toFixed(2)),
    target: Number(item.target.toFixed(2)),
  }));

  /* =====================================================
     DYNAMIC SUMMARY VALUES
  ===================================================== */

  const totalProductionValue = filteredData.reduce(
    (sum, item) => sum + Number(item.production),
    0
  );

  const totalTargetValue = filteredData.reduce(
    (sum, item) => sum + Number(item.target),
    0
  );

  const averageEfficiency =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, item) => sum + parseFloat(item.efficiency),
          0
        ) / filteredData.length
      : 0;

  const averageHPT =
    filteredData.length > 0
      ? filteredData.reduce(
          (sum, item) => sum + Number(item.hpt),
          0
        ) / filteredData.length
      : 0;

  return (
    <div className="production-page">
      <style>{`

        /* =====================================================
           ANALYTICS HEADER
        ===================================================== */

        .production-dashboard-charts {
          margin: 0 0 28px;
        }

        .production-chart-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 18px;
          padding: 0 2px;
        }

        .chart-kicker {
          display: inline-block;
          margin-bottom: 6px;
          color: #19d4e5;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .production-chart-heading h2 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 750;
        }

        .production-chart-heading p {
          margin: 6px 0 0;
          color: #91a3b8;
          font-size: 13px;
        }

        .chart-live-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border: 1px solid rgba(25, 212, 229, 0.2);
          border-radius: 999px;
          background: rgba(25, 212, 229, 0.06);
          color: #b9c9da;
          font-size: 12px;
          white-space: nowrap;
        }

        .chart-live-badge span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 10px rgba(45, 212, 191, 0.8);
        }

        /* =====================================================
           CHART GRID
        ===================================================== */

        .production-chart-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .production-chart-card {
          min-width: 0;
          padding: 20px;
          border: 1px solid rgba(148, 163, 184, 0.12);
          border-radius: 16px;
          background:
            linear-gradient(
              145deg,
              rgba(16, 26, 42, 0.98),
              rgba(8, 15, 28, 0.98)
            );
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.16);
          overflow: hidden;
        }

        .production-chart-card.chart-wide {
          grid-column: span 2;
        }

        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          margin-bottom: 22px;
        }

        .chart-card-header h3 {
          margin: 0;
          color: #f8fafc;
          font-size: 16px;
          font-weight: 700;
        }

        .chart-card-header p {
          margin: 5px 0 0;
          color: #7f91a7;
          font-size: 12px;
        }

        .chart-header-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          border-radius: 10px;
          background: rgba(25, 212, 229, 0.1);
          color: #19d4e5;
          font-size: 16px;
        }

        .chart-header-icon.purple {
          background: rgba(168, 85, 247, 0.12);
          color: #c084fc;
        }

        .chart-header-icon.orange {
          background: rgba(249, 115, 22, 0.12);
          color: #fb923c;
        }

        .chart-header-icon.green {
          background: rgba(34, 197, 94, 0.12);
          color: #4ade80;
        }

        .chart-header-icon.blue {
          background: rgba(59, 130, 246, 0.12);
          color: #60a5fa;
        }

        /* =====================================================
           PRODUCTION VS TARGET
        ===================================================== */

        .department-performance-chart {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .department-chart-row {
          display: grid;
          grid-template-columns: 165px minmax(160px, 1fr) 60px;
          align-items: center;
          gap: 16px;
        }

        .department-chart-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .department-chart-label strong {
          overflow: hidden;
          color: #e5edf6;
          font-size: 12px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .department-chart-label span {
          color: #6f8298;
          font-size: 11px;
        }

        .department-chart-track,
        .efficiency-track,
        .status-chart-track,
        .distribution-track {
          position: relative;
          width: 100%;
          height: 10px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.09);
        }

        .department-target-bar {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: rgba(148, 163, 184, 0.13);
        }

        .department-production-bar {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #19d4e5,
            #38bdf8
          );
          box-shadow: 0 0 12px rgba(25, 212, 229, 0.22);
        }

        .department-chart-percent {
          color: #7dd3fc;
          font-size: 12px;
          text-align: right;
        }

        .chart-legend {
          display: flex;
          gap: 18px;
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
        }

        .chart-legend span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #7f91a7;
          font-size: 11px;
        }

        .chart-legend i {
          display: inline-block;
          width: 9px;
          height: 9px;
          border-radius: 3px;
        }

        .legend-production {
          background: #19d4e5;
        }

        .legend-target {
          background: rgba(148, 163, 184, 0.3);
        }

        /* =====================================================
           EFFICIENCY
        ===================================================== */

        .efficiency-chart {
          display: flex;
          flex-direction: column;
          gap: 19px;
        }

        .efficiency-chart-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
        }

        .efficiency-chart-top span {
          color: #b5c4d5;
          font-size: 11px;
        }

        .efficiency-chart-top strong {
          color: #c084fc;
          font-size: 12px;
        }

        .efficiency-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #8b5cf6,
            #c084fc
          );
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.18);
        }

        /* =====================================================
           SHIFT CHART
        ===================================================== */

        .shift-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 175px;
          padding: 10px 8px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .shift-chart-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 26%;
          height: 100%;
          gap: 7px;
        }

        .shift-value {
          color: #b8c8da;
          font-size: 10px;
          white-space: nowrap;
        }

        .shift-bar-area {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          width: 100%;
          height: 105px;
        }

        .shift-bar {
          width: 34px;
          min-height: 4px;
          border-radius: 8px 8px 3px 3px;
          background: linear-gradient(
            180deg,
            #fb923c,
            #f97316
          );
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.18);
          transition: height 0.3s ease;
        }

        .shift-chart-item > span {
          color: #71859b;
          font-size: 11px;
        }

        /* =====================================================
           STATUS CHART
        ===================================================== */

        .status-chart {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .status-chart-row {
          display: grid;
          grid-template-columns: 90px minmax(100px, 1fr) 25px;
          align-items: center;
          gap: 10px;
        }

        .status-chart-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #b8c8da;
          font-size: 11px;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
        }

        .status-dot.excellent {
          background: #22c55e;
        }

        .status-dot.good {
          background: #19d4e5;
        }

        .status-dot.average {
          background: #f59e0b;
        }

        .status-chart-fill {
          height: 100%;
          min-width: 4px;
          border-radius: inherit;
        }

        .status-chart-fill.excellent {
          background: #22c55e;
        }

        .status-chart-fill.good {
          background: #19d4e5;
        }

        .status-chart-fill.average {
          background: #f59e0b;
        }

        .status-chart-row > strong {
          color: #dbe7f3;
          font-size: 12px;
          text-align: right;
        }

        .status-summary {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          padding-top: 14px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
          color: #71859b;
          font-size: 11px;
        }

        .status-summary strong {
          color: #f8fafc;
          font-size: 13px;
        }

        /* =====================================================
           DISTRIBUTION
        ===================================================== */

        .distribution-chart {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .distribution-row {
          display: grid;
          grid-template-columns: 160px minmax(120px, 1fr) 55px;
          align-items: center;
          gap: 15px;
        }

        .distribution-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .distribution-info strong {
          color: #dce7f3;
          font-size: 12px;
        }

        .distribution-info span {
          color: #6f8298;
          font-size: 11px;
        }

        .distribution-fill {
          height: 100%;
          min-width: 4px;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #3b82f6,
            #19d4e5
          );
        }

        .distribution-percent {
          color: #7dd3fc;
          font-size: 12px;
          text-align: right;
        }

        /* =====================================================
           NEW PIE CHART
        ===================================================== */

        .production-pie-chart {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 190px;
          height: 190px;
          margin: 8px auto 20px;
        }

        .pie-chart {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: conic-gradient(
            #19d4e5 0deg 120deg,
            #8b5cf6 120deg 240deg,
            #f97316 240deg 360deg
          );
          box-shadow:
            0 0 25px rgba(25, 212, 229, 0.12),
            inset 0 0 20px rgba(0, 0, 0, 0.15);
        }

        .pie-chart::after {
          content: "";
          position: absolute;
          inset: 32px;
          border-radius: 50%;
          background: #101a2a;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.25);
        }

        .pie-center {
          position: absolute;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .pie-center strong {
          color: #f8fafc;
          font-size: 20px;
          font-weight: 800;
        }

        .pie-center span {
          margin-top: 3px;
          color: #71859b;
          font-size: 10px;
        }

        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding-top: 14px;
          border-top: 1px solid rgba(148, 163, 184, 0.08);
        }

        .pie-legend-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pie-legend-left {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b8c8da;
          font-size: 11px;
        }

        .pie-legend-item strong {
          color: #dce7f3;
          font-size: 12px;
        }

        .pie-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .pie-dot-0 {
          background: #19d4e5;
        }

        .pie-dot-1 {
          background: #8b5cf6;
        }

        .pie-dot-2 {
          background: #f97316;
        }

        /* =====================================================
           NEW TARGET VS ACTUAL BAR CHART
        ===================================================== */

        .target-bar-chart {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 205px;
          padding: 15px 8px 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .target-bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          width: 30%;
          height: 100%;
        }

        .target-bar-values {
          min-height: 18px;
          margin-bottom: 6px;
        }

        .target-bar-values span {
          color: #b8c8da;
          font-size: 10px;
        }

        .target-bar-area {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 5px;
          width: 100%;
          height: 135px;
        }

        .target-bar,
        .actual-bar {
          width: 22px;
          min-height: 3px;
          border-radius: 6px 6px 2px 2px;
          transition: height 0.3s ease;
        }

        .target-bar {
          background: rgba(148, 163, 184, 0.25);
        }

        .actual-bar {
          background: linear-gradient(
            180deg,
            #19d4e5,
            #0ea5e9
          );
          box-shadow: 0 0 12px rgba(25, 212, 229, 0.18);
        }

        .target-bar-label {
          width: 100%;
          margin-top: 9px;
          overflow: hidden;
          color: #71859b;
          font-size: 10px;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .bar-chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 17px;
        }

        .bar-chart-legend span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #7f91a7;
          font-size: 11px;
        }

        .bar-chart-legend i {
          width: 9px;
          height: 9px;
          display: inline-block;
          border-radius: 3px;
        }

        .bar-legend-target {
          background: rgba(148, 163, 184, 0.3);
        }

        .bar-legend-actual {
          background: #19d4e5;
        }

        /* =====================================================
           RESPONSIVE
        ===================================================== */

        @media (max-width: 1000px) {
          .production-chart-grid {
            grid-template-columns: 1fr;
          }

          .production-chart-card.chart-wide {
            grid-column: span 1;
          }
        }

        @media (max-width: 700px) {
          .production-chart-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .department-chart-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .department-chart-percent {
            text-align: left;
          }

          .distribution-row {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .distribution-percent {
            text-align: left;
          }

          .status-chart-row {
            grid-template-columns: 80px minmax(80px, 1fr) 20px;
          }

          .target-bar-area {
            gap: 3px;
          }

          .target-bar,
          .actual-bar {
            width: 16px;
          }

          .target-bar-label {
            font-size: 9px;
          }
        }

      `}</style>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

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

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="production-stats">
        <div className="production-stat-card">
          <div className="production-stat-icon blue">
            📦
          </div>

          <div>
            <span>Total Production</span>

            <h2>
              {totalProductionValue.toFixed(2)}
            </h2>

            <small>MT this period</small>
          </div>
        </div>

        <div className="production-stat-card">
          <div className="production-stat-icon green">
            🎯
          </div>

          <div>
            <span>Target Production</span>

            <h2>
              {totalTargetValue.toFixed(2)}
            </h2>

            <small>MT target</small>
          </div>
        </div>

        <div className="production-stat-card">
          <div className="production-stat-icon purple">
            📈
          </div>

          <div>
            <span>Average Efficiency</span>

            <h2>
              {averageEfficiency.toFixed(2)}%
            </h2>

            <small className="positive">
              ↑ Current period
            </small>
          </div>
        </div>

        <div className="production-stat-card">
          <div className="production-stat-icon orange">
            ⚙️
          </div>

          <div>
            <span>Average HPT</span>

            <h2>
              {averageHPT.toFixed(2)}
            </h2>

            <small>Hours per ton</small>
          </div>
        </div>
      </div>

      {/* =====================================================
          PRODUCTION ANALYTICS
      ===================================================== */}

      <section className="production-dashboard-charts">
        <div className="production-chart-heading">
          <div>
            <span className="chart-kicker">
              PRODUCTION ANALYTICS
            </span>

            <h2>
              Production Performance Dashboard
            </h2>

            <p>
              Visual overview of production, targets,
              efficiency, shifts and production status.
            </p>
          </div>

          <div className="chart-live-badge">
            <span></span>
            Live from current records
          </div>
        </div>

        <div className="production-chart-grid">

          {/* =================================================
              CHART 1 - PRODUCTION VS TARGET
          ================================================= */}

          <div className="production-chart-card chart-wide">
            <div className="chart-card-header">
              <div>
                <h3>Production vs Target</h3>
                <p>
                  Department-wise production achievement
                </p>
              </div>

              <div className="chart-header-icon">
                📊
              </div>
            </div>

            <div className="department-performance-chart">
              {departmentChartData.map((item) => (
                <div
                  className="department-chart-row"
                  key={item.dept}
                >
                  <div className="department-chart-label">
                    <strong>{item.dept}</strong>

                    <span>
                      {item.production.toFixed(2)} /{" "}
                      {item.target.toFixed(2)} MT
                    </span>
                  </div>

                  <div className="department-chart-track">
                    <div
                      className="department-target-bar"
                      style={{
                        width: "100%",
                      }}
                    ></div>

                    <div
                      className="department-production-bar"
                      style={{
                        width: `${Math.min(
                          (item.production /
                            Math.max(item.target, 1)) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <strong className="department-chart-percent">
                    {item.target > 0
                      ? (
                          (item.production /
                            item.target) *
                          100
                        ).toFixed(1)
                      : "0.0"}
                    %
                  </strong>
                </div>
              ))}
            </div>

            <div className="chart-legend">
              <span>
                <i className="legend-production"></i>
                Actual Production
              </span>

              <span>
                <i className="legend-target"></i>
                Target
              </span>
            </div>
          </div>

          {/* =================================================
              CHART 2 - DEPARTMENT EFFICIENCY
          ================================================= */}

          <div className="production-chart-card">
            <div className="chart-card-header">
              <div>
                <h3>Department Efficiency</h3>
                <p>
                  Average efficiency percentage
                </p>
              </div>

              <div className="chart-header-icon purple">
                ↗
              </div>
            </div>

            <div className="efficiency-chart">
              {departmentChartData.map((item) => (
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
                        width: `${Math.min(
                          item.efficiency,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              CHART 3 - SHIFT PRODUCTION
          ================================================= */}

          <div className="production-chart-card">
            <div className="chart-card-header">
              <div>
                <h3>Shift-wise Production</h3>
                <p>
                  Total production by shift
                </p>
              </div>

              <div className="chart-header-icon orange">
                ⚙
              </div>
            </div>

            <div className="shift-chart">
              {shiftChartData.map((item) => (
                <div
                  className="shift-chart-item"
                  key={item.shift}
                >
                  <div className="shift-value">
                    {item.production.toFixed(2)} MT
                  </div>

                  <div className="shift-bar-area">
                    <div
                      className="shift-bar"
                      style={{
                        height: `${
                          item.production > 0
                            ? Math.max(
                                (item.production /
                                  maxShiftProduction) *
                                  100,
                                8
                              )
                            : 4
                        }%`,
                      }}
                    ></div>
                  </div>

                  <span>
                    Shift {item.shift}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              CHART 4 - PRODUCTION STATUS
          ================================================= */}
{/* 
          <div className="production-chart-card">
            <div className="chart-card-header">
              <div>
                <h3>Production Status</h3>
                <p>
                  Records by performance status
                </p>
              </div>

              <div className="chart-header-icon green">
                ✓
              </div>
            </div>

            <div className="status-chart">
              {statusChartData.map((item) => (
                <div
                  className="status-chart-row"
                  key={item.status}
                >
                  <div className="status-chart-label">
                    <span
                      className={`status-dot ${item.status.toLowerCase()}`}
                    ></span>

                    <span>
                      {item.status}
                    </span>
                  </div>

                  <div className="status-chart-track">
                    <div
                      className={`status-chart-fill ${item.status.toLowerCase()}`}
                      style={{
                        width: `${
                          (item.count /
                            maxStatusCount) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>
                    {item.count}
                  </strong>
                </div>
              ))}
            </div>

            <div className="status-summary">
              <span>Total records</span>

              <strong>
                {filteredData.length}
              </strong>
            </div>
          </div> */}

          {/* =================================================
              CHART 5 - PRODUCTION DISTRIBUTION
          ================================================= */}

          <div className="production-chart-card chart-wide">
            <div className="chart-card-header">
              <div>
                <h3>
                  Production Distribution by Department
                </h3>

                <p>
                  Share of the currently displayed
                  production volume
                </p>
              </div>

              <div className="chart-header-icon blue">
                ◒
              </div>
            </div>

            <div className="distribution-chart">
              {departmentChartData.map((item) => {
                const percentage =
                  totalProduction > 0
                    ? (item.production /
                        totalProduction) *
                      100
                    : 0;

                return (
                  <div
                    className="distribution-row"
                    key={item.dept}
                  >
                    <div className="distribution-info">
                      <strong>
                        {item.dept}
                      </strong>

                      <span>
                        {item.production.toFixed(2)} MT
                      </span>
                    </div>

                    <div className="distribution-track">
                      <div
                        className="distribution-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      ></div>
                    </div>

                    <strong className="distribution-percent">
                      {percentage.toFixed(1)}%
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              CHART 6 - NEW PIE CHART
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
              <div className="pie-chart"></div>

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
              CHART 7 - NEW BAR CHART
          ================================================= */}

          <div className="production-chart-card">
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
                          height: `${
                            (item.target /
                              maxValue) *
                            100
                          }%`,
                        }}
                        title={`Target: ${item.target} MT`}
                      ></div>

                      <div
                        className="actual-bar"
                        style={{
                          height: `${
                            (item.production /
                              maxValue) *
                            100
                          }%`,
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
          FILTER SECTION
      ===================================================== */}

      <div className="filter-card">
        <div className="filter-header">
          <div>
            <h2>Production Records</h2>

            <p>
              Filter production data by date,
              department and shift.
            </p>
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

          <div className="filter-group">
            <label>Department</label>

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

          <div className="filter-group">
            <label>Shift</label>

            <select
              value={shift}
              onChange={(e) =>
                setShift(e.target.value)
              }
            >
              <option>
                All Shifts
              </option>

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
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="production-table-card">
        <div className="table-top">
          <div>
            <h2>Production Details</h2>

            <p>
              Showing {filteredData.length} production
              records
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
                      <strong>
                        {item.date}
                      </strong>
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
                              width:
                                item.efficiency,
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

        {/* =================================================
            TABLE FOOTER
        ================================================= */}

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