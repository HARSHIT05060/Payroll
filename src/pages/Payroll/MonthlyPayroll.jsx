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
  AlertCircle,
  Clock,
  TrendingUp,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmationModal } from '../../Components/ui/ConfirmationModal';

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
      case '1': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  // Calculate overtime summary from week_of_salary (which includes both overtime and week off pay)
  const calculateOvertimeSummary = useCallback(() => {
    if (!payrollData?.main_attendance_arr) return { totalOvertime: 0, overtimeAndWeekOffPay: 0 };

    let totalOvertime = 0;
    let overtimeAndWeekOffPay = parseFloat(payrollData.week_of_salary || 0);

    // Calculate total overtime hours from attendance
    payrollData.main_attendance_arr.forEach(shiftData => {
      shiftData.attendance_arr?.forEach(attendance => {
        const overtime = parseFloat(attendance.overtime || 0);
        totalOvertime += overtime;
      });
    });

    return { totalOvertime, overtimeAndWeekOffPay };
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

  const overtimeSummary = calculateOvertimeSummary();

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Monthly Payroll</h2>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
            {/* Header section */}
            <div className="px-6 py-4 border-b border-blue-200 bg-blue-600">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-white mr-2" />
                <h3 className="text-lg font-medium text-white">Payroll Generation</h3>
              </div>
            </div>

            {/* Filter Section */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Employee Search Dropdown */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    />

                    {isDropdownOpen && filteredEmployees.length > 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto mt-1">
                        {filteredEmployees.map((employee) => (
                          <div
                            key={employee.employee_id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleEmployeeSelect(employee)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900">{employee.full_name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isDropdownOpen && searchTerm && filteredEmployees.length === 0 && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                        <div className="p-3 text-gray-500 text-center">No employees found</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Month Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <IndianRupee className="w-4 h-4" />
                  {submitting ? 'Generating...' : 'Generate Payroll'}
                </button>
              </div>
            </div>

            {/* Content section */}
            {loading ? (
              <div className="px-6 py-12 text-center">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Loading employees...</span>
                </div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 text-lg font-medium mb-2">Error Loading Data</p>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchEmployees}
                    className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : employees.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-lg font-medium mb-2">No Employees Found</p>
                  <p className="text-gray-500 text-sm">
                    No employees available for payroll generation. Please add employees first.
                  </p>
                </div>
              </div>
            ) : payrollData ? (
              <div className="p-6">
                {/* Salary Summary Cards - Non-editable */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Base Salary */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">Base Salary</p>
                        <p className="text-lg font-bold text-blue-900">₹{parseFloat(payrollData.total_salary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Overtime & Week Off Pay Combined */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-600">Overtime & Week Off Pay</p>
                        <p className="text-lg font-bold text-green-900">₹{overtimeSummary.overtimeAndWeekOffPay.toLocaleString()}</p>
                        <p className="text-xs text-green-600">{overtimeSummary.totalOvertime}h overtime total</p>
                      </div>
                    </div>
                  </div>

                  {/* Original Total (Non-editable) */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-600">Original Total</p>
                        <p className="text-lg font-bold text-purple-900">₹{parseFloat(payrollData.pay_salary || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payroll Data Display */}
                <div className="space-y-6">
                  {payrollData.main_attendance_arr?.map((shiftData, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      {/* Shift Header */}
                      <div className="p-6 border-b border-gray-200 bg-blue-50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{shiftData.shift_name} Shift</h3>
                            <p className="text-gray-600">Working Days: {shiftData.total_working_days}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Shift Total Salary</p>
                            <p className="text-lg font-bold text-blue-600">₹{parseFloat(shiftData.total_salary || 0).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Shift Overtime & Week Off: ₹{parseFloat(shiftData.shift_week_of_salary || 0).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>

                      {/* Attendance Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Salary</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {shiftData.attendance_arr?.map((attendance, attendanceIndex) => (
                              <tr key={attendanceIndex} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {new Date(attendance.attendance_date).toLocaleDateString('en-GB')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(attendance.status_id)}`}>
                                    {attendance.status_name}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {attendance.actual_hours}h
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {attendance.overtime > 0 ? (
                                    <span className="text-orange-600 font-medium">{attendance.overtime}h</span>
                                  ) : (
                                    <span className="text-gray-400">0h</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ₹{parseFloat(attendance.hourly_salary_for_day).toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  ₹{parseFloat(attendance.daily_salary_for_day).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}

                  {/* Final Total Payable Section - Editable */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Final Payroll Summary</h3>
                        <p className="text-gray-600">Review and adjust the final amount before submission</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-blue-600 mb-2">Total Payable Amount</p>
                        {isEditingPayable ? (
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-gray-900">₹</span>
                              <input
                                type="number"
                                value={editablePayable}
                                onChange={(e) => setEditablePayable(e.target.value)}
                                className="w-32 px-3 py-2 text-lg font-bold border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-blue-500"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={handleSavePayable}
                                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                title="Save Amount"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                title="Cancel Edit"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <p className="text-2xl font-bold text-purple-900">₹{parseFloat(editablePayable || 0).toLocaleString()}</p>
                            <button
                              onClick={handleEditPayable}
                              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                              title="Edit Amount"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Payroll Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSubmitPayroll}
                      disabled={submitting || !payrollData}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2 text-lg font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {submitting ? 'Submitting...' : 'Submit Payroll'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IndianRupee className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 text-lg font-medium mb-2">No Payroll Data</p>
                  <p className="text-gray-500 text-sm">
                    Please select an employee, month, and year, then click "Generate Payroll" to view salary details.
                  </p>
                </div>
              </div>
            )}

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
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
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          onClose={closeModal}
          onConfirm={confirmSubmitPayroll}
          title="Confirm Payroll Submission"
          message={
            <div className="space-y-2">
              <p>Are you sure you want to submit the payroll for:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Employee:</strong> {confirmModal.data?.employeeName}</p>
                <p><strong>Period:</strong> {confirmModal.data?.month} {confirmModal.data?.year}</p>
                <p><strong>Amount:</strong> ₹{parseFloat(confirmModal.data?.amount || 0).toLocaleString()}</p>
              </div>
              <p className="text-sm text-gray-600">This action cannot be undone.</p>
            </div>
          }
          confirmText="Submit Payroll"
          cancelText="Cancel"
          type="warning"
        />
      )}
    </>
  );
};

export default MonthlyPayroll;