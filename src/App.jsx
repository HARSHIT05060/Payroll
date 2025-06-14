import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Login from "./Components/Login";
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
// import api from "./api";
import Employee from './pages/Employee/Employee';
import EmployeeDetail from './pages/Employee/EmployeeDetail';
import AddEmployee from './pages/Employee/AddEmployee';
// import LeaveApplication from './pages/Leave/LeaveApplication';
// import LeaveStatusPage from './pages/Leave/LeaveStatus';
// import HolidayCalendar from './pages/Leave/HolidayCalendar';
import UserManagement from './pages/Users/Usermanagement';
import AddUser from './pages/Users/AddUser';
import DepartmentsPage from './pages/Employee/Departments';
import BranchesPage from './pages/Employee/Branches';
import DesignationPage from './pages/Employee/Designations';
// import BulkAttendance from './pages/Payroll/BulkAttendance';
// import MonthlyPayroll from './pages/Payroll/MonthlyPayroll';
// import HourlyPayroll from './pages/Payroll/HourlyPayroll';
// import FinalizePayroll from './pages/Payroll/FinalizePayroll';
// import ShiftManagement from './pages/ShiftManagement/ShiftManagement';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";


  // useEffect(() => {
  //   api.get("/api/data")
  //     .then((res) => {
  //       console.log("Data:", res.data);
  //     })
  //     .catch((err) => {
  //       console.error("Error:", err);
  //     });
  // }, []);

  return (
    <div className="flex flex-col h-30">
      {!isLoginPage && <Navbar />}
      <div className={`flex flex-1 ${!isLoginPage ? "ml-64 pt-16" : ""}`}>
        {!isLoginPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/usermanage" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
            <Route path="/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
            <Route path="/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
            <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
            <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
            <Route path="/branches" element={<ProtectedRoute><BranchesPage /></ProtectedRoute>} />
            <Route path="/designation" element={<ProtectedRoute><DesignationPage /></ProtectedRoute>} />
            {/*<Route path="/leaveapplication" element={<LeaveApplication />} />
            <Route path="/holidaycalender" element={<HolidayCalendar />} />
            <Route path="/leavestatusPage" element={<LeaveStatusPage />} />
            <Route path="/shift-management" element={<ShiftManagement />} />
            <Route path="/bulk-attendance" element={<BulkAttendance />} />
            <Route path="/monthly-payroll" element={<MonthlyPayroll />} />
            <Route path="/hourly-payroll" element={<HourlyPayroll />} />
            <Route path="/finalize-payroll" element={<FinalizePayroll />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
