import { useMemo, useState } from "react";

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

  const [showDetailsModal, setShowDetailsModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

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
  // CURRENCY FORMAT
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
  // SUMMARY CALCULATIONS
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
    (total, employee) =>
      total + calculateNetSalary(employee),
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
  // OPEN DETAILS
  // =========================================================

  const openDetails = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailsModal(true);
  };

  // =========================================================
  // OPEN EDIT
  // =========================================================

  const openEdit = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      ...employee,
    });

    setShowEditModal(true);
  };

  // =========================================================
  // HANDLE EDIT FORM
  // =========================================================

  const handleEditChange = (field, value) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =========================================================
  // SAVE EMPLOYEE
  // =========================================================

  const saveEmployee = () => {
    if (!editForm) return;

    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === editForm.id
          ? {
              ...editForm,

              basicSalary: Number(
                editForm.basicSalary
              ),

              allowances: Number(
                editForm.allowances
              ),

              overtime: Number(
                editForm.overtime
              ),

              bonus: Number(
                editForm.bonus
              ),

              deductions: Number(
                editForm.deductions
              ),

              workingDays: Number(
                editForm.workingDays
              ),

              paidDays: Number(
                editForm.paidDays
              ),

              leaveDays: Number(
                editForm.leaveDays
              ),
            }
          : employee
      )
    );

    setShowEditModal(false);
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
  // PUT ON HOLD
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
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";

      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";

      case "On Hold":
        return "bg-red-50 text-red-700 border border-red-200";

      default:
        return "bg-slate-100 text-slate-600 border border-slate-200";
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <span>Dashboard</span>

            <span>/</span>

            <span className="font-medium text-blue-600">
              Payroll
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Payroll Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage employee salaries, payroll processing,
            payments and employee compensation details.
          </p>

        </div>


        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              alert(
                "Payroll processing started for the selected month."
              );
            }}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Process Payroll
          </button>

        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* TOTAL EMPLOYEES */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Total Employees
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {totalEmployees}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Payroll employees
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
              👥
            </div>

          </div>

        </div>


        {/* PROCESSED */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Processed
              </p>

              <h2 className="mt-2 text-2xl font-bold text-emerald-600">
                {processedCount}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Successfully processed
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              ✓
            </div>

          </div>

        </div>


        {/* PENDING */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Pending
              </p>

              <h2 className="mt-2 text-2xl font-bold text-amber-600">
                {pendingCount}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Need processing
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl">
              ⏳
            </div>

          </div>

        </div>


        {/* ON HOLD */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                On Hold
              </p>

              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {holdCount}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Payment blocked
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl">
              !
            </div>

          </div>

        </div>


        {/* TOTAL PAYROLL */}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm font-medium text-slate-500">
                Net Payroll
              </p>

              <h2 className="mt-2 text-xl font-bold text-slate-900">
                {formatCurrency(totalPayroll)}
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                {salaryMonth}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl">
              ₹
            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <div className="mb-7 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* FILTER HEADER */}

        <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Payroll Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Search and filter employee payroll information.
            </p>

          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-blue-600 transition hover:text-blue-800"
          >
            Clear Filters
          </button>

        </div>


        {/* FILTER GRID */}

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2 xl:grid-cols-5">

          {/* EMPLOYEE ID */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Employee ID
            </label>

            <input
              type="text"
              value={employeeId}
              onChange={(event) =>
                setEmployeeId(event.target.value)
              }
              placeholder="EMP001"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* EMPLOYEE NAME */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Employee Name
            </label>

            <input
              type="text"
              value={employeeName}
              onChange={(event) =>
                setEmployeeName(event.target.value)
              }
              placeholder="Employee name"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* DEPARTMENT */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Department
            </label>

            <select
              value={department}
              onChange={(event) =>
                setDepartment(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>All Departments</option>
              <option>SPINNING</option>
              <option>WEAVING-Rapier</option>
              <option>WEAVING-S4</option>
            </select>

          </div>


          {/* PAYROLL STATUS */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Payroll Status
            </label>

            <select
              value={payrollStatus}
              onChange={(event) =>
                setPayrollStatus(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>All Status</option>
              <option>Processed</option>
              <option>Pending</option>
              <option>On Hold</option>
            </select>

          </div>


          {/* SALARY MONTH */}

          <div>

            <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-600">
              Salary Month
            </label>

            <select
              value={salaryMonth}
              onChange={(event) =>
                setSalaryMonth(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option>August 2026</option>
              <option>July 2026</option>
              <option>June 2026</option>
              <option>May 2026</option>
            </select>

          </div>

        </div>

      </div>


      {/* =====================================================
          EMPLOYEE PAYROLL TABLE
      ===================================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Employee Payroll
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing {filteredEmployees.length} of{" "}
              {employees.length} employees
            </p>

          </div>

          <div className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {salaryMonth}
          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Employee
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Basic
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Allowances
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Overtime
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deductions
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Net Salary
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-100">

              {filteredEmployees.length > 0 ? (

                filteredEmployees.map((employee) => {

                  const netSalary =
                    calculateNetSalary(employee);

                  return (
                    <tr
                      key={employee.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* EMPLOYEE */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {employee.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <div>

                            <p className="font-semibold text-slate-900">
                              {employee.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {employee.id}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* DEPARTMENT */}

                      <td className="px-6 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {employee.department}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {employee.designation}
                        </p>

                      </td>


                      {/* BASIC */}

                      <td className="px-6 py-4 text-right text-sm text-slate-700">
                        {formatCurrency(
                          employee.basicSalary
                        )}
                      </td>


                      {/* ALLOWANCES */}

                      <td className="px-6 py-4 text-right text-sm font-medium text-emerald-600">
                        +
                        {formatCurrency(
                          employee.allowances
                        )}
                      </td>


                      {/* OVERTIME */}

                      <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                        +
                        {formatCurrency(
                          employee.overtime
                        )}
                      </td>


                      {/* DEDUCTIONS */}

                      <td className="px-6 py-4 text-right text-sm font-medium text-red-600">
                        -
                        {formatCurrency(
                          employee.deductions
                        )}
                      </td>


                      {/* NET SALARY */}

                      <td className="px-6 py-4 text-right">

                        <p className="font-bold text-slate-900">
                          {formatCurrency(netSalary)}
                        </p>

                      </td>


                      {/* STATUS */}

                      <td className="px-6 py-4 text-center">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            employee.status
                          )}`}
                        >
                          {employee.status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openDetails(employee)
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-600"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openEdit(employee)
                            }
                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            Edit
                          </button>

                          {employee.status ===
                            "Pending" && (
                            <button
                              type="button"
                              onClick={() =>
                                processPayroll(
                                  employee.id
                                )
                              }
                              className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Process
                            </button>
                          )}

                          {employee.status !==
                            "On Hold" && (
                            <button
                              type="button"
                              onClick={() =>
                                holdPayroll(
                                  employee.id
                                )
                              }
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
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
                    className="px-6 py-16 text-center"
                  >

                    <div className="text-4xl">
                      🔍
                    </div>

                    <h3 className="mt-3 font-semibold text-slate-800">
                      No payroll records found
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your employee ID,
                      employee name or filters.
                    </p>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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

      {showDetailsModal &&
        selectedEmployee && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">

            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    Payroll Details
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEmployee.name} ·{" "}
                    {selectedEmployee.id}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowDetailsModal(false)
                  }
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
                >
                  ×
                </button>

              </div>


              {/* EMPLOYEE INFORMATION */}

              <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-5">

                  <h3 className="mb-4 font-semibold text-slate-900">
                    Employee Information
                  </h3>

                  <div className="space-y-4">

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

                </div>


                {/* PAYMENT INFORMATION */}

                <div className="rounded-xl border border-slate-200 p-5">

                  <h3 className="mb-4 font-semibold text-slate-900">
                    Payment Information
                  </h3>

                  <div className="space-y-4">

                    <DetailRow
                      label="Bank"
                      value={selectedEmployee.bankName}
                    />

                    <DetailRow
                      label="Account"
                      value={
                        selectedEmployee.accountNumber
                      }
                    />

                    <DetailRow
                      label="Salary Month"
                      value={selectedEmployee.month}
                    />

                    <DetailRow
                      label="Payment Date"
                      value={
                        selectedEmployee.paymentDate
                      }
                    />

                    <div className="flex items-center justify-between border-t border-slate-100 pt-3">

                      <span className="text-sm text-slate-500">
                        Status
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          selectedEmployee.status
                        )}`}
                      >
                        {selectedEmployee.status}
                      </span>

                    </div>

                  </div>

                </div>


                {/* SALARY BREAKDOWN */}

                <div className="rounded-xl border border-slate-200 p-5 lg:col-span-2">

                  <h3 className="mb-5 font-semibold text-slate-900">
                    Salary Breakdown
                  </h3>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">

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

                <div className="rounded-xl border border-slate-200 p-5 lg:col-span-2">

                  <h3 className="mb-5 font-semibold text-slate-900">
                    Attendance Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <AttendanceBox
                      label="Working Days"
                      value={
                        selectedEmployee.workingDays
                      }
                    />

                    <AttendanceBox
                      label="Paid Days"
                      value={
                        selectedEmployee.paidDays
                      }
                    />

                    <AttendanceBox
                      label="Leave Days"
                      value={
                        selectedEmployee.leaveDays
                      }
                    />

                  </div>

                </div>

              </div>


              {/* MODAL FOOTER */}

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">

                <button
                  type="button"
                  onClick={() =>
                    openEdit(selectedEmployee)
                  }
                  className="rounded-lg border border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                >
                  Edit Payroll
                </button>

                {selectedEmployee.status ===
                  "Pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      processPayroll(
                        selectedEmployee.id
                      );

                      setShowDetailsModal(false);
                    }}
                    className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Process Payroll
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setShowDetailsModal(false)
                  }
                  className="rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}


      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      {showEditModal && editForm && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4">

          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">
                  Edit Payroll
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update payroll information for{" "}
                  {editForm.name}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowEditModal(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

              <InputField
                label="Employee ID"
                value={editForm.id}
                disabled
              />

              <InputField
                label="Employee Name"
                value={editForm.name}
                onChange={(value) =>
                  handleEditChange(
                    "name",
                    value
                  )
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

              {/* DEPARTMENT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department
                </label>

                <select
                  value={editForm.department}
                  onChange={(event) =>
                    handleEditChange(
                      "department",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>SPINNING</option>
                  <option>WEAVING-Rapier</option>
                  <option>WEAVING-S4</option>
                </select>

              </div>


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

              {/* STATUS */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Payroll Status
                </label>

                <select
                  value={editForm.status}
                  onChange={(event) =>
                    handleEditChange(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option>Processed</option>
                  <option>Pending</option>
                  <option>On Hold</option>
                </select>

              </div>


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


            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setShowEditModal(false)
                }
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEmployee}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
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
// DETAIL ROW COMPONENT
// =========================================================

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">

      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-slate-800">
        {value}
      </span>

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
      className={`rounded-xl p-4 ${
        highlighted
          ? "bg-blue-600 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >

      <p
        className={`text-xs ${
          highlighted
            ? "text-blue-100"
            : "text-slate-500"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 text-lg font-bold">
        {value}
      </p>

    </div>
  );
}


// =========================================================
// ATTENDANCE BOX
// =========================================================

function AttendanceBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        Days
      </p>

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
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        disabled={disabled}
        onChange={(event) =>
          onChange?.(event.target.value)
        }
        className={`w-full rounded-lg border px-4 py-3 text-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />

    </div>
  );
}


export default Payroll;