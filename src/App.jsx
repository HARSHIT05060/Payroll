import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import Login from "./Components/Login";
import Home from './Components/Home';
import ProtectedRoute from './Components/ProtectedRoute';
import SubscriptionGuard from './Components/Subscription/SubscriptionGuard';
import { ThemeProvider } from './context/Themecontext';
import Unauthorized from './Components/Unauthorized';

// Landing Page Components (for better performance, keep these non-lazy)
import LandingPage from './Components/Landing/LandingPage';
import LandingNavbar from './Components/Landing/LandingNavbar';

// Lazy Loaded Employee Management Pages
const Employee = lazy(() => import('./pages/Employee/Employee'));
const EmployeeDetail = lazy(() => import('./pages/Employee/EmployeeDetail'));
const AddEmployee = lazy(() => import('./pages/Employee/AddEmployee'));
const DepartmentsPage = lazy(() => import('./pages/Employee/Departments'));
const BranchesPage = lazy(() => import('./pages/Employee/Branches'));
const DesignationPage = lazy(() => import('./pages/Employee/Designations'));
const DeductionPage = lazy(() => import('./pages/Employee/Deduction'));
const AllowancePage = lazy(() => import('./pages/Employee/Allowance'));

// Lazy Loaded User Management Pages
const Role = lazy(() => import('./pages/Users/Role'));
const AddRole = lazy(() => import('./pages/Users/AddRole'));
const Usermanagement = lazy(() => import('./pages/Users/Usermanagement'));
const AddUser = lazy(() => import('./pages/Users/AddUser'));

// Lazy Loaded Shift Management Pages
const ShiftManagement = lazy(() => import('./pages/ShiftManagement/ShiftManagement'));
const CreateShift = lazy(() => import('./pages/ShiftManagement/CreateShift'));
const AssignShift = lazy(() => import('./pages/ShiftManagement/AssignShift'));

// Lazy Loaded Leave Management Pages
const LeaveApplication = lazy(() => import('./pages/Leave/LeaveApplication'));
const LeaveStatusPage = lazy(() => import('./pages/Leave/LeaveStatus'));

// Lazy Loaded Loan Management Pages
const LoanAdvance = lazy(() => import('./pages/Loan/LoanAdvance'));
const AddLoanAdvance = lazy(() => import('./pages/Loan/AddLoanAdvance'));

// Lazy Loaded Payroll Management Pages
const MonthlyPayroll = lazy(() => import('./pages/Payroll/MonthlyPayroll'));
const FinalizePayroll = lazy(() => import('./pages/Payroll/FinalizePayroll'));

// Lazy Loaded Report Pages
const AllReports = lazy(() => import('./pages/Report/AllReports'));
const DailyReport = lazy(() => import('./pages/Report/DailyReport'));
const MonthlyReport = lazy(() => import('./pages/Report/MothlyReport'));
const DateRangeReport = lazy(() => import('./pages/Report/DateRangeReport'));
const EmployeeDirectoryReport = lazy(() => import('./pages/Report/EmployeeDirectoryReport'));
const MonthlySalaryReport = lazy(() => import('./pages/Report/MonthlySalaryReport'));

// Lazy Loaded Configuration Pages
const TimeConfigurationComponent = lazy(() => import('./pages/Configuration/Configuration'));

// Lazy Loaded Pricing Component
const PricingComponent = lazy(() => import('./Components/PricingComponent'));

