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
import Dashboard from './Components/Dashboard';

// Lazy Loaded Pages
const Employee = lazy(() => import('./pages/Employee/Employee'));
const EmployeeDetail = lazy(() => import('./pages/Employee/EmployeeDetail'));
const AddEmployee = lazy(() => import('./pages/Employee/AddEmployee'));
const DepartmentsPage = lazy(() => import('./pages/Employee/Departments'));
const BranchesPage = lazy(() => import('./pages/Employee/Branches'));
const DesignationPage = lazy(() => import('./pages/Employee/Designations'));
const DeductionPage = lazy(() => import('./pages/Employee/Deduction'));
const AllowancePage = lazy(() => import('./pages/Employee/Allowance'));

const Role = lazy(() => import('./pages/Users/Role'));
const AddRole = lazy(() => import('./pages/Users/AddRole'));
const Usermanagement = lazy(() => import('./pages/Users/Usermanagement'));
const AddUser = lazy(() => import('./pages/Users/AddUser'));

const ShiftManagement = lazy(() => import('./pages/ShiftManagement/ShiftManagement'));
const CreateShift = lazy(() => import('./pages/ShiftManagement/CreateShift'));
const AssignShift = lazy(() => import('./pages/ShiftManagement/AssignShift'));

const LeaveApplication = lazy(() => import('./pages/Leave/LeaveApplication'));
const LeaveStatusPage = lazy(() => import('./pages/Leave/LeaveStatus'));

const LoanAdvance = lazy(() => import('./pages/Loan/LoanAdvance'));
const AddLoanAdvance = lazy(() => import('./pages/Loan/AddLoanAdvance'));

const MonthlyPayroll = lazy(() => import('./pages/Payroll/MonthlyPayroll'));
const FinalizePayroll = lazy(() => import('./pages/Payroll/FinalizePayroll'));

const AllReports = lazy(() => import('./pages/Report/AllReports'));
const DailyReport = lazy(() => import('./pages/Report/DailyReport'));
const MonthlyReport = lazy(() => import('./pages/Report/MothlyReport'));
const DateRangeReport = lazy(() => import('./pages/Report/DateRangeReport'));
const EmployeeDirectoryReport = lazy(() => import('./pages/Report/EmployeeDirectoryReport'));
const MonthlySalaryReport = lazy(() => import('./pages/Report/MonthlySalaryReport'));

const TimeConfigurationComponent = lazy(() => import('./pages/Configuration/Configuration'));

