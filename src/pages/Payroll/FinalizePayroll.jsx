import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  IndianRupee,
  FileText,
  ChevronDown,
  ChevronUp,
  XCircle,
  Users,
  Calendar,
  RefreshCw,
  Search
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';

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
  TOTAL_PAY_SALARY: 'total_pay_salary'
};

export default function FinalizePayroll() {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

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

  // const navigate = useNavigate();
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
        setError("Your session has expired. Please login again.");
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        setError("You don't have permission to view salary records.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout]);

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
      console.log(error)
      return monthYear;
    }
  };

  // Action handlers
  // const handleViewDetails = useCallback((salary_id) => {
  //   navigate(`/payroll/details/${salary_id}`);
  // }, [navigate]);

  // Render sort icon
  const renderSortIcon = useCallback((key) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
      <ChevronUp className="ml-1 h-4 w-4 text-blue-500" /> :
      <ChevronDown className="ml-1 h-4 w-4 text-blue-500" />;
  }, [sortConfig]);

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finalize Payroll</h2>
          </div>
        </div>

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
                      { key: COLUMN_KEYS.EMPLOYEE_CODE, label: 'Employee Code' },
                      { key: COLUMN_KEYS.FULL_NAME, label: 'Full Name' },
                      { key: COLUMN_KEYS.DEPARTMENT, label: 'Department' },
                      { key: COLUMN_KEYS.MONTH_YEAR, label: 'Month/Year' },
                      { key: COLUMN_KEYS.TOTAL_SALARY, label: 'Base Salary' },
                      { key: COLUMN_KEYS.FINAL_SALARY, label: 'Final Salary' },
                      { key: COLUMN_KEYS.TOTAL_PAY_SALARY, label: 'Total Pay' }
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
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {!sortedRecords || sortedRecords.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                        <IndianRupee className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No records found</p>
                        <p className="text-sm">Try adjusting your filters or search criteria</p>
                      </td>
                    </tr>
                  ) : (
                    sortedRecords.map((record, index) => {
                      const recordId = record.employee_salary_id || `record-${index}`;
                      return (
                        <tr
                          key={`salary-${recordId}`}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.employee_code || '-'}
                          </td>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(record.final_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                            {formatCurrency(record.total_pay_salary)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {record.mobile_number || 'N/A'}
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(record.employee_salary_id)}
                              className="p-2 rounded-md transition-colors text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                              title="View Details"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </div>
                        </td> */}
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
    </div>
  );
}