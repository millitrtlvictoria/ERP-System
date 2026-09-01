import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import Reports from "../pages/Report";
import AddEmployee from "../pages/AddEmployee";
import Employees from "../pages/Employees";
import ViewProduction from "../pages/ViewProduction";
import Attendance from "../pages/Attendance";
import UserManagement from "../pages/UserManagement";
import Payroll from "../pages/Payroll";
import Documents from "../pages/Document";
import RegistrationForm from "../pages/registration"; // Import the RegistrationForm component
import AddUser from "../pages/AddUser"; // Import the AddUser component


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/add-employee" element={<AddEmployee />}/>
        <Route path="/employees" element={<Employees />} />
        <Route path="/view-production" element={<ViewProduction />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/register" element={<RegistrationForm />} /> 
        <Route path="/add-user" element={<AddUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;