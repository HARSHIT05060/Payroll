import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  IndianRupee,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  XCircle,
  Users,
  Calendar,
  RefreshCw,
  Search,
  CreditCard,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';


const SORT_DIRECTIONS = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending'
};

const COLUMN_KEYS = {
  EMPLOYEE_CODE: 'employee_code',
  FULL_NAME: 'full_name',
  DEPARTMENT: 'department_name',
  MONTH_YEAR: 'month_year',
  TOTAL_SALARY: 'total_salary',
  FINAL_SALARY: 'final_salary',
  TOTAL_PAY_SALARY: 'total_pay_salary',
  PAYMENT_STATUS: 'payment_status'
};

const PAYMENT_STATUS = {
  UNPAID: '1',
  PAID: '2'
};

const PAYMENT_MODES = {
  '1': 'Cash',
  '2': 'Bank Transfer',
  '3': 'Check',
  '4': 'Online'
};

export default function FinalizePayroll() {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    payment_mode: '1',
    remark: ''
  });
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);


  // Set default to current month and year
  const currentDate = new Date();
  const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const currentYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: SORT_DIRECTIONS.ASCENDING
  });

  const { user, isAuthenticated, logout } = useAuth();

  // Generate month options
  const monthOptions = [
    { value: '', label: 'All Months' },
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Generate year options (current year and previous 5 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push({
        value: (currentYear - i).toString(),
        label: (currentYear - i).toString()
      });
    }
    return years;
  }, []);


  // Fetch salary records
  const fetchSalaryRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.user_id) {
        throw new Error('User ID is required');
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);

      const response = await api.post('employee_salary_list', formData);

      if (response.data?.success && response.data.data) {
        setSalaryRecords(response.data.data);
      } else if (response.data?.success && response.data.salaries) {
        setSalaryRecords(response.data.salaries);
      } else if (Array.isArray(response.data)) {
        setSalaryRecords(response.data);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch salary records');
      }

    } catch (error) {
      console.error("Fetch salary records error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

      if (error.response?.status === 401) {
        showToast("Your session has expired. Please login again.", 'error');
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        showToast("You don't have permission to view salary records.", 'error');
      } else if (error.response?.status >= 500) {
        showToast("Server error. Please try again later.", 'error');
      } else {
        showToast(errorMessage, 'error');
      }

      setError(errorMessage); // Keep this for the error display in the UI
    } finally {
      setLoading(false);
    }
  }, [user, logout]);
  // Show toast notification
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Hide toast notification
  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  // Handle payment
  const handlePayment = useCallback(async () => {
    if (!selectedRecord || !user?.user_id) return;

    try {
      setPaymentLoading(true);

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('employee_salary_id', selectedRecord.employee_salary_id);
      formData.append('pay_salary', selectedRecord.total_pay_salary);
      formData.append('payment_mode', paymentData.payment_mode);
      formData.append('remark', paymentData.remark);

      const response = await api.post('add_salary_payment', formData);

      if (response.data?.success) {
        // Update the record in the state
        setSalaryRecords(prev =>
          prev.map(record =>
            record.employee_salary_id === selectedRecord.employee_salary_id
              ? {
                ...record,
                payment_status: PAYMENT_STATUS.PAID,
                payment_mode: paymentData.payment_mode,
                payment_remark: paymentData.remark,
                payment_date: new Date().toLocaleDateString('en-IN')
              }
              : record
          )
        );

        setShowPaymentModal(false);
        setSelectedRecord(null);
        setPaymentData({ payment_mode: '1', remark: '' });

        // Show success toast
        showToast('Payment processed successfully!', 'success');
      } else {
        throw new Error(response.data?.message || 'Payment failed');
      }

    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Payment failed";
      showToast(errorMessage, 'error');
    } finally {
      setPaymentLoading(false);
    }
  }, [selectedRecord, user, paymentData, showToast]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!selectedRecord || !user?.user_id) return;

    try {
      setDeleteLoading(true);

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('employee_salary_id', selectedRecord.employee_salary_id);

      const response = await api.post('employee_salary_delete', formData);

      if (response.data?.success) {
        // Remove the record from the state
        setSalaryRecords(prev =>
          prev.filter(record =>
            record.employee_salary_id !== selectedRecord.employee_salary_id
          )
        );

        setShowDeleteModal(false);
        setSelectedRecord(null);

        // Show success toast
        showToast('Salary record deleted successfully!', 'success');
      } else {
        throw new Error(response.data?.message || 'Delete failed');
      }

    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Delete failed";
      showToast(errorMessage, 'error');
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedRecord, user, showToast]);

  // Open payment modal
  const openPaymentModal = useCallback((record) => {
    setSelectedRecord(record);
    setPaymentData({
      payment_mode: '1',
      remark: formatMonthYear(record.month_year)
    });
    setShowPaymentModal(true);
  }, []);

  // Close payment modal
  const closePaymentModal = useCallback(() => {
    setShowPaymentModal(false);
    setSelectedRecord(null);
    setPaymentData({ payment_mode: '1', remark: '' });
  }, []);

  // Open delete modal
  const openDeleteModal = useCallback((record) => {
    setSelectedRecord(record);
    setShowDeleteModal(true);
  }, []);

  // Close delete modal
  const closeDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedRecord(null);
  }, []);

  // Get payment status display
  const getPaymentStatusDisplay = useCallback((status) => {
    if (status === PAYMENT_STATUS.PAID) {
      return {
        text: 'Paid',
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />
      };
    } else {
      return {
        text: 'Unpaid',
        className: 'bg-red-100 text-red-800',
        icon: <AlertCircle className="w-4 h-4" />
      };
    }
  }, []);

  // Filter records based on search, month, and year
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      let filtered = salaryRecords;

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(record => {
          return Object.values(record).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Filter by month and year
      if (selectedMonth || selectedYear) {
        filtered = filtered.filter(record => {
          const recordMonthYear = record.month_year;

          if (!recordMonthYear) return false;

          // Handle different date formats
          let recordMonth, recordYear;

          if (recordMonthYear.includes('-')) {
            const parts = recordMonthYear.split('-');
            recordYear = parts[0];
            recordMonth = parts[1];
          }

          // Apply filters
          const yearMatch = !selectedYear || recordYear === selectedYear;
          const monthMatch = !selectedMonth || recordMonth === selectedMonth.padStart(2, '0');

          return yearMatch && monthMatch;
        });
      }

      setFilteredRecords(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, salaryRecords, selectedMonth, selectedYear]);

  useEffect(() => {
    if (isAuthenticated() && user?.user_id) {
      fetchSalaryRecords();
    }
  }, [isAuthenticated, fetchSalaryRecords, user?.user_id]);

  // Sorting functionality
  const requestSort = useCallback((key) => {
    setSortConfig(prevConfig => {
      const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
        ? SORT_DIRECTIONS.DESCENDING
        : SORT_DIRECTIONS.ASCENDING;
      return { key, direction };
    });
  }, []);

  // Memoized sorted records
  const sortedRecords = useMemo(() => {
    const source = searchQuery || selectedMonth || selectedYear ? filteredRecords : salaryRecords;

    if (!sortConfig.key) return source;

    return [...source].sort((a, b) => {
      const aValue = a[sortConfig.key] || '';
      const bValue = b[sortConfig.key] || '';

      // Handle numeric values
      if (sortConfig.key === COLUMN_KEYS.TOTAL_SALARY ||
        sortConfig.key === COLUMN_KEYS.FINAL_SALARY ||
        sortConfig.key === COLUMN_KEYS.TOTAL_PAY_SALARY) {
        const aNum = parseFloat(aValue) || 0;
        const bNum = parseFloat(bValue) || 0;
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? aNum - bNum : bNum - aNum;
      }

      // Handle string values
      if (aValue < bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
      }
      return 0;
    });
  }, [salaryRecords, filteredRecords, sortConfig, searchQuery, selectedMonth, selectedYear]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseFloat(amount) || 0);
  };

  // Format month year for display
  const formatMonthYear = (monthYear) => {
    if (!monthYear) return 'N/A';

    try {
      const [year, month] = monthYear.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    } catch (error) {
      console.log(error);
      return monthYear;
    }
  };

  // Render sort icon
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
      <ChevronUp className="ml-1 h-4 w-4 text-blue-500" /> :
      <ChevronDown className="ml-1 h-4 w-4 text-blue-500" />;
  }, [sortConfig]);
  // Open view modal
  const openViewModal = useCallback((record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  }, []);

  // Close view modal
  const closeViewModal = useCallback(() => {
    setShowViewModal(false);
    setSelectedRecord(null);
  }, []);

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Finalize Payroll
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
          {/* Header section */}
          <div className="px-6 py-4 border-b border-blue-200 bg-blue-600">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <IndianRupee className="h-6 w-6 text-white mr-2" />
                <h3 className="text-lg font-medium text-white">
                  Employee Salary Records
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Month Filter */}
                {/* Month Filter */}
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  >
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  {/* Add this helpful tooltip */}
                  {(() => {
                    const currentDate = new Date();
                    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                    const currentYear = currentDate.getFullYear().toString();
                    const isCurrentOrFutureMonth = (selectedYear > currentYear) ||
                      (selectedYear === currentYear && selectedMonth >= currentMonth);

                    if (isCurrentOrFutureMonth && selectedMonth && selectedYear && sortedRecords.length === 0) {
                      return (
                        <div className="absolute top-full left-0 mt-1 bg-yellow-100 border border-yellow-300 rounded-md p-2 text-xs text-yellow-800 whitespace-nowrap z-10">
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>No records for current/future month</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
                {/* Year Filter */}
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                  >
                    {yearOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>

                <button
                  onClick={fetchSalaryRecords}
                  className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Content section */}
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center space-x-2 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Loading salary records...</span>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-700 text-lg font-medium mb-2">Error Loading Salary Records</p>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchSalaryRecords}
                  className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            </div>
          ) : salaryRecords.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-700 text-lg font-medium mb-2">No Salary Records Found</p>
                <p className="text-gray-500 text-sm mb-4">
                  No salary records have been generated yet. Generate payroll to see records here.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    {[
                      { key: COLUMN_KEYS.FULL_NAME, label: 'Full Name' },
                      { key: COLUMN_KEYS.DEPARTMENT, label: 'Department' },
                      { key: COLUMN_KEYS.MONTH_YEAR, label: 'Month/Year' },
                      { key: COLUMN_KEYS.TOTAL_SALARY, label: 'Base Salary' },
                      { key: COLUMN_KEYS.TOTAL_PAY_SALARY, label: 'Total Pay' },
                      { key: COLUMN_KEYS.PAYMENT_STATUS, label: 'Payment Status' }
                    ].map(({ key, label }) => (
                      <th key={`header-${key}`} className="px-6 py-3 text-left">
                        <button
                          className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                          onClick={() => requestSort(key)}
                        >
                          {label}
                          {renderSortIcon(key)}
                        </button>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!sortedRecords || sortedRecords.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        <IndianRupee className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        {(() => {
                          const currentDate = new Date();
                          const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                          const currentYear = currentDate.getFullYear().toString();
                          const isCurrentOrFutureMonth = (selectedYear > currentYear) ||
                            (selectedYear === currentYear && selectedMonth >= currentMonth);

                          if (isCurrentOrFutureMonth && selectedMonth && selectedYear) {
                            return (
                              <>
                                <p className="text-lg font-medium">No salary records found for {monthOptions.find(m => m.value === selectedMonth)?.label} {selectedYear}</p>
                                <p className="text-sm mb-4">
                                  {selectedMonth === currentMonth && selectedYear === currentYear
                                    ? "Salary records for the current month haven't been generated yet."
                                    : "Salary records for future months are not available yet."
                                  }
                                </p>
                                <p className="text-sm text-blue-600 font-medium">
                                  Try selecting a previous month to view existing salary records.
                                </p>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <p className="text-lg font-medium">No records found</p>
                                <p className="text-sm">Try adjusting your filters or search criteria</p>
                              </>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  ) : (
                    sortedRecords.map((record, index) => {
                      const recordId = record.employee_salary_id || `record-${index}`;
                      const paymentStatus = getPaymentStatusDisplay(record.payment_status);

                      return (
                        <tr
                          key={`salary-${recordId}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-600" />
                              </div>
                              <span>{record.full_name || 'Unnamed Employee'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {record.department_name || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>{formatMonthYear(record.month_year)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(record.total_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                            {formatCurrency(record.total_pay_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${paymentStatus.className}`}>
                              {paymentStatus.icon}
                              <span>{paymentStatus.text}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {record.mobile_number || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                              {record.payment_status === PAYMENT_STATUS.UNPAID && (
                                <button
                                  onClick={() => openPaymentModal(record)}
                                  className="inline-flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-700 transition-colors"
                                >
                                  <CreditCard className="w-4 h-4" />
                                  <span>Pay</span>
                                </button>
                              )}
                              <button
                                onClick={() => openDeleteModal(record)}
                                className="inline-flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                              </button>
                              <button
                                onClick={() => openViewModal(record)}
                                className="inline-flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Salary Slip Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Salary Slip Details</h3>
              <button
                onClick={closeViewModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">SALARY SLIP</h2>
                <p className="text-gray-600">Pay Period: {formatMonthYear(selectedRecord.month_year)}</p>
              </div>

              {/* Employee Information */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Employee Name:</span>
                      <span className="font-semibold">{selectedRecord.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Employee Code:</span>
                      <span className="font-semibold">{selectedRecord.employee_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Department:</span>
                      <span className="font-semibold">{selectedRecord.department_name}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Mobile Number:</span>
                      <span className="font-semibold">{selectedRecord.mobile_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Pay Period:</span>
                      <span className="font-semibold">{formatMonthYear(selectedRecord.month_year)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Payment Status:</span>
                      <span className={`font-semibold ${selectedRecord.payment_status === PAYMENT_STATUS.PAID ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecord.payment_status === PAYMENT_STATUS.PAID ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="bg-white border border-gray-200 rounded-lg mb-6">
                <h4 className="text-lg font-semibold text-gray-900 p-4 border-b">Salary Breakdown</h4>
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Earnings */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Earnings</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Base Salary:</span>
                          <span className="font-semibold">{formatCurrency(selectedRecord.total_salary)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Allowances:</span>
                          <span className="font-semibold">{formatCurrency(selectedRecord.allowances || 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Overtime:</span>
                          <span className="font-semibold">{formatCurrency(selectedRecord.overtime || 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Bonus:</span>
                          <span className="font-semibold">{formatCurrency(selectedRecord.bonus || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-3">Deductions</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Tax Deduction:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(selectedRecord.tax_deduction || 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">PF Deduction:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(selectedRecord.pf_deduction || 0)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-600">Other Deductions:</span>
                          <span className="font-semibold text-red-600">-{formatCurrency(selectedRecord.other_deductions || 0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Net Pay */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Net Pay:</span>
                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(selectedRecord.total_pay_salary)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {selectedRecord.payment_status === PAYMENT_STATUS.PAID && (
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 mb-4">Payment Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">Payment Mode:</span>
                      <span className="font-semibold text-green-800">{PAYMENT_MODES[selectedRecord.payment_mode] || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700 font-medium">Payment Date:</span>
                      <span className="font-semibold text-green-800">{selectedRecord.payment_date || 'N/A'}</span>
                    </div>
                    {selectedRecord.payment_remark && (
                      <div className="col-span-full">
                        <span className="text-green-700 font-medium">Remark:</span>
                        <p className="font-semibold text-green-800 mt-1">{selectedRecord.payment_remark}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closeViewModal}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                Print Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Process Payment</h3>
              <button
                onClick={closePaymentModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee:</span>
                      <span className="font-medium">{selectedRecord.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Code:</span>
                      <span className="font-medium">{selectedRecord.employee_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{selectedRecord.department_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Month/Year:</span>
                      <span className="font-medium">{formatMonthYear(selectedRecord.month_year)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{selectedRecord.mobile_number}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(selectedRecord.total_pay_salary)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentData.payment_mode}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, payment_mode: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(PAYMENT_MODES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <textarea
                    value={paymentData.remark}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, remark: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Enter payment remark..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closePaymentModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={paymentLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Process Payment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Delete Salary Record</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Are you sure you want to delete this record?
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    This action cannot be undone. The salary record will be permanently removed.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Record Details</h5>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee:</span>
                    <span className="font-medium">{selectedRecord.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee Code:</span>
                    <span className="font-medium">{selectedRecord.employee_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{selectedRecord.department_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Month/Year:</span>
                    <span className="font-medium">{formatMonthYear(selectedRecord.month_year)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pay:</span>
                    <span className="font-medium text-red-600">{formatCurrency(selectedRecord.total_pay_salary)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? (
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  'Delete Record'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}