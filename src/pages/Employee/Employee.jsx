import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Pencil,
    ChevronDown,
    ChevronUp,
    Users,
    Plus,
    Search,
    ArrowLeft,
    RefreshCw,
    XCircle,
    Eye
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import Pagination from '../../Components/Pagination'; // Adjust path as needed

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    ID: 'id',
    NAME: 'name',
    DEPARTMENT: 'department',
    DESIGNATION: 'designation'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.ID]: 'employee_code',
    [COLUMN_KEYS.NAME]: 'full_name',
    [COLUMN_KEYS.DEPARTMENT]: 'department_name',
    [COLUMN_KEYS.DESIGNATION]: 'designation_name'
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
            return <ChevronDown className="ml-1 h-4 w-4 text-[var(--color-text-muted)]" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-[var(--color-blue)]" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-[var(--color-blue)]" />;
    }, [sortConfig]);

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
                                        className="w-full pl-10 pr-10 py-2 border border-[var(--color-border-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-text-white)] focus:border-[var(--color-border-primary)] text-sm"
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
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-[var(--color-border-divider)]">
                                    <thead className="bg-[var(--color-blue-lightest)]">
                                        <tr>
                                            {[
                                                { key: COLUMN_KEYS.ID, label: 'Employee ID' },
                                                { key: COLUMN_KEYS.NAME, label: 'Full Name' },
                                                { key: COLUMN_KEYS.DEPARTMENT, label: 'Department' },
                                                { key: COLUMN_KEYS.DESIGNATION, label: 'Designation' }
                                            ].map(({ key, label }) => (
                                                <th key={`header-${key}`} className="px-6 py-3 text-left">
                                                    <button
                                                        className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)]"
                                                        onClick={() => requestSort(key)}
                                                    >
                                                        {label}
                                                        {renderSortIcon(key)}
                                                    </button>
                                                </th>
                                            ))}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Mobile
                                            </th>
                                            {(permissions?.employee_edit || permissions?.employee_view) && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                                        {sortedEmployees.map((employee, index) => {
                                            const employeeId = employee.employee_id || `employee-${index}`;
                                            return (
                                                <tr
                                                    key={`emp-${employeeId}`}
                                                    className={`hover:bg-[var(--color-bg-primary)] transition-colors ${(paginationLoading || searchLoading) ? 'opacity-50' : ''}`}
                                                >
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                        {employee.employee_code || '-'}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center">
                                                                <Users className="w-4 h-4 text-[var(--color-blue-dark)]" />
                                                            </div>
                                                            <span>{employee.full_name || 'Unnamed Employee'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {employee.department_name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {employee.designation_name || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {employee.email || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {employee.mobile_number || 'N/A'}
                                                    </td>
                                                    {(permissions?.employee_edit || permissions?.employee_view) && (
                                                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex space-x-2">
                                                                {permissions['employee_edit'] && (
                                                                    <button
                                                                        onClick={() => handleEditEmployee(employee.employee_id)}
                                                                        disabled={paginationLoading || searchLoading}
                                                                        className="p-2 rounded-md transition-colors text-[var(--color-blue-dark)] hover:text-[var(--color-blue-darkest)] hover:bg-[var(--color-blue-lightest)] disabled:opacity-50"
                                                                        title="Edit Employee"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </button>
                                                                )}
                                                                {permissions['employee_view'] && (
                                                                    <button
                                                                        onClick={() => handleViewDetails(employee.employee_id)}
                                                                        disabled={paginationLoading || searchLoading}
                                                                        className="p-2 rounded-md transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)] disabled:opacity-50"
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