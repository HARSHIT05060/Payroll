import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Edit,
    ChevronDown,
    ChevronUp,
    Users,
    Plus,
    Search,
    ArrowLeft,
    RefreshCw,
    XCircle,
    Eye,
    Smartphone,
    Fingerprint
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import Pagination from '../../Components/Pagination'; // Adjust path as needed
import LoadingSpinner from '../../Components/Loader/LoadingSpinner';

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    ID: 'id',
    NAME: 'name',
    DEPARTMENT: 'department',
    DESIGNATION: 'designation',
    ATTENDANCE_TYPE: 'attendance_type'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.ID]: 'employee_code',
    [COLUMN_KEYS.NAME]: 'full_name',
    [COLUMN_KEYS.DEPARTMENT]: 'department_name',
    [COLUMN_KEYS.DESIGNATION]: 'designation_name',
    [COLUMN_KEYS.ATTENDANCE_TYPE]: 'attendance_type'
};

const ATTENDANCE_TYPES = {
    MOBILE: 1,
    BIOMETRIC: 2
};

const ITEMS_PER_PAGE = 10;

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: SORT_DIRECTIONS.ASCENDING
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    // Attendance type change loading state
    const [attendanceChangingIds, setAttendanceChangingIds] = useState(new Set());

    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const permissions = useSelector(state => state.permissions) || {};

    // Fetch employees data with pagination and search
    const fetchEmployees = useCallback(async (page = 1, search = '', resetData = false) => {
        try {
            if (resetData) {
                setLoading(true);
                setCurrentPage(1);
                page = 1;
            } else if (search !== searchQuery) {
                setSearchLoading(true);
            } else {
                setPaginationLoading(true);
            }

            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('page', page.toString());

            // Add search parameter if search query exists
            if (search && search.trim() !== '') {
                formData.append('search', search.trim());
            }

            const response = await api.post('employee_list', formData);

            if (response.data?.success && response.data.data) {
                const newEmployees = response.data.data;
                setEmployees(newEmployees);

                // Calculate total pages based on response
                const itemsCount = newEmployees.length;
                if (itemsCount < ITEMS_PER_PAGE && page === 1) {
                    // If we get less than 10 items on first page, that's all we have
                    setTotalPages(1);
                    setTotalEmployees(itemsCount);
                } else if (itemsCount < ITEMS_PER_PAGE && page > 1) {
                    // If we get less than 10 items on subsequent pages, this is the last page
                    setTotalPages(page);
                    setTotalEmployees((page - 1) * ITEMS_PER_PAGE + itemsCount);
                } else {
                    // If we get exactly 10 items, there might be more pages
                    setTotalPages(page + 1); // We'll update this when we hit the last page
                    setTotalEmployees(page * ITEMS_PER_PAGE);
                }

                setCurrentPage(page);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch employees');
            }

        } catch (error) {
            console.error("Fetch employees error:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
                setTimeout(() => logout?.(), 2000);
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view employees.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
            setPaginationLoading(false);
            setSearchLoading(false);
        }
    }, [user, logout, searchQuery]);

    // Handle attendance type change
    const handleAttendanceTypeChange = useCallback(async (employeeId, newAttendanceType) => {
        try {
            setAttendanceChangingIds(prev => new Set(prev.add(employeeId)));

            const formData = new FormData();
            formData.append('employee_id', employeeId.toString());
            formData.append('attendance_type', newAttendanceType.toString());

            const response = await api.post('attendance_type_change', formData);

            if (response.data?.success) {
                // Update the employee's attendance type in local state
                setEmployees(prevEmployees =>
                    prevEmployees.map(emp =>
                        emp.employee_id === employeeId
                            ? { ...emp, attendance_type: newAttendanceType.toString() }
                            : emp
                    )
                );
            } else {
                throw new Error(response.data?.message || 'Failed to update attendance type');
            }

        } catch (error) {
            console.error("Attendance type change error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update attendance type";
            alert(errorMessage); // You might want to use a better notification system
        } finally {
            setAttendanceChangingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(employeeId);
                return newSet;
            });
        }
    }, []);

    // Debounced search functionality
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            // Reset to page 1 when searching
            if (searchQuery !== '') {
                setCurrentPage(1);
                fetchEmployees(1, searchQuery);
            } else {
                // If search is cleared, fetch all employees from page 1
                setCurrentPage(1);
                fetchEmployees(1, '');
            }
        }, 500); // Increased debounce time for API calls

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Initial load
    useEffect(() => {
        if (isAuthenticated() && user?.user_id) {
            fetchEmployees(1, '', true);
        }
    }, [isAuthenticated, user?.user_id]);

    // Client-side sorting (works on current page data)
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
                ? SORT_DIRECTIONS.DESCENDING
                : SORT_DIRECTIONS.ASCENDING;
            return { key, direction };
        });
    }, []);

    // Memoized sorted employees (client-side sorting of current page results)
    const sortedEmployees = useMemo(() => {
        if (!sortConfig.key) return employees;

        return [...employees].sort((a, b) => {
            const actualKey = KEY_MAPPING[sortConfig.key] || sortConfig.key;
            const aValue = a[actualKey] || '';
            const bValue = b[actualKey] || '';

            if (aValue < bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
            }
            return 0;
        });
    }, [employees, sortConfig]);

    // Pagination handler
    const handlePageChange = useCallback((newPage) => {
        if (newPage >= 1 && newPage <= totalPages && !paginationLoading && !searchLoading) {
            fetchEmployees(newPage, searchQuery);
        }
    }, [totalPages, paginationLoading, searchLoading, fetchEmployees, searchQuery]);

    // Action handlers
    const handleViewDetails = useCallback((employee_id) => {
        navigate(`/employee/details/${employee_id}`);
    }, [navigate]);

    const handleEditEmployee = useCallback((employee_id) => {
        navigate(`/add-employee?edit=${employee_id}`);
    }, [navigate]);

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    // Render sort icon
    const renderSortIcon = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4 text-white/70" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-white" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-white" />;
    }, [sortConfig]);

    // Render attendance type display - UPDATED TO SHOW ONLY ACTIVE TYPE
    const renderAttendanceTypeDisplay = useCallback((employee) => {
        const employeeId = employee.employee_id;
        const currentType = parseInt(employee.attendance_type);
        const isChanging = attendanceChangingIds.has(employeeId);
        const isMobile = currentType === ATTENDANCE_TYPES.MOBILE;
        const isBiometric = currentType === ATTENDANCE_TYPES.BIOMETRIC;

        // Check if user has permission to change attendance type
        const hasPermission = permissions['attendance_type_change'];

        if (!hasPermission) {
            // Read-only display - show only active type
            return (
                <div className="flex items-center justify-center">
                    {isMobile ? (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-[var(--color-blue-lightest)] rounded-full">
                            <Smartphone className="w-4 h-4 text-[var(--color-blue)]" />
                            <span className="text-sm text-[var(--color-text-blue)] font-medium">Mobile</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 px-3 py-1 bg-[var(--color-success-light)] rounded-full">
                            <Fingerprint className="w-4 h-4 text-[var(--color-success)]" />
                            <span className="text-sm text-[var(--color-text-success)] font-medium">Biometric</span>
                        </div>
                    )}
                </div>
            );
        }

        // Interactive toggle for users with permission
        return (
            <div className="flex items-center justify-center relative">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id={`toggle-${employeeId}`}
                        checked={isBiometric}
                        onChange={(e) => {
                            if (!isChanging) {
                                const newType = e.target.checked ? ATTENDANCE_TYPES.BIOMETRIC : ATTENDANCE_TYPES.MOBILE;
                                handleAttendanceTypeChange(employeeId, newType);
                            }
                        }}
                        disabled={isChanging || paginationLoading || searchLoading}
                        className="sr-only"
                    />
                    <label
                        htmlFor={`toggle-${employeeId}`}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-offset-2 ${isBiometric
                                ? 'bg-[var(--color-success)] focus-within:ring-[var(--color-success)]'
                                : 'bg-[var(--color-blue)] focus-within:ring-[var(--color-blue)]'
                            } ${isChanging || paginationLoading || searchLoading
                                ? 'opacity-50 cursor-not-allowed'
                                : 'cursor-pointer hover:shadow-md'
                            }`}
                    >
                        {/* Toggle Circle with Icon */}
                        <span
                            className={`inline-block h-6 w-6 rounded-full bg-[var(--color-bg-secondary)] shadow-lg transform transition-all duration-300 ease-in-out flex items-center justify-center ${isBiometric ? 'translate-x-7' : 'translate-x-0.5'
                                }`}
                        >
                            {isBiometric ? (
                                <Fingerprint className="w-3.5 h-3.5 text-[var(--color-success)]" />
                            ) : (
                                <Smartphone className="w-3.5 h-3.5 text-[var(--color-blue)]" />
                            )}
                        </span>
                    </label>

                    {/* Active Type Label */}
                    <div className="ml-3 flex items-center">
                        <span className={`text-sm font-medium ${isBiometric ? 'text-[var(--color-text-success)]' : 'text-[var(--color-text-blue)]'
                            }`}>
                            {isBiometric ? 'Biometric' : 'Mobile'}
                        </span>
                    </div>
                </div>

                {/* Loading overlay */}
                {isChanging && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-secondary)]/80 rounded-lg">
                        <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-blue-dark)]" />
                    </div>
                )}
            </div>
        );
    }, [attendanceChangingIds, permissions, handleAttendanceTypeChange, paginationLoading, searchLoading]);

    // Function to truncate text with ellipsis
    const truncateText = useCallback((text, maxLength = 12) => {
        if (!text) return 'Unnamed Employee';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }, []);

    // Redirect if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto ">
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
                                        Employee Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
                    {/* Header section */}
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Users className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                    All Employee List
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 border border-[var(--color-border-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-text-white)] focus:border-[var(--color-border-primary)] text-sm text-[var(--color-text-primary)]"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
                                    {searchQuery && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {permissions['employee_create'] && (
                                    <button
                                        onClick={() => navigate('/add-employee')}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Employee
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    {loading ? (
                        <div>
                            <LoadingSpinner />
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-6">
                                <XCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
                                <p className="text-[var(--color-error-dark)] text-lg font-medium mb-2">Error Loading Employees</p>
                                <p className="text-[var(--color-text-error)] mb-4">{error}</p>
                                <button
                                    onClick={() => fetchEmployees(currentPage, searchQuery)}
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
                                <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">
                                    {searchQuery ? 'No employees found' : 'No Employees Found'}
                                </p>
                                <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                                    {searchQuery
                                        ? `No employees match your search "${searchQuery}". Try different search terms.`
                                        : currentPage > 1
                                            ? 'No employees found on this page.'
                                            : 'You haven\'t added any employees yet.'
                                    }
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="inline-flex items-center space-x-2 bg-[var(--color-bg-gradient-start)] text-[var(--color-text-secondary)] px-4 py-2 rounded-md hover:bg-[var(--color-bg-gray-light)] transition-colors mr-2"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span>Clear Search</span>
                                    </button>
                                )}
                                {permissions['employee_create'] && !searchQuery && currentPage === 1 && (
                                    <button
                                        onClick={() => navigate('/add-employee')}
                                        className="inline-flex items-center space-x-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] px-4 py-2 rounded-md hover:bg-[var(--color-blue-darker)] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create First Employee</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)]">
                                        <tr>
                                            {[
                                                { key: COLUMN_KEYS.ID, label: 'Employee ID', width: 'w-[10%]' },
                                                { key: COLUMN_KEYS.NAME, label: 'Full Name', width: 'w-[15%]' },
                                                { key: COLUMN_KEYS.DEPARTMENT, label: 'Department', width: 'w-[10%]' },
                                                { key: COLUMN_KEYS.DESIGNATION, label: 'Designation', width: 'w-[10%]' },
                                            ].map(({ key, label, width }) => (
                                                <th key={`header-${key}`} className={`${width} px-3 py-4 text-center`}>
                                                    <button
                                                        className="flex items-center justify-center w-full text-xs font-semibold text-white uppercase tracking-wider hover:text-gray-200 transition-colors"
                                                        onClick={() => requestSort(key)}
                                                    >
                                                        {label}
                                                        {renderSortIcon(key)}
                                                    </button>
                                                </th>
                                            ))}
                                            <th className="w-[20%] px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="w-[12%] px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                                Mobile
                                            </th>
                                            {/* Attendance Permission Column */}
                                            <th className="w-[18%] px-3 py-4 text-center">
                                                <button
                                                    className="flex items-center justify-center w-full text-xs font-semibold text-white uppercase tracking-wider hover:text-gray-200 transition-colors"
                                                    onClick={() => requestSort(COLUMN_KEYS.ATTENDANCE_TYPE)}
                                                >
                                                    Attendance Permission
                                                    {renderSortIcon(COLUMN_KEYS.ATTENDANCE_TYPE)}
                                                </button>
                                            </th>
                                            {(permissions?.employee_edit || permissions?.employee_view) && (
                                                <th className="w-[5%] px-3 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                                        {/* Render actual employee rows */}
                                        {sortedEmployees.map((employee, index) => {
                                            const employeeId = employee.employee_id || `employee-${index}`;
                                            const fullName = employee.full_name || 'Unnamed Employee';
                                            const truncatedName = truncateText(fullName, 12);

                                            return (
                                                <tr
                                                    key={`emp-${employeeId}`}
                                                    className={`h-[60px] hover:bg-[var(--color-blue-lightest)] transition-colors border-b border-[var(--color-border-divider)] ${(paginationLoading || searchLoading) ? 'opacity-50' : ''}`}
                                                >
                                                    <td className="px-3 py-4 text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-[var(--color-text-blue)]">
                                                            {employee.employee_code || '-'}
                                                        </span>
                                                    </td>

                                                    {/* Full Name */}
                                                    <td className="px-3 py-4 text-center">
                                                        <div
                                                            className="text-sm font-medium text-[var(--color-text-primary)] cursor-help truncate max-w-[120px] mx-auto"
                                                            title={fullName}
                                                        >
                                                            {truncatedName}
                                                        </div>
                                                    </td>

                                                    {/* Department */}
                                                    <td className="px-3 py-4 text-center">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-[var(--color-text-success)] max-w-[80px] truncate">
                                                            {employee.department_name || 'N/A'}
                                                        </span>
                                                    </td>

                                                    {/* Designation */}
                                                    <td className="px-3 py-4 text-center">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-[var(--color-text-blue)] max-w-[80px] truncate">
                                                            {employee.designation_name || 'N/A'}
                                                        </span>
                                                    </td>

                                                    {/* Email */}
                                                    <td className="px-3 py-4 text-center">
                                                        <div className="text-sm text-[var(--color-text-secondary)] truncate max-w-[160px] mx-auto" title={employee.email}>
                                                            {employee.email || 'N/A'}
                                                        </div>
                                                    </td>

                                                    {/* Mobile */}
                                                    <td className="px-3 py-4 text-center">
                                                        <div className="text-sm font-mono text-[var(--color-text-primary)]">
                                                            {employee.mobile_number || 'N/A'}
                                                        </div>
                                                    </td>

                                                    {/* Attendance Permission */}
                                                    <td className="px-3 py-4 text-center">
                                                        {renderAttendanceTypeDisplay(employee)}
                                                    </td>

                                                    {/* Actions */}
                                                    {(permissions?.employee_edit || permissions?.employee_view) && (
                                                        <td className="px-3 py-4 text-center">
                                                            <div className="flex justify-center space-x-1">
                                                                {permissions['employee_edit'] && (
                                                                    <button
                                                                        onClick={() => handleEditEmployee(employee.employee_id)}
                                                                        disabled={paginationLoading || searchLoading}
                                                                        className="p-2 rounded-lg transition-all duration-200 text-[var(--color-blue)] hover:text-[var(--color-blue-dark)] hover:bg-[var(--color-blue-lightest)] disabled:opacity-50 transform hover:scale-105"
                                                                        title="Edit Employee"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                {permissions['employee_view'] && (
                                                                    <button
                                                                        onClick={() => handleViewDetails(employee.employee_id)}
                                                                        disabled={paginationLoading || searchLoading}
                                                                        className="p-2 rounded-lg transition-all duration-200 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-gray-light)] disabled:opacity-50 transform hover:scale-105"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}

                                        {/* Fill empty rows to maintain consistent height for 10 rows */}
                                        {Array.from({ length: Math.max(0, ITEMS_PER_PAGE - sortedEmployees.length) }).map((_, index) => (
                                            <tr key={`empty-${index}`} className="h-[60px] border-b border-[var(--color-border-divider)]">
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                <td className="px-3 py-4 text-center">&nbsp;</td>
                                                {(permissions?.employee_edit || permissions?.employee_view) && (
                                                    <td className="px-3 py-4 text-center">&nbsp;</td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Component */}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalEmployees}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={handlePageChange}
                                loading={paginationLoading || searchLoading}
                                showInfo={true}
                                maxVisiblePages={5}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}