const PricingComponent = lazy(() => import('./Components/PricingComponent'));

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isUnauthorizedPage = location.pathname === "/unauthorized";
  const shouldHideNavigation = isLoginPage || isUnauthorizedPage;
  const permissions = useSelector(state => state.permissions) || {};

  // Sidebar state management
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse on mobile
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate main content margin based on sidebar state
  const getMainContentStyle = () => {
    if (shouldHideNavigation) return {};

    return {
      marginLeft: isCollapsed
        ? (isMobile ? '0' : '80px')
        : '256px',
      paddingTop: '64px' // Account for navbar height
    };
  };

  return (
    <ThemeProvider>
      <SubscriptionGuard>
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
          {!shouldHideNavigation && (
            <Navbar
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          )}

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
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-blue)] mx-auto mb-4"></div>
                  <p className="text-[var(--color-text-secondary)]">Loading...</p>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dashbord" element={<Dashboard />} />

                {/* ---------------- User Roles ----------------- */}
                {permissions['user_roles_view'] ? (
                  <Route path="/role" element={<ProtectedRoute><Role /></ProtectedRoute>} />
                ) : (
                  <Route path="/role" element={<Navigate to="/unauthorized" replace />} />
                )}

                {(permissions['user_roles_create'] || permissions['user_roles_edit']) ? (
                  <Route path="/add-role" element={<ProtectedRoute><AddRole /></ProtectedRoute>} />
                ) : (
                  <Route path="/add-role" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- User Management ----------------- */}
                {permissions['user_view'] ? (
                  <Route path="/usermanage" element={<ProtectedRoute><Usermanagement /></ProtectedRoute>} />
                ) : (
                  <Route path="/usermanage" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['user_create'] ? (
                  <Route path="/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
                ) : (
                  <Route path="/add-user" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Employee ----------------- */}
                {permissions['employee_view'] ? (
                  <Route path="/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
                ) : (
                  <Route path="/employee" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['employee_create'] ? (
                  <Route path="/add-employee" element={<ProtectedRoute><AddEmployee /></ProtectedRoute>} />
                ) : (
                  <Route path="/add-employee" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['employee_view'] ? (
                  <Route path="/employee/details/:employee_id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
                ) : (
                  <Route path="/employee/details/:employee_id" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Department / Branch / Designation ----------------- */}
                {permissions['department_view'] ? (
                  <Route path="/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
                ) : (
                  <Route path="/departments" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['branch_view'] ? (
                  <Route path="/branches" element={<ProtectedRoute><BranchesPage /></ProtectedRoute>} />
                ) : (
                  <Route path="/branches" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['designation_view'] ? (
                  <Route path="/designation" element={<ProtectedRoute><DesignationPage /></ProtectedRoute>} />
                ) : (
                  <Route path="/designation" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['deduction_view'] ? (
                  <Route path="/deductions" element={<ProtectedRoute><DeductionPage /></ProtectedRoute>} />
                ) : (
                  <Route path="/deductions" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['allowance_view'] ? (
                  <Route path="/allowances" element={<ProtectedRoute><AllowancePage /></ProtectedRoute>} />
                ) : (
                  <Route path="/allowances" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Shift Management ----------------- */}
                {permissions['shift_view'] ? (
                  <Route path="/shift-management" element={<ProtectedRoute><ShiftManagement /></ProtectedRoute>} />
                ) : (
                  <Route path="/shift-management" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['shift_create'] ? (
                  <Route path="/add-shift" element={<ProtectedRoute><CreateShift /></ProtectedRoute>} />
                ) : (
                  <Route path="/add-shift" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['shift_assign'] ? (
                  <Route path="/assign-shift" element={<ProtectedRoute><AssignShift /></ProtectedRoute>} />
                ) : (
                  <Route path="/assign-shift" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Leave Management ----------------- */}
                {permissions['leave_create'] ? (
                  <Route path="/leaveapplication" element={<ProtectedRoute><LeaveApplication /></ProtectedRoute>} />
                ) : (
                  <Route path="/leaveapplication" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['leave_view'] ? (
                  <Route path="/leavestatusPage" element={<ProtectedRoute><LeaveStatusPage /></ProtectedRoute>} />
                ) : (
                  <Route path="/leavestatusPage" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Loan Management ----------------- */}
                {permissions['loan_view'] ? (
                  <Route path="/loans" element={<ProtectedRoute><LoanAdvance /></ProtectedRoute>} />
                ) : (
                  <Route path="/loans" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['loan_create'] ? (
                  <Route path="/add-loan-advance" element={<ProtectedRoute><AddLoanAdvance /></ProtectedRoute>} />
                ) : (
                  <Route path="/add-loan-advance" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Salary/Payroll Management ----------------- */}
                {(permissions['salary_view'] || permissions['salary_create']) ? (
                  <Route path="/monthly-payroll" element={<ProtectedRoute><MonthlyPayroll /></ProtectedRoute>} />
                ) : (
                  <Route path="/monthly-payroll" element={<Navigate to="/unauthorized" replace />} />
                )}

                {(permissions['salary_create'] || permissions['add_salary_payment']) ? (
                  <Route path="/finalize-payroll" element={<ProtectedRoute><FinalizePayroll /></ProtectedRoute>} />
                ) : (
                  <Route path="/finalize-payroll" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Reports Section ----------------- */}
                {(permissions['employee_directory'] || permissions['daily_attendance'] || permissions['monthly_attendance'] ||
                  permissions['monthly_salary'] || permissions['custom_range']) ? (
                  <Route path="/reports" element={<ProtectedRoute><AllReports /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['employee_directory'] ? (
                  <Route path="/reports/employee-directory" element={<ProtectedRoute><EmployeeDirectoryReport /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports/employee-directory" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['daily_attendance'] ? (
                  <Route path="/reports/daily-attendance" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports/daily-attendance" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['monthly_attendance'] ? (
                  <Route path="/reports/monthly-attendance" element={<ProtectedRoute><MonthlyReport /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports/monthly-attendance" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['custom_range'] ? (
                  <Route path="/reports/daterangereport" element={<ProtectedRoute><DateRangeReport /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports/daterangereport" element={<Navigate to="/unauthorized" replace />} />
                )}

                {permissions['monthly_salary'] ? (
                  <Route path="/reports/monthly-salary" element={<ProtectedRoute><MonthlySalaryReport /></ProtectedRoute>} />
                ) : (
                  <Route path="/reports/monthly-salary" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Configuration Section ----------------- */}
                {permissions['configuration_edit'] ? (
                  <Route path="/configuration" element={<ProtectedRoute><TimeConfigurationComponent /></ProtectedRoute>} />
                ) : (
                  <Route path="/configuration" element={<Navigate to="/unauthorized" replace />} />
                )}

                {/* ---------------- Pricing Section ----------------- */}
                <Route path="/planspricing" element={<ProtectedRoute><PricingComponent /></ProtectedRoute>} />

                {/* ---------------- Catch All ----------------- */}
                <Route path="*" element={<Navigate to="/unauthorized" replace />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </SubscriptionGuard>
    </ThemeProvider>
  );
};

export default App;