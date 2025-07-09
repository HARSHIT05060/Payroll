import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Calendar,
  IndianRupee,
  Search,
  RefreshCw,
  XCircle,
  FileText,
  Mail,
  CreditCard,
  ChevronDown,
  CheckCircle,
  ArrowLeft,
  Clock,
  TrendingUp,
  Edit,
  Save,
  X,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmDialog } from '../../Components/ui/ConfirmDialog';

const MonthlyPayroll = () => {
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // New states for editing and notifications
  const [isEditingPayable, setIsEditingPayable] = useState(false);
  const [editablePayable, setEditablePayable] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  // Toast functions
  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Constants
  const months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' },
    { value: '03', label: 'March' }, { value: '04', label: 'April' },
    { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' },
    { value: '09', label: 'September' }, { value: '10', label: 'October' },
    { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Fetch employees data
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.user_id) {
        throw new Error('User ID is required');
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);

      const response = await api.post('assign_shift_list_drop_down', formData);

      if (response.data?.success) {
        setEmployees(response.data.data?.employee_list || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch employees');
      }

    } catch (error) {
      console.error("Fetch employees error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
        showToast("Your session has expired. Please login again.", 'error');
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        setError("You don't have permission to access payroll data.");
        showToast("You don't have permission to access payroll data.", 'error');
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
        showToast("Server error. Please try again later.", 'error');
      } else {
        setError(errorMessage);
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

  // Generate payroll data
  const handleGeneratePayroll = useCallback(async () => {
    if (!selectedEmployee || !selectedMonth || !selectedYear) {
      const message = 'Please select employee, month, and year';
      setError(message);
      showToast(message, 'error');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('employee_id', selectedEmployee);
      formData.append('month_year', `${selectedYear}-${selectedMonth}`);

      const response = await api.post('employee_wise_search_salary', formData);

      if (response.data?.success) {
        setPayrollData(response.data.data);
        setEditablePayable(response.data.data.pay_salary || '0');
        showToast('Payroll data generated successfully', 'success');
      } else {
        throw new Error(response.data?.message || 'Failed to fetch payroll data');
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load payroll data';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setPayrollData(null);
    } finally {
      setSubmitting(false);
    }
  }, [selectedEmployee, selectedMonth, selectedYear, user]);

  // Handle edit payable amount
  const handleEditPayable = () => {
    setIsEditingPayable(true);
    setEditablePayable(payrollData.pay_salary || '0');
  };

  const handleSavePayable = () => {
    const amount = parseFloat(editablePayable);
    if (isNaN(amount) || amount < 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setPayrollData(prev => ({
      ...prev,
      pay_salary: editablePayable
    }));
    setIsEditingPayable(false);
    showToast('Payable amount updated successfully', 'success');
  };

  const handleCancelEdit = () => {
    setIsEditingPayable(false);
    setEditablePayable(payrollData.pay_salary || '0');
  };

  // Handle submit payroll
  const handleSubmitPayroll = () => {
    if (!payrollData) {
      showToast('No payroll data to submit', 'error');
      return;
    }

    const selectedEmployeeName = employees.find(emp => emp.employee_id === selectedEmployee)?.full_name || 'Unknown Employee';
    const monthName = months.find(m => m.value === selectedMonth)?.label || selectedMonth;

    setConfirmModal({
      isOpen: true,
      type: 'submit',
      data: {
        employeeName: selectedEmployeeName,
        month: monthName,
        year: selectedYear,
        amount: editablePayable
      }
    });
  };

  const confirmSubmitPayroll = async () => {
    try {
      setSubmitting(true);
      setConfirmModal({ isOpen: false, type: '', data: null });

      const formData = new FormData();

      // Required parameters for add_monthly_employee_salary API
      formData.append('employee_id', selectedEmployee);
      formData.append('user_id', user.user_id);
      formData.append('month_year', `${selectedYear}-${selectedMonth}`);
      formData.append('total_salary', payrollData.total_salary || '0');
      formData.append('week_of_salary', payrollData.week_of_salary || '0');
      formData.append('overtime_salary', payrollData.overtime_salary || '0');
      formData.append('pay_salary', payrollData.pay_salary || '0');
      formData.append('total_pay_salary', editablePayable);
      formData.append('main_attendance_arr', JSON.stringify(payrollData.main_attendance_arr || []));

      const response = await api.post('add_monthly_employee_salary', formData);

      if (response.data?.success) {
        showToast('Payroll submitted successfully', 'success');

        // Reset form after successful submission
        setPayrollData(null);
        setSelectedEmployee('');
        setSearchTerm('');
        setEditablePayable('');
        setIsEditingPayable(false);
      } else {
        throw new Error(response.data?.message || 'Failed to submit payroll');
      }

    } catch (error) {
      console.error('Error submitting payroll:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit payroll';

      if (error.response?.status === 401) {
        showToast("Your session has expired. Please login again.", 'error');
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        showToast("You don't have permission to submit payroll.", 'error');
      } else if (error.response?.status >= 500) {
        showToast("Server error. Please try again later.", 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setConfirmModal({ isOpen: false, type: '', data: null });
  };

  // Filter employees based on search term
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee =>
      employee.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Handle employee selection
  const handleEmployeeSelect = useCallback((employee) => {
    setSelectedEmployee(employee.employee_id);
    setSearchTerm(employee.full_name);
    setIsDropdownOpen(false);
    setPayrollData(null);
    setError(null);
    setIsEditingPayable(false);
    setEditablePayable('');
  }, []);

  // Get status badge color
  const getStatusBadgeColor = useCallback((statusId) => {
    switch (statusId) {
      case '3': return 'bg-green-100 text-green-800';
      case '2': return 'bg-yellow-100 text-yellow-800';
      case '1': return 'bg-[var(--color-error-light)] text-red-800';
      default: return 'bg-[var(--color-bg-gradient-start)] text-gray-800';
    }
  }, []);

  // Calculate overtime and week-off separately
  const calculateOvertimeAndWeekoffSummary = useCallback(() => {
    if (!payrollData?.main_attendance_arr) return {
      totalOvertime: 0,
      overtimePay: 0,
      weekoffPay: 0,
      totalOvertimeAndWeekoff: 0
    };

    let totalOvertime = 0;
    let overtimePay = parseFloat(payrollData.overtime_salary || 0);
    let weekoffPay = parseFloat(payrollData.week_of_salary || 0) - overtimePay;

    // If week_of_salary doesn't include overtime_salary separately, use the combined value
    if (!payrollData.overtime_salary) {
      // Calculate overtime pay based on attendance data
      let calculatedOvertimePay = 0;
      payrollData.main_attendance_arr.forEach(shiftData => {
        shiftData.attendance_arr?.forEach(attendance => {
          const overtime = parseFloat(attendance.overtime || 0);
          const hourlyRate = parseFloat(attendance.hourly_salary_for_day || 0);
          totalOvertime += overtime;
          calculatedOvertimePay += overtime * hourlyRate;
        });
      });

      overtimePay = calculatedOvertimePay;
      weekoffPay = parseFloat(payrollData.week_of_salary || 0) - overtimePay;
    } else {
      // Calculate total overtime hours from attendance
      payrollData.main_attendance_arr.forEach(shiftData => {
        shiftData.attendance_arr?.forEach(attendance => {
          const overtime = parseFloat(attendance.overtime || 0);
          totalOvertime += overtime;
        });
      });
    }

    const totalOvertimeAndWeekoff = overtimePay + weekoffPay;

    return {
      totalOvertime: Math.max(0, totalOvertime),
      overtimePay: Math.max(0, overtimePay),
      weekoffPay: Math.max(0, weekoffPay),
      totalOvertimeAndWeekoff: Math.max(0, totalOvertimeAndWeekoff)
    };
  }, [payrollData]);

  // Initialize component
  useEffect(() => {
    if (isAuthenticated() && user?.user_id) {
      fetchEmployees();

      // Set default month and year to current
      const now = new Date();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear.toString());
    }
  }, [isAuthenticated, fetchEmployees, user?.user_id, currentYear]);

  // Clear error when selections change
  useEffect(() => {
    if (error && (selectedEmployee || selectedMonth || selectedYear)) {
      setError(null);
    }
  }, [selectedEmployee, selectedMonth, selectedYear, error]);

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const overtimeAndWeekoffSummary = calculateOvertimeAndWeekoffSummary();

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                      Monthly Payroll
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
            {/* Header section */}
            <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                <h3 className="text-lg font-medium text-[var(--color-text-white)]">Payroll Generation</h3>
              </div>
            </div>

            {/* Filter Section */}
            <div className="p-6 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Employee Search Dropdown */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Select Employee
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search employee by name or ID..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                        if (!e.target.value) {
                          setSelectedEmployee('');
                          setPayrollData(null);
                          setIsEditingPayable(false);
                          setEditablePayable('');
                        }
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)]"
                      disabled={loading}
                    />

                    {isDropdownOpen && filteredEmployees.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto mt-1">
                        {filteredEmployees.map((employee) => (
                          <div
                            key={employee.employee_id}
                            className="p-3 hover:bg-[var(--color-bg-primary)] cursor-pointer border-b border-[var(--color-border-primary)] last:border-b-0"
                            onClick={() => handleEmployeeSelect(employee)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-[var(--color-text-primary)]">{employee.full_name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isDropdownOpen && searchTerm && filteredEmployees.length === 0 && (
                      <div className="absolute top-full left-0 right-0 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg z-50 mt-1">
                        <div className="p-3 text-[var(--color-text-secondary)] text-center">No employees found</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Month Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Select Month
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value);
                      setPayrollData(null);
                      setIsEditingPayable(false);
                      setEditablePayable('');
                    }}
                    className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)]"
                    disabled={loading}
                  >
                    <option value="">Choose Month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Selection */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Select Year
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => {
                      setSelectedYear(e.target.value);
                      setPayrollData(null);
                      setIsEditingPayable(false);
                      setEditablePayable('');
                    }}
                    className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)]"
                    disabled={loading}
                  >
                    <option value="">Choose Year</option>
                    {years.map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGeneratePayroll}
                  disabled={submitting || !selectedEmployee || !selectedMonth || !selectedYear}
                  className="px-6 py-2 bg-[var(--color-blue-dark)] hover:bg-[var(--color-blue-darker)] disabled:bg-gray-400 text-[var(--color-text-white)] rounded-lg transition-colors flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4" />
                  {submitting ? 'Generating...' : 'Generate Payroll'}
                </button>
              </div>
            </div>

            {/* Content section */}
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-flex items-center space-x-2 text-[var(--color-text-secondary)]">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Loading employees...</span>
                </div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-6">
                  <XCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
                  <p className="text-[var(--color-error-dark)] text-lg font-medium mb-2">Error Loading Data</p>
                  <p className="text-[var(--color-text-error)] mb-4">{error}</p>
                  <button
                    onClick={fetchEmployees}
                    className="inline-flex items-center space-x-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-md hover:bg-[var(--color-error-lighter)] transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : employees.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-8">
                  <div className="w-16 h-16 bg-[var(--color-bg-gray-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No Employees Found</p>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    No employees available for payroll generation. Please add employees first.
                  </p>
                </div>
              </div>
            ) : payrollData ? (
              <div className="p-6">
                {/* Salary Summary Cards - Separated Overtime and Week-off */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Base Salary */}
                  <div className="bg-[var(--color-blue-lightest)] rounded-lg p-4 border border-[var(--color-blue-light)]">
                    <div className="flex items-center">
                      <div className="p-2 bg-[var(--color-blue-lighter)] rounded-lg">
                        <IndianRupee className="w-5 h-5 text-[var(--color-blue-dark)]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-blue-dark)]">Base Salary</p>
                        <p className="text-lg font-bold text-[var(--color-blue-darkest)]">₹{parseFloat(payrollData.total_salary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overtime Pay */}
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-orange-600">Overtime Pay</p>
                        <p className="text-lg font-bold text-orange-900">₹{overtimeAndWeekoffSummary.overtimePay.toLocaleString()}</p>
                        <p className="text-xs text-orange-600">{overtimeAndWeekoffSummary.totalOvertime}h overtime</p>
                      </div>
                    </div>
                  </div>

                  {/* Week-off Pay */}
                  <div className="bg-[var(--color-success-light)] rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-[var(--color-success-dark)]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-success-dark)]">Week-off Pay</p>
                        <p className="text-lg font-bold text-[var(--color-success-dark)]">₹{overtimeAndWeekoffSummary.weekoffPay.toLocaleString()}</p>
                        <p className="text-xs text-[var(--color-success-dark)]">Holiday compensation</p>
                      </div>
                    </div>
                  </div>

                  {/* Original Total (Non-editable) */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-[var(--color-blue-dark)]" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-[var(--color-blue-dark)]">Original Total</p>
                        <p className="text-lg font-bold text-purple-900">₹{parseFloat(payrollData.pay_salary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payroll Data Display */}
                <div className="space-y-6">
                  {payrollData.main_attendance_arr?.map((shiftData, index) => (
                    <div key={index} className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm border border-[var(--color-border-primary)]">
                      {/* Shift Header */}
                      <div className="p-6 border-b border-[var(--color-border-primary)] bg-[var(--color-blue-lightest)]">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">{shiftData.shift_name} Shift</h3>
                            <p className="text-[var(--color-text-secondary)]">Working Days: {shiftData.total_working_days}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-[var(--color-text-secondary)]">Shift Total Salary</p>
                            <p className="text-lg font-bold text-[var(--color-blue-dark)]">₹{parseFloat(shiftData.total_salary || 0).toLocaleString()}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">Shift Overtime: ₹{parseFloat(shiftData.shift_overtime_salary || shiftData.overtime_total_salary || 0).toLocaleString()}</p>
                            <p className="text-sm text-[var(--color-text-secondary)]">Shift Week-off: ₹{(parseFloat(shiftData.shift_week_of_salary || 0) - parseFloat(shiftData.shift_overtime_salary || shiftData.overtime_total_salary || 0)).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[var(--color-bg-primary)]">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Hours</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Overtime</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Hourly Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Daily Salary</th>
                            </tr>
                          </thead>
                          <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                            {shiftData.attendance_arr?.map((attendance, attendanceIndex) => (
                              <tr key={attendanceIndex} className="hover:bg-[var(--color-bg-primary)]">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                  {new Date(attendance.attendance_date).toLocaleDateString('en-GB')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(attendance.status_id)}`}>
                                    {attendance.status_name}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                  {attendance.actual_hours}h
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                  {attendance.overtime || 0}h
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                  ₹{parseFloat(attendance.hourly_salary_for_day || 0).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                  ₹{parseFloat(attendance.daily_salary || 0).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payable Amount Section */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-[var(--color-blue-light)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-blue-darkest)] mb-2">Total Payable Amount</h3>
                      <div className="flex items-center gap-4">
                        {isEditingPayable ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={editablePayable}
                              onChange={(e) => setEditablePayable(e.target.value)}
                              className="px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] w-32"
                              min="0"
                              step="0.01"
                            />
                            <button
                              onClick={handleSavePayable}
                              className="p-2 bg-[var(--color-success-medium)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-success-dark)] transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-gray-600 text-[var(--color-text-white)] rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[var(--color-blue-darkest)]">₹{parseFloat(editablePayable || payrollData.pay_salary || 0).toLocaleString()}</span>
                            <button
                              onClick={handleEditPayable}
                              className="p-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={handleSubmitPayroll}
                        disabled={submitting || isEditingPayable}
                        className="px-6 py-3 bg-[var(--color-success-medium)] hover:bg-[var(--color-success-dark)] disabled:bg-gray-400 text-[var(--color-text-white)] rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <CheckCircle className="w-5 h-5" />
                        {submitting ? 'Submitting...' : 'Submit Payroll'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-8">
                  <div className="w-16 h-16 bg-[var(--color-bg-gray-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No Payroll Data</p>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Select employee, month, and year to generate payroll data.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <ConfirmDialog
          isOpen={confirmModal.isOpen}
          onClose={closeModal}
          onConfirm={confirmSubmitPayroll}
          title="Confirm Payroll Submission"
          message={`Are you sure you want to submit payroll for ${confirmModal.data?.employeeName} for ${confirmModal.data?.month} ${confirmModal.data?.year}? The payable amount is ₹${parseFloat(confirmModal.data?.amount || 0).toLocaleString()}.`}
          confirmText="Submit Payroll"
          cancelText="Cancel"
          type="warning"
        />
      )}
    </>
  );
};

export default MonthlyPayroll;