// Loading Component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
        <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 animate-pulse mx-auto"></div>
      </div>
      <p className="text-gray-600 font-medium animate-pulse">Loading...</p>
      <div className="mt-2 flex space-x-1 justify-center">
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const App = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated) || false;
  const permissions = useSelector(state => state.permissions) || {};

  // Route categorization for better performance
  const isLandingRoute = location.pathname === "/";
  const isLoginRoute = location.pathname === "/login";
  const isUnauthorizedRoute = location.pathname === "/unauthorized";
  const isPublicRoute = isLandingRoute || isLoginRoute || isUnauthorizedRoute;
  const shouldHideNavigation = isPublicRoute;

  // Sidebar state management with localStorage persistence
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved !== null ? JSON.parse(saved) : window.innerWidth <= 768;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Optimized window resize handler with debouncing
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);
        // Auto-collapse on mobile, expand on desktop if previously expanded
        if (mobile && !isCollapsed) {
          setIsCollapsed(true);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [isCollapsed]);

  // Calculate main content style with smooth transitions
  const getMainContentStyle = () => {
    if (shouldHideNavigation) return { minHeight: '100vh' };

    return {
      marginLeft: isCollapsed
        ? (isMobile ? '0' : '80px')
        : '256px',
      paddingTop: '64px',
      minHeight: 'calc(100vh - 64px)',
      transition: 'margin-left 0.3s ease-in-out'
    };
  };

  // Permission-based route wrapper
  const PermissionRoute = ({ children, permission, fallback = <Navigate to="/unauthorized" replace /> }) => {
    return permissions[permission] ? (
      <ProtectedRoute>{children}</ProtectedRoute>
    ) : fallback;
  };

  return (
    <ThemeProvider>
      <SubscriptionGuard>
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
          {/* Landing Page Navbar */}
          {isLandingRoute && <LandingNavbar />}

          {/* Application Navbar */}
          {!shouldHideNavigation && (
            <Navbar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          {/* Sidebar for authenticated routes */}
          {!shouldHideNavigation && (
            <Sidebar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

          <main
            className="transition-all duration-300 overflow-y-auto"
            style={getMainContentStyle()}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected Dashboard Route */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

                {/* User Management Routes */}
                <Route path="/role" element={
                  <PermissionRoute permission="user_roles_view">
                    <Role />
                  </PermissionRoute>
                } />

                <Route path="/add-role" element={
                  <PermissionRoute permission={permissions['user_roles_create'] || permissions['user_roles_edit'] ? 'user_roles_create' : null}>
                    <AddRole />
                  </PermissionRoute>
                } />

                <Route path="/usermanage" element={
                  <PermissionRoute permission="user_view">
                    <Usermanagement />
                  </PermissionRoute>
                } />

                <Route path="/add-user" element={
                  <PermissionRoute permission="user_create">
                    <AddUser />
                  </PermissionRoute>
                } />

                {/* Employee Management Routes */}
                <Route path="/employee" element={
                  <PermissionRoute permission="employee_view">
                    <Employee />
                  </PermissionRoute>
                } />

                <Route path="/add-employee" element={
                  <PermissionRoute permission="employee_create">
                    <AddEmployee />
                  </PermissionRoute>
                } />

                <Route path="/employee/details/:employee_id" element={
                  <PermissionRoute permission="employee_view">
                    <EmployeeDetail />
                  </PermissionRoute>
                } />

                {/* Organizational Structure Routes */}
                <Route path="/departments" element={
                  <PermissionRoute permission="department_view">
                    <DepartmentsPage />
                  </PermissionRoute>
                } />

                <Route path="/branches" element={
                  <PermissionRoute permission="branch_view">
                    <BranchesPage />
                  </PermissionRoute>
                } />

                <Route path="/designation" element={
                  <PermissionRoute permission="designation_view">
                    <DesignationPage />
                  </PermissionRoute>
                } />

                <Route path="/deductions" element={
                  <PermissionRoute permission="deduction_view">
                    <DeductionPage />
                  </PermissionRoute>
                } />

                <Route path="/allowances" element={
                  <PermissionRoute permission="allowance_view">
                    <AllowancePage />
                  </PermissionRoute>
                } />

                {/* Shift Management Routes */}
                <Route path="/shift-management" element={
                  <PermissionRoute permission="shift_view">
                    <ShiftManagement />
                  </PermissionRoute>
                } />

                <Route path="/add-shift" element={
                  <PermissionRoute permission="shift_create">
                    <CreateShift />
                  </PermissionRoute>
                } />

                <Route path="/assign-shift" element={
                  <PermissionRoute permission="shift_assign">
                    <AssignShift />
                  </PermissionRoute>
                } />

                {/* Leave Management Routes */}
                <Route path="/leaveapplication" element={
                  <PermissionRoute permission="leave_create">
                    <LeaveApplication />
                  </PermissionRoute>
                } />

                <Route path="/leavestatusPage" element={
                  <PermissionRoute permission="leave_view">
                    <LeaveStatusPage />
                  </PermissionRoute>
                } />

                {/* Loan Management Routes */}
                <Route path="/loans" element={
                  <PermissionRoute permission="loan_view">
                    <LoanAdvance />
                  </PermissionRoute>
                } />

                <Route path="/add-loan-advance" element={
                  <PermissionRoute permission="loan_create">
                    <AddLoanAdvance />
                  </PermissionRoute>
                } />

                {/* Payroll Management Routes */}
                <Route path="/monthly-payroll" element={
                  <PermissionRoute permission={permissions['salary_view'] || permissions['salary_create'] ? 'salary_view' : null}>
                    <MonthlyPayroll />
                  </PermissionRoute>
                } />

                <Route path="/finalize-payroll" element={
                  <PermissionRoute permission={permissions['salary_create'] || permissions['add_salary_payment'] ? 'salary_create' : null}>
                    <FinalizePayroll />
                  </PermissionRoute>
                } />

                {/* Reports Routes */}
                <Route path="/reports" element={
                  <PermissionRoute permission={
                    permissions['employee_directory'] ||
                      permissions['daily_attendance'] ||
                      permissions['monthly_attendance'] ||
                      permissions['monthly_salary'] ||
                      permissions['custom_range'] ? 'employee_directory' : null
                  }>
                    <AllReports />
                  </PermissionRoute>
                } />

                <Route path="/reports/employee-directory" element={
                  <PermissionRoute permission="employee_directory">
                    <EmployeeDirectoryReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/daily-attendance" element={
                  <PermissionRoute permission="daily_attendance">
                    <DailyReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/monthly-attendance" element={
                  <PermissionRoute permission="monthly_attendance">
                    <MonthlyReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/daterangereport" element={
                  <PermissionRoute permission="custom_range">
                    <DateRangeReport />
                  </PermissionRoute>
                } />

                <Route path="/reports/monthly-salary" element={
                  <PermissionRoute permission="monthly_salary">
                    <MonthlySalaryReport />
                  </PermissionRoute>
                } />

                {/* Configuration Routes */}
                <Route path="/configuration" element={
                  <PermissionRoute permission="configuration_edit">
                    <TimeConfigurationComponent />
                  </PermissionRoute>
                } />

                {/* Pricing Routes */}
                <Route path="/planspricing" element={
                  <ProtectedRoute>
                    <PricingComponent />
                  </ProtectedRoute>
                } />

                {/* Fallback Routes */}
                <Route path="*" element={
                  isAuthenticated ?
                    <Navigate to="/home" replace /> :
                    <Navigate to="/login" replace />
                } />
              </Routes>
            </Suspense>
          </main>
        </div>
      </SubscriptionGuard>
    </ThemeProvider>
  );
};

export default App;