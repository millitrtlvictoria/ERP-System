import { useMemo, useState } from "react";
import "../styles/payroll.css";

function Payroll() {
  // =========================================================
  // EMPLOYEE PAYROLL DATA
  // =========================================================

  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "Rahul Kumar",
      department: "SPINNING",
      designation: "Senior Operator",
      basicSalary: 22000,
      allowances: 4500,
      overtime: 1800,
      bonus: 1000,
      deductions: 1800,
      workingDays: 26,
      paidDays: 26,
      leaveDays: 0,
      status: "Processed",
      paymentDate: "05 Aug 2026",
      bankName: "State Bank of India",
      accountNumber: "XXXXXX4582",
      pan: "ABCDE1234F",
      uan: "100123456789",
      month: "August 2026",
    },

    {
      id: "EMP002",
      name: "Amit Das",
      department: "SPINNING",
      designation: "Machine Operator",
      basicSalary: 20000,
      allowances: 4000,
      overtime: 1200,
      bonus: 800,
      deductions: 1500,
      workingDays: 26,
      paidDays: 25,
      leaveDays: 1,
      status: "Processed",
      paymentDate: "05 Aug 2026",
      bankName: "HDFC Bank",
      accountNumber: "XXXXXX7821",
      pan: "BCDEF2345G",
      uan: "100123456790",
      month: "August 2026",
    },

    {
      id: "EMP003",
      name: "Sanjay Roy",
      department: "WEAVING-Rapier",
      designation: "Weaving Supervisor",
      basicSalary: 28000,
      allowances: 5500,
      overtime: 2200,
      bonus: 1500,
      deductions: 2200,
      workingDays: 26,
      paidDays: 26,
      leaveDays: 0,
      status: "Pending",
      paymentDate: "-",
      bankName: "ICICI Bank",
      accountNumber: "XXXXXX3456",
      pan: "CDEFG3456H",
      uan: "100123456791",
      month: "August 2026",
    },

    {
      id: "EMP004",
      name: "Priya Sharma",
      department: "WEAVING-S4",
      designation: "Production Assistant",
      basicSalary: 19000,
      allowances: 3500,
      overtime: 1000,
      bonus: 700,
      deductions: 1200,
      workingDays: 26,
      paidDays: 26,
      leaveDays: 0,
      status: "Processed",
      paymentDate: "05 Aug 2026",
      bankName: "Axis Bank",
      accountNumber: "XXXXXX9821",
      pan: "DEFGH4567I",
      uan: "100123456792",
      month: "August 2026",
    },

    {
      id: "EMP005",
      name: "Rakesh Singh",
      department: "WEAVING-S4",
      designation: "Machine Operator",
      basicSalary: 21000,
      allowances: 4200,
      overtime: 900,
      bonus: 500,
      deductions: 1600,
      workingDays: 26,
      paidDays: 24,
      leaveDays: 2,
      status: "On Hold",
      paymentDate: "-",
      bankName: "Punjab National Bank",
      accountNumber: "XXXXXX6412",
      pan: "EFGHI5678J",
      uan: "100123456793",
      month: "August 2026",
    },

    {
      id: "EMP006",
      name: "Arjun Mehta",
      department: "SPINNING",
      designation: "Production Executive",
      basicSalary: 30000,
      allowances: 6000,
      overtime: 2000,
      bonus: 2000,
      deductions: 2500,
      workingDays: 26,
      paidDays: 26,
      leaveDays: 0,
      status: "Pending",
      paymentDate: "-",
      bankName: "Kotak Mahindra Bank",
      accountNumber: "XXXXXX1122",
      pan: "FGHIJ6789K",
      uan: "100123456794",
      month: "August 2026",
    },
  ]);

  // =========================================================
  // FILTER STATES
  // =========================================================

  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [payrollStatus, setPayrollStatus] = useState("All Status");
  const [salaryMonth, setSalaryMonth] = useState("August 2026");

  // =========================================================
  // MODAL STATES
  // =========================================================

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // =========================================================
  // CALCULATE NET SALARY
  // =========================================================

  const calculateNetSalary = (employee) => {
    return (
      Number(employee.basicSalary || 0) +
      Number(employee.allowances || 0) +
      Number(employee.overtime || 0) +
      Number(employee.bonus || 0) -
      Number(employee.deductions || 0)
    );
  };

  // =========================================================
  // FORMAT CURRENCY
  // =========================================================

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  };

  // =========================================================
  // FILTER EMPLOYEES
  // =========================================================

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const idMatch = employee.id
        .toLowerCase()
        .includes(employeeId.toLowerCase());

      const nameMatch = employee.name
        .toLowerCase()
        .includes(employeeName.toLowerCase());

      const departmentMatch =
        department === "All Departments" ||
        employee.department === department;

      const statusMatch =
        payrollStatus === "All Status" ||
        employee.status === payrollStatus;

      const monthMatch =
        salaryMonth === "All Months" ||
        employee.month === salaryMonth;

      return (
        idMatch &&
        nameMatch &&
        departmentMatch &&
        statusMatch &&
        monthMatch
      );
    });
  }, [
    employees,
    employeeId,
    employeeName,
    department,
    payrollStatus,
    salaryMonth,
  ]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const totalEmployees = employees.length;

  const processedCount = employees.filter(
    (employee) => employee.status === "Processed"
  ).length;

  const pendingCount = employees.filter(
    (employee) => employee.status === "Pending"
  ).length;

  const holdCount = employees.filter(
    (employee) => employee.status === "On Hold"
  ).length;

  const totalPayroll = employees.reduce(
    (total, employee) => total + calculateNetSalary(employee),
    0
  );

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setEmployeeId("");
    setEmployeeName("");
    setDepartment("All Departments");
    setPayrollStatus("All Status");
    setSalaryMonth("August 2026");
  };

  // =========================================================
  // VIEW DETAILS
  // =========================================================

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  // =========================================================
  // EDIT
  // =========================================================

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({ ...employee });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const saveEmployee = () => {
    if (!editForm) return;

    const updatedEmployee = {
      ...editForm,
      basicSalary: Number(editForm.basicSalary || 0),
      allowances: Number(editForm.allowances || 0),
      overtime: Number(editForm.overtime || 0),
      bonus: Number(editForm.bonus || 0),
      deductions: Number(editForm.deductions || 0),
      workingDays: Number(editForm.workingDays || 0),
      paidDays: Number(editForm.paidDays || 0),
      leaveDays: Number(editForm.leaveDays || 0),
    };

    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === updatedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setShowEditModal(false);
    setShowDetailsModal(false);
    setSelectedEmployee(null);
    setEditForm(null);
  };

  // =========================================================
  // PROCESS PAYROLL
  // =========================================================

  const processPayroll = (id) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status: "Processed",
              paymentDate: "05 Aug 2026",
            }
          : employee
      )
    );
  };

  // =========================================================
  // HOLD PAYROLL
  // =========================================================

  const holdPayroll = (id) => {
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              status: "On Hold",
              paymentDate: "-",
            }
          : employee
      )
    );
  };

  // =========================================================
  // STATUS CLASS
  // =========================================================

  const getStatusClass = (status) => {
    if (status === "Processed") return "status-processed";
    if (status === "Pending") return "status-pending";
    if (status === "On Hold") return "status-hold";
    return "status-default";
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="payroll-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="payroll-header">

        <div>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span>/</span>
            <span className="active">Payroll</span>
          </div>

          <h1>Payroll Management</h1>

          <p>
            Manage employee salaries, payroll processing,
            payments and compensation details.
          </p>
        </div>

        <div className="header-actions">

          <button
            className="btn btn-secondary"
            onClick={clearFilters}
          >
            Reset
          </button>

          <button
            className="btn btn-primary"
            onClick={() =>
              alert(
                `Payroll processing started for ${salaryMonth}.`
              )
            }
          >
            + Process Payroll
          </button>

        </div>

      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="summary-grid">

        <SummaryCard
          title="Total Employees"
          value={totalEmployees}
          subtitle="Payroll employees"
          icon="👥"
          type="blue"
        />

        <SummaryCard
          title="Processed"
          value={processedCount}
          subtitle="Successfully processed"
          icon="✓"
          type="green"
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          subtitle="Need processing"
          icon="⏳"
          type="orange"
        />

        <SummaryCard
          title="On Hold"
          value={holdCount}
          subtitle="Payment blocked"
          icon="!"
          type="red"
        />

        <SummaryCard
          title="Net Payroll"
          value={formatCurrency(totalPayroll)}
          subtitle={salaryMonth}
          icon="₹"
          type="purple"
        />

      </div>

      {/* =====================================================
          FILTERS
      ===================================================== */}

      <div className="payroll-card filter-card">

        <div className="card-header">

          <div>
            <h2>Payroll Records</h2>
            <p>
              Search and filter employee payroll information.
            </p>
          </div>

          <button
            className="clear-filter-btn"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>

        <div className="filter-grid">

          <FilterInput
            label="Employee ID"
            placeholder="EMP001"
            value={employeeId}
            onChange={setEmployeeId}
          />

          <FilterInput
            label="Employee Name"
            placeholder="Employee name"
            value={employeeName}
            onChange={setEmployeeName}
          />

          <FilterSelect
            label="Department"
            value={department}
            onChange={setDepartment}
            options={[
              "All Departments",
              "SPINNING",
              "WEAVING-Rapier",
              "WEAVING-S4",
            ]}
          />

          <FilterSelect
            label="Payroll Status"
            value={payrollStatus}
            onChange={setPayrollStatus}
            options={[
              "All Status",
              "Processed",
              "Pending",
              "On Hold",
            ]}
          />

          <FilterSelect
            label="Salary Month"
            value={salaryMonth}
            onChange={setSalaryMonth}
            options={[
              "August 2026",
              "July 2026",
              "June 2026",
              "May 2026",
            ]}
          />

        </div>

      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="payroll-card table-card">

        <div className="table-header">

          <div>
            <h2>Employee Payroll</h2>
            <p>
              Showing {filteredEmployees.length} of{" "}
              {employees.length} employees
            </p>
          </div>

          <span className="month-badge">
            {salaryMonth}
          </span>

        </div>

        <div className="table-wrapper">

          <table className="payroll-table">

            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic</th>
                <th>Allowances</th>
                <th>Overtime</th>
                <th>Deductions</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredEmployees.length > 0 ? (

                filteredEmployees.map((employee) => {

                  const netSalary =
                    calculateNetSalary(employee);

                  const initials = employee.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  return (
                    <tr key={employee.id}>

                      <td>
                        <div className="employee-cell">

                          <div className="employee-avatar">
                            {initials}
                          </div>

                          <div>
                            <strong>
                              {employee.name}
                            </strong>

                            <small>
                              {employee.id}
                            </small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <div className="department-cell">
                          <strong>
                            {employee.department}
                          </strong>

                          <small>
                            {employee.designation}
                          </small>
                        </div>
                      </td>

                      <td className="amount">
                        {formatCurrency(
                          employee.basicSalary
                        )}
                      </td>

                      <td className="amount positive">
                        +{formatCurrency(
                          employee.allowances
                        )}
                      </td>

                      <td className="amount overtime">
                        +{formatCurrency(
                          employee.overtime
                        )}
                      </td>

                      <td className="amount negative">
                        -{formatCurrency(
                          employee.deductions
                        )}
                      </td>

                      <td className="amount net">
                        {formatCurrency(netSalary)}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            employee.status
                          )}`}
                        >
                          {employee.status}
                        </span>
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="action-btn view-btn"
                            onClick={() =>
                              openDetails(employee)
                            }
                          >
                            View
                          </button>

                          <button
                            className="action-btn edit-btn"
                            onClick={() =>
                              openEdit(employee)
                            }
                          >
                            Edit
                          </button>

                          {employee.status === "Pending" && (
                            <button
                              className="action-btn process-btn"
                              onClick={() =>
                                processPayroll(employee.id)
                              }
                            >
                              Process
                            </button>
                          )}

                          {employee.status !== "On Hold" && (
                            <button
                              className="action-btn hold-btn"
                              onClick={() =>
                                holdPayroll(employee.id)
                              }
                            >
                              Hold
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="9"
                    className="empty-cell"
                  >
                    <div className="empty-icon">
                      🔍
                    </div>

                    <h3>
                      No payroll records found
                    </h3>

                    <p>
                      Try changing your search or filters.
                    </p>

                    <button
                      className="btn btn-primary"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </button>
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}

      {showDetailsModal && selectedEmployee && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowDetailsModal(false)
          }
        >

          <div
            className="modal-container"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>Payroll Details</h2>

                <p>
                  {selectedEmployee.name} ·{" "}
                  {selectedEmployee.id}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowDetailsModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              {/* EMPLOYEE INFORMATION */}

              <div className="detail-section">

                <h3>Employee Information</h3>

                <DetailRow
                  label="Employee ID"
                  value={selectedEmployee.id}
                />

                <DetailRow
                  label="Employee Name"
                  value={selectedEmployee.name}
                />

                <DetailRow
                  label="Department"
                  value={selectedEmployee.department}
                />

                <DetailRow
                  label="Designation"
                  value={selectedEmployee.designation}
                />

                <DetailRow
                  label="UAN"
                  value={selectedEmployee.uan}
                />

                <DetailRow
                  label="PAN"
                  value={selectedEmployee.pan}
                />

              </div>

              {/* PAYMENT INFORMATION */}

              <div className="detail-section">

                <h3>Payment Information</h3>

                <DetailRow
                  label="Bank"
                  value={selectedEmployee.bankName}
                />

                <DetailRow
                  label="Account"
                  value={selectedEmployee.accountNumber}
                />

                <DetailRow
                  label="Salary Month"
                  value={selectedEmployee.month}
                />

                <DetailRow
                  label="Payment Date"
                  value={selectedEmployee.paymentDate}
                />

                <div className="detail-row">
                  <span>Status</span>

                  <span
                    className={`status-badge ${getStatusClass(
                      selectedEmployee.status
                    )}`}
                  >
                    {selectedEmployee.status}
                  </span>
                </div>

              </div>

              {/* SALARY BREAKDOWN */}

              <div className="detail-section full-width">

                <h3>Salary Breakdown</h3>

                <div className="salary-grid">

                  <SalaryBox
                    label="Basic Salary"
                    value={formatCurrency(
                      selectedEmployee.basicSalary
                    )}
                  />

                  <SalaryBox
                    label="Allowances"
                    value={formatCurrency(
                      selectedEmployee.allowances
                    )}
                  />

                  <SalaryBox
                    label="Overtime"
                    value={formatCurrency(
                      selectedEmployee.overtime
                    )}
                  />

                  <SalaryBox
                    label="Bonus"
                    value={formatCurrency(
                      selectedEmployee.bonus
                    )}
                  />

                  <SalaryBox
                    label="Deductions"
                    value={formatCurrency(
                      selectedEmployee.deductions
                    )}
                  />

                  <SalaryBox
                    label="Net Salary"
                    value={formatCurrency(
                      calculateNetSalary(
                        selectedEmployee
                      )
                    )}
                    highlighted
                  />

                </div>

              </div>

              {/* ATTENDANCE */}

              <div className="detail-section full-width">

                <h3>Attendance Information</h3>

                <div className="attendance-grid">

                  <AttendanceBox
                    label="Working Days"
                    value={selectedEmployee.workingDays}
                  />

                  <AttendanceBox
                    label="Paid Days"
                    value={selectedEmployee.paidDays}
                  />

                  <AttendanceBox
                    label="Leave Days"
                    value={selectedEmployee.leaveDays}
                  />

                </div>

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowDetailsModal(false)
                }
              >
                Close
              </button>

              <button
                className="btn btn-edit"
                onClick={() =>
                  openEdit(selectedEmployee)
                }
              >
                Edit Payroll
              </button>

              {selectedEmployee.status === "Pending" && (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    processPayroll(
                      selectedEmployee.id
                    );

                    setShowDetailsModal(false);
                  }}
                >
                  Process Payroll
                </button>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal && editForm && (

        <div
          className="modal-overlay edit-overlay"
          onClick={() =>
            setShowEditModal(false)
          }
        >

          <div
            className="modal-container edit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>Edit Payroll</h2>

                <p>
                  Update payroll information for{" "}
                  {editForm.name}
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                ×
              </button>

            </div>

            <div className="edit-form">

              <InputField
                label="Employee ID"
                value={editForm.id}
                disabled
              />

              <InputField
                label="Employee Name"
                value={editForm.name}
                onChange={(value) =>
                  handleEditChange("name", value)
                }
              />

              <InputField
                label="Designation"
                value={editForm.designation}
                onChange={(value) =>
                  handleEditChange(
                    "designation",
                    value
                  )
                }
              />

              <SelectField
                label="Department"
                value={editForm.department}
                onChange={(value) =>
                  handleEditChange(
                    "department",
                    value
                  )
                }
                options={[
                  "SPINNING",
                  "WEAVING-Rapier",
                  "WEAVING-S4",
                ]}
              />

              <InputField
                label="Basic Salary"
                type="number"
                value={editForm.basicSalary}
                onChange={(value) =>
                  handleEditChange(
                    "basicSalary",
                    value
                  )
                }
              />

              <InputField
                label="Allowances"
                type="number"
                value={editForm.allowances}
                onChange={(value) =>
                  handleEditChange(
                    "allowances",
                    value
                  )
                }
              />

              <InputField
                label="Overtime"
                type="number"
                value={editForm.overtime}
                onChange={(value) =>
                  handleEditChange(
                    "overtime",
                    value
                  )
                }
              />

              <InputField
                label="Bonus"
                type="number"
                value={editForm.bonus}
                onChange={(value) =>
                  handleEditChange(
                    "bonus",
                    value
                  )
                }
              />

              <InputField
                label="Deductions"
                type="number"
                value={editForm.deductions}
                onChange={(value) =>
                  handleEditChange(
                    "deductions",
                    value
                  )
                }
              />

              <InputField
                label="Working Days"
                type="number"
                value={editForm.workingDays}
                onChange={(value) =>
                  handleEditChange(
                    "workingDays",
                    value
                  )
                }
              />

              <InputField
                label="Paid Days"
                type="number"
                value={editForm.paidDays}
                onChange={(value) =>
                  handleEditChange(
                    "paidDays",
                    value
                  )
                }
              />

              <InputField
                label="Leave Days"
                type="number"
                value={editForm.leaveDays}
                onChange={(value) =>
                  handleEditChange(
                    "leaveDays",
                    value
                  )
                }
              />

              <SelectField
                label="Payroll Status"
                value={editForm.status}
                onChange={(value) =>
                  handleEditChange(
                    "status",
                    value
                  )
                }
                options={[
                  "Processed",
                  "Pending",
                  "On Hold",
                ]}
              />

              <InputField
                label="Bank Name"
                value={editForm.bankName}
                onChange={(value) =>
                  handleEditChange(
                    "bankName",
                    value
                  )
                }
              />

              <InputField
                label="Bank Account"
                value={editForm.accountNumber}
                onChange={(value) =>
                  handleEditChange(
                    "accountNumber",
                    value
                  )
                }
              />

              <InputField
                label="PAN"
                value={editForm.pan}
                onChange={(value) =>
                  handleEditChange(
                    "pan",
                    value
                  )
                }
              />

              <InputField
                label="UAN"
                value={editForm.uan}
                onChange={(value) =>
                  handleEditChange(
                    "uan",
                    value
                  )
                }
              />

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={saveEmployee}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  type,
}) {
  return (
    <div className="summary-card">

      <div>
        <p className="summary-title">
          {title}
        </p>

        <h2 className={`summary-value ${type}`}>
          {value}
        </h2>

        <p className="summary-subtitle">
          {subtitle}
        </p>
      </div>

      <div className={`summary-icon ${type}`}>
        {icon}
      </div>

    </div>
  );
}


// =========================================================
// FILTER INPUT
// =========================================================

function FilterInput({
  label,
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

    </div>
  );
}


// =========================================================
// FILTER SELECT
// =========================================================

function FilterSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}


// =========================================================
// INPUT FIELD
// =========================================================

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        type={type}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
      />

    </div>
  );
}


// =========================================================
// SELECT FIELD
// =========================================================

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
}


// =========================================================
// DETAIL ROW
// =========================================================

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}


// =========================================================
// SALARY BOX
// =========================================================

function SalaryBox({
  label,
  value,
  highlighted = false,
}) {
  return (
    <div
      className={`salary-box ${
        highlighted ? "highlighted" : ""
      }`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}


// =========================================================
// ATTENDANCE BOX
// =========================================================

function AttendanceBox({
  label,
  value,
}) {
  return (
    <div className="attendance-box">

      <span>{label}</span>

      <strong>{value}</strong>

      <small>Days</small>

    </div>
  );
}


export default Payroll;